import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { NewTripV2Service } from '../../../../api-services/trip-module-services/trip-service/new-trip-v2.service';
import { changeDateTimeToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import moment from 'moment';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { TokenExpireService } from 'src/app/core/services/token-expire.service';

@Component({
  selector: 'app-bdp-status-change',
  templateUrl: './bdp-status-change.component.html',
  styleUrls: ['./bdp-status-change.component.scss']
})
export class BdpStatusChangeComponent implements OnInit {
  bdpStatusForm: FormGroup;
  bdpDetails: any;
  tripId = ''
  constructor(private _fb: FormBuilder, private dialogRef: DialogRef<boolean>, @Inject(DIALOG_DATA) private data: any, private _newTripV2Service: NewTripV2Service,private commonloaderservice:CommonLoaderService, private _tokenExpireService:TokenExpireService
  ) { }

  ngOnInit(): void {
    this.tripId = this.data.tripId;
    this.bdpDetails = this.data.bdpDetails;
    this.bdpStatusForm = this._fb.group({
      date:moment(new Date(dateWithTimeZone())),
      container_number: [this.bdpDetails.container_number, TransportValidator.bdpContainerNumberValidator]
    });
    this.bdpStatusForm.markAsUntouched();
    this._tokenExpireService.observeTokenExpire.subscribe(isExpired=>{
      if(isExpired){
        this.dialogRef.close(false)
      }
    })
  }

  cancel() {
    this.commonloaderservice.getHide()
    this.dialogRef.close(false)
  }

  addErrorClass(controlName: AbstractControl) {
		return TransportValidator.addErrorClass(controlName);
	}

  save() {
    let form = this.bdpStatusForm;
    form.value['date'] = changeDateTimeToServerFormat(form.value['date'])
    this.commonloaderservice.getShow()
    if (form.valid) {
      this._newTripV2Service.postBdpMilestone(this.tripId, form.value).subscribe(resp => {
        this.commonloaderservice.getHide()
        this.dialogRef.close(true)
      })
    }else{
      form.markAllAsTouched();
    }
  }
  
}
