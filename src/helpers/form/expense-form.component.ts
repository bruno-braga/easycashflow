import { Component, Input, OnInit, Injector, NgZone } from '@angular/core';
import { AbstractControl, FormGroup, Validators, FormControl } from '@angular/forms';

import { DbService } from '../../database/db.service';
import { Expense } from '../../database/models/Expense';
import { NumberValidator } from '../validator/number.validator';
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
  @Input() public callToAction: string;
  @Input() public currentDate: any;

  public operationType: string;
  public title: AbstractControl;
  public amount: AbstractControl;
  public repeat: AbstractControl;
  public editType: AbstractControl;
  public isComposed: boolean = false;
  public expenseForm: FormGroup;
  public isForever: boolean;
  public displayEditAndDeleteButtons: boolean;

  constructor(
    private dbService: DbService,
    private viewCtrl: ViewController,
    private zone: NgZone,
    private alertCtrl: AlertController,
    private nav: NavController,
    private operationFactory: OperationFactory,
    private alertBuilder: ExpenseIncidenceAlert,
    private expenseFormService: ExpenseForm) {}

  ngOnInit() {
    this.expenseForm = this.expenseFormService.create();

    if (this.expense !== null) {
      this.displayEditAndDeleteButtons = true;
      this.isComposed = this.expense.composed;
      this.populateForm();
    } else {
      this.displayEditAndDeleteButtons = false;
      this.expenseForm.controls['instalmentDate'].setValue(this.currentDate.toDate());
    }

    this.title = this.expenseForm.controls['title'];
    this.amount = this.expenseForm.controls['amount'];
    this.repeat = this.expenseForm.controls['repeat'];
    this.editType = this.expenseForm.controls['editType'];
  }

  public verifyLimit() {
    if (this.repeat.value < 0) {
      this.repeat.setValue(1);
    }
  }

  public toggleForever(checked: boolean): void {
    this.isForever = checked;
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
