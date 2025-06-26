import { Component, Inject, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BehaviorSubject } from 'rxjs';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { checkEmpty } from 'src/app/shared-module/utilities/helper-utils';
import { addFonts } from 'src/app/shared-module/utilities/pdfmake-uitls';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { TerminologiesService } from 'src/app/core/services/terminologies.service';
import { RateCardBillingBasedOn } from 'src/app/core/constants/constant';
import { bottomBorderTable, generatePdfTemplate1, getNarationSignature, getTermsAndConditionTableNextPage, getTermsAndConditionTableSamePage, pdfTemplate1 } from 'src/app/shared-module/utilities/pdftemplate-utils';
import { cloneDeep } from 'lodash';
import { formatNumber } from 'src/app/shared-module/pipes/numberformat.pipe';
type PdfData = {
  image: any,
  pdfData: any
}

@Component({
  selector: 'app-quotation-v2-pdf',
  templateUrl: './quotation-v2-pdf.component.html',
  styleUrls: ['./quotation-v2-pdf.component.scss']
})
export class QuotationV2PdfComponent implements OnInit {

  currency_symbol;
  allData: any;
  preFixUrl = ''
  companyLogo: any = '';
  pdfSrc = "";
  tac: any = { content: "", samePage: false, show: false }
  signature: any = { url: "", name: false, designation: false, show: false, blob: null }
  isOpen = false;
  showEmailOptions: boolean = false;
  companyHeaderDetails: any;
  footerDetails: any;
  filebyteCode = new BehaviorSubject(null);
  quotation = Permission.quotations.toString().split(',');
  isPlaceOfSupply: boolean = false;
  terminology: any;
  rateCardBilling = new RateCardBillingBasedOn();
  rateCardBillingList = this.rateCardBilling.RateCardbillingUnitsList
  rateCardBillingHour = this.rateCardBilling.hour
  rateCardBillingDays = this.rateCardBilling.day
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





  constructor(
    private currency: CurrencyService,
    private ngxService: NgxUiLoaderService,
    private _preFixUrl: PrefixUrlService,
    private _tax: TaxService,
    private _terminologiesService: TerminologiesService,
    private _fileDownload: FileDownLoadAandOpen,
    private dialogRef: DialogRef<boolean>, @Inject(DIALOG_DATA) private data: PdfData,
  ) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    this.pdfTemplate1.isTax = this._tax.getTax();
    this.pdfTemplate1.isTds = this._tax.getVat();
    this.terminology = this._terminologiesService.terminologie;
    this.isPlaceOfSupply = this._tax.isPlaceOfSupply();
    addFonts(pdfMake)
  }

  ngOnInit() {
    this.preFixUrl = this._preFixUrl.getprefixUrl();
    this.currency_symbol = this.currency.getCurrency()?.symbol;
    this.companyLogo = this.data.image
    if (this.data.pdfData) {
      this.allData = this.data.pdfData;    
      this.generateCompanyHeaderandFooterForAllCategories();
    }
  }

  close() {
    this.dialogRef.close(true)
  }
  processPdf(data, print: Boolean = false) {
    this.ngxService.start();
    let fileName = 'Quotation_'
    if (print) {
      pdfMake.createPdf(generatePdfTemplate1(this.pdfTemplate1)).print({}, window.frames['printPdf']);
    } else {
      this.createPdfDownload(data, fileName)
    }
    setTimeout(() => {
      this.ngxService.stop();
    }, 500);
  }

  createPdfDownload(data, file_Name) {
    setTimeout(() => {
      let fileName = `${file_Name}_${this.generateFileName()}` + ".pdf"
      const pdfDocGenerator = pdfMake.createPdf(generatePdfTemplate1(this.pdfTemplate1));
      pdfDocGenerator.getBlob((blob) => {
        this._fileDownload.writeAndOpenFile(blob, fileName).then(data => {
        });
      });
    }, 500);
  }

  generateFileName() {
    let partyName = this.allData['customer']['company_name'];
    let bosNumber = this.allData['quotation_no'];
    return `${partyName}_${bosNumber}`;
  }

  downloadPdf(data, print: boolean = false) {
    this.processPdf(data, print);
  }

  createDestinations(data = []) {    
    let sectionData = [];
    sectionData.push([
      { text: "Destination No", bold: true, border: [true, true, false, true] },
      { text: "Location", bold: true, border: [false, true, false, true] },
      { text: "Point Type", bold: true, border: [false, true, true, true] }
    ]
    )
    for (let i = 0; i < data.length; i++) {
      let innerRow: any = [
        { text: i + 1, border: [true, false, false, true] },
        { text: data[i].area?.label, border: [false, false, false, true] },
        { text: data[i].point_type.label, border: [false, false, true, true] }
      ]
      sectionData.push(innerRow)
      innerRow = []
    }


    return sectionData
  }


  createFreights(freights) {
    let GSTTYPE = 'IGST';
    if (this.pdfTemplate1.isTds) {
      GSTTYPE = 'VAT'
    }
    const data = freights['freight_meta']

    const billingType = freights['billing_type'] ? freights['billing_type']['label'] : ""
    const billingIndex = freights['billing_type'] ? freights['billing_type']['index'] : -1

    let sectionData = [];
    let borderAdd = [];
    let totalColumns = 0
    sectionData.push([
      { text: "Total", bold: true, border: [false, true, true, true] }])

    if (billingIndex != 10) {
      if (this.pdfTemplate1.isTax) {
        if (!this.allData.tax_detail.is_intrastate) {
          sectionData[0].splice(0, 0, { text: GSTTYPE, bold: true, border: [false, true, false, true] })
        }
        else {
          sectionData[0].splice(0, 0, { text: 'CGST', bold: true, border: [false, true, false, true] })
          sectionData[0].splice(0, 0, { text: 'SGST', bold: true, border: [false, true, false, true] })
        }
      }
      sectionData[0].splice(0, 0, { text: 'Amount', bold: true, border: [false, true, false, true] })
      sectionData[0].splice(0, 0, { text: 'Unit', bold: true, border: [false, true, false, true] })
      sectionData[0].splice(0, 0, { text: 'Unit Cost', bold: true, border: [true, true, false, true] })
    }

    totalColumns = sectionData[0].length
    let innerRow = []
    for (let i = 0; i < totalColumns; i++) { innerRow.push("") }
    innerRow[0] = {
      text: `Freight Type: ${billingType}`, bold: true, border: [false, false, false, true],
      colSpan: totalColumns, alignment: 'left'
    }
    sectionData.splice(0, 0, innerRow)

    for (let i = 0; i < data.length; i++) {
      let tripData = data[i]
      let innerRow: any = [
        { text: tripData['total_amount'], border: [false, true, true, true] }]

      if (billingIndex != 10) {
        if (this.pdfTemplate1.isTax) {
          if (!this.allData.tax_detail.is_intrastate) {

            const igst = {
              text: [checkEmpty(data[i], ['tax_description', 'IGST'], true) + '%', '\n',
              { text: '' + checkEmpty(data[i], ['tax_description', 'IGST_amount'], true) }],
              border: [false, true, false, true]
            }
            innerRow.splice(0, 0, igst)
          }
          else {
            const cgst = {
              text:
                [{ text: checkEmpty(data[i], ['tax_description', 'CGST'], true) + '%' }, '\n',
                { text: '' + checkEmpty(data[i], ['tax_description', 'CGST_amount'], true) }],
              border: [false, true, false, true]
            }
            innerRow.splice(0, 0, cgst)
            const sgst = {
              text:
                [{ text: checkEmpty(data[i], ['tax_description', 'SGST'], true) + '%' }, '\n',
                { text: '' + checkEmpty(data[i], ['tax_description', 'SGST_amount'], true) }],
              border: [false, true, false, true]
            }
            innerRow.splice(0, 0, sgst)
          }
        }
        innerRow.splice(0, 0, { text: tripData.freight_amount_before_tax, border: [false, true, false, true] })
        innerRow.splice(0, 0, { text: tripData.quantity, border: [false, true, false, true] })
        innerRow.splice(0, 0, { text: tripData.unit_cost, border: [true, true, false, true] })
      }
      sectionData.push(innerRow)

      innerRow = []
      if (tripData.description.length > 0) {
        for (let i = 0; i < totalColumns; i++) innerRow.push("")
        innerRow[0] = {
          text: tripData.description, border: [true, true, true, true],
          colSpan: totalColumns, alignment: 'left'
        }
        sectionData.push(innerRow)
        borderAdd.push(sectionData.length - 1)
      }
    }

    const widthString = (100 / sectionData[0].length).toFixed(3);
    const itemChallanWidths = Array(sectionData[0].length).fill(widthString + "%");
    return [sectionData, borderAdd, itemChallanWidths]
  }

  generatePDF(data) {
    this.generateCompanyHeaderandFooterForAllCategories();
  }

  pdfDataGeneration(data) {    
    const others = this.createOthers(data['others']['others']);
    const freights = this.createFreight(data['freights'])
    const destination = this.createDestinations(data.path)
    const destinationTable = {
      width: "*",
      headerRows: 1,
      fontSize: 9,
      alignment: 'center',
      table: {
        widths: ["33.33%", "33.33%", "33.33%"],
        body: destination
      },
      layout: {
        hLineWidth: function (i, node) {
          return (i === 1 || i === node.table.body.length) ? 0.7 : 0;
        },
        vLineWidth: () => 0.7,
        hLineColor: () => 'black',
        vLineColor: () => 'black',
      }
    }

    const otherTable = {
      width: "*",
      headerRows: 1,
      fontSize: 9,
      alignment: 'center',
      table: {
        widths: others[1],
        body: others[0]
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

    const freightTable = {
      width: "*",
      headerRows: 1,
      fontSize: 9,
      alignment: 'center',
      table: {
        widths: freights[1],
        body: freights[0]
      },
      layout: {
        vLineWidth: function (i, node) {
          return (i === 0 || i === node.table.widths.length) ? 1 : 0;
        },
        hLineColor: function (i, node) {
          if (( i === node.table.body.length)) {
            return 'black'
          } else {
            if (freights[2]) {
              if (i % 2 == 0) {
                return 'white'
              } else {
                return 'black'
              }
            } else {
              return 'black'
            }
          }
        },
        hLineWidth: function (i, node) {
          return (i === 1 || i === node.table.body.length) ? 0.7 : 0;
        },
        vLineColor: function (i, node) {
          return 'black'
        },
      }
    }
    let destinationHeader ;
    if (data.path.length > 0) {
      destinationHeader= [
        [{
          border : [0,0,0,3],
          text: [
            { text: 'Destinations ', style: 'contentBold', },
          ]


        }]
      ]
    }
    let customerFreightHeader ;
    if (data['freights']['freights'].length > 0) {
      customerFreightHeader= [
        [{
          border : [0,0,0,3],
          text: [
            { text: 'Customer Freight ', style: 'contentBold', },
          ]
        }]
      ]
    }
    let additionalChargesHeader ;
    if (Number(data['others']['others'][0]['total_amount']) > 0) {
      additionalChargesHeader= [
        [{
          border : [0,0,0,3],
          text: [
            { text: 'Additional Charges ', style: 'contentBold', },
          ]
        }]
      ]
    }
    let materialDetails = data['materials']
      .filter((element) => {
        return Object.entries(element).some(
          ([key, value]) => key !== 'id' && value !== null && value !== undefined && value !== '' && value !=0
        );
      })
      .map((element) => {
        const { id, ...rest } = element;
        return rest;
    });

    let materialInfoHeader = [
      [{
        border: [0, 0, 0, 3],
        text: [
          { text: 'Material Info ', style: 'contentBold', },
        ]
      }]
    ]
    
    if (data.path.length)  this.pdfTemplate1.contents.push(bottomBorderTable({body:destinationHeader,widths:['100%']}),destinationTable)
    if (data['freights']['freights'].length && Number(data['freights']['freights'][0]['total']) > 0) {
      this.pdfTemplate1.contents.push(bottomBorderTable({body:customerFreightHeader,widths:['100%']}),freightTable)
    }
    if (data['others']['others'].length && Number(data['others']['others'][0]['total_amount']) > 0) {
      this.pdfTemplate1.contents.push(bottomBorderTable({body:additionalChargesHeader,widths:['100%']}),otherTable)
    }
    if(materialDetails.length){
      const material = this.createLooseCargoMaterial(materialDetails);
      const materialTable = {
        width: "*",
        headerRows: 1,
        fontSize: 9,
        alignment: 'center',
        table: {
          widths: material[1],
          body: material[0]
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
      this.pdfTemplate1.contents.push(bottomBorderTable({body:materialInfoHeader,widths:['100%']}),materialTable)
    }
  }

  pdfDataGenerationCrane(data){ 
    const location = data['area']?.label ? data['area']?.label : ''
    const shiftType=data['no_of_shifts']==0?'One':'Double'
    const billingUnit=this.rateCardBillingList.find(type=>type.value==data['billing_unit']).label
    let durationSectionRows=[];
    durationSectionRows.push({ text: `Billing Unit: ${billingUnit}`, alignment: 'left' })
    if(data['billing_unit']=='hour'){
      let minhour=shiftType=='Double'?2:1
      durationSectionRows.push({ text: `Daily Hours: ${this.rateCardBillingHour.day*minhour} Hours`, alignment: 'left' })
    }
    const durationWidth = new Array(durationSectionRows.length).fill('');
    const durationSection: any = {
      width: "*",
      fontSize: 9,
      table: {
        widths: durationWidth.map((_, index) => `${(100/durationSectionRows.length).toFixed(2)}%`),
        height: 10,
        body: [
          durationSectionRows
        ]
      },
      layout: {
        paddingTop: function (i, node) { return 5 },
        paddingBottom: function (i, node) { return 5 },
        vLineWidth: function (i, node) {
          if (i === 0 || i === node.table.widths.length) return 1
          return 0
        },
        hLineWidth: function (i, node) {
          if (i === node.table.body.length) return 1
          return 0
        },
      }
    }

    const locationSection: any = {
      width: "*",
      fontSize: 9,
      table: {
        widths: ["100%"],
        height: 10,
        body: [
          [ { text: `Location: ${location}`, alignment: 'left' }],
        ]
      },
      layout: {
        paddingTop: function (i, node) { return 5 },
        paddingBottom: function (i, node) { return 5 },
        vLineWidth: function (i, node) {
          if (i === 0 || i === node.table.widths.length) return 1
          return 0
        },
        hLineWidth: function (i, node) {
          if (i === node.table.body.length) return 1
          return 0
        },
      }
    }


    let rentalData = data['rental_charges'];

    let rentalCol = 2;
    if (rentalData.has_extra_hours) rentalCol++;
    if (rentalData.has_with_fuel) rentalCol++;
    if (rentalData.has_wo_fuel) rentalCol++;
    const rentalWidth = new Array(rentalCol).fill('');
    let rentalBody = [
      [{ text: 'Rental', colSpan: rentalCol, alignment: 'center', bold: true }, ...new Array(rentalCol - 1).fill({})]
    ];
    
    let headerRow = [{ text: 'Specification', alignment: 'center' }, { text: `Rate Per Unit`, alignment: 'center' }];
    if (rentalData.has_with_fuel) headerRow.push({ text: `With Fuel (${this.currency_symbol})`, alignment: 'center' });
    if (rentalData.has_wo_fuel) headerRow.push({ text: `Without Fuel (${this.currency_symbol})`, alignment: 'center' });
    if (rentalData.has_extra_hours){
      if(data['billing_unit']=='hour'){
        headerRow.push({ text: `Extra Hours (${this.currency_symbol})`, alignment: 'center' });
      }
      if(data['billing_unit']=='day'){
        headerRow.push({ text: `Extra Days (${this.currency_symbol})`, alignment: 'center' });
      }
    }
    rentalBody.push(headerRow);
    
    rentalData.data.forEach(specification => {
      const charges = specification.charges;
      if (charges.length === 1) {
        let row = [
          { text: specification.specification, alignment: 'center' },
          { text: charges[0].rate, alignment: 'center' }
        ];
        if (rentalData.has_with_fuel) row.push({ text: formatNumber(charges[0].with_fuel), alignment: 'center' });
        if (rentalData.has_wo_fuel) row.push({ text: formatNumber(charges[0].wo_fuel), alignment: 'center' });
        if (rentalData.has_extra_hours) row.push({ text: formatNumber(charges[0].extra), alignment: 'center' });
        rentalBody.push(row);
      } else {
        charges.forEach((charge, index) => {
          if (index === 0) {
            let row = [
              { text: specification.specification, alignment: 'center', rowSpan: charges.length },
              { text: charge.rate, alignment: 'center' }
            ];
            if (rentalData.has_with_fuel) row.push({ text: formatNumber(charge.with_fuel), alignment: 'center' });
            if (rentalData.has_wo_fuel) row.push({ text: formatNumber(charge.wo_fuel), alignment: 'center' });
            if (rentalData.has_extra_hours) row.push({ text: formatNumber(charge.extra), alignment: 'center' });
            rentalBody.push(row);
          } else {
            let row = [
              '',
              { text: charge.rate, alignment: 'center' }
            ];
            if (rentalData.has_with_fuel) row.push({ text: formatNumber(charge.with_fuel), alignment: 'center' });
            if (rentalData.has_wo_fuel) row.push({ text: formatNumber(charge.wo_fuel), alignment: 'center' });
            if (rentalData.has_extra_hours) row.push({ text: formatNumber(charge.extra), alignment: 'center' });
            rentalBody.push(row);
          }
        });
      }
    });
    const rentalSection: any = {
      width: "*",
      fontSize: 9,
      table: {
				widths:rentalWidth.map((_, index) => `${(100/rentalCol).toFixed(2)}%`),
				headerRows: 1,
        body:rentalBody,
        layout : {
          hLineWidth: function (i, node) {
            if (i === 0) return 0          },
        }
			},
    }
    let chargeCol=5;
    if(this.pdfTemplate1.isTax){
      chargeCol=6
    }
    const chargesWidth = new Array(chargeCol).fill('');
    let additionalChargeBody= [
      [{ text: 'Additional Charge', colSpan: chargeCol, alignment: 'center', bold: true }, ...new Array(chargeCol - 1).fill({})]
    ]
    let chargeRow=[{text: 'Additional Charge', alignment: 'center'}]
    if(this.pdfTemplate1.isTax){
      chargeRow.push({text: 'Tax', alignment: 'center'})
    }
    chargeRow.push({text: 'Unit of Measurement', alignment: 'center'})
    chargeRow.push({text: 'No. Of Units', alignment: 'center'})
    chargeRow.push({text: `Rate Per Unit (${this.currency_symbol})`, alignment: 'center'})
    chargeRow.push({text: `Total Amount (${this.currency_symbol})`, alignment: 'center'})
    additionalChargeBody.push(chargeRow)
    data['additional_charges'].forEach(charge => {
      let chargeRow=[{text: charge.name, alignment: 'center'}]
      if(this.pdfTemplate1.isTax){
        chargeRow.push({text: charge.tax, alignment: 'center'})
      }
      chargeRow.push({text: charge.uom, alignment: 'center'})
      chargeRow.push({text: charge.quantity, alignment: 'center'})
      chargeRow.push({text: formatNumber(charge.unit_cost), alignment: 'center'})
      chargeRow.push({text: formatNumber(charge.total), alignment: 'center'})
      additionalChargeBody.push(chargeRow)
    });
    const additionalChargeSection: any = {
      width: "*",
      fontSize: 9,
      table: {
				widths: chargesWidth.map((_, index) => `${(100/chargeCol).toFixed(2)}%`),
				headerRows: 1,
				body: additionalChargeBody
			},
      hLineWidth: function (i, node) {
        return (i === 1 || i === node.table.body.length) ? 0.7 : 0;
      },
      vLineWidth: () => 0.7,
      hLineColor: () => 'black',
      vLineColor: () => 'black',
    }
    this.pdfTemplate1.contents.push(locationSection,durationSection)
    if(rentalData['data'].length) this.pdfTemplate1.contents.push(rentalSection)
    if(data['additional_charges'].length) this.pdfTemplate1.contents.push(additionalChargeSection)
  }

  pdfGenerationLooseCargo(data){    
    const material = this.createLooseCargoMaterial(data['materials']);
    const freights = this.createLooseCargoFreight(data['freights'])
    const destination = this.createDestinations(data.path)
    const destinationTable = {
      margin: [0, 10, 0, 0],
      width: "*",
      headerRows: 1,
      fontSize: 9,
      alignment: 'center',
      table: {
        widths: ["33.33%", "33.33%", "33.33%"],
        body: destination
      },
      layout: {

        vLineWidth: function (i, node) {
          return (i === 0 || i === node.table.widths.length) ? 1 : 0;
        },
        hLineColor: function (i, node) {
          return (i === 0 || i === node.table.body.length) ? 'black' : 'black';
        },
        vLineColor: function (i, node) {
          return (i === 0 || i === node.table.widths.length) ? 'black' : 'black';
        },
        paddingTop: function (i, node) { return 5 },
        paddingBottom: function (i, node) { return 5 },
      }
    }
    const materialTable = {
      margin: [0, 10, 0, 0],
      width: "*",
      headerRows: 1,
      fontSize: 9,
      alignment: 'center',
      table: {
        widths: material[1],
        body: material[0]
      },
      layout: {
        vLineWidth: function (i, node) {
          return (i === 0 || i === node.table.widths.length) ? 1 : 0;
        },
        hLineColor: function (i, node) {
          return (i === 0 || i === node.table.body.length) ? 'black' : 'black';
        },
        vLineColor: function (i, node) {
          return (i === 0 || i === node.table.widths.length) ? 'black' : 'black';
        },
        paddingTop: function (i, node) { return 5 },
        paddingBottom: function (i, node) { return 5 },
      }
    }

    const freightTable = {
      margin: [0, 10, 0, 0],
      width: "*",
      headerRows: 1,
      fontSize: 9,
      alignment: 'center',
      table: {
        widths: freights[1],
        body: freights[0]
      },
      layout: {
        vLineWidth: function (i, node) {
          return (i === 0 || i === node.table.widths.length) ? 1 : 0;
        },
        hLineColor: function (i, node) {
          if ((i === 0 || i === node.table.body.length)) {
            return 'black'
          } else {
            if (freights[2]) {
              if (i % 2 == 0) {
                return 'white'
              } else {
                return 'black'
              }
            } else {
              return 'black'
            }
          }
        },
        vLineColor: function (i, node) {
          return 'black'
        },
        paddingTop: function (i, node) { return 5 },
        paddingBottom: function (i, node) { return 5 },
      }
    }
    let chargeCol=4;
    if(this.pdfTemplate1.isTax){
      chargeCol=5
    }
    const chargesWidth = new Array(chargeCol).fill('');
    let additionalChargeBody= [
      [{ text: 'Additional Charge', colSpan: chargeCol, alignment: 'center', bold: true }, ...new Array(chargeCol - 1).fill({})]
    ]
    let chargeRow=[{text: 'Additional Charge', alignment: 'center'}]
    if(this.pdfTemplate1.isTax){
      chargeRow.push({text: 'Tax', alignment: 'center'})
    }
    chargeRow.push({text: 'Unit of Measurement', alignment: 'center'})
    chargeRow.push({text: 'No. Of Units', alignment: 'center'})
    chargeRow.push({text: `Rate Per Unit (${this.currency_symbol})`, alignment: 'center'})
    additionalChargeBody.push(chargeRow)
    data['others']['others'].forEach(charge => {
      let chargeRow=[{text: charge.name, alignment: 'center'}]
      if(this.pdfTemplate1.isTax){
        chargeRow.push({text: charge.tax, alignment: 'center'})
      }
      chargeRow.push({text: charge.uom, alignment: 'center'})
      chargeRow.push({text: formatNumber(charge.quantity), alignment: 'center'})
      chargeRow.push({text: formatNumber(charge.unit_cost), alignment: 'center'})
      additionalChargeBody.push(chargeRow)
    });
    const additionalChargeSection: any = {
      margin: [0, 5, 0, 0],
      width: "*",
      fontSize: 9,
      table: {
				widths: chargesWidth.map((_, index) => `${(100/chargeCol).toFixed(2)}%`),
				headerRows: 1,
				body: additionalChargeBody
			}
    }

    if(data.path.length){
      this.pdfTemplate1.contents.push(destinationTable)      
    } 
    if(data['freights']['freights'].length && Number(data['freights']['freights'][0]['total']) > 0) {
      this.pdfTemplate1.contents.push(freightTable)
    }
    if(data['others']['others'].length){
      this.pdfTemplate1.contents.push(additionalChargeSection)      
    }
    if(data['materials'].length) {
      this.pdfTemplate1.contents.push(materialTable)      
    }
  }

  downloadForEmailPdf(data, print: boolean = false) {
    this.emailPopUps(data);
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
    let content = "\nHi " + partyCompanyName + " ,\n\n I hope you're well! Please see attached quotation number " + quotationNo + " with a quotation amount of " + this.currency_symbol + " " + debitAmount + ". Don't hesitate to reach out if you have any questions.\n\nKind regards,\n\n" + userName + "\n\n" + senderCompany
    if(data['vehicle_category']!=0){
      content = "\nHi " + partyCompanyName + " ,\n\n I hope you're well! Please see attached quotation number " + quotationNo + ". Don't hesitate to reach out if you have any questions.\n\nKind regards,\n\n" + userName + "\n\n" + senderCompany 
    }
    let dataFormat = {
      base64Code: "",
      email: data['customer']['email_address'],
      content:content ,
      fileName: fileName + "_" + this.generateFileName(),
      subject: subject, isOpen: true
    }

    setTimeout(() => {
      pdfMake.createPdf(generatePdfTemplate1(this.pdfTemplate1)).getBase64(data => {
        dataFormat.base64Code = data
        this.filebyteCode.next(dataFormat);
        this.isOpen = true;
      })
    }, 100);
  }

  emailPopUps(data) {
    let fileName = 'Quotation_'
    this.createEmailPdf(data, fileName)
  }

  closeDialog(e) {
    if (e) {
      this.isOpen = false;
    }
  }

  createOthers(data) {
    let sectionData = [];
    let header=[{ text: "Additional Charges", bold: true},
    { text: "Unit Of Measurement", bold: true},
    { text: "No. Of Units", bold: true},
    { text: "Unit Cost " + '(' + this.currency_symbol + ')', bold: true},
    { text: "Total Amount " + '(' + this.currency_symbol + ')', bold: true }]
    if (this.pdfTemplate1.isTax) {
      header.splice(1, 0,  { text: "Tax", bold: true });
    }
    sectionData.push(header)
    for (let i = 0; i < data.length; i++) {
      let otherData = data[i]
      if (Number(otherData['total_amount'] > 0)) {
        let innerRow: any = [{ text: otherData['item']['name']},
        { text: otherData['unit']? otherData['unit']['label']:''},
        { text: otherData['quantity'] },
        { text: formatNumber(otherData['unit_cost']) },
        { text: formatNumber(otherData['total_amount'] )}]
        if (this.pdfTemplate1.isTax) {
          innerRow.splice(1, 0, { text:otherData['tax']? otherData['tax']['label']:'' });
        }
        sectionData.push(innerRow)
      }

    }
    const widthString = (100 / sectionData[0].length).toFixed(3);
    const itemChallanWidths = Array(sectionData[0].length).fill(widthString + "%");
    return [sectionData, itemChallanWidths]
  }

  createFreight(data) {
    let colums = data['customizations']['fields'].filter(col => col.is_private == false),
      freightData = [],
      removeEmptyCol = data['customizations']['hide_pdf_empty_columns'],
      isDescription = false,
      freightTable = [],
      header = []

    if (removeEmptyCol) {
      colums = this.removeEmptyColumn(colums, data)
    }
    freightData = data['freights']
    colums.forEach(col => {
      if (col.key != 'description') {
        if (col.key === 'rate' || col.key === 'total') {
          header.push({ text: col.field_label + '(' + this.currency_symbol + ')', bold: true })
        } else {
          header.push({ text: col.field_label, bold: true })
        }
      }

    });
    freightTable.push(header)
    for (let i = 0; i < freightData.length; i++) {
      let freight = freightData[i]
      let innerRow = []
      let innerRowDescription = []
      if (Number(freight['total'] > 0)) {
        colums.forEach(col => {
          if (col.key != 'description') {
            if (col.system_created) {
              if (col.key == 'billing') {
                innerRow.push(
                  { text: checkEmpty(freight[col.key], ['label']) },
                )
              }
              if (col.key == 'specification') {
                const specification = freight[col.key] ? freight[col.key]['label'] : '-'
                innerRow.push(
                  { text: specification },
                )
              }
              if (col.key == 'make_model') {
                const make = freight[col.key]['make'] ? freight[col.key]['make'].name : '-';
                const model = freight[col.key]['model'] ? freight[col.key]['model'].name : '-'
                innerRow.push(
                  { text: make + "   |  " + model },
                )
              }
              if (col.key == 'quantity') {
                innerRow.push(
                  { text: freight[col.key] },
                )
              }
              if (col.key == 'rate') {
                innerRow.push(
                  { text: freight[col.key] },
                )
              }
              if (col.key == 'total') {
                innerRow.push(
                  { text: freight[col.key] },
                )
              }
            } else {
              innerRow.push(
                { text: freight[col.key] ? freight[col.key] : '-' },
              )
            }
          }
          if (col.key == 'description') {
            const description = freight[col.key] ? freight[col.key] : '-'
            innerRowDescription.push({
              colSpan: innerRow.length, alignment: 'start',
              text: 'Description: ' + description
            })
          }
        });
        if (freight.hasOwnProperty('description') && innerRowDescription.length) {
          isDescription = true
          freightTable.push(innerRow)
          freightTable.push(innerRowDescription)
        } else {
          freightTable.push(innerRow)
        }
      }
    }
    const widthString = (100 / freightTable[0].length).toFixed(3);
    const freightWidths = Array(freightTable[0].length).fill(widthString + "%");
    return [freightTable, freightWidths, isDescription]
  }

  createLooseCargoFreight(data){
    let sectionData = [];
    let header=[{ text: "Billing Type", bold: true},
    { text: "Unit Cost " + '(' + this.currency_symbol + ')', bold: true},
    { text: "Total Units", bold: true},
    { text: "Total Amount " + '(' + this.currency_symbol + ')', bold: true }]
    sectionData.push(header)
    for (let i = 0; i < data.freights.length; i++) {
      let freightData = data.freights[i]
      if (Number(freightData['total'] > 0)) {
        let innerRow: any = [{ text:freightData['billing']? freightData['billing']['label']:'-'},
        { text: freightData['rate']},
        { text: freightData['quantity'] },
        { text: freightData['total'] }]
         sectionData.push(innerRow)
      }
    }
    const widthString = (100 / sectionData[0].length).toFixed(3);
    const itemChallanWidths = Array(sectionData[0].length).fill(widthString + "%");
    return [sectionData, itemChallanWidths]
  }

  createLooseCargoMaterial(data){
    let sectionData = [];
    let header=[{ text: "Material", bold: true},
    { text: "Unit", bold: true},
    { text: "No Of Items", bold: true},
    { text: "Weight/Items", bold: true },
    { text: "Volume/Item", bold: true },
    { text: "Total Quantity", bold: true }]
    sectionData.push(header)
    for (let i = 0; i < data.length; i++) {
      let materialData = data[i]
      let innerRow: any = [{ text: materialData['material']? materialData['material']['name']:'-'},
        { text: materialData['unit']? materialData['unit']['label']:'-'},
        { text: materialData['no_of_items'] },
        { text: `${materialData['weight_per_item'] ? materialData['weight_per_item'] : '-'} ${materialData['weight_unit'] ? materialData['weight_unit']?.label : ''}`},
        { text:`${materialData['length']?materialData['length']:'-'} X ${materialData['breadth']?materialData['breadth'] : '-'} X ${materialData['height']?materialData['height']:'-'} ${materialData['volume_unit']?materialData['volume_unit']?.label:''}`  },
        { text: materialData['total_quantity'] }]
         sectionData.push(innerRow)
    }
    const widthString = (100 / sectionData[0].length).toFixed(3);
    const itemChallanWidths = Array(sectionData[0].length).fill(widthString + "%");
    return [sectionData, itemChallanWidths]
  }

  removeEmptyColumn(colums, data) {
    let freightData = []
    freightData = data['freights']
    let columsWithData = {};
    colums.forEach((col) => {
      for (let i = 0; i < freightData.length; i++) {
        let freight = freightData[i]
        if (col.field_type == 'decimal') {
          if (Number(freight[col.key]) > 0) {
            columsWithData[col.key] = true
          }
        } else {
          if (col.key == 'make_model') {
            if (freight.hasOwnProperty('make_model')) {
              if (freight[col.key]['make']) {
                columsWithData[col.key] = true
              }
            }
          }
          else {
            if (freight[col.key]) {
              columsWithData[col.key] = true
            }
          }

        }
      }

    });
    return colums.filter(col => columsWithData[col.key])
  }

  generateCompanyHeaderandFooterForAllCategories(){
    this.pdfTemplate1.contents = []
    this.pdfTemplate1.headerDetails.companyname = this.allData?.company?.company_name;
    this.pdfTemplate1.headerDetails.companynameNative = '';
    this.pdfTemplate1.headerDetails.crnNo = this.allData.company.crn_no;
    this.pdfTemplate1.headerDetails.trnNo = this.allData.company.gstin;
    this.pdfTemplate1.headerDetails.panNo = this.allData.company.pan;
    this.pdfTemplate1.headerDetails.companyEmailId = this.allData.company.email_address;
    this.pdfTemplate1.headerDetails.companyAddress = this.allData.company.shipping_address[0]+''+this.allData.company.shipping_address[1];
    this.pdfTemplate1.headerDetails.mobileNo = this.allData.company.primary_mobile_number;
    this.pdfTemplate1.footerDetails.companyname = this.allData?.company?.company_name;
    this.pdfTemplate1.footerDetails.companynameNative = '';
    this.pdfTemplate1.footerDetails.companyEmailId = this.allData.company.email_address;
    this.pdfTemplate1.footerDetails.mobileNo = this.allData.company.primary_mobile_number;
    this.pdfTemplate1.headerDetails.companyLogo = this.companyLogo;
    this.pdfTemplate1.headerDetails.pdfTitle = 'Quotation';
    this.pdfTemplate1.footerDetails.systemGenerated = 'This is a computer-generated Quotation receipt. No signature is required for validation.'
    this.pdfTemplate1.footerDetails.poweredBy = 'Powered By Transportsimple.com';  
    this.pdfTemplate1.contents.push(
      bottomBorderTable({ body: this.getCreditDetailsandCustomerDetailsBody(), widths: ['40%', '60%'] }),
    )
    if(this.allData['vehicle_category']==1|| this.allData['vehicle_category']==2){
      this.pdfDataGenerationCrane(this.allData)
    }else{
      this.pdfDataGeneration(this.allData)
    }
    this.allData['vehicle_category']==0 && this.pdfTemplate1.contents.push(this.getBankAndTotalsTable())
    this.allData['vehicle_category']==0 && this.pdfTemplate1.contents.push(this.getAmountInWords())
    this.pdfTemplate1.contents.push(getNarationSignature({
      narration: this.allData.narration,
      signature: this.allData.signature?.document,
      isNarration: true,
      isSignature: true,
      authorizedSignature: 'Signature',
      forSignature:'',
    }));
    if (this.allData.tac.same_page && this.allData.tac.content) {

      this.pdfTemplate1.contents.push(getTermsAndConditionTableSamePage(this.allData.tac.content));
    }
    if (!this.allData.tac.same_page && this.allData.tac.content) {
      let termsAndConditionTable = getTermsAndConditionTableNextPage(this.allData.tac.content);
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
              text: [
                { text: 'Customer : ', style: 'contentBold' },
                { text: `${this.allData.customer.company_name}`, style: 'content' },
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
          columns: [
            {
              stack: [
                {
                  text: [
                    { text: 'Quotation No : ', style: 'contentBold' },
                    { text: `${this.allData.quotation_no}`, style: 'content' }
                  ]
                },
                {
                  text: [
                    { text: 'Quotation Date: ', style: 'contentBold' },
                    { text: `${this.allData.quote_date}`, style: 'content' }
                  ]
                },
                    {
                        text: [
                            { text: 'Validity: ', style: 'contentBold' },
                            { text: `${this.allData.validity_term}`, style: 'content' }
                        ]
                    },
                {
                      text: [
                        { text: 'Validity Date: ', style: 'contentBold' },
                        { text: `${this.allData.validity_date}`, style: 'content' }
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
    if (this.allData.customer?.billing_address[0]) {
      invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
        {
          text: [
            { text: `${this.allData.customer.billing_address[0]}`, style: 'content' },
          ]
        }
      )
    }
    if (this.allData.customer?.billing_address[1]) {
      invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
        {
          text: [
            { text: `${this.allData.customer.billing_address[1]}`, style: 'content' },
          ]
        }
      )
    }
    if (this.allData.customer.tax_details.crn_view || this.allData.customer.tax_details.gstin_view) {
      let text = [];
      if (this.allData.customer.tax_details.crn_view) {
        text.push({ text: 'CRN: ', style: 'contentBold' })
        text.push({ text: `${this.allData.customer.tax_details.crn_view}`, style: 'content' })
      }
      if (this.allData.customer.tax_details.gstin_view) {
        text.push({text:(!!this.allData.customer.tax_details.crn_view ? ' | ':'') +(this.pdfTemplate1.isTds?'TRN: ':'GSTIN: '), style: 'contentBold'})
        text.push({ text: `${this.allData.customer.tax_details.gstin_view}`, style: 'content' })
      }

      invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
        {
          text: text
        }
      )
    }

    if (this.allData.customer.shipping_address[0] ||  this.allData.customer.shipping_address[1]) {
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
            { text: `${this.allData.customer.shipping_address[0]}`, style: 'content' },
          ]
        }
      )
      invoiceDetailsandCustomerDetailsBody[0][0].stack.push(
        {
          text: [
            { text: `${this.allData.customer.shipping_address[1]}`, style: 'content' },
          ]
        }
      )
    }
    if (this.allData.payment_term) {
      invoiceDetailsandCustomerDetailsBody[0][1].columns[1].stack.push(
        {
          text: [
            { text: 'Payment Term: ', style: 'contentBold' },
            { text: `${this.allData.payment_term}`, style: 'content' }
          ]
        },
      )
    }
    if (Number(this.allData.vehicle_category)==0) {
      invoiceDetailsandCustomerDetailsBody[0][1].columns[0].stack.push(
        {
          text: [
            { text: 'Type Of Movement: ', style: 'contentBold' },
            { text: `${this.allData.type_of_movement?.label}`, style: 'content' }
          ]
        },
      )
    }
    
    if (this.allData.ref_no) {
      invoiceDetailsandCustomerDetailsBody[0][1].columns[1].stack.push(
        {
          text: [
            { text: 'Reference No: ', style: 'contentBold' },
            { text: `${this.allData.ref_no}`, style: 'content' }
          ]
        },
      )
    }
    if (this.allData.employee_in_charge) {
      invoiceDetailsandCustomerDetailsBody[0][1].columns[1].stack.push(
        {
          text: [
            { text: 'Sales Person: ', style: 'contentBold' },
            { text: `${this.allData.employee_in_charge}`, style: 'content' }
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
    if (this.allData.bank_account) {
      if (this.allData.bank_account.bank_name) {
        bankBody[0][0].columns[0].stack.push(
          {
            text: [
              { text: 'Bank Name ', style: 'content' },
            ]
          }
        )
        bankBody[0][0].columns[1].stack.push(
          {
            text: [
              { text: `:  ${this.allData.bank_account.bank_name}`, style: 'contentBold' },
            ]
          }
        )
        bankBody[0][0].columns[0].stack.push(
          {
            text: [
              { text: 'Account ', style: 'content' },
            ]
          }
        )
        bankBody[0][0].columns[1].stack.push(
          {
            text: [
              { text: `:  ${this.allData.bank_account.account_number}`, style: 'contentBold' },
            ]
          }
        )
      }
      if (this.allData.bank_account.iban_code) {
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
              { text: `:  ${this.allData.bank_account.iban_code ? this.allData.bank_account.iban_code : '-'}`, style: 'contentBold' },
            ]
          }
        )
      }
      if (this.allData.bank_account.swift_code) {
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
              { text: `:  ${this.allData.bank_account.swift_code ? this.allData.bank_account.swift_code: '-'}`, style: 'contentBold' },
            ]
          }
        )
      }
      if (this.allData.bank_account.ifsc_code) {
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
              { text: `:  ${this.allData.bank_account.ifsc_code ? this.allData.bank_account.ifsc_code : '-'}`, style: 'contentBold' },
            ]
          }
        )
      }
    }
    if(Number(this.allData.subtotal_freight_before_tax)){
      bankBody[0][1].columns[1].stack.push(
        {
          text: [
            { text: 'Subtotal Freight', style: 'contentBold' },
          ]
        },
      )
      bankBody[0][1].columns[2].stack.push(
        {
          text: [
            { text: `:  ${this.currency_symbol} ${formatNumber(this.allData.subtotal_freight_before_tax)}`, style: 'contentBold' },
          ]
        },
      )
    }
    if(Number(this.allData.subtotal_other_before_tax)){
      bankBody[0][1].columns[1].stack.push(
        {
          text: [
            { text: 'Subtotal Additional Charges', style: 'contentBold' },
          ]
        },
      )
      bankBody[0][1].columns[2].stack.push(
        {
          text: [
            { text: `:  ${this.currency_symbol} ${formatNumber(this.allData.subtotal_other_before_tax)}`, style: 'contentBold' },
          ]
        },
      )
    }
    if(Number(this.allData.tax_amount)){
      bankBody[0][1].columns[1].stack.push(
        {
          text: [
            { text: 'Tax Amount', style: 'contentBold' },
          ]
        },
      )
      bankBody[0][1].columns[2].stack.push(
        {
          text: [
            { text: `:  ${this.currency_symbol} ${formatNumber(this.allData.tax_amount)}`, style: 'contentBold' },
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
          { text: `:  ${this.currency_symbol} ${this.allData.roundoff_amount}`, style: 'contentBold' },
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
          { text: `:  ${this.currency_symbol} ${formatNumber(this.allData.total_amount)}`, style: 'contentBold' },
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
              { text:`${this.allData.amount_in_word}`, style: 'contentBold' }
          ]
      }]
  ]
  return bottomBorderTable({body,widths:['100%']})
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
  
}
