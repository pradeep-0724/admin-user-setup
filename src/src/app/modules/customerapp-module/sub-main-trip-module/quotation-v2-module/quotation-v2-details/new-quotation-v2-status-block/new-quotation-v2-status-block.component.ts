import { Dialog } from '@angular/cdk/dialog';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { QuotationV2ValidationPopupComponent } from '../../add-edit-quotation-v2-module/quotation-v2-validation-popup/quotation-v2-validation-popup.component';
import { QuotationV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/quotation-service/quotation-service-v2';
import { QuotationV2ApproveRejectPopupComponent } from '../new-quotation-v2/quotation-v2-approve-reject-popup/quotation-v2-approve-reject-popup.component';
import { QuotationV2DataService } from '../../quotation-v2-data-service.service';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';

@Component({
  selector: 'app-new-quotation-v2-status-block',
  templateUrl: './new-quotation-v2-status-block.component.html',
  styleUrls: ['./new-quotation-v2-status-block.component.scss']
})
export class NewQuotationV2StatusBlockComponent implements OnInit, OnChanges {

  @Input() quotationDetail: any;
  quotationStatusDetails;
  isShow: boolean = false;
  timeline: any[] = [];
  is_Approval_configured: boolean;
  constructor(private dialog: Dialog, private _quotationV2Service: QuotationV2Service, private _quotationV2DataService: QuotationV2DataService) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.quotationStatusDetails = this.quotationDetail.status;
    this.timeline = this.quotationStatusDetails.timeline;
  }

  ngOnInit(): void {
    this.quotationStatusDetails = this.quotationDetail.status;
    this.getApprovalLevelDetails(this.quotationDetail.created_at);
    this.timeline = this.quotationStatusDetails.timeline;
    
  }

  getApprovalLevelDetails(latestBy: string = "") {
    let vehicle_category=this.quotationDetail['vehicle_category']=='AWP'?1:this.quotationDetail['vehicle_category']=='Crane'?1:this.quotationDetail['vehicle_category']
    this._quotationV2Service.getApprovalLevelDetails(latestBy,vehicle_category).subscribe((res) => {
      this.is_Approval_configured = res['result'].is_approval_configured
      
    })
  }

  openSideBar() {
    this.isShow = true;;
  }

  isClose(e) {
    this.isShow = e;
    this._quotationV2DataService.upDateQuotation(true);
  }


  findfingFirstName(name: string) {
    return name.split('')[0]
  }


  openQuotationRejectPopup(heading, isApproved) {
    const dialogRef = this.dialog.open(QuotationV2ApproveRejectPopupComponent, {
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
        this._quotationV2Service.quotationApprovedorRejected(this.quotationDetail.id, item).subscribe((res) => {
          this._quotationV2DataService.upDateQuotation(true);
        })
      }

      dialogRefSub.unsubscribe();
    });
  }


  saveQuotation(apiText, heading, is_Submit) {
    let popupData = {
      data: this.quotationStatusDetails.validations,
      heading: heading,
      is_Submit: is_Submit
    }
    if (this.quotationStatusDetails.validations.length > 0) {
      let stoppedQuotation = this.quotationStatusDetails.validations.some(validation => validation.action === 'stop_quote_create');
      if (stoppedQuotation) {
        popupData.is_Submit = false;
        popupData.heading = 'Validation Failed';
      } else {
        popupData.is_Submit = true;
        popupData.heading = 'Send For Approval';
        apiText = 'send_for_approval'
      }
      const dialogRef = this.dialog.open(QuotationV2ValidationPopupComponent, {
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
          this._quotationV2Service.saveDraftStateQuotation(this.quotationDetail.id, data).subscribe((res) => {
            this._quotationV2DataService.upDateQuotation(true);
          })
        }
        dialogRefSub.unsubscribe();
      });
    } else {
      if (is_Submit) {
        const dialogRef = this.dialog.open(QuotationV2ValidationPopupComponent, {
          data: {
            data: this.quotationStatusDetails.validations,
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
            this._quotationV2Service.saveDraftStateQuotation(this.quotationDetail.id, data).subscribe((res) => {
              this._quotationV2DataService.upDateQuotation(true);
            })
          }
          dialogRefSub.unsubscribe();
        })
      }else{
        let data = {
          approval_remark: '',
          saving_as: apiText
        }
          this._quotationV2Service.saveDraftStateQuotation(this.quotationDetail.id, data).subscribe((res) => {
            this._quotationV2DataService.upDateQuotation(true);
        })
      }
    }


  }


}
