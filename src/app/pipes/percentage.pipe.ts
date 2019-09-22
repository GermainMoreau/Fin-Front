import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'percentage'
})
export class PercentagePipe implements PipeTransform {

  transform(value: number): any {
    return value.toFixed(2) + ' %';
  }

}
