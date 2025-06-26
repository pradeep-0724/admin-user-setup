import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { CommonService } from 'src/app/core/services/common.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { MaterialService } from 'src/app/core/services/material.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { TerminologiesService } from 'src/app/core/services/terminologies.service';
import { SettingSeviceService } from 'src/app/modules/customerapp-module/api-services/orgainzation-setting-module-services/setting-service/setting-sevice.service';
import { normalDate } from 'src/app/shared-module/utilities/date-utilis';
import { isReverseMechanism, checkEmptyDataKey, checkEmpty } from 'src/app/shared-module/utilities/helper-utils';
import { pdfGenerate, addressToText, addImageColumn } from 'src/app/shared-module/utilities/pdfmake-uitls';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as _ from 'lodash';
import { PerformaInvoiceServiceService } from '../../../../api-services/revenue-module-service/performa-invoice-service/performa-invoice-service.service';

@Component({
  selector: 'app-performa-invoice-details',
  templateUrl: './performa-invoice-details.component.html',
  styleUrls: ['./performa-invoice-details.component.scss']
})
export class PerformaInvoiceDetailsComponent implements OnInit, OnDestroy {
  terminology :any;
  invoiceData: any;
  address: any = {};
  company_logo: any = '';
  sideBar: Boolean = false;
  invoice_id: string = '';
  @Input() invoiceId: BehaviorSubject<string>;
  @Input() routeToDetail: boolean=false;
  @Output() openDetailsEmitter =new EventEmitter<boolean>();
  @ViewChild('content',{static: true}) content: ElementRef;
  @Input() defaultDownload: boolean = false;
  showOptions: boolean = false;
  createCopySeleted: Number = 0;
  excludeAnnexure: boolean = false;
  isTPEmpty: boolean = false;
  isNewTPEmpty: boolean = false;
  currency_type;
  isOpen = false;
  showEmailOptions: boolean = false;
  filebyteCode = new BehaviorSubject(null);
  routeDetail: any = new ValidationConstants().routeConstants;
  isTax: boolean = false;
  isAdvanceGreaterThenZero: boolean = false;
  isMoneyReceived: boolean = false;
  isFuelReceived: boolean = false;
  isBataReceivaed: boolean = false;
  otherDetailExists: boolean = false;
  tripDataExists: boolean = false;
  isNewAdvanceGreaterThenZero: boolean = false;
  preFixUrl = '';
  pdfSrc = "";
  isMobile = false;
  digitalSignature = '';
  isLRNoEmpty = false;
  isFixedQty = false;
  isMaterial = true;
  challanLength = 0
  addToOthers = false;
  isTds=false;
  companyHeaderDetails:any;
  footerDetails:any;
  invoicePermissions = Permission.invoice.toString().split(',');
  invoiceSubscription: Subscription;
  isPlaceOfSupply: boolean = false;
  commentData={
    key:'invoice',
    object_id:''
  }
  isGotComment:boolean=false;


  constructor(
    private _terminologiesService:TerminologiesService,
    private _performainvoiceService: PerformaInvoiceServiceService,
    private _commonService: CommonService,
    private ngxService: NgxUiLoaderService,
    private currency: CurrencyService,
    private _tax: TaxService,
    private _material: MaterialService,
    private _advances: SettingSeviceService,
    private _preFixUrl: PrefixUrlService,
    private deviceService: DeviceDetectorService,
    private _fileDownload:FileDownLoadAandOpen,
  ) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    this.isTax = this._tax.getTax();
    this.isTds = this._tax.getVat();
    this.isMaterial = this._material.getMaterial();
    this.isMobile = this.deviceService.isMobile();
    this.isPlaceOfSupply = this._tax.isPlaceOfSupply();
  }
  ngOnDestroy(): void {
    this.invoiceSubscription.unsubscribe()
  }

  ngOnInit() {
    this.terminology = this._terminologiesService.terminologie;
    this.preFixUrl = this._preFixUrl.getprefixUrl();
    this._commonService.fetchCompanyLogo().subscribe((response: any) => {
      this.company_logo = response.result.image_blob;
    }, (err) => {
      this.company_logo = null;
    });
    setTimeout(() => {
      this.currency_type = this.currency.getCurrency();
    }, 1000);
    this._advances.getAdvances('performa/invoice').subscribe(data => {
      this.isMoneyReceived = data['result'].cash_view;
      this.isFuelReceived = data['result'].fuel_view;
      this.isBataReceivaed = data['result'].batta_view;
      this.invoiceDetails();

    })
  }

  invoiceDetails() {
    this.invoiceSubscription=this.invoiceId.subscribe(data => {
      this.isGotComment=false;
      this.commentData.object_id =data;
      this._performainvoiceService.getInvoicePrintView(data).subscribe((response: any) => {
        this.invoiceData = response.result;
        this.isGotComment = this.invoiceData.party.has_portal_access;
        if(response.result.signature){
          this.digitalSignature = response.result.signature.document
        }
        this.isTPEmpty = this.evaluateEmptyTP(response.result.challan.challans_v1.annexure)
        this.isNewTPEmpty = this.evaluateEmptyNewTP(response.result.challan.challans_v2.annexure)
        this.isLRNoEmpty = this.evaluateEmptyLRNo(response.result.challan.challans_v2.annexure)
        this.isFixedQty = this.evaluateFixedQty(response.result.challan.challans_v2.annexure)
        if (this.defaultDownload) {
          setTimeout(() => { this.downloadPdf(this.invoiceData, false); }, 1500);
        }

        setTimeout(() => {
          const pdf = this.pdfGenerateView(this.invoiceData)
          const pdfDocGenerator = pdfMake.createPdf(pdf);
          pdfDocGenerator.getDataUrl((dataUrl) => {
            this.pdfSrc = dataUrl
          });
        }, 1500);
        this.checkToShowNewAdvanceValue()
        this.initializeExistence()
      });
    });

  }
  openDetails(): void {
    this.routeToDetail=!this.routeToDetail;
    this.openDetailsEmitter.next(this.routeToDetail)
   }

  initializeExistence() {
    this.otherDetailExists = false;
    this.tripDataExists = false;
    if (this.invoiceData['other_items'].length > 0) {
      this.otherDetailExists = true;
    }
    if (this.invoiceData['challan']['challans_v2']['challan_data'].length > 0) {
      this.tripDataExists = true;
    }
  }



  transactionStatus(status: boolean) {
    return isReverseMechanism(status);
  }


  findRoute(name: string) {
    for (let index in this.routeDetail) {
      if (this.routeDetail[index].name == name) {
        return this.routeDetail[index]
      }
    }
    return {}
  }

  evaluateEmptyTP(data) {
    let flag: boolean = false;
    for (let index in data) {
      flag = checkEmptyDataKey(data[index].challans, "work_order_no")
      if (!flag) {
        return false
      }
    }
    return true
  }

  evaluateEmptyNewTP(data) {
    let flag: boolean = false;
    for (let index in data) {
      flag = data[index].work_order_no || data[index].tp_no
      if (flag) {
        return false
      }
    }
    return true
  }

  evaluateEmptyLRNo(data) {
    let flag: boolean = false;
    for (let index in data) {
      flag = data[index].estimate.cn_no
      if (flag) {
        return false
      }
    }
    return true
  }

  evaluateFixedQty(data) {
    let flag: boolean = false;
    for (let index in data) {
      flag = data[index].estimate.qty == 'Jobs'
      if (!flag) {
        return false
      }
    }
    return true
  }

  getRowSpanValue(index_value: number) {
    let annexure_array = this.invoiceData.challan.challan_v1.annexure[index_value].challans as Array<any>;
    return annexure_array.length
  }

  dateChange(date) {
    return normalDate(date);
  }

  emptyState(data) {
    if (data) {
      return data;
    }
    return '0';
  }

  nullState(data) {
    if (data) {
      return data;
    }
    return '-';
  }

  downloadPdf(data, print: boolean = false) {
    this.processPdf(data, print);
  }

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

  addDigitalSignatureColumn() {
    const digitalSignature = this.digitalSignature;

    let no_img_col = [{ text: '', style: 'logo', width: 100 }, { text: '', style: 'logo', width: 100 }];

    let img_col = [{ text: '', style: 'logo', width: 10 },{ image: '', style: 'logo', width: 140,alignment: "right", height: 30,margin:[0,0,10,0] }];

    if (digitalSignature) {
      img_col[1].image = 'data:image/png;base64,' + digitalSignature
      return img_col
    }
    return no_img_col
  }

  createPdfDownload(data, fileTitleAnnexure, fileNameAnnexure, fileTitle, fileName, annexure = true) {


      if (this.excludeAnnexure) {
        setTimeout(() => {
          let filenameA = fileName + "_" + this.generateFileName()+".pdf";
          const pdfDocGenerator = pdfMake.createPdf(this.pdfGenerateOriginalWOAnnexure(data, fileTitle));
          pdfDocGenerator.getBlob((blob) => {
            this._fileDownload.writeAndOpenFile(blob, filenameA).then(data => {
            });
          });
        }, 500);
      } else {
        setTimeout(() => {
          let filenameB = fileName + "_" + this.generateFileName()+".pdf";
          const pdfDocGenerator = pdfMake.createPdf(this.pdfGenerateOriginal(data, fileTitle));
          pdfDocGenerator.getBlob((blob) => {
            this._fileDownload.writeAndOpenFile(blob, filenameB).then(data => {
            });
          });
        }, 500);

        if (annexure) {
          setTimeout(() => {
            let filenameC = fileNameAnnexure + "_" + this.generateFileName()+".pdf";
            const pdfDocGenerator = pdfMake.createPdf(this.generatePDFAnnexure(data, fileTitleAnnexure));
            pdfDocGenerator.getBlob((blob) => {
              this._fileDownload.writeAndOpenFile(blob, filenameC).then(data => {
              });
            });
          }, 500);
        }


    }


  }


  processPdf(data, print: Boolean = false) {
    this.ngxService.start();
    let fileTitle = 'PROFORMA INVOICE';
    let fileTitleAnnexure = 'ANNEXURE'
    let fileName = 'Proforma invoice'
    let fileNameAnnexure = 'ANNEXURE'
    if (print) {
      if (this.excludeAnnexure) {
        pdfMake.createPdf(this.pdfGenerateOriginalWOAnnexure(data, fileTitleAnnexure)).print({}, window.frames['printPdf']);
      } else {
        pdfMake.createPdf(this.pdfGenerateOriginal(data, fileTitle)).print({}, window.frames['printPdf']);
        pdfMake.createPdf(this.generatePDFAnnexure(data, fileTitleAnnexure)).print({}, window.frames['printPdf']);
      }
    } else {

      if (this.createCopySeleted == 0) {
        this.createPdfDownload(data, fileTitleAnnexure, fileNameAnnexure, fileTitle, fileName)
      }

    }
    setTimeout(() => {
      this.ngxService.stop();
    }, 500);
  }

  pdfGenerateView(data) {
    const content1 = this.pdfDataGenerationV2(data, "Annexure", 'annexure')
    const content2 = this.pdfDataGenerationV2(data, "PROFORMA INVOICE", 'original')
    return this.pdfPageCreation([content2, content1])
  }

  generatePDFAnnexure(data, title) {
    const content = this.pdfDataGenerationV2(data, title, 'annexure')
    return this.pdfPageCreation([content])
  }

  pdfGenerateOriginal(data, title) {
    const content = this.pdfDataGenerationV2(data, title, 'original')
    return this.pdfPageCreation([content])
  }

  pdfGenerateOriginalWOAnnexure(data, title) {
    const content = this.pdfDataGenerationV2(data, title, 'original_wo_annexure')
    return this.pdfPageCreation([content])
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

  generateFileName() {
    // let partyName = this.invoiceData['party']['display_name'];
    let invoiceNumber = this.invoiceData['invoice_number'];
    return `${invoiceNumber}`;
  }

  createCopySelect(i) {
    this.createCopySeleted = i;
    this.showOptions = false;
    this.showEmailOptions = false;
  }





  createAnnexureTripData(data, showTax: boolean = true) {
    let GSTTYPE='IGST';
        if(this.isTds){
          GSTTYPE='VAT'
        }
    let sectionData = [];
    let borderAdd = [];
    let totalColumns = 0
    let totalCommonRow = 1
    let qtyPosition = 3
    let ratePosition = 3
    let taxPosition = 5
    let materialPosition = 2

    sectionData.push([
    { text: "Date", bold: true, border: [true, true, false, true] },
    { text: "Vehicle No.", bold: true, border: [false, true, false, true] },

    { text: "Start - End", bold: true, border: [false, true, false, true] },
    { text: "Freight" + '(' + this.currency_type.symbol + ')', bold: true, border: [false, true, false, true] },
    { text: "Charges/Deductions" + '(' + this.currency_type.symbol + ')', bold: true, border: [false, true, false, true] },
    { text: "Amount" + '(' + this.currency_type.symbol + ')', bold: true, border: [false, true, true, true] }])

    if (!(this.isMaterial && this.isFixedQty)) {
      qtyPosition += 1
      taxPosition += 1
      ratePosition += 1
      sectionData[0].splice(materialPosition, 0, { text: "Material", bold: true, border: [false, true, false, true] })
    }

    if (!this.isFixedQty) {
      taxPosition += 3
      sectionData[0].splice(qtyPosition, 0, { text: "Charged QTY", bold: true, border: [false, true, false, true] })
      sectionData[0].splice(qtyPosition, 0, { text: "QTY", bold: true, border: [false, true, false, true] })

      ratePosition += 2
      sectionData[0][ratePosition].text = "Rate" + '(' + this.currency_type.symbol + ')'
      sectionData[0].splice(ratePosition+1, 0,  { text: "Shortage/Extra", bold: true, border: [false, true, false, true] })

    }

    if (this.isTax && showTax) {
      if (!this.invoiceData.tax_detail.is_intrastate) {
        sectionData[0].splice(taxPosition, 0, { text: GSTTYPE, bold: true, border: [false, true, false, true] })
      } else {
        sectionData[0].splice(taxPosition, 0, { text: 'CGST', bold: true, border: [false, true, false, true] })
        sectionData[0].splice(taxPosition, 0, { text: 'SGST', bold: true, border: [false, true, false, true] })
      }
    }

    totalColumns = sectionData[0].length

    if (!this.isNewTPEmpty) totalCommonRow += 1

    if (this.isNewAdvanceGreaterThenZero) totalCommonRow += 1
    const equalAllotment = Math.floor(totalColumns / totalCommonRow)
    const extraAllotment = totalColumns % totalCommonRow

    for (let i = 0; i < data.length; i++) {
      let tripData = data[i].estimate
      const innerRow = [
      { text: tripData['date'], border: [true, false, false, false] },
      { text: tripData['vehicle'], border: [false, false, false, false] },
      { text: tripData['from-to'], border: [false, false, false, false] },
      { text: tripData['rate'], border: [false, false, false, false] },
      { text: tripData['adjustment'], border: [false, false, false, false] },
      { text: tripData['amount'], border: [false, false, true, false] }]
      if (!(this.isMaterial && this.isFixedQty)) {
        innerRow.splice(materialPosition, 0, { text: tripData['material'], border: [false, false, false, false] },)
      }

      if (!this.isFixedQty){
        innerRow.splice(qtyPosition, 0, { text: tripData['charged_qty'], border: [false, false, false, false] })
        innerRow.splice(qtyPosition, 0, { text: tripData['qty'], border: [false, false, false, false] })
        innerRow.splice(ratePosition+1, 0, { text: tripData['s_qty'], border: [false, false, false, false] },)
      }

      if (this.isTax && showTax) {
        if (!this.invoiceData.tax_detail.is_intrastate) {
          const igst = {
            text:
              [checkEmpty(data[i], ['tax_description', 'IGST'], true) + '%', '\n',
              { text: '' + checkEmpty(data[i], ['tax_description', 'IGST_amount'], true) }],
            border: [false, false, false, false]
          }
          innerRow.splice(taxPosition, 0, igst)

        } else {
          const cgst = {
            text:
              [{ text: checkEmpty(data[i], ['tax_description', 'CGST'], true) + '%' }, '\n',
              { text: '' + checkEmpty(data[i], ['tax_description', 'CGST_amount'], true) }],
            border: [false, false, false, false]
          }
          innerRow.splice(taxPosition, 0, cgst)

          const sgst = {
            text:
              [{ text: checkEmpty(data[i], ['tax_description', 'SGST'], true) + '%' }, '\n',
              { text: '' + checkEmpty(data[i], ['tax_description', 'SGST_amount'], true) }],
            border: [false, false, false, false]
          }
          innerRow.splice(taxPosition, 0, sgst)
        }
      }

      sectionData.push(innerRow)

      let commonRow = []
      let nextSplice = 0
      for (let i = 0; i < totalColumns; i++) { commonRow.push({}) }
      if (!this.isNewTPEmpty) {
        commonRow.splice(nextSplice, 1, {
          text: [{ text: `Work Order No: ${data[i].work_order_no}` }],
          colSpan: equalAllotment, bold: true, alignment: 'left'
        })
        nextSplice = equalAllotment
      }


      let charges = data[i].charges_deductions
      let chargesSection = []
      for (let j = 0; j < charges.length; j++) {
        if (this.excludeAnnexure && j+1%2==0) this.challanLength += 2
        chargesSection.push({ text: `${charges[j].name}: ${charges[j].amount}\n` })
      }
      commonRow.splice(nextSplice, 1, {
        columns: [{ width: "40%", text: "Charges and Deductions:", bold: true },
        { width: "60%", margin: [0, 0, 10, 0], alignment: 'right', text: chargesSection }],
        colSpan: equalAllotment + extraAllotment
      })
      nextSplice += equalAllotment + extraAllotment

      if (this.isNewAdvanceGreaterThenZero) {
        if (this.excludeAnnexure && charges.length == 0) this.challanLength += 1;
        const advances = data[i].advances
        let advanceSection = []
        if (this.isFuelReceived && advances.fuel > 0) {
          advanceSection.push({ text: `Fuel: ${advances.fuel}\n` })
        }

        if (this.isBataReceivaed && advances.batta > 0) {
          advanceSection.push({ text: `Batta: ${advances.batta}\n` })
        }

        if (this.isMoneyReceived && advances.advance > 0) {
          advanceSection.push({ text: `Advance: ${advances.advance}\n` })
        }

        commonRow.splice(nextSplice, 1, {
          columns: [{ width: "40%", text: "Advances:", bold: true },
          { width: "60%", margin: [0, 0, 10, 0], alignment: 'right', text: advanceSection }], colSpan: equalAllotment
        })
      }

      sectionData.push(commonRow);
      borderAdd.push(sectionData.length-1)

      let customFieldData = data[i].custom_fields_data;
      if (customFieldData.length > 0 && customFieldData[0].length > 0) {
        let customFieldRow = []
        let customFieldNextSplice = 0
        const customFieldEqualAllotment = Math.floor(totalColumns / 4)
        const customFieldExtraAllotment = totalColumns % 4
        let customFieldExtraAlloted = 0
        for (let i = 0; i < totalColumns; i++) { customFieldRow.push({ text: "", border: [false, true, false, true]}) }


        // Transporse 2D Array
        customFieldData = customFieldData[0].map((_, colIndex) => customFieldData.map(row => row[colIndex]));

        for (let i = 0; i < customFieldData.length; i++) {
          let customFieldCol = []
          for (let j = 0; j < customFieldData[i].length; j++) {
              if (customFieldData[i][j] != undefined) {
                customFieldCol.push({ text: customFieldData[i][j]['key'] + ':' + customFieldData[i][j]['value'] + '\n'})
              }
          }

          let colSpan = customFieldEqualAllotment
          if (customFieldExtraAlloted < customFieldExtraAllotment) {
            colSpan += 1
            customFieldExtraAlloted += 1
          }

          customFieldRow.splice(customFieldNextSplice, 1, {
            columns: [{alignment: 'left', text: customFieldCol}], colSpan: colSpan, border: [false, true, false, true]
          })

          if (customFieldData.length-1 == i){
            customFieldRow[customFieldNextSplice].border = [false, true, false, true]
          }
          customFieldNextSplice += colSpan
        }

        customFieldRow[0].border = [true, true, false, true]
        customFieldRow[totalColumns-1].border = [false, true, true, true]
        sectionData.push(customFieldRow);
        borderAdd.push(sectionData.length-1)
      }

    }

    const oldLength = sectionData.length
    this.challanLength += sectionData.length;
    if (this.excludeAnnexure && !this.addToOthers) {
      for (let i=0; i< 10-this.challanLength; i++) {
        let arr = Array(sectionData[0].length).fill({text: "\n\n"})
        arr[0].colSpan = sectionData[0].length
        sectionData.push(arr)
      }
    }

    const widthString = (100 / sectionData[0].length).toFixed(3);
    const itemChallanWidths = Array(sectionData[0].length).fill(widthString + "%");
    if (this.addToOthers) return [sectionData, borderAdd, itemChallanWidths, 10000]
    return [sectionData, borderAdd, itemChallanWidths, oldLength]
  }

  createTripData(data) {
    let item_challans = []
    let GSTTYPE='IGST';
    if(this.isTds){
      GSTTYPE='VAT'
    }
    item_challans.push([{ text: "Job Count", bold: true }, { text: "Qty.", bold: true },
    { text: "Unit Cost" + '(' + this.currency_type.symbol + ')', bold: true },
    { text: "Amount" + '(' + this.currency_type.symbol + ')', bold: true },
    { text: "Charges" + '(' + this.currency_type.symbol + ')', bold: true },
    { text: "Deductions" + '(' + this.currency_type.symbol + ')', bold: true },
    { text: "Final Amount" + '(' + this.currency_type.symbol + ')', bold: true }])

    data.forEach(ele => {
      item_challans.push([
        { text: ele['trip_count'], bold: false }, { text: `${ele['qty']}`, bold: false },
        { text: ele['rate'], bold: false }, { text: ele['amount'], bold: false },
        { text: ele['charge'], bold: false }, { text: ele['deduction'], bold: false },
        { text: ele['final_amount'], bold: false }
      ])
    });

    if (this.isTax) {
      if (!this.invoiceData.tax_detail.is_intrastate) {
        item_challans[0].splice(6, 0, { text: GSTTYPE, bold: true })
        data.forEach((ele, j) => {
          item_challans[1 + j].splice(6, 0,
            {
              text:
                [checkEmpty(ele, ['tax_description', 'IGST'], true) + '%', '\n',
                { text: '' + checkEmpty(ele, ['tax_description', 'IGST_amount'], true) }]
            })
        });
      } else {
        item_challans[0].splice(6, 0, { text: 'CGST', bold: true })
        item_challans[0].splice(6, 0, { text: 'SGST', bold: true })
        data.forEach((ele, j) => {
          item_challans[1 + j].splice(6, 0,
            {
              text:
                [{ text: checkEmpty(ele, ['tax_description', 'CGST'], true) + '%' }, '\n',
                { text: '' + checkEmpty(ele, ['tax_description', 'CGST_amount'], true) }]
            })
          item_challans[1 + j].splice(6, 0,
            {
              text:
                [{ text: checkEmpty(ele, ['tax_description', 'SGST'], true) + '%' }, '\n',
                { text: '' + checkEmpty(ele, ['tax_description', 'SGST_amount'], true) }]
            })
        });
      }
    }


    const oldLength = item_challans.length
    this.challanLength += item_challans.length;
    if (!this.addToOthers) {
      for (let i=0; i< 10-this.challanLength; i++)
      item_challans.push(Array(item_challans[0].length).fill({text: "\n\n"}))
    }

    const widthString = (100 / item_challans[0].length).toFixed(3);
    const itemChallanWidths = Array(item_challans[0].length).fill(widthString + "%");
    if (this.addToOthers) return [item_challans, itemChallanWidths, 10000]
    return [item_challans, itemChallanWidths, oldLength]
  }


  createOtherItemData(data) {
    let otherItems = [];
    let GSTTYPE='IGST';
        if(this.isTds){
          GSTTYPE='VAT'
        }

    otherItems.push([{ text: 'Item', bold: true },
     { text: 'Qty', bold: true },
    { text: 'Unit Cost' + '(' + this.currency_type.symbol + ')', bold: true },
    { text: 'Amount' + '(' + this.currency_type.symbol + ')', bold: true },
    { text: 'Discount' + '(' + this.currency_type.symbol + ')', bold: true },
    { text: 'Total' + '(' + this.currency_type.symbol + ')', bold: true }])

    data.forEach((ele, i) => {
      otherItems.push([
        checkEmpty(ele, ['item', 'name']), checkEmpty(ele, ['quantity'], true),
        { text: checkEmpty(ele, ['unit_cost'], true) }, { text: checkEmpty(ele, ['amount_before_tax'], true) },
        { text: checkEmpty(ele, ['discount'], true) },
        { text: checkEmpty(ele, ['total_amount'], true) }
      ]);
    });

    if (this.isTax) {
      if (!this.invoiceData.tax_detail.is_intrastate) {
        otherItems[0].splice(5, 0, { text: GSTTYPE, bold: true })
        data.forEach((ele, j) => {
          otherItems[1 + j].splice(5, 0,
            {
              text:
                [checkEmpty(ele, ['tax_description', 'IGST'], true) + '%', '\n',
                { text: '' + checkEmpty(ele, ['tax_description', 'IGST_amount'], true) }]
            })
        });
      } else {
        otherItems[0].splice(5, 0, { text: 'CGST', bold: true })
        otherItems[0].splice(5, 0, { text: 'SGST', bold: true })
        data.forEach((ele, j) => {
          otherItems[1 + j].splice(5, 0,
            {
              text:
                [{ text: checkEmpty(ele, ['tax_description', 'CGST'], true) + '%' }, '\n',
                { text: '' + checkEmpty(ele, ['tax_description', 'CGST_amount'], true) }]
            })
          otherItems[1 + j].splice(5, 0,
            {
              text:
                [{ text: checkEmpty(ele, ['tax_description', 'SGST'], true) + '%' }, '\n',
                { text: '' + checkEmpty(ele, ['tax_description', 'SGST_amount'], true) }]
            })
        });
      }
    }

    const oldLength = otherItems.length
    this.challanLength += otherItems.length;
    for (let i=0; i< 10-this.challanLength; i++)
    otherItems.push(Array(otherItems[0].length).fill({text: "\n\n"}))

    const widthString = (100 / otherItems[0].length).toFixed(3);
    const itemChallanWidths = Array(otherItems[0].length).fill(widthString + "%");
    return [otherItems, itemChallanWidths, oldLength]
  }

  createOtherItemDataWoExtend(data) {
    let otherItems = [];
    let GSTTYPE='IGST';
    if(this.isTds){
      GSTTYPE='VAT'
    }
    otherItems.push([{ text: 'Item', bold: true },
    { text: 'Qty', bold: true },
    { text: 'Unit Cost' + '(' + this.currency_type.symbol + ')', bold: true },
    { text: 'Amount' + '(' + this.currency_type.symbol + ')', bold: true },
    { text: 'Discount' + '(' + this.currency_type.symbol + ')', bold: true },
    { text: 'Total' + '(' + this.currency_type.symbol + ')', bold: true }])

    data.forEach((ele, i) => {
      otherItems.push([
        checkEmpty(ele, ['item', 'name']), checkEmpty(ele, ['quantity'], true),
        { text: checkEmpty(ele, ['unit_cost'], true) }, { text: checkEmpty(ele, ['amount_before_tax'], true) },
        { text: checkEmpty(ele, ['discount'], true) },
        { text: checkEmpty(ele, ['total_amount'], true) }
      ]);
    });

    if (this.isTax) {
      if (!this.invoiceData.tax_detail.is_intrastate) {
        otherItems[0].splice(5, 0, { text: GSTTYPE, bold: true })
        data.forEach((ele, j) => {
          otherItems[1 + j].splice(5, 0,
            {
              text:
                [checkEmpty(ele, ['tax_description', 'IGST'], true) + '%', '\n',
                { text: '' + checkEmpty(ele, ['tax_description', 'IGST_amount'], true) }]
            })
        });
      } else {
        otherItems[0].splice(5, 0, { text: 'CGST', bold: true })
        otherItems[0].splice(5, 0, { text: 'SGST', bold: true })
        data.forEach((ele, j) => {
          otherItems[1 + j].splice(5, 0,
            {
              text:
                [{ text: checkEmpty(ele, ['tax_description', 'CGST'], true) + '%' }, '\n',
                { text: '' + checkEmpty(ele, ['tax_description', 'CGST_amount'], true) }]
            })
          otherItems[1 + j].splice(5, 0,
            {
              text:
                [{ text: checkEmpty(ele, ['tax_description', 'SGST'], true) + '%' }, '\n',
                { text: '' + checkEmpty(ele, ['tax_description', 'SGST_amount'], true) }]
            })
        });
      }
    }

    const widthString = (100 / otherItems[0].length).toFixed(3);
    const itemChallanWidths = Array(otherItems[0].length).fill(widthString + "%");
    return [otherItems, itemChallanWidths]
  }

  addCalculations(data) {
    const arr = []

    if (data['total_challan_amount'] > 0) {
      arr.push(["Subtotal Challan:",
        `${this.currency_type.symbol} ${data['total_challan_amount']}`, false])
    }
    if (data['total_others_amount'] > 0) {
      arr.push(["Subtotal Others:",
        `${this.currency_type.symbol} ${data['total_others_amount']}`, false])
    }

    arr.push(["Total:", `${this.currency_type.symbol} ${data['subtotal']}`, true])
    if (this.isTax) {
      arr.push(["Tax Amount: ", `${this.currency_type.symbol} ${data.tax_detail.tax.total_amount}`, true])
    }

    if (data['adjustment_account'] && data['total_adjustment'] > 0) {
      arr.push([`${data['adjustment_account']['name']}:`,
      `${this.currency_type.symbol} ${data['total_adjustment']}`, false])
    }
    arr.push(["Round Off:", `${this.currency_type.symbol} ${data['roundoff_amount']}`, false])
    arr.push(["Proforma Invoice Amount:", `${this.currency_type.symbol} ${data['total_amount']}`, true])
    if (this.isMoneyReceived && data['trip_advance_data']['advance'] > 0) {
      arr.push(["Advance:", `${this.currency_type.symbol} ${data['trip_advance_data']['advance']}`, false])
    }
    if (this.isBataReceivaed && data['trip_advance_data']['batta'] > 0) {
      arr.push(["Batta:", `${this.currency_type.symbol} ${data['trip_advance_data']['batta']}`, false])
    }
    if (this.isFuelReceived && data['trip_advance_data']['fuel'] > 0) {
      arr.push(["Fuel:", `${this.currency_type.symbol} ${data['trip_advance_data']['fuel']}`, false])
    }
    arr.push(["Balance:", `${this.currency_type.symbol} ${data['due_amount']}`, true])
    arr.push(["Total in Words:", data['due_amount_in_word'], true]);
    for (let index = 0; index < 10; index++) {
      arr.push(['', '', true])

    }
    arr.push(['For ' + data['company']['company_name'] + ':', '', true])
    return arr
  }

  addCal(cals) {
    const digitalSignature = this.addDigitalSignatureColumn();
    let tempArr = []
    for (let i = 0; i < cals.length; i++) {
      tempArr.push([{ text: cals[i][0], alignment: "right", bold: cals[i][2] },
      { text: cals[i][1], alignment: "right", bold: cals[i][2] }])

    }
    tempArr.push(digitalSignature);
    return tempArr
  }

  pdfDataGenerationV2(data, fileTitle, type) {
    this.challanLength = 0
    this.addToOthers = false
    const contactPerson = data['contact_person']
    const customerName = data['party']['company_name']
    const seqNo = data['invoice_number']
    const companyName = data['company']['company_name']
    const companyAddress = addressToText(data.company.address.filter((ele) => ele.address_type_index == 0)[data.company.address.length ? data.company.address.length / 2 - 1 : 0], 1, -1)
    const companyMobileMail = `Mobile No: ${data['company']['primary_mobile_number']} | Mail: ${data['company']['email_address']}`
    const companyGstPan = this.isTds?'TRN: '+`${data['company']['gstin']}`+' CRN: '+`${data['company']['crn_no']}`:'GSTIN | PAN'+`: ${data['company']['gstin']} | ${data['company']['pan']}`
     const customerCRN = data['party']['tax_details']['crn_view']
    const companyLogo = addImageColumn(this.company_logo)
    const customerGstPan = data['party']['tax_details']['gstin_view'] ? data['party']['tax_details']['gstin_view'] : ''
    const customerPos = data['place_of_supply']
    const customerMob = data['party']['mob_number']
    const customerBillingAdd = addressToText(data.address.filter((ele) => ele.address_type_index == 0)[0], 1, -1)
    const customerShippingAdd = addressToText(data.address.filter((ele) => ele.address_type_index == 1)[0], 1, -1)
    const customerCopyFor = fileTitle
    const bosNumber = data['invoice_number']
    const empName = checkEmpty(data,['employee','display_name'])
    const bosDate = data['invoice_date']
    const dueDate = data['due_date'] ? data['due_date'] : ""
    const isReverseCharge = data['is_transaction_under_reverse'] ? "Yes" : "No"
    const term = checkEmpty(data, ['payment_term_meta', 'label'])
    const accountNo = checkEmpty(data, ['bank_account', 'account_number'])
    const accountHolder = checkEmpty(data, ['bank_account', 'account_holder_name'])
    const ifscCode = checkEmpty(data, ['bank_account', 'ifsc_code']);
    const swiftCode =  checkEmpty(data, ['bank_account', 'swift_code']);
    const ibanCode = checkEmpty(data, ['bank_account', 'iban_code']);
    const termsConditions = data['optional_comments']
    const disclaimer =data['disclaimer'];
    const arr = this.addCalculations(data);

    if (data['other_items'].length>0) {
      this.addToOthers = true;
    }

    const tripsAmount = this.createTripData(data['challan']['challans_v2']['challan_data'])
    const annexureTripSectionData = this.createAnnexureTripData(data['challan']['challans_v2']['annexure'])
    const otherItemRows = this.createOtherItemData(data['other_items'])
    const otherItemRowsWOExtend = this.createOtherItemDataWoExtend(data['other_items'])


    const annexureHeaderSection = {
      width: "*",
      table: {
        widths: ["49.9%", "0.2%", "49.9%"],
        body: [
          [{
            width: "*",
            fontSize: 9,
            stack: [{ text: `Customer: ${customerName}\n`, bold: true },
            { text: `Proforma Invoice No: ${seqNo}\n` }]
          },

          { text: "", border: [false, false, false] },

          {
            width: "*",
            alignment: 'center',
            margin: [0, 0, 0, 0],
            fontSize: 18,
            bold: true,
            text: "ANNEXURE\n"
          }
          ]]
      }
    }

    const annexureTripTable = {
      margin: [0, 5, 0, 0],
      width: "*",
      headerRows: 1,
      fontSize: 9,
      alignment: 'center',
      table: {
        widths: annexureTripSectionData[2],
        body: annexureTripSectionData[0]
      },
      layout: {

        paddingTop: function (i, node) { return 5 },
        paddingBottom: function (i, node) { return 5 },
        hLineWidth: function (i, node) {
          return (i === 0 || i === node.table.body.length || (i <=  Number(annexureTripSectionData[3]) && !this.addToOthers)) ? 1 : 0;
        },
        hLineStyle: function (i, node) {
          if (i === 0 || i === node.table.body.length || (!Array(annexureTripSectionData[1]).includes(i) && !this.addToOthers)) {
            return null;
          }
          return { dash: { length: 4, space: 3 } };
        },
        vLineStyle: function (i, node) {
          if (i === 0 || i === node.table.widths.length) {
            return null;
          }
          return { dash: { length: 4, space: 3 } };
        },
      }
    }

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

    this.footerDetails={
      companyName:companyName,
      contactEmail:data['company']['email_address'],
      contactNumber:data['company']['primary_mobile_number']

    }

    const invoiceCopySection = { text: `${customerCopyFor}`, fontSize:11,
                                 bold: true, alignment: 'center', margin: [10, 0, 10, 10] }

    const invoiceDetailSection = {
      margin: [0, 5, 0, 0],
      width: "*",
      fontSize: 9,
      table: {
        widths: ["33.33%", "*", "33.33%"],
        body: [
          [{
            margin: [5, 5, 5, 5],
            border: [true, true, false, true],
            stack: [{ text: `Proforma Invoice No: ${bosNumber}`, bold: false, margin: [0, 0, 0, 5] },
                    { text: `Proforma Invoice Date: ${bosDate}`, bold: false, margin: [0, 0, 0, 5] }]},

          {
            margin: [5, 5, 5, 5],
            border: [false, true, false, true],
            stack: [{ text: `Terms: ${term}`, bold: false, margin: [0, 0, 0, 5] },
                    { text: `Due Date: ${dueDate}`, bold: false, margin: [0, 0, 0, 5] }]},

          {
            margin: [5, 5, 5, 5],
            border: [false, true, true, true],
            stack: [{ text: `Reverse Charge: ${isReverseCharge}`, margin: [0, 0, 0, 5], bold: false },
                    { text: `Employee Name: ${empName}`, bold: false, margin: [0, 0, 0, 5] }]},
          ]
        ]
      }
    }
    if (!this.isTax) {
      const dueData = invoiceDetailSection.table.body[0][1].stack[1]
      invoiceDetailSection.table.body[0][1].stack.splice(1, 1);
      invoiceDetailSection.table.body[0][2].stack.splice(0, 1);
      invoiceDetailSection.table.body[0][2].stack.push(dueData);
    }

    let contactPersonPhn = `Contact Person: ${contactPerson}`
    const partyDetailSection: any = {
      margin: [0, 5, 0, 0],
      width: "*",
      fontSize: 9,
      table: {
        widths:"*",
        body: [
          [{
            colSpan: 2,
            border: [true, true, true, true],
            margin: [0, 0, 0, 0],
            width: "*",
            fontSize: 9,
            table: {
              widths: ["33.33%", "*", "33.33%"],
              body: [
                [{
                  border: [false, false, false, false],
                  stack: [ { text: `Customer: ${customerName}\n`, bold: true, margin: [0, 0, 0, 2] },
                  { text: `Contact No: ${customerMob}\n`, bold: false, margin: [0, 0, 0, 2] }]},

                {
                  border: [false, false, false, false],
                  stack: [{ text: this.isTds?'TRN: '+`${customerGstPan}\n`:'GSTIN: '+`${customerGstPan}\n`, margin: [0, 0, 0, 2], bold: false },
                  { text: `${contactPersonPhn}\n`, bold: false, margin: [0, 0, 0, 2] }]},

                {
                  border: [false, false, false, false],
                  stack: [{ text: `Place of Supply: ${customerPos}\n`, bold: false, margin: [0, 0, 0, 2] }]},
                ]
              ]
            }
          }, {}
          ],
          [
              { text: `Billing Address: \n${customerBillingAdd}`, bold: false,
                margin: [5, 5, 5, 5], border: [true, true, true, true] },

              { text: `Shipping Address: \n${customerShippingAdd}`, bold: false,
                margin: [5, 5, 5, 5], border: [true, true, true, true] },
          ]
        ]
      }
    }

    if(customerBillingAdd.trim() &&!customerShippingAdd.trim() ){
      partyDetailSection.table.body[1]=[
        { text: `Billing Address: \n${customerBillingAdd}`, bold: false,
        margin: [5, 5, 5, 5], border: [true, true, false, true] },

      { text: '', bold: false,
        margin: [5, 5, 5, 5], border: [false, true, true, true] },
      ]
    }

    if(!customerBillingAdd.trim() &&customerShippingAdd.trim() ){
      partyDetailSection.table.body[1]=[
        { text: `Shipping Address:\n${customerShippingAdd}`, bold: false,
        margin: [5, 5, 5, 5], border: [true, true, false, true] },

      { text: ``, bold: false,
        margin: [5, 5, 5, 5], border: [false, true, true, true] },
      ]
    }

    if(!customerBillingAdd.trim()&&!customerShippingAdd.trim() ){
      partyDetailSection.table.body.splice(1,1);
    }


    if (!this.isTax) {
      partyDetailSection.table.body[0][0].table.body[0][1].stack.splice(0, 1);
    }
    if(!this.isPlaceOfSupply){
      partyDetailSection.table.body[0][0].table.body[0][2].stack.splice(0, 1);
    }
    if(this.isTds){
      partyDetailSection.table.body[0][0].table.body[0][2].stack.splice(0, 0,
        {
          border: [false, false, false, false],
          stack: [{ text: `CRN : ${customerCRN? customerCRN :''}\n`, bold: false, margin: [0, 0, 0, 2] }]
        }
      )
    }


    const otherItemTable = {
      margin: [0, 5, 0, 0],
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
          return (i === 0 || i === node.table.body.length || (i <=  Number(otherItemRows[2]))) ? 1 : 0;
        },
        vLineWidth: function (i, node) {
          return (i === 0 || i === node.table.widths.length) ? 1 : 0;
        },
        hLineColor: function (i, node) {
          return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
        },
        vLineColor: function (i, node) {
          return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
        },
        paddingTop: function (i, node) { return 5 },
        paddingBottom: function (i, node) { return 5 },
      }
    }

    const otherItemTableWOExtend = {
      margin: [0, 5, 0, 0],
      width: "*",
      headerRows: 1,
      fontSize: 9,
      alignment: 'center',
      table: {
        widths: otherItemRowsWOExtend[1],
        body: otherItemRowsWOExtend[0]
      },
      layout: {
        vLineWidth: function (i, node) {
          return (i === 0 || i === node.table.widths.length) ? 1 : 0;
        },
        hLineColor: function (i, node) {
          return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
        },
        vLineColor: function (i, node) {
          return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
        },
        paddingTop: function (i, node) { return 5 },
        paddingBottom: function (i, node) { return 5 },
      }
    }

    const tripsTable = {
      margin: [0, 5, 0, 0],
      width: "*",
      headerRows: 1,
      fontSize: 9,
      alignment: 'center',
      table: {
        widths: tripsAmount[1],
        body: tripsAmount[0]
      },
      layout: {
        hLineWidth: function (i, node) {
          return (i === 0 || i === node.table.body.length || (i <=  Number(tripsAmount[2]) && !this.addToOthers)) ? 1 : 0;
        },
        vLineWidth: function (i, node) {
          return (i === 0 || i === node.table.widths.length) ? 1 : 0;
        },
        hLineColor: function (i, node) {
          return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
        },
        vLineColor: function (i, node) {
          return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
        },
        paddingTop: function (i, node) { return 5 },
        paddingBottom: function (i, node) { return 5 },
      }
    }

    let bankDetails= [{ text: "Bank Detail:\n", fontSize: 9, bold: true, margin: [0, 0, 0, 2] },
    { text: `Account No: ${accountNo}\n`, fontSize: 9, margin: [0, 0, 0, 2] },
    { text: `Account Holder: ${accountHolder}\n`, fontSize: 9, margin: [0, 0, 0, 2] },
    { text: `IBAN No: ${ibanCode}\n`, fontSize: 9, margin: [0, 0, 0, 2] }
    ]

    if(this.isTax){
      if(this.isTds){
        bankDetails.push({ text: `Swift Code: ${swiftCode}\n`, fontSize: 9, margin: [0, 0, 0, 2] })
      }else{
        bankDetails.push({ text: `IFSC Code: ${ifscCode}\n`, fontSize: 9, margin: [0, 0, 0, 2] });
      }
      }else{
      bankDetails.push({ text: `Swift Code: ${swiftCode}\n`, fontSize: 9, margin: [0, 0, 0, 2] })
    }

    const bankTerms = {
      width: "50%",
      table: {
        widths: ["*"],
        body: [
          [{
            width: "*",
            stack:bankDetails }],

          [{ text: "", border: [false, false, false] }],

          [{
            width: "*",
            stack: [{ text: "Terms And Condition:\n", fontSize: 9, bold: true, margin: [0, 0, 0, 2] },
            { text: disclaimer? `${disclaimer.description}`: '' , fontSize: 9, margin: [0, 0, 0, 2] },
            { text: "Narration: ", fontSize: 9, bold: true, margin: [0, 0, 0, 2] },
            { text: `${termsConditions}`, fontSize: 9, margin: [0, 0, 0, 2] }]
          },

          ]]
      }
    }

    const calculationArr = this.addCal(arr)
    const calculations = {
      width: "50%",
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

    const bankTermsCalTable = {
      margin: [0, 10, 0, 0],
      columnGap: 10,
      columns: [
        bankTerms,
        calculations,
      ]
    }

    let content = []
    if (type == 'annexure') {
      content = [annexureHeaderSection]
      if (this.tripDataExists) content.push(annexureTripTable);
      if (this.otherDetailExists) content.push(otherItemTableWOExtend);
    }

    else if (type == 'original') {
      content = [invoiceCopySection, invoiceDetailSection, partyDetailSection]
      if (this.tripDataExists) content.push(tripsTable);
      if (this.otherDetailExists) content.push(otherItemTable);
      content.push(bankTermsCalTable);


    }

    else {
      content = [invoiceCopySection, invoiceDetailSection, partyDetailSection]
      if (this.tripDataExists) content.push(annexureTripTable);
      if (this.otherDetailExists) content.push(otherItemTable);
      content.push(bankTermsCalTable);

    }

    return content
  }


  closeDialog(e) {
    if (e) {
      this.isOpen = false;
    }
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

  createEmailPdf(data, fileTitleAnnexure, fileTitle, fileName, annexure = true) {
    let partyCompanyName = this.toTitleCase(data['party'].company_name);
    let invoiceNumber = data.invoice_number;
    let senderCompany = data.company.company_name;
    let debitAmount = data.total_amount;
    let subject = senderCompany + "|Proforma Invoice Number : " + invoiceNumber
    let userName = this.toTitleCase(localStorage.getItem('TS_USER_NAME'))

    let dataFormat = {
      base64Code: "",
      email: data['party']['email_address'],
      content: "\nHi " + partyCompanyName + " ,\n\n I hope you're well! Please see attached Proforma invoice number " + invoiceNumber + " with a Proforma invoice amount of "+this.currency_type.symbol+" " + debitAmount + ". Don't hesitate to reach out if you have any questions.\n\nKind regards,\n\n" + userName + "\n\n" + senderCompany,
      fileName: fileName + "_" + this.generateFileName(),
      subject: subject, isOpen: true
    }
    let dataFormatAnnexure = {
      base64Code: "",
      content: "\nHi " + partyCompanyName + " ,\n\n I hope you're well! Please see attached Proforma invoice number " + invoiceNumber + " with a Proforma invoice amount of " +this.currency_type.symbol+" "+ debitAmount + ". Don't hesitate to reach out if you have any questions.\n\nKind regards,\n\n" + userName + "\n\n" + senderCompany,
      fileName: fileTitleAnnexure + "_" + this.generateFileName(),
      subject: subject, isOpen: true
    }
   
    if (this.excludeAnnexure) {
      setTimeout(() => {
        pdfMake.createPdf(this.pdfGenerateOriginalWOAnnexure(data, fileTitle)).getBase64(data => {
          dataFormat.base64Code = data
          this.filebyteCode.next(dataFormat);
          this.isOpen = true;
        })
      }, 100);
    } else {
      setTimeout(() => {
        pdfMake.createPdf(this.pdfGenerateOriginal(data, fileTitle)).getBase64(data => {
          dataFormat.base64Code = data
          this.filebyteCode.next(dataFormat);
          this.isOpen = true;
        })
      }, 100);

      if (annexure) {
        setTimeout(() => {
          pdfMake.createPdf(this.generatePDFAnnexure(data, fileTitleAnnexure)).getBase64(data => {
            dataFormatAnnexure.base64Code = data
            this.filebyteCode.next(dataFormatAnnexure);
            this.isOpen = true;
          })
        }, 1000);
      }
    }
  }

  emailPopUps(data) {
    this.ngxService.start();
    let fileTitle = 'PROFORMA INVOICE';
    let fileTitleAnnexure = 'ANNEXURE'
    let fileName = 'Proforma Invoice'
    if (this.createCopySeleted == 0) {
      this.createEmailPdf(data, fileTitleAnnexure, fileTitle, fileName)
    }
    setTimeout(() => {
      this.ngxService.stop();
    }, 500);
  }

  checkToShowNewAdvanceValue() {
    if (this.invoiceData.challan.challans_v2.annexure.length == 0) {
      this.isNewAdvanceGreaterThenZero = false;
    }

    this.invoiceData.challan.challans_v2.annexure.forEach(item => {
      const advances = item.advances
      if (advances.advance > 0 || advances.fuel > 0 || advances.bata > 0) {
        this.isNewAdvanceGreaterThenZero = true;
      }
    });

    this.isNewAdvanceGreaterThenZero = this.isNewAdvanceGreaterThenZero &&
      (this.isFuelReceived || this.isMoneyReceived || this.isBataReceivaed)
  }
}