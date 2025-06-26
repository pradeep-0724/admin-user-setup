import { getSetViewDetails } from './../../../core/services/getsetviewdetails.service';
import { Component, OnInit } from '@angular/core';
import * as moment from "moment";
import { ViewChild,TemplateRef,} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CalendarEvent, CalendarView,} from 'angular-calendar';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { Router } from '@angular/router';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { CalenderService } from '../api-services/calendar-services/calender-service.service';
interface MyEvent extends CalendarEvent {
  data:{
    count:string,
    note_count:string
  }
}


@Component({
  selector: 'app-calendar',
  styleUrls: ['./calendar.component.scss'],
  templateUrl: './calendar.component.html',
})
export class CalendarComponent implements OnInit {
  @ViewChild('modalContent',{static: true}) modalContent: TemplateRef<any>;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date(dateWithTimeZone());
  datatoChild =new BehaviorSubject({});
  constants = new ValidationConstants().routeConstants;
  mainData=[];
  isBackEnable:boolean= false;
  isClicked;
  events: MyEvent[];
  selectedDate;
  levelData={
    name:'',
    count:'',
    note_count:''
  }
  dueDate=[];
  remaining=[];
  reminderDate=[];
  showNoteModal: boolean = false;
  noteDate:any;
  prefixUrl: string;
  viewable_attr={
    id: "",
    screen: "",
    sub_screen: ""
    }
    isClose = false;
    isNotificationEmpty = false;
    screenType=ScreenType;
    analyticsType= OperationConstants;
    analyticsScreen=ScreenConstants;

  detailsscreenlist =['invoice',"creditnote","debitnote","fuel","otherexpenseactivity","inventoryactivity","fleetowner",
  "tyrerotation","tyrechangenew","tyrechangeinventory","maintenancenew","maintenanceinventory","company","vehicle"]

  ngOnInit(): void {
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.CALENDAR,this.screenType.VIEW,"Navigated");
    this.prefixUrl = this._prefixUrl.getprefixUrl();
    this.getData(this.viewDate)
    this.getMainData(this.viewDate);
    this.selectedDate=this.viewDate
    this.viewService.viewInfo  =this.viewable_attr;
  }

  constructor(private _calenderService:CalenderService ,private viewService:getSetViewDetails,private _analytics:AnalyticsService,
              private _router: Router, private _prefixUrl:PrefixUrlService, private _popupBodyScrollService:popupOverflowService) {
     this.viewDate = new Date(dateWithTimeZone())
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    let monthYearSelected =  moment(date).format('MMM YYYY');
    let  viewDateValue = moment(this.viewDate).format('MMM YYYY');
    // let todaysDate = moment(new Date(dateWithTimeZone())).format();
    // let selectedDate =  moment(date).format();
    if(monthYearSelected ==viewDateValue){
      // if(todaysDate >selectedDate){
        this.selectedDate=date;
        this.getMainData(changeDateToServerFormat(date.toString()))
        this.levelData={
          name:'',
          count:'',
          note_count:''
        }
        this.dueDate=[];
        this.remaining=[];
        this.reminderDate=[];
        this.isClose = false;
        this.isBackEnable = false;
      }
    // }


  }

  navigateToEditComponent(data){
    if(data.viewable_attr.hasOwnProperty('screen')){
     const routeName =this.findRoute(data.viewable_attr.id, data.viewable_attr.screen, data.viewable_attr.sub_screen) ;
     if(this.detailsscreenlist.includes(data.viewable_attr.screen)){
      this.viewService.viewInfo =data.viewable_attr;
      const viewUrl =this.findRoute('',data.viewable_attr.screen, data.viewable_attr.sub_screen) ;
      this._router.navigate([this.prefixUrl+viewUrl]);

     }
     if(routeName){
        this._router.navigateByUrl(this.prefixUrl+routeName);
     }
    }
  }

  findRoute(id: string, name: string, subname: string="") {
    for (let index in this.constants) {
      if (this.constants[index].name == name) {
        let queryParms='?pdfViewId='+id
          let route: string = this.constants[index].route;
          if (subname && this.constants[index].hasOwnProperty('subname')) {
              const subnames: Array<String> = this.constants[index]['subname'];
              const subrouteIndex = subnames.indexOf(subname);
              if (subrouteIndex == -1) {
                  return false
              }
              const subroute: String = this.constants[index]['subroute'][subrouteIndex];
              return route + id +'/' + subroute;
          }
          return route + queryParms;
      }
    }
    return false
  }

  closeOpenMonthViewDay() {
    this.mainData=[];
    this.levelData={
      name:'',
      count:'',
      note_count:''
    }
    this.dueDate=[];
    this.remaining=[];
    this.reminderDate=[];
    this.selectedDate =this.viewDate;
    this.getData(this.viewDate)
    this.getMainData(this.viewDate)
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
      this._calenderService.getCalenderNotifications(changeDateToServerFormat(firstDay.toString()),changeDateToServerFormat(lastDay.toString())).subscribe(data=>{
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
                     count: itemValue['reminder_count'],
                     note_count:itemValue['notes']
                   },
                   resizable: {
                    beforeStart: true,
                    afterEnd: true,
                  },
             })
           });
          }
      })
    }
  }

  getMainData(data){
   let date= changeDateToServerFormat(data.toString())
    this._calenderService.getCalenderNotificationsDetails(date).subscribe(result=>{
       this.mainData=result['result'];
       this.getCountIsGreaterThenZero();
    })
  }

  openSubItem(data){
    if(data.count>0){
      this.levelData={
        name:'',
        count:'',
        note_count:''
      }
      this.levelData=data;
      this.dueDate=[];
      this.remaining=[];
      this.reminderDate=[];
      let date = changeDateToServerFormat(this.selectedDate);
        this._calenderService.getCalenderNotificationsDetailsLastLevel(date,this.levelData.name).subscribe(result=>{
           this.dueDate=result['result'].DueDate
           this.remaining=result['result'].Remaining
           this.reminderDate=result['result'].ReminderDate
           this.isBackEnable = true;
        });
    }
  }

  addNote(viewdate){
    this.showNoteModal = true;
    this.noteDate = viewdate;
    this._popupBodyScrollService.popupActive()
  }

  getNote(){
    this.showNoteModal = true;
  }

  closeNote() {
    this.showNoteModal = false;
    this.getData(this.noteDate);
    this.getMainData(this.noteDate)
}

isActiveDay(date){
 return changeDateToServerFormat(date)==changeDateToServerFormat(this.selectedDate)
}

closeSideNav(){
  this.isBackEnable=false;
  this.isClose = false;
}

firstSectionClose(){
  this.isClose = true;
  this.isBackEnable=false;
}

getCountIsGreaterThenZero(){

  for (var i = 0; i < this.mainData.length; ++i) {
    if (this.mainData[i].count >0) {
        this.isNotificationEmpty = false;
        break;
    }else{
      this.isNotificationEmpty = true;
    }
}
}

}
