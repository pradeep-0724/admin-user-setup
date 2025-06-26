import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { OperationConstants, ScreenConstants } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { MaintenanceService } from '../../operations-maintenance.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';

@Component({
  selector: 'app-close-jobcard',
  templateUrl: './close-jobcard.component.html',
  styleUrls: ['./close-jobcard.component.scss']
})
export class CloseJobcardComponent implements OnInit {
  apiError='';
  @Input()jobCardDetails;
  @Input()isOpenJobcardClose=false;
  @Output() dataFromJobCardClose=new EventEmitter(false)
  closeForm:FormGroup;
  start_date='';
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;

  constructor(private _maintenanceService:MaintenanceService,private _analytics:AnalyticsService) { }

  ngOnInit(): void {
    this.start_date =this.jobCardDetails.actual_start_date;
    this.closeForm=new FormGroup({
      actual_end_date : new FormControl(new Date(dateWithTimeZone())),
    })
  }

  cancel(){
    this.dataFromJobCardClose.emit(false);
    this.isOpenJobcardClose=false;

  }


  closeJobCard(){
    let payload={
      actual_end_date:changeDateToServerFormat(this.closeForm.get('actual_end_date').value),
    }
    this._maintenanceService.closeJobCard(this.jobCardDetails.id,payload).subscribe(resp=>{
      this._analytics.addEvent(this.analyticsType.UPDATED,this.analyticsScreen.JOBCARD);
      this.dataFromJobCardClose.emit(true);
      this.isOpenJobcardClose=false;
    });
  }

}
