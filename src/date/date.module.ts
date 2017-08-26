import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateService } from './date.service';

@NgModule({
  imports: [CommonModule],
  declarations: [],
  exports: [],
})

export class DateModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DateModule,
      providers: [
        DateService,
      ],
    };
  }
}
