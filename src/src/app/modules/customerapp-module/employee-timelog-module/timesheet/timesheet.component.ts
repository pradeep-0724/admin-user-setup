import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
// import { EmployeeServiceService } from '../employee-service.service';
import { EmployeeServiceService } from '../../api-services/employee-time-log-service/employee-service.service';
import { ActivatedRoute } from '@angular/router';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';


@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss']
})
export class TimesheetComponent implements OnInit  {

  preFixUrl = getPrefix();
  selectedRange: Date[];
  dateToday = new Date(dateWithTimeZone());
  endDate = moment(this.dateToday).format('YYYY-MM-DD');
  startDate = moment(this.dateToday).subtract(6, 'days').format('YYYY-MM-DD');
  currentDate;
  selectedOption = 'last_7_days';
  prevDisableFlag = false;
  nextNavigationDate='';
  prevNavigationDate='';
  navigationStartDate='';
  navigationEndDate='';
  nextDisabledFlag = false;
  dayTimelog = [];
  displayItems: any[] = [];
  dropdownValue = ''
  totalTimelog: any;
  averageTime: any;
  activeDate:any;
  showMap = {
    show: false,
  };
  zoom = 17;
  markerOptions: google.maps.MarkerOptions = {
    icon: 'assets/img/mini-red-map-marker.png'
  };
  center: google.maps.LatLngLiteral = { lat: 12.917397230158727, lng: 77.62292047769888 };
  pathPositions: google.maps.LatLngLiteral[] = [];
  markerPositions: any;
  employeeName: string;
  formattedDate: string;
  displayRangeWeek: string;
  calendarFlag: boolean;
  constructor(
    private activatedroute: ActivatedRoute,
    private employeeService: EmployeeServiceService,
  ) {
    this.selectedRange = [new Date(this.startDate), new Date(this.endDate)];
  }

  ngOnInit(): void {    
    this.currentDate = moment().format('YYYY-MM-DD');
    this.dropdownValue = 'last_7_days';
    this.startDate = changeDateToServerFormat(this.selectedRange[0].toString());
    this.endDate = changeDateToServerFormat(this.selectedRange[1].toString());
    this.formattedDate = `${moment(this.startDate).format("MMM D")} - ${moment(this.endDate).format("MMM D")}`;
    this.getDataofEachDayInaWeek(moment().format('YYYY-MM-DD'),-7)
    this.navigationStartDate=this.getaDatefromMoment(new Date(dateWithTimeZone()),6,'subtract')
    this.navigationEndDate=this.getaDatefromMoment(new Date(dateWithTimeZone()),0,'subtract');
    this.displayRangeWeek= 'this week '+ this.getDisplayRangeWeek(this.navigationStartDate,this.navigationEndDate);
    this.getTotalandAverageTimelog(this.navigationStartDate,this.navigationEndDate,7)
  }

  getDataofEachDayInaWeek(date,range){
    this.displayItems=[];
    this.activatedroute.params.subscribe((route)=>{
      this.employeeService.getaWeektimeData(route.id,date,range).subscribe((data)=>{
        this.displayItems=data.result;
        this.nextNavigationDate=this.displayItems[this.displayItems.length-1].date;
        this.prevNavigationDate=this.displayItems[0].date;

        if(this.dropdownValue==='custom'&&this.calendarFlag===true){
        this.particulardayLog(this.prevNavigationDate);
        }else if(this.dropdownValue==='last_7_days'||this.dropdownValue==='custom'){
          this.particulardayLog(this.getaDatefromMoment(new Date(dateWithTimeZone()),0,'subtract'));
          this.calendarFlag=false
          // this.selectedRange = [new Date(this.startDate), new Date(this.endDate)];              
        }else{
          this.calendarFlag=false
          this.selectedRange = [new Date(this.startDate), new Date(this.endDate)];
          this.particulardayLog(this.prevNavigationDate);
        }
        this.totaltimeforaWeek(range)
      })
    })
  }

  previousRecords() {
    this.prevNavigationDate=moment(this.prevNavigationDate).subtract(1,'days').format('YYYY-MM-DD')
    this.getDataofEachDayInaWeek(this.prevNavigationDate,-7)
  }

  nextRecords() {
    this.nextNavigationDate=this.getaDatefromMoment(this.nextNavigationDate,1,'add')
    this.getDataofEachDayInaWeek(this.nextNavigationDate,this.getRange(this.navigationEndDate,this.nextNavigationDate))
  }

  totaltimeforaWeek(range){
    let startDate=this.displayItems[0].date;
    this.prevNavigationDate=startDate;
  }

  todayData(){
    this.dropdownValue='last_7_days';
    this.navigationStartDate=this.getaDatefromMoment(new Date(dateWithTimeZone()),6,'subtract')
    this.navigationEndDate=this.getaDatefromMoment(new Date(dateWithTimeZone()),0,'subtract')
    this.getDataofEachDayInaWeek(moment().format('YYYY-MM-DD'),-7);
    this.displayRangeWeek= 'this week '+this.getDisplayRangeWeek(this.navigationStartDate,this.navigationEndDate);
    this.getTotalandAverageTimelog(this.navigationStartDate,this.navigationEndDate,7)
  }

  getTotalandAverageTimelog(start: string, end: string, range: number) {
    this.activatedroute.params.subscribe((ele) => {
      this.employeeService.getEmployeeTotalTime(ele.id, start, end).subscribe((dat: any) => {        
        this.totalTimelog = dat.result.hour + ':' + dat.result.min;
        let totaltime=(Number(dat.result.hour) * 60 + Number(dat.result.min))
        let decPart=String(((Number(dat.result.hour) * 60 + Number(dat.result.min))/(range*60)).toFixed(2)).split('.')[1]
        if(totaltime>60){
          this.averageTime = Math.floor((Number(dat.result.hour) * 60 + Number(dat.result.min))/(range*60))+':'+((Number(decPart)*60)/100).toFixed(0);
        }
        else{
            totaltime=totaltime/(range);
            this.averageTime = 0+':'+(totaltime).toFixed(0)
        }
      })

    })
  }

  getaDatefromMoment(date,range,type){
    if(type==='subtract'){
      return moment(date).subtract(range,'days').format('YYYY-MM-DD')
    }
    return  moment(date).add(range,'days').format('YYYY-MM-DD')
  }

  getRange(start,end){
    if(moment(start).diff(end,'days')>=7){
      return 7
    }
  
    return moment(start).diff(end,'days')+1;
  }

  filterBalanceSheet(dateRange) {
    if (dateRange && dateRange.length > 1) {
      this.calendarFlag=true
      this.navigationStartDate = changeDateToServerFormat(dateRange[0].toString());
      this.navigationEndDate = changeDateToServerFormat(dateRange[1].toString());      
      this.getTotalandAverageTimelog(this.navigationStartDate,this.navigationEndDate,moment(this.navigationEndDate).diff(this.navigationStartDate,'days')+1)
      this.displayRangeWeek= 'for '+ this.getDisplayRangeWeek(this.navigationStartDate,this.navigationEndDate);
      this.getDataofEachDayInaWeek(this.navigationStartDate,this.getRange(this.navigationEndDate,this.navigationStartDate))
    }
  }

  getDisplayRangeWeek(start,end){
    return `${moment(start).format("D MMM")}-${moment(end).format("D MMM YYYY")}`;
  }

  dataRange(value) {
    this.endDate = this.getaDatefromMoment(this.dateToday,0,'subtract');
    this.startDate =this.getaDatefromMoment(this.dateToday,0,'subtract')
    if (value === 'last_7_days') {
      this.getDataofEachDayInaWeek(moment().format('YYYY-MM-DD'),-7)
      this.activeDate = this.endDate;
      this.navigationStartDate=this.getaDatefromMoment(new Date(dateWithTimeZone()),6,'subtract')
      this.navigationEndDate=this.getaDatefromMoment(new Date(dateWithTimeZone()),0,'subtract');
      this.displayRangeWeek= 'this week ' + this.getDisplayRangeWeek(this.navigationStartDate,this.navigationEndDate);
      this.getTotalandAverageTimelog(this.navigationStartDate,this.navigationEndDate,7)
    }
    else if (value === 'this_month') {
      this.navigationStartDate=moment().startOf('month').format('YYYY-MM-DD');
      this.navigationEndDate=this.getaDatefromMoment(new Date(dateWithTimeZone()),0,'subtract');
      this.displayRangeWeek= 'this month ' + this.getDisplayRangeWeek(this.navigationStartDate,this.navigationEndDate);
      this.getDataofEachDayInaWeek(moment().startOf('month').format('YYYY-MM-DD'),this.getRange(this.navigationEndDate,this.navigationStartDate))
      this.getTotalandAverageTimelog(this.navigationStartDate,this.navigationEndDate,moment(this.navigationEndDate).diff(this.navigationStartDate,'days')+1)
      
    }else if (value === 'last_month') {                                                              
      const startDate = moment().add(-1, 'months').startOf('month').format('YYYY-MM-DD');
      this.navigationStartDate= moment().add(-1, 'months').startOf('month').format('YYYY-MM-DD');
      this.navigationEndDate=moment().add(-1, 'months').endOf('month').format('YYYY-MM-DD');
      this.getDataofEachDayInaWeek(startDate,7)
      this.displayRangeWeek=  'last month ' + this.getDisplayRangeWeek(this.navigationStartDate,this.navigationEndDate);
      this.getTotalandAverageTimelog(this.navigationStartDate,this.navigationEndDate,moment(this.navigationEndDate).diff(this.navigationStartDate,'days')+1)      
    }else if (value === 'custom') {
      this.getDataofEachDayInaWeek(moment().format('YYYY-MM-DD'),-7)
    this.selectedRange = [new Date(moment().subtract(6,"days").format('YYYY-MM-DD')), new Date(moment().format('YYYY-MM-DD'))];    
      this.navigationStartDate=this.getaDatefromMoment(new Date(dateWithTimeZone()),6,'subtract')
      this.navigationEndDate=this.getaDatefromMoment(new Date(dateWithTimeZone()),0,'subtract')
      this.displayRangeWeek= 'this week ' + this.getDisplayRangeWeek(this.navigationStartDate,this.navigationEndDate);
      this.getTotalandAverageTimelog(this.navigationStartDate,this.navigationEndDate,7)
    }
  }

  particulardayLog(date: string) {
    this.activeDate = date;
    this.activatedroute.params.subscribe((route) => {
      this.employeeService.getPerDayEmployeeTimelog(route.id, date).subscribe(resp => {
        this.dayTimelog = resp.result.attendance;
        this.employeeName = resp.result.employee;
      })
    })
  }

  getExt(url, filename) {
    if (filename && url) {
      var ext = filename.split('.').pop();
      if (ext == filename) {
        return "";
      }
      if (ext == 'pdf') {
        return "../assets/img/fileuploadIcons/pdf_img.png";
      }
      else if (this.checkDocument(ext)) {
        return "../assets/img/fileuploadIcons/doc_img.jpg";
      }
      else if (this.checkXXls(ext)) {
        return "../assets/img/fileuploadIcons/xls_img.jpg";
      }
      else if (ext == 'txt') {
        return "../assets/img/fileuploadIcons/txt_img.jpg";
      }
      else if (ext == 'ppt' || ext == 'pptx') {
        return "../assets/img/fileuploadIcons/ppt_img.jpg";
      } else {
        return url;
      }
    }
  }
  checkDocument(ext) {
    let document = ["doc", "docx", "odt", "rtf"];
    return document.includes(ext)
  }
  checkXXls(ext) {
    let document = ["xls", "xlsx", "csv", "json"];
    return document.includes(ext)
  }
  close() {
    this.showMap.show = false
  }
  mapsButton(data) {
    this.center = {lat:data.lat,lng:data.lng};
    this.showMap.show = true
    this.markerPositions = [{lat:data.lat,lng:data.lng}]
  }




}
