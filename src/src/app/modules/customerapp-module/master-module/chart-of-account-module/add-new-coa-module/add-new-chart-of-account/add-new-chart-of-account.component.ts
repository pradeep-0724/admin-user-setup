import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, AbstractControl, Validators, UntypedFormArray } from '@angular/forms';
import { OpeningBalanceService } from 'src/app/modules/customerapp-module/api-services/master-module-services/chart-of-account-service/chart-of-account.service';
import { getObjectFromList } from '../../../../../../shared-module/utilities/helper-utils';
import { changeDateToServerFormat } from '../../../../../../shared-module/utilities/date-utilis';
import { TransportValidator } from '../../../../../../shared-module/components/validators/validators';
import { CommonService } from 'src/app/core/services/common.service';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';


@Component({
  selector: 'add-new-coa',
  templateUrl: './add-new-chart-of-account.component.html',
  styleUrls: ['./add-new-chart-of-account.component.scss'],
})
export class AddNewChartOfAccountComponent implements OnInit {
  addChartOfAccountForm: UntypedFormGroup;
  @Input() showModal: boolean;
  @Output() closeModal = new EventEmitter<any>();
  @Output() coaAdded = new EventEmitter<any>();
  @Input() popDetail: any = {name: '', status: false};
  @Output() coAAdded = new EventEmitter<any>();
  @Input() isExpenseType: boolean = false;



  accountTypes: Array<any> = [];
  parentAccounts: Array<any> = [];
  initialValues = {
    amountType: { label: 'Debit' },
    account: { label: 'Choose',value:null },
    account_type : { label: 'Choose' ,value : null }
  }
  amountType = 'debit';
  isDebited: boolean = true;
  disableParentAcc: boolean = true;
  opening_balance_present: boolean = false;
  name_error: string;
  toDisableAccountType = false;
  currency_type:any;


  constructor(
    private _fb: UntypedFormBuilder,
    private _openingBalanceService: OpeningBalanceService,
    private _commonService: CommonService,private apiHandler: ApiHandlerService,
    private _popupBodyScrollService:popupOverflowService,
    private currency: CurrencyService
  ) { }

  ngOnInit() {
    this.buildForm();
    this.currency_type = this.currency.getCurrency();
    this.getAllAccountTypes();
    this.setAsOnDate();
    this.addChartOfAccountForm.get('amount').setValue('0');

  }
  popupOverflowHide(){
    this._popupBodyScrollService.popupHide()
   }

  ngOnChanges(changes: SimpleChanges) {
		//Change in input decorator
	  for (let propName in changes) {
		  if (propName == 'popDetail'){
		const name = changes[propName].currentValue.name;
		setTimeout(() =>{
		  this.addChartOfAccountForm.get('name').setValue(name);
		}, 1);
		  }
	  }

    if(this.popDetail.status){
      this.showModal = this.popDetail.status;
      if(this.isExpenseType){
      this.toDisableAccountType = true;
     this.initialValues.account_type = {label :'Expense', value : '1e03f59d-e17c-4ae6-84e3-944ae499d83c'}
      this.addChartOfAccountForm.get('account_type').setValue('1e03f59d-e17c-4ae6-84e3-944ae499d83c');
      this.onAccountTypeSelection('1e03f59d-e17c-4ae6-84e3-944ae499d83c')
      }
    }
	}

  buildForm() {
    this.addChartOfAccountForm = this._fb.group({
      account_type: [
        null,
        [Validators.required]
      ],
      is_parent_acc: [
        false
      ],
      account: [
        null,
        [Validators.required]
      ],
      name: [
        null,
        [Validators.required]
      ],
      as_on_date: [
        null,
        [Validators.required]
      ],
      description: [
        ''
      ],
      amount: [
        0,
        [Validators.required]
      ],
      is_debited: [
        true
      ]
    });
  }

  close(coaAdded: boolean) {
    this.showModal = false;
    this.addChartOfAccountForm.reset();
    this.addChartOfAccountForm.get('as_on_date').markAsUntouched();
    this.resetFormValues();
    this.closeModal.emit(this.showModal);
    if (coaAdded){
      this.coaAdded.emit(coaAdded);
    }

  }

  setAsOnDate(){
    this._commonService.getOpeningBalanceStatus().subscribe((response: any) =>{


      this._commonService.getOpeningBalanceStatus().subscribe((response: any) => {
        if (response.result.present){
          this.opening_balance_present = true;
          this.addChartOfAccountForm.get('as_on_date').setValue(response.result.date);
          this.addChartOfAccountForm.get('as_on_date').disable();

        }
      });

    });

  }

  resetFormValues() {
    this.initialValues.account = { label: 'Choose',value :null };
    this.initialValues.account_type = { label: 'Choose' ,value :null };
    this.initialValues.amountType = { label: 'Debit' };
    this.amountType = 'debit';
    this.isDebited = true;
    this.disableParentAcc = true;
    this.name_error = '';
  }

  getAllAccountTypes() {
    this._openingBalanceService.getAllAccountsType().subscribe((res: any) => {
      if (res && res.result && res.result.length > 0)
        this.accountTypes = res.result;
    })
  }

  resetParentAccount() {
    this.addChartOfAccountForm.get('account').patchValue(null);
    this.initialValues.account = { label: 'Choose',value:null };
  }

  onAccountTypeSelection(accountTypeId: string) {
    if (accountTypeId) {
      this.resetParentAccount();
      let accountType = getObjectFromList(accountTypeId, this.accountTypes);
      if (accountType && accountType.name)
        this.getAccountByType(accountType.name);
    }
  }

  getAccountByType(accountType: string) {
    this._openingBalanceService.getAccountsByType(accountType).subscribe((res: any) => {
      this.parentAccounts = res.result;      
    });
  }

  onAmountTypeChange(amountType) {
    this.isDebited = amountType == 'debit' ? true : false;
    this.addChartOfAccountForm.get('amount').setValue('0');
  }

  disableParentAccount(parent_account_editable: boolean) {
    this.disableParentAcc = !parent_account_editable;
    if (this.disableParentAcc) {      
      this.resetParentAccount();
      this.addChartOfAccountForm.get('account').disable();
    }
    else {
      this.addChartOfAccountForm.get('account').enable();
      this.addChartOfAccountForm.get('account').markAsTouched();
    }
  }

  submitForm(form: UntypedFormGroup) {
    form.get('as_on_date').patchValue(changeDateToServerFormat(form.get('as_on_date').value));
    let data = form.value
    data['is_editable'] = true;
    data['is_debited'] = this.isDebited;
    data['description'] ? data['description'] : '';

    form.get('description').setValue(data['description'] ? data['description'] : '');
    if(this.disableParentAcc) {
      data.account = null;
      this.addChartOfAccountForm.get('account').disable();
    }
    this.setAsTouched(form);
    if(form.valid){
      this.createChartOfAccount(data);
      this._popupBodyScrollService.popupHide();
    }
  }

  createChartOfAccount(request) {
    this.apiHandler.handleRequest(this._openingBalanceService.postOpeningBalanceNewAccount(request), 'New COA added successfully!').subscribe(
      {
        next: (res) => {
          if (this.popDetail.status) {
            this.coaAdded.emit({ label: res['result']['name'], id: res['result']['id'], status: true })
          }
          this.close(true);
        },
        error: () => {
          this.name_error = "An account already exists with the same name"
        }
      }
    );
   }

  addErrorClass(controlName: AbstractControl) {
		return TransportValidator.addErrorClass(controlName);
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
}
