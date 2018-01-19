import { Injectable } from '@angular/core';
import { InsertStrategy } from '../strategies/insert.strategy';
import { EditStrategy } from '../strategies/edit.strategy';
import { AlertController } from 'ionic-angular';

@Injectable()
export class OperationFactory {
  constructor(private alertCtrl: AlertController) {}

  public create(operation: string) {
    switch(operation) {
      case 'add':
        return new InsertStrategy();
      case 'edit':
        return new EditStrategy();
    }
  }
}
