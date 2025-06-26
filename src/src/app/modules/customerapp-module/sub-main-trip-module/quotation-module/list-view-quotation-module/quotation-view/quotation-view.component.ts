import { Component, Input, OnInit} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TripConstants } from '../../../new-trip-module/constant';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { QuotationService } from '../../../../api-services/trip-module-services/quotation-service/quotation-service';
import { checkEmpty} from 'src/app/shared-module/utilities/helper-utils';
import { TaxService } from 'src/app/core/services/tax.service';
import { CommonService } from 'src/app/core/services/common.service';
import htmlToPdfmake from 'html-to-pdfmake';
import { addImageColumn, addressToText, pdfGenerate } from 'src/app/shared-module/utilities/pdfmake-uitls';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { Permission } from 'src/app/core/constants/permissionConstants';

@Component({
  selector: 'app-quotation-view',
  templateUrl: './quotation-view.component.html',
  styleUrls: ['./quotation-view.component.scss']
})
export class QuotationViewComponent implements OnInit {
  currency_type;
  @Input() 'quotationId': BehaviorSubject<String>;
  allData:any;
  tripStatus: any = new TripConstants().vehicleTripStatus;
  preFixUrl=''
  @Input() defaultDownload: boolean = false;
  billingTypes = new TripConstants().billingTypes;
  isTax: boolean = false;
  company_logo: any = '';
  pdfSrc = "";
  tac: any = {content: "", samePage: false, show: false}
  signature: any = {url: "", name: false, designation: false, show: false, blob: null}
  isOpen = false;
  showEmailOptions: boolean = false;
  companyHeaderDetails:any;
  footerDetails:any;
  filebyteCode = new BehaviorSubject(null);
  isTDS=false;
  quotation =Permission.quotations.toString().split(',');
  isPlaceOfSupply: boolean = false;
  commentData={
    key:'quotation',
    object_id:''
  }
  isGotComment:boolean=false;
  constructor(
    private currency: CurrencyService,
    private _quotationService: QuotationService,
    private ngxService: NgxUiLoaderService,
    private _preFixUrl: PrefixUrlService,
    private _tax: TaxService,
    private _commonService: CommonService,
    private _fileDownload:FileDownLoadAandOpen,
    ) {
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
      this.isTax = this._tax.getTax();
      this.isTDS =this._tax.getVat();
      this.isPlaceOfSupply = this._tax.isPlaceOfSupply();
     }

  ngOnInit() {
    this.preFixUrl = this._preFixUrl.getprefixUrl();
    this.currency_type = this.currency.getCurrency();

    this._commonService.fetchCompanyLogo().subscribe((response: any) => {
      this.company_logo = response.result.image_blob;
    }, (err) => { this.company_logo = null; });

    this.quotationId.subscribe((id:any) => {
      this.isGotComment=false;
      this.commentData.object_id= id;
      this.getViewDetails(id)
    });

  }

  processPdf(data, print: Boolean = false) {
    this.ngxService.start();
    let fileName = 'Quotation_'
    if (print) {
        pdfMake.createPdf(this.generatePDF(data)).print({}, window.frames['printPdf']);
    } else {
        this.createPdfDownload(data, fileName)
    }
    setTimeout(() => {
      this.ngxService.stop();
    }, 500);
  }

  createPdfDownload(data, file_Name) {
    setTimeout(() => {
      let fileName =`${file_Name}_${this.generateFileName()}`+".pdf"
      const pdfDocGenerator = pdfMake.createPdf(this.generatePDF(data));
      pdfDocGenerator.getBlob((blob) => {
      this._fileDownload.writeAndOpenFile(blob, fileName).then(data => {
      });
});
    }, 500);
  }

  getViewDetails(id){
    this._quotationService.getQuotationPrintView(id).subscribe((response)=>{
      this.allData = response.result;
      this.isGotComment=this.allData.customer.has_portal_access;;
      this.tac.show = false;
      this.tac.content = "";
      this.tac.samePage = false

      this.signature.show = false;
      this.signature.blob = null;
      this.signature.name = "";
      this.signature.designation = "";

      if(this.allData.tac.content) {
        this.tac.show = true;
        this.tac.content = htmlToPdfmake(this.allData.tac.content);
        this.tac.samePage = this.allData.tac.same_page
      }

      if(this.allData.signature && this.allData.signature.document) {
        this.signature.show = true;
        this.signature.blob = this.allData.signature.document;
        this.signature.name = this.allData.signature.name;
        this.signature.designation = this.allData.signature.designation;
      }


      if (this.defaultDownload) {
        setTimeout(() => { this.downloadPdf(this.allData, false); }, 1500);
      }

      setTimeout(() => {
        const pdf = this.pdfGenerateView(this.allData)
        const pdfDocGenerator = pdfMake.createPdf(pdf);
        pdfDocGenerator.getDataUrl((dataUrl) => {
          this.pdfSrc = dataUrl
        });
      }, 1500);
    })
  }

  generateFileName() {
    let partyName = this.allData['customer']['company_name'];
    let bosNumber = this.allData['quotation_no'];
    return `${partyName}_${bosNumber}`;
  }

  downloadPdf(data, print: boolean = false) {
    this.processPdf(data, print);
  }

  getTripStatus(id){
    if(id){
      for (const key in  this.tripStatus) {
        if (Object.prototype.hasOwnProperty.call( this.tripStatus, key)) {
          if( this.tripStatus[key].id ==id){
            return this.tripStatus[key].label
          }
        }
      }
    }

  }

  createFreights(freights) {
    let GSTTYPE='IGST';
      if(this.isTDS){
        GSTTYPE='VAT'
      }
    const data = freights['freight_meta']

    const billingType = freights['billing_type'] ? freights['billing_type']['label'] : ""
    const billingIndex = freights['billing_type'] ? freights['billing_type']['index'] : -1

    let sectionData = [];
    let borderAdd = [];
    let totalColumns = 0
    sectionData.push([{ text: "From", bold: true, border: [true, true, false, true] },
    { text: "To", bold: true, border: [false, true, false, true] },
    { text: "Total", bold: true, border: [false, true, true, true] }])

    if (billingIndex != 10) {
      if (this.isTax) {
        if (!this.allData.tax_detail.is_intrastate) {
          sectionData[0].splice(2, 0, { text: GSTTYPE, bold: true, border: [false, true, false, true] })
          }
          else {
            sectionData[0].splice(2, 0, { text: 'CGST', bold: true, border: [false, true, false, true] })
            sectionData[0].splice(2, 0, { text: 'SGST', bold: true, border: [false, true, false, true] })
          }
        }
        sectionData[0].splice(2, 0, { text: 'Amount', bold: true, border: [false, true, false, true] })
        sectionData[0].splice(2, 0, { text: 'Unit', bold: true, border: [false, true, false, true] })
        sectionData[0].splice(2, 0, { text: 'Unit Cost', bold: true, border: [false, true, false, true] })
    }

    totalColumns = sectionData[0].length
    let innerRow = []
    for (let i=0; i<totalColumns; i++) {innerRow.push("")}
    innerRow[0] = { text: `Freight Type: ${billingType}`, bold: true, border: [false, false, false, true],
                    colSpan: totalColumns, alignment: 'left' }
    sectionData.splice(0, 0, innerRow)

    for (let i = 0; i < data.length; i++) {
      let tripData = data[i]
      let innerRow: any = [{ text: tripData['from_loc'], border: [true, false, false, true] },
      { text: tripData['to_loc'], border: [false, false, false, true] },
      { text: tripData['total_amount'], border: [false, true, true, true] }]

      if (billingIndex != 10) {
        if (this.isTax) {
          if (!this.allData.tax_detail.is_intrastate) {

            const igst = {text: [checkEmpty(data[i], ['tax_description', 'IGST'], true) + '%', '\n',
                { text: '' + checkEmpty(data[i], ['tax_description', 'IGST_amount'], true) }],
                border: [false, true, false, true]
            }
            innerRow.splice(2, 0, igst)
            }
            else {
              const cgst = {
                text:
                  [{ text: checkEmpty(data[i], ['tax_description', 'CGST'], true) + '%' }, '\n',
                  { text: '' + checkEmpty(data[i], ['tax_description', 'CGST_amount'], true) }],
                  border: [false, true, false, true]
              }
              innerRow.splice(2, 0, cgst)
              const sgst = {
                text:
                  [{ text: checkEmpty(data[i], ['tax_description', 'SGST'], true) + '%' }, '\n',
                  { text: '' + checkEmpty(data[i], ['tax_description', 'SGST_amount'], true) }],
                  border: [false, true, false, true]
              }
              innerRow.splice(2, 0, sgst)
            }
          }
          innerRow.splice(2, 0, { text: tripData.freight_amount_before_tax, border: [false, true, false, true] })
          innerRow.splice(2, 0, { text: tripData.quantity, border: [false, true, false, true] })
          innerRow.splice(2, 0, { text: tripData.unit_cost, border: [false, true, false, true] })
      }
      sectionData.push(innerRow)

      innerRow = []
      if (tripData.description.length > 0) {
        for (let i=0; i<totalColumns;i++) innerRow.push("")
        innerRow[0] = {text: tripData.description, border: [true, true, true, true],
                       colSpan: totalColumns, alignment: 'left'}
        sectionData.push(innerRow)
        borderAdd.push(sectionData.length-1)
      }
    }

    const widthString = (100 / sectionData[0].length).toFixed(3);
    const itemChallanWidths = Array(sectionData[0].length).fill(widthString + "%");
    return [sectionData, borderAdd, itemChallanWidths]
  }

  createOthers(data) {
    let sectionData = [];
    let borderAdd = [];
    let totalColumns = 0
    sectionData.push([{ text: "Item", bold: true, border: [true, true, false, true] },
    { text: "Unit Cost", bold: true, border: [false, true, false, true] },
    { text: "Unit", bold: true, border: [false, true, false, true] },
    { text: "Total", bold: true, border: [false, true, true, true] }])

      if (this.isTax) {
        let GSTTYPE='IGST';
        if(this.isTDS){
          GSTTYPE='VAT'
        }
        if (!this.allData.tax_detail.is_intrastate) {
          sectionData[0].splice(3, 0, { text: GSTTYPE, bold: true, border: [false, true, false, true] })
          }
          else {
            sectionData[0].splice(3, 0, { text: 'CGST', bold: true, border: [false, true, false, true] })
            sectionData[0].splice(3, 0, { text: 'SGST', bold: true, border: [false, true, false, true] })
          }
        }
        sectionData[0].splice(3, 0, { text: 'Amount', border: [false, true, false, true] })

    totalColumns = sectionData[0].length

    for (let i = 0; i < data.length; i++) {
      let tripData = data[i]
      let innerRow: any = [{ text: tripData['item'], border: [true, false, false, true] },
      { text: tripData['unit_cost'], border: [false, false, false, true] },
      { text: tripData['quantity'], border: [false, false, false, true] },
      { text: tripData['total_amount'], border: [false, true, true, true] }]

        if (this.isTax) {
          if (!this.allData.tax_detail.is_intrastate) {

            const igst = {text: [checkEmpty(data[i], ['tax_description', 'IGST'], true) + '%', '\n',
                { text: '' + checkEmpty(data[i], ['tax_description', 'IGST_amount'], true) }],
                border: [false, true, false, true]
            }
            innerRow.splice(3, 0, igst)
            }
            else {
              const cgst = {
                text:
                  [{ text: checkEmpty(data[i], ['tax_description', 'CGST'], true) + '%' }, '\n',
                  { text: '' + checkEmpty(data[i], ['tax_description', 'CGST_amount'], true) }],
                  border: [false, true, false, true]
              }
              innerRow.splice(3, 0, cgst)
              const sgst = {
                text:
                  [{ text: checkEmpty(data[i], ['tax_description', 'SGST'], true) + '%' }, '\n',
                  { text: '' + checkEmpty(data[i], ['tax_description', 'SGST_amount'], true) }],
                  border: [false, true, false, true]
              }
              innerRow.splice(3, 0, sgst)
            }
          }

          innerRow.splice(3, 0, { text: tripData.other_amount_before_tax, bold: true, border: [false, true, false, true] })

      sectionData.push(innerRow)

      innerRow = []
      if (tripData.description.length > 0) {
        for (let i=0; i<totalColumns;i++) innerRow.push("")
        innerRow[0] = {text: tripData.description, border: [true, true, true, true],
                       colSpan: totalColumns, alignment: 'left'}
        sectionData.push(innerRow)
        borderAdd.push(sectionData.length-1)
      }
    }

    const widthString = (100 / sectionData[0].length).toFixed(3);
    const itemChallanWidths = Array(sectionData[0].length).fill(widthString + "%");
    return [sectionData, borderAdd, itemChallanWidths]
  }

  generatePDF(data) {
    const content1 = this.pdfDataGeneration(data)
    if (this.tac.show && !this.tac.samePage) {
      const content2 = [{fontSize: 9, stack: [{text: "Terms And Conditions:\n"}, {stack: this.tac.content}], margin: [20, 20, 20, 20]}]
      return this.pdfPageCreation([content1, content2])
    }
    return this.pdfPageCreation([content1])
  }

  pdfGenerateView(data) {
    return this.generatePDF(data)
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
    var dd = pdfGenerate(pdfContent,this.companyHeaderDetails,this.footerDetails)
    return dd
  }

  addSignature(){
    return {   absolutePosition: {x: 430, y: 700},
    stack:[{image: 'data:image/png;base64,' + this.signature.blob, width: 150},
            {text: `Authorized Signature\n${this.signature.name}\n${this.signature.designation}\n`,
            alignment: "center", fontSize: 9}]}
  }

  addCal(cals) {
    let tempArr = []
    for (let i = 0; i < cals.length; i++) {
      tempArr.push([{ text: cals[i][0], alignment: "right", bold: cals[i][2] },
      { text: cals[i][1], alignment: "right", bold: cals[i][2] }])

    }
    return tempArr
  }

  addCalculations(data) {
    const arr = []

    if (data['subtotal_freight'] > 0) {
      arr.push(["Subtotal Trips:",
        `${this.currency_type.symbol} ${data['subtotal_freight']}`, false])
    }
    if (data['subtotal_others'] > 0) {
      arr.push(["Subtotal Others:",
        `${this.currency_type.symbol} ${data['subtotal_others']}`, false])
    }

    arr.push(["Sub Total:", `${this.currency_type.symbol} ${data['total_subtotal']}`, true])
    arr.push(["Discount:", `${this.currency_type.symbol} ${data['discount_amount']}`, false])
    if (this.isTax) {
      arr.push(["Tax Amount: ", `${this.currency_type.symbol} ${data.tax_detail.tax.total_amount}`, true])
      arr.push(["Discount After Tax:", `${this.currency_type.symbol} ${data['discount_amount_after_tax']}`, false])
    }

    arr.push(["Round Off:", `${this.currency_type.symbol} ${data['roundoff_amount']}`, false])
    arr.push(["Total Amount:", `${this.currency_type.symbol} ${data['total_amount']}`, true])
    return arr
  }

  pdfDataGeneration(data) {
    let freights = []
    const companyName = data['company']['company_name']
    const companyAddress = addressToText(data.company.address.filter((ele) => ele.address_type_index == 0)[data.company.address.length ? data.company.address.length / 2 - 1 : 0], 1, -1)
    const companyMobileMail = `Mobile No: ${data['company']['primary_mobile_number']} | Mail: ${data['company']['email_address']}`
    const companyGstPan =this.isTDS?'TRN :'+` ${data['company']['gstin']}`:'GSTIN | PAN :'+ ` ${data['company']['gstin']} | ${data['company']['pan']}`
    const companyLogo = addImageColumn(this.company_logo);
    const quotationNo = data['quotation_no']
    const quotationDate = data['quote_date']
    const validityTerm = data['validity_term']
    const validityDate = checkEmpty(data, ['validity_date'])
    const customer = data['customer']['company_name']
    const customerGstin=data['customer']['tax_details']['gstin_view']? data['customer']['tax_details']['gstin_view']:'-'
    const customerPOS = data['place_of_supply']
    const reverseMechanism = data['is_transaction_under_reverse'] ? 'Yes' : 'No'
    const isTaxExclusive = data['is_transaction_includes_tax'] ? 'Yes' : 'No'
    data['freights'].forEach((item)=>{ item.freight_meta.length > 0 ? freights.push(this.createFreights(item)) : ""})
    const others = this.createOthers(data['others'])
    this.footerDetails={
      companyName:companyName,
      contactEmail:data['company']['email_address'],
      contactNumber:data['company']['primary_mobile_number']

    }
    const customerBillingAdd = addressToText(data.customer.address.filter((ele) => ele.address_type_index == 0)[0], 1, -1)
    const customerShippingAdd = addressToText(data.customer.address.filter((ele) => ele.address_type_index == 1)[0], 1, -1)
    const arr = this.addCalculations(data);
    const calculationArr = this.addCal(arr);
    const narration = data['narration'];
    const payTerm = data['payment_term'];
    const accountNo = checkEmpty(data, ['bank_account', 'account_number'])
    const accountHolder = checkEmpty(data, ['bank_account', 'account_holder_name'])
    const ifscCode = checkEmpty(data, ['bank_account', 'ifsc_code']);
    const swiftCode =  checkEmpty(data, ['bank_account', 'swift_code']);
    const ibanCode = checkEmpty(data, ['bank_account', 'iban_code']);
    this.companyHeaderDetails={
      companyLogo:companyLogo,
      companyName:companyName,
      companyAddress:companyAddress,
      companyMobileMail:companyMobileMail,
      companyGstPan:companyGstPan

    }
    if (!this.isTax) {
      this.companyHeaderDetails.companyGstPan='';
    }

    let quotationDetails: any = [[{alignment: 'left', text: `Quote No: ${quotationNo}`, margin: [0, 0, 0, 2]},
    {alignment: 'left', text: `Quote Date: ${quotationDate}`, margin: [0, 0, 0, 2]},
    {alignment: 'left', text: `Validity: ${validityTerm}`, margin: [0, 0, 0, 2]},
    {alignment: 'left', text: `Validity Date: ${validityDate}`, margin: [0, 0, 0, 2]}]]

    if (this.isTax) {
      quotationDetails.push([{alignment: 'left', text: `Reverse Charge: ${reverseMechanism}`, margin: [0, 0, 0, 2]},
                             {alignment: 'left', text: `Rate Inclusive Of Tax: ${isTaxExclusive}`, margin: [0, 0, 0, 2]},"",""])
    }

    const quotationHeading: any = {
      margin: [0, 0, 0, 0],
      width: "*",
      fontSize: 9,
      table: {
        widths: ["100%"],
        height:10,
        body: [
          [{text: `Quotation`,bold:true,alignment:"center",fontsize:10}],
          ]
      },
      layout: {
        paddingTop: function (i, node) { return 5 },
        paddingBottom: function (i, node) { return 5 },
        vLineWidth: function (i, node) {
          if (i === 0 || i === node.table.widths.length) return 1
          return 0},
        hLineWidth: function (i, node) {
          if (i === 0 || i === node.table.body.length) return 1
          return 0 },
      }
    }

    const quotationSection = {
      margin: [0, 0, 0, 0],
      width: "*",
      headerRows: 1,
      fontSize: 9,
      alignment: 'center',
      table: {
        widths: ["25%", "25%", "25%", "25%"],
        body: quotationDetails
      },
      layout: {
        vLineWidth: function (i, node) {
          if (i === 0 || i === node.table.widths.length) return 1
          return 0},
        hLineWidth: function (i, node) {
          if ( i === node.table.body.length) return 1
          return 0 },
      }
    }

    const customerSection: any = {
      margin: [0, 5, 0, 0],
      width: "*",
      fontSize: 9,
      table: {
        widths: ["33.33%", "33.33%","33.33%"],
        height:10,
        body: [
          [{text: `Customer: ${customer}`, alignment: 'left'},
          {text: ``, alignment: 'left'},
          {text: ``, alignment: 'left'}],
          ]
      },
      layout: {
        paddingTop: function (i, node) { return 5 },
        paddingBottom: function (i, node) { return 5 },
        vLineWidth: function (i, node) {
          if (i === 0 || i === node.table.widths.length) return 1
          return 0},
        hLineWidth: function (i, node) {
          if (i === 0 || i === node.table.body.length) return 1
          return 0 },
      }
    }
    const customerBillingShippingAddress:any={
      margin: [0, 0, 0, 0],
      width: "*",
      fontSize: 9,
      table: {
        widths: ["50%", "50%"],
        body: [
          [
            { text: `Billing Address: \n${customerBillingAdd}`, bold: false,
              margin: [5, 5, 5, 5], border: [true, true, true, true] },

            { text: `Shipping Address: \n${customerShippingAdd}`, bold: false,
              margin: [5, 5, 5, 5], border: [true, true, true, true] },
          ]
        ]
      },
      layout: {
        hLineWidth: function (i, node) {
          if (i === node.table.body.length) return 1
          return 0 },
      }
    }
   if(this.isPlaceOfSupply ){
    customerSection.table.body[0][1]={text: `Place of Supply: ${customerPOS}`, alignment: 'left'};
   }
    if (this.isTax){
     customerSection.table.body[0][2]={text:this.isTDS?'TRN :'+`${customerGstin}`:'GSTIN :'+`${customerGstin}`,alignment: 'left'};
    }

    let freightTables = []
    freights.forEach((item)=>{
      freightTables.push({
        margin: [0, 12, 0, 0],
        width: "*",
        headerRows: 1,
        fontSize: 9,
        alignment: 'center',
        table: {
          widths: item[2],
          body: item[0]
        },
        layout: {
          paddingTop: function (i, node) { return 5 },
          paddingBottom: function (i, node) { return 5 },
          hLineStyle: function (i, node) {
            if (i === 0 || i === node.table.body.length || !item[1].includes(i)) {
              return null;
            }
            return { dash: { length: 4, space: 3 } };
          }
        }
      })
    })

    const otherTable = {
        margin: [0, 10, 0, 0],
        width: "*",
        headerRows: 1,
        fontSize: 9,
        alignment: 'center',
        table: {
          widths: others[2],
          body: others[0]
        },
        layout: {
          paddingTop: function (i, node) { return 5 },
          paddingBottom: function (i, node) { return 5 },
          hLineStyle: function (i, node) {
            if (i === 0 || i === node.table.body.length || !others[1].includes(i)) {
              return null;
            }
            return { dash: { length: 4, space: 3 } };
          }
        }
    }

    const calculations = {
      width: "40%",
      fontSize: 9,
      table: {
        widths: ["70%", "30%"],
        body: calculationArr
      },
      layout: {
        vLineWidth: function (i, node) { return 0; },
        hLineWidth: function (i, node) { return 0; },
        paddingTop: function (i, node) { return 2 },
        paddingBottom: function (i, node) { return 2 },
      }

    }

    let bankDetails= [{ text: "Bank Detail:\n", fontSize: 9, bold: true, margin: [0, 0, 0, 2] },
    { text: `Account No: ${accountNo}\n`, fontSize: 9, margin: [0, 0, 0, 2] },
    { text: `Account Holder: ${accountHolder}\n`, fontSize: 9, margin: [0, 0, 0, 2] },
    { text: `IBAN No: ${ibanCode}\n`, fontSize: 9, margin: [0, 0, 0, 2] }
    ]
    if(this.isTax){
      bankDetails.push({ text: `IFSC Code: ${ifscCode}\n`, fontSize: 9, margin: [0, 0, 0, 2] })
    } else {
      bankDetails.push({ text: `Swift Code: ${swiftCode}\n`, fontSize: 9, margin: [0, 0, 0, 2] })}

    const bankTerms: any = {
      width: "60%",
      table: {
        widths: ["*"],
        body: []
      }
    }


    if (this.tac.show && this.tac.samePage) {
      bankTerms.table.body.push([{border: [false, false, false], fontSize: 9, stack: [{text: "Terms And Conditions:\n"}, {stack: this.tac.content}]}])
      bankTerms.table.body.push([{ text: "", border: [false, false, false] }])
    }

    if (payTerm) {
      bankTerms.table.body.push([{border: [false, false, false], fontSize: 9, text: `Payment Term: ${payTerm}`,}])
      bankTerms.table.body.push([{ text: "", border: [false, false, false] }])
    }

    if (accountNo) {
      bankTerms.table.body.push([{border: [false, false, false], width: "*", stack:bankDetails }])
      bankTerms.table.body.push([{ text: "", border: [false, false, false] }])
    }

    if (narration) {
      bankTerms.table.body.push([{border: [false, false, false], fontSize: 9, text: `Narration:\n${narration}`}])
      bankTerms.table.body.push([{ text: "", border: [false, false, false] }])
    }


    const bankTermsCalTable = {
      margin: [0, 10, 0, 0],
      columnGap: 10,
      columns: [
        "",
        calculations,
      ]
    }

    if (bankTerms.table.body.length > 0)  bankTermsCalTable.columns[0] = bankTerms;


    let content = [];
    content.push(quotationHeading);
    content.push(quotationSection);
    content.push(customerSection);
    content.push(customerBillingShippingAddress);
    freightTables.forEach((item)=>{content.push(item)})
    if (data['others'].length > 0) content.push(otherTable)
    content.push(bankTermsCalTable)
    if (this.signature.show) content.push(this.addSignature())
    return content
  }

  downloadForEmailPdf(data, print: boolean = false) {
    this._commonService.fetchCompanyLogo().subscribe((response: any) => {
      this.company_logo = response.result.image_blob;
      this.emailPopUps(data);
    }, (err) => {
      this.company_logo = null;
      this.emailPopUps(data);
    });
  }

  toTitleCase(str) {
    if (str)
      return str.replace(/\S+/g, str => str.charAt(0).toUpperCase() + str.substr(1).toLowerCase());
  }

  createEmailPdf(data, fileName) {
    let partyCompanyName = this.toTitleCase(data['customer'].company_name);
    let quotationNo = data.quotation_no;
    let senderCompany = data.company.company_name;
    let debitAmount = data.total_amount;
    let subject = senderCompany + "| Quotation No : " + quotationNo
    let userName = this.toTitleCase(localStorage.getItem('TS_USER_NAME'))

    let dataFormat = {
      base64Code: "",
      email: data['customer']['email_address'],
      content: "\nHi " + partyCompanyName + " ,\n\n I hope you're well! Please see attached quotation number " + quotationNo + " with a quotation amount of " + debitAmount + ". Don't hesitate to reach out if you have any questions.\n\nKind regards,\n\n" + userName + "\n\n" + senderCompany,
      fileName: fileName + "_" + this.generateFileName(),
      subject: subject, isOpen: true
    }

      setTimeout(() => {
        pdfMake.createPdf(this.generatePDF(data)).getBase64(data => {
          dataFormat.base64Code = data
          this.filebyteCode.next(dataFormat);
          this.isOpen = true;
        })
      }, 100);
  }

  emailPopUps(data) {
    this.ngxService.start();
    let fileName = 'Quotation_'
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


}

