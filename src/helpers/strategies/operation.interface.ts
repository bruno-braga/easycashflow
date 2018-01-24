import { EventEmitter } from '@angular/core';

export interface OperationStrategy {
  hasSuccededEmitter: EventEmitter<any>;
  executeOperation(expenseFormValues: any, oldExpense: any): any;
}
