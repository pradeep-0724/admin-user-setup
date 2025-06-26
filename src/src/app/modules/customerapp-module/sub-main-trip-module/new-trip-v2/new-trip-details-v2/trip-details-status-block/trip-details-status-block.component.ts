import { Dialog } from '@angular/cdk/dialog';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { TripDetailsApproveRejectPopupComponent } from '../trip-details-approve-reject-popup/trip-details-approve-reject-popup.component';
import { NewTripV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/trip-service/new-trip-v2.service';
import { NewTripV2DataService } from '../../new-trip-v2-dataservice';
import { AddTripV2ValidationComponent } from '../../add-trip-v2/add-trip-v2-validation/add-trip-v2-validation.component';

@Component({
  selector: 'app-trip-details-status-block',
  templateUrl: './trip-details-status-block.component.html',
  styleUrls: ['./trip-details-status-block.component.scss']
})
export class TripDetailsStatusBlockComponent implements OnInit {

  @Input() tripDetails: any;
  tripStatusDetails;
  isShow: boolean = false;
  timeline: any[] = [];
  is_Approval_configured: boolean;
  constructor(private dialog: Dialog, private _newTripV2Service: NewTripV2Service, private _newTripV2DataService: NewTripV2DataService) { }

  ngOnChanges(changes: SimpleChanges): void {    
    this.tripStatusDetails = this.tripDetails.approval_status;
    this.timeline = this.tripStatusDetails.timeline;
  }

  ngOnInit(): void {
    this.tripStatusDetails = this.tripDetails.approval_status;
    this.getApprovalLevelDetails();
    this.timeline = this.tripStatusDetails.timeline;
    
  }

  getApprovalLevelDetails() {
    this._newTripV2Service.getApprovalLevelDetails(this.tripDetails['vehicle_category']).subscribe((res) => {
      this.is_Approval_configured = res['result'].is_approval_configured
      
    })
  }

  openSideBar() {
    this.isShow = true;;
  }

  isClose(e) {
    this.isShow = e;
    this._newTripV2DataService.upDateTripProfile(true);
  }


  findfingFirstName(name: string) {
    return name.split('')[0]
  }


  openQuotationRejectPopup(heading, isApproved) {
    const dialogRef = this.dialog.open(TripDetailsApproveRejectPopupComponent, {
      data: {
        heading: heading,
        isApproved: isApproved
      },
      width: '500px',
      maxWidth: '90%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((item: any) => {
      if (isValidValue(item)) {
        this._newTripV2Service.jobApprovedorRejected(this.tripDetails.id, item).subscribe((res) => {
          this._newTripV2DataService.upDateTripProfile(true);
        })
      }

      dialogRefSub.unsubscribe();
    });
  }


  saveQuotation(apiText, heading, is_Submit) {
    let popupData = {
      data: this.tripStatusDetails.validations,
      heading: heading,
      is_Submit: is_Submit
    }
    if (this.tripStatusDetails.validations.length > 0) {
      let stoppedQuotation = this.tripStatusDetails.validations.some(validation => validation.action === 'stop_job_create');
      if (stoppedQuotation) {
        popupData.is_Submit = false;
        popupData.heading = 'Validation Failed';
      } else {
        popupData.is_Submit = true;
        popupData.heading = 'Send For Approval';
        apiText = 'send_for_approval'
      }
      const dialogRef = this.dialog.open(AddTripV2ValidationComponent, {
        data: popupData,
        width: '500px',
        maxWidth: '90%',
        closeOnNavigation: true,
        disableClose: true,
        autoFocus: false
      });
      let dialogRefSub = dialogRef.closed.subscribe((item: any) => {
        if (isValidValue(item) && item.is_approved) {
          let data = {
            approval_remark: item.remarkValue,
            saving_as: apiText
          }
          this._newTripV2Service.resendJobApproval(this.tripDetails.id, data).subscribe((res) => {
            this._newTripV2DataService.upDateTripProfile(true);
          })
        }
        dialogRefSub.unsubscribe();
      });
    } else {
        let data = {
          approval_remark: '',
          saving_as: apiText
        }
        this._newTripV2Service.resendJobApproval(this.tripDetails.id, data).subscribe((res) => {
          this._newTripV2DataService.upDateTripProfile(true);
        })
      }
  }


}
