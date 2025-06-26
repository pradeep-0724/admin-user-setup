import { Component, Inject, OnInit } from '@angular/core';
import { LpoService } from '../../../api-services/trip-module-services/lpo-services/lpo.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { pdfGenerate, addFonts } from 'src/app/shared-module/utilities/pdfmake-uitls';
import { CommonService } from 'src/app/core/services/common.service';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Permission } from 'src/app/core/constants/permissionConstants';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { forkJoin } from 'rxjs';
import { bottomBorderTable, generatePdfTemplate1, pdfTemplate1 } from 'src/app/shared-module/utilities/pdftemplate-utils';
import { cloneDeep } from 'lodash';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { formatNumber } from 'src/app/shared-module/pipes/numberformat.pipe';


@Component({
  selector: 'app-lpo-pdf-view',
  templateUrl: './lpo-pdf-view.component.html',
  styleUrls: ['./lpo-pdf-view.component.scss']
})
export class LpoPdfViewComponent implements OnInit {

  pdfSrc = '';
  isOpen = false;

  companyLogo: any = null;
  companyHeaderDetails: any;
  footerDetails: any;
  preFixUrl = ''
  showEmailOptions: boolean = false;
  filebyteCode = new BehaviorSubject(null);
  lpoPermission = Permission.quotations.toString().split(',');
  terminology: any;
  lpoPdfData: any;
  // ////////////////
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


  constructor(
    private _lpoService: LpoService, private currency: CurrencyService, 
    private _commonService: CommonService, private _tax: TaxService, 
    private dialogRef: DialogRef<boolean>, private _preFixUrl: PrefixUrlService,
    private ngxService: NgxUiLoaderService, private _fileDownload: FileDownLoadAandOpen,
    @Inject(DIALOG_DATA) private lpoId: any) {
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
      addFonts(pdfMake)
      
     }

  ngOnInit(): void {
    this.preFixUrl = this._preFixUrl.getprefixUrl();
    this.currency_symbol = this.currency.getCurrency()?.symbol;
    this.pdfTemplate1.isTax = this._tax.getTax();
    this.pdfTemplate1.isTds = this._tax.getVat();
    this.getCompanyLogoAndPdfData();
  }

  getCompanyLogoAndPdfData(){
    let logo = this._commonService.fetchCompanyLogo();
    let lopData= this._lpoService.getLpoPdf(this.lpoId.lpoId);
    forkJoin([logo,lopData]).subscribe((res:any)=>{
      this.companyLogo = res[0].result.image_blob;
      this.lpoPdfData = res[1].result;
      this.buildPdf() 
    })
  }

  pdfPageCreation(contents) {
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
    var dd = pdfGenerate(pdfContent, this.companyHeaderDetails, this.footerDetails)
    return dd
  }


  close() {
    this.dialogRef.close(true)
  }

  createOtherItemData(data) {
    let otherItems = [];

    otherItems.push([
    { text: 'Description', bold: true }, 
    { text: 'Total Units', bold: true },
    { text: 'Unit Price'+ '(' + this.currency_symbol + ')', bold: true },
    { text: 'Total Amount' + '(' + this.currency_symbol + ')', bold: true }])
    
    data.forEach(item => {
      otherItems.push([
        { text: item.description }, 
        { text: item.total_units},
        { text: formatNumber(item.rate) },
        { text: formatNumber(item.amount) }
      ])
    })

    if (this.pdfTemplate1.isTax) {
    otherItems[0].splice(3, 0, { text: 'Tax' + '(' + this.currency_symbol + ')', bold: true })    
    data.forEach((item, index) => {
      otherItems[1+index].splice(3, 0, {
        text:
          [
          { text: formatNumber(item.amount - item.amount_before_tax)+' ( '+item.tax_label + ""+')'}]})
    })}

    const widthString = (100 / otherItems[0].length).toFixed(3);
    const itemChallanWidths = Array(otherItems[0].length).fill(widthString + "%");
    return [otherItems, itemChallanWidths]
  }

  addCalculations(data) {
    const arr = []
    arr.push(["Sub Total:", `${this.currency_symbol} ${formatNumber(data['subtotal'])}`, true])
    if (this.pdfTemplate1.isTax) {
      arr.push(["Tax Amount: ", `${this.currency_symbol} ${formatNumber(data.tax_amount)}`, true])
    }
    arr.push([" LPO Total Amount:", `${this.currency_symbol} ${formatNumber(data['total_amount'])}`, true])
    arr.push(["Amount in Words:", data['amount_in_words'], true])
    return arr
  }

  addCal(cals) {
    let tempArr = []
    for (let i = 0; i < cals.length; i++) {
      tempArr.push([{ text: cals[i][0], alignment: "right", bold: cals[i][2] },
      { text: cals[i][1], alignment: "right", bold: cals[i][2] }])

    }
    return tempArr
  }



  generateFileName() {
    let partyName = this.lpoPdfData['party']['company_name'];
    let lpoNumber = this.lpoPdfData['lpo_no'];
    return `${partyName}_${lpoNumber}`;
  }

  downloadForEmailPdf() {
    this.emailPopUps(this.lpoPdfData);
  }

  toTitleCase(str) {
    if (str)
      return str.replace(/\S+/g, str => str.charAt(0).toUpperCase() + str.substr(1).toLowerCase());
  }

  createEmailPdf(data, fileName) {
    let partyCompanyName = this.toTitleCase(data['party'].company_name);
    let lpoNo = data.lpo_no;
    let senderCompany = data.company.company_name;
    let debitAmount = data.total_amount;
    let subject = senderCompany + "| LPO No : " + lpoNo
    let userName = this.toTitleCase(localStorage.getItem('TS_USER_NAME'))
    let content = "\nHi " + partyCompanyName + " ,\n\n I hope you're well! Please see attached LPO number " + lpoNo + " with a LPO amount of " + this.currency_symbol + " " + debitAmount + ". Don't hesitate to reach out if you have any questions.\n\nKind regards,\n\n" + userName + "\n\n" + senderCompany

    let dataFormat = {
      base64Code: "",
      email: data['party']['email_address'],
      content:content ,
      fileName: fileName + "_" + this.generateFileName(),
      subject: subject, isOpen: true
    }

    setTimeout(() => {
      pdfMake.createPdf(generatePdfTemplate1(cloneDeep(this.pdfTemplate1))).getBase64(data => {
        dataFormat.base64Code = data
        this.filebyteCode.next(dataFormat);
        this.isOpen = true;
      })
    }, 100);
  }

  emailPopUps(data) {
    this.ngxService.start();
    let fileName = 'LPO_'
    this.createEmailPdf(data, fileName)
    setTimeout(() => {
      this.ngxService.stop();
    }, 500);
  }

  closeDialog(e) {
    if (e) {
      this.isOpen = false;
    }
  }

  buildPdf() {
    this.pdfTemplate1.contents = []
    this.pdfTemplate1.headerDetails.companyname = this.lpoPdfData.company.company_name;
    this.pdfTemplate1.headerDetails.companynameNative = '';
    this.pdfTemplate1.headerDetails.crnNo = this.lpoPdfData.company.crn_no;
    this.pdfTemplate1.headerDetails.panNo = this.lpoPdfData.company.pan;
    this.pdfTemplate1.headerDetails.trnNo = this.lpoPdfData.company.gstin;
    this.pdfTemplate1.headerDetails.companyEmailId = this.lpoPdfData.company.email_address;
    this.pdfTemplate1.headerDetails.companyAddress = this.lpoPdfData.company.billing_address[0]+this.lpoPdfData.company.billing_address[1];
    this.pdfTemplate1.headerDetails.mobileNo = this.lpoPdfData.company.primary_mobile_number;
    this.pdfTemplate1.footerDetails.companyname = this.lpoPdfData.company.company_name;
    this.pdfTemplate1.footerDetails.companynameNative = '';
    this.pdfTemplate1.footerDetails.companyEmailId = this.lpoPdfData.company.email_address;
    this.pdfTemplate1.footerDetails.mobileNo = this.lpoPdfData.company.primary_mobile_number;
    this.pdfTemplate1.headerDetails.companyLogo = this.companyLogo;
    this.pdfTemplate1.headerDetails.pdfTitle = 'Local Purchase Order';
    this.pdfTemplate1.footerDetails.systemGenerated = 'This is a computer-generated Local Purchase Order receipt. No signature is required for validation.'
    this.pdfTemplate1.footerDetails.poweredBy = 'Powered By Transportsimple.com';
    this.pdfTemplate1.contents.push(
      bottomBorderTable({ body: this.getDebitDetailsandCustomerDetailsBody(), widths: ['50%', '50%'] }),
    )
    const otherItemRows = this.createOtherItemData(this.lpoPdfData['items'])
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
        hLineWidth: function (i, node) {
          return (i === 1 || i === node.table.body.length) ? 0.7 : 0;
        },
        vLineWidth: () => 0.7,
        hLineColor: () => 'black',
        vLineColor: () => 'black'
      }
    }
    this.pdfTemplate1.contents.push(otherItemTable)
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
                { text: `${this.lpoPdfData.party.company_name}`, style: 'contentBold' },
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
                    { text: 'LPO No: ', style: 'contentBold' },
                    { text: `${this.lpoPdfData.lpo_no}`, style: 'content' }
                  ]
                },
                {
                  text: [
                    { text: 'LPO Date: ', style: 'contentBold' },
                    { text: `${this.lpoPdfData.lpo_date}`, style: 'content' }
                  ]
                },
                {
                  text: [
                    { text: 'Validity: ', style: 'contentBold' },
                    { text: `${this.lpoPdfData.validity}`, style: 'content' }
                  ]
                },
                {
                  text: [
                    { text: 'Expiry Date: ', style: 'contentBold' },
                    { text: `${this.lpoPdfData.lpo_expiry_date}`, style: 'content' }
                  ]
                },
              ]
            },
            {
              stack: [
                {
                  text: [
                    { text: 'Payment Terms: ', style: 'contentBold' },
                    { text: `${this.lpoPdfData.payment_term}`, style: 'content' }
                  ]
                },


              ]
            },
          ],
        }

      ]

    ]
    if(this.lpoPdfData.party.billing_address.length){
      invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
        {
          margin: [0, 0, 0, 0],
          text: [
            { text: `${this.lpoPdfData.party.billing_address[0]}`, style: 'content' },
          ]
        }
      )
      invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
        {
          margin: [0, 0, 0, 0],
          text: [
            { text: `${this.lpoPdfData.party.billing_address[1]}`, style: 'content' },
          ]
        }
      )
    }
    
    let text = [];
    if (this.pdfTemplate1.isTds) {
      if (this.lpoPdfData.party.tax_details.gstin_view) {
        text.push({ text: 'TRN: ', style: 'contentBold' })
        text.push({ text: `${this.lpoPdfData.party.tax_details.gstin_view}`, style: 'content' })
      }
      if (this.lpoPdfData.party.tax_details.crn_view) {
        text.push({ text: ' CRN: ', style: 'contentBold' })
        text.push({ text: `${this.lpoPdfData.party.tax_details.crn_view}`, style: 'content' })
      }
    } else {
      if (this.lpoPdfData.party.tax_details.gstin_view) {
        text.push({ text: 'GSTIN : ', style: 'contentBold' })
        text.push({ text: `${this.lpoPdfData.party.tax_details.gstin_view}`, style: 'content' })
      }
      if (this.lpoPdfData.party.tax_details.pan) {
        text.push({ text: '  PAN : ', style: 'contentBold' })
        text.push({ text: `${this.lpoPdfData.party.tax_details.pan}`, style: 'content' })
      }
    }
    invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
      {
        margin: [0, 0, 0, 0],
        text: text
      }
    )

    if (isValidValue(this.lpoPdfData.poc_name) || isValidValue(this.lpoPdfData.poc_mobile.no)) {
      let customerContactPersonAndPhoneNo = ''
      if (isValidValue(this.lpoPdfData.poc_name) && isValidValue(this.lpoPdfData.poc_mobile.no)) {
        customerContactPersonAndPhoneNo = `${this.lpoPdfData.poc_name} (${this.lpoPdfData.poc_mobile.code + ' ' + this.lpoPdfData.poc_mobile.no})`
      }
      if (isValidValue(this.lpoPdfData.poc_name) && !this.lpoPdfData.poc_mobile.no) {
        customerContactPersonAndPhoneNo = `${this.lpoPdfData.poc_name}`
      }
      if (!this.lpoPdfData.poc_name && isValidValue(this.lpoPdfData.poc_mobile.no)) {
        customerContactPersonAndPhoneNo = `(${this.lpoPdfData.poc_mobile.code + ' ' + this.lpoPdfData.poc_mobile.no})`
      }
      invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
        {
          margin: [0, 0, 0, 3],
          text: [
            { text: `Contact Person: `, style: 'contentBold' },
            { text: `: ${customerContactPersonAndPhoneNo} `, style: 'content' },
          ]
        }
      )
    }

    if (this.lpoPdfData.reference_no) {
      invoiceDetailsandCustomerDetailsBody[0][1].columns[1].stack.push(
        {
          text: [
            { text: 'Reference No: ', style: 'contentBold' },
            { text: `${this.lpoPdfData.reference_no}`, style: 'content' }
          ]
        },
      )
    }

    if (this.lpoPdfData.employee) {
      invoiceDetailsandCustomerDetailsBody[0][1].columns[1].stack.push(
        {
          text: [
            { text: 'Sales Person: ', style: 'contentBold' },
            { text: `${this.lpoPdfData.employee}`, style: 'content' }
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
          { text: 'Sub Total', style: 'contentBold' },
        ]
      },
    )
    bankBody[0][1].columns[2].stack.push(
      {
        text: [
          { text: `:  ${this.currency_symbol} ${formatNumber(this.lpoPdfData.subtotal)}`, style: 'contentBold' },
        ]
      },
    )
    for (const [key, value] of Object.entries(this.lpoPdfData?.tax)) {
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
          { text: 'Total Amount', style: 'contentBold' },
        ]
      },
    )
    bankBody[0][1].columns[2].stack.push(
      {
        text: [
          { text: `:  ${this.currency_symbol} ${formatNumber(this.lpoPdfData.total_amount)}`, style: 'contentBold' },
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
          { text: `${this.lpoPdfData?.amount_in_words}`, style: 'contentBold' }
        ]
      }]
    ]
    return bottomBorderTable({ body, widths: ['100%'] })
  }  

  downloadPdf() {
    this.processPdf();
  }

  processPdf() {
    let type = ".pdf"
    let fileName = 'LPO_'
    setTimeout(() => {
      let fileNameA = fileName + "_" + this.generateFileName() + type;
      const pdfDocGenerator = pdfMake.createPdf(generatePdfTemplate1(cloneDeep(this.pdfTemplate1)));
      pdfDocGenerator.getBlob((blob) => {
        this._fileDownload.writeAndOpenFile(blob, fileNameA).then(data => {
        });
      });
    }, 500);
  }

  openDetails() {
    this.dialogRef.close(true)
  }

}

