import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehicleService } from '../../api-services/master-module-services/vehicle-services/vehicle.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { setAsTouched } from 'src/app/shared-module/utilities/form-utils';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { CalenderService } from '../../api-services/calendar-services/calender-service.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-book-vehicle',
  templateUrl: './book-vehicle.component.html',
  styleUrls: ['./book-vehicle.component.scss']
})
export class BookVehicleComponent implements OnInit {
  bookVehicle:FormGroup
  vehicleList=[]
  bookingFor=[{
    label:'Jobs',
    value:'0',
  },
  {
    label:'Maintenance',
    value:'1',
  }];
  initialValues={
    vehicle:{},
    booking:{}
  }
  isEdit=false;
  constructor(private dialogRef: DialogRef<boolean>, @Inject(DIALOG_DATA) private dialogData: any, private _fb: FormBuilder,private _vehicleService:VehicleService,private _calendarServcie:CalenderService,
  private apiHandler: ApiHandlerService){}

  ngOnInit(): void {
    this.bookVehicle=this._fb.group({
      start_date:[new Date(dateWithTimeZone()),[Validators.required]],
      end_date:[null,[Validators.required]],
      vehicle:[null,[Validators.required]],
      block_for:[null,[Validators.required]]
    })
    this.getVehicleListOwn();
    if(this.dialogData['id']){
      this._calendarServcie.getVehicleBooked(this.dialogData['id']).subscribe(resp=>{
        let editDetails=resp['result']['block']
        this.initialValues.booking= this.bookingFor[editDetails['block_for']]
        this.initialValues.vehicle={label:editDetails.vehicle['name'],value:''}
        editDetails['vehicle']= editDetails['vehicle']['id']
        this.bookVehicle.patchValue(editDetails)
        this.isEdit=true
      })
    }
  }

  cancel(){
    this.dialogRef.close(false)
  }

  save(){
    let form = this.bookVehicle;
    if(form.valid){
      form.value['start_date']= changeDateToServerFormat( form.value['start_date'])
      form.value['end_date']= changeDateToServerFormat( form.value['end_date']);
      let vehicle = this.vehicleList.find(vehicle=>vehicle['id']==form.value['vehicle']).reg_number
      if(this.dialogData['id']){        
        this.apiHandler.handleRequest(this._calendarServcie.putbookVehicle(this.dialogData['id'], form.value), `${vehicle} blocked successfully!`).subscribe(
          {
            next: () => {
              this.dialogRef.close(true)
            }
          })
      }else{
        this.apiHandler.handleRequest(this._calendarServcie.bookVehicle(form.value), `${vehicle} blocked successfully!`).subscribe(
          {
            next: () => {
              this.dialogRef.close(true)
            }
          })
      }
   
    }else{
      setAsTouched(form)
    }
   

  }

  getVehicleListOwn(){
    this._vehicleService.getVehicleListOwn().subscribe(resp=>{
    this.vehicleList=resp['result']
    })
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }



}
