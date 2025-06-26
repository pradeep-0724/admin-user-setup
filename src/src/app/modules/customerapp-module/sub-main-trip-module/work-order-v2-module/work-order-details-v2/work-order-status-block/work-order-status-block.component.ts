import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { WorkOrderApprovalRejectPopupComponent } from '../work-order-approval-reject-popup/work-order-approval-reject-popup.component';
import { Dialog } from '@angular/cdk/dialog';
import { WorkOrderV2DataService } from '../../work-order-v2-dataservice.service';
import { WorkOrderV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/work-order-service/work-order-v2.service';

@Component({
  selector: 'app-work-order-status-block',
  templateUrl: './work-order-status-block.component.html',
  styleUrls: ['./work-order-status-block.component.scss']
})
export class WorkOrderStatusBlockComponent implements OnInit {

  
  @Input() workOrderDetail: any;
  workorderStatusDetails;
  isShow: boolean = false;
  timeline: any[] = [];
  is_Approval_configured: boolean;
  constructor(private dialog: Dialog, private _workorderV2Service: WorkOrderV2Service, private _workorderDataService: WorkOrderV2DataService) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.workorderStatusDetails = this.workOrderDetail.status;
    this.timeline = this.workorderStatusDetails.timeline;
  }

  ngOnInit(): void {
    this.getApprovalLevelDetails(this.workOrderDetail.created_at);
    this.workorderStatusDetails = this.workOrderDetail.status;
    this.timeline = this.workorderStatusDetails.timeline;
    
  }

  getApprovalLevelDetails(latestBy: string = "") {
    this._workorderV2Service.getApprovalLevelDetails(latestBy,this.workOrderDetail['vehicle_category']).subscribe((res) => {
      this.is_Approval_configured = res['result'].is_approval_configured
      
    })
  }

  openSideBar() {
    this.isShow = true;;
  }

  isClose(e) {
    this.isShow = e;
    this._workorderDataService.newUpdate(true);
  }


  findfingFirstName(name: string) {
    return name.split('')[0]
  }


  openQuotationRejectPopup(heading, isApproved) {
    const dialogRef = this.dialog.open(WorkOrderApprovalRejectPopupComponent, {
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
        this._workorderV2Service.quotationApprovedorRejected(this.workOrderDetail.id, item).subscribe((res) => {
          this._workorderDataService.newUpdate(true);
        })
      }

      dialogRefSub.unsubscribe();
    });
  }


  saveQuotation(apiText, heading, is_Submit) {
    let popupData = {
      data: this.workorderStatusDetails.validations,
      heading: heading,
      is_Submit: is_Submit
    }
    if (this.workorderStatusDetails.validations.length > 0) {
      let stoppedQuotation = this.workorderStatusDetails.validations.some(validation => validation.action === 'stop_quote_create');
      if (stoppedQuotation) {
        popupData.is_Submit = false;
        popupData.heading = 'Validation Failed';
      } else {
        popupData.is_Submit = true;
        popupData.heading = 'Send For Approval';
      }
      const dialogRef = this.dialog.open(WorkOrderApprovalRejectPopupComponent, {
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
          this._workorderV2Service.quotationApprovedorRejected(this.workOrderDetail.id, data).subscribe((res) => {
            this._workorderDataService.newUpdate(true);
          })
        }
        dialogRefSub.unsubscribe();
      });
    } else {
      if (is_Submit) {
        const dialogRef = this.dialog.open(WorkOrderApprovalRejectPopupComponent, {
          data: {
            data: this.workorderStatusDetails.validations,
            heading: heading,
            is_Submit: is_Submit
          },
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
            this._workorderV2Service.quotationApprovedorRejected(this.workOrderDetail.id, data).subscribe((res) => {
              this._workorderDataService.newUpdate(true);
            })
          }
          dialogRefSub.unsubscribe();
        })
      }else{
        let data = {
          approval_remark: '',
          saving_as: apiText
        }
          this._workorderV2Service.quotationApprovedorRejected(this.workOrderDetail.id, data).subscribe((res) => {
            this._workorderDataService.newUpdate(true);
        })
      }
    }


  }

  resendForApproval(){
    console.log('resend');
    
    const dialogRef = this.dialog.open(WorkOrderApprovalRejectPopupComponent, {
      data: {
        data: this.workorderStatusDetails.validations,
        heading: 'Send For Approval',
        is_Submit: true
      },
      width: '500px',
      maxWidth: '90%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((item: any) => {
      console.log(item);
      
      if (isValidValue(item)) {
        let data = {
          approval_remark: item.remark,
        }
        this._workorderV2Service.resendForAproval(this.workOrderDetail.id, data).subscribe((res) => {
          this._workorderDataService.newUpdate(true);
        })
      }
      dialogRefSub.unsubscribe();
    })
  }


}
