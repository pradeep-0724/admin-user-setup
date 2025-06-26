import { BehaviorSubject, forkJoin, Subscription } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { normalDate } from 'src/app/shared-module/utilities/date-utilis';
import { checkEmpty, checkEmptyDataKey } from 'src/app/shared-module/utilities/helper-utils';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { CurrencyService } from 'src/app/core/services/currency.service';
import * as _ from 'lodash';
import { TaxService } from 'src/app/core/services/tax.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { OperationsActivityService } from '../../../../api-services/operation-module-service/operations-activity.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { addFonts } from 'src/app/shared-module/utilities/pdfmake-uitls';
import { bottomBorderTable, generatePdfTemplate1, pdfTemplate1 } from 'src/app/shared-module/utilities/pdftemplate-utils';
import { cloneDeep } from 'lodash';
import { formatNumber } from 'src/app/shared-module/pipes/numberformat.pipe';


@Component({
  selector: 'app-details-trip-expense',
  templateUrl: './details-trip-expense.component.html',
  styleUrls: ['./details-trip-expense.component.scss']
})
export class DetailsTripExpenseComponent implements OnInit,OnDestroy {
  @ViewChild('content') content: ElementRef;
  @Input() defaultDownload: boolean = false;
  otherDetailExists: boolean = false;
  tripDataExists: boolean = false;
  preFixUrl = ''
  pdfSrc = ""
  expenseData: any;
  isMobile = false;
  tripExpensePermission = Permission.tripexpense.toString().split(',');
  tripExpSubscription: Subscription;
  isPlaceOfSupply: boolean = false;
  @Input() routeToDetail: boolean = false;
  @Output() openDetailsEmitter =new EventEmitter<boolean>();
  @Input() 'expenseId':BehaviorSubject<String>;
  // ///////////////////////////////////////////////////////////////
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
     private _commonService: CommonService,
     private currency:CurrencyService,
     private _tax :TaxService,
     private _preFixUrl:PrefixUrlService,
     private deviceService: DeviceDetectorService,
     private _fileDownload:FileDownLoadAandOpen,
    )  {
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
      this.isMobile = this.deviceService.isMobile();
      this.pdfTemplate1.isTax = this._tax.getTax();
      this.pdfTemplate1.isTds = this._tax.getVat();
      this.isPlaceOfSupply = this._tax.isPlaceOfSupply();
      addFonts(pdfMake)

    }
  ngOnDestroy(): void {
    this.tripExpSubscription.unsubscribe()
  }

  ngOnInit() {
    this.currency_symbol = this.currency.getCurrency()?.symbol;
    this.preFixUrl = this._preFixUrl.getprefixUrl();
    this.expenseDetails();
  }

  openDetails(): void {
    this.routeToDetail=!this.routeToDetail;
    this.openDetailsEmitter.next(this.routeToDetail)
   }
  initializeExistence(){
    this.otherDetailExists = false;
    this.tripDataExists = false;

    if (this.expenseData.other_expenses.length > 0){
      this.otherDetailExists = true;
    }

    if (this.expenseData.expenses.length > 0) {
      this.tripDataExists = true;
    }
  }

  evaluateEmptyTP(data) {
    let flag: boolean = false;
    for (let index in data) {
      flag = checkEmptyDataKey(data[index].challans, "transporter_permit_no")
      if(!flag) {
        return false
      }
      }
      return true
  }

  evaluateEmptyNewTP(data) {
    let flag: boolean = false;
    for (let index in data) {
      flag = data[index].work_order_no
      if(flag) {
        return false
      }
      }
      return true
  }


  dateChange(date) {
    return normalDate(date);
  }

  // downloadPdf(data, print: boolean = false){
  //   this.processPdf(data, print);
  // }

  parseAddress(address) {
    let resp = {};
    if (address) {
      address.filter(data => {
        if (data.address_type_index === 0) {
          resp['billingAddress'] = data;
        } else {
          resp['shippingAddress'] = data;
        }
      });
    }
    return resp;
  }


  generateFileName() {
    let vendorName = this.expenseData.vendor.company_name;
    let billNumber = this.expenseData['bill_number'];
    return `${vendorName}_${billNumber}`;
  }

  

  pdfPageCreation(contents){
    let pdfContent = []
    const outerContentLength = contents.length;
    if (contents.length == 1) {
      pdfContent = contents
    } else {
      contents.forEach((element, index) => {
        if (index+1 != outerContentLength){
          element[element.length - 1]['pageBreak'] = "after"
        }
        element.forEach(innerElement => {
          pdfContent.push(innerElement)
        });
      });
    }
    return {
      content: pdfContent,
      styles: {},
      pageMargins: [ 5, 10, 5, 10],
      pageOrientation: 'potrait',
      pageSize: 'A4'

    }
  }

  createExpenseData(data){
    let sectionData = [];
    let GSTTYPE='IGST';
    if(this.pdfTemplate1.isTds){
      GSTTYPE='VAT'
    }
    sectionData.push([
                 {text: "Date", bold: true, border: [true,true,false,true]},
                 {text: "Vehicle No.", bold: true, border: [false,true,false,true]},
                 {text: "Expense Type", bold: true, border: [false,true,false,true]},
                 {text: "Amount" + '(' + this.currency_symbol + ')', bold: true, border: [false,true,false,true]},
                 {text: "Adjustments" + '('+ this.currency_symbol+')', bold: true, border: [false,true,false,true]},
                 {text: "Net Amount" + '(' + this.currency_symbol + ')', bold: true, border: [false,true,true,true]}])

    if (this.pdfTemplate1.isTax){
      if(this.expenseData.is_interstate){
        sectionData[0].splice(5, 0, { text: GSTTYPE + '('+ this.currency_symbol+')', bold: true, border: [false,true,false,true] })
      } else {
      sectionData[0].splice(5, 0, { text: 'CGST' + '('+ this.currency_symbol+')', bold: true, border: [false,true,false,true] })
      sectionData[0].splice(5, 0, { text: 'SGST' + '('+ this.currency_symbol+')', bold: true, border: [false,true,false,true] })}
    }
    for(let i=0; i<data.length; i++){
        let tripData = data[i].tripcharge
        const innerRow = [
          {text: this.dateChange(tripData.date), border: [true,true,false,true]},
          {text: tripData['vehicle'], border: [false,true,false,true]},
          {text: tripData['expense_type'], border: [false,true,false,true]},
          {text: formatNumber(data[i]['amount']), border: [false,true,false,true]},
          {text: formatNumber(data[i]['adjustment']), border: [false,true,false,true]},
          {text: formatNumber(data[i]['total']), border: [false,true,true,true]}]
        sectionData.push(innerRow)

        if (this.pdfTemplate1.isTax){
          if(this.expenseData.is_interstate){
              const igst = {
                text:
                  [
                  { text:formatNumber(checkEmpty(data[i], ['tax_description', 'IGST_amount'], true)) +' ( '+checkEmpty(data[i], ['tax_description', 'IGST'], true) + ' %)'}],
                  border: [false,true,false,true]}
              innerRow.splice(5, 0, igst)

          } else {
            const cgst = {text:
              [
               { text: formatNumber(checkEmpty(data[i], ['tax_description', 'CGST_amount'], true))  +' ( '+checkEmpty(data[i], ['tax_description', 'CGST'], true) + ' %)'}],
               border: [false,true,false,true]}
            innerRow.splice(5, 0, cgst)

            const sgst = {text:
              [
                { text:formatNumber(checkEmpty(data[i], ['tax_description', 'SGST_amount'], true))  +' ( '+checkEmpty(data[i], ['tax_description', 'SGST'], true) + ' %)' }],
                border: [false,true,false,true]}
            innerRow.splice(5, 0, sgst)
          }
        }
    }

    const widthString = (100/sectionData[0].length).toFixed(3);
    const itemChallanWidths = Array(sectionData[0].length).fill(widthString + "%");
    return [sectionData, itemChallanWidths]
  }

  createOtherItemData(data){
    let otherItems = [];

    otherItems.push([{ text: 'Expense Account', bold: true }, { text: 'Item', bold: true },
    { text: 'Qty', bold: true },
    { text: 'Unit Cost' + '(' + this.currency_symbol + ')', bold: true },
    { text: 'Amount' + '(' + this.currency_symbol + ')', bold: true },
    { text: 'Total' + '(' + this.currency_symbol + ')', bold: true }])

    data.forEach((ele, i) => {
      otherItems.push([checkEmpty(ele, ['expense_account']),
        checkEmpty(ele, ['item']), checkEmpty(ele, ['quantity'], true),
        { text: formatNumber(checkEmpty(ele, ['unit_cost'], true) )},
        { text: formatNumber(checkEmpty(ele, ['total_before_tax'], true)) },
        { text: formatNumber(checkEmpty(ele, ['total'], true)) }
      ]);
    });

    if (this.pdfTemplate1.isTax){
      let GSTTYPE='IGST';
      if(this.pdfTemplate1.isTds){
        GSTTYPE='VAT'
      }
      if(this.expenseData.is_interstate){
        otherItems[0].splice(5, 0, { text: GSTTYPE + '(' + this.currency_symbol + ')', bold: true })
        data.forEach((ele, j) => {
          otherItems[1+j].splice(5, 0,
              {
                text:
                  [
                  { text:formatNumber(checkEmpty(ele, ['tax_description', 'IGST_amount'], true)) +' ( '+checkEmpty(ele, ['tax_description', 'IGST'], true) + ' %)' }]})
        });
      } else {
        otherItems[0].splice(5, 0, { text: 'CGST'+ '(' + this.currency_symbol + ')', bold: true })
        otherItems[0].splice(5, 0, { text: 'SGST'+ '(' + this.currency_symbol + ')', bold: true })
        data.forEach((ele, j) => {
          otherItems[1+j].splice(5, 0,
              {text:
                  [
                   { text:formatNumber(checkEmpty(ele, ['tax_description', 'CGST_amount'], true) )+' ( '+checkEmpty(ele, ['tax_description', 'CGST'], true) + ' %)'}]})
          otherItems[1+j].splice(5, 0,
              {text:
                  [
                   { text:formatNumber(checkEmpty(ele, ['tax_description', 'SGST_amount'], true)) +' ( '+checkEmpty(ele, ['tax_description', 'SGST'], true) + ' %)'}]})
        });
      }
    }

    const widthString = (100/otherItems[0].length).toFixed(3);
    const itemChallanWidths = Array(otherItems[0].length).fill(widthString + "%");
    return [otherItems, itemChallanWidths]
  }

  addCalculations(data){
    const arr = []

    if (data['expense_before_tax'] > 0){
      arr.push(["Subtotal Challan:",
      `${this.currency_symbol} ${formatNumber(data['expense_before_tax'])}`, false])
    }

    if (data['other_expense_before_tax'] > 0){
      arr.push(["Subtotal Others:",
      `${this.currency_symbol} ${formatNumber(data['other_expense_before_tax'])}`, false])
    }

    arr.push(["Sub Total:", `${this.currency_symbol} ${formatNumber(data['subtotal_before_tax'])}`, true])

    if (data['discount_amount'] > 0){
        arr.push(["Discount:",
        `${this.currency_symbol} ${formatNumber(data['discount_amount'])}`, false])
    }

    if(this.pdfTemplate1.isTax) {
      arr.push(["Tax Amount: ", `${this.currency_symbol} ${formatNumber(data.total_tax)}`, true])
      arr.push(["Discount After Tax: ", `${this.currency_symbol} ${formatNumber(data.discount_after_tax_amount)}`, false])
    }

    if (data['adjustment_account'] && data['adjustment_amount'] > 0){
      arr.push([`${data['adjustment_account']}:`,
      `${this.currency_symbol} ${formatNumber(data['adjustment_amount'])}`, false])
    }

    arr.push(["Bill Amount:", `${this.currency_symbol} ${formatNumber(data['total'])}`, true])

    if(this.pdfTemplate1.isTax){
      if(!this.pdfTemplate1.isTds)
      arr.push(["TDS: ", `${this.currency_symbol} ${formatNumber(data.tds_amount)}`, false])
    }

    arr.push(["Total Amount:", `${this.currency_symbol} ${formatNumber(data['balance'])}`, true])
    arr.push(["Amount in Words:", data['amount_in_word'], true])
    return arr
  }

  addCal(cals){
    let tempArr = []
    for(let i=0; i<cals.length; i++){
        tempArr.push([{text: cals[i][0], alignment: "right", bold: cals[i][2]},
                    {text: cals[i][1], alignment: "right", bold: cals[i][2]}])

        }
    return tempArr
  }
  
  expenseDetails(){
    this.tripExpSubscription=this.expenseId.subscribe((id)=>{
      let logo=this._commonService.fetchCompanyLogo();
      let jobData=this._operationsActivityService.getTripExpensePrintScreenData(id);
      forkJoin([logo,jobData]).subscribe((data:any)=>{
        this.companyLogo = data[0].result.image_blob;
        this.expenseData = data[1].result;
        this.buildPdf();
      })
    });
  }

  buildPdf() {
    this.pdfTemplate1.contents = []
    this.pdfTemplate1.headerDetails.companyname = this.expenseData.company.company_name;
    this.pdfTemplate1.headerDetails.companynameNative = '';
    this.pdfTemplate1.headerDetails.crnNo = this.expenseData.company.crn_no;
    this.pdfTemplate1.headerDetails.panNo = this.expenseData.company.pan;
    this.pdfTemplate1.headerDetails.trnNo = this.expenseData.company.gstin;
    this.pdfTemplate1.headerDetails.companyEmailId = this.expenseData.company.email_address;
    this.pdfTemplate1.headerDetails.companyAddress = this.expenseData.company.billing_address[0]+''+this.expenseData.company.billing_address[1];
    this.pdfTemplate1.headerDetails.mobileNo = this.expenseData.company.primary_mobile_number;
    this.pdfTemplate1.footerDetails.companyname = this.expenseData.company.company_name;
    this.pdfTemplate1.footerDetails.companynameNative = '';
    this.pdfTemplate1.footerDetails.companyEmailId = this.expenseData.company.email_address;
    this.pdfTemplate1.footerDetails.mobileNo = this.expenseData.company.primary_mobile_number;
    this.pdfTemplate1.headerDetails.companyLogo = this.companyLogo;
    this.pdfTemplate1.headerDetails.pdfTitle = 'Job Expense Details';
    this.pdfTemplate1.footerDetails.systemGenerated = 'This is a computer-generated Job Expense receipt. No signature is required for validation.'
    this.pdfTemplate1.footerDetails.poweredBy = 'Powered By Transportsimple.com';
    this.pdfTemplate1.contents.push(
      bottomBorderTable({ body: this.getDebitDetailsandCustomerDetailsBody(), widths: ['50%', '50%'] }),
    )
    const tripsAmount = this.createExpenseData(this.expenseData['expenses'])
    const otherItemRows = this.createOtherItemData(this.expenseData['other_expenses'])

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
    this.expenseData['expenses'].length >0 && this.pdfTemplate1.contents.push(expenseTable)
    this.expenseData['other_expenses'].length > 0 && this.pdfTemplate1.contents.push(otherItemTable)
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
                { text: `${this.expenseData.vendor.company_name}`, style: 'contentBold' },
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
          margin: [0, 0, 0, 0],
          columns: [
            {
              stack: [
                {
                  text: [
                    { text: 'Bill No: ', style: 'contentBold' },
                    { text: `${this.expenseData.bill_number}`, style: 'content' }
                  ]
                },
                {
                  text: [
                    { text: 'Bill Date: ', style: 'contentBold' },
                    { text: `${this.expenseData.bill_date}`, style: 'content' }
                  ]
                },
                {
                  //   margin: [0, 0, 0, 3],
                  text: [
                    { text: 'Due Date: ', style: 'contentBold' },
                    { text: `${this.expenseData.due_date}`, style: 'content' }
                  ]
                },
              ]
            },
            {
              stack: [
                {
                  text: [
                    { text: 'Payment Terms: ', style: 'contentBold' },
                    { text: `${this.expenseData.payment_term}`, style: 'content' }
                  ]
                },


              ]
            },
          ],
        }

      ]

    ]
    if(this.expenseData.vendor.billing_address.length){
      invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
        {
          margin: [0, 0, 0, 0],
          text: [
            { text: `${this.expenseData.vendor.billing_address[0]}`, style: 'content' },
          ]
        }
      )
      this.expenseData.vendor.billing_address[1] &&  invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
        {
          margin: [0, 0, 0, 0],
          text: [
            { text: `${this.expenseData.vendor.billing_address[1]}`, style: 'content' },
          ]
        }
      )
    }
    let placeOfSupply = [];
    placeOfSupply.push({ text: 'Place of Supply: ', style: 'contentBold' }),
    placeOfSupply.push({ text: this.expenseData.place_of_supply, style: 'content' })
    this.expenseData.place_of_supply &&  invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
      {
        margin: [0, 0, 0, 0],
        text: placeOfSupply
      }
    )

    let text = [];
    if (this.pdfTemplate1.isTds) {
      if (this.expenseData.vendor.tax_details?.gstin_view) {
        text.push({ text: 'TRN: ', style: 'contentBold' })
        text.push({ text: `${this.expenseData.vendor.tax_details?.gstin_view}`, style: 'content' })
      }
      if (this.expenseData.vendor.tax_details?.crn_view) {
        text.push({ text: '  CRN: ', style: 'contentBold' })
        text.push({ text: `${this.expenseData.vendor.tax_details?.crn_view}`, style: 'content' })
      }
    } else {
      if (this.expenseData.vendor.tax_details?.gstin_view) {
        text.push({ text: 'GSTIN : ', style: 'contentBold' })
        text.push({ text: `${this.expenseData.vendor?.tax_details.gstin_view}`, style: 'content' })
      }
      if (this.expenseData.vendor.tax_details?.pan) {
        text.push({ text: ' | PAN : ', style: 'contentBold' })
        text.push({ text: `${this.expenseData.vendor.tax_details.pan}`, style: 'content' })
      }
    }
    invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
      {
        margin: [0, 0, 0, 0],
        text: text
      }
    )

    if (this.expenseData.reference_no) {
      invoiceDetailsandCustomerDetailsBody[0][1].columns[1].stack.push(
        {
          text: [
            { text: 'Reference No: ', style: 'contentBold' },
            { text: `${this.expenseData.reference_no}`, style: 'content' }
          ]
        },
      )
    }

    if (this.expenseData.employee) {
      invoiceDetailsandCustomerDetailsBody[0][1].columns[1].stack.push(
        {
          text: [
            { text: 'Sales Person: ', style: 'contentBold' },
            { text: `${this.expenseData.employee}`, style: 'content' }
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
              width:20,
              stack: []
            },
            {
              width: 20,
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

    if(this.expenseData['expense_before_tax']){
      bankBody[0][1].columns[1].stack.push(
        {
          text: [
            { text: 'Subtotal Challan', style: 'content' },
          ]
        },
      )
      bankBody[0][1].columns[2].stack.push(
        {
          text: [
            { text: `:  ${this.currency_symbol} ${formatNumber(this.expenseData.expense_before_tax)}`, style: 'contentBold' },
          ]
        },
      )
    }
    if(this.expenseData['other_expense_before_tax']){
      bankBody[0][1].columns[1].stack.push(
        {
          text: [
            { text: 'Subtotal Others ', style: 'content' },
          ]
        },
      )
      bankBody[0][1].columns[2].stack.push(
        {
          text: [
            { text: `:  ${this.currency_symbol} ${formatNumber(this.expenseData.other_expense_before_tax)}`, style: 'contentBold' },
          ]
        },
      )
    }
    bankBody[0][1].columns[1].stack.push(
      {
        text: [
          { text: 'Sub Total ', style: 'contentBold' },
        ]
      },
    )
    bankBody[0][1].columns[2].stack.push(
      {
        text: [
          { text: `:  ${this.currency_symbol} ${formatNumber(this.expenseData.subtotal_before_tax)}`, style: 'contentBold' },
        ]
      },
    )
    if(this.expenseData['discount_amount']){
      bankBody[0][1].columns[1].stack.push(
        {
          text: [
            { text: 'Discount ', style: 'contentBold' },
          ]
        },
      )
      bankBody[0][1].columns[2].stack.push(
        {
          text: [
            { text: `:  ${this.currency_symbol} ${formatNumber(this.expenseData.discount_amount)}`, style: 'contentBold' },
          ]
        },
      )
    }

    
    for (const [key, value] of Object.entries(this.expenseData?.tax)) {
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
          { text: `:  ${this.currency_symbol} ${formatNumber(this.expenseData.discount_after_tax_amount)}`, style: 'contentBold' },
        ]
      },
    )

    if(this.expenseData['adjustment_account'] && this.expenseData['adjustment_amount']){
      bankBody[0][1].columns[1].stack.push(
        {
          text: [
            { text: `${this.expenseData['adjustment_account']}`, style: 'content' },
          ]
        },
      )
      bankBody[0][1].columns[2].stack.push(
        {
          text: [
            { text: `:  ${this.currency_symbol} ${formatNumber(this.expenseData.adjustment_amount)}`, style: 'contentBold' },
          ]
        },
      )
    }
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
          { text: `:  ${this.currency_symbol} ${formatNumber(this.expenseData.total)}`, style: 'contentBold' },
        ]
      },
    )
    if(this.pdfTemplate1.isTax){
      if(!this.pdfTemplate1.isTds){
        bankBody[0][1].columns[1].stack.push(
          {
            text: [
              { text: 'TDS', style: 'content' },
            ]
          },
        )
        bankBody[0][1].columns[2].stack.push(
          {
            text: [
              { text: `:  ${this.currency_symbol} ${formatNumber(this.expenseData.tds_amount)}`, style: 'contentBold' },
            ]
          },
        )
      }
    }
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
          { text: `:  ${this.currency_symbol} ${formatNumber(this.expenseData.balance)}`, style: 'contentBold' },
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
          { text: `${this.expenseData?.amount_in_word}`, style: 'contentBold' }
        ]
      }]
    ]
    return bottomBorderTable({ body, widths: ['100%'] })
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



}
