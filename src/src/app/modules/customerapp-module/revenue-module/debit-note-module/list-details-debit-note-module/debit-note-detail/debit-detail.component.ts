import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { DebitService } from '../../../../api-services/revenue-module-service/debit-note-service/debit.service';
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
    selector: 'app-debit-details',
    templateUrl: './debit-detail.component.html',
    styleUrls: [
        './debit-detail.component.scss'
    ]
})
export class DebitDetailsComponent implements OnInit, OnDestroy {

    debitData: any;
    @Input() debitNoteId: BehaviorSubject<string>;
    @Input() routeToDetail: boolean;
    @Output() openDetailsEmitter = new EventEmitter<boolean>();
    debitId = '';
    showOptions: boolean = false;
    createCopySeleted: Number = 0;
    isOpen = false;
    filebyteCode = new BehaviorSubject(null);
    showEmailOptions: boolean = false;
    preFixUrl = '';
    pdfSrc = "";
    debitNotePermissions = Permission.debit_note.toString().split(',');
    companyLogo = '';
    currency_symbol;
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
        private _debitService: DebitService,
        private _commonService: CommonService,
        private ngxService: NgxUiLoaderService,
        private currency: CurrencyService,
        private _tax: TaxService,
        private _preFixUrl: PrefixUrlService,
        private _fileDownload: FileDownLoadAandOpen,private _commonLoaderService : CommonLoaderService
    ) {
        pdfMake.vfs = pdfFonts.pdfMake.vfs;
        this.pdfTemplate1.isTax = this._tax.getTax();
        this.pdfTemplate1.isTds = this._tax.getVat();
        addFonts(pdfMake)
    }

    ngOnInit() {
        this.preFixUrl = this._preFixUrl.getprefixUrl();
        this.currency_symbol = this.currency.getCurrency()?.symbol;
        this.debitDetails();

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
      this.processEmailPdf(this.debitData, print);
    }

    processEmailPdf(dataValues, print: Boolean = false) {      
        function toTitleCase(str) {
            return str.replace(/\S+/g, str => str.charAt(0).toUpperCase() + str.substr(1).toLowerCase());
        }
        let partyCompanyName = toTitleCase(dataValues['party'].company_name);
        let debitNoteNumber = dataValues['head']['no'];
        let senderCompany = dataValues.company.company_name;
        let debitAmount = dataValues['calculations']['total'];
        let subject = senderCompany + "| Debit note Number : " + debitNoteNumber
        let userName = toTitleCase(localStorage.getItem('TS_USER_NAME'))
        this.ngxService.start();
        let fileName = 'Original_for_Recipient'
        if (this.createCopySeleted === 0) {
            setTimeout(() => {
              pdfMake.createPdf(generatePdfTemplate1(cloneDeep(this.pdfTemplate1))).getBase64(data => {
                    let dataFormat = {
                        base64Code: data,
                        content: "\nHi " + partyCompanyName + " ,\n\nI hope you're well! Please see attached debit number " + debitNoteNumber + " with a debit amount of " + this.currency_symbol + " " + debitAmount + ". Don't hesitate to reach out if you have any questions.\n\nKind regards,\n\n" + userName + "\n\n" + senderCompany,
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

  debitDetails() {
    this._commonLoaderService.getShow();
    this.debitNoteId.subscribe((id)=>{
      this.debitId = id;
      this.pdfBlobs = [];
      let logo = this._commonService.fetchCompanyLogo();
      let debitNoteDetails = this._debitService.getDebitNotePrintView(id)
      forkJoin([logo, debitNoteDetails]).subscribe((response:any)=>{
        this.companyLogo = response[0].result.image_blob;
        this.debitData = response[1]['result'];
        this.buildPdf();
        this._commonLoaderService.getHide();
      })
    })  
  }

  buildPdf() {    
    this.pdfTemplate1.contents = []
    this.pdfTemplate1.headerDetails.companyname = this.debitData.company.company_name;
    this.pdfTemplate1.headerDetails.companynameNative = reorderMixedText(this.debitData.company.company_native_name);
    this.pdfTemplate1.headerDetails.crnNo = this.debitData.company.crn_no;
    this.pdfTemplate1.headerDetails.trnNo = this.debitData.company.tax_no;
    this.pdfTemplate1.headerDetails.companyEmailId = this.debitData.company.email_address;
    this.pdfTemplate1.headerDetails.companyAddress = this.debitData.company.address[0]+''+this.debitData.company.address[1];
    this.pdfTemplate1.headerDetails.mobileNo = this.debitData.company.mobile_no;
    this.pdfTemplate1.footerDetails.companyname = this.debitData.company.company_name;
    this.pdfTemplate1.footerDetails.companynameNative = reorderMixedText(this.debitData.company.company_native_name);
    this.pdfTemplate1.footerDetails.companyEmailId = this.debitData.company.email_address;
    this.pdfTemplate1.footerDetails.mobileNo = this.debitData.company.mobile_no;
    this.pdfTemplate1.headerDetails.companyLogo = this.companyLogo;
    this.pdfTemplate1.headerDetails.pdfTitle = this.debitData.company.tax_head_in_eng;
    if (this.debitData.company.tax_head_in_native) {
      this.pdfTemplate1.headerDetails.pdfTitle = this.debitData.company.tax_head_in_eng + ` | ${reorderMixedText(this.debitData.company.tax_head_in_native)}`
    }
    if (this.debitData.general_config.disclaimer.display) {
      this.pdfTemplate1.footerDetails.systemGenerated = this.debitData.general_config.disclaimer.term;
    }
    if (this.debitData.general_config.include_branding) {
      this.pdfTemplate1.footerDetails.poweredBy = 'Powered By Transportsimple.com';
    }
    this.pdfTemplate1.contents.push(
      bottomBorderTable({ body: this.getDebitDetailsandCustomerDetailsBody(), widths: ['40%', '60%'] }),
    )
    this.pdfTemplate1.contents.push(this.getItemTable())
    this.pdfTemplate1.contents.push(this.getBankAndTotalsTable())
    this.pdfTemplate1.contents.push(this.getAmountInWords())
    this.pdfTemplate1.contents.push(getNarationSignature({
      narration: this.debitData.narration,
      signature: this.debitData.signature?.document,
      isNarration: true,
      isSignature: true,
      authorizedSignature: this.debitData.general_config.signatory.authorised_signatory.display?this.debitData.general_config.signatory.authorised_signatory.term:'',
      forSignature:this.debitData.general_config.signatory.for_company.display?this.debitData.general_config.signatory.for_company.term:'',
    }));
    let approvers = this.getApprovers();
    if (approvers.length > 0) {
      this.pdfTemplate1.contents.push(getApprovalsTable(this.getApprovers()))
    }
    if (this.debitData.tnc && this.debitData.tnc.same_page_display && this.debitData.tnc.content) {
      this.pdfTemplate1.contents.push(getTermsAndConditionTableSamePage(this.debitData.tnc.content));
    }
    if (this.debitData.tnc && !this.debitData.tnc.same_page_display && this.debitData.tnc.content) {
      let termsAndConditionTable = getTermsAndConditionTableNextPage(this.debitData.tnc.content);
      this.pdfTemplate1.contents=this.addPageBreak([this.pdfTemplate1.contents,termsAndConditionTable])
    }
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
                { text: 'Debit Note To: ', style: 'contentBold' },
              ]
            },
            {
              text: [
                { text: `${this.debitData.party.company_name}`, style: 'contentBold' },
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
                    { text: 'Debit Note No: ', style: 'contentBold' },
                    { text: `${this.debitData.head.no}`, style: 'content' }
                  ]
                },
                {
                  text: [
                    { text: 'Debit Note Date: ', style: 'contentBold' },
                    { text: `${this.debitData.head.date}`, style: 'content' }
                  ]
                },
                {
                //   margin: [0, 0, 0, 3],
                  text: [
                    { text: 'Due Date: ', style: 'contentBold' },
                    { text: `${this.debitData.head.due_date}`, style: 'content' }
                  ]
                },
                    {
                        text: [
                            { text: 'Invoice No: ', style: 'contentBold' },
                            { text: `${this.debitData.head.invoice_number}`, style: 'content' }
                        ]
                    },
                {
                      text: [
                        { text: 'Invoice Date: ', style: 'contentBold' },
                        { text: `${this.debitData.head.invoice_date}`, style: 'content' }
                      ]
                },
              ]
            },
            {
              stack: [
                {
                  text: [
                    { text: 'Payments Terms: ', style: 'contentBold' },
                    { text: `${this.debitData.head.payment_term}`, style: 'content' }
                  ]
                },


              ]
            },
          ],
        }

      ]

    ]
    if (this.debitData.party.billing_address[0]) {
      invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
        {
          margin: [0, 0, 0, 0],
          text: [
            { text: `${this.debitData.party.billing_address[0]}`, style: 'content' },
          ]
        }
      )
    }
    if (this.debitData.party.billing_address[1]) {
      invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
        {
          margin: [0, 0, 0, 0],
          text: [
            { text: `${this.debitData.party.billing_address[1]}`, style: 'content' },
          ]
        }
      )
    }
    if (this.debitData.party.crn_no || this.debitData.party.tax_no) {
      let text = [];
      if (this.debitData.party.crn_no) {
        text.push({ text: 'CRN: ', style: 'contentBold' })
        text.push({ text: `${this.debitData.party.crn_no}`, style: 'content' })
      }
      if (this.debitData.party.tax_no) {
        text.push({text:this.pdfTemplate1.isTds?' TRN: ':'GSTIN: ', style: 'contentBold'})
        text.push({ text: `${this.debitData.party.tax_no}`, style: 'content' })
      }

      invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
        {
          margin: [0, 0, 0, 3],
          text: text
        }
      )
    }
    if (isValidValue(this.debitData.party.contact)) {
      let customerContactPersonAndPhoneNo=''
      if(isValidValue(this.debitData.party.contact.name) && isValidValue(this.debitData.party.contact.no)){
        customerContactPersonAndPhoneNo = `${this.debitData.party.contact.name} (${this.debitData.party.contact.no})`
      }
      if(isValidValue(this.debitData.party.contact.name) && !this.debitData.party.contact.no){
        customerContactPersonAndPhoneNo = `${this.debitData.party.contact.name}`
      }
      if(!this.debitData.party.contact.name && isValidValue(this.debitData.party.contact.no)){  
        customerContactPersonAndPhoneNo = `${this.debitData.party.contact.no}`
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
    if (this.debitData.general_config.show_shipping_address && this.debitData.party.shipping_address[0] && this.debitData.party.shipping_address[1]) {
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
            { text: `${this.debitData.party.shipping_address[0]}`, style: 'content' },
          ]
        }
      )
      invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
        {
          text: [
            { text: `${this.debitData.party.shipping_address[1]}`, style: 'content' },
          ]
        }
      )
    }
    if (this.debitData.head.reference_no) {
      invoiceDetailsandCustomerDetailsBody[0][1].columns[1].stack.push(
        {
          text: [
            { text: 'Reference No: ', style: 'contentBold' },
            { text: `${this.debitData.head.reference_no}`, style: 'content' }
          ]
        },
      )
    }
    if (this.debitData.head.reason) {
        invoiceDetailsandCustomerDetailsBody[0][1].columns[1].stack.push(
          {
            text: [
              { text: 'Reason : ', style: 'contentBold' },
              { text: `${this.debitData.head.reason}`, style: 'content' }
            ]
          },
        )
      }
    if (this.debitData.head.sp) {
      invoiceDetailsandCustomerDetailsBody[0][1].columns[1].stack.push(
        {
          text: [
            { text: 'Sales Person: ', style: 'contentBold' },
            { text: `${this.debitData.head.sp}`, style: 'content' }
          ]
        }
      )
    }
    return invoiceDetailsandCustomerDetailsBody;
  }

  getApprovers() {
    let approvers = [];
    if (this.debitData.general_config.signatory.verifed_by.display) {
      approvers.push(this.debitData.general_config.signatory.verifed_by.term)
    }
    if (this.debitData.general_config.signatory.approved_by.display) {
      approvers.push(this.debitData.general_config.signatory.approved_by.term)
    }
    if (this.debitData.general_config.signatory.prepared_by.display) {
      approvers.push(this.debitData.general_config.signatory.prepared_by.term)
    }
    if (this.debitData.general_config.signatory.received_by.display) {
      approvers.push(this.debitData.general_config.signatory.received_by.term)
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
    let totalQuantity = 0;
    this.debitData.items.rows.map((rowList) => {
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
          { text: `:  ${ this.debitData.items.rows.length+'/'+totalQuantity}`, style: 'contentBold' },
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
          { text: `:  ${this.currency_symbol} ${formatNumber(this.debitData.calculations.subtotal)}`, style: 'contentBold' },
        ]
      },
    )
    for (const [key, value] of Object.entries(this.debitData.calculations.tax)) {
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
          { text: `:  ${this.currency_symbol} ${formatNumber(this.debitData.calculations.roundoff_amount)}`, style: 'contentBold' },
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
          { text: `:  ${this.currency_symbol} ${formatNumber(this.debitData.calculations.total)}`, style: 'contentBold' },
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
              { text:`${this.debitData.calculations.total_in_word}`, style: 'contentBold' }
          ]


      }]
  ]
  return bottomBorderTable({body,widths:['100%']})
  }

  getItemTable() {
      const tableHeaderRow = this.debitData.items.columns.map(col => ({
      text: col.label,
      style: 'contentBold'
    }));
  let itemsKeys=this.debitData.items.columns.map(col => col.key);
  const itemWidths =this.getItemColumnWidths(itemsKeys) ;  
    // Data Rows
    const tableBodyRows = this.debitData.items.rows.map(rowList => {
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
    let partyName = this.debitData['party']['company_name'];
    let debitNumber = this.debitData['head']['no'];
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


