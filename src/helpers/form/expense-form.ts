import { AbstractControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NumberValidator } from '../validator/number.validator';
import { DateService } from '../../date/date.service';
import { ReflectiveInjector } from '@angular/core';
import { DbService } from '../../database/db.service';
import { Expense } from '../../database/models/Expense';
import { Observable } from 'rxjs';
import { AlertController, NavController } from 'ionic-angular';
import { App, Config, Platform, MenuController } from 'ionic-angular';
import { AlertOptions } from 'ionic-angular';

export class ExpenseForm {
  public static create(): any {
    let formBuilder = ReflectiveInjector
      .resolveAndCreate([FormBuilder])
      .get(FormBuilder);

    let dateService = ReflectiveInjector
      .resolveAndCreate([DateService])
      .get(DateService);

    let isDateInstance: boolean = true;
    let currentDate = dateService.getMoment(isDateInstance);

    return formBuilder.group({
        title: ['', Validators.required],
        amount: ['', Validators.compose([
            Validators.required,
            NumberValidator.isValidNumber,
          ]),
        ],
        composed: [false],
        monyBag: [false],
        forever: [false],
        repeat: [1],
        instalmentDate: [],
      });
  }

  public static submit(formType: string, expenseForm: any, alert: any) {
    let dbService = ReflectiveInjector
      .resolveAndCreate([DbService, DateService])
      .get(DbService);

    let expense: any;
    let observable: Observable<any>;
    console.log(alert);
    // tslint:disable-next-line:switch-default
    switch (formType) {
      case 'add':
      expense = new Expense(
        expenseForm.value['title'],
        expenseForm.value['amount'],
        expenseForm.value['instalmentDate'],
        expenseForm.value['composed'],
        expenseForm.value['monyBag'],
        expenseForm.value['forever'],
        expenseForm.value['repeat'],
      );

      observable = dbService.insert(expense);
      break;
      case 'edit':
      observable = Observable.create((observer: any) => {
        observer.next('ok');
        observer.complete();
      });
      break;
    }

    return observable;
  }
}
