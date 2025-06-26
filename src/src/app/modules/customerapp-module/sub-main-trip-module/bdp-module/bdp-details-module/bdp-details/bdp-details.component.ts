import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { NewBdpService } from '../../../../api-services/trip-module-services/bdp-service/bdp-service.service';
import { Dialog } from '@angular/cdk/dialog';
import { BdpAddNewTripComponent } from '../bdp-add-new-trip/bdp-add-new-trip.component';

@Component({
  selector: 'app-bdp-details',
  templateUrl: './bdp-details.component.html',
  styleUrls: ['./bdp-details.component.scss']
})
export class BdpDetailsComponent implements OnInit {
  prefixUrl= getPrefix();
  constructor( private activatedRoute: ActivatedRoute,private newBDPservice:NewBdpService,public dialog: Dialog, ) { }
  bdpId:String='';
  bdpDetails:any;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((data)=>{
      if(data) this.bdpId = data.id
      this.getBdpDetails()
    })
  }


  addTrip() {
    const dialogRef = this.dialog.open(BdpAddNewTripComponent, {
      minWidth: '75%',
      data:this.bdpDetails,
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
  
    let dialogRefSub = dialogRef.closed.subscribe((result:boolean) => {
      dialogRefSub.unsubscribe()
    });
  }

  isAcceptTender(isAccept:boolean){
    let body={
      tender_number:this.bdpId,
      is_accepted:isAccept
    }
    this.newBDPservice.isAcceptTender(body).subscribe((data)=>{
      this.getBdpDetails();
    });
  }

  getBdpDetails(){
    this.newBDPservice.getBDpDetails(this.bdpId).subscribe((data:any)=>{
      this.bdpDetails=data.result
    })
  }

}
