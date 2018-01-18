import { InsertStrategy } from '../strategies/insert.strategy';

export class OperationFactory {
  public static create(operation: string) {
    switch(operation) {
      case 'add':
        return new InsertStrategy();
    }
  }
}
