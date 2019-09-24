import { Component, Input, OnInit, Injector, NgZone, EventEmitter } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

import { DbService } from '../../database/db.service';
import { Expense } from '../../database/models/Expense';
import { App, ViewController, AlertController, NavController } from 'ionic-angular';
import { ExpenseForm } from './expense-form';

import { OperationFactory } from '../factories/operation.factory';
import { ExpenseIncidenceAlert } from '../incidenceController/expense.incidence.alert';

@Component({
  selector: 'ib-expense-form',
  templateUrl: './expense-form.component.html',
})

export class ExpenseFormComponent implements OnInit {
  @Input() public expense: Expense;
  @Input() public currentDate: any;

  public expenseTypeEmitter: EventEmitter<any> = new EventEmitter();

  public operationType: string;
  public repeat: AbstractControl;
  public title: AbstractControl;
  public amount: AbstractControl;
  public isComposed: boolean = false;
  public expenseForm: FormGroup;
  public isForever: boolean;
  public displayEditAndDeleteButtons: boolean;
  public meter: any = {
    color: '',
    icon: ''
  };

  public negativeButton: any = {
    color: 'light'
  }

  public positiveButton: any = {
    color: 'secondary'
  }


  constructor(
    private dbService: DbService,
    private viewCtrl: ViewController,
    private zone: NgZone,
    private alertCtrl: AlertController,
    private nav: NavController,
    private operationFactory: OperationFactory,
    private alertBuilder: ExpenseIncidenceAlert,
    private expenseFormService: ExpenseForm) {

      this.expenseTypeEmitter
        .subscribe((checked: boolean) => this.setIsForever(checked));
    }

  ngOnInit() {
    this.expenseForm = this.expenseFormService.create();

    if (this.expense !== null) {
      this.displayEditAndDeleteButtons = true;
      this.isComposed = this.expense.composed;

      if (this.expense.composed) {
        this.expenseForm.controls['composed'].disable();
      }

      if (this.expense.forever || this.expense.composed) {
        this.expenseForm.controls['forever'].disable();
      }

      if (this.expense.repeat > 1 || this.expense.composed) {
        this.expenseForm.controls['repeat'].disable();
      }

      this.populateForm();
    } else {
      this.displayEditAndDeleteButtons = false;
      this.expenseForm.controls['instalmentDate'].setValue(this.currentDate.toDate());
    }

    this.repeat = this.expenseForm.controls['repeat'];
    this.title = this.expenseForm.controls['title'];
    this.amount = this.expenseForm.controls['amount'];

  }

  public isAmountPositive() {
    if (this.amount.value > 0) {
      return true;
    }

    return false;
  }

  public toggleColor(isPositive: boolean) {
    if (isPositive) {
      this.positiveButton.color = 'secondary';
      this.negativeButton.color = 'light';

      if (!this.isAmountPositive()) {
        this.amount.setValue(this.amount.value * -1);
      }

      return
    }

    if (this.isAmountPositive()) {
      this.amount.setValue(this.amount.value * -1);
    }

    this.positiveButton.color = 'light';
    this.negativeButton.color = 'danger';
  }

  public verifyAmount(event: any): any {
    if (this.amount.value > 0) {
      this.toggleColor(true)

      return
    }

    this.toggleColor(false)
  }

  public verifyLimit() {
    if (this.repeat.value < 0) {
      this.repeat.setValue(1);
    }
  }

  public setExpenseType(checked: boolean): void {
    this.expenseTypeEmitter.emit(checked)
  }

  private setIsForever(checked: boolean) : void {
    this.isForever = checked;
  }

  public changed() {
    console.log('uuuu');
  }

  public isRepeatable() {
    if (this.expense != null) {
      return this.expense.repeat > 1;
    }
  }

  public isExpenseComposed() {
    return this.isComposed;
  }

  public setOperationType(type: string) {
    this.operationType = type;
  }

  public submit(): void {
    if (this.expenseForm.valid) {
      if (this.isForever) {
        this.expenseForm.value.repeat = Expense.MAX_EXPENSE_REPETITION;
      }

      this.operationFactory
        .create(this.operationType)
        .executeOperation(this.expenseForm.value, this.expense)
        .subscribe((has: any) => {
          this.viewCtrl.dismiss();
        });
    }
  }

  public toggleComposedProperties(checked: any): void {
    this.isComposed = checked;
  }

  private populateForm(): void {
    for (let key in this.expenseForm.controls) {
      this.expenseForm
        .controls[key]
        .setValue((<any>this.expense)[key]);
    }
  }
}
