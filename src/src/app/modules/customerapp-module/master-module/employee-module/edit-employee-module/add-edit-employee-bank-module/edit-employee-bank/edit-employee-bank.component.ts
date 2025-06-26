import { TaxService } from '../../../../../../../core/services/tax.service';
import { StoreService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/store.service';
import { Component, OnInit} from '@angular/core';
import { UntypedFormArray, Validators, AbstractControl, UntypedFormGroup, UntypedFormControl, UntypedFormBuilder } from '@angular/forms';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { CommonService } from 'src/app/core/services/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TSStoreKeys } from 'src/app/core/constants/store-keys.constants';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { isValidValue, roundOffAmount } from 'src/app/shared-module/utilities/helper-utils';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { EditEmployeeService } from '../../edit-employee-services/edit-employee-service';
import { EmployeeService } from '../../../../../api-services/master-module-services/employee-service/employee-service';
import { TerminologiesService } from 'src/app/core/services/terminologies.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';

@Component({
  selector: 'app-edit-employee-bank',
  templateUrl: './edit-employee-bank.component.html',
  styleUrls: ['./edit-employee-bank.component.scss']
})
export class EmployeeBankComponent implements OnInit {

  bankId: any;
  editBankForm;
  bankDetails: any;
  apiError: String = "";
  patterns = new ValidationConstants().VALIDATION_PATTERN;
  initialValues: any = {
    accountType: {},
    bankName: {}
  };
  bankList: any;
  accountTypeList: any;
  addBankApi = TSAPIRoutes.static_options;
  addBankParams: any = {};
  display_name_error: string = "";
  currency_type;

  accountTypePostApi = TSAPIRoutes.static_options;
  accountTypeParams: any = {};
  opening_balance_present: boolean = false;
  opening_balance_date = null;
  accountTypes = []

  current_date: Date = new Date(dateWithTimeZone());
  prefixUrl = '';
  isRequiedForm = false;
  id ='';
  employee_id='';
  terminology: any;
  isTax=true;
  isTDS=false;


  constructor(
    private _fb: UntypedFormBuilder,
    private _routeParam: ActivatedRoute,
    private _commonService: CommonService,
    private _router: Router,
    private _stateService: StoreService,
    private _employeeService: EmployeeService,
    private _editEmployeeService: EditEmployeeService,
    private currency: CurrencyService,
    private _prefixUrl: PrefixUrlService,
    private _terminologiesService: TerminologiesService,
    private _isTax:TaxService
  ) { }

  ngOnInit() {
    this.isTax = this._isTax.getTax();
    this.isTDS = this._isTax.getVat();
    this.terminology = this._terminologiesService.terminologie;
    let urlString = location.href.split('/');
    if(urlString[7]=="edit"){
      this.id = urlString[8];
    }
    this.prefixUrl = this._prefixUrl.getprefixUrl();
    setTimeout(() => {
      this.currency_type = this.currency.getCurrency();
      this.getFormValues();
    }, 1000);
    this.buildForm();
    this._commonService.getStaticOptions('financier,account-type').subscribe((response: any) => {
      this.bankList = response.result['financier'];
      this.accountTypeList = response.result['account-type'];
    });
    this._routeParam.params.subscribe((params:any) => {
      if(params.employee_id)
      this.employee_id = params.employee_id;
     })
  }

  getAccountTypes() {
    this._commonService.getStaticOptions('account-type').subscribe((response: any) => {
      this.accountTypeList = response.result['account-type'];
    });

  }

  addParamsToAccountType(event) {
    if (event) {
      this.accountTypeParams = {
        key: 'account-type',
        label: event,
        value: 0
      };
    }
  }

  getFormValues(){
    if(this.id){
      this._editEmployeeService.getAllEditDetails(this.id).subscribe((response) => {
        this.bankDetails =response.bank_details
        if(this.bankDetails['id']){
          this.editBankForm.setValue(this.bankDetails);
          this.patchBankeName();
          this.patchAccountType();
          this.valueChange();
        }

    });
    }
  }

  getNewAccountTypesTypes($event) {
    if ($event) {
      this.initialValues.accountType = {}
      this.getAccountTypes();
      console.log($event)
      this.initialValues.accountType = { value: $event.id, label: $event.label };
      this.editBankForm.controls.account_type.setValue($event.id);
    }
  }


  patchBankeName() {
    if (isValidValue(this.bankDetails.bank_name)) {
      this.initialValues.bankName['label'] = this.bankDetails.bank_name.label;
      this.initialValues.bankName['value'] = this.bankDetails.bank_name.id;
      this.editBankForm.controls.bank_name.setValue(this.bankDetails.bank_name.id);
    }
    else {
      this.editBankForm.controls.bank_name.setValue(null);
    }
  }

  patchAccountType() {
    if (isValidValue(this.bankDetails.account_type)) {
      this.initialValues.accountType['label'] = this.bankDetails.account_type.label;
      this.initialValues.accountType['value'] = this.bankDetails.account_type.id;
      this.editBankForm.controls.account_type.setValue(this.bankDetails.account_type.id);
    }
    else {
      this.editBankForm.controls.account_type.setValue(null);
    }
  }

  buildForm() {
    this.editBankForm = this._fb.group({
      id: [
      ],
      bank_name: [
        null,
      ],
      employee:[''],
      account_holder_name: [
        '',
      ],
      account_number: [
        '',
        [
          Validators.maxLength(20)
        ]
      ],
      account_type: [
        null,
      ],
      iban_code:[null,[Validators.maxLength(34),Validators.pattern(this.patterns.ALPHA_NUMERIC)]],
      swift_code:[null,[Validators.maxLength(14),Validators.pattern(this.patterns.ALPHA_NUMERIC)]],
      ifsc_code: [
        null,
        [Validators.pattern(this.patterns.IFSC)]
      ],
      branch: [
        ''
      ],

    });
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


  submitForm(form: UntypedFormGroup) {
    event.preventDefault();
    this.display_name_error = "";
    if (form.valid) {
      if(!form.value['account_holder_name']){
        this._router.navigate([this.prefixUrl+ '/onboarding/employee/view']);
        return
      }
      this._stateService.setToStore(TSStoreKeys.master_employee_add_documents,form.value);
      if(this.employee_id){
        this._employeeService.postBanks(form.value,this.employee_id).subscribe(data=>{
          this._editEmployeeService.editEmployeeBank.next(true);
          this._employeeService.addTimeline.isBankSaved = true;
          this._router.navigate([this.prefixUrl+ '/onboarding/employee/view']);
        })
      }else{
        this._editEmployeeService.editEmployeeBank.next(true);
        this._employeeService.addTimeline.isBankSaved = true;
        this._editEmployeeService.editEmployeeBanks(this.id,form.value).subscribe(data=>{
          this._router.navigate([this.prefixUrl+ '/onboarding/employee/view']);
        })
      }


    } else {
      this.setAsTouched(form);
    }
  }

  prepareRequest(form) {
    form.patchValue({
      opening_balance_date: changeDateToServerFormat(form.controls.opening_balance_date.value),
    })
    return form.value;
  }

  addNewBank(event) {
    if (event) {
      this.addBankParams = {
        key: 'financier',
        label: event,
        value: 0
      };
    }
  }

  getNewBank(event) {
    if (event) {
      this.bankList = [];
      this._commonService.getStaticOptions('financier').subscribe((response: any) => {
        this.initialValues.bankName = {};
        this.bankList = response.result['financier'];
        this.initialValues.bankName = {value: event.id, label: event.label};
        this.editBankForm.controls.bank_name.setValue(event.id);
      });
    }
  }

  // round off amount
  roundOffValue(formControl) {
    roundOffAmount(formControl);
  }

  valueChange() {
    if (this.editBankForm.get('account_holder_name').value || this.editBankForm.get('bank_name').value || this.editBankForm.get('account_number').value || this.editBankForm.get('account_type').value || this.editBankForm.get('ifsc_code').value) {
      this.makeMandatory('bank_name');
      this.makeMandatory('account_number')
      this.makeMandatory('account_type')
      this.editBankForm.get('account_holder_name').setValidators([Validators.required,Validators.pattern(this.patterns.ACCOUNT_HOLDER_NAME)]);
      this.editBankForm.get('account_holder_name').updateValueAndValidity();
      this.editBankForm.get('account_number').setValidators([Validators.required,Validators.pattern(this.patterns.NUMBER_ONLY)]);
      this.editBankForm.get('account_number').updateValueAndValidity();
      this.isRequiedForm = true;
    } else {
      this.makeNonMandatory('bank_name');
      this.makeNonMandatory('account_number')
      this.makeNonMandatory('account_type')
      this.makeNonMandatory('account_holder_name');
      this.isRequiedForm = false;
    }
  }

  makeMandatory(formControlName) {
    this.editBankForm.get(formControlName).setValidators([Validators.required]);
    this.editBankForm.get(formControlName).updateValueAndValidity();

  }


  makeNonMandatory(formControlName) {
    this.editBankForm.get(formControlName).setValidators([Validators.nullValidator]);
    this.editBankForm.get(formControlName).updateValueAndValidity();

  }



}
