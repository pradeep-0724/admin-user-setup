import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { NewTripV2Constants } from '../../new-trip-v2-constants/new-trip-v2-constants';
import { ToolTipInfo } from '../../new-trip-v2-utils/new-trip-v2-utils';
import moment from 'moment';

@Component({
  selector: 'app-location-details-crane',
  templateUrl: './location-details-crane.component.html',
  styleUrls: ['./location-details-crane.component.scss']
})
export class LocationDetailsCraneComponent implements OnInit,OnDestroy {
  @Input() tripStatusAndSummaryData: Observable<any>;
   trip_Task: ToolTipInfo;
   constantsTripV2 = new NewTripV2Constants()
   locationDetails;
   $subscriptions: Array<Subscription> = [];
  constructor() { }

  ngOnDestroy(): void {
    if (this.$subscriptions.length) {
      this.$subscriptions.forEach(sub => {
        sub.unsubscribe();
      });
    }

  }

  ngOnInit(): void {
    this.$subscriptions.push(this.tripStatusAndSummaryData.subscribe(resp=>{
      this.locationDetails=null;
      setTimeout(() => {
        this.locationDetails = resp;
      }, 500);
      
    }))
    this.trip_Task={
      content: this.constantsTripV2.toolTipMessages.TRIP_TASK.CONTENT
    };
  }


  dateChange(date) {
    if (date) {
      return moment(date).tz(localStorage.getItem('timezone')).format('llll')
    }
    return '-'
  }

}
