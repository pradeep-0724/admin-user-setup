import { TaxService } from 'src/app/core/services/tax.service';
import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, forkJoin, Subscription } from 'rxjs';
import { OperationsActivityService } from '../../../../api-services/operation-module-service/operations-activity.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { CommonService } from 'src/app/core/services/common.service';
import { normalDate } from 'src/app/shared-module/utilities/date-utilis';
import { isReverseMechanism, checkEmpty } from 'src/app/shared-module/utilities/helper-utils';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { addFonts } from 'src/app/shared-module/utilities/pdfmake-uitls';
import { bottomBorderTable, generatePdfTemplate1, getNarationSignature, pdfTemplate1 } from 'src/app/shared-module/utilities/pdftemplate-utils';
import { cloneDeep } from 'lodash';
import { formatNumber } from 'src/app/shared-module/pipes/numberformat.pipe';

@Component({
  selector: 'app-details-others-expense',
  templateUrl: './details-others-expense.component.html',
  styleUrls: ['./details-others-expense.component.scss']
})
export class DetailsOthersExpenseComponent implements OnInit, OnDestroy {
  othersData: any;
  companyLogo: any;
  currency_symbol;
  prefixUrl: any;
  pdfSrc = "";
  otherPermission = Permission.others.toString().split(',');
  otherSubscription: Subscription;
  @Input() routeToDetail: boolean = false;
  @Output() openDetailsEmitter = new EventEmitter<boolean>();
  @Input() 'OtherId': BehaviorSubject<String>;
  pdfBlobs = [];
  pdfTemplate1: pdfTemplate1 = {
    isTax: true,
    isTds: false,
    contents: [],
    headerDetails: {
      companyname: '',
      companynameNative: '',
      companyAddress: '',
      crnNo: '',
      trnNo: '',
      panNo: '',
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

  constructor(private _operationsActivityService: OperationsActivityService,
    private _commonService: CommonService, private currency: CurrencyService,
    private _prefixUrl: PrefixUrlService,
    private _fileDownload: FileDownLoadAandOpen,
    private _tax: TaxService,
  ) {
    this.pdfTemplate1.isTax = this._tax.getTax();
    this.pdfTemplate1.isTds = this._tax.getVat();
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    addFonts(pdfMake)
  }

  dateChange(date) {
    return normalDate(date);
  }

  openDetails(): void {
    this.routeToDetail = !this.routeToDetail;
    this.openDetailsEmitter.next(this.routeToDetail)
  }


  transactionStatus(status: boolean) {
    return isReverseMechanism(status);
  }
  ngOnDestroy(): void {
    this.otherSubscription.unsubscribe()
  }

  ngOnInit() {
    this.prefixUrl = this._prefixUrl.getprefixUrl();
    this.currency_symbol = this.currency.getCurrency()?.symbol;
    this.otherExpenseDetails();
  }

  otherExpenseDetails() {
    this.otherSubscription = this.OtherId.subscribe((id) => {
      let logo = this._commonService.fetchCompanyLogo();
      let otherdata = this._operationsActivityService.getOtherExpensePrintScreenData(id);
      forkJoin([logo, otherdata]).subscribe((data: any) => {
        this.companyLogo = data[0].result.image_blob;
        this.othersData = data[1].result;
        this.buildPdf();

      })
    })
  }

  downloadPdf(data) {
    this.processPdf(data);
  }

  processPdf(data, ) {
    setTimeout(() => {
      let fileName = this.generateFileName() + ".pdf";
      const pdfDocGenerator = pdfMake.createPdf(generatePdfTemplate1(this.pdfTemplate1));
      pdfDocGenerator.getBlob((blob) => {
        this._fileDownload.writeAndOpenFile(blob, fileName).then(data => {
        });
      });
    }, 500);
  }

  generateFileName() {
    let vendorName = this.othersData['vendor']['company_name'];
    let billNumber = this.othersData['bill_number'];
    return `${vendorName}_${billNumber}`;
  }

  generateItemOrthersTable(data) {
    let GSTTYPE = 'IGST';
    if (this.pdfTemplate1.isTds) {
      GSTTYPE = 'VAT'
    }
    let otherItems = [];
    let itemOtherWidths = [];

    itemOtherWidths = ["20%", "20%", "20%", "20%", "20%", "20%"]

    otherItems.push([
      {
        alignment: 'start',
        text:
          [
            { text: 'Item Others', fontSize: 11, bold: true },
          ],
        colSpan: 6
      }, {}, {}, {}, {}, {}
    ])
    otherItems.push(
      [
        { text: 'S.NO', bold: true }, { text: 'EXPENSE ACCOUNT', bold: true }, { text: 'ITEM', bold: true }, { text: 'QUANTITY', bold: true },
        { text: 'UNIT COST' + '(' + this.currency_symbol + ')', bold: true }, { text: 'AMOUNT' + '(' + this.currency_symbol + ')', bold: true }
      ]
    );
    data.expenses.forEach((ele, i) => {
      ele.rate_per_unit=formatNumber(ele.rate_per_unit);
      ele.total_before_tax=formatNumber(ele.total_before_tax);
      otherItems.push([
        i + 1, checkEmpty(ele, ['expense_account']), checkEmpty(ele, ['item']), checkEmpty(ele, ['quantity'], true), checkEmpty(ele, ['rate_per_unit'], true),
        { text: checkEmpty(ele, ['total_before_tax'], true) }
      ]);
    });

    let itemOtherFieldLength = itemOtherWidths.length;
    if (data.is_interstate) {
      itemOtherFieldLength += 2;
      otherItems[0][0].colSpan += 2;
      otherItems[0].push({});
      otherItems[0].push({});

      const widthString = (100 / itemOtherFieldLength).toFixed(3);
      itemOtherWidths = Array(itemOtherFieldLength).fill(widthString + "%");

      otherItems[1].splice(itemOtherFieldLength - 1, 0, { text: GSTTYPE + '(' + this.currency_symbol + ')', bold: true })
      otherItems[1].splice(itemOtherFieldLength - 1, 0, { text: 'TOTAL' + '(' + this.currency_symbol + ')', bold: true })

      data.expenses.forEach((ele, j) => {
        ele.total=formatNumber(ele.total);
        otherItems[2 + j].splice(itemOtherFieldLength - 1, 0,
          {
            text:
              [
                { text: checkEmpty(ele, ['tax_description', 'IGST'], true) + '%' },
                '\n',
                { text: '' + checkEmpty(ele, ['tax_description', 'IGST_amount'], true) }
              ]
          })

        otherItems[2 + j].splice(itemOtherFieldLength - 1, 0,
          { text: '' + checkEmpty(ele, ['total'], true) })


      });

    } else {
      itemOtherFieldLength += 3;
      otherItems[0][0].colSpan += 3;
      otherItems[0].push({});
      otherItems[0].push({});
      otherItems[0].push({});

      const widthString = (100 / itemOtherFieldLength).toFixed(3);
      itemOtherWidths = Array(itemOtherFieldLength).fill(widthString + "%");

      otherItems[1].splice(itemOtherFieldLength - 1, 0, { text: 'CGST', bold: true })
      otherItems[1].splice(itemOtherFieldLength - 1, 0, { text: 'SGST', bold: true })
      otherItems[1].splice(itemOtherFieldLength - 1, 0, { text: 'TOTAL' + '(' + this.currency_symbol + ')', bold: true })

      data.expenses.forEach((ele, j) => {

        otherItems[2 + j].splice(itemOtherFieldLength - 1, 0,
          {
            text:
              [
                { text: checkEmpty(ele, ['tax_description', 'CGST'], true) + '%' },
                '\n',
                { text: '' + checkEmpty(ele, ['tax_description', 'CGST_amount'], true) }
              ]
          })

        otherItems[2 + j].splice(itemOtherFieldLength - 1, 0,
          {
            text:
              [
                { text: checkEmpty(ele, ['tax_description', 'SGST'], true) + '%' },
                '\n',
                { text: '' + checkEmpty(ele, ['tax_description', 'SGST_amount'], true) }
              ]
          })

        otherItems[2 + j].splice(itemOtherFieldLength - 1, 0,
          { text: '' + checkEmpty(ele, ['total'], true) })

      });

    }
    let others: any;
    if (data.expenses.length > 0) {
      others = {
        // margin: [0, 10, 0, 10],
        alignment: 'center',
        fontSize: 9,
        table: {
          widths: itemOtherWidths,
          headerRows: 2,
          keepWithHeaderRows: 0,
          body: otherItems
        },
        layout: {
          hLineWidth: function (i, node) {
            return (i === 1 || i == 2 || i === node.table.body.length) ? 0.7 : 0;
          },
          vLineWidth: () => 0.7,
          hLineColor: () => 'black',
          vLineColor: () => 'black',
        }
      };
      this.pdfTemplate1.contents.push(others)

    }


  }

  buildPdf() {
    this.pdfTemplate1.contents = []
    this.pdfTemplate1.headerDetails.companyname = this.othersData.company.company_name;
    this.pdfTemplate1.headerDetails.companynameNative = '';
    this.pdfTemplate1.headerDetails.trnNo = this.othersData.company.gstin;
    this.pdfTemplate1.headerDetails.crnNo = this.othersData.company.crn_no;
    this.pdfTemplate1.headerDetails.panNo = this.othersData.company.pan;
    this.pdfTemplate1.headerDetails.companyEmailId = this.othersData.company.email_address;
    this.pdfTemplate1.headerDetails.companyAddress = this.othersData.company.billing_address[0] + '' + this.othersData.company.billing_address[1];
    this.pdfTemplate1.headerDetails.mobileNo = this.othersData.company.primary_mobile_number;
    this.pdfTemplate1.footerDetails.companyname = this.othersData.company.company_name;
    this.pdfTemplate1.footerDetails.companynameNative = '';
    this.pdfTemplate1.footerDetails.companyEmailId = this.othersData.company.email_address;
    this.pdfTemplate1.footerDetails.mobileNo = this.othersData.company.primary_mobile_number;
    this.pdfTemplate1.headerDetails.companyLogo = this.companyLogo;
    this.pdfTemplate1.headerDetails.pdfTitle = 'Other Bills Details';
    this.pdfTemplate1.footerDetails.poweredBy = 'Powered By Transportsimple.com';
    this.pdfTemplate1.footerDetails.systemGenerated = 'This is a computer-generated Other Bills receipt. No signature is required for validation.'
    this.pdfTemplate1.contents.push(
      bottomBorderTable({ body: this.getDebitDetailsandCustomerDetailsBody(), widths: ['50%', '50%'] }),
    )
    this.generateItemOrthersTable(this.othersData);
    this.pdfTemplate1.contents.push(
      bottomBorderTable({ body: this.getPaymentRelatedDetails(), widths: ['50%', '50%'] }),
    )
    this.pdfTemplate1.contents.push(this.getBankAndTotalsTable())

    this.pdfTemplate1.contents.push(this.getAmountInWords())
    this.pdfTemplate1.contents.push(getNarationSignature({
      signature: '',
      narration: this.othersData?.comments,
      isNarration: this.othersData?.comments ? true : false,
      isSignature: false,
      authorizedSignature: 'Authorised Signatory',
      forSignature: ''
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
                { text: `${this.othersData.vendor.company_name}`, style: 'contentBold' },
              ]
            },
            {
              text: [
                { text: 'Place Of Supply: ', style: 'contentBold' },
                { text: `${this.othersData.place_of_supply}`, style: 'content' }
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
                    { text: 'Bill Number: ', style: 'contentBold' },
                    { text: `${this.othersData.bill_number}`, style: 'content' }
                  ]
                },
                {
                  text: [
                    { text: 'Bill Date: ', style: 'contentBold' },
                    { text: `${this.dateChange(this.othersData.bill_date)}`, style: 'content' }
                  ]
                },
                {
                  //   margin: [0, 0, 0, 3],
                  text: [
                    { text: 'Due Date: ', style: 'contentBold' },
                    { text: `${this.dateChange(this.othersData.due_date)}`, style: 'content' }
                  ]
                },
                {
                  text: [
                    { text: 'Payment Terms: ', style: 'contentBold' },
                    { text: `${this.othersData.payment_term}`, style: 'content' }
                  ]
                },
              ]
            },
            {
              stack: [
                {
                },


              ]
            },
          ],
        }

      ]

    ]
    if (this.othersData.vendor.billing_address[0]) {
      invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
        {
          margin: [0, 0, 0, 0],
          text: [
            { text: 'Address : ', style: 'contentBold' },
            { text: `${this.othersData.vendor.billing_address[0] + '' + this.othersData.vendor.billing_address[1]}`, style: 'content' },
          ]
        }
      )
    }
    let text = [];
    if (this.pdfTemplate1.isTds) {
      if (this.othersData.vendor.tax_details.gstin_view) {
        text.push({ text: 'TRN: ', style: 'contentBold' })
        text.push({ text: `${this.othersData.vendor.tax_details.gstin_view}`, style: 'content' })
      }
      if (this.othersData.vendor.tax_details.crn_view) {
        text.push({ text: ' CRN: ', style: 'contentBold' })
        text.push({ text: `${this.othersData.vendor.tax_details.crn_view}`, style: 'content' })
      }
    } else {
      if (this.othersData.vendor.tax_details.gstin_view) {
        text.push({ text: 'GSTIN : ', style: 'contentBold' })
        text.push({ text: `${this.othersData.vendor.tax_details.gstin_view}`, style: 'content' })
      }
      if (this.othersData.vendor.tax_details.pan) {
        text.push({ text: ' | PAN : ', style: 'contentBold' })
        text.push({ text: `${this.othersData.vendor.tax_details.pan}`, style: 'content' })
      }
    }
    invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
      {
        margin: [0, 0, 0, 0],
        text: text
      }
    )

    if (this.othersData.employee) {
      invoiceDetailsandCustomerDetailsBody[0][1].columns[1].stack.push(
        {
          text: [
            { text: 'Employee In Charge: ', style: 'contentBold' },
            { text: `${this.othersData.employee}`, style: 'content' }
          ]
        }
      )
    }
    if (this.othersData.employee) {
      invoiceDetailsandCustomerDetailsBody[0][1].columns[1].stack.push(
        {
          text: [
            { text: 'Payment Term : ', style: 'contentBold' },
            { text: `${this.othersData.payment_term}`, style: 'content' }
          ]
        }
      )
    }
    return invoiceDetailsandCustomerDetailsBody;
  }

  getPaymentRelatedDetails() {
    let paymentDetails = [
      [
        {
          stack: [
            {
              margin: [0, 0, 0, 3],
              text: [
                { text: 'Payment Status: ', style: 'contentBold' },
                { text: `${this.othersData.payment_status}`, style: 'content' },
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
                    { text: 'Transaction Date : ', style: 'contentBold' },
                    { text: `${this.othersData.transaction_date ? this.othersData.transaction_date : '-'}`, style: 'content' }
                  ]
                },
                {
                  text: [
                    { text: 'Payment Mode: ', style: 'contentBold' },
                    { text: `${this.othersData.payment_mode ? this.othersData.payment_mode : '-'}`, style: 'content' }
                  ]
                },
                {
                  text: [
                    { text: 'Banking Charges : ', style: 'contentBold' },
                    { text: `${this.currency_symbol} ${ formatNumber(this.othersData.bank_charges)}`, style: 'content' }
                  ]
                },
                {
                  text: [
                    { text: 'Remainder Date : ', style: 'contentBold' },
                    { text: `${this.dateChange(this.othersData.reminder)}`, style: 'content' }
                  ]
                },
              ]
            },
          ],
        }

      ]

    ]
    return paymentDetails;

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
              width: "auto",
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
              width: 'auto',
              stack: []
            },
          ]
        },
      ],

    ]



    bankBody[0][1].columns[1].stack.push(
      {
        text: [
          { text: 'Sub Total', style: 'contentBold' },
        ]
      },
    )
    bankBody[0][1].columns[2].stack.push(
      {
        text: [
          { text: `:  ${this.currency_symbol} ${formatNumber(this.othersData.subtotal)}`, style: 'contentBold' },
        ]
      },
    )
    for (const [key, value] of Object.entries(this.othersData.tax)) {
      bankBody[0][1].columns[1].stack.push(
        {
          text: [
            { text: `${key}`, style: 'contentBold' },
          ]
        },
      )
      bankBody[0][1].columns[2].stack.push(
        {
          text: [
            { text: `:  ${this.currency_symbol} ${value}`, style: 'contentBold' },
          ]
        },
      )
    }
    bankBody[0][1].columns[1].stack.push(
      {
        text: [
          { text: 'Discount After Tax ', style: 'contentBold' },
        ]
      },
    )
    bankBody[0][1].columns[2].stack.push(
      {
        text: [
          { text: `:  ${this.currency_symbol} ${formatNumber(this.othersData.discount_after_tax_amount)}`, style: 'contentBold' },
        ]
      },
    )
    bankBody[0][1].columns[1].stack.push(
      {
        text: [
          { text: `${this.othersData.adjustment_account?.name}`, style: 'contentBold' },
        ]
      },
    )
    bankBody[0][1].columns[2].stack.push(
      {
        text: [
          { text: `:  ${this.currency_symbol} ${formatNumber(this.othersData.adjustment_amount)}`, style: 'contentBold' },
        ]
      },
    )

    if (!this.pdfTemplate1.isTds) {
      bankBody[0][1].columns[1].stack.push(
        {
          text: [
            { text: 'Bill Amount', style: 'contentBold' },
          ]
        },
      )
      bankBody[0][1].columns[2].stack.push(
        {
          text: [
            { text: `:  ${this.currency_symbol} ${formatNumber(this.othersData.total)}`, style: 'contentBold' },
          ]
        },
      )
    }
    if(!this.pdfTemplate1.isTds){
      bankBody[0][1].columns[1].stack.push(
        {
          text: [
            { text: 'TDS', style: 'contentBold' },
          ]
        },
      )
      bankBody[0][1].columns[2].stack.push(
        {
          text: [
            { text: `:  ${this.currency_symbol} ${formatNumber(this.othersData.tds_amount)}`, style: 'contentBold' },
          ]
        },
      )
    }


    let table = {
      table: {
        widths: ['50%', '50%'],
        body: bankBody
      },
      layout: {
        hLineWidth: function (i, node) {
          return i == 0 ? 0 : .7
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
    let body = [
      [{
        text: [
          { text: 'Total Amount (in Words): ', style: 'content' },
          { text: ` ${this.othersData.amount_in_word}`, style: 'contentBold' }
        ]
      }]
    ]
    return bottomBorderTable({ body, widths: ['100%'] })
  }

}
