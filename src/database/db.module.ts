import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DbService } from './db.service';
import { DbSingleton } from './db.singleton';

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
      ],
    };
  }
}
