import { TaxService } from 'src/app/core/services/tax.service';
import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, forkJoin, Subscription } from 'rxjs';
import { OperationsActivityService } from '../../../../api-services/operation-module-service/operations-activity.service';
import { normalDate } from 'src/app/shared-module/utilities/date-utilis';
import { checkEmpty, isReverseMechanism } from 'src/app/shared-module/utilities/helper-utils';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { CommonService } from 'src/app/core/services/common.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { addFonts } from 'src/app/shared-module/utilities/pdfmake-uitls';
import { bottomBorderTable, generatePdfTemplate1, pdfTemplate1 } from 'src/app/shared-module/utilities/pdftemplate-utils';
import { cloneDeep } from 'lodash';
import { formatNumber } from 'src/app/shared-module/pipes/numberformat.pipe';



@Component({
  selector: 'app-details-fuel-expense',
  templateUrl: './details-fuel-expense.component.html',
  styleUrls: ['./details-fuel-expense.component.scss']
})
export class DetailsFuelExpenseComponent implements OnInit, OnDestroy {
  fueltData: any;
  companyLogo: any = '';
  currency_symbol;
  prefixUrl: string;
  isMobile = false;
  pdfSrc = ""
  fuelPermission = Permission.fuel.toString().split(',');
  fuelSubscription: Subscription;
  isPlaceOfSupply: boolean = false;
  companyHeaderDetails: any;
  footerDetails: any;
  fuelChallan = {
    total: 0,
    amount: 0,
    quantity: 0
  }
  vehicleDetails = {
    total: 0,
    amount: 0,
    quantity: 0
  }
  itemOthers = {
    total: 0,
    amount: 0,
    quantity: 0
  };
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
  @Output() openDetailsEmitter = new EventEmitter<boolean>();
  @Input() 'fuelId': BehaviorSubject<String>;
  @Input() routeToDetail: boolean = false;

  constructor(private _operationsActivityService: OperationsActivityService,
    private ngxService: NgxUiLoaderService,
    private _commonService: CommonService, private currency: CurrencyService, private _tax: TaxService,
    private _prefixUrl: PrefixUrlService, private _fileDownload: FileDownLoadAandOpen,
  ) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    this.pdfTemplate1.isTax = this._tax.getTax();
    this.pdfTemplate1.isTds = this._tax.getVat();
    this.isPlaceOfSupply = this._tax.isPlaceOfSupply();
    addFonts(pdfMake)

  }
  ngOnDestroy(): void {
    this.fuelSubscription.unsubscribe()
  }
  openDetails(): void {
    this.routeToDetail = !this.routeToDetail;
    this.openDetailsEmitter.next(this.routeToDetail)
  }

  ngOnInit() {
    this.prefixUrl = this._prefixUrl.getprefixUrl();
    this.currency_symbol = this.currency.getCurrency()?.symbol;
    this.fuelExpenseDetails();
  }

  fuelExpenseDetails() {
    this.fuelSubscription = this.fuelId.subscribe((id) => {
      let logo = this._commonService.fetchCompanyLogo();
      let fuelData = this._operationsActivityService.getFuelExpensePrintScreenData(id);
      forkJoin([logo, fuelData]).subscribe((response: any) => {
        this.companyLogo = response[0].result.image_blob;
        this.fueltData = response[1].result;
        this.buildPdf();
      })
    })
  }

  dateChange(date) {
    return normalDate(date);
  }


  transactionStatus(status: boolean) {
    return isReverseMechanism(status);
  }

  downloadPdf(data, print: boolean = false) {
    this.processPdf();
  }

  processPdf() {
    this.ngxService.start();
    let type = ".pdf"
    let fileName = 'FUEL DETAILS'
    setTimeout(() => {
      let fileNameA = fileName + "_" + this.generateFileName() + type;
      const pdfDocGenerator = pdfMake.createPdf(generatePdfTemplate1(cloneDeep(this.pdfTemplate1)));
      pdfDocGenerator.getBlob((blob) => {
        this._fileDownload.writeAndOpenFile(blob, fileNameA).then(data => {
        });
      });
    }, 500);
  }

  generateFileName() {
    let vendorName = this.fueltData['vendor']['company_name'];
    let billNumber = this.fueltData['bill_number'];
    return `${vendorName}_${billNumber}`;
  }

  generateDataTables(data) {
    let vehicleItems = [];
    let vehicleWidths = [];
    this.vehicleDetails = {
      total: 0,
      amount: 0,
      quantity: 0
    }

    data.vehicle_details.forEach((ele, i) => {
      this.vehicleDetails.quantity = Number(this.vehicleDetails.quantity) + Number(ele.quantity)
      this.vehicleDetails.total = Number(this.vehicleDetails.total) + Number(ele.total)
      this.vehicleDetails.amount = Number(this.vehicleDetails.amount) + Number(ele.total_before_tax)
    });

    vehicleWidths = ["16.66%", "16.66%", "16.66%", "16.66%", "16.66%", "16.66%"];
    // let vehicleDetails;
    // if (data.vehicle_details.length > 0) {
    //   vehicleDetails = [
    //     [{
    //       border: [0, 0, 0, 0],
    //       alignment: 'center',
    //       text: [
    //         { text: 'Vehicle Details ', style: 'contentBold', },
    //       ]


    //     }]
    //   ]
    // }
    vehicleItems.push([
      {
        style: 'table_title',
        text:
          [
            { text: 'Vehicle Details', fontSize: 10, bold: true },
          ],
        colSpan: 6
      }, {}, {}, {}, {}, {},
    ]);
    
    vehicleItems.push(
      [
        { text: 'VEHICLE NO', bold: true }, { text: 'FUEL QUANTITY', bold: true }, { text: 'FUEL COST' + '(' + this.currency_symbol + ')', bold: true },
        { text: 'FINAL BALANCE' + '(' + this.currency_symbol + ')', bold: true }, { text: 'DATE', bold: true }, { text: 'DOCUMENT NO.', bold: true },
      ]
    );
    if (this.pdfTemplate1.isTds) {
      vehicleWidths = ["12.5%", "12.5%", "12.5%", "12.5%", "12.5%", "12.5%", "12.5%", "12.5%"];
      vehicleItems[0] = [
        {
          style: 'table_title',
          text:
            [
              { text: 'Vehicle Details', fontSize: 10, bold: true },
            ],
          colSpan: 8
        }, {}, {}, {}, {}, {}, {}, {}
      ]
      vehicleItems[1] = [
        { text: 'VEHICLE NO', bold: true }, { text: 'FUEL QUANTITY', bold: true }, { text: 'FUEL COST' + '(' + this.currency_symbol + ')', bold: true },
        { text: 'AMOUNT' + '(' + this.currency_symbol + ')', bold: true },
        { text: 'VAT', bold: true },
        { text: 'FINAL BALANCE' + '(' + this.currency_symbol + ')', bold: true }, { text: 'DATE', bold: true }, { text: 'DOCUMENT NO.', bold: true },
      ]
    }
    data.vehicle_details.forEach((ele, i) => {
      ele.quantity=formatNumber(ele.quantity);
      ele.unit_cost=formatNumber(ele.unit_cost);
      ele.total_before_tax=formatNumber(ele.total_before_tax);
      ele.total=formatNumber(ele.total);

      
      if (this.pdfTemplate1.isTds) {
        vehicleItems.push([
          checkEmpty(ele, ['vehicle', 'reg_number']), checkEmpty(ele, ['quantity'], true), checkEmpty(ele, ['unit_cost'], true),
          { text: checkEmpty(ele, ['total_before_tax'], true) },
          checkEmpty(ele, ['tax', 'label']),
          { text: checkEmpty(ele, ['total'], true) }, this.dateChange(ele.date), checkEmpty(ele, ['document_no']),
        ]);
      } else {
        vehicleItems.push([
          checkEmpty(ele, ['vehicle', 'reg_number']), checkEmpty(ele, ['quantity'], true), checkEmpty(ele, ['unit_cost'], true),
          { text: checkEmpty(ele, ['total'], true) }, this.dateChange(ele.date), checkEmpty(ele, ['document_no']),
        ]);
      }

    });

    if (this.vehicleDetails.total > 0) {
      if (this.pdfTemplate1.isTds) {
        vehicleItems.push([
          { text: 'Total', bold: true },
          { text: formatNumber(this.vehicleDetails.quantity)  },
          { text: '' },
          { text: formatNumber(this.vehicleDetails.amount) },
          { text: '' },
          { text: formatNumber(this.vehicleDetails.total) },
          { text: '' },
          { text: '' },
        ]);
      } else {
        vehicleItems.push([
          { text: 'Total', bold: true },
          { text: formatNumber(this.vehicleDetails.quantity )},
          { text: '' },
          { text: formatNumber(this.vehicleDetails.total )},
          { text: '' },
          { text: '' },
        ]);
      }

    }

    let vehicleFuelDetails: any;
    if (data.vehicle_details.length > 0) {
      vehicleFuelDetails = {
        // margin: [0, 10, 0, 10],
        alignment: 'center',
        fontSize: 9,
        table: {
          widths: vehicleWidths,
          headerRows: 2,
          keepWithHeaderRows: 0,
          body: vehicleItems
        },
        layout: {
          hLineWidth: function (i, node) {
            return (i == 0 || i === 1 ||i === 2 || i === node.table.body.length || i === node.table.body.length - 1) ? 0.7 : 0;
          },
          vLineWidth: () => 0.7,
          hLineColor: () => 'black',
          vLineColor: () => 'black',
        }
      };
      data.vehicle_details.length && this.pdfTemplate1.contents.push(vehicleFuelDetails)
    }
    let otherItems = [];
    let itemOtherWidths = [];
    this.itemOthers = {
      total: 0,
      amount: 0,
      quantity: 0
    }
    data.other_expenses.forEach((ele, i) => {
      this.itemOthers.quantity = Number(this.itemOthers.quantity) + Number(ele.quantity)
      this.itemOthers.total = Number(this.itemOthers.total) + Number(ele.total)
      this.itemOthers.amount = Number(this.itemOthers.amount) + Number(ele.total_before_tax)
    });
    itemOtherWidths = ["20%", "20%", "20%", "20%", "20%"];
    otherItems.push(
      [
        {
          style: 'table_title',
          text:
            [
              { text: 'Item Others', fontSize: 10, bold: true },
            ],
          colSpan: 5
        }, {}, {}, {}, {}
      ]
    )
    otherItems.push(
      [
        { text: 'ITEM', bold: true },
        { text: 'EXPENSE ACCOUNT', bold: true },
        { text: 'QUANTITY', bold: true },
        { text: 'UNIT COST' + '(' + this.currency_symbol + ')', bold: true },
        { text: 'FINAL BALANCE' + '(' + this.currency_symbol + ')', bold: true }
      ]
    );
    data.other_expenses.forEach((ele, i) => {
      ele.quantity=formatNumber(ele.quantity);
      ele.unit_cost=formatNumber(ele.unit_cost);
      ele.total=formatNumber(ele.total);
      ele.total_before_tax=formatNumber(ele.total_before_tax);

      otherItems.push([
        checkEmpty(ele, ['item']),
        checkEmpty(ele, ['expense_account']),
        checkEmpty(ele, ['quantity'], true),
        checkEmpty(ele, ['unit_cost'], true),
        { text: checkEmpty(ele, ['total'], true) }
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
      let GSTTYPE = 'IGST';
      if (this.pdfTemplate1.isTds) {
        GSTTYPE = 'VAT'
      }
      otherItems[1].splice(itemOtherFieldLength - 3, 0, { text: GSTTYPE + '(' + this.currency_symbol + ')', bold: true })
      otherItems[1].splice(itemOtherFieldLength - 3, 0, { text: 'AMOUNT' + '(' + this.currency_symbol + ')', bold: true })

      data.other_expenses.forEach((ele, j) => {

        otherItems[2 + j].splice(itemOtherFieldLength - 3, 0,
          {
            text:
              [
                { text: checkEmpty(ele, ['tax_description', 'IGST'], true) + '%' },
                '\n',
                { text: '' + checkEmpty(ele, ['tax_description', 'IGST_amount'], true) }
              ]
          })

        otherItems[2 + j].splice(itemOtherFieldLength - 3, 0,
          { text: '' + checkEmpty(ele, ['total_before_tax'], true) })


      });

    } else {
      itemOtherFieldLength += 3;
      otherItems[0][0].colSpan += 3;
      otherItems[0].push({});
      otherItems[0].push({});
      otherItems[0].push({});

      const widthString = (100 / itemOtherFieldLength).toFixed(3);
      itemOtherWidths = Array(itemOtherFieldLength).fill(widthString + "%");

      otherItems[1].splice(itemOtherFieldLength - 4, 0, { text: 'CGST', bold: true })
      otherItems[1].splice(itemOtherFieldLength - 4, 0, { text: 'SGST', bold: true })
      otherItems[1].splice(itemOtherFieldLength - 4, 0, { text: 'AMOUNT' + '(' + this.currency_symbol + ')', bold: true })

      data.other_expenses.forEach((ele, j) => {

        otherItems[2 + j].splice(itemOtherFieldLength - 4, 0,
          {
            text:
              [
                { text: checkEmpty(ele, ['tax_description', 'CGST'], true) + '%' },
                '\n',
                { text: '' + checkEmpty(ele, ['tax_description', 'CGST_amount'], true) }
              ]
          })

        otherItems[2 + j].splice(itemOtherFieldLength - 4, 0,
          {
            text:
              [
                { text: checkEmpty(ele, ['tax_description', 'SGST'], true) + '%' },
                '\n',
                { text: '' + checkEmpty(ele, ['tax_description', 'SGST_amount'], true) }
              ]
          })

        otherItems[2 + j].splice(itemOtherFieldLength - 4, 0,
          { text: '' + checkEmpty(ele, ['total_before_tax'], true) })

      });

    }

    if (this.itemOthers.quantity > 0) {
      if (data.is_interstate) {
        otherItems.push([
          { text: 'Total', bold: true },
          { text: '', bold: true },
          { text: formatNumber(this.itemOthers.quantity) },
          { text: '' },
          { text: formatNumber(this.itemOthers.amount) },
          { text: '' },
          { text: formatNumber(this.itemOthers.total) },
        ]);
      } else {
        otherItems.push([
          { text: '' },
          { text: 'Total', bold: true },
          { text: formatNumber(this.itemOthers.quantity) },
          { text: '' },
          { text: formatNumber(this.itemOthers.amount) },
          { text: '' },
          { text: '' },
          { text: formatNumber(this.itemOthers.total) },
        ]);
      }
    }

    let others: any;
    if (data.other_expenses.length > 0) {
      others = {
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
            return (i < 3 || i === node.table.body.length || i === node.table.body.length - 1) ? 0.7 : 0;
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
    this.pdfTemplate1.headerDetails.companyname = this.fueltData.company.company_display_name;
    this.pdfTemplate1.headerDetails.companynameNative = '';
    this.pdfTemplate1.headerDetails.crnNo = this.fueltData.company.crn_no;
    this.pdfTemplate1.headerDetails.panNo = this.fueltData.company.pan;
    this.pdfTemplate1.headerDetails.trnNo = this.fueltData.company.gstin;
    this.pdfTemplate1.headerDetails.companyEmailId = this.fueltData.company.email_address;
    this.pdfTemplate1.headerDetails.companyAddress = this.fueltData.company.billing_address[0] + '' + this.fueltData.company.billing_address[1];
    this.pdfTemplate1.headerDetails.mobileNo = this.fueltData.company.primary_mobile_number;
    this.pdfTemplate1.footerDetails.companyname = this.fueltData.company.company_display_name;
    this.pdfTemplate1.footerDetails.companynameNative = '';
    this.pdfTemplate1.footerDetails.companyEmailId = this.fueltData.company.email_address;
    this.pdfTemplate1.footerDetails.mobileNo = this.fueltData.company.primary_mobile_number;
    this.pdfTemplate1.headerDetails.companyLogo = this.companyLogo;
    this.pdfTemplate1.headerDetails.pdfTitle = 'Fueling Details';
    this.pdfTemplate1.footerDetails.systemGenerated = 'This is a computer-generated Fuel Expense receipt. No signature is required for validation.'
    this.pdfTemplate1.footerDetails.poweredBy = 'Powered By Transportsimple.com';
    this.pdfTemplate1.contents.push(
      bottomBorderTable({ body: this.getCreditDetailsandCustomerDetailsBody(), widths: ['40%', '60%'] }),
    )
    this.generateDataTables(this.fueltData)
    this.pdfTemplate1.contents.push(this.getBankAndTotalsTable());
    this.pdfTemplate1.contents.push(this.getAmountInWords())
    const pdfDocGenerator = pdfMake.createPdf(generatePdfTemplate1(cloneDeep(this.pdfTemplate1)));
    pdfDocGenerator.getDataUrl((dataUrl) => {
      this.pdfSrc = dataUrl
    });
  }

  getCreditDetailsandCustomerDetailsBody() {
    let invoiceDetailsandCustomerDetailsBody = [
      [
        {
          stack: [
            {
              margin: [0, 0, 0, 0],
              text: [
                { text: 'Vendor: ', style: 'contentBold' },
                { text: `${this.fueltData.vendor.display_name}`, style: 'content' }
              ]
            },
            {
              text: [

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
                    { text: `${this.fueltData.bill_number}`, style: 'content' }
                  ]
                },
                {
                  margin: [0, 0, 0, 0],
                  text: [
                    { text: 'Bill Date: ', style: 'contentBold' },
                    { text: `${this.dateChange(this.fueltData.bill_date)}`, style: 'content' }
                  ]
                },
                {
                  text: [
                    { text: 'Due Date: ', style: 'contentBold' },
                    { text: `${this.dateChange(this.fueltData.due_date)}`, style: 'content' }
                  ]
                },
              ]
            },
            {
              stack: [
                {
                  text: [
                    { text: 'Payment Status: ', style: 'contentBold' },
                    { text: `${this.fueltData.payment_status}`, style: 'content' },
                  ]

                },
                {
                  margin: [0, 0, 0, 0],
                  text: [
                    { text: 'Banking Charges: ', style: 'contentBold' },
                    { text: `${this.currency_symbol} ${formatNumber(this.fueltData.bank_charges)}`, style: 'content' }
                  ]
                },
              ]
            },
          ],
        }

      ]

    ];
    let placeOfSupply = [];
    placeOfSupply.push({ text: 'Place of Supply: ', style: 'contentBold' }),
      placeOfSupply.push({ text: this.fueltData.place_of_supply, style: 'content' })
    this.fueltData.place_of_supply && invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
      {
        margin: [0, 0, 0, 0],
        text: placeOfSupply
      }
    )
    let paymentMode = [];
    paymentMode.push({ text: 'Payment Mode: ', style: 'contentBold' }),
      paymentMode.push({ text: this.fueltData.payment_mode, style: 'contentBold' })
    this.fueltData.payment_mode && invoiceDetailsandCustomerDetailsBody[0][1].columns[0].stack.push(
      {
        margin: [0, 0, 0, 0],
        text: paymentMode
      }
    )
    let transactionDate = [];
    transactionDate.push(
      { text: 'Transaction Date: ', style: 'contentBold' },
      { text: `${this.dateChange(this.fueltData.transaction_date)}`, style: 'content' }
    )
    this.fueltData.transaction_date && invoiceDetailsandCustomerDetailsBody[0][1].columns[0].stack.push(
      {
        margin: [0, 0, 0, 0],
        text: transactionDate
      }
    )
    let text = [];
    if (this.pdfTemplate1.isTds) {
      if (this.fueltData.vendor.tax_details.gstin_view) {
        text.push({ text: 'TRN: ', style: 'contentBold' })
        text.push({ text: `${this.fueltData.vendor.tax_details.gstin_view}`, style: 'content' })
      }
      if (this.fueltData.vendor.tax_details.crn_view) {
        text.push({ text: ' CRN: ', style: 'contentBold' })
        text.push({ text: `${this.fueltData.vendor.tax_details.crn_view}`, style: 'content' })
      }
    } else {
      if (this.fueltData.vendor.tax_details.gstin_view) {
        text.push({ text: 'GSTIN : ', style: 'contentBold' })
        text.push({ text: `${this.fueltData.vendor.tax_details.gstin_view}`, style: 'content' })
      }
      if (this.fueltData.vendor.tax_details.pan) {
        text.push({ text: ' | PAN : ', style: 'contentBold' })
        text.push({ text: `${this.fueltData.vendor.tax_details.pan}`, style: 'content' })
      }
    }
    invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
      {
        margin: [0, 0, 0, 0],
        text: text
      }
    )

    if (this.fueltData.vendor.billing_address[0] || this.fueltData.vendor.billing_address[1]) {
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
            { text: `${this.fueltData.vendor.billing_address[0] + '' + this.fueltData.vendor.billing_address[1]}`, style: 'content' },
          ]
        }
      )
    }

    if (this.fueltData.payment_term) {
      invoiceDetailsandCustomerDetailsBody[0][1].columns[0].stack.push(
        {
          text: [
            { text: 'Payment Term: ', style: 'contentBold' },
            { text: `${this.fueltData.payment_term}`, style: 'content' }
          ]
        },
      )
    }
    if (this.fueltData.employee) {
      invoiceDetailsandCustomerDetailsBody[0][1].columns[0].stack.push(
        {
          text: [
            { text: 'Employee In Charge: ', style: 'contentBold' },
            { text: `${this.fueltData.employee}`, style: 'content' }
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
              width: 'auto',
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
          { text: 'Subtotal Fuel Purchase', style: 'contentBold' },
        ]
      },
    )
    bankBody[0][1].columns[2].stack.push(
      {
        text: [
          { text: `:  ${this.currency_symbol} ${formatNumber(Number(this.fueltData.subtotal_bt_expense) + Number(this.fueltData.subtotal_bt_vehicle))}`, style: 'contentBold' },
        ]
      },
    );
    bankBody[0][1].columns[1].stack.push(
      {
        text: [
          { text: 'Subtotal Others', style: 'contentBold' },
        ]
      },
    )
    bankBody[0][1].columns[2].stack.push(
      {
        text: [
          { text: `:  ${this.currency_symbol} ${formatNumber(Number(this.fueltData.other_expense_before_tax))}`, style: 'contentBold' },
        ]
      },
    )
    bankBody[0][1].columns[1].stack.push(
      {
        text: [
          { text: 'Total Fuel Quantity', style: 'contentBold' },
        ]
      },
    )
    bankBody[0][1].columns[2].stack.push(
      {
        text: [
          { text: `:   ${formatNumber(Number(this.fuelChallan.quantity) + Number(this.vehicleDetails.quantity))}`, style: 'contentBold' },
        ]
      },
    )
    bankBody[0][1].columns[1].stack.push(
      {
        text: [
          { text: 'Total Item Quantity', style: 'contentBold' },
        ]
      },
    )
    bankBody[0][1].columns[2].stack.push(
      {
        text: [
          { text: `:   ${formatNumber(Number(this.itemOthers.quantity))}`, style: 'contentBold' },
        ]
      },
    )
    for (const [key, value] of Object.entries(this.fueltData?.tax)) {
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
          { text: 'Discount After Tax ', style: 'content' },
        ]
      },
    )
    bankBody[0][1].columns[2].stack.push(
      {
        text: [
          { text: `:  ${this.currency_symbol} ${formatNumber(this.fueltData.discount_after_tax_amount)}`, style: 'contentBold' },
        ]
      },
    )
    bankBody[0][1].columns[1].stack.push(
      {
        text: [
          { text: `${this.fueltData.adjustment_account}`, style: 'content' },
        ]
      },
    )
    bankBody[0][1].columns[2].stack.push(
      {
        text: [
          { text: `:  ${this.currency_symbol} ${formatNumber(this.fueltData.adjustment_amount)}`, style: 'contentBold' },
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
          { text: `:  ${this.currency_symbol} ${formatNumber(this.fueltData.total)}`, style: 'contentBold' },
        ]
      },
    )
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
            { text: `:  ${this.currency_symbol} ${formatNumber(this.fueltData.tds_amount)}`, style: 'contentBold' },
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
          { text: `${this.fueltData?.amount_in_word}`, style: 'contentBold' }
        ]


      }]
    ]
    return bottomBorderTable({ body, widths: ['100%'] })
  }

}


