import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { TerminologiesService } from 'src/app/core/services/terminologies.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { DialogRef } from '@angular/cdk/dialog';
import { bottomBorderTable, generatePdfTemplate1, getApprovalsTable, getNarationSignature, getTermsAndConditionTableNextPage, getTermsAndConditionTableSamePage, pdfGenerateWithoutHeaderFooter, pdfTemplate1 } from 'src/app/shared-module/utilities/pdftemplate-utils';
import { addDocumentColumn, addFonts, reorderMixedText } from 'src/app/shared-module/utilities/pdfmake-uitls';
import PDFMerger from 'pdf-merger-js';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { cloneDeep } from 'lodash';
import { InvoicePdfDataService } from './invoicePdfData.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { formatNumber } from 'src/app/shared-module/pipes/numberformat.pipe';
function BlobToBase64(blob, cb) {
  let reader = new FileReader();
  reader.readAsDataURL(blob);
  reader.onloadend = function () {
    cb(reader.result)
  }
}

function base64ToBlob(base64String, contentType = '') {
  const byteCharacters = atob(base64String);
  const byteArrays = [];

  for (let i = 0; i < byteCharacters.length; i++) {
    byteArrays.push(byteCharacters.charCodeAt(i));
  }

  const byteArray = new Uint8Array(byteArrays);
  return new Blob([byteArray], { type: contentType });
}

async function generateBlobfromBlobs(blobs, pdfBlobs) {
  let merger = new PDFMerger();

  for (const temp of blobs) {
    await merger.add(temp)
  }

  for (const temp of pdfBlobs) {
    await merger.add(temp)
  }

  let mergedBlobs = new Blob([await merger.saveAsBuffer()], { type: 'application/pdf' })
  return mergedBlobs;
}

@Component({
  selector: 'app-invoice-pdf-view',
  templateUrl: './invoice-pdf-view.component.html',
  styleUrls: ['./invoice-pdf-view.component.scss']
})
export class InvoicePdfViewComponent implements OnInit {
  terminology: any;
  invoiceData: any;
  company_logo: any = '';
  currency_symbol;
  isTax: boolean = false;

  pdfSrc = "";
  pdfBlobs = [];
  isTds = false;
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
  }
  tripChallanDocumentList = [];
  isOpen = false;
  filebyteCode = new BehaviorSubject(null);
  defaultTableRow=8;





  constructor(
    private _terminologiesService: TerminologiesService,
    private currency: CurrencyService,
    private _tax: TaxService,
    private dialogRef: DialogRef<boolean>,
    private _fileDownload: FileDownLoadAandOpen,
    private _invoicePdfDataService: InvoicePdfDataService,
    private _commonLoaderService: CommonLoaderService,


  ) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    this.isTax = this._tax.getTax();
    this.isTds = this._tax.getVat();
    addFonts(pdfMake)

  }

  ngOnInit() {
    this.terminology = this._terminologiesService.terminologie;
    this.currency_symbol = this.currency.getCurrency().symbol;
    this.invoiceDetails();
    return
  }
  openDetails(): void {
    this.dialogRef.close(true)
  }




  invoiceDetails() {
    this._commonLoaderService.getShow();
    this._invoicePdfDataService.newPdfDataInvoice.subscribe((pdfData: any) => {
      this.pdfBlobs = [];
      this.company_logo = pdfData.company_logo;
      this.invoiceData = pdfData.invoiceData;
      this.tripChallanDocumentList = [];
      pdfData.tripChallanDocumentList.forEach(item => {
        if (item.ct == 'application/pdf') {
          this.pdfBlobs.push(base64ToBlob(item.image_blob, item.ct))
        } else {
          this.tripChallanDocumentList.push(item)

        }
      })
      this.buildPdf();
      this._commonLoaderService.getHide();
    })

  }
  buildPdf() {
    this.pdfTemplate1.contents = []
    this.pdfTemplate1.headerDetails.companyname = this.invoiceData.company.company_name;
    this.pdfTemplate1.headerDetails.companynameNative = reorderMixedText(this.invoiceData.company.company_native_name);
    this.pdfTemplate1.headerDetails.crnNo = this.invoiceData.company.crn_no;
    this.pdfTemplate1.headerDetails.trnNo = this.invoiceData.company.tax_no;
    this.pdfTemplate1.headerDetails.companyEmailId = this.invoiceData.company.email_address;
    this.pdfTemplate1.headerDetails.companyAddress = this.invoiceData.company.address[0] + '' + this.invoiceData.company.address[1];
    this.pdfTemplate1.headerDetails.mobileNo = this.invoiceData.company.mobile_no;
    this.pdfTemplate1.footerDetails.companyname = this.invoiceData.company.company_name;
    this.pdfTemplate1.footerDetails.companynameNative = reorderMixedText(this.invoiceData.company.company_native_name);
    this.pdfTemplate1.footerDetails.companyEmailId = this.invoiceData.company.email_address;
    this.pdfTemplate1.footerDetails.mobileNo = this.invoiceData.company.mobile_no;
    this.pdfTemplate1.headerDetails.companyLogo = this.company_logo;
    this.pdfTemplate1.headerDetails.pdfTitle = this.invoiceData.company.tax_head_in_eng;
    if (this.invoiceData.company.tax_head_in_native) {
      this.pdfTemplate1.headerDetails.pdfTitle = this.invoiceData.company.tax_head_in_eng + ` | ${reorderMixedText(this.invoiceData.company.tax_head_in_native)}`
    }
    if (this.invoiceData.general_config.disclaimer.display) {
      this.pdfTemplate1.footerDetails.systemGenerated = this.invoiceData.general_config.disclaimer.term;
    }
    if (this.invoiceData.general_config.include_branding) {
      this.pdfTemplate1.footerDetails.poweredBy = `Powered by TransportSimple.com`;
    }
    this.pdfTemplate1.isTax = this.isTax;
    this.pdfTemplate1.isTds = this.isTds;
    this.pdfTemplate1.contents.push(
      bottomBorderTable({ body: this.getinvoiceDetailsandCustomerDetailsBody(), widths: ['50%', '50%'] }),
    )
    let approvers = this.getApprovers();
    if (approvers.length==  0) {
      this.defaultTableRow+=4
    }
    this.pdfTemplate1.contents.push(this.getItemTable())
    this.pdfTemplate1.contents.push(this.getBankAndTotalsTable())
    this.pdfTemplate1.contents.push(this.getAmountInWords())
    this.pdfTemplate1.contents.push(getNarationSignature({
      narration: this.invoiceData.narration,
      signature: this.invoiceData.signature?.document,
      isNarration: true,
      isSignature: true,
      authorizedSignature: this.invoiceData.general_config.signatory.authorised_signatory.display ? this.invoiceData.general_config.signatory.authorised_signatory.term : '',
      forSignature: this.invoiceData.general_config.signatory.for_company.display ? this.invoiceData.general_config.signatory.for_company.term : '',
    }));
    if (approvers.length > 0) {
      this.pdfTemplate1.contents.push(getApprovalsTable(this.getApprovers()))
    }
    if (this.invoiceData.tnc && this.invoiceData.tnc.same_page_display && this.invoiceData.tnc.content) {
      this.pdfTemplate1.contents.push(getTermsAndConditionTableSamePage(this.invoiceData.tnc.content));
    }
    if (this.invoiceData.tnc && !this.invoiceData.tnc.same_page_display && this.invoiceData.tnc.content) {
      let termsAndConditionTable = getTermsAndConditionTableNextPage(this.invoiceData.tnc.content);
      this.pdfTemplate1.contents = this.addPageBreak([this.pdfTemplate1.contents, termsAndConditionTable])
    }
    const pdfDocGenerator = pdfMake.createPdf(generatePdfTemplate1(cloneDeep(this.pdfTemplate1)));
    pdfDocGenerator.getDataUrl((dataUrl) => {
      this.pdfSrc = dataUrl
    });
  }

  getinvoiceDetailsandCustomerDetailsBody() {
    let invoiceDetailsandCustomerDetailsBody = [
      [
        {
          stack: [
            {
              margin: [0, 0, 0, 3],
              text: [
                { text: 'Invoiced To: ', style: 'contentBold' },
              ]
            },
            {
              text: [
                { text: `${this.invoiceData.party.company_name}`, style: 'contentBold' },
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
                    { text: 'Invoice No: ', style: 'contentBold' },
                    { text: `${this.invoiceData.head.no}`, style: 'content' }
                  ]
                },
                {
                  text: [
                    { text: 'Invoice Date: ', style: 'contentBold' },
                    { text: `${this.invoiceData.head.date}`, style: 'content' }
                  ]
                },
                {
                  margin: [0, 0, 0, 0],
                  text: [
                    { text: 'Due Date: ', style: 'contentBold' },
                    { text: `${this.invoiceData.head.due_date}`, style: 'content' }
                  ]
                },
              ]
            },
            {
              stack: [
                {
                  text: [
                    { text: 'Payments Terms: ', style: 'contentBold' },
                    { text: `${this.invoiceData.head.payment_term}`, style: 'content' }
                  ]
                },


              ]
            },
          ],
        }

      ]

    ]
    if (this.invoiceData.party.billing_address[0]) {
      invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
        {
          margin: [0, 0, 0, 0],
          text: [
            { text: `${this.invoiceData.party.billing_address[0]}`, style: 'content' },
          ]
        }
      )
    }
    if (this.invoiceData.party.billing_address[1]) {
      invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
        {
          margin: [0, 0, 0, 0],
          text: [
            { text: `${this.invoiceData.party.billing_address[1]}`, style: 'content' },
          ]
        }
      )
    }
    if (this.invoiceData.party.crn_no || this.invoiceData.party.tax_no) {
      let text = [];
      if (this.invoiceData.party.crn_no) {
        text.push({ text: 'CRN: ', style: 'contentBold' })
        text.push({ text: `${this.invoiceData.party.crn_no}`, style: 'content' })
      }
      if (this.invoiceData.party.tax_no) {
        text.push({ text: ((this.invoiceData.party.crn_no && this.invoiceData.party.tax_no) ? ' | ' : '') + (this.pdfTemplate1.isTds ? ' TRN: ' : 'GSTIN: '), style: 'contentBold' })
        text.push({ text: `${this.invoiceData.party.tax_no}`, style: 'content' })
      }

      invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
        {
          margin: [0, 0, 0, 0],
          text: text
        }
      )
    }
    if (this.invoiceData.party.contact_name || this.invoiceData.party.contact_no) {
      let customerContactPersonAndPhoneNo = ''
      if (this.invoiceData.party.contact_name && this.invoiceData.party.contact_no) {
        customerContactPersonAndPhoneNo = `${this.invoiceData.party.contact_name} (${this.invoiceData.party.contact_no})`
      }
      if (this.invoiceData.party.contact_name && !this.invoiceData.party.contact_no) {
        customerContactPersonAndPhoneNo = `${this.invoiceData.party.contact_name}`
      }
      if (!this.invoiceData.party.contact_name && this.invoiceData.party.contact_no) {
        customerContactPersonAndPhoneNo = `${this.invoiceData.party.contact_no}`
      }
      customerContactPersonAndPhoneNo = `${this.invoiceData.party.contact_name} (${this.invoiceData.party.contact_no})`
      invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
        {
          margin: [0, 0, 0, 0],
          text: [
            { text: `Contact Person: ${customerContactPersonAndPhoneNo} `, style: 'contentBold' },
          ]
        }
      )
    }
    if (this.invoiceData.general_config.show_shipping_address && this.invoiceData.party.shipping_address[0] && this.invoiceData.party.shipping_address[1]) {
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
            { text: `${this.invoiceData.party.shipping_address[0]}`, style: 'content' },
          ]
        }
      )
      invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
        {
          text: [
            { text: `${this.invoiceData.party.shipping_address[1]}`, style: 'content' },
          ]
        }
      )
    }
    if (this.invoiceData.head.reference_no) {
      invoiceDetailsandCustomerDetailsBody[0][1].columns[1].stack.push(
        {
          text: [
            { text: 'Reference No: ', style: 'contentBold' },
            { text: `${this.invoiceData.head.reference_no}`, style: 'content' }
          ]
        },
      )
    }
    if (this.invoiceData.head.sp) {
      invoiceDetailsandCustomerDetailsBody[0][1].columns[1].stack.push(
        {
          text: [
            { text: 'Sales Person: ', style: 'contentBold' },
            { text: `${this.invoiceData.head.sp}`, style: 'content' }
          ]
        }
      )
    }
    this.invoiceData.extra.forEach(customField => {
      if (customField.value) {
        invoiceDetailsandCustomerDetailsBody[0][1].columns[0].stack.push(
          {
            text: [
              { text: `${customField.label}: `, style: 'contentBold' },
              { text: `${customField.value}`, style: 'content' }
            ]
          },
        )

      }

    });
    return invoiceDetailsandCustomerDetailsBody;
  }

  getApprovers() {
    let approvers = [];
    if (this.invoiceData.general_config.signatory.prepared_by.display) {
      approvers.push(this.invoiceData.general_config.signatory.prepared_by.term)
    }
    if (this.invoiceData.general_config.signatory.verifed_by.display) {
      approvers.push(this.invoiceData.general_config.signatory.verifed_by.term)
    }
    if (this.invoiceData.general_config.signatory.approved_by.display) {
      approvers.push(this.invoiceData.general_config.signatory.approved_by.term)
    }
    if (this.invoiceData.general_config.signatory.received_by.display) {
      approvers.push(this.invoiceData.general_config.signatory.received_by.term)
    }
    return approvers;

  }

  getBankAndTotalsTable() {
    let bankBody = [
      [
        {
          columns: [
            {
              width: 70,
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
    if (this.invoiceData.bank) {
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
            { text: `:  ${this.invoiceData.bank.bank_name}`, style: 'contentBold' },
          ]
        }
      )
      if (this.invoiceData.bank) {
        if (this.invoiceData.bank.account_number) {
          bankBody[0][0].columns[0].stack.push(
            {
              text: [
                { text: 'Account #', style: 'content' },
              ]
            }
          )
          bankBody[0][0].columns[1].stack.push(
            {
              text: [
                { text: `:  ${this.invoiceData.bank.account_number}`, style: 'contentBold' },
              ]
            }
          )
        }
        if (this.invoiceData.bank.iban_code) {
          bankBody[0][0].columns[0].stack.push(
            {
              text: [
                { text: 'IBAN No', style: 'content' },
              ]
            }
          )
          bankBody[0][0].columns[1].stack.push(
            {
              text: [
                { text: `:  ${this.invoiceData.bank.iban_code}`, style: 'contentBold' },
              ]
            }
          )
        }
        if (this.invoiceData.bank.swift_code) {
          bankBody[0][0].columns[0].stack.push(
            {
              text: [
                { text: 'SWIFT Code', style: 'content' },
              ]
            }
          )
          bankBody[0][0].columns[1].stack.push(
            {
              text: [
                { text: `:  ${this.invoiceData.bank.swift_code}`, style: 'contentBold' },
              ]
            }
          )
        }
        if (this.invoiceData.bank.ifsc_code) {
          bankBody[0][0].columns[0].stack.push(
            {
              text: [
                { text: 'IFSC Code', style: 'content' },
              ]
            }
          )
          bankBody[0][0].columns[1].stack.push(
            {
              text: [
                { text: `:  ${this.invoiceData.bank.ifsc_code}`, style: 'contentBold' },
              ]
            }
          )
        }
      }
    }



    bankBody[0][1].columns[1].stack.push(
      { alignment:'right',
        text: [
          { text: `Sub  Total :`, style: 'contentBold' },
        ]
      },
    )
    bankBody[0][1].columns[2].stack.push(
      {  
        alignment:'right',
        text: [
          { text: ` ${this.currency_symbol} ${formatNumber(Number(this.invoiceData.calculations.subtotal))}`, style: 'contentBold' , },
        ]
      },
    )
    for (const [key, value] of Object.entries(this.invoiceData.calculations.tax)) {
      bankBody[0][1].columns[1].stack.push(
        { alignment:'right',
          text: [
            { text: `${key} :`, style: 'contentBold' },
          ]
        },
      )
      bankBody[0][1].columns[2].stack.push(
        { alignment:'right',
          text: [
            { text: ` ${this.currency_symbol} ${formatNumber(Number(value))}`, style: 'contentBold' },
          ]
        },
      )
    }
    bankBody[0][1].columns[1].stack.push(
      { alignment:'right',
        text: [
          { text: `Round off : `, style: 'contentBold' },
        ]
      },
    )
    bankBody[0][1].columns[2].stack.push(
      {  alignment:'right',
        text: [
          { text: ` ${this.currency_symbol} ${formatNumber(Number(this.invoiceData.calculations.roundoff_amount))}`, style: 'contentBold' },
        ]
      },
    )
    bankBody[0][1].columns[1].stack.push(
      {  alignment:'right',
        text: [
          { text: `Total :`, style: 'contentBold' },
        ]
      },
    )
    bankBody[0][1].columns[2].stack.push(
      { alignment:'right',
        text: [
          { text: ` ${this.currency_symbol} ${formatNumber(Number(this.invoiceData.calculations.total))}`, style: 'contentBold' },
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
          { text: `${this.invoiceData.calculations.total_in_word}`, style: 'contentBold' }
        ]


      }]
    ]
    return bottomBorderTable({ body, widths: ['100%'] })
  }

  getItemTable() {
    const tableHeaderRow = this.invoiceData.items.columns.map(col => ({
      text: col.label,
      style: 'contentBold'
    }));
    let itemsKeys = this.invoiceData.items.columns.map(col => col.key);
    const itemWidths = this.getItemColumnWidths(itemsKeys);
    // Data Rows
    let tableBodyRows = this.invoiceData.items.rows.map(rowList => {
      const rowCells = rowList.map(cell => {
        if (cell.description.length > 0) {
          const descriptionText = [];

          descriptionText.push({ text: '(', style: 'itemcontent' });
          cell.description.forEach(desc => {
            descriptionText.push({ text: `${desc.label}: `, style: 'itemcontentBold' });
            descriptionText.push({ text: `${desc.value} `, style: 'itemcontent' });
          });
          descriptionText.push({ text: ')', style: 'itemcontent' });

          return {
            stack: [
              { text: cell.value, style: cell.key == 'item' ? 'contentBold' : 'content' },
              { text: descriptionText }
            ]
          };
        } else {
          if(['unit','rate','qty','amount','tax_amount','net'].includes(cell.key)){
            if(['rate','amount','net'].includes(cell.key)){
              return {
                stack: [
                  { text:  formatNumber(Number(cell.value)), style: cell.key == 'item' ? 'contentBold' : 'content',alignment:'right' }
                ]
              };
            }else{
              return {
                stack: [
                  { text:  cell.value, style: cell.key == 'item' ? 'contentBold' : 'content',alignment:'right' }
                ]
              };
            }
          }else{
            return {
              stack: [
                { text: cell.value, style: cell.key == 'item' ? 'contentBold' : 'content' }
              ] 
            };
          }
         
        }
      });
      

      return rowCells;
    });
    const remaining = this.defaultTableRow - this.invoiceData.items.rows.length;
      for (let i = 0; i < remaining; i++) {
        let col = Array(this.invoiceData.items.columns.length).fill(' ')
        tableBodyRows.push(col);
      }
 
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

  generateInvoiceTripDocumentPDF() {
    let documentList = [];
    this.tripChallanDocumentList.forEach((doc, index) => {
      let image = {
        margin: 2,
        columns: []
      }
      image.columns.push({
        table: {
          widths: ["100%"],
          body: [[addDocumentColumn(doc.image_blob)]]
        },
        layout: {
          border: [false, false, false, true]
        }
      })
      documentList.push(image)
    });

    if (documentList.length > 0) {
      return pdfMake.createPdf(pdfGenerateWithoutHeaderFooter(documentList))
    }
  }

  downloadAttachements() {
    let filenameA = 'All Attachemnts' + "_" + this.generateFileName() + ".pdf";
    const pdfDocGenerator2 = this.generateInvoiceTripDocumentPDF();
    console.log(pdfDocGenerator2, this.pdfBlobs)
    if (pdfDocGenerator2) {
      pdfDocGenerator2.getBlob(blob2 => {
        generateBlobfromBlobs([blob2], this.pdfBlobs).then(res => {
          this._fileDownload.writeAndOpenFile(res, filenameA).then(data => { });
        });
      })
    } else {
      generateBlobfromBlobs([], this.pdfBlobs).then(res => {
        this._fileDownload.writeAndOpenFile(res, filenameA).then(data => { });
      });
    }
  }
  generateFileName() {
    let partyName = this.invoiceData['party']['company_name'];
    let invoiceNumber = this.invoiceData['head']['no'];
    return `${partyName}_${invoiceNumber}`;
  }

  downLoadInvoiceOnly() {
    let filename = 'invoice_' + this.generateFileName() + ".pdf";
    const pdfDocGenerator = pdfMake.createPdf(generatePdfTemplate1(cloneDeep(this.pdfTemplate1)));
    pdfDocGenerator.getBlob((blob) => {
      this._fileDownload.writeAndOpenFile(blob, filename).then(data => {
      });
    });
  }

  downloadAttachmentsAndInvoice() {
    let filenameA = 'Invoice and All Attachemnts' + "_" + this.generateFileName() + ".pdf";
    const pdfDocGenerator2 = this.generateInvoiceTripDocumentPDF();
    const pdfDocGenerator = pdfMake.createPdf(generatePdfTemplate1(cloneDeep(this.pdfTemplate1)));
    pdfDocGenerator.getBlob((blob) => {
      if (pdfDocGenerator2) {
        pdfDocGenerator2.getBlob(blob2 => {
          generateBlobfromBlobs([blob, blob2], this.pdfBlobs).then(res => {
            this._fileDownload.writeAndOpenFile(res, filenameA).then(data => {
            });
          });
        })
      } else {
        generateBlobfromBlobs([blob], this.pdfBlobs).then(res => {
          this._fileDownload.writeAndOpenFile(res, filenameA).then(data => {
          });
        });
      }
    });
  }

  createEmailPdf(type) {
    let partyCompanyName = this.invoiceData['party']['company_name']
    let invoiceNumber = this.invoiceData['head']['no'];
    let senderCompany = this.invoiceData.company.company_name;
    let debitAmount = this.invoiceData.calculations.total;
    let subject = senderCompany + "| Invoice Number : " + invoiceNumber
    let userName = localStorage.getItem('TS_USER_NAME')

    let dataFormat = {
      base64Code: "",
      email: this.invoiceData['party']['email'],
      content: "\nHi " + partyCompanyName + " ,\n\n I hope you're well! Please see attached invoice number " + invoiceNumber + " with a invoice amount of " + this.currency_symbol + " " + debitAmount + ". Don't hesitate to reach out if you have any questions.\n\nKind regards,\n\n" + userName + "\n\n" + senderCompany,
      fileName: 'invoice' + "_" + this.generateFileName(),
      subject: subject, isOpen: true
    }


    let dataFormatAttachments = {
      base64Code: "",
      email: this.invoiceData['party']['email'],
      content: "\nHi " + partyCompanyName + " ,\n\n I hope you're well! Please see documents attached to the invoice  number " + invoiceNumber + " with a invoice amount of " + this.currency_symbol + " " + debitAmount + ". Don't hesitate to reach out if you have any questions.\n\nKind regards,\n\n" + userName + "\n\n" + senderCompany,
      fileName: 'All Attachemnts' + "_" + this.generateFileName(),
      subject: subject, isOpen: true
    }

    let allDatadataFormatAttachments = {
      base64Code: "",
      email: this.invoiceData['party']['email'],
      content: "\nHi " + partyCompanyName + " ,\n\n I hope you're well! Please see documents attached to the invoice  number " + invoiceNumber + " with a invoice amount of " + this.currency_symbol + " " + debitAmount + ". Don't hesitate to reach out if you have any questions.\n\nKind regards,\n\n" + userName + "\n\n" + senderCompany,
      fileName: 'Invoice and All Attachemnts' + "_" + this.generateFileName(),
      subject: subject, isOpen: true
    }


    if (type == 'invoice') {
      setTimeout(() => {
        pdfMake.createPdf(generatePdfTemplate1(cloneDeep(this.pdfTemplate1))).getBase64(data => {
          dataFormat.base64Code = data
          this.filebyteCode.next(dataFormat);
          this.isOpen = true;
        })
      }, 100);
    }

    if (type == 'attachments') {
      setTimeout(() => {
        const pdfDocGenerator = this.generateInvoiceTripDocumentPDF();
        if (pdfDocGenerator) {
          pdfDocGenerator.getBlob(blob2 => {
            generateBlobfromBlobs([blob2], this.pdfBlobs).then(res => {
              BlobToBase64(res, cb => {
                dataFormatAttachments.base64Code = cb.split(',')[1];
                this.filebyteCode.next(dataFormatAttachments);
                this.isOpen = true;
              })
            });
          })
        } else {
          generateBlobfromBlobs([], this.pdfBlobs).then(res => {
            BlobToBase64(res, cb => {
              dataFormatAttachments.base64Code = cb.split(',')[1];
              this.filebyteCode.next(dataFormatAttachments);
              this.isOpen = true;
            })
          });
        }
      }, 100);
    }

    if (type == 'all') {
      setTimeout(() => {
        const pdfDocGenerator2 = this.generateInvoiceTripDocumentPDF();
        const pdfDocGenerator = pdfMake.createPdf(generatePdfTemplate1(cloneDeep(this.pdfTemplate1)));
        pdfDocGenerator.getBlob((blob) => {
          if (pdfDocGenerator2) {
            pdfDocGenerator2.getBlob(blob2 => {
              generateBlobfromBlobs([blob, blob2], this.pdfBlobs).then(res => {
                BlobToBase64(res, cb => {
                  allDatadataFormatAttachments.base64Code = cb.split(',')[1];
                  this.filebyteCode.next(allDatadataFormatAttachments);
                  this.isOpen = true;
                })
              });
            })
          } else {
            generateBlobfromBlobs([blob], this.pdfBlobs).then(res => {
              BlobToBase64(res, cb => {
                allDatadataFormatAttachments.base64Code = cb.split(',')[1];
                this.filebyteCode.next(allDatadataFormatAttachments);
                this.isOpen = true;
              })
            });
          }
        });
      }, 100);
    }

  }
  closeDialog(e) {
    if (e) {
      this.isOpen = false;
    }
  }

  getItemColumnWidths(columns: []): string[] {
    const fixedWidths: Record<string, number> = {
      "serial_no": 3,
      "item": 30,
      "unit": 7,
      "rate": 7,
      "qty": 7,
    };

    const totalFixed = columns.reduce((sum, key) => sum + (fixedWidths[key] || 0), 0);
    const remainingColumns = columns.filter(key => !(key in fixedWidths));
    const remainingWidth = (100 - totalFixed) / remainingColumns.length;

    return columns.map(key =>
      (fixedWidths[key] ?? remainingWidth).toFixed(2) + "%"
    );
  }
}


