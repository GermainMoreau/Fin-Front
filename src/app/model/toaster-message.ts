import {Severity} from './severity.enum';

export class ToasterMessage {
  public title: string;
  public message: string;
  public severity: Severity;

  constructor(title: string, message: string, severity: Severity) {
    this.title = title;
    this.message = message;
    this.severity = severity;
  }
}
