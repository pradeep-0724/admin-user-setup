import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CalenderService } from '../../api-services/calendar-services/calender-service.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';

@Component({
  selector: 'app-calendar-task',
  templateUrl: './calendar-task.component.html',
  styleUrls: ['./calendar-task.component.scss']
})
export class CalendarTaskComponent implements OnInit {
  @Input() task = {};
  @Output() taskEvent=new EventEmitter();
  classes = [];
  constructor(private _calendarServcie: CalenderService) { }
  isOpenTask = false;
  isOpenMaintenance = false;
  isOpenDocument = false;
  bookedTask = [];
  documentsTask = [];
  jobsTask = [];
  maintenanceTask = [];
  isMultiTaskDetails = false;
  isMultiDocDetails = false
  taskDetails: any = {}
  detailType='';
  prefixUrl=getPrefix();
  ngOnInit(): void {
    this.jobsTask = this.task['jobs']
    this.bookedTask = this.task['booked']
    this.documentsTask = this.task['documents']
    this.maintenanceTask = this.task['maintenance']
    this.setClass()
  }


  setClass() {
    if (this.jobsTask.length > 1 || this.bookedTask.length > 1) {
      this.classes = ['strip', 'strip-multi'];
      return
    }

    if (this.jobsTask.length == 1 && this.bookedTask.length == 1) {
      this.classes = ['strip', 'strip-multi'];
      return
    }

    if (this.jobsTask.length == 1) {
      let jobStatus = 'strip-' + this.jobsTask[0].status
      if(this.jobsTask[0].status.includes('Waiting')){
        jobStatus='strip-Scheduled'
      }
      this.classes = ['strip', jobStatus.toLowerCase()];
      return
    }

    if (this.bookedTask.length == 1) {
      this.classes = ['strip', 'strip-booked'];
      return
    }



  }

  getStatusCalss(job) {
    let className = 'strip-' + job.status
    if(job.status.includes('Waiting')){
      className = 'strip-Scheduled'
    }
   
    return className.toLowerCase()
  }

  getJobStatusClass(status){
  if(status=='Ongoing') return 'rgb(76, 172, 254)'
  if(status=='Completed') return 'rgb(43, 183, 65)'
  if(status=='Scheduled') return 'rgb(255, 185, 0)'
  if(status=='Void') return 'rgb(220, 53, 69)'
  if(status){
    if(status.includes('Waiting')){
      return 'rgb(255, 185, 0)'
    } 
  }
  
  }

  openTask() {
    this.isOpenTask = true;
    this.isMultiTaskDetails = false;
    this.taskDetails = {}
   if(this.jobsTask.length==1 && this.bookedTask.length==0){
    this.getCalendarTaskDetails(this.jobsTask[0].id,'job')
   }

   if(this.bookedTask.length==1 && this.jobsTask.length==0){
    this.getCalendarTaskDetails(this.bookedTask[0].id,'blocked')
   }
  }

  openDoc() {
    this.isOpenDocument = true;
    this.isMultiDocDetails = false;
    this.taskDetails = {}
    if(this.documentsTask.length==1){
      this.getCalendarTaskDetails(this.documentsTask[0].id,'doc')
    }
  }

  getCalendarTaskDetails(id,type) {
    this.detailType=type
    this._calendarServcie.getCalendarTaskDetails(id).subscribe(resp => {
      this.taskDetails = resp['result']['data'];
    })
  }

  editVehicleBook(id){
   this.taskEvent.emit({
    type:'blocked',
    id:id,
    operation:'edit'
   })
  }

  deleteVehicleBook(id){
    this.taskEvent.emit({
      type:'blocked',
      id:id,
      operation:'delete'
     })
  }

}
