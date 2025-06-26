import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { PaymentsService } from '../../../../../api-services/revenue-module-service/payment-services/payments-service.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { CommonService } from 'src/app/core/services/common.service';
import { checkEmpty, isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { normalDate } from 'src/app/shared-module/utilities/date-utilis';
import { TaxService } from 'src/app/core/services/tax.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { addFonts } from 'src/app/shared-module/utilities/pdfmake-uitls';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { bottomBorderTable, generatePdfTemplate1, getNarationSignature, getTermsAndConditionTableNextPage, getTermsAndConditionTableSamePage, pdfTemplate1 } from 'src/app/shared-module/utilities/pdftemplate-utils';
import { cloneDeep } from 'lodash';
import { formatNumber } from 'src/app/shared-module/pipes/numberformat.pipe';



@Component({
  selector: 'app-detail-invoice-settelment',
  templateUrl: './detail-invoice-settelment.component.html',
  styleUrls: ['./detail-invoice-settelment.component.scss']
})
export class DetailInvoiceSettelmentComponent implements OnInit {
  settlementData: any;
  partyDetails: any;
  debitDetails: any;
  advanceDetails: any;
  creditDetails: any;
  invoiceDetails: any;
  bosDetails: any;
  currency_symbol;
  companyLogo: any = '';
  isOpen = false;

  filebyteCode = new BehaviorSubject(null);
  partyData: any = [];
  partyAddress: any = [];
  companyAddress: any = [];
  prefixUrl = '';
  digitalSignature = '';
  pdfSrc = ""
  invoiceSettlementPermissions = Permission.payments__settlement.toString().split(',');
  companyHeaderDetails: any;
  footerDetails: any;
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
  };
  @Output() openDetailsEmitter =new EventEmitter<boolean>();
  @Input() routeToDetail: boolean = false;
  @Input() defaultDownload: boolean = false;

  constructor(private _paymentsService: PaymentsService,
    private currency: CurrencyService,
    private _commonService: CommonService,
    private _tax: TaxService,
    private _prefixUrl: PrefixUrlService,
    private _fileDownload: FileDownLoadAandOpen,
    private route: ActivatedRoute,
  ) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    this.pdfTemplate1.isTax = this._tax.getTax();
    this.pdfTemplate1.isTds = this._tax.getVat();
    this.currency_symbol = this.currency?.getCurrency()?.symbol;
    addFonts(pdfMake)
  }


  ngOnInit() {
    this.prefixUrl = this._prefixUrl.getprefixUrl();
    this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('pdfViewId')) {
        this.getPaymentSettlementDetails(paramMap.get('pdfViewId'))
      }
    });

  }
  openDetails(): void {
    this.routeToDetail=!this.routeToDetail;
    this.openDetailsEmitter.next(this.routeToDetail)
   }
  
  getPaymentSettlementDetails(id) {
    let paymentDetails = this._paymentsService.getPaymentSettlementPrintViewDetails(id);
    let companyLogo = this._commonService.fetchCompanyLogo()
    forkJoin([paymentDetails,companyLogo]).subscribe((data: any) => {
      this.settlementData = data[0].result;
      this.companyLogo = data[1].result.image_blob;
      this.buildPdf();
    })
  } 

  emailPopUp(dataValues) {

    function toTitleCase(str) {
      return str.replace(/\S+/g, str => str.charAt(0).toUpperCase() + str.substr(1).toLowerCase());
    }
    let partyCompanyName = toTitleCase(dataValues['party'].display_name);
    let paymentNo = dataValues.payment_number;
    let senderCompany = this.settlementData.company_name;
    let amountRecv = dataValues.amount_received;
    let subject = senderCompany + "| Payment Number : " + paymentNo
    let userName = toTitleCase(localStorage.getItem('TS_USER_NAME'))
    pdfMake.createPdf(generatePdfTemplate1(this.pdfTemplate1)).getBase64(data => {
      let dataFormat = {
        base64Code: data,
        fileName: this.generateFileName(),
        email: this.partyData['email_address'],
        subject: subject,
        content: "\nHi " + partyCompanyName + " ,\n\nI hope you're well! Please see attached payment number " + paymentNo + " with a received amount of " + this.currency_symbol + " " + amountRecv + ". Don't hesitate to reach out if you have any questions.\n\nKind regards,\n\n" + userName + "\n\n" + senderCompany,
        isOpen: true
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

  /* For retreiving company Details */


  downloadPdf(data, print: boolean = false) {
    this.processPdf(data, print);
  }

  processPdf(data, print: boolean = false) {
    setTimeout(() => {
      let fileNameA = this.generateFileName() + ".pdf"
      const pdfDocGenerator = pdfMake.createPdf(generatePdfTemplate1(this.pdfTemplate1));
      pdfDocGenerator.getBlob((blob) => {
        this._fileDownload.writeAndOpenFile(blob, fileNameA).then(data => {
        });
      });
    }, 500);
  }

  /*  For generating the file Name */

  generateFileName() {
    let partyName = this.settlementData['party']['display_name'];
    let paymentNumber = this.settlementData['payment_number'];
    return `${partyName}_${paymentNumber}`;
  }

  /* For adding image row in pdf regarding company logo */

  dateChange(date) {
    return normalDate(date);
  }

  generatePDF(data) {
    let creditNoteHeader;
    if (data.utilise_credit.length > 0) {
      creditNoteHeader = [
        [{
          alignment: 'left',
          text: [
            { text: 'Credit Notes ', style: 'contentBold', },
          ]
        }]
      ]
    }
    let creditNoteItems = [];
    let creditNoteWidths = [];

    creditNoteWidths = ["16.66%", "16.66%", "16.66%", "16.66%", "16.66%", "16.66%"];
    creditNoteItems.push(
      [
        { text: 'Date of Credit', bold: true }, { text: 'Credit No.', bold: true },
        { text: 'Original Amount' + '(' + this.currency_symbol + ')', bold: true },
        { text: 'Remaining Balance' + '(' + this.currency_symbol + ')', bold: true },
        { text: 'Availing' + '(' + this.currency_symbol + ')', bold: true },
        { text: 'Credit Balance' + '(' + this.currency_symbol + ')', bold: true }
      ]
    );
    data.utilise_credit.forEach((ele, i) => {
      creditNoteItems.push([
        this.dateChange(ele.credit_note_date),
        checkEmpty(ele, ['credit_note_number']),
        formatNumber(Number(checkEmpty(ele, ['total_amount'], true))),
        { text: formatNumber(Number(checkEmpty(ele, ['due_left'], true))) },
        { text: formatNumber(Number(checkEmpty(ele, ['availing_amount'], true))) },
        { text: formatNumber(Number(checkEmpty(ele, ['balance_left'], true))) }
      ]);
    });


    let creditNoteData: any;
    if (data.utilise_credit.length > 0) {
      creditNoteData = {
        alignment: 'left',
        fontSize: 9,
        table: {
          widths: creditNoteWidths,
          headerRows: 2,
          keepWithHeaderRows: 0,
          body: creditNoteItems
        },
        layout: {
          hLineWidth: function (i, node) {
            return (i === 1 || i === node.table.body.length) ? 0.7 : 0;
          },
          vLineWidth: () => 0.7,
          hLineColor: () => 'black',
          vLineColor: () => 'black'
        }
      };
      this.pdfTemplate1.contents.push(bottomBorderTable({ body: creditNoteHeader, widths: ['100%'] }), creditNoteData)
    }
    let debitNoteHeader;
    if (data.outstanding_debit.length > 0) {
      debitNoteHeader = [
        [{
          alignment: 'left',
          text: [
            { text: 'Debit Notes ', style: 'contentBold', },
          ]
        }]
      ]
    }
    let debitNoteItems = [];
    let debitNoteWidths = [];

    if (this.pdfTemplate1.isTax) {
      debitNoteWidths = ["12.5%", "12.5%", "12.5%", "12.5%", "12.5%", "12.5%", "12.5%", "12.5%"];
      debitNoteItems.push(
        [
          { text: 'Date of Debit', bold: true }, { text: 'Debit No.', bold: true },
          { text: 'Debit Amount' + '(' + this.currency_symbol + ')', bold: true },
          { text: 'Amount Due' + '(' + this.currency_symbol + ')', bold: true },
          { text: 'Discount' + '(' + this.currency_symbol + ')', bold: true },
          { text: 'Withheld' + '(' + this.currency_symbol + ')', bold: true },
          { text: 'Amount Received' + '(' + this.currency_symbol + ')', bold: true },
          { text: 'Balance' + '(' + this.currency_symbol + ')', bold: true }
        ]
      );
      if (this.pdfTemplate1.isTds) {
        debitNoteItems[0].splice(5, 1);
        debitNoteWidths.fill('14.28%');
        debitNoteWidths.splice(1, 1);
      }
      data.outstanding_debit.forEach((ele, i) => {
        debitNoteItems.push([
          this.dateChange(ele.debit_note_date), checkEmpty(ele, ['debit_note_number']),
          formatNumber(Number(checkEmpty(ele, ['total_amount'], true))),
          { text: formatNumber(Number(checkEmpty(ele, ['due_left'], true))) },
          { text: formatNumber(Number(checkEmpty(ele, ['adjustment'], true))) },
          { text: formatNumber(Number(checkEmpty(ele, ['withheld'], true))) },
          { text: formatNumber(Number(checkEmpty(ele, ['amount_received'], true))) },
          { text: formatNumber(Number(checkEmpty(ele, ['balance_left'], true))) },
        ]);
        if (this.pdfTemplate1.isTds) {
          debitNoteItems[i + 1].splice(5, 1);
        }
      });

    } else {
      debitNoteWidths = ["14.28%", "14.28%", "14.28%", "14.28%", "14.28%", "14.28%", "14.28%"];

      debitNoteItems.push(
        [
          { text: 'Date of Debit', bold: true }, { text: 'Debit No.', bold: true },
          { text: 'Debit Amount' + '(' + this.currency_symbol + ')', bold: true },
          { text: 'Amount Due' + '(' + this.currency_symbol + ')', bold: true },
          { text: 'Discount' + '(' + this.currency_symbol + ')', bold: true },
          { text: 'Amount Received' + '(' + this.currency_symbol + ')', bold: true },
          { text: 'Balance' + '(' + this.currency_symbol + ')', bold: true }
        ]
      );
      data.outstanding_debit.forEach((ele, i) => {
        debitNoteItems.push([
          this.dateChange(ele.debit_note_date), checkEmpty(ele, ['debit_note_number']),
          formatNumber(Number(checkEmpty(ele, ['total_amount'], true))),
          { text: formatNumber(Number(checkEmpty(ele, ['due_left'], true))) },
          { text: formatNumber(Number(checkEmpty(ele, ['adjustment'], true))) },
          { text: formatNumber(Number(checkEmpty(ele, ['amount_received'], true)) )},
          { text: formatNumber(Number(checkEmpty(ele, ['balance_left'], true))) },
        ]);
      });

    }
    let debitNoteData: any;
    if (data.outstanding_debit.length > 0) {
      debitNoteData = {
        alignment: 'left',
        fontSize: 9,
        table: {
          widths: debitNoteWidths,
          headerRows: 2,
          keepWithHeaderRows: 0,
          body: debitNoteItems
        },
        layout: {
          hLineWidth: function (i, node) {
            return (i === 1 || i === node.table.body.length) ? 0.7 : 0;
          },
          vLineWidth: () => 0.7,
          hLineColor: () => 'black',
          vLineColor: () => 'black'
        }
      };
      this.pdfTemplate1.contents.push(bottomBorderTable({ body: debitNoteHeader, widths: ['100%'] }),debitNoteData)
    }


    let advancesHeader;
    if (data.advance_received.length > 0) {
      advancesHeader = [
        [{
          alignment: 'left',
          text: [
            { text: 'Advance ', style: 'contentBold', },
          ]
        }]
      ]
    }
    let advanceItems = [];
    let advanceWidths = [];

    advanceWidths = ["16.66%", "16.66%", "16.66%", "16.66%", "16.66%", "16.66%"];

    advanceItems.push(
      [
        { text: 'Date of Advance', bold: true }, { text: 'Advance No.', bold: true },
        { text: 'Original Amount' + '(' + this.currency_symbol + ')', bold: true },
        { text: 'Remaining Balance' + '(' + this.currency_symbol + ')', bold: true },
        { text: 'Availing' + '(' + this.currency_symbol + ')', bold: true },
        { text: 'Advance Balance' + '(' + this.currency_symbol + ')', bold: true }
      ]
    );
    data.advance_received.forEach((ele, i) => {
      advanceItems.push([
        this.dateChange(ele.advance_date), checkEmpty(ele, ['advance_number']), formatNumber(Number(checkEmpty(ele, ['total_amount'], true))),
        { text: formatNumber(Number(checkEmpty(ele, ['due_left'], true))) },
        { text: formatNumber(Number(checkEmpty(ele, ['availing_amount'], true)) )},
        { text: formatNumber(Number(checkEmpty(ele, ['balance_left'], true))) }
      ]);
    });


    let advanceData: any;
    if (data.advance_received.length > 0) {
      advanceData = {
        alignment: 'left',
        fontSize: 9,
        table: {
          widths: advanceWidths,
          headerRows: 2,
          keepWithHeaderRows: 0,
          body: advanceItems
        },
        layout: {
          hLineWidth: function (i, node) {
            return (i === 1 || i === node.table.body.length) ? 0.7 : 0;
          },
          vLineWidth: () => 0.7,
          hLineColor: () => 'black',
          vLineColor: () => 'black'
        }
      };
      this.pdfTemplate1.contents.push(bottomBorderTable({ body: advancesHeader, widths: ['100%'] }),advanceData)
    }

    let invoiceHeader;
    if (data.outstanding_invoice.length > 0) {
      invoiceHeader = [
        [{
          alignment: 'left',
          text: [
            { text: 'Invoices ', style: 'contentBold', },
          ]
        }]
      ]
    }
    let invoiceItems = [];
    let invoiceWidths = [];

    if (this.pdfTemplate1.isTax) {
      invoiceWidths = ["12.5%", "12.5%", "12.5%", "12.5%", "12.5%", "12.5%", "12.5%", "12.5%"];
      invoiceItems.push(
        [
          { text: 'Date of Invoice', bold: true }, { text: 'Invoice No.', bold: true },
          { text: 'Invoice Amount' + '(' + this.currency_symbol + ')', bold: true },
          { text: 'Amount Due' + '(' + this.currency_symbol + ')', bold: true },
          { text: 'Discount' + '(' + this.currency_symbol + ')', bold: true },
          { text: 'Withheld' + '(' + this.currency_symbol + ')', bold: true },
          { text: 'Amount Received' + '(' + this.currency_symbol + ')', bold: true },
          { text: 'Balance' + '(' + this.currency_symbol + ')', bold: true }
        ]
      );
      if (this.pdfTemplate1.isTds) {
        invoiceItems[0].splice(5, 1);
        invoiceWidths.fill('14.28%');
        invoiceWidths.splice(1, 1);
      }
      data.outstanding_invoice.forEach((ele, i) => {
        invoiceItems.push([
          this.dateChange(ele.invoice_date), checkEmpty(ele, ['invoice_number']), checkEmpty(ele, ['total_amount'], true),
          { text: formatNumber(Number(checkEmpty(ele, ['due_left'], true))) },
          { text: formatNumber(Number(checkEmpty(ele, ['adjustment'], true))) },
          { text: formatNumber(Number(checkEmpty(ele, ['withheld'], true))) },
          { text: formatNumber(Number(checkEmpty(ele, ['amount_received'], true))) },
          { text: formatNumber(Number(checkEmpty(ele, ['balance_left'], true))) },
        ]);
        if (this.pdfTemplate1.isTds) {
          invoiceItems[i + 1].splice(5, 1);
        }

      });

    } else {
      invoiceWidths = ["14.28%", "14.28%", "14.28%", "14.28%", "14.28%", "14.28%", "14.28%",];
      invoiceItems.push(
        [
          { text: 'Date of Invoice', bold: true }, { text: 'Invoice No.', bold: true },
          { text: 'Invoice Amount' + '(' + this.currency_symbol + ')', bold: true },
          { text: 'Amount Due' + '(' + this.currency_symbol + ')', bold: true },
          { text: 'Discount' + '(' + this.currency_symbol + ')', bold: true },
          { text: 'Amount Received' + '(' + this.currency_symbol + ')', bold: true },
          { text: 'Balance' + '(' + this.currency_symbol + ')', bold: true }
        ]
      );

      data.outstanding_invoice.forEach((ele, i) => {
        invoiceItems.push([
          this.dateChange(ele.invoice_date), checkEmpty(ele, ['invoice_number']), formatNumber(Number(checkEmpty(ele, ['total_amount'], true))),
          { text: formatNumber(Number(checkEmpty(ele, ['due_left'], true))) },
          { text: formatNumber(Number(checkEmpty(ele, ['adjustment'], true))) },
          { text: formatNumber(Number(checkEmpty(ele, ['amount_received'], true))) },
          { text: formatNumber(Number(checkEmpty(ele, ['balance_left'], true))) },
        ]);
      });
    }
    let invoiceData: any;
    if (data.outstanding_invoice.length > 0) {
      invoiceData = {
        alignment: 'left',
        fontSize: 9,
        table: {
          widths: invoiceWidths,
          headerRows: 2,
          keepWithHeaderRows: 0,
          body: invoiceItems
        },
        layout: {
          hLineWidth: function (i, node) {
            return (i === 1 || i === node.table.body.length) ? 0.7 : 0;
          },
          vLineWidth: () => 0.7,
          hLineColor: () => 'black',
          vLineColor: () => 'black'
        }
      };
      this.pdfTemplate1.contents.push(bottomBorderTable({ body: invoiceHeader, widths: ['100%'] }),invoiceData)
    }

    let bosHeader;
    if (data.outstanding_bos.length > 0) {
      bosHeader = [
        [{
          alignment: 'left',
          text: [
            { text: 'BOS ', style: 'contentBold', },
          ]
        }]
      ]
    }
    let bosItems = [];
    let bosWidths = [];

    if (this.pdfTemplate1.isTds) {
      bosWidths = ["12.5%", "12.5%", "12.5%", "12.5%", "12.5%", "12.5%", "12.5%", "12.5%"];
      bosItems.push(
        [
          { text: 'Date of BoS', bold: true }, { text: 'BoS No.', bold: true },
          { text: 'BoS Amount' + '(' + this.currency_symbol + ')', bold: true },
          { text: 'Amount Due' + '(' + this.currency_symbol + ')', bold: true },
          { text: 'Discount' + '(' + this.currency_symbol + ')', bold: true },
          { text: 'Withheld' + '(' + this.currency_symbol + ')', bold: true },
          { text: 'Amount Received' + '(' + this.currency_symbol + ')', bold: true },
          { text: 'Balance' + '(' + this.currency_symbol + ')', bold: true }
        ]
      );
      if (this.pdfTemplate1.isTds) {
        bosWidths.fill('14.28%');
        bosWidths.splice(1, 1);
        bosItems[0].splice(5, 1);
      }
      data.outstanding_bos.forEach((ele, i) => {
        bosItems.push([
          this.dateChange(ele.bos_date), checkEmpty(ele, ['bos_number']), formatNumber(Number(checkEmpty(ele, ['total_amount'], true))),
          { text: formatNumber(Number(checkEmpty(ele, ['due_left'], true))) },
          { text: formatNumber(Number(checkEmpty(ele, ['adjustment'], true))) },
          { text: formatNumber(Number(checkEmpty(ele, ['withheld'], true))) },
          { text: formatNumber(Number(checkEmpty(ele, ['amount_received'], true)) )},
          { text: formatNumber(Number(checkEmpty(ele, ['balance_left'], true)) )},
        ]);
        if (this.pdfTemplate1.isTds) {
          bosItems[i + 1].splice(5, 1);
        }

      });
    } else {
      bosWidths = ["14.28%", "14.28%", "14.28%", "14.28%", "14.28%", "14.28%", "14.28%",];
      bosItems.push(
        [
          { text: 'Date of BoS', bold: true }, { text: 'BoS No.', bold: true },
          { text: 'BoS Amount' + '(' + this.currency_symbol + ')', bold: true },
          { text: 'Amount Due' + '(' + this.currency_symbol + ')', bold: true },
          { text: 'Discount' + '(' + this.currency_symbol + ')', bold: true },
          { text: 'Amount Received' + '(' + this.currency_symbol + ')', bold: true },
          { text: 'Balance' + '(' + this.currency_symbol + ')', bold: true }
        ]
      );
      data.outstanding_bos.forEach((ele, i) => {
        bosItems.push([
          this.dateChange(ele.bos_date), checkEmpty(ele, ['bos_number']), formatNumber(Number(checkEmpty(ele, ['total_amount'], true))),
          { text: formatNumber(Number(checkEmpty(ele, ['due_left'], true))) },
          { text: formatNumber(Number(checkEmpty(ele, ['adjustment'], true)) )},
          { text: formatNumber(Number(checkEmpty(ele, ['amount_received'], true))) },
          { text: formatNumber(Number(checkEmpty(ele, ['balance_left'], true))) },
        ]);
      });
    }




    let bosData: any;
    if (data.outstanding_bos.length > 0) {
      bosData = {
        alignment: 'left',
        fontSize: 9,
        table: {
          widths: bosWidths,
          headerRows: 2,
          keepWithHeaderRows: 0,
          body: bosItems
        },
        layout: {
          hLineWidth: function (i, node) {
            return (i === 1 || i === node.table.body.length) ? 0.7 : 0;
          },
          vLineWidth: () => 0.7,
          hLineColor: () => 'black',
          vLineColor: () => 'black'
        }
      };
      this.pdfTemplate1.contents.push(bottomBorderTable({ body: bosHeader, widths: ['100%'] }),bosData)
    }

  }
  


  buildPdf() {   
    this.pdfTemplate1.contents = []
    this.pdfTemplate1.headerDetails.companyname = this.settlementData.company.company_display_name;
    this.pdfTemplate1.headerDetails.companynameNative = ''
    this.pdfTemplate1.headerDetails.crnNo = this.settlementData.company.crn_no;
    this.pdfTemplate1.headerDetails.trnNo = this.settlementData.company.gstin;
    this.pdfTemplate1.headerDetails.panNo = this.settlementData.company.pan;
    this.pdfTemplate1.headerDetails.companyEmailId = this.settlementData.company.email_address;
    this.pdfTemplate1.headerDetails.companyAddress = this.settlementData.company.shipping_address[0]+''+this.settlementData.company.shipping_address[1];
    this.pdfTemplate1.headerDetails.mobileNo = this.settlementData.company.primary_mobile_number;
    this.pdfTemplate1.footerDetails.companyname = this.settlementData.company.company_display_name;
    this.pdfTemplate1.footerDetails.companynameNative = '';
    this.pdfTemplate1.footerDetails.companyEmailId = this.settlementData.company.email_address;
    this.pdfTemplate1.footerDetails.mobileNo = this.settlementData.company.primary_mobile_number;
    this.pdfTemplate1.headerDetails.companyLogo = this.companyLogo;
    this.pdfTemplate1.headerDetails.pdfTitle = 'Payment Received Details';
    this.pdfTemplate1.footerDetails.systemGenerated = 'This is a computer-generated Payment Received receipt. No signature is required for validation.'
    this.pdfTemplate1.footerDetails.poweredBy = 'Powered By Transportsimple.com';
    this.pdfTemplate1.contents.push(
      bottomBorderTable({ body: this.getCreditDetailsandCustomerDetailsBody(), widths: ['40%', '60%'] }),
    )
    this.generatePDF(this.settlementData)
    this.pdfTemplate1.contents.push(this.getBankAndTotalsTable())
    this.pdfTemplate1.contents.push(getNarationSignature({
      narration: this.settlementData.optional_comments,
      signature: this.settlementData.signature?.document,
      isNarration: true,
      isSignature: true,
      authorizedSignature: 'Signature',
      forSignature:''
    }));
    if (isValidValue(this.settlementData.terms_and_condition) && isValidValue(this.settlementData.terms_and_condition.same_page_display) && isValidValue(this.settlementData.terms_and_condition.content)) {
      this.pdfTemplate1.contents.push(getTermsAndConditionTableSamePage(this.settlementData.terms_and_condition.content));
    }
    if (isValidValue(this.settlementData.terms_and_condition) && !this.settlementData.terms_and_condition.same_page_display && isValidValue(this.settlementData.terms_and_condition.content)) {
      let termsAndConditionTable = getTermsAndConditionTableNextPage(this.settlementData.terms_and_condition.content);
      this.pdfTemplate1.contents= this.addPageBreak([this.pdfTemplate1.contents,termsAndConditionTable])
    }
    
    const pdfDocGenerator = pdfMake.createPdf(generatePdfTemplate1(cloneDeep(this.pdfTemplate1)));
    pdfDocGenerator.getDataUrl((dataUrl) => {
      this.pdfSrc = dataUrl
    });
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

  getCreditDetailsandCustomerDetailsBody() {
    let invoiceDetailsandCustomerDetailsBody = [
      [
        {
          stack: [
            {
              margin: [0, 0, 0, 3],
              text: [
                { text: 'Customer: ', style: 'contentBold' },
                { text: `${this.settlementData.party.display_name}`, style: 'content' },
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
                    { text: `${this.settlementData.payment_number}`, style: 'content' }
                  ]
                },
                {
                  text: [
                    { text: 'Payment Mode: ', style: 'contentBold' },
                    { text: `${this.settlementData.payment_choice?.label}`, style: 'content' }
                  ]
                },
                {
                  text: [
                    { text: 'Account: ', style: 'contentBold' },
                    { text: `${this.settlementData.account?.account}`, style: 'content' }
                  ]
                },
                {
                  margin: [0,0,3,0],
                  text: [
                    { text: 'Payment Date: ', style: 'contentBold' },
                    { text: `${this.dateChange(this.settlementData.date_of_payment)}`, style: 'content' }
                  ]
                },
                    {
                        text: [
                            { text: 'Money Received: ', style: 'contentBold' },
                            { text: `${this.currency_symbol} ${formatNumber(Number(this.settlementData.amount_received))}`, style: 'content' }
                        ]
                    },
                {
                      text: [
                        { text: 'Banking Charges: ', style: 'contentBold' },
                        { text: `${this.currency_symbol} ${formatNumber(Number(this.settlementData.bank_charge))}`, style: 'content' }
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
    if (this.settlementData.party.billing_address[0]) {
      invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
        {
          margin: [0, 0, 0, 0],
          text: [
            { text: `${this.settlementData.party.billing_address[0]}`, style: 'content' },
          ]
        }
      )
    }
    if (this.settlementData.party.billing_address[1]) {
      invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
        {
          margin: [0, 0, 0, 0],
          text: [
            { text: `${this.settlementData.party.billing_address[1]}`, style: 'content' },
          ]
        }
      )
    }
    let text = [];
    if (this.pdfTemplate1.isTds) {
      if (this.settlementData.party.tax_details?.gstin_view) {
        text.push({ text: 'TRN: ', style: 'contentBold' })
        text.push({ text: `${this.settlementData.party.tax_details?.gstin_view}`, style: 'content' })
      }
      if (this.settlementData.party.tax_details?.crn_view) {
        text.push({ text: '  CRN: ', style: 'contentBold' })
        text.push({ text: `${this.settlementData.party.tax_details?.crn_view}`, style: 'content' })
      }
    } else {
      if (this.settlementData.party.tax_details?.gstin_view) {
        text.push({ text: 'GSTIN : ', style: 'contentBold' })
        text.push({ text: `${this.settlementData.party?.tax_details.gstin_view}`, style: 'content' })
      }
      if (this.settlementData.party.tax_details?.pan) {
        text.push({ text: ' | PAN : ', style: 'contentBold' })
        text.push({ text: `${this.settlementData.party.tax_details.pan}`, style: 'content' })
      }
    }
    invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
      {
        margin: [0, 0, 0, 0],
        text: text
      }
    )
    
    if (this.settlementData.cheque_status?.label) {
      invoiceDetailsandCustomerDetailsBody[0][1].columns[1].stack.push(
        {
          text: [
            { text: 'Cheque Status: ', style: 'contentBold' },
            { text: `${this.settlementData.cheque_status?.label}`, style: 'content' }
          ]
        },
      )
    }
    if (this.settlementData.cheque_no) {
        invoiceDetailsandCustomerDetailsBody[0][1].columns[1].stack.push(
          {
            text: [
              { text: 'Cheque No. : ', style: 'contentBold' },
              { text: `${this.settlementData.cheque_no}`, style: 'content' }
            ]
          },
        )
      }
    if (this.settlementData.cheque_date) {
      invoiceDetailsandCustomerDetailsBody[0][1].columns[1].stack.push(
        {
          text: [
            { text: 'Cheque Date: ', style: 'contentBold' },
            { text: `${this.settlementData.cheque_date}`, style: 'content' }
          ]
        }
      )
    }
    if (this.settlementData.clearance_date) {
      invoiceDetailsandCustomerDetailsBody[0][1].columns[1].stack.push(
        {
          text: [
            { text: 'Clearance Date: ', style: 'contentBold' },
            { text: `${this.dateChange(this.settlementData.clearance_date)}`, style: 'content' }
          ]
        }
      )
    }
    if (this.settlementData.reference_number) {
      invoiceDetailsandCustomerDetailsBody[0][1].columns[1].stack.push(
        {
          text: [
            { text: 'Reference No: ', style: 'contentBold' },
            { text: `${this.settlementData.reference_number || '-'}`, style: 'content' }
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
              width: 'auto',
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
          { text: 'Amount Received', style: 'contentBold' },
        ]
      },
    )
    bankBody[0][1].columns[2].stack.push(
      {
        text: [
          { text: `:  ${this.currency_symbol} ${formatNumber(Number(this.settlementData.amount_received))}`, style: 'contentBold' },
        ]
      },
    )
    bankBody[0][1].columns[1].stack.push(
      {
        text: [
          { text: 'Advance Availed', style: 'contentBold' },
        ]
      },
    )
    bankBody[0][1].columns[2].stack.push(
      {
        text: [
          { text: `:  ${this.currency_symbol} ${formatNumber(Number(this.settlementData.total_advance_availed))}`, style: 'contentBold' },
        ]
      },
    )
    bankBody[0][1].columns[1].stack.push(
      {
        text: [
          { text: 'Credit Utilized', style: 'contentBold' },
        ]
      },
    )
    bankBody[0][1].columns[2].stack.push(
      {
        text: [
          { text: `:  ${this.currency_symbol} ${formatNumber(Number(this.settlementData.total_credit_availed))}`, style: 'contentBold' },
        ]
      },
    )
    bankBody[0][1].columns[1].stack.push(
      {
        text: [
          { text: 'Discount', style: 'contentBold' },
        ]
      },
    )
    bankBody[0][1].columns[2].stack.push(
      {
        text: [
          { text: `:  ${this.currency_symbol} ${formatNumber(Number(this.settlementData.discount))}`, style: 'contentBold' },
        ]
      },
    )
    bankBody[0][1].columns[1].stack.push(
      {
        text: [
          { text: 'Banking Charges', style: 'contentBold' },
        ]
      },
    )
    bankBody[0][1].columns[2].stack.push(
      {
        text: [
          { text: `:  ${this.currency_symbol} ${formatNumber(Number(this.settlementData.bank_charge))}`, style: 'contentBold' },
        ]
      },
    )
    bankBody[0][1].columns[1].stack.push(
      {
        text: [
          { text: 'Amount Breakup', style: 'contentBold' },
        ]
      },
    )
    bankBody[0][1].columns[2].stack.push(
      {
        text: [
          { text: `:  ${this.currency_symbol} ${formatNumber(Number(this.settlementData.amount_breakup))}`, style: 'contentBold' },
        ]
      },
    )
    bankBody[0][1].columns[1].stack.push(
      {
        text: [
          { text: 'Invoice ', style: 'content' },

        ]
      },
    )
    bankBody[0][1].columns[2].stack.push(
      {
        text: [
          { text: `:  ${this.currency_symbol} ${formatNumber(Number(this.settlementData.total_outstanding_invoice))}`, style: 'content' },

        ]
      },
    )
    if(!this.pdfTemplate1.isTds){
      bankBody[0][1].columns[1].stack.push(
        {
          text: [
            { text: 'BoS', style: 'content' },
          ]
        },
      )
      bankBody[0][1].columns[2].stack.push(
        {
          text: [
            { text: `:  ${this.currency_symbol} ${formatNumber(Number(this.settlementData.total_outstanding_bos))}`, style: 'content' },
          ]
        },
      )
    }
    bankBody[0][1].columns[1].stack.push(
      {
        text: [
          { text: 'Debit Notes', style: 'content' },
        ]
      },
    )
    bankBody[0][1].columns[2].stack.push(
      {
        text: [
          { text: `:  ${this.currency_symbol} ${formatNumber(Number(this.settlementData.total_outstanding_debit))}`, style: 'content' },
        ]
      },
    )
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
          { text: `:  ${this.currency_symbol} ${formatNumber(Number(this.settlementData.deduction_amount))}`, style: 'content' },
        ]
      },
    )
        bankBody[0][1].columns[1].stack.push(
      {
        text: [
          { text: 'Deductions', style: 'contentBold' },
        ]
      },
    )
    bankBody[0][1].columns[2].stack.push(
      {
        text: [
          { text: `:  ${this.currency_symbol} ${formatNumber(Number(this.settlementData.deduction_amount))}`, style: 'content' },
        ]
      },
    )

    // for (const [key, value] of Object.entries(this.settlementData.calculations.tax)) {
    //   bankBody[0][1].columns[1].stack.push(
    //     {
    //       text: [
    //         { text:`${key}`, style: 'contentBold' },
    //       ]
    //     },
    //   )
    //   bankBody[0][1].columns[2].stack.push(
    //     {
    //       text: [
    //         { text: `:  ${this.currency_symbol} ${value}`, style: 'contentBold' },
    //       ]
    //     },
    //   )
    // }

    // bankBody[0][1].columns[1].stack.push(
    //     {
    //       text: [
    //         { text: 'Discount ', style: 'contentBold' },
    //       ]
    //     },
    //   )
    //   bankBody[0][1].columns[2].stack.push(
    //     {
    //       text: [
    //         { text: `:  ${  this.currency_symbol} ${this.settlementData.calculations.adjustment.total}`, style: 'contentBold' },
    //       ]
    //     },
    //   )
    // bankBody[0][1].columns[1].stack.push(
    //   {
    //     text: [
    //       { text: 'Round off', style: 'contentBold' },
    //     ]
    //   },
    // )
    // bankBody[0][1].columns[2].stack.push(
    //   {
    //     text: [
    //       { text: `:  ${this.currency_symbol} ${this.settlementData.calculations.roundoff_amount}`, style: 'contentBold' },
    //     ]
    //   },
    // )
    // bankBody[0][1].columns[1].stack.push(
    //   {
    //     text: [
    //       { text: 'Total', style: 'contentBold' },
    //     ]
    //   },
    // )
    // bankBody[0][1].columns[2].stack.push(
    //   {
    //     text: [
    //       { text: `:  ${this.currency_symbol} ${this.settlementData.calculations.total}`, style: 'contentBold' },
    //     ]
    //   },
    // )
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
              { text:`${this.settlementData.calculations.total_in_word}`, style: 'contentBold' }
          ]


      }]
  ]
  return bottomBorderTable({body,widths:['100%']})
  }



}
