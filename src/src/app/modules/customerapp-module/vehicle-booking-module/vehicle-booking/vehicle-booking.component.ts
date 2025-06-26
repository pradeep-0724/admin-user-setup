import { Component, OnInit } from '@angular/core';
import * as moment from "moment";
import { ViewChild,TemplateRef,} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CalendarEvent, CalendarView,} from 'angular-calendar';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { VehicleBookingService } from '../../api-services/vehicle-booking-service/vehicle-booking.service';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
interface MyEvent extends CalendarEvent {
  data:{
    vehicle_available:string,
    vehicle_booked:string,
    vehicle_in_trip:string,
    vehicle_active:string
  }
}

interface VehicleBooking {
    deleteVehicle:boolean,
    cancel:boolean,
    addVehicleBooking:boolean,
    editVehicleBooking:boolean

}


@Component({
  selector: 'app-vehicle-booking',
  templateUrl: './vehicle-booking.component.html',
  styleUrls: ['./vehicle-booking.component.scss']
})
export class VehicleBookingComponent implements OnInit {

  @ViewChild('modalContent',{static: true}) modalContent: TemplateRef<any>;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date(dateWithTimeZone());
  datatoChild =new BehaviorSubject({}) ;
  events: MyEvent[];
  vehicleBookingPermission = Permission.vehicle_booking.toString().split(',');
  selectedDate;
  addVehiclePopup ={
    show:false,
    data:{}
  }
  isVehicleListOpen = false;
  vehicleBookingList = [];
  screenType=ScreenType;
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;
  constructor(private _vehicleBooking:VehicleBookingService,private _analytics:AnalyticsService, private _popupBodyScrollService:popupOverflowService) {
    this.viewDate = new Date(dateWithTimeZone())

  }

  ngOnInit(): void {
    this.getData(this.viewDate);
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.VEHICLEBOOKING,this.screenType.ADD,"Navigated");
    // this.getVehicleBookingDetails(changeDateToServerFormat(this.viewDate.toString()))
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    let monthYearSelected =  moment(date).format('MMM YYYY');
    let  viewDateValue = moment(this.viewDate).format('MMM YYYY');
    let selectedDate =  moment(date).format();
    if(monthYearSelected ==viewDateValue){
      this._popupBodyScrollService.popupActive();
      this.selectedDate =date;
      this.getVehicleBookingDetails(changeDateToServerFormat(selectedDate))
    }
  }

  closeOpenMonthViewDay() {
    this.getData(this.viewDate)
  }

  getData(viewDate){
      let date = new Date(viewDate);
      let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      // let todaysDate = moment(new Date(dateWithTimeZone())).format();
      // let selectedDate =  moment(lastDay).format();
      // if(todaysDate < selectedDate){
      //    lastDay =  new Date(dateWithTimeZone());
      //  }
    if(firstDay<=lastDay){
      this._vehicleBooking.getVehicleBookingDetails(changeDateToServerFormat(firstDay.toString()),changeDateToServerFormat(lastDay.toString())).subscribe(data=>{
       this.events=[];
        let items=[];
         items=data['result']
         if(items.length>0){
           items.forEach(itemValue => {
           let date=[]
             date=itemValue['date'].split('-');
             this.events.push({
               start: new Date(Number(date[0]),Number(date[1])-1,Number(date[2])),
               title: '',
               data:{
                vehicle_available:itemValue['vehicle_available'].toString(),
                vehicle_booked:itemValue['vehicle_booked'].toString(),
                vehicle_in_trip:itemValue['vehicle_in_trip'].toString(),
                vehicle_active:itemValue['vehicle_active'].toString(),
                   },
                   resizable: {
                    beforeStart: true,
                    afterEnd: true,
                  }
             })
           });
     }
      })
    }
  }

  refreshData(e){
      if(e){
        this.getData(this.viewDate)
      }
  }

  addBooking(){
   this.addVehiclePopup.data={};
   this.addVehiclePopup.show = true;
   this._popupBodyScrollService.popupActive();
  }

  popupOverflowHide(){
    this._popupBodyScrollService.popupHide()
   }
  dataFromVehicleBooking(data:VehicleBooking){

    this.addVehiclePopup.data={};
    if(data.addVehicleBooking){
      this.getData(this.viewDate);
      if(this.isVehicleListOpen){
        this.getVehicleBookingDetails(changeDateToServerFormat(this.selectedDate))
      }
    }

    if(data.deleteVehicle){
      this.getData(this.viewDate);
      this.getVehicleBookingDetails(changeDateToServerFormat(this.selectedDate))
    }


  }

  getVehicleBookingDetails(date){
    this.isVehicleListOpen = true ;
    this._vehicleBooking.getVehicleBooking(date).subscribe(response=>{
      this.vehicleBookingList = response['result'];
      if(this.vehicleBookingList.length>0){
      }
    });
  }

  editVehicleBooking(data){
    this.addVehiclePopup.show= true;
    this.addVehiclePopup.data = data;
  }
  isActiveDay(date){
    return changeDateToServerFormat(date)==changeDateToServerFormat(this.selectedDate)
   }

}
