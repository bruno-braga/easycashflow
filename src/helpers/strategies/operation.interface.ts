export interface OperationStrategy {
  executeOperation(occurrence: any, expenseFormValues: any, oldExpense: any): any;
}
