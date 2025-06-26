import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { getBlankOption } from 'src/app/shared-module/utilities/helper-utils';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { NewTripV2Service } from '../../../../../api-services/trip-module-services/trip-service/new-trip-v2.service';
import { cloneDeep } from 'lodash';
import { changeDateTimeToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import moment from 'moment';
import { TokenExpireService } from 'src/app/core/services/token-expire.service';

@Component({
  selector: 'app-edit-route',
  templateUrl: './edit-route.component.html',
  styleUrls: ['./edit-route.component.scss']
})
export class EditRouteComponent implements OnInit {
  editRoute= new FormGroup({
    route_code:new FormControl(''),
    path:new FormControl([[]])
  })
  contactPersonList=[];
  ismultipleDestinationFormValid = new Subject();
  routeId = new Subject();
  routeDestinations = new Subject();
  customerId = new Subject();
  initialDetails={
    route_code:getBlankOption()
  }

  paths=[];
  officeStatus=0;
  multipleDestinationValid:boolean=true;
  tripId=''



  constructor(private dialogRef: DialogRef<boolean>, @Inject(DIALOG_DATA)  private data: any,private commonloaderservice:CommonLoaderService, 
  private _newTripV2Service:NewTripV2Service, private _tokenExpireService:TokenExpireService
  ) { }

  ngOnInit(): void {
    this.tripId = this.data['id']
    this.commonloaderservice.getHide();
    this.initialDetails.route_code={label:this.data['route_code'],value:''};
    this.editRoute.get('route_code').setValue(this.data['route_code'])
    this.paths=this.data['paths'];
    this.officeStatus = this.data['office_status']
    this.paths.forEach((destinations,inedx) => {
      if(inedx!=0)destinations['reach_time']= destinations['time']
    });
    setTimeout(() => {
      this.routeDestinations.next(this.paths);
      this.getTripRouteAndContactList(this.data['customer_id'])
    }, 100);
    this._tokenExpireService.observeTokenExpire.subscribe(isExpired=>{
      if(isExpired){
        this.dialogRef.close(false)
      }
    })
  }

  cancel(){
    this.dialogRef.close(false)
  }

  save(){
    if(this.multipleDestinationValid){
      let payLoad={
        paths:this.editRoute.value['path']
      }
      this._newTripV2Service.updateTripRoute(this.tripId,payLoad).subscribe(resp=>{
        this.dialogRef.close(true)
      })
    }else{
      this.ismultipleDestinationFormValid.next(this.multipleDestinationValid)
    }
  }

  getTripRouteAndContactList(id){
  this._newTripV2Service.getTripRouteAndContactList(id).subscribe(resp=>{
    this.contactPersonList = resp['result']['contacts']
  });
  }

  multipleDestinationFormData(e) {
    let destinations = [];
    this.multipleDestinationValid = e.isFormValid
    destinations = cloneDeep(e.formData)
    if (destinations.length > 0) {
      destinations.forEach((destination,index) => {
        if(index==0){
          destination['time'] = changeDateTimeToServerFormat(destination['time'] ? moment(destination['time']) : null);
        }else{
          destination['time'] = changeDateTimeToServerFormat(destination['reach_time'] ? moment(destination['reach_time']) : null)
        }
        delete destination.reach_time
        if (destination['checklist'].length > 0) {
          destination['checklist'].forEach(checkListItem => {
            if(typeof checkListItem['field_type']!='string')
            checkListItem['field_type'] = checkListItem['field_type']['data_type'];
            if(checkListItem['field_type']=='upload'){
              if(checkListItem['value'].length>0)
              checkListItem['value']= checkListItem['value'].map(val=>val.id)
            }
          });
        }
      });
    }
    if (e.isFormValid) {
      this.editRoute.get('path').setValue(destinations)
    }
  }


}
