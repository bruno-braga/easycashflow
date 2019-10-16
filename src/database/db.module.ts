import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DbService } from './db.service';
import { DbSingleton } from './db.singleton';

import { DbHasVisitedService } from './db.hasVisited.service';
import { DbHasVisitedSingleton } from './db.hasVisited.singleton';

@NgModule({
  imports: [CommonModule],
  declarations: [],
  exports: [],
})

export class DbModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DbModule,
      providers: [
        DbService,
        DbSingleton,
        DbHasVisitedService,
        DbHasVisitedSingleton
      ],
    };
  }
}
