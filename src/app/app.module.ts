import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen'; 
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home.page';
import { OnboardingPageModule } from '../pages/onboarding/onboarding.module';

import { ExpenseFormComponent } from '../helpers/form/expense-form.component';
import { ExpenseForm } from '../helpers/form/expense-form';

import { ExpenseModal } from '../pages/home/modal/expense.modal';

import { DbModule } from '../database/db.module';
import { DateModule } from '../date/date.module';
import { BalanceExpenses } from '../helpers/pipes/balance-expenses.pipe';
import { StylizeAmountOfExpense } from '../helpers/pipes/stylize-expense.pipe';
import { ShowInstalmentMonth } from '../helpers/pipes/show-instalment-month.pipe';
import { OperationFactory } from '../helpers/factories/operation.factory';
import { IncidenceController } from '../helpers/incidenceController/incidence.controller';
import { ExpenseIncidenceAlert } from '../helpers/incidenceController/expense.incidence.alert';

import { DbOperationStrategyModule  } from '../helpers/strategies/db.operation.strategy.module';

@NgModule({
    declarations: [
      MyApp,
      HomePage,
      ExpenseFormComponent,
      ExpenseModal,
      BalanceExpenses,
      StylizeAmountOfExpense,
      ShowInstalmentMonth,
    ],
    imports: [
      BrowserModule,
      OnboardingPageModule,
      IonicModule.forRoot(MyApp),
      DbModule.forRoot(),
      DateModule.forRoot(),
      DbOperationStrategyModule.forRoot(),
    ],
    bootstrap: [IonicApp],
    entryComponents: [
      MyApp,
      HomePage,
      ExpenseFormComponent,
      ExpenseModal,
    ],
    providers: [
      SplashScreen,
      OperationFactory,
      IncidenceController,
      ExpenseIncidenceAlert,
      ExpenseForm,
    ],
})

export class AppModule {}
