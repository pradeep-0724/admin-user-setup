import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { BehaviorSubject } from 'rxjs';
import { VehicleService } from '../../../../api-services/master-module-services/vehicle-services/vehicle.service';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { setAsTouched, setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { PartyType, VendorType } from 'src/app/core/constants/constant';
import { PartyService } from 'src/app/modules/customerapp-module/api-services/master-module-services/party-service/party.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-renew-document-popup',
  templateUrl: './renew-document-popup.component.html',
  styleUrls: ['./renew-document-popup.component.scss'],

})
export class RenewDocumentPopupComponent implements OnInit {

  renewDocuments: UntypedFormGroup;
  @Input() popUpRenewDocuments;
  @Input() isMarketVehicle;
  @Input() isOwnVehicle :boolean= false;
  apiError = '';
  paymentAccountList = [];
  initialValues = {
    bank: {}
  };
  defaultBank: any;
  patchFileUrls = new BehaviorSubject([]);
  @Output() dataFromRenewalDoc = new EventEmitter<any>();
  vendorList = [];
  isSubAsset : boolean = true;
  isExpiryMandatory=false;
  constructor(
    private _fb: UntypedFormBuilder, private _vehicleService: VehicleService, private _popupBodyScrollService: popupOverflowService,
    private  _partyService: PartyService,private apiHandler: ApiHandlerService
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.isSubAsset = this.popUpRenewDocuments.data['isSubAsset']
    this.getVendorDetails()
    this.isExpiryMandatory = this.popUpRenewDocuments.data['is_expiry_mandatory']
    // this.renewDocuments.get('issue_date').setValue(new Date(dateWithTimeZone()));
    this.renewDocuments.get('number').setValue(this.popUpRenewDocuments.data.number);
    this.renewDocuments.get('apiText').setValue(this.popUpRenewDocuments.data.apiText);
    this.onDocumentNumberChange()
  }


  buildForm() {
    this.renewDocuments = this._fb.group({
      number: ['',],
      expiry_date: [null],
      issue_date: [null],
      note: [
        ''
      ],
      files: [[]],
      documents: [[]],
      amount: [0],
      remark: [
        ''
      ],
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
        data : this.renewDocuments.value
      }
      if (this.isMarketVehicle) {
        this.dataFromRenewalDoc.emit(data);
      } else {
        if(this.isOwnVehicle){
          this.dataFromRenewalDoc.emit(data)
        }else{
          this.apiHandler.handleRequest(this._vehicleService.postVehicleDocument(this.popUpRenewDocuments.data.id, this.renewDocuments.value), `${this.popUpRenewDocuments?.data?.name} renewed successfully!`).subscribe(
            {
              next: () => {
                this.dataFromRenewalDoc.emit(true);
              }
            }
          )
        }
        this.popUpRenewDocuments.show = false;
        this._popupBodyScrollService.popupHide()
      }
    } else {
      setAsTouched(this.renewDocuments)
    }
  }


}



