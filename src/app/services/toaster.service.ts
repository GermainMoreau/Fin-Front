import {Injectable} from '@angular/core';
import {Severity} from '../model/severity.enum';
import {Subject} from 'rxjs';
import {ToasterMessage} from '../model/toaster-message';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  private toasterMessages: ToasterMessage[];
  public listOfToasterMessages: Subject<ToasterMessage[]>;

  constructor() {
    this.toasterMessages = [];
    this.listOfToasterMessages = new Subject<ToasterMessage[]>();
  }

  public addMessage(title: string, message: string, severity: Severity): void {
    this.toasterMessages.push(new ToasterMessage(title, message, severity));
    this.listOfToasterMessages.next(this.toasterMessages);
    this.toasterMessages = [];
  }
}
