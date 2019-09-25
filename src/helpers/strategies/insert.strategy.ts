import { OperationStrategy } from './operation.interface';
import { Expense } from '../../database/models/Expense';
import { Injectable, EventEmitter } from '@angular/core';
import { DateService } from '../../date/date.service';
import { DbService } from '../../database/db.service';

@Injectable()
export class InsertStrategy implements OperationStrategy {
  public hasSuccededEmitter: EventEmitter<any> = new EventEmitter();

  constructor(private dbService: DbService) {}

  public executeOperation(expenseFormValues: any, oldExpense: any) {
    let expense = new Expense(
      expenseFormValues['title'],
      expenseFormValues['amount'],
      expenseFormValues['instalmentDate'],
      expenseFormValues['forever'],
      expenseFormValues['monyBag'],
      expenseFormValues['forever'],
      expenseFormValues['repeat'],
    );

    this.dbService.insert(expense)
      .subscribe((has: any) => {
        this.hasSuccededEmitter.emit(true);
      });

    return this.hasSuccededEmitter;
  }
}
