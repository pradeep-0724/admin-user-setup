import { Component, Input, OnInit } from '@angular/core';
import { NewTripV2Service } from '../../../../api-services/trip-module-services/trip-service/new-trip-v2.service';
import { NewTripV2Constants } from '../../new-trip-v2-constants/new-trip-v2-constants';
import { ToolTipInfo } from '../../new-trip-v2-utils/new-trip-v2-utils';
import { NewTripV2DataService } from '../../new-trip-v2-dataservice';

@Component({
  selector: 'app-trip-details-trip-documents-section',
  templateUrl: './trip-details-trip-documents-section.component.html',
  styleUrls: ['./trip-details-trip-documents-section.component.scss']
})
export class TripDetailsTripDocumentsSectionComponent implements OnInit {
 @Input() tripId:string=''
 @Input() isDriverApp:boolean=false
  tripDocuments=[];
  driverAppDocs=[];
  constantsTripV2 = new NewTripV2Constants()
  tripToolTip: ToolTipInfo;
  driverToolTip:ToolTipInfo;
  constructor(private _newTripV2Service:NewTripV2Service,private _tripDataService: NewTripV2DataService) { }
   
  ngOnInit(): void {
    this.getTripDocuments();
    this.tripToolTip = {
      content: this.constantsTripV2.toolTipMessages.TRIP_DOCUMENT.CONTENT
    }
    this.driverToolTip =  {
      content: this.constantsTripV2.toolTipMessages.DRIVER_TRIP_DOCUMENT.CONTENT
    }
    this._tripDataService.newDocument.subscribe((resp) => {
      if (resp) {
        this.getTripDocuments();
      }
    });
  }



  fileUploader(e){
    let documents=[];
    e.forEach(element => {
      documents.push(element.id);
      element['presigned_url']=element['url']
      this.tripDocuments.push(element)
    });
    let payload={
      documents:documents
    }
    this._newTripV2Service.putTripDocuments(this.tripId,payload).subscribe(resp=>{
    });
  }

  getTripDocuments(){
    this._newTripV2Service.getTripDocuments(this.tripId).subscribe(resp=>{
      this.tripDocuments=resp['result']['trip_docs'];
      this.driverAppDocs =resp['result']['driver_docs']; 
    });
  }

  fileDeleted(id){
    this.tripDocuments =  this.tripDocuments.filter(doc=>doc.id !=id);
    this._newTripV2Service.deleteTripDocuments(id).subscribe(resp=>{
    });
  }
  
  driverDocDeleted(id){
    this.driverAppDocs=  this.driverAppDocs.filter(doc=>doc.id !=id);
    this._newTripV2Service.deleteTripDocuments(id).subscribe(resp=>{
    });
  }

}
