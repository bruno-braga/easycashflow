import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Injectable()
export class AlertBuilder {

  private incidenceAlert: any;

  constructor(private alertCtrl: AlertController) {}

  public createIncidenceAlert(isRepeatable: boolean) {
    this.incidenceAlert = this.alertCtrl.create(); 

    this.incidenceAlert.setTitle('Choose an option');
    this.incidenceAlert.addInput({
      type: 'radio',
      checked: true,
      label: 'This',
      value: 'current',
    });

    if (isRepeatable) {
      this.incidenceAlert.addInput({
        type: 'radio',
        label: 'All',
        value: 'all',
      });

      this.incidenceAlert.addInput({
        type: 'radio',
        label: 'Foward',
        value: 'foward',
      });
    }

    this.incidenceAlert.addButton('Cancel');
    return this.incidenceAlert;
  }
}
