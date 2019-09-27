import { OperationStrategy } from './operation.interface';
import { ReflectiveInjector, Injectable, EventEmitter, NgZone } from '@angular/core';
import { DateService } from '../../date/date.service';
import { DbService } from '../../database/db.service';
import { Expense } from '../../database/models/Expense';
import { ExpenseIncidenceAlert } from '../incidenceController/expense.incidence.alert';

@Injectable()
export class EditStrategy implements OperationStrategy {
  public hasSuccededEmitter: EventEmitter<any> = new EventEmitter();

  constructor(
    private alertBuilder: ExpenseIncidenceAlert,
    private dbService: DbService) {}


  public executeOperation(expenseFormValues: any, oldExpense: any) {
    let oldExpenseCopy = { ...oldExpense };
    let isRepeatable = oldExpense.repeat > 1;

    for (let key in expenseFormValues) {
      oldExpense[key] = expenseFormValues[key];
    }

    this.dbService
      .update(expenseFormValues['fowardOrAll'], oldExpense, oldExpenseCopy)
      .subscribe(() => {
        this.hasSuccededEmitter.emit(true);
      });

    return this.hasSuccededEmitter;
  }
}
