import { Dialog } from '@angular/cdk/dialog';
import { Component, Input, OnInit } from '@angular/core';
import { ExpiryDocumentsPopupComponent } from './expiry-documents-popup/expiry-documents-popup.component';
import { Observable } from 'rxjs';
import { getPrefix } from 'src/app/core/services/prefixurl.service';

@Component({
  selector: 'app-add-trip-v2-documents-expiry',
  templateUrl: './add-trip-v2-documents-expiry.component.html',
  styleUrls: ['./add-trip-v2-documents-expiry.component.scss']
})
export class AddTripV2DocumentsExpiryComponent implements OnInit {

  @Input() documentExpiryData?: Observable<any>;
  @Input() scheduledJobsForSelectedVehicleList = [];
  preFixUrl = getPrefix();
  driversDocsInfo: any;
  vehiclesDocsIfo: any;
  vehicleSubassetInfo: any;
  vehiclesTyreIfo: any;
  customerIfo: any;
  assetCertificatesInfo: any;
  assetTyreInfo: any;
  assetAttachmentsInfo: any;


  andTerm = '';
  documents = [];
  displayDocSection = true
  driversNotEligible = [];

  totalExpired = 0;
  totalExpiring = 0;
  expireMessage = '';
  expiringMessage = '';
  permitsMessage={
    expiring:0,
    expired:0,
    not_found:0,
    document:[],
  }
  displayPermitSection = true
  @Input() locations  = [];


  constructor(public dialog: Dialog) { }

  setDocuments(data) {
    this.documents = []
    this.driversNotEligible = [];
    this.driversDocsInfo = data['result'].driver;
    this.vehiclesDocsIfo = data['result'].vehicle;
    this.vehicleSubassetInfo = data['result'].vehicle_subasset;
    this.vehiclesTyreIfo = data['result'].vehicle_tyre;
    this.customerIfo = data['result'].customer;
    this.assetCertificatesInfo = data['result'].asset;
    this.assetTyreInfo = data['result'].asset_tyre;
    this.assetAttachmentsInfo = data['result'].asset_subasset;

    setTimeout(() => {
      this.driversNotEligible = data['result'].drivers_not_eligible
    }, 500);

    this.totalExpired = this.driversDocsInfo['expired_count'] + this.vehiclesDocsIfo['expired_count'] + this.vehicleSubassetInfo['expired_count'] + this.vehiclesTyreIfo['expired_count'] + this.customerIfo['expired_count'] + this.assetTyreInfo['expired_count'] + this.assetAttachmentsInfo['expired_count'] + this.assetCertificatesInfo['expired_count'];
    this.totalExpiring = this.driversDocsInfo['expiring_count'] + this.vehiclesDocsIfo['expiring_count'] + this.vehicleSubassetInfo['expiring_count'] + this.vehiclesTyreIfo['expiring_count'] + this.customerIfo['expiring_count'] + this.assetTyreInfo['expiring_count'] + this.assetAttachmentsInfo['expiring_count'] + this.assetCertificatesInfo['expiring_count']
    this.expireMessage = this.generateMessage('expired_count')
    this.expiringMessage = this.generateMessage('expiring_count')
    if (data['result'].vehicle.documents.length > 0) {
      this.documents.push(...data['result'].vehicle.documents)
    }
    if (data['result'].driver.documents.length > 0) {
      this.documents.push(...data['result'].driver.documents)
    }
    if (data['result'].vehicle_subasset.documents.length > 0) {
      this.documents.push(...data['result'].vehicle_subasset.documents)
    }
    if (data['result'].vehicle_tyre.documents.length > 0) {
      data['result'].vehicle_tyre.documents[0]['isVehicleTyre'] = true;
      this.documents.push(...data['result'].vehicle_tyre.documents)
    }
    if (data['result'].customer.documents.length > 0) {
      this.documents.push(...data['result'].customer.documents)
    }
    if (data['result'].asset.documents.length > 0) {
      this.documents.push(...data['result'].asset.documents)
    }
    if (data['result'].asset_subasset.documents.length > 0) {
      this.documents.push(...data['result'].asset_subasset.documents)
    }
    if (data['result'].asset_tyre.documents.length > 0) {
      this.documents.push(...data['result'].asset_tyre.documents)
    }

    this.displayDocSection = true;
    this.displayPermitSection = true;
    this.permitsMessage.document = data['result'].vehicle_permit.documents
    this.permitsMessage.expired = data['result'].vehicle_permit.expired
    this.permitsMessage.expiring = data['result'].vehicle_permit.expiring
    this.permitsMessage.not_found = data['result'].vehicle_permit.not_found
  }

  ngOnInit(): void {
    this.documentExpiryData.subscribe((data) => {
      if(data){
        this.setDocuments(data)
      }else{
        this.displayDocSection = false;
        this.displayPermitSection=false;
        this.driversNotEligible=[];
      }
     
    })


  }
  openDocumentsExpiryComponent() {
    const dialogRef = this.dialog.open(ExpiryDocumentsPopupComponent, {
      width: '700px',
      maxWidth: '90%',
      data: {
        data: this.documents,
        isFromPermits : false,
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });


    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      dialogRefSub.unsubscribe()

    });
  }

  openPermitExpiryComponent() {
    const dialogRef = this.dialog.open(ExpiryDocumentsPopupComponent, {
      width: '700px',
      maxWidth: '90%',
      data: {
        data: this.permitsMessage.document,
        isFromPermits : true,
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });


    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      dialogRefSub.unsubscribe()

    });
  }

  wordCalculator(count: number) {
    if ((count > 1)) {
      return ' Documents are '
    }
    else {
      return ' Document is '
    }
  }

  wordPermitCalculator(count: number) {
    if ((count > 1)) {
      return ' Permit are '
    }
    else {
      return ' Permit is '
    }
  }

  close() {
    this.displayDocSection = false;
  }
  closePermit(){
    this.displayPermitSection=false;
  }

  generateMessage(messageFor) {
    let messageList = []
    if (this.vehiclesDocsIfo[messageFor])
      messageList.push(this.vehiclesDocsIfo[messageFor] + ' Vehicle')

    if (this.driversDocsInfo[messageFor])
      messageList.push(this.driversDocsInfo[messageFor] + ' Driver')

    if (this.vehicleSubassetInfo[messageFor])
      messageList.push(this.vehicleSubassetInfo[messageFor] + 'Vehicle Attachment')

    if (this.vehiclesTyreIfo[messageFor])
      messageList.push(this.vehiclesTyreIfo[messageFor] + ' Vehicle Tyre')

    if (this.customerIfo[messageFor])
      messageList.push(this.customerIfo[messageFor] + ' Customer')

    if (this.assetCertificatesInfo[messageFor])
      messageList.push(this.assetCertificatesInfo[messageFor] + ' Asset Certificate')

    if (this.assetAttachmentsInfo[messageFor])
      messageList.push(this.assetAttachmentsInfo[messageFor] + ' Asset Attachment')

    if (this.assetTyreInfo[messageFor])
      messageList.push(this.assetTyreInfo[messageFor] + ' Asset Tyre')

    return messageList.join(', ')

  }

  navigateToJobView(id){  
    const url = this.preFixUrl + '/trip/new-trip/details/' + id;
    window.open(url, '_blank');
  }


}
