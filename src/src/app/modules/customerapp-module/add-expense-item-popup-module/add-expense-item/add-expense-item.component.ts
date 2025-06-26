import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, AbstractControl, UntypedFormArray, UntypedFormControl } from '@angular/forms';
import { TransportValidator } from '../../../../shared-module/components/validators/validators';
import { InvoiceService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/invoice-service/invoice.service';
import { RevenueService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/revenue-service/revenue.service';
import { OperationsActivityService } from 'src/app/modules/customerapp-module/api-services/operation-module-service/operations-activity.service';
import { ValidationConstants } from 'src/app/core/constants/constant';

@Component({
  selector: 'app-add-expense-item',
  templateUrl: './add-expense-item.component.html',
  styleUrls: ['./add-expense-item.component.scss']
})
export class AddExpenseItemComponent implements OnInit, OnChanges {
  @Input() expenseItemPopDetail: any = {name: '', status: false};
  @Output() closeModal = new EventEmitter<any>();
  @Output() itemAdded = new EventEmitter<any>();
  @Input() units = [];
  @Input() isServiceType = false;
  @Input() isSpare = false;
  @Input() isVehicle = false;
  alphaNumericPattern= new ValidationConstants().VALIDATION_PATTERN.ALPHA_NUMERIC2;
  addItemForm: UntypedFormGroup;
  apiError: string;
  skumessageError=''
  namemessageError=''
  accountList: any = [];
  initialValues: any = {
    account: {},
    unit: {}
  }

  constructor(
    private _fb: UntypedFormBuilder,
    private _invoiceService: InvoiceService,
    private _revenueService: RevenueService,
    private _operationService: OperationsActivityService
  ) { }

  ngOnInit() {
    this.buildForm();

    this._revenueService.getAccounts('Expense').subscribe((response: any) => {
        this.accountList = response.result;
    });
  }

  buildForm() {
    this.addItemForm = this._fb.group({
      name: [
        '',
        [Validators.required,Validators.maxLength(35)]
      ],
      sku:[''],
      rate_per_unit: [
        0,[Validators.required,Validators.min(0.01)]
      ],
      unit: [
        null,[Validators.required]
      ],
      account: [
        null,[Validators.required]
      ],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
	  //Change in input decorator
	for (let propName in changes) {
		if (propName == 'expenseItemPopDetail'){
      const name = changes[propName].currentValue.name;
      setTimeout(() =>{
        this.addItemForm.controls.name.setValue(name);
      }, 1);
		}
	}

  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  close() {
    this.resetFormValues();
    this.expenseItemPopDetail.status = false;
    this.closeModal.emit(false);
  }

  resetFormValues() {
    this.buildForm();
    this.initialValues = {
      account: {},
      unit: {}
    }
  }

  setAsTouched(group: UntypedFormGroup | UntypedFormArray) {
    group.markAsTouched();
    for (let i in group.controls) {
      if (group.controls[i] instanceof UntypedFormControl) {
        group.controls[i].markAsTouched();
      } else {
        this.setAsTouched(group.controls[i]);
      }
    }
  }

  addNewItem(form: UntypedFormGroup) {

    if (form.valid) {
      this.apiError = '';
      if(this.isServiceType){
        this._revenueService.postServiceList(form.value).subscribe((response: any) => {
          this.close();
          this.itemAdded.emit({label: response.result.name, id: response.result.id, status: true});
        }, (err) => {
          this.showErrormessage(err.error.message)
          this.itemAdded.emit({label: '',  id: null, status: false});
        });
      }
      else if(this.isSpare){
      this._operationService.addSpareItem(form.value).subscribe((response: any) => {
        this.close();
        this.itemAdded.emit({label: response.result.name, id: response.result.id, status: true});
      }, (err) => {
        this.showErrormessage(err.error.message)
        this.itemAdded.emit({label: '',  id: null, status: false});
      });
    }
    else if(this.isVehicle){
      this._operationService.addVehicleItem(form.value).subscribe((response: any) => {
        this.close();
        this.itemAdded.emit({label: response.result.name, id: response.result.id, status: true});
      }, (err) => {
        this.showErrormessage(err.error.message)
        this.itemAdded.emit({label: '',  id: null, status: false});
      });
    }
    else {
      this._invoiceService.addExpenseItem(form.value).subscribe((response: any) => {
        this.close();
        this.itemAdded.emit({label: response.result.name, id: response.result.id, status: true});
      }, (err) => {
        this.showErrormessage(err.error.message)
        this.itemAdded.emit({label: '',  id: null, status: false});
      });
    }
    } else {
      this.setAsTouched(form);
    }
  }

  showErrormessage(message){
    this.skumessageError='';
    this.namemessageError=''
    if(message.includes('Item name already exists.')){
      this.namemessageError='Item name already exists.'
    }
    if(message.includes('Item SKU already exists.')){
      this.skumessageError='Item SKU already exists.';
    }
  }
}
