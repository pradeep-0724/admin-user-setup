import { Component, OnInit } from '@angular/core';
import * as moment from "moment";
import { ViewChild,TemplateRef,} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CalendarEvent, CalendarView,} from 'angular-calendar';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { EmployeeAttendenceService } from '../../api-services/employee-attendence-service/employeeAttendence.service';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
interface MyEvent extends CalendarEvent {
  data:{
    present:string,
    remaining:string,
    absent:string
  }
}

@Component({
  selector: 'app-employee-attendance',
  templateUrl: './employee-attendance.component.html',
  styleUrls: ['./employee-attendance.component.scss']
})
export class EmployeeAttendanceComponent implements OnInit {
  @ViewChild('modalContent',{static: true}) modalContent: TemplateRef<any>;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date(dateWithTimeZone());
  datatoChild =new BehaviorSubject({}) ;
  events: MyEvent[];
  screenType=ScreenType;
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;
  ngOnInit(): void {

    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.EMPLOYEEATTENDANCE,this.screenType.ADD,"Navigated");
    this.getData(this.viewDate)
  }
  constructor(private _attendence:EmployeeAttendenceService,private _analytics:AnalyticsService, private _popupBodyScrollService:popupOverflowService) {
    this.viewDate = new Date(dateWithTimeZone())
  }
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {

    let monthYearSelected =  moment(date).format('MMM YYYY');
    let  viewDateValue = moment(this.viewDate).format('MMM YYYY');
    let todaysDate = moment(new Date(dateWithTimeZone())).format();
    let selectedDate =  moment(date).format();
    if(monthYearSelected ==viewDateValue){
      if(todaysDate >selectedDate){
        this._popupBodyScrollService.popupActive();
        this.datatoChild.next({
          isOpen:true,

          selectedDate:changeDateToServerFormat(date.toString())
        })
      }
    }
  }

  closeOpenMonthViewDay() {
    this.getData(this.viewDate)
  }

  getData(viewDate){
      let date = new Date(viewDate);
      let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      let todaysDate = moment(new Date(dateWithTimeZone())).format();
      let selectedDate =  moment(lastDay).format();
      if(todaysDate < selectedDate){
         lastDay =  new Date(dateWithTimeZone());
       }
    if(firstDay<=lastDay){
      this._attendence.getEmployeeAttendenceForMonth(changeDateToServerFormat(firstDay.toString()),changeDateToServerFormat(lastDay.toString())).subscribe(data=>{
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
                     present:itemValue['Present'].toString(),
                     remaining:itemValue['Remaining'].toString(),
                     absent:itemValue['Absent'].toString()
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

}
