import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditEmployeeService } from '../../edit-employee-services/edit-employee-service';
import { TSStoreKeys } from 'src/app/core/constants/store-keys.constants';
import { StoreService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/store.service';

import { UntypedFormGroup, UntypedFormArray, AbstractControl, Validators, UntypedFormBuilder } from '@angular/forms';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { isValidValue, getBlankOption } from 'src/app/shared-module/utilities/helper-utils';
import { BehaviorSubject } from 'rxjs';
import { CompanyModuleServices } from 'src/app/modules/customerapp-module/api-services/company-service/company-module-service.service';
import { EmployeeService } from '../../../../../api-services/master-module-services/employee-service/employee-service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { RevenueService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/revenue-service/revenue.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { CountryIdService } from 'src/app/core/services/countryid.service';
import { getCountryDetails } from 'src/app/shared-module/utilities/countrycode-utils';
import { setAsTouched } from 'src/app/shared-module/utilities/form-utils';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';

@Component({
  selector: 'edit-emloyee-document',
  templateUrl: './edit-document.component.html',
  styleUrls: ['./edit-document.component.scss']
})

export class EmployeeDocumentComponent implements OnInit {
  id: any;
  showModal: Boolean = false;
  documentsForm: any;
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

  patchFileUrls: Array<BehaviorSubject<Array<any>>> = []
  documentsData: any = [];
  popUpRenewDocuments = {
    show: false,
    data: {}
  }
  currency_type;
  paymentAccountList = [];
  employee_id = '';
  countryId: string = ''
  defaultCountry: string = '';

  constructor(private _editEmployeeService: EditEmployeeService,
    private _stateService: StoreService,
    private _router: Router,
    private _fb: UntypedFormBuilder,
    private currency: CurrencyService,
    private _companyModuleService: CompanyModuleServices,
    private _employeeService: EmployeeService,
    private _routeParams: ActivatedRoute,
    private _revenueService: RevenueService,
    private _prefixUrl: PrefixUrlService,
    private _countryId: CountryIdService,
    private _popupBodyScrollService: popupOverflowService


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
    this.prefixUrl = this._prefixUrl.getprefixUrl();
    this.currency_type = this.currency.getCurrency();
    let urlString = location.href.split('/');
    if (urlString[7] == "edit") {
      this.id = urlString[8];
    }
    this.buildForm();
    this._companyModuleService.getCountry().subscribe((stateData) => {
      if (stateData != undefined) {
        this.countryList = stateData.results;
      }
    });
    this._routeParams.params.subscribe((params: any) => {
      if (params.employee_id)
        this.id = params.employee_id;
      this.employee_id = params.employee_id;
    })

    this._revenueService.getAccounts().subscribe((response) => {
      this.paymentAccountList = response.result
    });

    this.getFormValues();

  }

  getFormValues() {
    if (this.id) {
      this._editEmployeeService.getAllEditDetails(this.id).subscribe((response) => {
        if (response !== undefined) {
          if (response.documents) {
            this.documentsData = response;
            if (isValidValue(response.documents) && response.documents.length) {
              this.buildDocument(response.documents);
              this.patchState(response);
              this.patchDocuments(response);
            }

          }
        }
      });
    }
  }



  patchState(data: any) {
    this.initialValues = {
      country: [],
      bank: [],
    };
    if (data.documents.length) {

      data.documents.forEach((element, index) => {
        element['state_of_issue'] ? this.initialValues.country.push({ label: element['state_of_issue'] }) : this.initialValues.country.push({ label: this.defaultCountry })

        this.documentHistoryToggle.push([false]);
        if (element['history'].length > 0) {
          element['history'].forEach(element => {
            this.documentHistoryToggle[index].push(false);
          });
        }
        if (isValidValue(element.bank)) {
          this.initialValues.bank.push({ label: element.bank.name, value: element.bank.id });
          this.documentsForm.controls.documents.controls[index].controls['bank'].setValue(element.bank.id ? element.bank.id : '');
        } else {
          this.initialValues.bank.push(getBlankOption());
        }
      });
    }
    else {
      this.initialValues.country.push({ label: this.defaultCountry })
      this.initialValues.bank.push({})
    }
  }

  buildDocument(data: Array<any> = []) {
    this.documentsList = [];
    this.initialValues = {
      country: [],
      bank: [],
    };
    const documents = this.documentsForm.controls['documents'] as UntypedFormArray;
    documents.controls = [];
    data.forEach((item, index) => {
      const form = this.addDocument(item);
      documents.push(form);
      this.documentsList.push({});
      this.documentsList[index] = item;
      this.initialValues.country.push({ label: this.defaultCountry })
      this.initialValues.bank.push({})
    });
  }

  deleteDocuments(index) {
    if (index >= 1) {
      this.employeeIndex = index;
      if (this.id) {
        this.popupInputData.show = true;
      } else {
        this.popupInputDataDelete.show = true;
      }
    }
  }

  addDocument(item) {
    return this._fb.group({
      id: [item.id || undefined],
      to_all: [(item.to_all == undefined) || (item.to_all == false) ? false : true],
      name: [item.name || ''],
      number: [item.number || ''],
      issue_date: [item.issue_date || new Date(dateWithTimeZone())],
      expiry_date: [item.expiry_date || null],
      state_of_issue: [item.state_of_issue || this.defaultCountry],
      remind_me: [item.remind_me || null],
      reminder: [item.reminder || null],
      note: [item.note || '', Validators.maxLength(255)],
      validity: [item.validity || ''],
      amount: [item.amount || 0],
      bank: [item.bank || ''],
      history: [[]],
      pass_journal_entry: [item.pass_journal_entry || false],
      files: [[]]
    });
  }

  fileUploader(filesUploaded, i) {
    let data = this.documentsForm.get('documents') as UntypedFormArray
    let documents = data.at(i).get('files').value
    let files=[];
      this.patchFileUrls[i].subscribe(val=>{
      files =val
    })
    filesUploaded.forEach((element) => {
      documents.push(element.id);
      element['presigned_url'] =  element['url'];
      files.push(element)
    });
    this.patchFileUrls[i].next(files)
  }

  fileDeleted(deletedFileIndex, i) {
    let data = this.documentsForm.get('documents') as UntypedFormArray
    let documents = data.at(i).get('files').value;
    documents.splice(deletedFileIndex, 1);
    let files=[];
      this.patchFileUrls[i].subscribe(val=>{
      files =val
    });
    files.splice(deletedFileIndex, 1);
    this.patchFileUrls[i].next(files)
  }

  patchDocuments(data) {
    if (data.documents.length > 0) {
      let documentsArray = this.documentsForm.get('documents') as UntypedFormArray
      const documents = data.documents;
      documents.forEach((element, index) => {
        this.patchFileUrls.push(new BehaviorSubject([]))
        let pathUrl = [];
        element.files.forEach(ele => {
          documentsArray.at(index).get('files').value.push(ele.id);
          pathUrl.push(ele);
        })
        this.patchFileUrls[index].next(pathUrl);
      });
    }
  }


  buildCeritificateParams(documents: Array<any> = []) {
    documents.forEach(item => {
      item.expiry_date = changeDateToServerFormat(item.expiry_date);
      item.issue_date = changeDateToServerFormat(item.issue_date);
    });
    return documents;
  }


  submitAddMoreForm(form: UntypedFormGroup) {
    if (form.valid) {
      const documents = this.documentsForm.controls['documents'] as UntypedFormArray;
      const item = {
        name: this.addMoreForm.controls['field_title'].value,
        to_all: this.addMoreForm.controls['to_all'].value,
        number: '',
        expiry_date: '',
        state_of_issue: this.defaultCountry,
        reminder: '',
        note: '',
        issue_date: null,
        amount: 0,
        history: [[]],
        pass_journal_entry: false,
        bank: null,
        files: [[]]
      };
      documents.push(this.addDocument(item));
      item['history'] = [];
      item['files'] = [];
      this.documentsList.push(item);
      this.documentHistoryToggle.push([false]);
      this.initialValues.country.push({ label: this.defaultCountry })
      this.initialValues.bank.push([]);
      this.patchFileUrls.push(new BehaviorSubject([]))
      this.addMoreForm.reset();
      this.showModal = false;
      this._popupBodyScrollService.popupHide()
    } else {
      setAsTouched(form)
      console.log(form.errors);
    }
  }

  buildForm() {
    this.documentsForm = this._fb.group({
      documents: this._fb.array([])
    });
    this.addMoreForm = this._fb.group({
      'field_title': ['', [Validators.required]],
      to_all: true
    });
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  changeDocument(i) {
    this.activeDoc = i;
  }


  submitDocumentsForm(form) {
    let documents = this.documentsForm.controls['documents'] as UntypedFormArray;
    documents.controls.forEach((doc, i) => {
      this.passJournalEntryChange(i)
    });
    let params = this.buildCeritificateParams(form.value.documents);

    if (form.valid) {
      if (this.isDataEmpty(form.value)) {
        this._editEmployeeService.editEmployeeDocument.next(false);
        this._employeeService.addTimeline.isDocumentsSaved = false;
        if (this.employee_id) {
          this._router.navigate([this.prefixUrl +
            '/onboarding/employee/add/' + 'bank/' + this.id
          ]);
        } else {
          this._router.navigate([this.prefixUrl +
            '/onboarding/employee/edit/' + this.id + '/bank'
          ]);
        }
      } else {
        if (this.id) {
          this._stateService.setToStore(TSStoreKeys.master_employee_add_documents, params);
          this._editEmployeeService.editEmployeeDocuments(this.id, params).subscribe((response) => {
            this._editEmployeeService.editEmployeeDocument.next(true);
            this._employeeService.addTimeline.isDocumentsSaved = true;
            if (this.employee_id) {
              this._router.navigate([this.prefixUrl +
                '/onboarding/employee/add/' + 'bank/' + this.id
              ]);
            } else {
              this._router.navigate([this.prefixUrl +
                '/onboarding/employee/edit/' + this.id + '/bank'
              ]);
            }

          });
        }
      }

    }
    else {
      setAsTouched(form);
      console.log(form.error);
    }
  }


  confirmButton(e) {
    const documents = this.documentsForm.controls['documents'] as UntypedFormArray;
    if (e.isTrue) {
      let form = documents.at(this.employeeIndex) as UntypedFormGroup;
      let payLoad = {
        document_id: form.value['id'],
        to_all: e.to_all
      }
      this._editEmployeeService.deleteEmployeeDocuments(this.id, payLoad).subscribe(data => {
        this.documentsList.splice(this.employeeIndex, 1);
        documents.controls.splice(this.employeeIndex, 1);
        this.changeDocument(this.employeeIndex - 1);
        this.patchFileUrls.splice(this.employeeIndex, 1);
        this.employeeIndex = -1;
      });

    }
  }

  confirmButtonForDelete(e) {
    const documents = this.documentsForm.controls['documents'] as UntypedFormArray;
    if (e) {
      this.documentsList.splice(this.employeeIndex, 1);
      documents.controls.splice(this.employeeIndex, 1);
      this.changeDocument(this.employeeIndex - 1);
      this.patchFileUrls.splice(this.employeeIndex, 1);
      this.employeeIndex = -1;
    }
  }

  goToLink(url: string) {
    window.open(url, "_blank");
  }

  getExt(url, filename) {
    if (filename && url) {
      var ext = filename.split('.').pop();
      if (ext == filename) {
        return "";
      }
      if (ext == 'pdf') {
        return "../assets/img/fileuploadIcons/pdf_img.png";
      }
      else if (this.checkDocument(ext)) {
        return "../assets/img/fileuploadIcons/doc_img.jpg";
      }
      else if (this.checkXXls(ext)) {
        return "../assets/img/fileuploadIcons/xls_img.jpg";
      }
      else if (ext == 'txt') {
        return "../assets/img/fileuploadIcons/txt_img.jpg";
      }
      else if (ext == 'ppt' || ext == 'pptx') {
        return "../assets/img/fileuploadIcons/ppt_img.jpg";
      } else {
        return url;
      }
    }
  }

  checkDocument(ext) {
    let document = ["doc", "docx", "odt", "rtf"];
    return document.includes(ext)
  }

  checkFileType(fileType) {
    let regx = "[^\\s]+(.*?)\\.(jpg|jpeg|png|JPG|JPEG|PNG|csv|CSV|doc|DOC|pdf|PDF|docx|DOCX|ppt|pptx|xls|xlsx|txt|json|odt|rtf)$"
    if (fileType.match(regx)) {
      return true
    } else {
      return false
    }

  }

  checkXXls(ext) {
    let document = ["xls", "xlsx", "csv", "json"];
    return document.includes(ext)
  }

  dataFromRenewalDoc(e) {
    this.popUpRenewDocuments.data = {};
    if (e) {
      this.getFormValues();
      this.popUpRenewDocuments.show = false;

    }
  }


  passJournalEntryChange(i) {
    if (this.documentsForm.controls.documents.controls[i].get('pass_journal_entry').value) {
      this.documentsForm.controls.documents.controls[i].get('amount').setValidators([Validators.required, Validators.min(0.01)]);
      this.documentsForm.controls.documents.controls[i].get('bank').setValidators([Validators.required]);
    } else {
      this.documentsForm.controls.documents.controls[i].get('amount').setValidators([Validators.nullValidator]);
      this.documentsForm.controls.documents.controls[i].get('bank').setValidators([Validators.nullValidator]);
      this.initialValues.bank[i]={};
      this.documentsForm.controls.documents.controls[i].get('bank').setValue(null)
    }
    this.documentsForm.controls.documents.controls[i].get('amount').updateValueAndValidity();
    this.documentsForm.controls.documents.controls[i].get('bank').updateValueAndValidity();
  }

  renewDocuments(event) {
    this.popUpRenewDocuments.data = event
    this.popUpRenewDocuments.show = true;
  }


  finishForm(form) {
    let documents = this.documentsForm.controls['documents'] as UntypedFormArray;
    documents.controls.forEach((doc, i) => {
      this.passJournalEntryChange(i)
    });
    let params = this.buildCeritificateParams(form.value.documents);

    if (form.valid) {
      if (this.isDataEmpty(form.value)) {
        this._editEmployeeService.editEmployeeDocument.next(false);
        this._employeeService.addTimeline.isDocumentsSaved = false;
        this._router.navigate([this.prefixUrl +
          '/onboarding/employee/view'
        ]);
      } else {
        if (this.id) {
          this._stateService.setToStore(TSStoreKeys.master_employee_add_documents, params);
          this._editEmployeeService.editEmployeeDocuments(this.id, params).subscribe((response) => {
            this._editEmployeeService.editEmployeeDocument.next(true);
            this._employeeService.addTimeline.isDocumentsSaved = true;
            this._router.navigate([this.prefixUrl +
              '/onboarding/employee/view'
            ]);
          });
        }
      }


    }
    else {
      setAsTouched(form);
      console.log(form.error);
    }
  }


  isDataEmpty(data) {
    let filterDoc = data.documents.filter(dc => {
      let name = (dc.name) ? true : false;
      let number = (dc.number) ? true : false;
      let state_of_issue = (dc.issue_date) ? true : false;
      let expiry_date = (dc.expiry_date) ? true : false;
      let files = (dc.files.length > 0) ? true : false;

      return  number ||
        state_of_issue ||
        expiry_date || files || name
    });
    return filterDoc.length > 0 ? false : true;
  }

}
