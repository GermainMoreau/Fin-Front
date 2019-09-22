import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {ButtonModule, ChartModule, MessageService, PanelModule, TabViewModule} from 'primeng/primeng';
import {IncomeAddComponent} from './home/income-add/income-add.component';
import {FormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SavingModificationComponent} from './home/saving-modification/saving-modification.component';
import {SituationComponent} from './home/situation/situation.component';
import {ToastModule} from 'primeng/toast';
import {ConsultationComponent} from './home/consultation/consultation.component';
import {MoneyPipe} from './pipes/money.pipe';
import {PercentagePipe} from './pipes/percentage.pipe';
import {HttpClientModule} from '@angular/common/http';
import {PaymentHistoryComponent} from './home/saving-modification/payment-history/payment-history.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    IncomeAddComponent,
    SavingModificationComponent,
    SituationComponent,
    ConsultationComponent,
    MoneyPipe,
    PercentagePipe,
    PaymentHistoryComponent
  ],
  imports: [
    BrowserModule,
    TabViewModule,
    FormsModule,
    TableModule,
    PanelModule,
    BrowserAnimationsModule,
    ButtonModule,
    ChartModule,
    ToastModule,
    HttpClientModule
  ],
  providers: [
    MessageService,
    MoneyPipe],
  bootstrap: [AppComponent]
})
export class AppModule {
}
