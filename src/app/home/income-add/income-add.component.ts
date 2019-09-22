import {Component, OnInit} from '@angular/core';
import {SavingsService} from '../../services/savings.service';
import {Saving} from '../../model/saving';
import {ToasterService} from '../../services/toaster.service';
import {Severity} from '../../model/severity.enum';

@Component({
  selector: 'app-income-add',
  templateUrl: './income-add.component.html',
  styleUrls: ['./income-add.component.scss']
})
export class IncomeAddComponent implements OnInit {

  public incomeAmmount: number;

  public initalSavings: Saving[];
  public repartitionSavings: Saving[];
  public resultSavings: Saving[];

  public addingSavingsRepartition: number[];
  public resultSavingsRepartition: number[];

  constructor(private savingsService: SavingsService, private toasterService: ToasterService) {
    this.initalSavings = [];
  }

  ngOnInit() {
    this.savingsService.listOfSavings.subscribe(res => {

      this.initalSavings = [];
      this.repartitionSavings = null;
      this.resultSavings = null;
      this.initalSavings = this.savingsService.copyListOfSavings(res).filter(saving => {
        return saving.repartition > 0;
      });
      this.incomeAmmount = 1200;
      this.amountchange(this.incomeAmmount);
    });
    this.savingsService.getNotified();
  }

  /**
   * Determine le montant minimum, au vu de la répartition initiale, pour respecter la repartition souhaitee
   */
  private determinateMaxToAchieveBalance(): number {
    let max = 0;
    this.initalSavings.forEach((saving => {
      if (saving.repartition > 0) {
        const localMax = saving.amount / (saving.repartition / 100);
        if (max < localMax) {
          max = localMax;
        }
      }
    }));
    return max;
  }

  /**
   * Determine le montant minimum au regard des supports pour être à l'équilibre
   */
  private computeNewToAchieveBalance(saving: Saving): number {
    return ((saving.repartition) / 100) * this.determinateMaxToAchieveBalance();
  }

  /**
   * Determine le montant manquant par support pour être à l'équilibre
   */
  private computeMissingToAchieveBalance(saving: Saving): number {
    return this.computeNewToAchieveBalance(saving) - saving.amount;
  }

  private computeMissingPercentageToAchieveBalance(saving: Saving, maxToAchieveBalance: number): number {
    return (this.computeMissingToAchieveBalance(saving) / maxToAchieveBalance);
  }

  public addMessage(): void {
    this.toasterService.addMessage('Information', 'Montants calculés', Severity.Info);
  }

  public computeToAdd(savingAmount: number) {
    const maxToAchieveBalance = this.determinateMaxToAchieveBalance();
    let sumOfsSavings = 0;
    this.initalSavings.forEach((saving) => {
      sumOfsSavings += saving.amount;
    });

    if (savingAmount < maxToAchieveBalance - sumOfsSavings) {
      this.computeSavingLessThanNeeded(savingAmount, maxToAchieveBalance);
    } else {
      this.computeSavingMoreThanNeeded(savingAmount);
    }
    this.resultSavings = [];

    for (let i = 0; i < this.initalSavings.length; i++) {
      this.resultSavings.push(new Saving(this.initalSavings[i].name, this.initalSavings[i].amount + this.repartitionSavings[i].amount));
    }

  }

  public computeAmountRepartition(): void {
    let sum = this.computeSumOfSavings(this.repartitionSavings);
    const result = [];
    sum = sum > 0 ? sum : 1;
    if (this.repartitionSavings) {
      this.repartitionSavings.forEach(saving => {
        result.push((saving.amount / sum) * 100);
      });
    }
    this.addingSavingsRepartition = result;
  }

  public computeAmountNewRepartition(): void {
    let sum = this.computeSumOfSavings(this.resultSavings);
    const result = [];
    sum = sum > 0 ? sum : 1;
    if (this.resultSavings) {
      this.resultSavings.forEach(saving => {
        result.push((saving.amount / sum) * 100);
      });
    }
    this.resultSavingsRepartition = result;
  }

  public computeSumOfSavings(savings: Saving[]): number {
    let sum = 0;
    if (savings) {
      savings.forEach((saving: Saving) => {
        sum += saving.amount;
      });
    }
    return sum;
  }


  private computeSavingLessThanNeeded(savingAmount: number, maxToAchieveBalance: number) {
    let sum = 0;
    this.initalSavings.forEach((saving) => {
      sum += this.computeMissingPercentageToAchieveBalance(saving, maxToAchieveBalance);
    });
    const reworkCoef = 100 / sum;
    this.repartitionSavings = [];
    this.initalSavings.forEach((saving) => {
      const amount = this.computeMissingPercentageToAchieveBalance(saving, maxToAchieveBalance) * reworkCoef / 100 * savingAmount;
      this.repartitionSavings.push(new Saving(saving.name, (amount)));
    });
  }

  private computeSavingMoreThanNeeded(savingAmount: number) {
    this.repartitionSavings = [];
    let sumOfsSavings = 0;
    this.initalSavings.forEach((saving) => {
      sumOfsSavings += saving.amount;
    });
    this.initalSavings.forEach((saving) => {
      const amount = ((saving.repartition / 100) * (savingAmount + sumOfsSavings)) - saving.amount;
      this.repartitionSavings.push(new Saving(saving.name, amount));
    });
  }

  public amountchange(amount: number): void {
    this.computeToAdd(amount);
    this.computeAmountRepartition();
    this.computeAmountNewRepartition();
    this.addMessage();
  }

}
