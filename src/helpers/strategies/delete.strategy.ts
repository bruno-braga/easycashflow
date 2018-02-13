import { Injectable, EventEmitter } from '@angular/core';

import { DbService } from '../../database/db.service';
import { ExpenseIncidenceAlert } from '../incidenceController/expense.incidence.alert';
import { OperationStrategy } from '../strategies/operation.interface';

@Injectable()
export class DeleteStrategy implements OperationStrategy {
  public hasSuccededEmitter: EventEmitter<any> = new EventEmitter();

  constructor(
    private dbService: DbService, 
    private alertBuilder: ExpenseIncidenceAlert) {}

  public executeOperation(expenseFormValues: any, oldExpense: any) {
    let isRepeatable = oldExpense.repeat > 1;
    let alert  = this.alertBuilder.create(isRepeatable);

    alert.addButton({
      text: 'ok',
      handler: (incidence: string) => {
        this.dbService
          .delete(incidence, oldExpense)
          .subscribe(() => {
            this.hasSuccededEmitter.emit(true);
          });
      }
    });

    alert.present(); 

    return this.hasSuccededEmitter;
  }
}
