import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Injectable()
export class ExpenseIncidenceAlert {

  private alert: any;

  constructor(private alertCtrl: AlertController) {}

  public create(isRepeatable: boolean) {
    this.alert = this.alertCtrl.create(); 

    this.alert.setTitle('Choose an option');
    this.alert.addInput({
      type: 'radio',
      checked: true,
      label: 'This',
      value: 'current',
    });

    if (isRepeatable) {
      this.alert.addInput({
        type: 'radio',
        label: 'All',
        value: 'all',
      });

      this.alert.addInput({
        type: 'radio',
        label: 'Foward',
        value: 'foward',
      });
    }

    this.alert.addButton('Cancel');
    return this.alert;
  }
}
