import { Dialog } from '@angular/cdk/dialog';
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormArray, AbstractControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { VendorType, PartyType } from 'src/app/core/constants/constant';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { PartyService } from 'src/app/modules/customerapp-module/api-services/master-module-services/party-service/party.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { setAsTouched, setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { OwnAssetsService } from 'src/app/modules/customerapp-module/api-services/master-module-services/assets-service/assets-service.service';
import { DeleteOwnAssetsItemComponent } from '../delete-own-assets-item/delete-own-assets-item.component';
import { AddEditOwnAssetsItemComponent } from '../add-edit-own-assets-item/add-edit-own-assets-item.component';

@Component({
  selector: 'app-assets-certificate',
  templateUrl: './assets-certificate.component.html',
  styleUrls: ['./assets-certificate.component.scss']
})
export class AssetsCertificateComponent implements OnInit, OnDestroy, AfterViewInit {
  documentList: any = [];
  @Input() assetsDetailsForm: FormGroup;
  @Input() documentEditList: Observable<[]>;
  @Input() catagory: Observable<any>;
  @Input() newPartyDetails: Observable<any>;
  @Input() isFormValid: Observable<boolean>;
  @Output() addNewParty=new EventEmitter()
  vendorList = []
  activeDoc = 0;
  $subscriptionList: Subscription[] = [];
  showAddPartyPopup: any = { name: '', status: false,from:'' };
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
    private _ownAssetService: OwnAssetsService,
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
    this.$subscriptionList.push(this.catagory.subscribe(resp => {
      this._ownAssetService.getDefaultCertificatesDocuments(resp).subscribe((response) => {
        if (response['result']) {
          this.addAssetDocumentControls(response['result']);
        }
      });
    }));

    if (this.documentEditList) {
      this.$subscriptionList.push(this.documentEditList.subscribe(docs => {
        this.addAssetDocumentControls(docs);
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
      setAsTouched(this.assetsDetailsForm)
    }))
    this.$subscriptionList.push(this.newPartyDetails.subscribe(val=>{
     if(val)
     this.addPartyToOption(val)
    }))


  }

  addAssetDocumentControls(items: any = []) {
    const certificates = this.assetsDetailsForm.get('certificates') as UntypedFormArray;
    certificates.controls = [];
    this.documentList = [];
    items.forEach((document, index) => {
      certificates.push(this.addAssetDocumentControl(document));
      this.documentList.push(document);
      if(index==1){
        this.initialvalues.insuranceType={label:document['insurance_type'],value:''}
      }
    });
  }

  addAssetDocumentControl(document: any) {
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
    let file = (this.assetsDetailsForm.get('certificates') as UntypedFormArray).at(i)
    let certificates = file.get('files').value;
    file.get('files').setValue(certificates.filter(doc => doc.id != id))
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }


  deleteDocuments(name, index) {
    const dialogRef = this.dialog.open(DeleteOwnAssetsItemComponent, {
      data: {
        message: 'Are you sure you want to delete this Certificate?',
        name: name,
        type:'Certificate',
        url: 'asset/documents/delete/',
        asset_type: this.assetsDetailsForm.get('category').value
      },
      width: '650px',
      maxWidth: '90%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      if (result) {
        const certificates = this.assetsDetailsForm.get('certificates') as UntypedFormArray;
        this.documentList.splice(index, 1);
        certificates.controls.splice(index, 1);
        this.changeDocument(index - 1);
        certificates.updateValueAndValidity()
      }
      dialogRefSub.unsubscribe();
    });

  }

  fileUploader(e, i) {
    let data = this.assetsDetailsForm.get('certificates') as UntypedFormArray
    let certificates = data.at(i).get('files').value
    e.forEach((element) => {
      element['presigned_url'] = element['url']
      certificates.push(element);
    });

  }

  getVendorDetails() {
    this._partyService.getPartyList(VendorType.Othres, PartyType.Vendor).subscribe((response) => {
      this.vendorList = response.result;
    });
  }

  editCertificate(documentName,index){
    const dialogRef = this.dialog.open(AddEditOwnAssetsItemComponent, {
      data: {
        heading: 'Asset Certificate',
        label: 'Asset Certificate',
        editData:documentName,
        validationUrl:'asset/documents/exists/',
        documentList: this.assetsDetailsForm.value['certificates'].map(certificates => certificates['name']).filter(name=>name!=documentName),
        url: 'asset/documents/update/',
        asset_type: this.assetsDetailsForm.get('category').value
      },
      width: '650px',
      maxWidth: '90%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      if (result) {
        const certificates = (this.assetsDetailsForm.get('certificates') as UntypedFormArray).at(index);
        certificates.get('name').setValue(result)
        this.documentList[index].name=result
        dialogRefSub.unsubscribe();
      }

    });
  }

  addCertifiacte() {
    const dialogRef = this.dialog.open(AddEditOwnAssetsItemComponent, {
      data: {
        heading: 'Asset Certificate',
        label: 'Asset Certificate',
        editData: '',
        expiryLabel:'Make Certificate Expiry Date Mandatory',
        isExpiry:true,
        documentList: this.assetsDetailsForm.value['certificates'].map(certificates => certificates['name']),
        url: 'asset/documents/add/',
        validationUrl:'asset/documents/exists/',
        asset_type: this.assetsDetailsForm.get('category').value
      },
      width: '650px',
      maxWidth: '90%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      if (result) {
        const certificates = this.assetsDetailsForm.get('certificates') as UntypedFormArray;
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
        certificates.push(this.addAssetDocumentControl(item));
        this.documentList.push(item);
        dialogRefSub.unsubscribe();
        this.activeDoc = certificates.length-1;

      }

    });

  }


  /* For  Opening the Party Modal */
  openAddPartyModal($event) {
    if ($event)
     this.addNewParty.emit({ name: this.partyNamePopup, status: true ,from:'certificate'})
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
      const certificates = this.assetsDetailsForm.get('certificates') as UntypedFormArray;
      certificates.at(this.activeDoc).get('vendor').setValue($event.id);
      certificates.at(this.activeDoc).get('vehdor_label').setValue($event.label);
    }
  }

}
