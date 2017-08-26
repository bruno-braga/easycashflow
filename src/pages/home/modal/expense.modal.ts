import { Component, Injector } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  templateUrl: './expense.modal.html',
})

export class ExpenseModal {
  public params: {callToAction: string, currentDate: any, expense: any};
  private viewCtrl: ViewController;

  constructor(private injector: Injector) {
    this.viewCtrl = this.injector.get(ViewController);
    this.params = this.injector.get(NavParams).get('params');
  }

  public closeModal(): void {
    this.viewCtrl.dismiss();
  }
}
