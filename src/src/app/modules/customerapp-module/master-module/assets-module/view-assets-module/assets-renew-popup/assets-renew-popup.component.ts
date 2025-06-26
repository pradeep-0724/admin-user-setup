import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { PartyType, VendorType } from 'src/app/core/constants/constant';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { PartyService } from 'src/app/modules/customerapp-module/api-services/master-module-services/party-service/party.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { setAsTouched, setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';

@Component({
  selector: 'app-assets-renew-popup',
  templateUrl: './assets-renew-popup.component.html',
  styleUrls: ['./assets-renew-popup.component.scss']
})
export class AssetsRenewPopupComponent implements OnInit {

  renewDocuments: UntypedFormGroup;
  @Input() popUpRenewDocuments;
  apiError = '';
  patchFileUrls = new BehaviorSubject([]);
  @Output() dataFromRenewalDoc = new EventEmitter<any>();
  vendorList = [];
  isAttachment : boolean = true;
  isExpiryMandatory=false;
  constructor(
    private _fb: UntypedFormBuilder, private _popupBodyScrollService: popupOverflowService,
    private  _partyService: PartyService
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.isAttachment = this.popUpRenewDocuments.data['isAttachment']
    this.getVendorDetails()
    this.isExpiryMandatory = this.popUpRenewDocuments.data['is_expiry_mandatory']
    this.renewDocuments.get('number').setValue(this.popUpRenewDocuments.data.number);
    this.renewDocuments.get('apiText').setValue(this.popUpRenewDocuments.data.apiText);
    this.onDocumentNumberChange()
  }


  buildForm() {
    this.renewDocuments = this._fb.group({
      number: ['',],
      expiry_date: [null],
      issue_date: [null],
      files: [[]],
      documents: [[]],
      apiText: [''],
      vendor :['']
    });

  }

  getVendorDetails() {
    this._partyService.getPartyList(VendorType.Othres, PartyType.Vendor).subscribe((response) => {
      this.vendorList = response.result;
    });
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
    this._popupBodyScrollService.popupHide();
  }

  onOkButtonClick() {
    if (this.renewDocuments.valid) {
      this.renewDocuments.value['expiry_date'] = changeDateToServerFormat(this.renewDocuments.value['expiry_date']);
      this.renewDocuments.value['issue_date'] = changeDateToServerFormat(this.renewDocuments.value['issue_date']);
      this.renewDocuments.value['files'] = this.renewDocuments.value['documents'];
      let data ={
        isClosed : true,
        data : this.renewDocuments.value,
      }
      this.dataFromRenewalDoc.emit(data);
      this.popUpRenewDocuments.show = false;
      this._popupBodyScrollService.popupHide()
    } else {
      setAsTouched(this.renewDocuments)
    }
  }


}

