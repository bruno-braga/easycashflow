import {
  AbstractControl,
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';

import { NumberValidator } from '../validator/number.validator';
import { DateService } from '../../date/date.service';
import { ReflectiveInjector, Injectable } from '@angular/core';
import { DbService } from '../../database/db.service';
import { Expense } from '../../database/models/Expense';
import { Observable } from 'rxjs';
import { AlertController, NavController } from 'ionic-angular';
import { App, Config, Platform, MenuController } from 'ionic-angular';
import { AlertOptions } from 'ionic-angular';

@Injectable()
export class ExpenseForm {
  constructor(
    private formBuilder: FormBuilder,
    private dateService: DateService) {}

  public create() {
    let isDateInstance: boolean = true;
    let currentDate = this.dateService.getMoment(isDateInstance);

    console.log(this.formBuilder);
    
    return this.formBuilder.group({
        title: ['', Validators.required],
        amount: ['', Validators.compose([
            Validators.required,
            NumberValidator.isValidNumber,
          ]),
        ],
        composed: [false],
        monyBag: [false],
        forever: [false],
        repeat: [0, Validators.compose([
          Validators.required,
          NumberValidator.isValidNumber,
        ])],
        instalmentDate: [],
      });
  }
}
