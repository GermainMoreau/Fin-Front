import {Saving} from './saving';

export class SavingModification extends Saving {

  public editInProgress: boolean;

  constructor(name: string, amount?: number, repartition?: number, editInProgress?: boolean) {
    super(name, amount, repartition);
    this.editInProgress = editInProgress;
  }

  public static equals(saving1: SavingModification, saving2: SavingModification): boolean {
    return super.equals(new Saving(saving1.name, saving1.amount, saving1.repartition), new Saving(saving2.name, saving2.amount, saving2.repartition)) &&
      saving1.editInProgress === saving2.editInProgress;
  }

  public static isValid(saving: SavingModification): boolean {
    return super.isValid(new Saving(saving.name));
  }

}
