import {Component, OnInit} from '@angular/core';
import {Saving} from '../../model/saving';
import {SavingsService} from '../../services/savings.service';
import {Indicator} from '../../model/indicator';
import {MoneyPipe} from '../../pipes/money.pipe';

@Component({
  selector: 'app-consultation',
  templateUrl: './consultation.component.html',
  styleUrls: ['./consultation.component.scss']
})
export class ConsultationComponent implements OnInit {

  public savings: Saving[];
  public savingsRepartions: number[];
  public indicators: Indicator[];
  public history: any;
  public savingsPerMonth: [];

  constructor(private savingsService: SavingsService, private money: MoneyPipe) {
    this.savings = [];
    this.indicators = [];
    this.savingsPerMonth = [];
    this.buildHistory();
  }

  ngOnInit() {
    this.savingsService.listOfSavings.subscribe(res => {
      this.savings = this.savingsService.copyListOfSavings(res);
      this.computeInitialRepartition();
      this.computeIndicators();
    });
    this.savingsService.getNotified();
  }

  public computeInitialRepartition(): void {
    let sum = this.computeSumOfSavings(true);
    sum = sum > 0 ? sum : 1;

    const result = [];
    this.savings.forEach(saving => {
      result.push((saving.amount / sum) * 100);
    });
    this.savingsRepartions = result;
  }

  public computeIndicators(): void {
    this.indicators = [];
    this.indicators.push(new Indicator('Total', this.money.transform(this.computeSumOfSavings(true))));
    this.indicators.push(new Indicator('Apport pour l\'équilibre', this.money.transform(this.determineMaxToAchieveBalance())));
    this.indicators.push(new Indicator('Moyenne épargnée par mois', this.money.transform(this.determineAverageSaving())));
  }

  private computeSumOfSavings(keepEmptySavings: boolean): number {
    let sum = 0;
    this.savings.filter(saving => {
      return keepEmptySavings ? true : saving.repartition > 0;
    }).forEach(saving => {
      sum += saving.amount;
    });
    return sum;
  }

  private determineMaxToAchieveBalance(): number {
    let max = 0;
    this.savings.forEach((saving => {
      if (saving.repartition > 0) {
        const localMax = saving.amount / (saving.repartition / 100);
        if (max < localMax) {
          max = localMax;
        }
      }
    }));
    return max - this.computeSumOfSavings(false);
  }

  private determineAverageSaving(): number {
    let sum = 0;
    this.savingsPerMonth.forEach(amount => {
      sum += amount;
    });
    return sum / (this.savingsPerMonth.length > 0 ? this.savingsPerMonth.length : 1);
  }


  private buildHistory(): void {
    this.history = {
      labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet'],
      datasets: [
        {
          label: 'Versements',
          data: [0, 1500, 1300, 1200, 1300, 2000, 6700],
          fill: false,
          borderColor: '#FF6384'
        },
        {
          label: 'Epargne',
          data: [0, 1500, 2800, 4000, 5300, 7300, 14000],
          fill: false,
          borderColor: '#36A2EB'
        },
      ]
    };
  }
}
