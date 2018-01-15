import { Component, NgZone, OnInit } from '@angular/core';
import { NavController, ModalController, ViewController, LoadingController } from 'ionic-angular';

import { DbService } from '../../database/db.service';
import { ExpenseModal } from '../home/modal/expense.modal';
import { Expense } from '../../database/models/Expense';
import { DateService } from '../../date/date.service';

import Moment from 'moment';
import R from 'ramda';

@Component({
  selector: 'ib-page-home',
  templateUrl: './home.page.html',
})

export class HomePage implements OnInit {
  public expenses: any;
  public monthName: string;
  public expenseRange: any;
  private modal: any;
  private loader: any;
  private loaderContent: any = { content: 'Loading' };

  constructor(
    private mdlCtrl: ModalController,
    private dateService: DateService,
    private dbService: DbService,
    private viewCtrl: ViewController,
    private ldrCtrl: LoadingController,
    private zone: NgZone,
  ) { }

  ngOnInit() {
    this.monthName = this.dateService.getCurrentMonthName();
    this.getCurrentMonthExpenses();
    this.expenseRange = 0;
  }

  swipeEvent(direction: any) {
    let numberOfDays: number = (direction) === 2 ? 1 : -1;
    this.navigateThroughMonths(numberOfDays);
  }

  public setColor(amount: number): any {
    if (amount > 0) {
      return 'green';
    }
    return 'red';
  }

  public addExpense(): void {
    let isDateInstance: boolean = true;
    this.modal = this.mdlCtrl.create(
      ExpenseModal,
      {
        params: {
          currentDate: this.dateService.getMoment(isDateInstance),
          expense: null,
          callToAction: 'add',
        },
      },
    );
    this.modal.present();
    this.dismissedModal(this.modal);
  }

  public editExpense(expense: any): void {
    let isDateInstance: boolean = true;
    this.modal = this.mdlCtrl.create(
      ExpenseModal,
      {
        params: {
          isDeleted: false,
          currentDate: this.dateService.getMoment(isDateInstance),
          expense: expense,
        },
      },
    );
    this.modal.present();
    this.dismissedModal(this.modal);
  }

  public navigateThroughMonths(numberOfDays: number) {
    this.dateService.navigateThroughMonth(numberOfDays);
    this.updateView();
  }

  private updateView() {
    this.monthName = this.dateService.getCurrentMonthName();
    this.getCurrentMonthExpenses();
  }

  private getCurrentMonthExpenses() {
    this.loader = this.ldrCtrl.create(this.loaderContent);
    this.loader.present();
    this.zone.run(() => {
      this.dbService.getAll()
        .subscribe(
        ({ docs: expenses }: any) => {
          // create an array to separate the expenses by instalmnetId
          // {id: [], id2: []}
          let arr: any = {};
          for (let i = 0; i < expenses.length; i++) {
            if ((i + 1) < expenses.length && expenses[i].instalmentId !== expenses[i + 1].instalmentId) {
              arr[expenses[i + 1].instalmentId] = [];
            } else {
              arr[expenses[i].instalmentId] = [];
            }
          }

          // populate the array with the expenses
          // tslint:disable-next-line:forin
          for (let key in arr) {
            expenses.forEach((expense: any) => {
              if (expense.instalmentId === key) {
                arr[key].push(expense);
              }
            });
          }

          // create an array
          // [[{title: 1, id: 1}, {title: 2, id: 1}], [{title: 2, id: 2}]] so on and so forth
          let expensesByInstalmentId: any = [];
          // tslint:disable-next-line:forin
          for (let key in arr) {
            expensesByInstalmentId.push(arr[key]);
          }

          let currentMonthExpenses = expenses.filter((doc: any) => {
            return this.dateService.createMomentBy(doc.instalmentDate).year() ===
              this.dateService.getMoment(true).year() &&
              this.dateService.createMomentBy(doc.instalmentDate).month() ===
              this.dateService.getMoment(true).month();
          });

          let sortedCurrentMonthExpenses: any = [];
          sortedCurrentMonthExpenses = currentMonthExpenses.sort((a: any, b: any) => {
            return b.amount - a.amount;
          });

          this.expenses = sortedCurrentMonthExpenses;
          this.expenseRange = expensesByInstalmentId;
          this.loader.dismiss();
        },
      );
    });
  }

  private dismissedModal(modal: any): void {
    modal.onDidDismiss((isModalDismissed: any) => {
      console.log(isModalDismissed);
      this.getCurrentMonthExpenses();
    },
    );
  }
}
