import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-approval-timeline',
  templateUrl: './approval-timeline.component.html',
  styleUrls: ['./approval-timeline.component.scss']
})
export class ApprovalTimelineComponent implements OnInit,OnChanges {

  @Input() show : boolean= false;
  @Output() isClose = new EventEmitter<boolean>();
  constructor(private _commonService:CommonService) { }
  @Input() timeline = []
  @Input() staticBackdrop='staticBackdrop'
  currI=-1;
  currP=-1;
  defaultTimeline=[]


  ngOnInit(): void {  
  

  }
  ngOnChanges(changes: SimpleChanges): void {
    this.defaultTimeline=cloneDeep(this.timeline)
  }

  closePopup(){
    this.isClose.emit(false)
    this.show = false;
  }

  findfingFirstName(name:string){
    return name.split('')[0]
  }

  dateChange(date) {
    if (date) {
      return moment(date).tz(localStorage.getItem('timezone')).format('llll')
    }
    return '-'
  }
  cancelEdit(i,p){
    this.timeline[i][p].remark=this.defaultTimeline[i][p]?.remark;
    this.currI=-1;
    this.currP=-1;
  }

  editRequest(type,id,remark){
    const payLoad={
      action:type,
      remark:remark
    }
    this._commonService.editRequestOperations(id,payLoad).subscribe(resp=>{
      this.defaultTimeline=cloneDeep(this.timeline)
      this.currI=-1;
      this.currP=-1;
      if(type=='delete'){
        this.timeline.forEach((item,index)=>{
          this.timeline[index]=item.filter(val=>val.id!=id)
         });
      }
    })
  }

}
