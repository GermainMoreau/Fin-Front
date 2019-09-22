import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';

export class Saving {
  public name: string;
  public amount: number;
  public repartition: number;

  constructor(name: string, amount?: number, repartition?: number) {
    this.name = name;
    this.amount = amount ? amount : 0;
    this.repartition = repartition ? repartition : 0;
  }

  public static equals(saving1: Saving, saving2: Saving): boolean {
    return saving1.name === saving2.name && saving1.amount === saving2.amount && saving1.repartition === saving2.repartition;
  }

  public static isValid(saving: Saving): boolean {
    return isNotNullOrUndefined(saving.name) && saving.name.length > 0;
  }
}
