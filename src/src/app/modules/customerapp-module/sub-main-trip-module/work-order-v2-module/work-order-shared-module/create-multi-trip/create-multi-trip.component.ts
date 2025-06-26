import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, UntypedFormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { WorkOrderV2Service } from '../../../../api-services/trip-module-services/work-order-service/work-order-v2.service';
import { TokenExpireService } from 'src/app/core/services/token-expire.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';

@Component({
  selector: 'app-create-multi-trip',
  templateUrl: './create-multi-trip.component.html',
  styleUrls: ['./create-multi-trip.component.scss']
})
export class CreateMultiTripComponent implements OnInit {
  
  tripListUrl='/trip/new-trip/list';
  isShowWarning=false;
  multiTripForm : FormGroup;
  todaysDate = new Date();

  constructor(private dialogRef: DialogRef<boolean>, @Inject(DIALOG_DATA) private data: any, private _tokenExpireService:TokenExpireService,
   private commonloaderservice: CommonLoaderService, private _route:Router,private _workOrderV2Service:WorkOrderV2Service,
   private _fb : FormBuilder) {
    this.commonloaderservice.getHide();
   }

  ngOnInit(): void {
    this.multiTripForm = this._fb.group({
      wo_id : this.data.id,
      multiple_job : this._fb.array([])
    })
    this._tokenExpireService.observeTokenExpire.subscribe(isExpired=>{
      if(isExpired){
        this.dialogRef.close(false)
      }
    })
    
    this.buildMultiTrip()    
  }

  buildMultiTrip(){    
    let trips = this.multiTripForm.get('multiple_job') as UntypedFormArray;
    trips.controls = [];
    trips.push(this.addMultitrip())
  }

  addMultitrip(){    
    return this._fb.group({
      num_trips : [0,[TransportValidator.minLimitWOValidator(1), TransportValidator.maxLimitWOValidator(25)]],
      date : [this.todaysDate]
    })
  }

  addMoreMultiTripRow(){
    let trips = this.multiTripForm.get('multiple_job') as UntypedFormArray;
    trips.push(this.addMultitrip())
  }

  removeTrip(index){
    let trips = this.multiTripForm.get('multiple_job') as UntypedFormArray;
    trips.removeAt(index);
    this.checkJobs();
  }


  checkJobs(){
    let trips = this.multiTripForm.get('multiple_job') as UntypedFormArray;
    if(this.data.workorderUnitStatus.billing_type==10){
      let totalTrips: number =0;
      trips.value.forEach(element => {
        totalTrips += Number(element['num_trips']);
      });
      this.isShowWarning=(this.data.workorderUnitStatus.total_units - this.data.workorderUnitStatus.utilized_units-totalTrips)<0;
    }
  }

  cancel() {
    this.dialogRef.close(false)
  }

  save() {
    let form = this.multiTripForm
    form.value['multiple_job'].forEach((val)=>{
      val['date'] = changeDateToServerFormat(val['date'])
      val['num_trips'] = Number(val['num_trips'])
    })
    if(form.valid){
      this.commonloaderservice.getShow();
      this._workOrderV2Service.createMultipleTrips(form.value).subscribe(resp=>{
        this.commonloaderservice.getHide();
        this._route.navigate([getPrefix()+this.tripListUrl])
        this.dialogRef.close(true)
      });
    }else{
      form.markAllAsTouched()
    }

  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

}
