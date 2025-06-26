import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormArray, AbstractControl, FormGroup, Validators } from '@angular/forms';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { Observable, Subscription } from 'rxjs';
import { OwnVehicleService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/own-vehicle-service';
import { AddEditOwnVehicleItemsComponent } from '../add-edit-own-vehicle-items/add-edit-own-vehicle-items.component';
import { Dialog } from '@angular/cdk/dialog';
import { DeleteOwnVehicleItemsComponent } from '../delete-own-vehicle-items/delete-own-vehicle-items.component';
import { PartyService } from 'src/app/modules/customerapp-module/api-services/master-module-services/party-service/party.service';
import { PartyType, VendorType } from 'src/app/core/constants/constant';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { setAsTouched, setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';

@Component({
  selector: 'app-vehicle-document-section-v2',
  templateUrl: './vehicle-document-section-v2.component.html',
  styleUrls: ['./vehicle-document-section-v2.component.scss'],
})
export class VehicleDocumentSectionV2Component implements OnInit, OnDestroy, AfterViewInit {
  documentList: any = [];
  @Input() vehicleDetailsForm: FormGroup;
  @Input() documentEditList: Observable<[]>;
  @Input() vehicleCatagory: Observable<any>;
  @Input() newPartyDetails: Observable<any>;
  @Input() isFormValid: Observable<boolean>;
  @Input() isFormSubmitted:Boolean=false;
  @Output() addNewParty=new EventEmitter()
  vendorList = []
  activeDoc = 0;
  $subscriptionList: Subscription[] = [];
  showAddPartyPopup: any = { name: '', status: false };
  partyNamePopup: string = '';
  insuranceType=[
    {
      value:'Third-party Liability Insurance',
      label:'Third-party Liability Insurance'
    },
    {
      value:'Comprehensive Insurance',
      label:'Comprehensive Insurance'
    },
    {
      value:'Zero Depreciation Cover',
      label:'Zero Depreciation Cover'
    }
  ]
  initialvalues={
    insuranceType:{}
  }
  constructor(
    private _fb: UntypedFormBuilder,
    private _commonloaderservice: CommonLoaderService,
    private _ownVehicleService: OwnVehicleService,
    public dialog: Dialog,
    private _partyService: PartyService,
    private activatedRoute: ActivatedRoute

  ) {
  }

  ngOnDestroy(): void {
    this._commonloaderservice.getShow();
    this.$subscriptionList.forEach(sub => {
      sub.unsubscribe();
    })
  }

  ngOnInit() {
    this._commonloaderservice.getHide();
    this.getVendorDetails();
  }

  ngAfterViewInit(): void {
    this.$subscriptionList.push(this.vehicleCatagory.subscribe(resp => {
      this._ownVehicleService.getDefaultCertificatesDocuments(resp).subscribe((response) => {
        if (response['result']) {
          this.addVehicleDocumentControls(response['result']);
        }
      });
    }));

    if (this.documentEditList) {
      this.$subscriptionList.push(this.documentEditList.subscribe(docs => {
        this.addVehicleDocumentControls(docs);
        this.activatedRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
          if (paramMap.has('tab')&& paramMap.get('tab')=='Certificates') {
            this.documentList.forEach((doc, index) => {
              if (paramMap.get('name') == doc.name){
                this.activeDoc = index
                setTimeout(() => {
                  const target = document.getElementById('certificate-id'+doc.name);
                  target?.scrollIntoView({ behavior: 'smooth' });
                 }, 500);
              }
                
            });
          }
        });
      }));
    
    }
    this.$subscriptionList.push( this.isFormValid.subscribe(isValid=>{
     if(!isValid)
      setAsTouched(this.vehicleDetailsForm)
    }))
    this.$subscriptionList.push(this.newPartyDetails.subscribe(val=>{
     if(val)
     this.addPartyToOption(val)
    }))


  }

  addVehicleDocumentControls(items: any = []) {
    const documents = this.vehicleDetailsForm.get('documents') as UntypedFormArray;
    documents.controls = [];
    this.documentList = [];
    items.forEach((document, index) => {
      documents.push(this.addVehicleDocumentControl(document));
      this.documentList.push(document);
      if(index==1){
        this.initialvalues.insuranceType={label:document['insurance_type'],value:''}
      }
    });
  }

  addVehicleDocumentControl(document: any) {
    return this._fb.group({
      id: [
        document.id || null
      ],
      name: [document.name || ''],
      number: [document.number || ''],
      vendor: [document.vendor ? document.vendor.id : null],
      vehdor_label: document.vendor ? document.vendor.name : '',
      expiry_date: [document.expiry_date || null],
      issue_date: [document.issue_date || null],
      files: [document.files || []],
      is_expiry_mandatory:[document.is_expiry_mandatory],
      insurance_type:[document.insurance_type||'']
    });
  }


  changeDocument(index) {
    this.activeDoc = index;
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

  fileDeleted(id, i) {
    let file = (this.vehicleDetailsForm.get('documents') as UntypedFormArray).at(i)
    let documents = file.get('files').value;
    file.get('files').setValue(documents.filter(doc => doc.id != id))
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }


  deleteDocuments(name, index) {
    const dialogRef = this.dialog.open(DeleteOwnVehicleItemsComponent, {
      data: {
        message: 'Are you sure you want to delete this Certificate?',
        name: name,
        type:'Certificate',
        url: 'vehicle/documents/delete/',
        vehicle_type: this.vehicleDetailsForm.get('vehicle_category').value
      },
      width: '650px',
      maxWidth: '90%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      if (result) {
        const documents = this.vehicleDetailsForm.get('documents') as UntypedFormArray;
        this.documentList.splice(index, 1);
        documents.controls.splice(index, 1);
        this.changeDocument(index - 1);
        documents.updateValueAndValidity()
      }
      dialogRefSub.unsubscribe();
    });

  }

  fileUploader(e, i) {
    let data = this.vehicleDetailsForm.get('documents') as UntypedFormArray
    let documents = data.at(i).get('files').value
    e.forEach((element) => {
      element['presigned_url'] = element['url']
      documents.push(element);
    });

  }

  getVendorDetails() {
    this._partyService.getPartyList(VendorType.Othres, PartyType.Vendor).subscribe((response) => {
      this.vendorList = response.result;
    });
  }

  editCertificate(documentName,index){
    const dialogRef = this.dialog.open(AddEditOwnVehicleItemsComponent, {
      data: {
        heading: 'Vehicle Certificate',
        label: 'Vehicle Certificate',
        editData:documentName,
        validationUrl:'vehicle/documents/exists/',
        documentList: this.vehicleDetailsForm.value['documents'].map(documents => documents['name']).filter(name=>name!=documentName),
        url: 'vehicle/documents/update/',
        vehicle_type: this.vehicleDetailsForm.get('vehicle_category').value
      },
      width: '650px',
      maxWidth: '90%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      if (result) {
        const documents = (this.vehicleDetailsForm.get('documents') as UntypedFormArray).at(index);
        documents.get('name').setValue(result)
        this.documentList[index].name=result
        dialogRefSub.unsubscribe();
      }

    });
  }

  addCertifiacte() {
    const dialogRef = this.dialog.open(AddEditOwnVehicleItemsComponent, {
      data: {
        heading: 'Vehicle Certificate',
        label: 'Vehicle Certificate',
        editData: '',
        expiryLabel:'Make Certificate Expiry Date Mandatory',
        isExpiry:true,
        documentList: this.vehicleDetailsForm.value['documents'].map(documents => documents['name']),
        url: 'vehicle/documents/add/',
        validationUrl:'vehicle/documents/exists/',
        vehicle_type: this.vehicleDetailsForm.get('vehicle_category').value
      },
      width: '650px',
      maxWidth: '90%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      if (result) {
        const documents = this.vehicleDetailsForm.get('documents') as UntypedFormArray;
        const item = {
          name: result['name'],
          number: '',
          expiry_date: null,
          issue_date: null,
          vendor: '',
          vehdor_label: '',
          files: [],
          insurance_type:'',
          is_expiry_mandatory:result['is_expiry_mandatory'],
        };
        documents.push(this.addVehicleDocumentControl(item));
        this.documentList.push(item);
        dialogRefSub.unsubscribe();
        this.activeDoc = documents.length-1;

      }

    });

  }

  /* After closing the party modal to clear all the values */
  closePartyPopup() {
    this.showAddPartyPopup = { name: '', status: false };
  }

  /* For  Opening the Party Modal */
  openAddPartyModal($event) {
    if ($event)
     this.addNewParty.emit({ name: this.partyNamePopup, status: true ,isFrom : 'certificates'})
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
      const documents = this.vehicleDetailsForm.get('documents') as UntypedFormArray;
      documents.at(this.activeDoc).get('vendor').setValue($event.id);
      documents.at(this.activeDoc).get('vehdor_label').setValue($event.label);
    }
  }

}
