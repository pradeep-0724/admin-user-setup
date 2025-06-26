import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormArray, AbstractControl, UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { Observable, Subject, Subscription } from 'rxjs';
import { CompanyModuleServices } from 'src/app/modules/customerapp-module/api-services/company-service/company-module-service.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import {CountryIdService } from 'src/app/core/services/countryid.service';
import { getCountryDetails } from 'src/app/shared-module/utilities/countrycode-utils';
import { EditEmployeeService } from '../../edit-employee-module/edit-employee-services/edit-employee-service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Dialog } from '@angular/cdk/dialog';
import { AddEditDocumentV2Component } from '../add-edit-document-v2/add-edit-document-v2.component';
import { PartyService } from 'src/app/modules/customerapp-module/api-services/master-module-services/party-service/party.service';
import { PartyType, VendorType } from 'src/app/core/constants/constant';
import { setAsTouched, setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';

@Component({
  selector: 'edit-emloyee-document',
  templateUrl: './edit-document.component.html',
  styleUrls: ['./edit-document.component.scss']
})

export class EmployeeDocumentComponent implements OnInit {
  @Input() isEdit = false
  @Input() editValues: Subject<any> = new Subject();
  @Input() employee_details: FormGroup;
  @Output() addNewParty=new EventEmitter();
  @Input() newPartyDetails: Observable<any>;
  @Input() isValid: Observable<boolean>;
  vendorList = []
  $subscriptionList: Subscription[] = [];
  showAddPartyPopup: any = { name: '', status: false };
  partyNamePopup: string = '';
  id: any = '';
  documentsList: any = [];
  activeDoc = 0;
  countryList: any;
  initialValues = {
    country: [],
  };
  currency_type;
  employee_id = '';
  countryId: string = ''
  defaultCountry: string = '';
  editDocDetails = {}
  prenName = ''
  certificateErrMsg = ''

  constructor(private _editEmployeeService: EditEmployeeService,
    private _fb: UntypedFormBuilder,
    private currency: CurrencyService,
    private _companyModuleService: CompanyModuleServices,
    private _countryId: CountryIdService,
    private _popupBodyScrollService: popupOverflowService,
    private route: ActivatedRoute,
    private dialog: Dialog,
    private _partyService: PartyService,

  ) {
    this.countryId = this._countryId.getCountryId();
    this.defaultCountry = getCountryDetails(this.countryId).country
  }



  ngOnInit() {

    this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.editDocDetails['description'] = paramMap.get('description');
      }
      
    });

    this.currency_type = this.currency.getCurrency();
    this._companyModuleService.getCountry().subscribe((stateData) => {
      if (stateData != undefined) {
        this.countryList = stateData.results;
      }
    });

    if (this.isEdit) {
      this.editValues.subscribe(data => {
        this.buildDocument(data);
        this.patchState(data)
        this.selectDocTab();
        this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
          if (paramMap.has('name')){
            data.forEach((doc, index) => {
              if (paramMap.get('name') == doc.name)
                this.activeDoc = index
              
                setTimeout(() => {
                  const target = document.getElementById('certificate-id'+doc.name);
                  target?.scrollIntoView({ behavior: 'smooth' });
                 }, 500);
            });
          }
          
        });
      });
    } else {
      this._editEmployeeService.getDefaultDocuments().subscribe((response) => {
        if (isValidValue(response['result']) && response['result'].length) {
          this.buildDocument(response['result']);
        }
      });
    }
    this.$subscriptionList.push(this.newPartyDetails.subscribe(val=>{
      if(val)
      this.addPartyToOption(val)
     }))
     this.getVendorDetails();

    this.$subscriptionList.push(
      this.isValid.subscribe(isValid=>{
        if(!isValid)
        setAsTouched(this.employee_details)
      })
    )

  }

  getVendorDetails() {
    this._partyService.getPartyList(VendorType.Othres, PartyType.Vendor).subscribe((response) => {
      this.vendorList = response.result;
    });
  }

  patchState(data: any) {
    this.initialValues = {
      country: [],
    };
    
    if (data.length) {
      data.forEach((element, index) => {
        element['country'] ? this.initialValues.country.push({ label: element['country'] }) : this.initialValues.country.push({ label: this.defaultCountry })
      });
    }
    else {
      this.initialValues.country.push({ label: this.defaultCountry })
    }
  }

  buildDocument(data: Array<any> = []) {
    this.documentsList = [];
    this.initialValues = {
      country: [],
    };
    const documents = this.employee_details.get('documents') as UntypedFormArray;
    documents.controls = [];
    data.forEach((item, index) => {
      documents.push(this.addDocument(item));
      this.documentsList.push(item);
      this.initialValues.country.push({ label: this.defaultCountry })
    });

  }


  addDocument(item) {    
    return this._fb.group({
      id: [item.id || undefined],
      name: [item.name],
      number: [item.number || ''],
      issue_date: [item.issue_date || null],
      expiry_date:[item.expiry_date || null],
      country: [item.country || this.defaultCountry],
      history: [[]],
      files: [item.files || []],
      vendor : [item.vendor ? item.vendor.id : null ],
      vendor_label : [ item.vendor ? item.vendor.display_name : ''],
      is_expiry_mandatory:[item.is_expiry_mandatory],
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


  
  submitAddMoreForm(result) {
    this._editEmployeeService.addEmployeeDocument({
      name:result['field_name'],
      is_expiry_mandatory:result['is_expiry_mandatory']
    }).subscribe((res) => {
      const documents = this.employee_details.controls['documents'] as UntypedFormArray;
      const item = this._fb.group({
        name: result['field_name'],
        number: '',
        expiry_date: null,
        country: this.defaultCountry,
        issue_date: null,
        files: [[]],
        vendor : null,
        vendor_label : '',
        is_expiry_mandatory:result['is_expiry_mandatory']
  
      });
      documents.push(item);
      item['history'] = [];
      item['files'] = [];
      this.documentsList.push({
        name:result['field_name'],
        is_expiry_mandatory:result['is_expiry_mandatory']
      });
      this.initialValues.country.push({ label: this.defaultCountry })
      this.activeDoc = documents.length -1;
    })
    this._popupBodyScrollService.popupHide()

  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  changeDocument(i) {
    this.activeDoc = i;
  }

  onChangeNumber(form:FormGroup){
    const number = form.value['number']
    const isExpiryMandatory=form.value['is_expiry_mandatory']
    if(number.trim() && isExpiryMandatory){
     setUnsetValidators(form,'expiry_date',[Validators.required])
    }else{
     setUnsetValidators(form,'expiry_date',[Validators.nullValidator])
    }
   }


  confirmButtonForDelete(e) {
    const documents = this.employee_details.get('documents') as UntypedFormArray;
    if (e) {
      let name = documents.at(this.activeDoc).get('name').value;
      let data = {
        name: name
      }
      this._editEmployeeService.deleteEmployeeDocument(data).subscribe((res) => {
      })
      this.documentsList.splice(this.activeDoc, 1);
      documents.controls.splice(this.activeDoc, 1);
      this.changeDocument(this.activeDoc - 1);
      documents.updateValueAndValidity();
    }
  }

  selectDocTab() {
    this.documentsList.forEach((element, index) => {
      if (this.editDocDetails.hasOwnProperty('description') && this.editDocDetails['description'].includes(element['name']) && this.editDocDetails['description'].includes(element['number'])) {
        this.changeDocument(index);
      }
    });
  }

  popupOverflowActive() {
    this._popupBodyScrollService.popupActive()
  }
  popupOverflowHide() {
    this._popupBodyScrollService.popupHide()
  }




  updateDocument(name) {
    const documents = this.employee_details.get('documents') as UntypedFormArray;
    let data = {
      new_name: name,
      prev_name: this.prenName
    }
    this._editEmployeeService.updateEmployeeDocument(data).subscribe((res) => {
      documents.at(this.activeDoc).get('name').setValue(name);
      this.documentsList[this.activeDoc] = {
        name: name
      }
    })

  }

  openAddEditComponent(isEdit, isDelete,index) {
    let names = [];
    const documents = this.employee_details.controls['documents'] as UntypedFormArray;
    documents.controls.forEach((element, ind) => {
      names.push((element.get('name').value.toLowerCase()))
    });
    if(isEdit){
      this.prenName = documents.at(index).get('name').value;
    }else{
      this.prenName=''
    }
    const dialogRef = this.dialog.open(AddEditDocumentV2Component, {
      data: {
        documentNames: names,
        isEdit: isEdit,
        isDelete: isDelete,
        prenName:this.prenName

      },
      width: '650px',
      maxWidth: '90%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: any) => {
      if (result.isValid) {
        if (result.isEdit) {
          this.updateDocument(result.field_name)
        } else {
          this.submitAddMoreForm(result)
        }
        dialogRefSub.unsubscribe();
      }
    });
  }

  deleteDocument() {
    const dialogRef = this.dialog.open(AddEditDocumentV2Component, {
      data: {
        isEdit: false,
        isDelete: true
      },
      width: '500px',
      maxWidth: '90%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: any) => {
      if (result.isDelete) {        
        this.confirmButtonForDelete(true)
        dialogRefSub.unsubscribe();
      }
    });
  }
  closePartyPopup() {
    this.showAddPartyPopup = { name: '', status: false };
  }

  /* For  Opening the Party Modal */
  openAddPartyModal($event) {
    if ($event)
     this.addNewParty.emit({ name: this.partyNamePopup, status: true })
  }

  /* Adding the entered value to the list */
  addValueToPartyPopup(event) {
    if (event) {
      this.partyNamePopup = event;
    }
  }

  /* For Displaying the party name in the subfield  */
  addPartyToOption($event) {
    if ($event.status) {
      this.getVendorDetails();
      const documents = this.employee_details.get('documents') as UntypedFormArray;
      documents.at(this.activeDoc).get('vendor').setValue($event.id);
      documents.at(this.activeDoc).get('vendor_label').setValue($event.label);
    }
  }
}
