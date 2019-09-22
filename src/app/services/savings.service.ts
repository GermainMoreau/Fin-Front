import {Injectable} from '@angular/core';
import {Saving} from '../model/saving';
import {Subject} from 'rxjs';
import {$httpService} from './$http.service';
import {Request} from '../model/request';
import {Api} from '../model/api.enum';

@Injectable({
  providedIn: 'root'
})
export class SavingsService {

  private listOfSupport: Saving[];
  public listOfSavings: Subject<Saving[]>;

  constructor(private httpService: $httpService) {
    this.listOfSavings = new Subject<Saving[]>();
    this.getListOfSavings();
  }

  public getListOfSavings(): void {
    this.listOfSupport = [];
    this.httpService.get(new Request(Api.savingList)).subscribe(res => {
      res.forEach(saving => {
        this.listOfSupport.push(new Saving(saving.name, saving.amount, saving.repartition));
      });
      this.listOfSavings.next(this.listOfSupport);
    });
  }

  public updateListOfSavings(savings: Saving[]) {
    this.listOfSupport = [];
    this.httpService.put(new Request(Api.savingList, savings)).subscribe(res => {
      res.forEach(saving => {
        this.listOfSupport.push(new Saving(saving.name, saving.amount, saving.repartition));
      });
      this.listOfSavings.next(this.listOfSupport);
    });
  }

  public getNotified(): void {
    this.listOfSavings.next(this.listOfSupport);
  }

  public copyListOfSavings(savings: Saving[]): Saving[] {
    const copy = [];
    savings.forEach(saving => {
      copy.push(new Saving(saving.name, saving.amount, saving.repartition));
    });
    return copy;
  }
}
