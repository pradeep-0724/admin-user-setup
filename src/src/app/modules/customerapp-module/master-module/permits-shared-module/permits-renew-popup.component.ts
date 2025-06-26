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
  selector: 'app-permits-renew-popup',
  templateUrl: './permits-renew-popup.component.html',
  styleUrls: ['./permits-renew-popup.component.scss']
})
export class PermitsRenewPopupComponent implements OnInit {

  renewDocuments: UntypedFormGroup;
  @Input() renewPermitsData;
  apiError = '';
  patchFileUrls = new BehaviorSubject([]);
  @Output() renewPermit = new EventEmitter<any>();
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
    this.getVendorDetails()    
    this.isExpiryMandatory = this.renewPermitsData.data['expiry_date_mandatory']
    this.renewDocuments.get('permit_id').setValue(this.renewPermitsData.data.permit_id);
    this.renewDocuments.get('id').setValue(this.renewPermitsData.data.id);
    this.onDocumentNumberChange()
  }


  buildForm() {
    this.renewDocuments = this._fb.group({
      id : [''],
      permit_id: ['',],
      date: [null],
      documents: [[]],
      permit_issuer :[null]
    });

  }

  getVendorDetails() {
    this._partyService.getPartyList(VendorType.Othres, PartyType.Vendor).subscribe((response) => {
      this.vendorList = response.result;
    });
  }

  onDocumentNumberChange(){
    const docNumber= this.renewDocuments.get('permit_id').value
    if(docNumber.trim() && this.isExpiryMandatory){
      setUnsetValidators(this.renewDocuments,'date',[Validators.required])
    }else{
      setUnsetValidators(this.renewDocuments,'date',[Validators.nullValidator])
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
    this.renewPermit.emit(false);
    this.renewPermitsData.show = false;
    this._popupBodyScrollService.popupHide();
  }

  onOkButtonClick() {
    if (this.renewDocuments.valid) {
      this.renewDocuments.value['date'] = changeDateToServerFormat(this.renewDocuments.value['date']);
      let data ={
        isClosed : true,
        data : this.renewDocuments.value,
      }
      this.renewPermit.emit(data);
      this.renewPermitsData.show = false;
      this._popupBodyScrollService.popupHide()
    } else {
      setAsTouched(this.renewDocuments)
    }
  }


}

