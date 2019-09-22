import {Component, OnInit} from '@angular/core';
import {Saving} from '../../model/saving';
import {SavingsService} from '../../services/savings.service';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {SavingModification} from '../../model/saving-modification';
import {ToasterService} from '../../services/toaster.service';
import {Severity} from '../../model/severity.enum';

@Component({
  selector: 'app-saving-modification',
  templateUrl: './saving-modification.component.html',
  styleUrls: ['./saving-modification.component.scss']
})
export class SavingModificationComponent implements OnInit {

  public savingsWorkingCopy: SavingModification[];
  public savings: SavingModification[];
  public originalListOfSavings: Saving[];

  constructor(private savingsService: SavingsService, private toasterService: ToasterService) {
    this.savingsWorkingCopy = [];
    this.savings = [];
  }

  ngOnInit() {
    this.savingsService.listOfSavings.subscribe(res => {
      this.initSituation(res);
    });
    this.savingsService.getNotified();
  }

  private initSituation(savingList: Saving[]): void {
    this.savingsWorkingCopy = this.buildSavingModificationList(savingList);
    this.syncSavingsAndCopy();
    this.originalListOfSavings = this.savingsService.copyListOfSavings(savingList);
    this.addNewEmptySaving();
  }

  /**
   * Determine if a saving is Valid or Not regardind parameters
   */
  public savingIsValid(saving: Saving): boolean {
    return saving
      && saving.name
      && saving.name.length > 0
      && isNotNullOrUndefined(saving.amount)
      && saving.amount >= 0
      && isNotNullOrUndefined(saving.repartition)
      && saving.repartition >= 0
      && saving.repartition <= 100;
  }

  /**
   * Determine if a change has been made
   */
  public changeHasBeenMadeOnCurrentSaving(index: number) {
    const savingWorkingCopy = new Saving(this.savingsWorkingCopy[index].name, this.savingsWorkingCopy[index].amount, this.savingsWorkingCopy[index].repartition);
    const saving = new Saving(this.savings[index].name, this.savings[index].amount, this.savings[index].repartition);
    return !Saving.equals(savingWorkingCopy, saving);
  }

  /**
   * add a new empty Saving that could be modified
   */
  public addNewEmptySaving() {
    this.savingsWorkingCopy.push(new SavingModification(null, 0, 0, true));
  }

  /**
   * Add a new recording on the selected index
   */
  public handleAddingSaving(index: number) {
    const name = this.savingsWorkingCopy[index].name;
    const amount = this.savingsWorkingCopy[index].amount;
    const repartition = this.savingsWorkingCopy[index].repartition;
    this.savingsWorkingCopy[index] = new SavingModification(name, amount, repartition, false);
    this.syncSavingsAndCopy();
    this.addNewEmptySaving();
  }

  /**
   * Remove Saving on the selected Index
   */
  public handleRemoving(index: number) {
    this.savingsWorkingCopy.splice(index, 1);
    this.syncSavingsAndCopy();
  }

  /**
   * Update Saving on the selected Index
   */
  public handleUpdateSaving(index: number) {
    const name = this.savingsWorkingCopy[index].name;
    const amount = this.savingsWorkingCopy[index].amount;
    const repartition = this.savingsWorkingCopy[index].repartition;
    this.savingsWorkingCopy[index] = new SavingModification(name, amount, repartition, false);
    this.syncSavingsAndCopy();
  }

  /**
   * Revert modifications on the selected Saving Index
   */
  public handleRevert(index: number) {
    this.savingsWorkingCopy[index] = new SavingModification(this.savings[index].name, this.savings[index].amount, this.savings[index].repartition, false);
  }

  /**
   * Determine if the whole savings modifications are valids
   */
  public wholeSavingsAreValid(): boolean {
    let sum = 0;
    let everySavingIsValid = true;
    this.savings.forEach((saving => {
      sum += saving.repartition;
      everySavingIsValid = everySavingIsValid && this.savingIsValid(saving);
    }));
    return sum === 100 && everySavingIsValid;
  }

  /**
   * Valid an send savings after modifications
   */
  public sendModifications() {
    if (this.wholeSavingsAreValid()) {
      this.toasterService.addMessage('Succès', 'Sauvegarde effectuée avec succès', Severity.Succes);
      this.savingsService.updateListOfSavings(this.savings);
    }
  }

  /**
   * Revert all Savings to their original state
   */
  public abortAllModifications(): void {
    this.toasterService.addMessage('Information', 'Modifications annulées', Severity.Info);
    this.initSituation(this.originalListOfSavings);
  }

  /**
   *
   */
  public nameIsValid(index: number): boolean {
    let result = true;
    for (let count = 0; count < this.savings.length; count++) {
      if (index !== count && this.savingsWorkingCopy[index].name === this.savings[count].name) {
        result = false;
      }
    }
    return result;
  }

  /**
   * Determine if a Modification has been made on the Whole Saving List
   */
  public modificationHasBeendMade(): boolean {
    if (this.originalListOfSavings.length === this.savings.length) {
      for (let index = 0; index < this.originalListOfSavings.length - 1; index++) {
        const originalSaving = this.originalListOfSavings[index];
        const saving = new Saving(this.savings[index].name, this.savings[index].amount, this.savings[index].repartition);
        if (!Saving.equals(saving, originalSaving)) {
          return true;
        }
      }
      return false;
    } else {
      return true;
    }
  }

  /**
   * build a Saving Modification List Taking a Saving List as Input
   */
  private buildSavingModificationList(savings: Saving[]): SavingModification[] {
    const savingModificationList = [];
    if (savings) {
      savings.forEach(saving => {
        savingModificationList.push(new SavingModification(saving.name, saving.amount, saving.repartition, false));
      });
    }
    return savingModificationList;
  }

  /**
   * Sync Savings and SavingsWorkingCopy discarding empty records
   */
  private syncSavingsAndCopy(): void {
    const tmpCopy: SavingModification[] = [];

    this.savings.forEach(saving => {
      tmpCopy.push(new SavingModification(saving.name, saving.amount, saving.repartition, saving.editInProgress));
    });
    this.savings = [];

    for (let count = 0; count < this.savingsWorkingCopy.length; count++) {
      // permet d'enlever la ligne vide la fin
      if (Saving.isValid(this.savingsWorkingCopy[count])) {
        // ne copie que ce qui est deja finis de modifier et validé, sinon on ne change pas!
        if (this.savingsWorkingCopy[count].editInProgress) {
          this.savings.push(new SavingModification(
            tmpCopy[count].name,
            tmpCopy[count].amount,
            tmpCopy[count].repartition,
            tmpCopy[count].editInProgress));
        } else {
          this.savings.push(new SavingModification(
            this.savingsWorkingCopy[count].name,
            this.savingsWorkingCopy[count].amount,
            this.savingsWorkingCopy[count].repartition,
            this.savingsWorkingCopy[count].editInProgress));
        }
      }
    }
  }
}
