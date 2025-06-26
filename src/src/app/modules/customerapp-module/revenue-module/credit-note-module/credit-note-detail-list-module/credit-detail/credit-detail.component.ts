import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CreditService } from '../../../../api-services/revenue-module-service/credit-note-service/credit-note.service';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { CommonService } from 'src/app/core/services/common.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { addFonts, reorderMixedText } from 'src/app/shared-module/utilities/pdfmake-uitls';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { cloneDeep } from 'lodash';
import { bottomBorderTable, generatePdfTemplate1, getApprovalsTable, getNarationSignature, getTermsAndConditionTableNextPage, getTermsAndConditionTableSamePage, pdfTemplate1 } from 'src/app/shared-module/utilities/pdftemplate-utils';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { formatNumber } from 'src/app/shared-module/pipes/numberformat.pipe';

@Component({
    selector: 'app-credit-details',
    templateUrl: './credit-detail.component.html',
    styleUrls: [
        './credit-detail.component.scss'
    ]
})
export class CreditDetailsComponent implements OnInit, OnDestroy {

    creditData: any;
    companyLogo: any = '';
    @Input() creditNoteId: BehaviorSubject<string>;
    @Input() routeToDetail: boolean;
    @Output() openDetailsEmitter = new EventEmitter<boolean>();
    showOptions: boolean = false;
    createCopySeleted: Number = 0;
    currency_symbol;
    isOpen = false;
    filebyteCode = new BehaviorSubject(null);
    showEmailOptions: boolean = false;
    preFixUrl = '';
    pdfSrc = "";
    creditNotePermissions = Permission.credit_note.toString().split(',');
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
    creditId = '';

    constructor(
        private _creditService: CreditService,
        private _commonService: CommonService,
        private ngxService: NgxUiLoaderService,
        private currency: CurrencyService,
        private _tax: TaxService,
        private _preFixUrl: PrefixUrlService,
        private _fileDownload: FileDownLoadAandOpen,
        private _commonLoaderService : CommonLoaderService
    ) {
        pdfMake.vfs = pdfFonts.pdfMake.vfs;
        this.pdfTemplate1.isTax = this._tax.getTax();
        this.pdfTemplate1.isTds = this._tax.getVat();
        addFonts(pdfMake)
    }

    ngOnInit() {
        this.preFixUrl = this._preFixUrl.getprefixUrl();
        this.currency_symbol = this.currency.getCurrency()?.symbol;
        this.creditDetails();
    }
    

    openDetails(): void {
        this.routeToDetail = !this.routeToDetail;
        this.openDetailsEmitter.next(this.routeToDetail)
    }


    downloadPdf(data, print: boolean = false) {
      this.processPdf(data, print);
    }

    processPdf(data, print: Boolean = false) {
        this.ngxService.start();
        let type = ".pdf"
        let fileName = 'Original_for_Recipient'
        if (print) {
          pdfMake.createPdf(generatePdfTemplate1(cloneDeep(this.pdfTemplate1))).print();
        } else {
            setTimeout(() => {
                let fileNameA = fileName + "_" + this.generateFileName() + type;
                const pdfDocGenerator = pdfMake.createPdf(generatePdfTemplate1(cloneDeep(this.pdfTemplate1)) );
                pdfDocGenerator.getBlob((blob) => {
                    this._fileDownload.writeAndOpenFile(blob, fileNameA).then(data => {
                    });
                });
            }, 500);
        }
        setTimeout(() => {
            this.ngxService.stop();
        }, 500);
    }
    
    ngOnDestroy() {

    }

    createCopySelect(i) {
      this.createCopySeleted = i;
      this.showOptions = false;
      this.showEmailOptions = false;
    }

  

    downloadEmailPdf(data, print: boolean = false) {
      this.processEmailPdf(this.creditData, print);
    }

    processEmailPdf(dataValues, print: Boolean = false) {      
        function toTitleCase(str) {
            return str.replace(/\S+/g, str => str.charAt(0).toUpperCase() + str.substr(1).toLowerCase());
        }
        let partyCompanyName = toTitleCase(dataValues['party'].company_name);
        let debitNoteNumber = dataValues['head']['no'];
        let senderCompany = dataValues.company.company_name;
        let debitAmount = dataValues['calculations']['total'];
        let subject = senderCompany + "| Credit note Number : " + debitNoteNumber
        let userName = toTitleCase(localStorage.getItem('TS_USER_NAME'))
        this.ngxService.start();
        let fileName = 'Original_for_Recipient'
        if (this.createCopySeleted === 0) {
            setTimeout(() => {
              pdfMake.createPdf(generatePdfTemplate1(cloneDeep(this.pdfTemplate1))).getBase64(data => {
                    let dataFormat = {
                        base64Code: data,
                        content: "\nHi " + partyCompanyName + " ,\n\nI hope you're well! Please see attached credit number " + debitNoteNumber + " with a credit amount of " + this.currency_symbol + " " + debitAmount + ". Don't hesitate to reach out if you have any questions.\n\nKind regards,\n\n" + userName + "\n\n" + senderCompany,
                        fileName: fileName + "_" + this.generateFileName(),
                        email: dataValues['party']['email_address'],
                        subject: subject,
                        isOpen: true
                    }
                    this.filebyteCode.next(dataFormat);
                    this.isOpen = true;
                })
            }, 500);
        }
        setTimeout(() => {
            this.ngxService.stop();
        }, 500);
    }

  creditDetails() {
    this._commonLoaderService.getShow();
    this.creditNoteId.subscribe((id)=>{
      this.creditId = id;
      this.pdfBlobs = [];
      let logo = this._commonService.fetchCompanyLogo();
      let debitNoteDetails = this._creditService.getCreditNotePrintView(id)
      forkJoin([logo, debitNoteDetails]).subscribe((response:any)=>{
        this.companyLogo = response[0].result.image_blob;
        this.creditData = response[1]['result'];
        this.buildPdf();
        this._commonLoaderService.getHide();
      })
    })  
  }

  buildPdf() {    
    this.pdfTemplate1.contents = []
    this.pdfTemplate1.headerDetails.companyname = this.creditData.company.company_name;
    this.pdfTemplate1.headerDetails.companynameNative = reorderMixedText(this.creditData.company.company_native_name);
    this.pdfTemplate1.headerDetails.crnNo = this.creditData.company.crn_no;
    this.pdfTemplate1.headerDetails.trnNo = this.creditData.company.tax_no;
    this.pdfTemplate1.headerDetails.companyEmailId = this.creditData.company.email_address;
    this.pdfTemplate1.headerDetails.companyAddress = this.creditData.company.address[0]+''+this.creditData.company.address[1];
    this.pdfTemplate1.headerDetails.mobileNo = this.creditData.company.mobile_no;
    this.pdfTemplate1.footerDetails.companyname = this.creditData.company.company_name;
    this.pdfTemplate1.footerDetails.companynameNative = reorderMixedText(this.creditData.company.company_native_name);
    this.pdfTemplate1.footerDetails.companyEmailId = this.creditData.company.email_address;
    this.pdfTemplate1.footerDetails.mobileNo = this.creditData.company.mobile_no;
    this.pdfTemplate1.headerDetails.companyLogo = this.companyLogo;
    this.pdfTemplate1.headerDetails.pdfTitle = this.creditData.company.tax_head_in_eng;
    if (this.creditData.company.tax_head_in_native) {
      this.pdfTemplate1.headerDetails.pdfTitle = this.creditData.company.tax_head_in_eng + ` | ${reorderMixedText(this.creditData.company.tax_head_in_native)}`
    }
    if (this.creditData.general_config.disclaimer.display) {
      this.pdfTemplate1.footerDetails.systemGenerated = this.creditData.general_config.disclaimer.term;
    }
    if (this.creditData.general_config.include_branding) {
      this.pdfTemplate1.footerDetails.poweredBy = 'Powered By Transportsimple.com';
    }
    this.pdfTemplate1.contents.push(
      bottomBorderTable({ body: this.getCreditDetailsandCustomerDetailsBody(), widths: ['40%', '60%'] }),
    )
    this.pdfTemplate1.contents.push(this.getItemTable())
    this.pdfTemplate1.contents.push(this.getBankAndTotalsTable())
    this.pdfTemplate1.contents.push(this.getAmountInWords())
    this.pdfTemplate1.contents.push(getNarationSignature({
      narration: this.creditData.narration,
      signature: this.creditData.signature?.document,
      isNarration: true,
      isSignature: true,
      authorizedSignature: this.creditData.general_config.signatory.authorised_signatory.display?this.creditData.general_config.signatory.authorised_signatory.term:'',
      forSignature:this.creditData.general_config.signatory.for_company.display?this.creditData.general_config.signatory.for_company.term:'',
    }));
    let approvers = this.getApprovers();
    if (approvers.length > 0) {
      this.pdfTemplate1.contents.push(getApprovalsTable(this.getApprovers()))
    }
    if (this.creditData.tnc && this.creditData.tnc.same_page_display && this.creditData.tnc.content) {
      this.pdfTemplate1.contents.push(getTermsAndConditionTableSamePage(this.creditData.tnc.content));
    }
    if (this.creditData.tnc && !this.creditData.tnc.same_page_display && this.creditData.tnc.content) {
      let termsAndConditionTable = getTermsAndConditionTableNextPage(this.creditData.tnc.content);
      this.pdfTemplate1.contents=this.addPageBreak([this.pdfTemplate1.contents,termsAndConditionTable])
    }
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
              margin: [0, 0, 0, 3],
              text: [
                { text: 'Credit Note To: ', style: 'contentBold' },
              ]
            },
            {
              text: [
                { text: `${this.creditData.party.company_name}`, style: 'contentBold' },
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
                    { text: 'Credit Note No: ', style: 'contentBold' },
                    { text: `${this.creditData.head.no}`, style: 'content' }
                  ]
                },
                {
                  margin: [0,0,3,0],
                  text: [
                    { text: 'Credit Note Date: ', style: 'contentBold' },
                    { text: `${this.creditData.head.date}`, style: 'content' }
                  ]
                },
                    {
                        text: [
                            { text: 'Invoice No: ', style: 'contentBold' },
                            { text: `${this.creditData.head.invoice_number}`, style: 'content' }
                        ]
                    },
                {
                      text: [
                        { text: 'Invoice Date: ', style: 'contentBold' },
                        { text: `${this.creditData.head.invoice_date}`, style: 'content' }
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
    if (this.creditData.party.billing_address[0]) {
      invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
        {
          margin: [0, 0, 0, 0],
          text: [
            { text: `${this.creditData.party.billing_address[0]}`, style: 'content' },
          ]
        }
      )
    }
    if (this.creditData.party.billing_address[1]) {
      invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
        {
          margin: [0, 0, 0, 0],
          text: [
            { text: `${this.creditData.party.billing_address[1]}`, style: 'content' },
          ]
        }
      )
    }
    if (this.creditData.party.crn_no || this.creditData.party.tax_no) {
      let text = [];
      if (this.creditData.party.crn_no) {
        text.push({ text: 'CRN: ', style: 'contentBold' })
        text.push({ text: `${this.creditData.party.crn_no}`, style: 'content' })
      }
      if (this.creditData.party.tax_no) {
        text.push({text:this.pdfTemplate1.isTds?' TRN: ':'GSTIN: ', style: 'contentBold'})
        text.push({ text: `${this.creditData.party.tax_no}`, style: 'content' })
      }

      invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
        {
          margin: [0, 0, 0, 3],
          text: text
        }
      )
    }
    if (isValidValue(this.creditData.party.contact)) {
      let customerContactPersonAndPhoneNo=''
      if(isValidValue(this.creditData.party.contact.name) && isValidValue(this.creditData.party.contact.no)){
        customerContactPersonAndPhoneNo = `${this.creditData.party.contact.name} (${this.creditData.party.contact.no})`
      }
      if(isValidValue(this.creditData.party.contact.name) && !this.creditData.party.contact.no){
        customerContactPersonAndPhoneNo = `${this.creditData.party.contact.name}`
      }
      if(!this.creditData.party.contact.name && isValidValue(this.creditData.party.contact.no)){  
        customerContactPersonAndPhoneNo = `${this.creditData.party.contact_no}`
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
    if (this.creditData.general_config.show_shipping_address && this.creditData.party.shipping_address[0] && this.creditData.party.shipping_address[1]) {
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
            { text: `${this.creditData.party.shipping_address[0]}`, style: 'content' },
          ]
        }
      )
      invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
        {
          text: [
            { text: `${this.creditData.party.shipping_address[1]}`, style: 'content' },
          ]
        }
      )
    }
    
    if (this.creditData.head.reference_no) {
      invoiceDetailsandCustomerDetailsBody[0][1].columns[1].stack.push(
        {
          text: [
            { text: 'Reference No: ', style: 'contentBold' },
            { text: `${this.creditData.head.reference_no}`, style: 'content' }
          ]
        },
      )
    }
    if (this.creditData.head.reason) {
        invoiceDetailsandCustomerDetailsBody[0][1].columns[1].stack.push(
          {
            text: [
              { text: 'Reason : ', style: 'contentBold' },
              { text: `${this.creditData.head.reason}`, style: 'content' }
            ]
          },
        )
      }
    if (this.creditData.head.sp) {
      invoiceDetailsandCustomerDetailsBody[0][1].columns[1].stack.push(
        {
          text: [
            { text: 'Sales Person: ', style: 'contentBold' },
            { text: `${this.creditData.head.sp}`, style: 'content' }
          ]
        }
      )
    }
    return invoiceDetailsandCustomerDetailsBody;
  }

  getApprovers() {
    let approvers = [];
    if (this.creditData.general_config.signatory.verifed_by.display) {
      approvers.push(this.creditData.general_config.signatory.verifed_by.term)
    }
    if (this.creditData.general_config.signatory.approved_by.display) {
      approvers.push(this.creditData.general_config.signatory.approved_by.term)
    }
    if (this.creditData.general_config.signatory.prepared_by.display) {
      approvers.push(this.creditData.general_config.signatory.prepared_by.term)
    }
    if (this.creditData.general_config.signatory.received_by.display) {
      approvers.push(this.creditData.general_config.signatory.received_by.term)
    }
    return approvers;

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
    if(this.creditData.bank){
      bankBody[0][0].columns[0].stack.push(
        {
          text: [
            { text: 'Bank', style: 'content' },
          ]
        },
      )
      bankBody[0][0].columns[1].stack.push(
        {
          text: [
            { text: `:  ${this.creditData.bank.bank_name}`, style: 'contentBold' },
          ]
        }
      )
   
    }
    let totalQuantity = 0;
    this.creditData.items.rows.map((rowList) => {
      rowList.map(cell => {
        if(cell.key=='qty'){
          totalQuantity += cell.value;
        }
      })

    })
    bankBody[0][0].columns[0].stack.push(
      {
        text: [
          { text: 'Total Items/ Qty', style: 'content' },
        ],
      },
    )
    bankBody[0][0].columns[1].stack.push(
      {
        text: [
          { text: `:  ${ this.creditData.items.rows.length+'/'+totalQuantity}`, style: 'contentBold' },
        ],
      }
    )
   


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
          { text: `:  ${this.currency_symbol} ${formatNumber(this.creditData.calculations.subtotal)}`, style: 'contentBold' },
        ]
      },
    )
    for (const [key, value] of Object.entries(this.creditData.calculations.tax)) {
      bankBody[0][1].columns[1].stack.push(
        {
          text: [
            { text:`${key}`, style: 'contentBold' },
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
          { text: 'Round off', style: 'contentBold' },
        ]
      },
    )
    bankBody[0][1].columns[2].stack.push(
      {
        text: [
          { text: `:  ${this.currency_symbol} ${formatNumber(this.creditData.calculations.roundoff_amount)}`, style: 'contentBold' },
        ]
      },
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
          { text: `:  ${this.currency_symbol} ${formatNumber(this.creditData.calculations.total)}`, style: 'contentBold' },
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
              { text:`${this.creditData.calculations.total_in_word}`, style: 'contentBold' }
          ]


      }]
  ]
  return bottomBorderTable({body,widths:['100%']})
  }

  getItemTable() {
      const tableHeaderRow = this.creditData.items.columns.map(col => ({
      text: col.label,
      style: 'contentBold'
    }));
  let itemsKeys=this.creditData.items.columns.map(col => col.key);
  const itemWidths =this.getItemColumnWidths(itemsKeys) ;
    // Data Rows
    const tableBodyRows = this.creditData.items.rows.map(rowList => {
      const rowCells = rowList.map(cell => {
        if (cell.description.length > 0) {
          const descriptionText = [];
  
          descriptionText.push({ text: '(', style: 'content' });
          cell.description.forEach(desc => {
            descriptionText.push({ text: `${desc.label}: `, style: 'contentBold' });
            descriptionText.push({ text: `${desc.value} `, style: 'content' });
          });
          descriptionText.push({ text: ')', style: 'content' });
  
          return {
            stack: [
              { text: cell.value, style:cell.key=='item'?'contentBold':'content' },
              { text: descriptionText }
            ]
          };
        } else {
          if(['rate','amount','net'].includes(cell.key)){
            return {
              stack: [
                { text: formatNumber(Number(cell.value)), style: cell.key=='item'?'contentBold':'content' }
              ]
            };
          }else{
            return {
              stack: [
                { text: cell.value, style: cell.key=='item'?'contentBold':'content' }
              ]
            };
          }
        }
      });
  
      return rowCells;
    });
  
    // Final Table Definition
    return {
      table: {
        headerRows: 1,
        dontBreakRows: true,
        widths: itemWidths,
        body: [tableHeaderRow, ...tableBodyRows]
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



  generateFileName() {
    let partyName = this.creditData['party']['company_name'];
    let debitNumber = this.creditData['head']['no'];
    return `${partyName}_${debitNumber}`;
}

  closeDialog(e) {
    if (e) {
      this.isOpen = false;
    }
  }

  getItemColumnWidths(columns:[]): string[] {
    const fixedWidths: Record<string, number> = {
      "serial_no":3,
      "item": 30,
      "unit": 7,
      "rate":7,
      "qty":7,
      "amount": 8,
    };
  
    const totalFixed = columns.reduce((sum, key) => sum + (fixedWidths[key] || 0), 0);
    const remainingColumns = columns.filter(key => !(key in fixedWidths));
    const remainingWidth = (100 - totalFixed) / remainingColumns.length;
  
    return columns.map(key =>
      (fixedWidths[key] ?? remainingWidth).toFixed(2) + "%"
    );
  }
}




