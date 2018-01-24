import { Injectable, EventEmitter } from '@angular/core';

import { DbService } from '../../database/db.service';
import { AlertBuilder } from '../incidenceController/alert.builder';
import { OperationStrategy } from '../strategies/operation.interface';

@Injectable()
export class DeleteStrategy implements OperationStrategy {
  public hasSuccededEmitter: EventEmitter<any> = new EventEmitter();

  constructor(
    private dbService: DbService, 
    private alertBuilder: AlertBuilder) {}

  public executeOperation(expenseFormValues: any, oldExpense: any) {
    let isRepeatable = oldExpense.repeat > 1;
    let alert  = this.alertBuilder.createIncidenceAlert(isRepeatable);

    alert.addButton({
      text: 'ok',
      handler: (incidence: string) => {
        console.log(incidence);

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
