import { OperationStrategy } from './operation.interface';
import { ReflectiveInjector } from '@angular/core';
import { DateService } from '../../date/date.service';
import { DbService } from '../../database/db.service';
import { Expense } from '../../database/models/Expense';

export class EditStrategy implements OperationStrategy {
  public executeOperation(occurrence: any, expenseFormValues: any, oldExpense: any) {
    let oldExpenseCopy = { ...oldExpense };
    
    for (let key in expenseFormValues) {
      oldExpense[key] = expenseFormValues[key];
    }

    return ReflectiveInjector
             .resolveAndCreate([DbService, DateService])
             .get(DbService)
             .update(occurrence, oldExpense, oldExpenseCopy);
  }
}
