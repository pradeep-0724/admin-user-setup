import { Component, OnDestroy, OnInit } from '@angular/core';
import { DropDownType } from '../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2-interface';
import { FormControl, Validators } from '@angular/forms';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import moment from 'moment';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { VehicleService } from '../../api-services/master-module-services/vehicle-services/vehicle.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Dialog } from '@angular/cdk/dialog';
import { BookVehicleComponent } from '../book-vehicle/book-vehicle.component';
import { CalenderService } from '../../api-services/calendar-services/calender-service.service';
import { DeleteAlertComponent } from 'src/app/shared-module/delete-alert-module/delete-alert/delete-alert.component';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';

@Component({
  selector: 'app-calender-v2',
  templateUrl: './calender-v2.component.html',
  styleUrls: ['./calender-v2.component.scss']
})
export class CalenderV2Component implements OnInit,OnDestroy {

  constructor( private _setHeight:SetHeightService ,private _vehicleService:VehicleService ,private dialog:Dialog ,private _calendarServcie:CalenderService,private _analytics:AnalyticsService,private _loader:CommonLoaderService) { }
  vehicleCatagory = new FormControl('-1', Validators.required);
  selectSpecification = new FormControl('', Validators.required);
  search = new FormControl('', Validators.required);
  calendarDate = new FormControl();
  isOpen = false;
  queryparems={
   category:'-1',
   specification:'',
   start_date:'',
   end_date:'',
   search:'',
   next_cursor:''
  }
  tabSelectionList: Array<DropDownType> = [
    {
      label: "All Vehicle",
      value: "-1",
    },
    {
      label: "Crane",
      value: "1",
    },
    {
      label:"Trailer Head",
      value:"3"
    },
    {
      label: "AWP",
      value: "2",
    },
    {
      label: "Others",
      value: "0",
    }
  ];
  dateRange = ''
  specificationList=[];

  currentDate = new Date(dateWithTimeZone());
  startAdEndDate={
    start:new Date(),
    end:new Date(),
  }
  daysOfWeek=[];
  todaysdate= new Date(dateWithTimeZone());
  searchVal=''
  weekLength=[0,1,2,3,4,5,6]
  calenderdata=[];
  isLoading=false;
  screenType=ScreenType;
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;
  ngOnInit(): void {
    this._loader.getHide();
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.CALENDAR,this.screenType.VIEW,"Navigated");
    this.calendarDate.setValue(this.currentDate)
    this.updateWeekRange();
    this._setHeight.setTableHeight2(['.calendar-filter'],'calendar-table',0)
    this.search.valueChanges.pipe(debounceTime(500),distinctUntilChanged()).subscribe(val=>{
     this.searchValue(val)
    })
    this.getCalenderData();
  }

  ngOnDestroy(): void {
    this._loader.getShow();
  }

  previousWeek() {
   this.currentDate =new Date(moment(this.startAdEndDate.start).subtract(7, 'days').toDate())
   this.updateWeekRange();
   this.getCalenderData();
   this.calendarDate.setValue(null)
  }

  nextWeek() {
    this.currentDate =new Date(moment(this.startAdEndDate.end).add(1, 'days').toDate())  
    this.updateWeekRange();
    this.getCalenderData();
    this.calendarDate.setValue(null)

  }

  getWeekRange(date) {
    const firstDay=new Date(date);
    const lastDay=new Date(date);
    lastDay.setDate(lastDay.getDate() + 6);
    this.daysOfWeek = [];
    for (let i = 0; i < 7; i++) {
        const day = new Date(firstDay);
        day.setDate(firstDay.getDate() + i);
        this.daysOfWeek.push(day);
    }   
    return {
      start: firstDay,
      end: lastDay
    };
  }

  formatDate(date) {
    const day = date.getDate();
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const month = monthNames[date.getMonth()];
    return `${day} - ${month}`;
  }

  updateWeekRange() {
    this.startAdEndDate= this.getWeekRange(this.currentDate)
    const weekRange = this.getWeekRange(this.currentDate);
    const startFormatted = this.formatDate(weekRange.start);
    const endFormatted = this.formatDate(weekRange.end);
    this.dateRange = `${startFormatted} - ${endFormatted}`;
  }

  dateSelected(){
   this.currentDate =new Date(this.calendarDate.value)
   this.updateWeekRange();
   this.getCalenderData();
  }

  getdate(day){
    return day.getDate()
  }

  getDay(day){
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    return days[day.getDay()];
  }
  getActiveDate(day){
    return changeDateToServerFormat(day)==changeDateToServerFormat(this.todaysdate.toDateString())
  }

  getVehicleSpecifications() {
    this.specificationList =[];
    if(this.vehicleCatagory.value !='-1')
    this._vehicleService.getVehicleSpecifications(this.vehicleCatagory.value).subscribe((response: any) => {
      this.specificationList = response.result;
    });
  }

  onChangeVehicleCategory(){
    this.selectSpecification.setValue('');
    this.getVehicleSpecifications();
    this.getCalenderData();
  }

  onScroll(event) {
    const container = document.querySelector('#calendar-table');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoading && this.queryparems.next_cursor?.length > 0) {
      this.onScrollGetCalendarData(this.queryparems);
    }
  }

  onScrollGetCalendarData(params){
    this.isLoading = true;
    this._calendarServcie.getCalendarList(params).subscribe(data => {
      this.calenderdata.push(...data['result'].calendar)
      params.next_cursor = data['result'].next_cursor;
      this.isLoading = false;
    })
  }

  getCalenderData(){
    this.queryparems={
      category:this.vehicleCatagory.value,
      specification:this.getSpecificationId(),
      start_date:changeDateToServerFormat(this.startAdEndDate.start.toDateString()),
      end_date:changeDateToServerFormat(this.startAdEndDate.end.toDateString()),
      search:this.searchVal,
      next_cursor:''
     }
     this._calendarServcie.getCalendarList(this.queryparems).subscribe(resp=>{
      this.calenderdata = resp['result']['calendar']
      this.queryparems.next_cursor=resp['result']['next_cursor']
     })
  }

  onchageSpecification(){
    this.getCalenderData();
  }

  searchValue(val){
   this.searchVal=val;
   this.getCalenderData();
  }

  getSpecificationId(){
   const specification= this.specificationList.find(spec=> spec.specification==this.selectSpecification.value)
   if(specification) return specification['id']
   return ''
    
  }

  bookVehicle(){
      const dialogRef = this.dialog.open(BookVehicleComponent, {
        data : {},
        width: '500px',
        maxWidth: '90%',
        closeOnNavigation: true,
        disableClose: true,
        autoFocus: false
      });
      let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => { 
        if(result){
          this._analytics.addEvent(this.analyticsType.CREATED,this.analyticsScreen.VEHICLEBOOKING,this.screenType.ADD,"Created");
          this.getCalenderData();
        }  
        dialogRefSub.unsubscribe();
      });
  }


  getVehicleType(data){
   let vehicleType=data.vehicle_type
   return vehicleType.toLowerCase()
  }

  taskEvent(e){
    if(e['type']=="blocked"){
      this.bookedOperation(e)
    }
  }

  bookedOperation(e){
    if(e['operation']=='delete'){
      const dialogRef = this.dialog.open(DeleteAlertComponent, {
        data : {
          message:'Are you sure, you want to delete?'
        },
        width: '200px',
        maxWidth: '90%',
        closeOnNavigation: true,
        disableClose: true,
        autoFocus: false
      });
      let dialogRefSub = dialogRef.closed.subscribe((resp: boolean) => {   
        if(resp){
          this._calendarServcie.deleteBooked(e['id']).subscribe(resp=>{
            this._analytics.addEvent(this.analyticsType.DELETED,this.analyticsScreen.VEHICLEBOOKING,this.screenType.EMPTY,"Deleted");
            this.getCalenderData();
          })
        }
        dialogRefSub.unsubscribe();
      });
    }
    if(e['operation']=='edit'){
      const dialogRef = this.dialog.open(BookVehicleComponent, {
        data : {
          id:e['id']
        },
        width: '500px',
        maxWidth: '90%',
        closeOnNavigation: true,
        disableClose: true,
        autoFocus: false
      });
      let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {   
        if(result){
          this._analytics.addEvent(this.analyticsType.UPDATED,this.analyticsScreen.VEHICLEBOOKING,this.screenType.EDIT,"Updated");
          this.getCalenderData();
        }
        dialogRefSub.unsubscribe();
      });
    }
  }

  





}
