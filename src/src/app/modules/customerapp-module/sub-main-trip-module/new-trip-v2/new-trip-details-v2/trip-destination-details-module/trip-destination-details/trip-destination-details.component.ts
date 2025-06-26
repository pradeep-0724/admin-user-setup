import { Component, Input, OnInit } from '@angular/core';
import moment from 'moment';
import { NewTripV2Constants } from '../../../new-trip-v2-constants/new-trip-v2-constants';
import { ToolTipInfo } from '../../../new-trip-v2-utils/new-trip-v2-utils';

@Component({
  selector: 'app-trip-destination-details',
  templateUrl: './trip-destination-details.component.html',
  styleUrls: ['./trip-destination-details.component.scss']
})
export class TripDestinationDetailsComponent implements OnInit {
   @Input() destinationData:any;
   @Input() index:number;
   @Input() tripId:string='';
   scheduled_Time_Info: ToolTipInfo;
   hold_Time_Info: ToolTipInfo;
   trip_Task: ToolTipInfo;
   estimateTime: ToolTipInfo;
   constantsTripV2 = new NewTripV2Constants()
  constructor() { }

  ngOnInit(): void {
    this.scheduled_Time_Info = {
      content: this.constantsTripV2.toolTipMessages.SCHEDULED_TIME.CONTENT
    }
    this.hold_Time_Info={
      content: this.constantsTripV2.toolTipMessages.HOLD_TIME.CONTENT
    };
    this.trip_Task={
      content: this.constantsTripV2.toolTipMessages.TRIP_TASK.CONTENT
    };
    this.estimateTime = {
      content: this.constantsTripV2.toolTipMessages.ESITMATETIME.CONTENT
    }

  }

  dateChange(date) {
    if(date){
      return moment(date).tz(localStorage.getItem('timezone')).format('llll')
    }
    return 'Data not Available'
  }

 

}
