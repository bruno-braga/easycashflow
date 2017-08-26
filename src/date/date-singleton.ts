import Moment from 'moment';

export class DateSingleton {
  private static appDate: any;

  public static getAppDate() {
    if (this.appDate === undefined) {
      this.appDate = Moment();
    }
    return this.appDate;
  }
}
