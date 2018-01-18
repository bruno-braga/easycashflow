import { ReflectiveInjector } from '@angular/core';
import { DateService } from '../../date/date.service';

import R from 'ramda';

export class Expense {
  public static MAX_EXPENSE_REPETITION = 72;
  public static MIN_EXPENSE_REPETITION = 1;

  private _title: string;
  private _amount: number;
  private _instalmentDate: any;
  private _composed: boolean;
  private _monyBag: boolean;
  private _forever: boolean;
  private _repeat: number;
  private _instalmentId: string;

  public static isExpense(object: any): boolean {
    return object instanceof this;
  }

  constructor(
    title: string,
    amount: number,
    instalmentDate: any,
    composed: boolean = false,
    monyBag: boolean = false,
    forever: boolean = false,
    repeatable: number = 1) {

    this._title = title;
    this._amount = amount;
    this._instalmentDate = instalmentDate;
    this._composed = composed;
    this._monyBag = monyBag;
    this._forever = forever;
    this._repeat = repeatable;
    this._instalmentId = this.generateInstalmentId();
  }

  public isRepeatable(): boolean {
    if (this.repeat > 1) {
      return true;
    }
    return false;
  }

    // tslint:disable-next-line:member-ordering
    public static createInstalments(expense: any): any[] {
      let dateService = ReflectiveInjector
        .resolveAndCreate([DateService])
        .get(DateService);

      let startDate: any = dateService.getMoment(expense.instalmentDate);
      let month: any = startDate;
      let instalments: any[] = [];

      for (let i = 0; i < expense.repeat; i++) {
        let expenseCopy = R.clone(expense);
        expenseCopy.instalmentDate = month.toDate();
        instalments.push(expenseCopy);
        month = month.clone().add(1, 'months');
      }

      return instalments;
    }

  public isComposed(): boolean {
    if (this._composed) {
      return true;
    }
    return false;
  }

  public static toObject(expense: any): any {
    let expenseCopy: any = { ...expense };
    let expenseToBeReturned: any = {};

    let beginWithUnderscore = (Object.keys(expenseCopy).shift().charAt(0) === '_');
    if (beginWithUnderscore) {
      for (let key in expenseCopy) {
        expenseToBeReturned[key.substr(1, key.length)] = expenseCopy[key];
      }

      return expenseToBeReturned;
    }

    for (let key in expenseCopy) {
      expenseToBeReturned[key] = expenseCopy[key];
    }

    return expenseToBeReturned;
  }

  private generateInstalmentId(): string {
    let alfabet = 'abcdefghijklmnopqrstuvxzçABCDEFGHIJKLMNOPQRSTUVXZÇ!@#$%*()-_+=[]{}123456789';
    let hash = '';

    for (let i = 0; i < 10; i++) {
        hash += alfabet.charAt(Math.floor(Math.random() * (alfabet.length - 0 + 1)));
    }

    return hash;
  }

  get title(): string {
    return this._title;
  }

  set title(newTitle: string) {
    this._title = newTitle;
  }

  get amount(): number {
    return this._amount;
  }

  set amount(newAmount: number) {
    this._amount = newAmount;
  }

  get instalmentDate(): any {
    return this._instalmentDate;
  }

  set instalmentDate(newValue: any) {
    this._instalmentDate = newValue;
  }

  get composed(): boolean {
    return this._composed;
  }

  set composed(newValue: boolean) {
    this._composed = newValue;
  }

  get monyBag() {
    return this._monyBag;
  }

  set monyBag(newValue: boolean) {
    this._monyBag = newValue;
  }

  get forever() {
    return this._forever;
  }

  set forever(newValue: boolean) {
    this._forever = newValue;
  }

  get repeat() {
    return this._repeat;
  }

  set repeat(times: number) {
    this._repeat = times;
  }

  get instalmentId(): string {
    return this._instalmentId;
  }

  set instalmentId(id: string) {
    this._instalmentId = id;
  }
}
