import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, forkJoin, Subscription } from 'rxjs';
import { OperationsPaymentService } from '../../../api-services/payment-module-service/payment-service/operations-payments.service';
import { CompanyServices } from '../../../api-services/company-service/company-services.service';
import { CommonService } from 'src/app/core/services/common.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { normalDate } from 'src/app/shared-module/utilities/date-utilis';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { addFonts, reorderMixedText } from 'src/app/shared-module/utilities/pdfmake-uitls';
import { bottomBorderTable, generatePdfTemplate1, pdfTemplate1 } from 'src/app/shared-module/utilities/pdftemplate-utils';
import { cloneDeep } from 'lodash';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { formatNumber } from 'src/app/shared-module/pipes/numberformat.pipe';

@Component({
  selector: 'app-details-vendor-advance',
  templateUrl: './details-vendor-advance.component.html',
  styleUrls: ['./details-vendor-advance.component.scss']
})
export class DetailsVendorAdvanceComponent implements OnInit,OnDestroy {

  @Input() vendorId:BehaviorSubject<String>;
  vendorCreditPermission = Permission.vendor_credit.toString().split(',');
  companyDetails:any=[];
  vendorAdvanceData: any=[];
  partyDetails: any=[];
  company_logo: any = '';
  currency_type;
  companyAddress =[];
  isTax:boolean = false;
  prefixUrl: string;
  isMobile = false;
  isIban = false;
  pdfSrc=''
  vendorAdvanceSubscription: Subscription;
  @Input() routeToDetail: boolean = false;
  @Output() openDetailsEmitter =new EventEmitter<boolean>();
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
  constructor(
    private _operationsPaymentService: OperationsPaymentService,
    private companyService:CompanyServices,
    private _commonService: CommonService,
    private ngxService: NgxUiLoaderService,
    private currency:CurrencyService,
    private _tax :TaxService,
    private _prefixUrl:PrefixUrlService,
    private deviceService: DeviceDetectorService,
    private _fileDownload:FileDownLoadAandOpen,
  )
  {pdfMake.vfs = pdfFonts.pdfMake.vfs;
    // this.isTax = this._tax.getTax();
    // this.isIban = this._tax.getIban()
    this.pdfTemplate1.isTax = this._tax.getTax();
    this.pdfTemplate1.isTds = this._tax.getVat();
    this.isMobile = this.deviceService.isMobile();
    addFonts(pdfMake)
   }
  ngOnDestroy(): void {
    this.vendorAdvanceSubscription.unsubscribe()
  }

  openDetails(): void {
    this.routeToDetail=!this.routeToDetail;
    this.openDetailsEmitter.next(this.routeToDetail)
   }

  ngOnInit() {
    this.prefixUrl = this._prefixUrl.getprefixUrl();
    this.currency_type = this.currency.getCurrency();
    this.vendorAdvanceDetails();

  }

  vendorAdvanceDetails(){
   this.vendorAdvanceSubscription= this.vendorId.subscribe((id)=>{
    let logo=this._commonService.fetchCompanyLogo();
    let vendorAdvance=this._operationsPaymentService.getVendorAdvance(id);
    let companyDetails=this.companyService.getCompanyDetailPrintView();
    forkJoin([logo,vendorAdvance,companyDetails]).subscribe((data:any)=>{
      this.company_logo = data[0].result.image_blob;
      this.vendorAdvanceData = data[1].result;
      this.partyDetails=this.vendorAdvanceData.party;
      this.companyDetails=data[2].result;
      this.companyAddress =  this.companyDetails['address'];
      this.buildPdf()
    })
})
}



emptyState(data) {
  if (data) {
    return data;
  }
  return '0';
}

dateChange(date) {
  return normalDate(date);
}

downloadPdf(data, print: boolean = false){
  this.processPdf(data, print);
}

processPdf(data, print: boolean = false) {
  this.ngxService.start();
  if (print) {
    pdfMake.createPdf(generatePdfTemplate1(cloneDeep(this.pdfTemplate1))).print();
  } else {
    setTimeout(() => {
      let fileName = this.generateFileName()+".pdf";
        const pdfDocGenerator = pdfMake.createPdf(generatePdfTemplate1(cloneDeep(this.pdfTemplate1)));
        pdfDocGenerator.getBlob((blob) => {
          this._fileDownload.writeAndOpenFile(blob, fileName).then(data => {
          });
        });
    }, 500);

  }
  setTimeout(() => {
    this.ngxService.stop();
  }, 500);
}

/*  For generating the file Name */
generateFileName() {
  let partyName = this.vendorAdvanceData['party']['company_name'];
  let paymentNumber = this.vendorAdvanceData['advance_number'];
  return `${partyName}_${paymentNumber}`;
}

  /* For adding image row in pdf regarding company logo */

getCreditDetailsandCustomerDetailsBody() {
    let invoiceDetailsandCustomerDetailsBody = [
      [
        {
          stack: [
            {
              margin: [0, 0, 0, 3],
              text: [
                { text: 'Vendor Details: ', style: 'contentBold' },
              ]
            },
            {
              text: [
                { text: `${this.vendorAdvanceData.party.company_name}`, style: 'contentBold' },
              ]
            },

          ]
        },
        {
          columns: [
            {
              stack: [
                {
                  text: [
                    { text: 'Payment No: ', style: 'contentBold' },
                    { text: `${this.vendorAdvanceData.advance_number}`, style: 'content' }
                  ]
                },
                {
                  margin: [0,0,3,0],
                  text: [
                    { text: 'Payment Date: ', style: 'contentBold' },
                    { text: `${this.dateChange(this.vendorAdvanceData.date)}`, style: 'content' }
                  ]
                },
                    {
                        text: [
                            { text: 'Payment Mode: ', style: 'contentBold' },
                            { text: `${this.vendorAdvanceData.payment_mode}`, style: 'content' }
                        ]
                    },
              ]
            },
            {
              stack: [
                {
                  text: [
                    { text: '', style: 'contentBold' },
                    { text: '', style: 'content' }
                  ]
                },


              ]
            },
          ],
        }

      ]

    ]
    if (this.vendorAdvanceData.party.billing_address[0]) {
      invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
        {
          margin: [0, 0, 0, 0],
          text: [
            { text: `${this.vendorAdvanceData.party.billing_address[0]}`, style: 'content' },
          ]
        }
      )
    }
    if (this.vendorAdvanceData.party.billing_address[1]) {
      invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
        {
          margin: [0, 0, 0, 0],
          text: [
            { text: `${this.vendorAdvanceData.party.billing_address[1]}`, style: 'content' },
          ]
        }
      )
    }
    let text = [];    
    if (this.pdfTemplate1.isTds) {
      if (this.vendorAdvanceData.party.tax_details.gstin_view) {
        text.push({ text: 'TRN: ', style: 'contentBold' })
        text.push({ text: `${this.vendorAdvanceData.party.tax_details.gstin_view}`, style: 'content' })
      }
      if (this.vendorAdvanceData.party.tax_details.crn_view) {
        text.push({ text: ' CRN: ', style: 'contentBold' })
        text.push({ text: `${this.vendorAdvanceData.party.tax_details.crn_view}`, style: 'content' })
      }
    } else {
      if (this.vendorAdvanceData.party.tax_details.gstin_view) {
        text.push({ text: 'GSTIN : ', style: 'contentBold' })
        text.push({ text: `${this.vendorAdvanceData.party.tax_details.gstin_view}`, style: 'content' })
      }
      if (this.vendorAdvanceData.party.tax_details.pan) {
        text.push({ text: ' | PAN : ', style: 'contentBold' })
        text.push({ text: `${this.vendorAdvanceData.party.tax_details.pan}`, style: 'content' })
      }
    }
    invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
      {
        margin: [0, 0, 0, 0],
        text: text
      }
    )
    if (isValidValue(this.vendorAdvanceData.party.contact)) {
              let customerContactPersonAndPhoneNo=''
              if(isValidValue(this.vendorAdvanceData.party.contact.name) && isValidValue(this.vendorAdvanceData.party.contact.no)){
                customerContactPersonAndPhoneNo = `${this.vendorAdvanceData.party.contact.name} (${this.vendorAdvanceData.party.contact.no})`
              }
              if(isValidValue(this.vendorAdvanceData.party.contact.name) && !this.vendorAdvanceData.party.contact.no){
                customerContactPersonAndPhoneNo = `${this.vendorAdvanceData.party.contact.name}`
              }
              if(!this.vendorAdvanceData.party.contact.name && isValidValue(this.vendorAdvanceData.party.contact.no)){  
                customerContactPersonAndPhoneNo = `${this.vendorAdvanceData.party.contact.no}`
              }
              invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
                {
                  margin: [0, 0, 0, 3],
                  text: [
                    { text: `Contact Person: ${customerContactPersonAndPhoneNo} `, style: 'contentBold' },
                  ]
                }
              )
            }
    if (this.vendorAdvanceData.party.shipping_address[0] && this.vendorAdvanceData.party.shipping_address[1]) {
      invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
        {
          text: [
            { text: 'Shipping Address:', style: 'contentBold' },
          ]
        }
      )
      invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
        {
          text: [
            { text: `${this.vendorAdvanceData.party.shipping_address[0]}`, style: 'content' },
          ]
        }
      )
      invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
        {
          text: [
            { text: `${this.vendorAdvanceData.party.shipping_address[1]}`, style: 'content' },
          ]
        }
      )
    }
  
    return invoiceDetailsandCustomerDetailsBody;
  }

  getBankAndTotalsTable() {
    let bankBody = [
      [
        {
          columns: [
            {
              width: 90,
              stack: []
            },
            {
              width: "*",
              stack: []
            }
          ]
        },
        {
          columns: [
            {
            },
            {
              width: 90,
              alignment: 'right',
              stack: []
            },
            {
              width: '*',
              stack: [] 
            },
          ]
        },
      ],

    ]
    bankBody[0][1].columns[1].stack.push(
      {
        text: [
          { text: 'Total', style: 'contentBold' },
        ]
      },
    )
    bankBody[0][1].columns[2].stack.push(
      {
        text: [
          { text: `:  ${this.currency_type?.symbol} ${formatNumber(this.vendorAdvanceData.amount)}`, style: 'contentBold' },
        ]
      },
    )
    let table=  {
      table: {
          widths: ['50%', '50%'],
          body: bankBody
      },
      layout: {
          hLineWidth: function (i, node) {
              return i==0?0:.7
          },
          vLineWidth: function (i, node) {
              return 0
          },
          hLineColor: function (i, node) {
              return 'black'
          },
          vLineColor: function (i, node) {
              return 'black'
          },
      }
  }
    return table
    
  }
  getAmountInWords() {
    let body=[
      [{
          text: [
              { text: 'Total Amount (in Words): ', style: 'content' },
              { text:`${this.vendorAdvanceData.amount_in_word}`, style: 'contentBold' }
          ]


      }]
  ]
  return bottomBorderTable({body,widths:['100%']})
  }
  getRemarkAndDescription() {
      if(!this.vendorAdvanceData?.remarks && !this.vendorAdvanceData?.description_of_supply) return {}
      let widths=['50%','50%'];
      let body=[ [
          { 
              stack: [
                  { text: 'Description Of Supply:', style: 'contentBold' },
                   { text: `${this.vendorAdvanceData?.description_of_supply || '--'}`, style: 'content' },
              ]
          },
          {
              stack: [
                { text: 'Remarks:', style: 'contentBold' },
                { text: `${this.vendorAdvanceData?.remarks || '--'}`, style: 'content' }
              ],
          },
  
      ]];
      return   bottomBorderTable({widths,body})
      
  }
buildPdf() {    
    this.pdfTemplate1.contents = []
    this.pdfTemplate1.headerDetails.companyname = this.companyDetails.company_name;
    this.pdfTemplate1.headerDetails.companynameNative = reorderMixedText(this.companyDetails.company_native_name);
    this.pdfTemplate1.headerDetails.crnNo = this.companyDetails.crn_no;
    this.pdfTemplate1.headerDetails.trnNo = this.companyDetails.gstin;
    this.pdfTemplate1.headerDetails.panNo = this.companyDetails.pan;
    this.pdfTemplate1.headerDetails.companyEmailId = this.companyDetails.email_address;
    this.pdfTemplate1.headerDetails.companyAddress = this.companyDetails.billing_address[0]+''+this.companyDetails.billing_address[1];
    this.pdfTemplate1.headerDetails.mobileNo = this.companyDetails.primary_mobile_number;
    this.pdfTemplate1.footerDetails.companyname = this.companyDetails.company_name;
    this.pdfTemplate1.footerDetails.companynameNative = reorderMixedText(this.companyDetails.company_native_name);
    this.pdfTemplate1.footerDetails.companyEmailId = this.companyDetails.email_address;
    this.pdfTemplate1.footerDetails.mobileNo = this.companyDetails.primary_mobile_number;
    this.pdfTemplate1.headerDetails.companyLogo = this.company_logo;
    this.pdfTemplate1.headerDetails.pdfTitle = 'Vendor Advance Details'
    this.pdfTemplate1.footerDetails.systemGenerated = 'This is a computer-generated Vendor Advance. No signature is required for validation.';
      this.pdfTemplate1.footerDetails.poweredBy = 'Powered By Transportsimple.com';
    this.pdfTemplate1.contents.push(
      bottomBorderTable({ body: this.getCreditDetailsandCustomerDetailsBody(), widths: ['40%', '60%'] }),
    )
    this.pdfTemplate1.contents.push(this.getBankAndTotalsTable())
    this.pdfTemplate1.contents.push(this.getAmountInWords())
    this.pdfTemplate1.contents.push(this.getRemarkAndDescription())
    const pdfDocGenerator = pdfMake.createPdf(generatePdfTemplate1(cloneDeep(this.pdfTemplate1)));
    pdfDocGenerator.getDataUrl((dataUrl) => {
      this.pdfSrc = dataUrl
    });
  }
}
