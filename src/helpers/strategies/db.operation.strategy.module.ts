import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  InsertStrategy,
  EditStrategy,
  DeleteStrategy
} from './';

@NgModule({
  imports: [CommonModule],
  declarations: [],
  exports: [],
})

export class DbOperationStrategyModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DbOperationStrategyModule,
      providers: [
        InsertStrategy,
        EditStrategy,
        DeleteStrategy,
      ],
    };
  }
}
