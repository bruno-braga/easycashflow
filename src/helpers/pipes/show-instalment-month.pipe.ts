import { Pipe, PipeTransform } from '@angular/core';
import { DateService } from '../../date/date.service';
import R from 'ramda';

@Pipe({name: 'showInstalmentMonth', pure: true})
export class ShowInstalmentMonth implements PipeTransform {
  constructor(private dateService: DateService) {}

  transform(expense: any, expenseRange: any): any {
      let currentInstalment: any = [];
      expenseRange.forEach((range: any, index: number) => {
        if (index === 0) {
        }
        if (range[0].instalmentId === expense.instalmentId) {
          currentInstalment = range;
        }
      });

      let findByInstalmentDate = R.findIndex(R.propEq('instalmentDate', expense.instalmentDate));
      let instalmentIndex = findByInstalmentDate(currentInstalment);

      return `${instalmentIndex + 1}/${currentInstalment.length}`;
    }
}
