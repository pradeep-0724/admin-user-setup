import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';

import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { BehaviorSubject } from 'rxjs';
import { EditEmployeeService } from '../../edit-employee-module/edit-employee-services/edit-employee-service';
import { setAsTouched, setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { CountryIdService } from 'src/app/core/services/countryid.service';
import { getCountryDetails } from 'src/app/shared-module/utilities/countrycode-utils';
import { RevenueService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/revenue-service/revenue.service';
import { CompanyModuleServices } from 'src/app/modules/customerapp-module/api-services/company-service/company-module-service.service';
import { CompanyServices } from 'src/app/modules/customerapp-module/api-services/company-service/company-services.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-employee-renew-document',
  templateUrl: './employee-renew-document.component.html',
  styleUrls: ['./employee-renew-document.component.scss'],
 
})
export class EmployeeRenewDocumentComponent implements OnInit {
  renewDocuments: UntypedFormGroup;
  @Input() popUpRenewDocuments;
  @Input() isCountry:boolean=true;
  apiError = '';
  paymentAccountList =[];
  initialValues = {
    country:{},
    bank:{}
  };
  @Input() company_Id=''
  countryList=[];
  patchFileUrls = new BehaviorSubject([]);
  @Output() dataFromRenewalDoc = new EventEmitter();
  countryId:string=''
  defaultCountry:string='';
  defaultBank:any;
  isExpiryMandatory=false;

  constructor(
    private _fb: UntypedFormBuilder,private _employeeService: EditEmployeeService,   private _countryId:CountryIdService,
    private _revenueService: RevenueService,private _companyModuleService:CompanyModuleServices,
    private _companyService: CompanyServices,private apiHandler: ApiHandlerService,
  ) {
    this.countryId = this._countryId.getCountryId();
    this.defaultCountry=getCountryDetails(this.countryId).country
  }

  ngOnInit() {
    this.getenantBank()
    this.buildForm();
    this.initialValues.country={label:this.defaultCountry}
    this._revenueService.getAccounts().subscribe((response) => {
      this.paymentAccountList =response.result
     })
    this._companyModuleService.getCountry().subscribe((stateData) => {
      if(stateData != undefined) {
        this.countryList = stateData.results;
      }
    });
    // this.renewDocuments.get('issue_date').setValue(new Date(dateWithTimeZone()));
    this.renewDocuments.get('amount').setValue(this.popUpRenewDocuments.data.amount);
    this.renewDocuments.get('number').setValue(this.popUpRenewDocuments.data.number);
    if(this.popUpRenewDocuments.data.hasOwnProperty('is_expiry_mandatory')){
      this.isExpiryMandatory = this.popUpRenewDocuments.data['is_expiry_mandatory']

    }
    this.onDocumentNumberChange();
    setTimeout(() => {
      this.passJournalEntryChange();
    }, 500);
  }

  buildForm() {
    this.renewDocuments = this._fb.group({
      number: [''],
      pass_journal_entry: [false],
      validity: [''],
      state_of_issue:[this.defaultCountry],
      expiry_date: [null],
      issue_date: [null],
      note: [
        ''
      ],
      bank:[null],
      reminder: [
        null
      ],
      files:[[]],
      remind_me: [
        null
      ],
      documents: [[]],
      amount: [0],
      remark: [
        ''
      ]
    });

  }
  getenantBank(){
    this._revenueService.getTenantBank().subscribe((data)=>{
      this.defaultBank = data['result'];
    })
  }

  onDocumentNumberChange(){
    const docNumber= this.renewDocuments.get('number').value
    if(docNumber.trim() && this.isExpiryMandatory){
      setUnsetValidators(this.renewDocuments,'expiry_date',[Validators.required])
    }else{
      setUnsetValidators(this.renewDocuments,'expiry_date',[Validators.nullValidator])
    }
  }



  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  fileUploader(filesUploaded) {
    let data = this.renewDocuments.get('documents').value
    filesUploaded.forEach((element) => {
      data.push(element.id);
    });
  }

  fileDeleted(deletedFileIndex) {
    let data = this.renewDocuments.get('documents').value;
    data.splice(deletedFileIndex, 1);
  }


  cancelButtonClick() {
    this.dataFromRenewalDoc.emit(false);
    this.popUpRenewDocuments.show = false;
  }

  onOkButtonClick() {
    if (this.renewDocuments.valid) {
      this.renewDocuments.value['expiry_date'] = changeDateToServerFormat( this.renewDocuments.value['expiry_date'] );
      this.renewDocuments.value['issue_date'] = changeDateToServerFormat( this.renewDocuments.value['issue_date'] );
      this.renewDocuments.value['files'] = this.renewDocuments.value['documents'];
      this.renewDocuments.value['country']= this.renewDocuments.value['state_of_issue'];
      if(this.isCountry){
        this.apiHandler.handleRequest(this._employeeService.postEmployeeDocument(this.popUpRenewDocuments.data.id,this.renewDocuments.value),`${this.popUpRenewDocuments?.data?.name } renewed successfully!`).subscribe(
          {
            next: () => {
          this.dataFromRenewalDoc.emit(true);
          this.popUpRenewDocuments.show = false;
            }
        })
      }else{
        let data={
          id: this.popUpRenewDocuments.data.id,
          name: this.popUpRenewDocuments.data.name,
          bank: this.renewDocuments.value['bank'],
          number: this.renewDocuments.value['number'],
          files : this.renewDocuments.value['documents'],
          amount : this.renewDocuments.value['amount'],
          pass_journal_entry : this.renewDocuments.value['pass_journal_entry'],
          expiry_date : changeDateToServerFormat(this.renewDocuments.value['expiry_date']),
        }
        this._companyService.postCompanyRenewDocData(this.popUpRenewDocuments.data.id,data).subscribe((data)=>{      
          this.dataFromRenewalDoc.emit(true);
          this.popUpRenewDocuments.show = false;    
        })
      }
     
      
    }else{
      setAsTouched(this.renewDocuments)
    }
  }

  passJournalEntryChange(){
    if(this.renewDocuments.get('pass_journal_entry').value){
      setUnsetValidators(this.renewDocuments,'amount',[Validators.required,Validators.min(0.01)])
      setUnsetValidators(this.renewDocuments,'bank',[Validators.required]);      
      this.initialValues.bank = {label: this.defaultBank['name'],value:''}
      this.renewDocuments.get('bank').setValue(this.defaultBank['id'])
    }else{
      setUnsetValidators(this.renewDocuments,'amount',[Validators.nullValidator])
      setUnsetValidators(this.renewDocuments,'bank',[Validators.nullValidator])
      this.renewDocuments.get('bank').setValue(null)
      this.initialValues.bank={};
    }
  }

 
}
