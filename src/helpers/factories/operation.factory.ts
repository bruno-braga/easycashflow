import { Injectable } from '@angular/core';
import { EditStrategy } from '../strategies/edit.strategy';
import { InsertStrategy } from '../strategies/insert.strategy';
import { DeleteStrategy } from '../strategies/delete.strategy';

@Injectable()
export class OperationFactory {
  constructor(
    private insertStrategy: InsertStrategy,
    private editStrategy: EditStrategy,
    private deleteStrategy: DeleteStrategy
  ) {}

  public create(operation: string) {
    switch(operation) {
      case 'add':
        return this.insertStrategy;
      case 'edit':
        return this.editStrategy;
      case 'delete':
        return this.deleteStrategy; 
    }
  }
}
