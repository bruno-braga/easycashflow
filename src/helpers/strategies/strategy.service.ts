import { Injectable } from '@angular/core';
import { EditStrategy } from '../strategies/edit.strategy';
import { InsertStrategy } from '../strategies/insert.strategy';

@Injectable()
export class StrategyService {
  public getInsert() {
    return new InsertStrategy();
  }

  public getEdit() {
    return new EditStrategy();
  }
}
