import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Saving} from '../../model/saving';

@Component({
  selector: 'app-situation',
  templateUrl: './situation.component.html',
  styleUrls: ['./situation.component.scss']
})
export class SituationComponent implements OnInit, OnChanges {


  @Input() savings: Saving[];
  @Input() title: string;
  @Input() computedSituation: number[];
  private data;
  private colors: string[] = [
    '#FF6384', '#36A2EB', '#FFCE56', '#9bff74',
    '#eba37a', '#5365ff', '#454446', '#0aeb00', '#ff0a1b',
  ];

  constructor() {
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateGraph();
  }

  public updateGraph(): void {
    if (this.savings) {
      const tempData = [];
      const tempLabel = [];
      this.savings.forEach(saving => {
        tempLabel.push(saving.name);
        tempData.push(saving.amount);
      });
      this.data = {
        labels: tempLabel,
        datasets: [
          {
            data: tempData,
            backgroundColor: this.colors,
            hoverBackgroundColor: this.colors
          }]
      };
    }
  }

}
