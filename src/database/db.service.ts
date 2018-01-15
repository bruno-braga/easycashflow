import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DateService } from '../date/date.service';
import { Expense } from './models/Expense';

import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import R from 'ramda';

declare var window: any;

@Injectable()
export class DbService {
  private db: any;
  private id: any;

  constructor(private dateService: DateService) {
    this.db = new PouchDB('ionic2wallet');
    PouchDB.plugin(PouchDBFind);
  }

  public getAll() {
    return Observable.fromPromise(
      this.db.createIndex({
        index: {
          fields: ['instalmentDate'],
        },
      })
      .then((result: any) => {
        console.log('result ', result);
        return this.db.find({
            selector: {},
            sort: ['instalmentDate'],
          });
      })
      .catch((err: any) => {
        console.error('error ', err);
      }),
    );
  }
  public insert(expense: any): Observable<any> {
    expense.repeat = parseInt(expense.repeat, 10);
    if (expense.repeat === 0) {
      expense.repeat = 1;
    }

    if (expense.forever) {
      expense.repeat = Expense.MAX_EXPENSE_REPETITION;
    }

    if (expense.repeat === 1) {
      let obj = Expense.toObject(expense);

      return Observable.fromPromise(
        this.db.post(obj),
      );
    }

    let instalments = Expense.createInstalments(expense);

    return Observable.fromPromise(
      this.db.bulkDocs(instalments),
    );
  }

  public delete(type: string, expense: any): Observable<any> {
    switch (type) {
      case 'all':
        return this.deleteAll(expense);
      case 'current':
        return this.deleteOne(expense);
      case 'foward':
         return this.deleteFoward(expense);
      default:
        return Observable.create(
          (observer: any) => {
            observer.error();
            observer.complete();
          });
    }
  }

  public update(type: string, updatedExpense: any, oldExpense: any) {
    if (oldExpense.repeat !== updatedExpense.repeat) {
      this.db.remove(oldExpense);
      delete updatedExpense['_id'];
      delete updatedExpense['_rev'];
      return this.insert(updatedExpense);
    }

    switch (type) {
      case 'all':
        return this.updateAll(updatedExpense);
      case 'current':
        return this.updateOne(updatedExpense);
      case 'foward':
        return this.updateFoward(updatedExpense);
      default:
        console.log();
        break;
    }
  }

  public findCurrentMonthExpenses(): Observable<any> {
    let start: any = this.dateService.getFirstDateOfMonth().toDate();
    let end: any = this.dateService.getLastDateOfMonth().toDate();
    return this.findByRange(start, end);
  }

  public findByInstalmentId(id: string): Observable<any> {
    return Observable.fromPromise(
      this.db.find(
          {
            selector: {
              instalmentId: id,
            },
          },
        ),
      );
  }

  private updateOne(updatedExpense: any): Observable<any> {
    return Observable.create((observer: any) => {
      Observable.fromPromise(this.db.bulkDocs([updatedExpense]))
        .subscribe(
          (result: any) => {
            observer.next(this.wasOperationSuccessful([result]));
            observer.complete();
          },
        );
    });
  }

  private updateAll(updatedExpense: any): Observable<any> {
    return Observable.create((observer: any) => {
      this.findByInstalmentId(updatedExpense.instalmentId)
        .subscribe(
          (result: any) => {
            let updatedExpenses = result.docs.map((oldExpense: any, index: number) => {
              for (let key in oldExpense) {
                if (key === '_id' || key === '_rev' || key === 'instalmentDate') {
                  continue;
                }
                oldExpense[key] = updatedExpense[key];
                oldExpense['sortFactor'] = index;
              }
              return oldExpense;
            });

            Observable.fromPromise(this.db.bulkDocs(updatedExpenses))
              .subscribe(
                (results: any) => {
                  observer.next(this.wasOperationSuccessful(results));
                  observer.complete();
                },
              );
          },
        );
    });
  }

  private updateFoward(selectedExpense: any): Observable<any> {
    return Observable.create((observer: any) => {
      this.findByInstalmentId(selectedExpense.instalmentId)
      .subscribe(
        (expenses: any) => {
          let expensesToBeUpdated = expenses.docs
            .filter((expense: any) => expense.instalmentDate >= selectedExpense.instalmentDate)
            .map((expense: any) => {
              for (let key in expense) {
                if (key === '_id' || key === '_rev' || key === 'instalmentDate') {
                  continue;
                }
                expense[key] = selectedExpense[key];
              }

              return expense;
          });

          Observable.fromPromise(this.db.bulkDocs(expensesToBeUpdated))
            .subscribe(
              (results: any) => {
                observer.next(this.wasOperationSuccessful(results));
                observer.complete();
              },
            );
          },
      );
    });
  }

  private deleteOne(selectedExpense: any): Observable<any> {
    return Observable.create((observer: any) => {
      Observable.fromPromise(this.db.remove(selectedExpense))
        .subscribe(
        (results: any) => {
          observer.next(this.wasOperationSuccessful([results]));
        },
      );
    });
  }

  private deleteAll(selectedExpense: any): Observable<any> {
    return Observable.create((observer: any) => {
      this.findByInstalmentId(selectedExpense.instalmentId)
        .subscribe(
          (expenses: any) => {
              let deleteArray = expenses.docs.map((expense: any) => {
                expense['_deleted'] = true;
                return expense;
              });

              Observable.fromPromise(this.db.bulkDocs(deleteArray))
                .subscribe(
                  (operationResult: any) => {
                    observer.next(this.wasOperationSuccessful(operationResult));
                    observer.complete();
                  },
                );
          },
        );
    });
  }

  private deleteFoward(selectedExpense: any): Observable<any> {
    return Observable.create((observer: any) => {
      this.findByInstalmentId(selectedExpense.instalmentId)
        .subscribe(
          (expenses: any) => {
            let deleteArray = expenses.docs
                .filter((expense: any) => expense.instalmentDate >= selectedExpense.instalmentDate)
                .map((expense: any) => {
                  expense['_deleted'] = true;
                  return expense;
                });

            Observable.fromPromise(this.db.bulkDocs(deleteArray))
              .subscribe(
                (operationResult: any) => {
                  observer.next(this.wasOperationSuccessful(operationResult));
                  observer.complete();
                },
              );
          },
        );
    });
  }

  private findByRange(start: any, end: any): Observable<any> {
    return Observable.fromPromise(
      this.db.find(
          {
            selector: {
              $and: [
                {instalmentDate: {$gte: start}},
                {instalmentDate: {$lte: end}},
              ],
            },
          },
        ),
      );
  }

  private wasOperationSuccessful(deletedExpenses: any[]): boolean {
    let success: boolean;
    deletedExpenses.forEach((deletedExpense: any) => {
      if (deletedExpense.ok) {
        success = true;
      } else {
        success = false;
      }
    });

    return success;
  }
}
