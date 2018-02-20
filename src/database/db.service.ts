import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DateService } from '../date/date.service';
import { Expense } from './models/Expense';

import { DbSingleton } from './db.singleton';

@Injectable()
export class DbService {
  private db: any;

  constructor(
    private dateService: DateService,
    private dbSingleton: DbSingleton) {
    this.db = this.dbSingleton.getInstance();
  }

  public getAll() {
    return Observable.fromPromise(
      new Promise((resolve: any, reject: any) => {
        this.db.find({}).sort({ instalmentDate: 1 }).exec((err: any, docs: any) => {
          if (err)
            reject(err);

          resolve(docs);
        })
      })
    );
  }

  public insert(expense: any): Observable<any> {
    expense.repeat = parseInt(expense.repeat, 10);
    expense.amount = parseFloat(expense.amount);

    let expenses: any;
    switch(expense.repeat) {
      case 1:
        expenses = Expense.toObject(expense);
      break;
      default:
        expenses = Expense.createInstalments(Expense.toObject(expense));
      break;
    }

    return Observable.fromPromise(
      new Promise((resolve: any, reject: any) => {
        this.db.insert(expenses, (err: any, expenses: any) => {
          if (err)
            reject(err);

          resolve(expenses);
        })
      })
    );
  };

  private findWrapper(query: any): Observable<any> {
    return Observable.fromPromise(
      new Promise((resolve: any, reject: any) => {
        this.db.find(query, (err: any, expenses: any) => {
          if (err)
            reject(err);

          resolve(expenses);
        })
      })
    );
  }

  private deleteWrapper(query: any, multi: boolean = false): Observable<any> {
    return Observable.fromPromise(
      new Promise((resolve: any, reject: any) => {
        this.db.remove(query, { multi }, (err: any, expensesRemoved: any) => {
          if (err)
            reject(err);

          resolve(expensesRemoved);
        })
      })
    );
  }

  private updateWrapper(query: any, update: any, options: any = {}): Observable<any> {
    return Observable.fromPromise(
      new Promise((resolve: any, reject: any) => {
        this.db.update(query, update, options, (err: any, expensesUpdated: any) => {
          if (err)
            reject(err);

          resolve(expensesUpdated);
        })
      })
    );
  }

  public delete(type: string, expense: any): Observable<any> {
    switch (type) {
      case 'all':
        return this.deleteWrapper({ instalmentId: expense.instalmentId }, true);
      case 'current':
        return this.deleteWrapper({ _id: expense._id });
      case 'foward':
        return this.deleteWrapper(
            {
              instalmentId: expense.instalmentId,
              instalmentDate: {
                $gte: expense.instalmentDate
              }
            },
            true
          );
    }
  }

  public update(type: string, updatedExpense: any, oldExpense: any) {
    if (oldExpense.repeat !== updatedExpense.repeat) {
      return Observable.create((observer: any) => {
        this.deleteWrapper({ _id: oldExpense._id })
          .subscribe(() => {
            delete updatedExpense['_id'];
            observer.next(this.insert(updatedExpense));
          })
        });
    }

    switch (type) {
      case 'all':
        return this.updateWrapper(
            { instalmentId: oldExpense.instalmentId },
            { $set: { amount: updatedExpense.amount, title: updatedExpense.title } },
            { multi: true }
          );
      case 'current':
        return this.updateWrapper(
            { _id: oldExpense._id },
            updatedExpense
          );
      case 'foward':
        return this.updateWrapper(
            {
              instalmentId: oldExpense.instalmentId,
              instalmentDate: {
                $gte: oldExpense.instalmentDate
              }
            },
            { $set: { amount: updatedExpense.amount, title: updatedExpense.title } },
            { multi: true }
          );
    }
  }
}
