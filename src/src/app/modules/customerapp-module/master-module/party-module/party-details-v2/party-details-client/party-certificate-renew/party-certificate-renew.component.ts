import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { setAsTouched } from 'src/app/shared-module/utilities/form-utils';
import { PartyDetailsClientService } from '../party-details-client.service';

@Component({
  selector: 'app-party-certificate-renew',
  templateUrl: './party-certificate-renew.component.html',
  styleUrls: ['./party-certificate-renew.component.scss']
})
export class PartyCertificateRenewComponent implements OnInit {
  renewDocuments: UntypedFormGroup;
  @Input() popUpRenewDocuments;
  apiError = '';
  patchFileUrls = new BehaviorSubject([]);
  @Output() dataFromRenewalDoc = new EventEmitter<any>();
  vendorList = [];

  constructor(
    private _fb: UntypedFormBuilder, private _popupBodyScrollService: popupOverflowService,
    private _partyDetailsClientService: PartyDetailsClientService,
  ) {
  }

  ngOnInit() {
    this.buildForm();
  }


  buildForm() {
    this.renewDocuments = this._fb.group({
      number: [this.popUpRenewDocuments.data.number, Validators.required],
      name: [this.popUpRenewDocuments.data.name],
      expiry_date: [null],
      issue_date: [null],
      files: [[]],
    });

  }


  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  fileUploader(filesUploaded) {
    let data = this.renewDocuments.get('files').value
    filesUploaded.forEach((element) => {
      data.push(element.id);
    });
  }

  fileDeleted(deletedFileIndex) {
    let data = this.renewDocuments.get('files').value;
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
      this._partyDetailsClientService.renewCertificate(this.popUpRenewDocuments.data['id'], this.renewDocuments.value).subscribe(resp => {
        this.dataFromRenewalDoc.emit(true);
        this.popUpRenewDocuments.show = false;
        this._popupBodyScrollService.popupHide()
      })

    } else {
      setAsTouched(this.renewDocuments)
    }
  }


}