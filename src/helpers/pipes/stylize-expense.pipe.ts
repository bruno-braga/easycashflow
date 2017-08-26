import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'stylizeAmountOfExpense'})
export class StylizeAmountOfExpense implements PipeTransform {
  transform(amount: any): any {
      if (amount === 0) {
        return `$ ${amount}`;
      }
      if (amount > 0) {
        return `+ $${amount}`;
      }
      return `- $${amount.replace('-', '')}`;
  }
}
