import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'money'
})
export class MoneyPipe implements PipeTransform {

  transform(value: number): string {
    const isNegative = value < 0;
    const afterComa = value.toFixed(2).substring(value.toFixed(2).length - 3);
    const beforeComaAsArray = [];

    if (isNegative) {
      value = Math.abs(value);
    }

    const heplingArray = value.toFixed(2).substring(0, value.toFixed(2).indexOf('.')).split('').reverse();

    for (let index = 0; index < heplingArray.length; index++) {
      if (index % 3 === 0 && index !== 0) {
        beforeComaAsArray.push(' ');
      }
      beforeComaAsArray.push(heplingArray[index]);
    }

    let beforeComa = beforeComaAsArray.reverse().toString();
    while (beforeComa.indexOf(',') > 0) {
      beforeComa = beforeComa.replace(',', '');
    }

    return (isNegative ? '-' : '') + beforeComa + afterComa + ' €';
  }

}
