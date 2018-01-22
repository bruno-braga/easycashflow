import { Component, Input, OnInit, Injector, NgZone } from '@angular/core';
import { AbstractControl, FormGroup, Validators, FormControl } from '@angular/forms';

import { DbService } from '../../database/db.service';
import { Expense } from '../../database/models/Expense';
import { NumberValidator } from '../validator/number.validator';
import { ViewController, AlertController, NavController } from 'ionic-angular';
import { ExpenseForm } from './expense-form';

import { OperationFactory } from '../factories/operation.factory';
import { AlertBuilder } from '../incidenceController/alert.builder';

import R from 'ramda';

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

  public alertCtrl: AlertController;
  private dbService: DbService;
  private viewCtrl: ViewController;
  private zone: NgZone;
  private nav: NavController;
  private alert: any;
  private operationFactory: OperationFactory;
  private alertBuilder: AlertBuilder;

  constructor(private injector: Injector) {
    this.dbService = this.injector.get(DbService);
    this.viewCtrl = this.injector.get(ViewController);
    this.zone = this.injector.get(NgZone);
    this.alertCtrl = this.injector.get(AlertController);
    this.nav = this.injector.get(NavController);
    this.operationFactory = this.injector.get(OperationFactory);
    this.alertBuilder = this.injector.get(AlertBuilder);
  }

  ngOnInit() {
    this.expenseForm = ExpenseForm.create();

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
      this.repeat.setValue(0);
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
      switch (this.operationType) {
        case 'add':
          this.operationFactory
            .create(this.operationType)
            .executeOperation({}, this.expenseForm.value, {})
            .subscribe((hasSucceded: any) => {
              this.viewCtrl.dismiss(hasSucceded);
            });
          break;
        case 'edit':
          this.alert = this.alertBuilder.createIncidenceAlert(this.isRepeatable());
          this.alert.addButton({
            text: 'Ok',
            handler: (occurrence: any) => {

              let navTransition = this.alert.dismiss();

              this.operationFactory
                .create(this.operationType)
                .executeOperation(occurrence, this.expenseForm.value, this.expense)
                .subscribe((operationHasSucceded: boolean) => navTransition.then(() => this.nav.pop()));

              return false;
            },
          });
          this.alert.present();
          break;
        case 'delete':
          this.alert = this.alertBuilder.createIncidenceAlert(this.isRepeatable());
          this.alert.addButton({
            text: 'Ok',
            handler: (occurrence: any) => {
              let navTransition = this.alert.dismiss();

              this.dbService.delete(occurrence, this.expense)
                .subscribe((isDeleted: any) => {
                  console.log(isDeleted);
                  navTransition.then(() => {
                    this.nav.pop();
                  });
                },
              );
              return false;
            },
          });
          this.alert.present();
          break;
        default:
          break;
      }
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
