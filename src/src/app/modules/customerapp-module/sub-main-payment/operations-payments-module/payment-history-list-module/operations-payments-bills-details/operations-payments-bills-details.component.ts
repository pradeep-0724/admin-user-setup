import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { CommonService } from 'src/app/core/services/common.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { CompanyServices } from 'src/app/modules/customerapp-module/api-services/company-service/company-services.service';
import { normalDate } from 'src/app/shared-module/utilities/date-utilis';
import { checkEmpty } from 'src/app/shared-module/utilities/helper-utils';
import { OperationsPaymentService } from '../../../../api-services/payment-module-service/payment-service/operations-payments.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { Subscription, forkJoin } from 'rxjs';
import { addFonts } from 'src/app/shared-module/utilities/pdfmake-uitls';
import { bottomBorderTable, generatePdfTemplate1, getNarationSignature, pdfTemplate1 } from 'src/app/shared-module/utilities/pdftemplate-utils';
import { cloneDeep } from 'lodash';
import { formatNumber } from 'src/app/shared-module/pipes/numberformat.pipe';

@Component({
  selector: 'app-operations-payments-bills-details',
  templateUrl: './operations-payments-bills-details.component.html',
  styleUrls: ['./operations-payments-bills-details.component.scss']
})
export class OperationsPaymentsBillsDetailsComponent implements OnInit, OnDestroy {

  @Input() billId: BehaviorSubject<String>;
  bill_payment = Permission.bill_payment.toString().split(',');
  paymentBillData: any;
  companyDetailsData: any;
  companyLogo: any = '';
  currency_symbol;
  prefixUrl = "";
  pdfSrc = '';
  billid = '';
  billPaymentsSubscription: Subscription;
  @Input() routeToDetail: boolean = false;
  @Output() openDetailsEmitter =new EventEmitter<boolean>();

  pdfBlobs = [];
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
  }
  constructor(
    private _companyDetailsService: CompanyServices,
    private _commonService: CommonService,
    private currency: CurrencyService,
    private _tax: TaxService,
    private _prefixUrl: PrefixUrlService,
    private _fileDownload: FileDownLoadAandOpen,
    private _operationPaymentsService: OperationsPaymentService,
  ) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    this.pdfTemplate1.isTax = this._tax.getTax();
    this.pdfTemplate1.isTds = this._tax.getVat();
    addFonts(pdfMake)
    
  }
  ngOnDestroy(): void {
    this.billPaymentsSubscription.unsubscribe()
  }
  openDetails(): void {
    this.routeToDetail=!this.routeToDetail;
    this.openDetailsEmitter.next(this.routeToDetail)
   }

  ngOnInit() {
    this.prefixUrl = this._prefixUrl.getprefixUrl();
    this.getBillDetails();
    this.currency_symbol = this.currency.getCurrency()?.symbol;
  }


  getBillDetails() {
    this.billPaymentsSubscription = this.billId.subscribe(id => {
      this.pdfBlobs = [];
      let logo = this._commonService.fetchCompanyLogo();
      let debitNoteDetails = this._operationPaymentsService.getBillPaymentView(id);
      let companyDetails = this._companyDetailsService.getCompanyDetailPrintView();
      forkJoin([logo,debitNoteDetails,companyDetails]).subscribe((response)=>{
        this.companyLogo = response[0].result.image_blob;
        this.paymentBillData = response[1]['result'];
        this.companyDetailsData = response[2]['result'];
        this.billid = this.paymentBillData['id'];
        this.buildPdf();
      })
    })
  }

  downloadPdf(data, ) {
    this.processPdf(data, );
  }

  processPdf(data) { 
    setTimeout(() => {
      let fileName = this.generateFileName() + ".pdf";
      const pdfDocGenerator = pdfMake.createPdf(generatePdfTemplate1(this.pdfTemplate1));
      pdfDocGenerator.getBlob((blob) => {
        this._fileDownload.writeAndOpenFile(blob, fileName).then(data => {
        });
      });
    }, 500);
  }


  /*  For generating the file Name */

  generateFileName() {
    let partyName = this.paymentBillData.party.display_name
    let paymentNumber = this.paymentBillData['payment_no'];
    return `${partyName}_${paymentNumber}`;
  }


  /* To mutate the date into a valid and accepted format using moment */

  dateChange(date) {
    return normalDate(date);
  }


  /* For adding image row in pdf regarding company logo */



  generateBillTables(data) {
    let vendorCredits;
    if (data.vendor_credit.length > 0) {
       vendorCredits= [
        [{
          border : [0,0,0,0],
          text: [
            { text: 'Vendor Credit ', style: 'contentBold', },
          ]
        }]
      ]
    }
    let vendorCreditsItems = [];
    let vendorCreditsWidths = [];
    vendorCreditsWidths = ["16.666%", "16.666%", "16.666%", "16.666%", "16.666%", "16.666%"];
    vendorCreditsItems.push(
      [
        { text: 'Date', bold: true },
        { text: 'Reference', bold: true },
        { text: 'Orginal Amount' + '(' + this.currency_symbol + ')', bold: true },
        { text: 'Balance' + '(' + this.currency_symbol + ')', bold: true },
        { text: 'Amount Adjusted' + '(' + this.currency_symbol + ')', bold: true },
        { text: 'Final Balance' + '(' + this.currency_symbol + ')', bold: true },
      ]
    );
    data.vendor_credit.forEach((ele, i) => {
      ele.total=formatNumber(ele.total);
      ele.open_balance=formatNumber(ele.open_balance);
      ele.availing=formatNumber(ele.availing);
      ele.balance=formatNumber(ele.balance);
      vendorCreditsItems.push([
        { text: checkEmpty(ele, ['vendor_credit_date'], true) },
        { text: checkEmpty(ele, ['vendor_credit_number'], false) },
        { text: checkEmpty(ele, ['total'], true) },
        { text: checkEmpty(ele, ['open_balance'], true) },
        { text: checkEmpty(ele, ['availing'], true) },
        { text: checkEmpty(ele, ['balance'], true) },
      ]);
    });
    let vendorCreditsData: any;
    if (data.vendor_credit.length > 0) {
      vendorCreditsData = {
        alignment: 'center',
        fontSize: 9,
        table: {
          widths: vendorCreditsWidths,
          headerRows: 2,
          keepWithHeaderRows: 0,
          body: vendorCreditsItems
        },
        
        layout: {
          hLineWidth: function (i, node) {
            return (i==0||i === 1 || i === node.table.body.length) ? 0.7 : 0;
          },
          vLineWidth: () => 0.7,
          hLineColor: () => 'black',
          vLineColor: () => 'black',
        }
      };
      this.pdfTemplate1.contents.push(bottomBorderTable({body:vendorCredits,widths:['100%']}),vendorCreditsData)
    }


    let vendorAdvance ;
    if (data.vendor_advances.length > 0) {
      vendorAdvance= [
        [{
          border : [0,0,0,0],
          text: [
            { text: 'Vendor Advance ', style: 'contentBold', },
          ]


        }]
      ]
    }
    let vendorAdvanceItems = [];
    let vendorAdvanceWidths = [];

    vendorAdvanceWidths = ["16.66%", "16.66%", "16.66%", "16.66%", "16.66%", "16.66%"];
    vendorAdvanceItems.push(
      [
        { text: 'Date', bold: true },
        { text: 'Reference', bold: true },
        { text: 'Orginal Amount' + '(' + this.currency_symbol + ')', bold: true },
        { text: 'Balance' + '(' + this.currency_symbol + ')', bold: true },
        { text: 'Amount Adjusted' + '(' + this.currency_symbol + ')', bold: true },
        { text: 'Final Balance' + '(' + this.currency_symbol + ')', bold: true },
      ]
    );
    data.vendor_advances.forEach((ele, i) => {
      ele.amount=formatNumber(ele.amount);
      ele.open_balance=formatNumber(ele.open_balance);
      ele.availing=formatNumber(ele.availing);
      ele.balance=formatNumber(ele.balance);
      vendorAdvanceItems.push([
        { text: checkEmpty(ele, ['date'], true) },
        { text: checkEmpty(ele, ['advance_number'], false) },
        { text: checkEmpty(ele, ['amount'], true) },
        { text: checkEmpty(ele, ['open_balance'], true) },
        { text: checkEmpty(ele, ['availing'], true) },
        { text: checkEmpty(ele, ['balance'], true) },
      ]);
    });
    let vendorAdvanceData: any;
    if (data.vendor_advances.length > 0) {
      vendorAdvanceData = {
        // margin: [0, 10, 0, 10],
        alignment: 'center',
        fontSize:9,
        table: {
          widths: vendorAdvanceWidths,
          headerRows: 2,
          keepWithHeaderRows: 0,
          body: vendorAdvanceItems
        },
        layout: {
          hLineWidth: function (i, node) {
            return (i==0||i === 1 || i === node.table.body.length) ? 0.7 : 0;
          },
          vLineWidth: () => 0.7,
          hLineColor: () => 'black',
          vLineColor: () => 'black',
        }
      };
      this.pdfTemplate1.contents.push(bottomBorderTable({body:vendorAdvance,widths:['100%']}),vendorAdvanceData)
    }

    let outstandingBills;
    if (data.outstanding_bills.length > 0) {
      outstandingBills = [
        [{
          border : [0,0,0,0],
          text: [
            { text: 'Outstanding Bills ', style: 'contentBold', },
          ]
        }]
      ]
    }
    let outstandingBillsItems = [];
    let outstandingBillsWidths = [];
    outstandingBillsWidths = ["12.28%", "12.28%", "12.28%", "12.28%", "12.28%", "12.28%", "12.28%", "*"];
    outstandingBillsItems.push(
      [
        { text: 'Date', bold: true },
        { text: 'Bill Number', bold: true },
        { text: 'Bill Amount' + '(' + this.currency_symbol + ')', bold: true },
        { text: 'Amount Due' + '(' + this.currency_symbol + ')', bold: true },
        { text: 'Adjustment' + '(' + this.currency_symbol + ')', bold: true },
        { text: 'Withheald' + '(' + this.currency_symbol + ')', bold: true },
        { text: 'Amount Paid' + '(' + this.currency_symbol + ')', bold: true },
        { text: 'Balance' + '(' + this.currency_symbol + ')', bold: true }
      ]
    );
    if (this.pdfTemplate1.isTds) {
      outstandingBillsWidths.fill("14.2%");
      outstandingBillsWidths.splice(1, 1)
      outstandingBillsItems[0].splice(5, 1)
    }
    data.outstanding_bills.forEach((ele, i) => {
      ele.total=formatNumber(ele.total);
      ele.balance=formatNumber(ele.balance);
      ele.adjustment=formatNumber(ele.adjustment);
      ele.withheld=formatNumber(ele.withheld);
      ele.amount_paid=formatNumber(ele.amount_paid);
      ele.balance_left=formatNumber(ele.balance_left);
      outstandingBillsItems.push([
        { text: checkEmpty(ele, ['bill_date'], true) },
        { text: checkEmpty(ele, ['bill_number'], false) },
        { text: checkEmpty(ele, ['total'], true) },
        { text: checkEmpty(ele, ['balance'], true) },
        { text: checkEmpty(ele, ['adjustment'], true) },
        { text: checkEmpty(ele, ['withheld'], true) },
        { text: checkEmpty(ele, ['amount_paid'], true) },
        { text: checkEmpty(ele, ['balance_left'], true) },
      ]);
      if (this.pdfTemplate1.isTds) {
        outstandingBillsItems[i + 1].splice(5, 1)
      }
    });
    let outstandingBillsData: any;
    if (data.outstanding_bills.length > 0) {
      outstandingBillsData = {
        // alignment: '',
        fontSize: 9,
        margin: [0,0,0,0],
        table: {
          widths: outstandingBillsWidths,
          headerRows: 2,
          keepWithHeaderRows: 0,
          body: outstandingBillsItems
        },
        layout: {
          hLineWidth: function (i, node) {
            return (i==0||i === 1 || i === node.table.body.length) ? 0.7 : 0;
          },
          vLineWidth: () => 0.7,
          hLineColor: () => 'black',
          vLineColor: () => 'black',
        }
      };
      this.pdfTemplate1.contents.push(bottomBorderTable({body:outstandingBills,widths:['100%']}),outstandingBillsData)
    }

    let outstandingLabourBills;
    if (data.outstanding_labour_bills.length > 0) {
      outstandingLabourBills = [
        [{
          border : [0,0,0,0],
          text: [
            { text: 'Outstanding Bills ', style: 'contentBold', },
          ]
        }]
      ]
    }

    let outstandingLabourBillsItems = [];
    let outstandingLabourBillsWidths = [];

    outstandingLabourBillsWidths = ["11.11%", "11.11%", "11.11%", "11.11%", "11.11%", "11.11%", "11.11%", "11.11%", "11.11%"];
    outstandingLabourBillsItems.push(
      [
        { text: 'Date', bold: true },
        { text: 'Type', bold: true },
        { text: 'Bill Number', bold: true },
        { text: 'Bill Amount' + '(' + this.currency_symbol + ')', bold: true },
        { text: 'Amount Due' + '(' + this.currency_symbol + ')', bold: true },
        { text: 'Adjustment' + '(' + this.currency_symbol + ')', bold: true },
        { text: 'Withheald' + '(' + this.currency_symbol + ')', bold: true },
        { text: 'Amount Paid' + '(' + this.currency_symbol + ')', bold: true },
        { text: 'Balance' + '(' + this.currency_symbol + ')', bold: true }
      ]
    );
    if (this.pdfTemplate1.isTds) {
      outstandingLabourBillsWidths.fill("12.5%");
      outstandingLabourBillsWidths.splice(1, 1)
      outstandingLabourBillsItems[0].splice(6, 1)
    }
    data.outstanding_labour_bills.forEach((ele, i) => {
      ele.labour_total_balance=formatNumber(ele.labour_total_balance);
      ele.labour_balance=formatNumber(ele.labour_balance);
      ele.adjustment=formatNumber(ele.adjustment);
      ele.withheld=formatNumber(ele.withheld);
      ele.amount_paid=formatNumber(ele.amount_paid);
      ele.amount_due=formatNumber(ele.amount_due);
      outstandingLabourBillsItems.push([
        { text: checkEmpty(ele, ['date'], true) },
        { text: checkEmpty(ele, ['type'], true) },
        { text: checkEmpty(ele, ['bill_number'], false) },
        { text: checkEmpty(ele, ['labour_total_balance'], true) },
        { text: checkEmpty(ele, ['labour_balance'], true) },
        { text: checkEmpty(ele, ['adjustment'], true) },
        { text: checkEmpty(ele, ['withheld'], true) },
        { text: checkEmpty(ele, ['amount_paid'], true) },
        { text: checkEmpty(ele, ['amount_due'], true) },
      ]);
      if (this.pdfTemplate1.isTds) {
        outstandingLabourBillsItems[1 + i].splice(6, 1)
      }
    });
    let outstandingLabourBillsData: any;
    if (data.outstanding_labour_bills.length > 0) {
      outstandingLabourBillsData = {
        margin: [0, 10, 0, 10],
        alignment: 'center',
        fontSize: 7,
        table: {
          widths: outstandingLabourBillsWidths,
          headerRows: 2,
          keepWithHeaderRows: 0,
          body: outstandingLabourBillsItems
        },
        layout: {
          hLineWidth: function (i, node) {
            return (i==0||i === 1 || i === node.table.body.length) ? 0.7 : 0;
          },
          vLineWidth: () => 0.7,
          hLineColor: () => 'black',
          vLineColor: () => 'black',

        }
      };
      this.pdfTemplate1.contents.push(bottomBorderTable({body:outstandingLabourBills,widths:['100%']}),outstandingLabourBillsData)
    }
  }

  buildPdf() {    
    this.pdfTemplate1.contents = []    
    this.pdfTemplate1.headerDetails.companyname = this.companyDetailsData.company_name;
    this.pdfTemplate1.headerDetails.companynameNative = '';
    this.pdfTemplate1.headerDetails.crnNo = this.companyDetailsData.crn_no;
    this.pdfTemplate1.headerDetails.trnNo = this.companyDetailsData.gstin;
    this.pdfTemplate1.headerDetails.panNo = this.companyDetailsData.pan;
    this.pdfTemplate1.headerDetails.companyEmailId = this.companyDetailsData.email_address;
    this.pdfTemplate1.headerDetails.companyAddress = this.companyDetailsData.billing_address[0]+''+this.companyDetailsData.billing_address[1];
    this.pdfTemplate1.headerDetails.mobileNo = this.companyDetailsData.primary_mobile_number;
    this.pdfTemplate1.footerDetails.companyname = this.companyDetailsData.company_name;
    this.pdfTemplate1.footerDetails.companynameNative = '';
    this.pdfTemplate1.footerDetails.companyEmailId = this.companyDetailsData.email_address;
    this.pdfTemplate1.footerDetails.mobileNo = this.companyDetailsData.primary_mobile_number;
    this.pdfTemplate1.headerDetails.companyLogo = this.companyLogo;
    this.pdfTemplate1.headerDetails.pdfTitle = 'Payment Voucher';
    this.pdfTemplate1.footerDetails.poweredBy = 'Powered By Transportsimple.com';
    this.pdfTemplate1.footerDetails.systemGenerated = 'This is a computer-generated Payment Voucher. No signature is required for validation.'
    this.pdfTemplate1.contents.push(
      bottomBorderTable({ body: this.getDebitDetailsandCustomerDetailsBody(), widths: ['40%', '60%'] }),
    )
    this.generateBillTables(this.paymentBillData)
    this.pdfTemplate1.contents.push(this.getBankAndTotalsTable())

    this.pdfTemplate1.contents.push(this.getAmountInWords())
    this.pdfTemplate1.contents.push(getNarationSignature({
      signature: this.paymentBillData?.signature?.document,
      narration : this.paymentBillData?.comment,
      isNarration:  false,
      isSignature: this.paymentBillData?.signature?.document,
      authorizedSignature: 'Authorised Signatory',
      forSignature:''
    }));
    const pdfDocGenerator = pdfMake.createPdf(generatePdfTemplate1(cloneDeep(this.pdfTemplate1)));
    pdfDocGenerator.getDataUrl((dataUrl) => {
      this.pdfSrc = dataUrl
    });
  }

  getDebitDetailsandCustomerDetailsBody() {
    let invoiceDetailsandCustomerDetailsBody = [
      [
        {
          stack: [
            {
              margin: [0, 0, 0, 3],
              text: [
                { text: 'Vendor: ', style: 'contentBold' },
                { text: `${this.paymentBillData.party.display_name}`, style: 'contentBold' }
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
                    { text: 'Payment Number: ', style: 'contentBold' },
                    { text: `${this.paymentBillData.payment_no}`, style: 'content' }
                  ]
                },
                {
                  text: [
                    { text: 'Payment Mode: ', style: 'contentBold' },
                    { text: `${this.paymentBillData.payment_mode?.name}`, style: 'content' }
                  ]
                },
                {
                //   margin: [0, 0, 0, 3],
                  text: [
                    { text: 'Amount Paid: ', style: 'contentBold' },
                    { text: `${this.currency_symbol} ${formatNumber(this.paymentBillData.amount_paid)}`, style: 'content' }
                  ]
                },
              ]
            },
            {
              stack: [
                {
                  text: [
                    { text: 'Payment Date: ', style: 'contentBold' },
                    { text: `${this.dateChange(this.paymentBillData.date_of_payment)}`, style: 'content' }
                  ]
                },


              ]
            },
          ],
        }

      ]

    ]
    if (this.paymentBillData.party.billing_address[0]) {
      invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
        {
          margin: [0, 0, 0, 0],
          text: [
            { text: `${this.paymentBillData.party.billing_address[0]}`, style: 'content' },
          ]
        }
      )
    }
    if (this.paymentBillData.party.billing_address[1]) {
      invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
        {
          margin: [0, 0, 0, 0],
          text: [
            { text: `${this.paymentBillData.party.billing_address[1]}`, style: 'content' },
          ]
        }
      )
    }
    let text = [];
    if (this.pdfTemplate1.isTds) {
      if (this.paymentBillData.tax_details.gstin) {
        text.push({ text: 'TRN: ', style: 'contentBold' })
        text.push({ text: `${this.paymentBillData.tax_details.gstin}`, style: 'content' })
      }
      if (this.paymentBillData.tax_details.crn_no) {
        text.push({ text: '  CRN: ', style: 'contentBold' })
        text.push({ text: `${this.paymentBillData.tax_details.crn_no}`, style: 'content' })
      }
    } else {
      if (this.paymentBillData.tax_details.gstin) {
        text.push({ text: 'GSTIN : ', style: 'contentBold' })
        text.push({ text: `${this.paymentBillData.tax_details.gstin}`, style: 'content' })
      }
      if (this.paymentBillData.tax_details.pan) {
        text.push({ text: ' | PAN : ', style: 'contentBold' })
        text.push({ text: `${this.paymentBillData.tax_details.pan}`, style: 'content' })
      }
    }
    invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
      {
        margin: [0, 0, 0, 0],
        text: text
      }
    )

    if (this.paymentBillData.reference_no) {
      invoiceDetailsandCustomerDetailsBody[0][1].columns[1].stack.push(
        {
          text: [
            { text: 'Reference No: ', style: 'contentBold' },
            { text: `${this.paymentBillData.reference_no}`, style: 'content' }
          ]
        },
      )
    }
    if (this.paymentBillData.employee) {
      invoiceDetailsandCustomerDetailsBody[0][1].columns[1].stack.push(
        {
          text: [
            { text: 'Sales Person: ', style: 'contentBold' },
            { text: `${this.paymentBillData.employee}`, style: 'content' }
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
              width: 'auto',
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
          { text: 'Credit Availed', style: 'contentBold' },
        ]
      },
    )
    bankBody[0][1].columns[2].stack.push(
      {
        text: [
          { text: `:  ${this.currency_symbol} ${formatNumber(this.paymentBillData.credit_availed)}`, style: 'contentBold' },
        ]
      },
    )
    bankBody[0][1].columns[1].stack.push(
        {
          text: [
            { text: 'Advance Availed ', style: 'contentBold' },
          ]
        },
      )
      bankBody[0][1].columns[2].stack.push(
        {
          text: [
            { text: `:  ${  this.currency_symbol} ${formatNumber(this.paymentBillData.advance_availed)}`, style: 'contentBold' },
          ]
        },
      )
    bankBody[0][1].columns[1].stack.push(
      {
        text: [
          { text: 'Amount Paid', style: 'contentBold' },
        ]
      },
    )
    bankBody[0][1].columns[2].stack.push(
      {
        text: [
          { text: `:  ${this.currency_symbol} ${formatNumber(this.paymentBillData.amount_paid)}`, style: 'contentBold' },
        ]
      },
    )

    if(!this.pdfTemplate1.isTds){
      bankBody[0][1].columns[1].stack.push(
        {
          text: [
            { text: 'Withheld', style: 'contentBold' },
          ]
        },
      )
      bankBody[0][1].columns[2].stack.push(
        {
          text: [
            { text: `:  ${this.currency_symbol} ${formatNumber(this.paymentBillData.withheld_amount)}`, style: 'contentBold' },
          ]
        },
      )
    }
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
          { text: `:  ${this.currency_symbol} ${formatNumber(this.paymentBillData.amount_paid)}`, style: 'contentBold' },
        ]
      },
    )
    bankBody[0][1].columns[1].stack.push(
      {
        text: [
          { text: `Bill Amount Paid `, style: 'content' },
        ]
      },
    )
    bankBody[0][1].columns[2].stack.push(
      {
        text: [
          { text: `: ${this.currency_symbol} ${formatNumber(this.paymentBillData.amount_paid)}`, style: 'content' },
        ]
      },
    )
    bankBody[0][1].columns[1].stack.push(
      {
        text: [
          { text: `Vendor Advance `, style: 'content' },
        ]
      },
    )
    bankBody[0][1].columns[2].stack.push(
      {
        text: [
          { text: `: ${this.currency_symbol} ${formatNumber(this.paymentBillData.advance_availed)}`, style: 'content' },
        ]
      },
    )
    bankBody[0][1].columns[1].stack.push(
      {
        text: [
          { text: `Vendor Credit `, style: 'content' },
        ]
      },
    )
    bankBody[0][1].columns[2].stack.push(
      {
        text: [
          { text: `: ${this.currency_symbol} ${formatNumber(this.paymentBillData.credit_availed)}`, style: 'content' },
        ]
      },
    )
    bankBody[0][1].columns[1].stack.push(
      {
        text: [
          { text: `Discount `, style: 'content' },
        ]
      },
    )
    bankBody[0][1].columns[2].stack.push(
      {
        text: [
          { text: `: ${this.currency_symbol} ${formatNumber(this.paymentBillData.discount)}`, style: 'content' },
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
              { text:`${this.paymentBillData.total_in_words}`, style: 'contentBold' }
          ]


      }]
  ]
  return bottomBorderTable({body,widths:['100%']})
  }

}
