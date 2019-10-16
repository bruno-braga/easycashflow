import { Injectable, EventEmitter } from '@angular/core';

import { DbService } from '../../database/db.service';
import { OperationStrategy } from '../strategies/operation.interface';

@Injectable()
export class DeleteStrategy implements OperationStrategy {
  public hasSuccededEmitter: EventEmitter<any> = new EventEmitter();

  constructor(private dbService: DbService) {}

  public executeOperation(expenseFormValues: any, oldExpense: any) {
    this.dbService.delete(expenseFormValues['fowardOrAll'], oldExpense)
      .subscribe(() => (this.hasSuccededEmitter.emit(true)));

    return this.hasSuccededEmitter;
  }
}
