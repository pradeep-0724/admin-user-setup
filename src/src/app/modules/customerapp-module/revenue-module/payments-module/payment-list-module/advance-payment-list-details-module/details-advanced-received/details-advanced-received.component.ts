import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, forkJoin, Subscription } from 'rxjs';
import { PaymentsService } from '../../../../../api-services/revenue-module-service/payment-services/payments-service.service';
import { CompanyServices } from '../../../../../api-services/company-service/company-services.service';
import { CommonService } from 'src/app/core/services/common.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { normalDate } from 'src/app/shared-module/utilities/date-utilis';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { addFonts, reorderMixedText } from 'src/app/shared-module/utilities/pdfmake-uitls';
import { PartyService } from 'src/app/modules/customerapp-module/api-services/master-module-services/party-service/party.service';
import { bottomBorderTable, generatePdfTemplate1, getTermsAndConditionTableNextPage, getTermsAndConditionTableSamePage, pdfTemplate1 } from 'src/app/shared-module/utilities/pdftemplate-utils';
import { cloneDeep } from 'lodash';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { formatNumber } from 'src/app/shared-module/pipes/numberformat.pipe';

@Component({
  selector: 'app-details-advanced-received',
  templateUrl: './details-advanced-received.component.html',
  styleUrls: ['./details-advanced-received.component.scss']
})
export class DetailsAdvancedReceivedComponent implements OnInit, OnDestroy {
  @Input() advanceId: BehaviorSubject<string>;
  @Input() routeToDetail: boolean = false;
  @Output() openDetailsEmitter =new EventEmitter<boolean>();
  advanceReceivedData: any;
  companyDetailsData: any;
  company_logo: any = '';
  currency_type;
  isOpen = false;
  filebyteCode = new BehaviorSubject(null);
  prefixUrl = "";
  pdfSrc = ""
  advancePermissions = Permission.payments__advance.toString().split(',');
  advanceSubscription: Subscription;
  companyHeaderDetails: any;
  footerDetails: any;
  partyAddress:any
  advanceStatus : number ;
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
    private _paymentsService: PaymentsService,
    private _companyDetailsService: CompanyServices,
    private _commonService: CommonService,
    private ngxService: NgxUiLoaderService,
    private currency: CurrencyService,
    private _tax: TaxService,
    private _prefixUrl: PrefixUrlService,
    private _fileDownload: FileDownLoadAandOpen,
    private _partyService: PartyService,
  ) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    this.pdfTemplate1.isTax = this._tax.getTax();
    this.pdfTemplate1.isTds = this._tax.getVat();
    addFonts(pdfMake)
    
  }
  ngOnDestroy(): void {
    this.advanceSubscription.unsubscribe()
  }

  ngOnInit() {
    this.prefixUrl = this._prefixUrl.getprefixUrl();
    this.currency_type = this.currency.getCurrency();
    let logo=this._commonService.fetchCompanyLogo();
    let companyDetails=this._companyDetailsService.getCompanyDetailPrintView();
    forkJoin([logo,companyDetails]).subscribe((res)=>{
      this.company_logo = res[0]['result']['image_blob'];
      this.companyDetailsData = res[1]['result'];
      this.advanceDetails();
    })

  }

  
  openDetails(): void {
    this.routeToDetail=!this.routeToDetail;
    this.openDetailsEmitter.next(this.routeToDetail)
   }

  /* For getting all the advance details for respective ID */
  advanceDetails() {
    this.advanceSubscription = this.advanceId.subscribe((id) => {
      this._paymentsService.getAdvancePrintViewDetails(id).subscribe((res) => {
        this.advanceReceivedData = res['result'];
        this.advanceStatus = res['result']['status']
        this.getPartyDetails(this.advanceReceivedData['party'].id)
      });
    })

  }

  downloadPdf(data, print: boolean = false) {
    this.processPdf(data, print);
  }
  processPdf(data, print: boolean = false) {
    this.ngxService.start();
    if (print) {
      pdfMake.createPdf(generatePdfTemplate1(cloneDeep(this.pdfTemplate1))).print();
    } else {
      setTimeout(() => {
        let fileName = this.generateFileName() + ".pdf";
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

  getPartyDetails(id) {
    this._partyService.getPartyAdressDetails(id).subscribe((res) => {
      this.partyAddress = res['result'];
      setTimeout(() => {
        this.buildPdf()
      }, 1500);
    })

  }


  /*  For generating the file Name */

  generateFileName() {
    let partyName = this.advanceReceivedData['party']['display_name'];
    let paymentNumber = this.advanceReceivedData['advance_number'];
    return `${partyName}_${paymentNumber}`;
  }


  /* To mutate the date into a valid and accepted format using moment */

  dateChange(date) {
    return normalDate(date);
  }


  /* For adding image row in pdf regarding company logo */
  getAdvanceDetailsandCustomerDetailsBody() {
    let invoiceDetailsandCustomerDetailsBody = [
      [
        {
          stack: [
            {
              margin: [0, 0, 0, 3],
              text: [
                { text: 'Customer : ', style: 'contentBold' },
                { text: `${this.partyAddress.company_name}`, style: 'contentBold' },
              ]
            },
            {
              text: [
                { text:'', style: 'contentBold' },
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
                    { text: `${this.advanceReceivedData.advance_number}`, style: 'content' }
                  ]
                },
                {
                  margin: [0,0,3,0],
                  text: [
                    { text: 'Receipt Date: ', style: 'contentBold' },
                    { text: `${this.dateChange(this.advanceReceivedData.received_date)}`, style: 'content' }
                  ]
                },
                    {
                        text: [
                            { text: 'Payment Mode: ', style: 'contentBold' },
                            { text: `${this.advanceReceivedData.payment_mode?.display_name}`, style: 'content' }
                        ]
                    },
                {
                      text: [
                        { text: 'Amount: ', style: 'contentBold' },
                        { text: `${this?.currency_type?.symbol} ${formatNumber(Number(this.advanceReceivedData.amount))}`, style: 'content' }
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
    if (this.partyAddress.billing_address[0]) {
      invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
        {
          margin: [0, 0, 0, 0],
          text: [
            { text: `${this.partyAddress.billing_address[0]}`, style: 'content' },
          ]
        }
      )
    }
    if (this.partyAddress.billing_address[1]) {
      invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
        {
          margin: [0, 0, 0, 0],
          text: [
            { text: `${this.partyAddress.billing_address[1]}`, style: 'content' },
          ]
        }
      )
    }
    let text = [];
    if (this.pdfTemplate1.isTds) {
      if (this.partyAddress.tax_details?.gstin_view) {
        text.push({ text: 'TRN: ', style: 'contentBold' })
        text.push({ text: `${this.partyAddress.tax_details?.gstin_view}`, style: 'content' })
      }
      if (this.partyAddress.tax_details?.crn_view) {
        text.push({ text: '  CRN: ', style: 'contentBold' })
        text.push({ text: `${this.partyAddress.tax_details?.crn_view}`, style: 'content' })
      }
    } else {
      if (this.partyAddress.tax_details?.gstin_view) {
        text.push({ text: 'GSTIN : ', style: 'contentBold' })
        text.push({ text: `${this.partyAddress?.tax_details.gstin_view}`, style: 'content' })
      }
      if (this.partyAddress.tax_details?.pan) {
        text.push({ text: ' | PAN : ', style: 'contentBold' })
        text.push({ text: `${this.partyAddress.tax_details.pan}`, style: 'content' })
      }
    }
    invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
      {
        margin: [0, 0, 0, 0],
        text: text
      }
    )
    if (isValidValue(this.advanceReceivedData.party.contact)) {
          let customerContactPersonAndPhoneNo=''
          if(isValidValue(this.advanceReceivedData.party.contact.name) && isValidValue(this.advanceReceivedData.party.contact.no)){
            customerContactPersonAndPhoneNo = `${this.advanceReceivedData.party.contact.name} (${this.advanceReceivedData.party.contact.no})`
          }
          if(isValidValue(this.advanceReceivedData.party.contact.name) && !this.advanceReceivedData.party.contact.no){
            customerContactPersonAndPhoneNo = `${this.advanceReceivedData.party.contact.name}`
          }
          if(!this.advanceReceivedData.party.contact.name && isValidValue(this.advanceReceivedData.party.contact.no)){  
            customerContactPersonAndPhoneNo = `${this.advanceReceivedData.party.contact.no}`
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



    if (this.partyAddress.shipping_address[0] && this.partyAddress.shipping_address[1]) {
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
            { text: `${this.partyAddress.shipping_address[0]}`, style: 'content' },
          ]
        }
      )
      invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
        {
          text: [
            { text: `${this.partyAddress.shipping_address[1]}`, style: 'content' },
          ]
        }
      )
    }
    return invoiceDetailsandCustomerDetailsBody;
  }
  getTotalsTable() {
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
    bankBody[0][0].columns[0].stack.push(
      {
        text: [
          { text: 'Banking Charge', style: 'content' },
        ],
      },
    )
    bankBody[0][0].columns[1].stack.push(
      {
        text: [
          { text: `: ${  this.currency_type?.symbol} ${formatNumber(this.advanceReceivedData?.bank_charge)}`, style: 'contentBold' },
        ],
      }
    )
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
          { text: `:  ${this.currency_type?.symbol} ${formatNumber(Number(this.advanceReceivedData?.amount))}`, style: 'contentBold' },
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
              { text:`${this.advanceReceivedData.amount_in_word}`, style: 'contentBold' }
          ]


      }]
  ]
  return bottomBorderTable({body,widths:['100%']})
  }
  getRemarkAndDescription() {
    let widths=['50%','50%'];
    let body=[ [
        { 
            stack: [
                { text: 'Description Of Supply:', style: 'contentBold' },
                 { text: `${this.advanceReceivedData?.description_of_supply || '--'}`, style: 'content' },
            ]
        },
        {
            stack: [
              { text: 'Optional Comments:', style: 'contentBold' },
              { text: `${this.advanceReceivedData?.optional_comments || '--'}`, style: 'content' }
            ],
        },

    ]];
    return   bottomBorderTable({widths,body})
    
}
addPageBreak(contents) {
  let pdfContent = []
  const outerContentLength = contents.length;
  if (contents.length == 1) {
    pdfContent = contents
  } else {
    contents.forEach((element, index) => {
      if (index + 1 != outerContentLength) {
        element[element.length - 1]['pageBreak'] = "after"
      }
      element.forEach(innerElement => {
        pdfContent.push(innerElement)
      });
    });
  }
  return pdfContent
}

  buildPdf() {    
      this.pdfTemplate1.contents = []
      this.pdfTemplate1.headerDetails.companyname = this.companyDetailsData.company_name;
      this.pdfTemplate1.headerDetails.companynameNative = reorderMixedText(this.companyDetailsData.company_native_name);
      this.pdfTemplate1.headerDetails.crnNo = this.companyDetailsData.crn_no;
      this.pdfTemplate1.headerDetails.trnNo = this.companyDetailsData.gstin;
      this.pdfTemplate1.headerDetails.panNo = this.companyDetailsData.pan;
      this.pdfTemplate1.headerDetails.companyEmailId = this.companyDetailsData.email_address;
      this.pdfTemplate1.headerDetails.companyAddress = this.companyDetailsData.billing_address[0]+''+this.companyDetailsData.billing_address[1];
      this.pdfTemplate1.headerDetails.mobileNo = this.companyDetailsData.primary_mobile_number;
      this.pdfTemplate1.footerDetails.companyname = this.companyDetailsData.company_name;
      this.pdfTemplate1.footerDetails.companynameNative = reorderMixedText(this.companyDetailsData.company_native_name);
      this.pdfTemplate1.footerDetails.companyEmailId = this.companyDetailsData.email_address;
      this.pdfTemplate1.footerDetails.mobileNo = this.companyDetailsData.primary_mobile_number;
      this.pdfTemplate1.headerDetails.companyLogo = this.company_logo;
      this.pdfTemplate1.headerDetails.pdfTitle = 'Advance Received Details'
      this.pdfTemplate1.footerDetails.systemGenerated = 'This is a computer-generated Advance. No signature is required for validation.';
        this.pdfTemplate1.footerDetails.poweredBy = 'Powered By Transportsimple.com';
      this.pdfTemplate1.contents.push(
        bottomBorderTable({ body: this.getAdvanceDetailsandCustomerDetailsBody(), widths: ['40%', '60%'] }),
      )
      this.pdfTemplate1.contents.push(this.getTotalsTable())
      this.pdfTemplate1.contents.push(this.getAmountInWords())
      if(this.advanceReceivedData?.optional_comments || this.advanceReceivedData?.description_of_supply) {
        this.pdfTemplate1.contents.push(this.getRemarkAndDescription())
      }      
      if (this.advanceReceivedData.terms_and_condition && this.advanceReceivedData.terms_and_condition.same_page_display && this.advanceReceivedData.terms_and_condition.content) {
            this.pdfTemplate1.contents.push(getTermsAndConditionTableSamePage(this.advanceReceivedData.terms_and_condition.content));
          }
          if (this.advanceReceivedData.terms_and_condition && !this.advanceReceivedData.terms_and_condition.same_page_display && this.advanceReceivedData.terms_and_condition.content) {
            let termsAndConditionTable = getTermsAndConditionTableNextPage(this.advanceReceivedData.terms_and_condition.content);
            this.pdfTemplate1.contents=this.addPageBreak([this.pdfTemplate1.contents,termsAndConditionTable])
          }
      const pdfDocGenerator = pdfMake.createPdf(generatePdfTemplate1(cloneDeep(this.pdfTemplate1)));
      pdfDocGenerator.getDataUrl((dataUrl) => {
        this.pdfSrc = dataUrl
      });
    }
  emailPopUp(dataValues) {

    function toTitleCase(str) {
      return str.replace(/\S+/g, str => str.charAt(0).toUpperCase() + str.substr(1).toLowerCase());
    }
    let partyCompanyName = toTitleCase(dataValues['party'].display_name);
    let paymentNo = dataValues.advance_number;
    let senderCompany = this.companyDetailsData.company_name;
    let amountRecv = dataValues.amount;
    let subject = senderCompany + "| Advance Number : " + paymentNo
    let userName = toTitleCase(localStorage.getItem('TS_USER_NAME'))
    pdfMake.createPdf(generatePdfTemplate1(cloneDeep(this.pdfTemplate1))).getBase64(data => {
      let dataFormat = {
        base64Code: data,
        content: "\nHi " + partyCompanyName + " ,\n\nI hope you're well! Please see attached advance number " + paymentNo + " with a advance amount of " + this.currency_type.symbol + " " + amountRecv + ". Don't hesitate to reach out if you have any questions.\n\nKind regards,\n\n" + userName + "\n\n" + senderCompany,
        fileName: this.generateFileName(),
        email: dataValues['party']['email_address'],
        isOpen: true,
        subject: subject,
      }
      this.filebyteCode.next(dataFormat);
      this.isOpen = true;
    })
  }

  closeDialog(e) {
    if (e) {
      this.isOpen = false;
    }
  }




}
