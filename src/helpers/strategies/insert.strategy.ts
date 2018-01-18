import { OperationStrategy } from './operation.interface';
import { Expense } from '../../database/models/Expense';
import { ReflectiveInjector } from '@angular/core';
import { DateService } from '../../date/date.service';
import { DbService } from '../../database/db.service';

export class InsertStrategy implements OperationStrategy {
  public executeOperation(expenseFormValues: any) {
    let expense = new Expense(
            expenseFormValues['title'],
            expenseFormValues['amount'],
            expenseFormValues['instalmentDate'],
            expenseFormValues['composed'],
            expenseFormValues['monyBag'],
            expenseFormValues['forever'],
            expenseFormValues['repeat'],
          );

    return ReflectiveInjector
             .resolveAndCreate([DbService, DateService])
             .get(DbService)
             .insert(expense);
  }
}
