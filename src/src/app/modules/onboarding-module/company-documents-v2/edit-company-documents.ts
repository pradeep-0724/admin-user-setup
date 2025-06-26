import { Component, Input, OnInit} from '@angular/core';
import { UntypedFormGroup, UntypedFormArray, AbstractControl, Validators, UntypedFormBuilder, FormGroup } from '@angular/forms';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { isValidValue} from 'src/app/shared-module/utilities/helper-utils';
import { Subject } from 'rxjs';
import { CompanyModuleServices } from 'src/app/modules/customerapp-module/api-services/company-service/company-module-service.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { RevenueService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/revenue-service/revenue.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { CountryIdService } from 'src/app/core/services/countryid.service';
import { getCountryDetails } from 'src/app/shared-module/utilities/countrycode-utils';
import {  setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { EditEmployeeService } from 'src/app/modules/customerapp-module/master-module/employee-module/edit-employee-module/edit-employee-services/edit-employee-service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';

@Component({
  selector: 'edit-company-documents',
  templateUrl: './edit-company-documents.component.html',
  styleUrls: ['./edit-company-documents.scss']
})

export class EditCompanyDocumentComponent implements OnInit {
  @Input() isEdit = false
  @Input() editValues:Subject<any> = new Subject();
  @Input() employee_details:FormGroup;
  id: any='';
  showModal: Boolean = false;
  addMoreForm: UntypedFormGroup;
  documentsList: any = [];
  activeDoc = 0;
  staticOptions: any = {};
  countryList: any;
  initialValues = {
    country: [],
    bank: [],
  };
  validityDuration = []
  documentHistoryToggle = [];
  employeeIndex = -1;
  prefixUrl = '';
  popupInputData = {
    'msg': ' Are you sure you want to delete this document?',
    'type': 'document-warning',
    'show': false
  }

  popupInputDataDelete = {
    'msg': ' Are you sure you want to delete this document?',
    'type': 'warning',
    'show': false
  }

  documentsData: any = [];
  currency_type;
  paymentAccountList = [];
  employee_id = '';
  countryId: string = ''
  defaultCountry: string = '';
  defaultBank;
  editDocDetails = {}
  newlyAddedDoc=''
  constructor(private _editEmployeeService: EditEmployeeService,
    private _fb: UntypedFormBuilder,
    private currency: CurrencyService,
    private _companyModuleService: CompanyModuleServices,
    private _revenueService: RevenueService,
    private _prefixUrl: PrefixUrlService,
    private _countryId: CountryIdService,
    private _popupBodyScrollService: popupOverflowService,
    private scrolltotop : ScrollToTop
    
  ) {
    this.countryId = this._countryId.getCountryId();
    this.defaultCountry = getCountryDetails(this.countryId).country
  }

  popupOverflowActive() {
    this._popupBodyScrollService.popupActive()
  }
  popupOverflowHide() {

    this._popupBodyScrollService.popupHide()
  }

  ngOnInit() {
    this.scrolltotop.scrollToTop()
    this.prefixUrl = this._prefixUrl.getprefixUrl();
    this.currency_type = this.currency.getCurrency();
    this.getenantBank();
    this._companyModuleService.getCountry().subscribe((stateData) => {
      if (stateData != undefined) {
        this.countryList = stateData.results;
      }
    });

    this._revenueService.getAccounts().subscribe((response) => {
      this.paymentAccountList = response.result
    });

    this.addMoreForm = this._fb.group({
      'field_title': ['', [Validators.required]],
      to_all: true
    });

    if(this.isEdit){
      this.editValues.subscribe(data=>{        
        this.buildDocument(data.certificates);
        this.patchState(data.certificates)
      });
    }
  }

  patchState(data: any) {
    this.initialValues = {
      country: [],
      bank: [],
    };
    if (data.length) {

      data.forEach((element, index) => {
        
        if (isValidValue(element.bank)) {
          this.initialValues.bank[index]={ label: element?.bank?.name, value: element?.bank?.id };
          let documet = (this.employee_details.get('documents') as UntypedFormArray).at(index) as FormGroup;
          documet.controls['bank'].setValue(element.bank.id ? element.bank.id : null);
        }
      });
    }
    else {
      this.initialValues.country.push({label: this.defaultCountry })
      this.initialValues.bank.push({})
    }
  }

  buildDocument(data: Array<any> = []) {    
    this.documentsList = [];
    this.initialValues = {
      country: [],
      bank: [],
    };

    const documents = this.employee_details.get('documents') as UntypedFormArray;
    documents.controls = [];
    data.forEach((item, index) => {
      documents.push(this.addDocument(item));
      this.documentsList.push(item);
      this.initialValues.country.push({ label: this.defaultCountry })
      this.initialValues.bank.push({})
    });
    this.employee_details.get('documents').valueChanges.subscribe((data)=>{
      data.forEach((form)=>{
        form.expiry_date = changeDateToServerFormat(form.expiry_date)
      })
    })
    
  }

  deleteDocuments(index) {
      this.employeeIndex = index;
      if (this.id) {
        this.popupInputData.show = true;
      } else {
        this.popupInputDataDelete.show = true;
      }
  }

  addDocument(item) {    
    return this._fb.group({
      id: [item.id || undefined],
      name: [item.name],
      number: [item.number || ''],
      expiry_date: [changeDateToServerFormat(item.expiry_date) || null],
      amount: [item.amount || 0],
      bank: [item.bank?.id || ''],
      pass_journal_entry: [item.pass_journal_entry || false],
      files:[item.files||[]],
    });
  }

  fileUploader(e, i) {
    let document = (this.employee_details.get('documents') as UntypedFormArray).at(i);
    let file = document.get('files').value;
    e.forEach((element) => {
      element['presigned_url'] = element['url'];
        if (!Object.isExtensible(file)) {
        file = [...file];
        document.get('files').setValue(file);
      }
      file.push(element);
    });    
  }
  
  fileDeleted(id, i) {
    let file = (this.employee_details.get('documents') as UntypedFormArray).at(i)
    let documents = file.get('files').value;
    file.get('files').setValue(documents.filter(doc => doc.id != id))
  }

  submitAddMoreForm() {
      if(this.newlyAddedDoc.trim()){
        const documents = this.employee_details.controls['documents'] as UntypedFormArray;
        const item =this._fb.group( {
          name: this.newlyAddedDoc,
          number: '',
          expiry_date: changeDateToServerFormat(null),
          amount: 0,
          pass_journal_entry: false,
          bank: null,
          files: [[]],
          id:''
        });
        documents.insert(0,item);
        item['files'] = [];
        this.documentsList.splice(0,0,{name:this.newlyAddedDoc});
        this.documentHistoryToggle.push([false]);
        this.initialValues.country.push({ label: this.defaultCountry })
        this.initialValues.bank.splice(0,0,[]);
        this.addMoreForm.reset();
        this.showModal = false;
        this.newlyAddedDoc=''
        this._popupBodyScrollService.popupHide()
      }
     
  }


  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  changeDocument(i) {    
    if(i<0){
      this.activeDoc = 0;
    }else{
      this.activeDoc = i;
    }
  }

  confirmButton(e) {
    const documents = this.employee_details.controls['documents'] as UntypedFormArray;
    if (e.isTrue) {
      let form = documents.at(this.employeeIndex) as UntypedFormGroup;
      let payLoad = {
        document_id: form.value['id'],
      }
      this._editEmployeeService.deleteEmployeeDocuments(this.id, payLoad).subscribe(data => {
      this.documentsList.splice(this.employeeIndex, 1);
      documents.controls.splice(this.employeeIndex, 1);
      this.changeDocument(this.employeeIndex - 1);
      documents.updateValueAndValidity();
      });

    }
  }

  confirmButtonForDelete(e) {
    const documents = this.employee_details.get('documents') as UntypedFormArray;
    if (e) {
      this.documentsList.splice(this.employeeIndex, 1);
      documents.controls.splice(this.employeeIndex, 1);
      this.changeDocument(this.employeeIndex - 1);
      documents.updateValueAndValidity();
    }
  }




  passJournalEntryChange(i) {
    let documet = (this.employee_details.get('documents') as UntypedFormArray).at(i);
    if (documet.get('pass_journal_entry').value) {
      setUnsetValidators(documet, 'amount', [Validators.required, Validators.min(0.01)]);
      setUnsetValidators(documet, 'bank', [Validators.required])
      if(this.defaultBank){
        this.initialValues.bank[i] = {label: this.defaultBank['name'],value:''}
        documet.get('bank').setValue(this.defaultBank['id'])
      }
    } else {
      setUnsetValidators(documet, 'amount', [Validators.nullValidator]);
      setUnsetValidators(documet, 'bank', [Validators.nullValidator])
      this.initialValues.bank[i] = {}
      documet.get('bank').setValue(null)
    }
  }



  getenantBank(){
    this._revenueService.getTenantBank().subscribe((data)=>{
      this.defaultBank = data['result'];
    })
  }
}
