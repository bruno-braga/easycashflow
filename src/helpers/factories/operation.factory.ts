import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { StrategyService } from '../strategies/strategy.service';

@Injectable()
export class OperationFactory {
  constructor(private alertCtrl: AlertController, private strategyService: StrategyService) {}

  public create(operation: string) {
    switch(operation) {
      case 'add':
        return this.strategyService.getInsert();
      case 'edit':
        return this.strategyService.getEdit();
    }
  }
}
