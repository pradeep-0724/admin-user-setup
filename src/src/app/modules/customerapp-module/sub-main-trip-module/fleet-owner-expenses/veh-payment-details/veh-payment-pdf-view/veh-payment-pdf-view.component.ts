import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { OperationsActivityService } from 'src/app/modules/customerapp-module/api-services/operation-module-service/operations-activity.service';
import { checkEmpty, isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { addFonts } from 'src/app/shared-module/utilities/pdfmake-uitls';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { forkJoin } from 'rxjs';
import { bottomBorderTable, generatePdfTemplate1, pdfTemplate1 } from 'src/app/shared-module/utilities/pdftemplate-utils';
import { cloneDeep } from 'lodash';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { formatNumber } from 'src/app/shared-module/pipes/numberformat.pipe';

@Component({
  selector: 'app-veh-payment-pdf-view',
  templateUrl: './veh-payment-pdf-view.component.html',
  styleUrls: ['./veh-payment-pdf-view.component.scss']
})
export class VehPaymentPdfViewComponent implements OnInit {

  preFixUrl = ''
  pdfSrc = ""
  fleetData: any;
  companyLogo = '';
  currency_symbol;
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
    private dialogRef: DialogRef<boolean>,
    private _commonService: CommonService,
    private currency: CurrencyService,
    private _tax: TaxService,
    private _preFixUrl: PrefixUrlService,
    private _commonLoaderService: CommonLoaderService,
    private _fileDownload: FileDownLoadAandOpen,
    @Inject(DIALOG_DATA) private dialogData: any
  ) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    this.pdfTemplate1.isTax = this._tax.getTax();
    this.pdfTemplate1.isTds = this._tax.getVat();
    addFonts(pdfMake)
  }

  ngOnInit() {
    this._commonLoaderService.getHide();
    this.currency_symbol = this.currency.getCurrency()?.symbol;
    this.preFixUrl = this._preFixUrl.getprefixUrl();
    this.fleetOwnerDetails(this.dialogData);
  }

  ngOnDestroy() {
    this._commonLoaderService.getShow();
  }

  fleetOwnerDetails(id) {
    let logo = this._commonService.fetchCompanyLogo();
    let fleetData = this._operationsActivityService.getFleetOwnerPrintScreenData(id);
    this.pdfBlobs = [];
    forkJoin([logo, fleetData]).subscribe((data: any) => {
      this.companyLogo = data[0].result.image_blob;
      this.fleetData = data[1].result;
      this.buildPdf();
    })
  }

  buildPdf() {
    this.pdfTemplate1.contents = []
    this.pdfTemplate1.headerDetails.companyname = this.fleetData.company.company_name;
    this.pdfTemplate1.headerDetails.companynameNative = '';
    this.pdfTemplate1.headerDetails.crnNo = this.fleetData.company.crn_no;
    this.pdfTemplate1.headerDetails.panNo = this.fleetData.company.pan;
    this.pdfTemplate1.headerDetails.trnNo = this.fleetData.company.gstin;
    this.pdfTemplate1.headerDetails.companyEmailId = this.fleetData.company.email_address;
    this.pdfTemplate1.headerDetails.companyAddress = this.fleetData.company.billing_address[0]+this.fleetData.company.billing_address[1];
    this.pdfTemplate1.headerDetails.mobileNo = this.fleetData.company.primary_mobile_number;
    this.pdfTemplate1.footerDetails.companyname = this.fleetData.company.company_name;
    this.pdfTemplate1.footerDetails.companynameNative = '';
    this.pdfTemplate1.footerDetails.companyEmailId = this.fleetData.company.email_address;
    this.pdfTemplate1.footerDetails.mobileNo = this.fleetData.company.primary_mobile_number;
    this.pdfTemplate1.headerDetails.companyLogo = this.companyLogo;
    this.pdfTemplate1.headerDetails.pdfTitle = 'Vehicle Payment';
    this.pdfTemplate1.footerDetails.systemGenerated = 'This is a computer-generated Vehicle Payment receipt. No signature is required for validation.'
    this.pdfTemplate1.footerDetails.poweredBy = 'Powered By Transportsimple.com';
    this.pdfTemplate1.contents.push(
      bottomBorderTable({ body: this.getDebitDetailsandCustomerDetailsBody(), widths: ['50%', '50%'] }),
    )
    const tripsAmount = this.createExpenseData(this.fleetData)
    const otherItemRows = this.createOtherItemData(this.fleetData['others'])

    const expenseTable = {
      margin: [0, 0, 0, 0],
      width: "*",
      headerRows: 1,
      fontSize: 9,
      alignment: 'center',
      table: {
        widths: tripsAmount[1],
        body: tripsAmount[0]
      },
      layout: {
        vLineWidth: function (i, node) {
          return 0.7;
        },
        hLineWidth: function (i, node) {
          return (i === 1 || i === node.table.body.length) ? 0.7 : 0;
        },
        hLineColor: function (i, node) {
          return (i === 1 || i === node.table.body.length) ? 'black' : 'gray';
        },
        vLineColor: function (i, node) {
          return 'black';
        },
        paddingTop: function () { return 4; },
        paddingBottom: function () { return 4; },
      }
    }


    const otherItemTable = {
      margin: [0, 0, 0, 0],
      width: "*",
      headerRows: 1,
      fontSize: 9,
      alignment: 'center',
      table: {
        widths: otherItemRows[1],
        body: otherItemRows[0]
      },
      layout: {
        vLineWidth: function (i, node) {
          return 0.7;
        },
        hLineWidth: function (i, node) {
          return (i === 1 || i === node.table.body.length) ? 0.7 : 0;
        },
        hLineColor: function (i, node) {
          return (i === 1 || i === node.table.body.length) ? 'black' : 'gray';
        },
        vLineColor: function (i, node) {
          return 'black';
        },
        paddingTop: function () { return 4; },
        paddingBottom: function () { return 4; },
      }
    }
    this.pdfTemplate1.contents.push(expenseTable)
    this.fleetData['others'].length > 0 && this.pdfTemplate1.contents.push(otherItemTable)
    this.pdfTemplate1.contents.push(this.getBankAndTotalsTable())

    this.pdfTemplate1.contents.push(this.getAmountInWords())


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
              margin: [0, 0, 0, 0],
              text: [
                { text: 'Vendor : ', style: 'contentBold' },
                { text: `${this.fleetData.vendor.company_name}`, style: 'contentBold' },
              ]
            },
            {
              text: [
                { text: '', style: 'contentBold' },
              ]
            },

          ]
        },
        {
          margin: [0, 0, 0, 0],
          columns: [
            {
              stack: [
                {
                  text: [
                    { text: 'Bill No: ', style: 'contentBold' },
                    { text: `${this.fleetData.bill_number}`, style: 'content' }
                  ]
                },
                {
                  text: [
                    { text: 'Bill Date: ', style: 'contentBold' },
                    { text: `${this.fleetData.bill_date}`, style: 'content' }
                  ]
                },
                {
                  //   margin: [0, 0, 0, 3],
                  text: [
                    { text: 'Due Date: ', style: 'contentBold' },
                    { text: `${this.fleetData.due_date}`, style: 'content' }
                  ]
                },
              ]
            },
            {
              stack: [
                {
                  text: [
                    { text: 'Payment Terms: ', style: 'contentBold' },
                    { text: `${this.fleetData.payment_term}`, style: 'content' }
                  ]
                },


              ]
            },
          ],
        }

      ]

    ]
    if(this.fleetData.vendor.billing_address.length){
      invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
        {
          margin: [0, 0, 0, 0],
          text: [
            { text: `${this.fleetData.vendor.billing_address[0]}`, style: 'content' },
          ]
        }
      )
      invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
        {
          margin: [0, 0, 0, 0],
          text: [
            { text: `${this.fleetData.vendor.billing_address[1]}`, style: 'content' },
          ]
        }
      )
    }
    let placeOfSupply = [];
    placeOfSupply.push({ text: 'Place of Supply: ', style: 'contentBold' }),
    placeOfSupply.push({ text: this.fleetData.place_of_supply, style: 'contentBold' })
    this.fleetData.place_of_supply &&  invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
      {
        margin: [0, 0, 0, 0],
        text: placeOfSupply
      }
    )

    let text = [];
    if (this.pdfTemplate1.isTds) {
      if (this.fleetData.vendor.tax_details.gstin_view) {
        text.push({ text: 'TRN: ', style: 'contentBold' })
        text.push({ text: `${this.fleetData.vendor.tax_details.gstin_view}`, style: 'content' })
      }
      if (this.fleetData.vendor.tax_details.crn_view) {
        text.push({ text: ' CRN: ', style: 'contentBold' })
        text.push({ text: `${this.fleetData.vendor.tax_details.crn_view}`, style: 'content' })
      }
    } else {
      if (this.fleetData.vendor.tax_details.gstin_view) {
        text.push({ text: 'GSTIN : ', style: 'contentBold' })
        text.push({ text: `${this.fleetData.vendor.tax_details.gstin_view}`, style: 'content' })
      }
      if (this.fleetData.vendor.tax_details.pan) {
        text.push({ text: ' | PAN : ', style: 'contentBold' })
        text.push({ text: `${this.fleetData.vendor.tax_details.pan}`, style: 'content' })
      }
    }
    invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
      {
        margin: [0, 0, 0, 0],
        text: text
      }
    )

    if (isValidValue(this.fleetData.contact_person_name) || isValidValue(this.fleetData.contact_person_no.no)) {
      let customerContactPersonAndPhoneNo = ''
      if (isValidValue(this.fleetData.contact_person_name) && isValidValue(this.fleetData.contact_person_no.no)) {
        customerContactPersonAndPhoneNo = `${this.fleetData.contact_person_name} (${this.fleetData.contact_person_no.code + ' ' + this.fleetData.contact_person_no.no})`
      }
      if (isValidValue(this.fleetData.contact_person_name) && !this.fleetData.contact_person_no.no) {
        customerContactPersonAndPhoneNo = `${this.fleetData.contact_person_name}`
      }
      if (!this.fleetData.contact_person_name && isValidValue(this.fleetData.contact_person_no.no)) {
        customerContactPersonAndPhoneNo = `(${this.fleetData.contact_person_no.code + ' ' + this.fleetData.contact_person_no.no})`
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

    if (this.fleetData.reference_no) {
      invoiceDetailsandCustomerDetailsBody[0][1].columns[1].stack.push(
        {
          text: [
            { text: 'Reference No: ', style: 'contentBold' },
            { text: `${this.fleetData.reference_no}`, style: 'content' }
          ]
        },
      )
    }

    if (this.fleetData.employee) {
      invoiceDetailsandCustomerDetailsBody[0][1].columns[1].stack.push(
        {
          text: [
            { text: 'Sales Person: ', style: 'contentBold' },
            { text: `${this.fleetData.employee}`, style: 'content' }
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
              width: "auot",
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
          { text: `:  ${this.currency_symbol} ${formatNumber(this.fleetData.subtotal_before_tax)}`, style: 'contentBold' },
        ]
      },
    )
    for (const [key, value] of Object.entries(this.fleetData?.tax)) {
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
            { text: `:  ${this.currency_symbol} ${formatNumber(Number(value))}`, style: 'contentBold' },
          ]
        },
      )
    }

    bankBody[0][1].columns[1].stack.push(
      {
        text: [
          { text: 'Discount after Tax', style: 'contentBold' },
        ]
      },
    )
    bankBody[0][1].columns[2].stack.push(
      {
        text: [
          { text: `:  ${this.currency_symbol} ${formatNumber(this.fleetData.discount_after_tax_amount)}`, style: 'contentBold' },
        ]
      },
    )
    bankBody[0][1].columns[1].stack.push(
      {
        text: [
          { text: 'Total Amount', style: 'contentBold' },
        ]
      },
    )
    bankBody[0][1].columns[2].stack.push(
      {
        text: [
          { text: `:  ${this.currency_symbol} ${formatNumber(this.fleetData.total)}`, style: 'contentBold' },
        ]
      },
    )
    
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
          { text: `${this.fleetData?.total_in_word}`, style: 'contentBold' }
        ]
      }]
    ]
    return bottomBorderTable({ body, widths: ['100%'] })
  }

  generateFileName() {
    let vendorName = this.fleetData.vendor.company_name;
    let billNumber = this.fleetData['bill_number'];
    return `${vendorName}_${billNumber}`;
  }

  createExpenseData(data) {
    let sectionData = [];
    sectionData.push([
      { text: "Sales Order No", bold: true },
      { text: "Job Date", bold: true },
      { text: "Vehicle No", bold: true },
      { text: "Total Charges" + '(' + this.currency_symbol + ')', bold: true },
      { text: "Total Deductions" + '(' + this.currency_symbol + ')', bold: true },
      { text: "Tax" + '(' + this.currency_symbol + ')', bold: true },
      { text: "Total Amount" + '(' + this.currency_symbol + ')', bold: true },
    ])
    if (!this.pdfTemplate1.isTax) {
      sectionData[0].splice(5, 1)
    }
    data.jod_details.forEach(tripData => {
      const innerRow = [
        { text: tripData['work_order_no'] },
        { text: tripData['date'] },
        { text: tripData['vehicle_no'] },
        { text: formatNumber(tripData['charges']) },
        { text: formatNumber(tripData['deductions']) },
        { text: formatNumber(tripData['tax_amount']) },
        { text: formatNumber(tripData['total']) },
      ]
      if (!this.pdfTemplate1.isTax) {
        innerRow.splice(5, 1)
      }
      sectionData.push(innerRow)
    });
    const widthString = (100 / sectionData[0].length).toFixed(3);
    const itemChallanWidths = Array(sectionData[0].length).fill(widthString + "%");
    return [sectionData, itemChallanWidths]
  }

  createOtherItemData(data) {
    let otherItems = [];
    otherItems.push([
      { text: 'Additional Charge', bold: true },
      { text: 'Unit of Measurement', bold: true },
      { text: 'No. of Units', bold: true },
      { text: 'Unit Cost' + '(' + this.currency_symbol + ')', bold: true },
      { text: 'Tax Applicable', bold: true },
      { text: 'Total Amount' + '(' + this.currency_symbol + ')', bold: true }
    ])
    if (!this.pdfTemplate1.isTax) {
      otherItems[0].splice(4, 1)
    }
    data.forEach((ele, i) => {
      let rowItem = [
        checkEmpty(ele, ['expense_account__name']),
        checkEmpty(ele, ['unit']),
        checkEmpty(ele, ['quantity'], true),
        { text: formatNumber(checkEmpty(ele, ['unit_cost'], true)) },
        { text: formatNumber(checkEmpty(ele, ['tax_amount'], true) )},
        { text: formatNumber(checkEmpty(ele, ['total'], true)) }
      ];
      if (!this.pdfTemplate1.isTax) {
        rowItem.splice(4, 1)
      }
      otherItems.push(rowItem);
    });

    const widthString = (100 / otherItems[0].length).toFixed(3);
    const itemChallanWidths = Array(otherItems[0].length).fill(widthString + "%");
    return [otherItems, itemChallanWidths]
  }

  downloadPdf(data, print: boolean = false) {
    this.processPdf(data, print);
  }

  processPdf(data, print: Boolean = false) {
    let type = ".pdf"
    let fileName = 'Original_for_Recipient'
    if (print) {
      pdfMake.createPdf(generatePdfTemplate1(cloneDeep(this.pdfTemplate1))).print();
    } else {
      setTimeout(() => {
        let fileNameA = fileName + "_" + this.generateFileName() + type;
        const pdfDocGenerator = pdfMake.createPdf(generatePdfTemplate1(cloneDeep(this.pdfTemplate1)));
        pdfDocGenerator.getBlob((blob) => {
          this._fileDownload.writeAndOpenFile(blob, fileNameA).then(data => {
          });
        });
      }, 500);
    }
  }

  openDetails() {
    this.dialogRef.close(true)
  }

}



