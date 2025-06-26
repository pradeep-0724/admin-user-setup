import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { TaxService } from 'src/app/core/services/tax.service';
import { addFonts, reorderMixedText } from 'src/app/shared-module/utilities/pdfmake-uitls';
import { generatePdfTemplate1, pdfTemplate1 } from 'src/app/shared-module/utilities/pdftemplate-utils';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { NewTripV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/trip-service/new-trip-v2.service';
import { CommonService } from 'src/app/core/services/common.service';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { cloneDeep } from 'lodash';
import moment from 'moment';
@Component({
  selector: 'app-job-gate-pass-pdf',
  templateUrl: './job-gate-pass-pdf.component.html',
  styleUrls: ['./job-gate-pass-pdf.component.scss']
})
export class JobGatePassPdfComponent implements OnInit ,OnDestroy {
  @Input() isDownloadGatePass:Observable<boolean> | undefined;
  @Input() tripId:string| undefined;
  gatePassSubscription: Subscription;
  companyLogo:any='';
  gatePassData:any;
  currency_symbol;
  pdfTemplate1: pdfTemplate1 = {
        isTax: true,
        isTds:false,
        contents: [],
        headerDetails: {
          companyname: '',
          companynameNative: '',
          companyAddress: '',
          crnNo: '',
          trnNo: '',
          mobileNo: '',
          companyEmailId: '',
          pdfTitle: '',
          companyLogo: '',
        },
        footerDetails: {
          companyname: '',
          companynameNative: '',
          mobileNo: '',
          companyEmailId: '',
          poweredBy: '',
          systemGenerated: '',
    
        }
      };
  constructor( private _tax: TaxService,private currency:CurrencyService,private _newTripV2Service: NewTripV2Service,private _commonService:CommonService,private _fileDownload: FileDownLoadAandOpen, private ngxService: NgxUiLoaderService) { 
     pdfMake.vfs = pdfFonts.pdfMake.vfs;
     this.pdfTemplate1.isTax = this._tax.getTax();
      this.pdfTemplate1.isTds = this._tax.getVat();
      addFonts(pdfMake)
  }


  ngOnInit(): void {
    this.currency_symbol = this.currency.getCurrency()?.symbol;
   this.gatePassSubscription= this.isDownloadGatePass?.subscribe((isDownload) => {
      if (isDownload) {
        this._newTripV2Service.getGatePass( this.tripId).subscribe(res=>{
          this.gatePassData=res?.result;
          this.downloadGatePass()
        })
        ;
      }
    });
    this._commonService.fetchCompanyLogo().subscribe(response=>{
      this.companyLogo = response.result.image_blob;
    })

  }

  ngOnDestroy(): void {
    this.gatePassSubscription?.unsubscribe();
  }
 
  downloadGatePass(){

    this.ngxService.start();
    this.buildPdf();
           let type = ".pdf"
           let fileName = 'Outpass'
          setTimeout(() => {
            let fileNameA = fileName + "_"+ this.gatePassData?.trip_id + type;
            const pdfDocGenerator = pdfMake.createPdf(generatePdfTemplate1(cloneDeep(this.pdfTemplate1)) );
            pdfDocGenerator.getBlob((blob) => {
                this._fileDownload.writeAndOpenFile(blob, fileNameA).then(data => {
                });
            });
        }, 500);
           setTimeout(() => {
               this.ngxService.stop();
           }, 500);
  }
  buildPdf() {    
      this.pdfTemplate1.contents = []
      this.pdfTemplate1.headerDetails.companyname = this.gatePassData.company.company_name;
      this.pdfTemplate1.headerDetails.companynameNative = reorderMixedText(this.gatePassData.company.company_native_name);
      this.pdfTemplate1.headerDetails.crnNo = this.gatePassData.company.crn_no;
      this.pdfTemplate1.headerDetails.trnNo = this.gatePassData.company.tax_no;
      this.pdfTemplate1.headerDetails.companyEmailId = this.gatePassData.company.email_address;
      this.pdfTemplate1.headerDetails.companyAddress = this.gatePassData.company.address[0]+''+this.gatePassData.company.address[1];
      this.pdfTemplate1.headerDetails.mobileNo = this.gatePassData.company.mobile_no;
      this.pdfTemplate1.footerDetails.companyname = this.gatePassData.company.company_name;
      this.pdfTemplate1.footerDetails.companynameNative = reorderMixedText(this.gatePassData.company.company_native_name);
      this.pdfTemplate1.footerDetails.companyEmailId = this.gatePassData.company.email_address;
      this.pdfTemplate1.footerDetails.mobileNo = this.gatePassData.company.mobile_no;
      this.pdfTemplate1.headerDetails.companyLogo = this.companyLogo;
        this.pdfTemplate1.headerDetails.pdfTitle = 'Out Pass'
        this.pdfTemplate1.footerDetails.poweredBy = 'Powered By Transportsimple.com';
        this.pdfTemplate1.footerDetails.systemGenerated = "This is a computer-generated Out Pass. No signature is required for validation.";
        let c=[]
      c.push({
        margin: [20, 20, 20, 5],
        text: [
          { text: 'Customer: ', bold: true },
          { text: this.gatePassData?.customer || '-' }
        ]
      })
      if((this?.gatePassData?.vehicle_category==0 ||  this?.gatePassData?.vehicle_category==4)){
        c.push({
          margin: [20, 5, 20, 5],
          text: [
            { text: 'Type of Movement: ', bold: true },
            { text: this.gatePassData?.type_of_movement || '-' }
          ]
        })
      }
      c.push({
        margin: [20, 5, 20, 5],
        text: [
          { text: 'Job ID: ', bold: true },
          { text: this.gatePassData?.trip_id }
        ]
      },
      {
        margin: [20, 5, 20, 5],
        text: [
          { text: 'Sales Order No.: ', bold: true },
          { text: this.gatePassData?.work_order_no || '-' }
        ]
      },
      {
        margin: [20, 5, 20, 5],
        text: [
          { text: 'Reference No: ', bold: true },
          { text:  this.gatePassData?.reference_no || '-'}
        ]
      },
      {
        margin: [20, 5, 20, 5],
        text: [
          { text: 'Vehicle Number: ', bold: true },
          { text:  this.gatePassData?.vehicle || '-'}
        ]
      }, {
        margin: [20, 5, 20, 5],
        text: [
          { text: 'Driver Name: ', bold: true },
          { text:  this.gatePassData?.driver || '-'}
        ]
      },
      {
        margin: [20, 5, 20, 5],
        text: [
          { text: 'Schedule Date & Time: ', bold: true },
          { text:  moment(this.gatePassData?.start_date).format('DD-MM-YYYY hh:mm A') || '-'}
        ]
      }
    )
      if((this?.gatePassData?.vehicle_category==0 ||  this?.gatePassData?.vehicle_category==4 || this?.gatePassData?.vehicle_category==10)){
        c.push({
          margin: [20, 5, 20, 5],
          text: [
            { text: 'Assets: ', bold: true },
            { text:  this.gatePassData?.assets || '-'}
          ]
        })

      }
      if((this?.gatePassData?.vehicle_category==1 ||  this?.gatePassData?.vehicle_category==2 )){
        c.push({
          margin: [20, 5, 20, 5],
          text: [
            { text: 'Location: ', bold: true },
            { text:  this.gatePassData?.route?.name || '-'}
          ]
        })
      }
      if(this?.gatePassData?.vehicle_category==0 || this?.gatePassData?.vehicle_category==4 || this?.gatePassData?.vehicle_category==10){
        c.push({
          margin: [20, 20, 20, 5],
          text: [
            { text: 'Route Details: ', bold: true },
            
          ]
        })
        this?.gatePassData?.route?.forEach((d,i)=>{
          c.push(
            {
              margin: [20, 5, 20, i==this?.gatePassData?.route?.length -1 ? 20 :3 ],
              text: [
                { text: d.type + ": ", bold: true },
                { text:  d.name || '-'}
              ]
            }
          )
        })

      }
      if( this?.gatePassData?.vehicle_category==4 ){
        c.push({
          margin: [20, 5, 20, 5],
          text: [
            { text: 'Container Handling: ', bold: true },
            { text:  this.gatePassData?.container_handling || '-'}
          ]
        },{
          margin: [20, 5, 20, 5],
          text: [
            { text: 'Container Numbers: ', bold: true },
            { text:  this.gatePassData?.container_number || '-'}
          ]
        })
        
      }
      c.push( {
        margin: [20, 5, 20, 5],
        text: [
          { text: 'Employee In Charge: ', bold: true },
          { text:  this.gatePassData?.employee_in_charge || '-'}
        ]
      })
      this.gatePassData.extra_details.length &&  this.gatePassData.extra_details.forEach(element => {
        c.push( {
          margin: [20, 5, 20, 5],
          text: [
            { text: `${element?.label}: `, bold: true },
            { text:  element?.value}
          ]
        })
      });
      c.push( {
        margin: [20, 5, 20, 5],
        text: [
          { text: 'Issued By: ', bold: true },
          { text:  this.gatePassData?.issued_by}
        ]
      })
    


      this.pdfTemplate1.contents.push(c.filter(item=> !!item))
      let materialTable={
        margin: [20, 25, 20, 10],
        table: {
          headerRows: 1,
          widths: ['*', '*', '*', '*', '*','*'], // five equally spaced columns
          body: [
            [
              { text: 'Material', bold: true },
              { text: 'Unit', bold: true },
              { text: 'No. Of Item', bold: true },
              { text: 'Weight Per Unit', bold: true },
              { text: 'Volume/Item', bold: true },
              { text: 'Total Quantity', bold: true }
            ],
          ]
        },
        layout: 'grid' 
      }
      this.gatePassData.material_info?.forEach(m=>{
        materialTable?.table?.body.push(
          [
            m?.material?.name || '-',
             m?.unit?.label || '-',
             m?.no_of_items || '-',
             (m?.weight_per_item || '- ')+(" "+(m?.weight_unit?.label || '-')),
             (m?.length || '-')+'x'+(m?.breadth || '-')+'x'+(m?.height || '-')+' '+(m?.volume_unit?.label || '-'),
             m?.total_quantity || '-'
          ]
        )


      })
      if(this.gatePassData.material_info?.length) this.pdfTemplate1.contents.push(materialTable);
    }

}
