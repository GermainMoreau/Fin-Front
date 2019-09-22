import {Component, OnInit} from '@angular/core';
import {ToasterService} from '../services/toaster.service';
import {MessageService} from 'primeng/api';
import {ToasterMessage} from '../model/toaster-message';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private toasterService: ToasterService, private messageService: MessageService) {
  }

  ngOnInit() {
    this.toasterService.listOfToasterMessages.subscribe((toasterMessage) => {
      this.addMessages(toasterMessage);
    });
  }

  private addMessages(toasterMessages: ToasterMessage[]) {
    const messages = [];
    toasterMessages.forEach(toasterMessage => {
      messages.push({severity: toasterMessage.severity, summary: toasterMessage.title, detail: toasterMessage.message});
    });
    this.messageService.addAll(messages);
  }

}
