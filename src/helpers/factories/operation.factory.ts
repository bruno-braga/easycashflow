import { InsertStrategy } from '../strategies/insert.strategy';
import { EditStrategy } from '../strategies/edit.strategy';

export class OperationFactory {
  public static create(operation: string) {
    switch(operation) {
      case 'add':
        return new InsertStrategy();
      case 'edit':
        return new EditStrategy();
    }
  }
}
