import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, SimpleChange } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, AbstractControl, UntypedFormArray, UntypedFormControl } from '@angular/forms';
import { getBlankOption, getObjectFromList, isValidValue } from '../../../../../../shared-module/utilities/helper-utils';
import { OpeningBalanceService } from 'src/app/modules/customerapp-module/api-services/master-module-services/chart-of-account-service/chart-of-account.service';
import { TransportValidator } from '../../../../../../shared-module/components/validators/validators';

@Component({
  selector: 'edit-coa',
  templateUrl: './edit-chart-of-account.component.html',
  styleUrls: ['./edit-chart-of-account.component.scss']
})
export class EditChartOfAccountComponent implements OnInit {
  editChartOfAccountForm: UntypedFormGroup;
  @Input() showModal: boolean;
  @Input() coaId : any;
  @Output() closeModal = new EventEmitter<any>();
  @Output() coaUpdated = new EventEmitter<any>();
  accountTypes: Array<any> = [];
  parentAccounts: Array<any> = [];
  initialValues = {
    account: getBlankOption(),
    account_type : {}
  }
  isDebited: boolean = true;
  parent_account_editable: boolean = false;
  coaData: any;
  disableParentAcc: boolean = true;
  apiError='';

  constructor( private _fb: UntypedFormBuilder,
    private _openingBalanceService: OpeningBalanceService) { }

  ngOnChanges(changes: SimpleChanges) {
      const showModal: SimpleChange = changes.showModal;
      if(showModal.currentValue)
        this.getChartOfAccountById();
  }
  ngOnInit() {
    this.buildForm();
    this.getAllAccountTypes();
  }

  buildForm() {
    this.editChartOfAccountForm = this._fb.group({
      name: [
        null,
        [Validators.required]
      ],
      description: [""],
      account_type: [
        null,
        [Validators.required]
      ],
      account: [
        null,
        [Validators.required]
      ]
    });
  }

  addErrorClass(controlName: AbstractControl) {
		return TransportValidator.addErrorClass(controlName);
  }

  getAllAccountTypes() {
    this._openingBalanceService.getAllAccountsType().subscribe((res: any) => {
      if (res && res.result && res.result.length > 0)
        this.accountTypes = res.result;
    })
  }

  disableParentAccount(parent_account_editable: boolean) {
    this.disableParentAcc = !parent_account_editable;
    if (this.disableParentAcc) {
      this.resetParentAccount();
      this.editChartOfAccountForm.get('account').disable();
    }
    else {
      this.editChartOfAccountForm.get('account').enable();
      this.editChartOfAccountForm.get('account').markAsTouched();
    }
  }

  resetParentAccount() {
    this.editChartOfAccountForm.get('account').patchValue(null);
    this.initialValues.account.label = 'Choose' ;
  }

  onAccountTypeSelection(accountTypeId: string) {
    if (accountTypeId) {
      this.resetParentAccount();
      if(this.parent_account_editable)
        this.editChartOfAccountForm.get('account').markAsTouched();
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

  close(coaUpdated: boolean) {
    this.showModal = false;
    this.editChartOfAccountForm.reset();
    this.initialValues.account.label =  'Choose'
    this.initialValues.account_type = {
      label : 'Choose'
    }
    this.closeModal.emit(this.showModal);
    if (coaUpdated)
      this.coaUpdated.emit(coaUpdated);
  }

  getChartOfAccountById() {
    this._openingBalanceService.getOpeningBalanceAccountById(this.coaId).subscribe(
      (response:any) => {
        if(response && isValidValue(response.result)) {
          this.coaData = response.result;
          this.parent_account_editable = this.coaData.account ? true :false;
          this.disableParentAccount( this.parent_account_editable);
          this.patchFormData(this.coaData);
        }
      });
  }

  patchFormData(data) {
    let dataToPatch = {
      account_type : data.account_type ? data.account_type.id : null,
      name : data.name,
      description : data.description
    }
    if(dataToPatch.account_type)
      this.onAccountTypeSelection(dataToPatch.account_type)
    this.initialValues.account_type = {
      label : data.account_type ? data.account_type.name : 'Choose'
    };
    this.initialValues.account.label =  data.account ? data.account.name : 'Choose'
    this.editChartOfAccountForm.patchValue(dataToPatch);
    this.editChartOfAccountForm.get('account').setValue(data.account?.id)
    this.initialValues.account.label=data.account?.name;
    this.initialValues.account.value=data.account?.id
    
  }

  submitForm(form: UntypedFormGroup) {
    let data = form.value;
    if(this.disableParentAcc) {
      data.account = null;
    }
    if(form.valid)
      this.updateOpeningBalance(data);
      else{
        this.setAsTouched(form)
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

  updateOpeningBalance(request) {
    this._openingBalanceService.updateOpeningBalanceAccount(request,this.coaId).subscribe((data)=>{
      this.close(true);
      
    },
    (error) => {
      this.apiError=error.error.message
    }
    );
  }

}
