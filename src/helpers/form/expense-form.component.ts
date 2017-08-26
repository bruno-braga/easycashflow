import { Component, Input, OnInit, Injector, NgZone } from '@angular/core';
import { AbstractControl, FormGroup, Validators, FormControl } from '@angular/forms';

import { DbService } from '../../database/db.service';
import { Expense } from '../../database/models/Expense';
import { NumberValidator } from '../validator/number.validator';
import { ViewController, AlertController, NavController } from 'ionic-angular';
import { ExpenseForm } from './expense-form';

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

  constructor(private injector: Injector) {
    this.dbService = this.injector.get(DbService);
    this.viewCtrl = this.injector.get(ViewController);
    this.zone = this.injector.get(NgZone);
    this.alertCtrl = this.injector.get(AlertController);
    this.nav = this.injector.get(NavController);
  }

  ngOnInit() {
    this.expenseForm = ExpenseForm.create();

    if (this.expense !== null) {
      this.displayEditAndDeleteButtons = true;
      // this.formType = 'edit';
      this.isComposed = this.expense.composed;
      // this.expenseForm.addControl('editType', new FormControl('', Validators.required));
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

  public verifyLimit(repeat: any) {
    if (repeat.value > Expense.MAX_EXPENSE_REPETITION) {
      this.repeat.setValue(Expense.MAX_EXPENSE_REPETITION);
    }

    if (repeat.value < Expense.MIN_EXPENSE_REPETITION) {
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
      switch (this.operationType) {
        case 'add':
        this.expense = new Expense(
          this.expenseForm.value['title'],
          this.expenseForm.value['amount'],
          this.expenseForm.value['instalmentDate'],
          this.expenseForm.value['composed'],
          this.expenseForm.value['monyBag'],
          this.expenseForm.value['forever'],
          this.expenseForm.value['repeat'],
        );

        this.dbService.insert(this.expense)
          .subscribe((inserHasSucceded: boolean) => {
            this.viewCtrl.dismiss(inserHasSucceded);
          },
        );
        break;
        case 'edit':
        this.alert = this.alertBuilder();
        this.alert.addButton({
          text: 'Ok',
          handler: (occurrence: any) => {
            let navTransition = this.alert.dismiss();

            let oldExpense = R.clone(this.expense);

            this.expense.title = this.expenseForm.value['title'];
            this.expense.amount = this.expenseForm.value['amount'];
            this.expense.instalmentDate = this.expenseForm.value['instalmentDate'];
            this.expense.composed = this.expenseForm.value['composed'];
            this.expense.monyBag = this.expenseForm.value['monyBag'];
            this.expense.forever = this.expenseForm.value['forever'];
            this.expense.repeat = parseInt(this.expenseForm.value['repeat'], 10);

            this.dbService.update(occurrence, this.expense, oldExpense)
              .subscribe((updatedHasSucceded: boolean) => {
                console.log('updated ',   updatedHasSucceded);
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
        case 'delete':
        this.alert = this.alertBuilder();
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

  private alertBuilder() {
    let alert = this.alertCtrl.create();

    alert.setTitle('Choose an option');
    alert.addInput({
      type: 'radio',
      checked: true,
      label: 'This',
      value: 'current',
    });

    if (this.expense.repeat > 1) {
      alert.addInput({
        type: 'radio',
        label: 'All',
        value: 'all',
      });

      alert.addInput({
        type: 'radio',
        label: 'Foward',
        value: 'foward',
      });
    }

    alert.addButton('Cancel');
    return alert;
  }

  private populateForm(): void {
    // tslint:disable-next-line:forin
    for (let key in this.expenseForm.controls) {
      this.expenseForm
        .controls[key]
        .setValue((<any>this.expense)[key]);
    }
  }
}