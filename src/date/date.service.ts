import { Injectable } from '@angular/core';
import { DateSingleton } from './date-singleton';

import Moment from 'moment';

@Injectable()
export class DateService {
private appDate: any;

  constructor() {
    this.appDate = DateSingleton.getAppDate();
  }

  public navigateThroughMonth(numberOfDays: number): any {
    return this.appDate.add(numberOfDays, 'M');
  }

  public getCurrentMonthName(): string {
    return this.appDate.format('MMMM');
  }

  public getFirstDateOfMonth(): any {
    return Moment()
      .year(this.appDate.year())
      .month(this.appDate.month())
      .date(1);
  }

  public getLastDateOfMonth(): any {
    return Moment()
      .year(this.appDate.year())
      .month(this.appDate.month())
      .date(this.appDate.daysInMonth());
  }

  public getMoment(isDateInstance?: boolean): any {
    if (isDateInstance) {
      return Moment()
        .year(this.appDate.year())
        .month(this.appDate.month());
    }
    return Moment();
  }

  public createMomentBy(date: any) {
    if (date !== null && date !== undefined) {
      return Moment(date);
    }
    return Moment();
  }
}
