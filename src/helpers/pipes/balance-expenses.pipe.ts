import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'balanceExpenses'})
export class BalanceExpenses implements PipeTransform {
  transform(expenses: any): any {
      let sum: number = 0;
      expenses.forEach((expense: any) => {
        sum += parseFloat(expense.amount);
      });
      return sum.toFixed(2);
  }
}
