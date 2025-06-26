import { BillOfSupplyService } from '../../../../api-services/revenue-module-service/bos-service/bill-of-supply.service';
import { Component, OnInit, Input, ElementRef, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { normalDate } from 'src/app/shared-module/utilities/date-utilis';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { checkEmpty, checkEmptyDataKey, isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { CommonService } from 'src/app/core/services/common.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { SettingSeviceService } from '../../../../api-services/orgainzation-setting-module-services/setting-service/setting-sevice.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { TaxService } from 'src/app/core/services/tax.service';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { addImageColumn, addressToText, pdfGenerate } from 'src/app/shared-module/utilities/pdfmake-uitls';
import { Permission } from 'src/app/core/constants/permissionConstants';
import htmlToPdfmake from 'html-to-pdfmake';
import { formatNumber } from 'src/app/shared-module/pipes/numberformat.pipe';

@Component({
  selector: 'app-billofsupply-details',
  templateUrl: './billofsupply-details.component.html',
  styleUrls: ['./billofsupply-details.component.scss']
})
export class BillofsupplyDetailsComponent implements OnInit,OnDestroy {

  @Input() billofsupplyId: BehaviorSubject<string>;
  @ViewChild('content',{static: true}) content: ElementRef;
  @Input() defaultDownload: boolean = false;
  @Input() routeToDetail: boolean = false;
  @Output() openDetailsEmitter =new EventEmitter<boolean>();

  billOfSupplyData: any;
  address: any = {};
  company_logo: any = '';
  invoice_id: string = '';
  subtotal: number;
  sideBar: Boolean = false;
  showOptions: boolean = false;
  createCopySeleted = 0;
  excludeAnnexure: boolean = false;
  isTPEmpty: boolean = false;
  isNewTPEmpty: boolean = false;
  currency_type;
  otherDetailExists: boolean = false;
  oldTripDataExists: boolean = false;
  tripDataExists: boolean = false;
  pdfSrc: string = ""
  isOpen = false;
  showEmailOptions: boolean = false;
  filebyteCode = new BehaviorSubject(null);
  isAdvanceGreaterThenZero: boolean = false;
  isMoneyReceived: boolean = false;
  isFuelReceived: boolean = false;
  isBataReceivaed: boolean = false;
  isNewAdvanceGreaterThenZero: boolean = false;
  preFixUrl = '';
  isMobile = false;
  digitalSignature = '';
  isTax: boolean = false;
  isLRNoEmpty = false;
  isFixedQty = false;
  challanLength = 0
  addToOthers = false;
  isTDS=false;
  companyHeaderDetails:any;
  footerDetails:any;
  bosPermission = Permission.bos.toString().split(',');
  bosSubscription: Subscription;
  isPlaceOfSupply: boolean = false;


  constructor(
    private _billOfSupplyService: BillOfSupplyService,
    private _commonService: CommonService,
    private ngxService: NgxUiLoaderService,
    private currency: CurrencyService,
    private _advances: SettingSeviceService,
    private _preFixUrl: PrefixUrlService,
    private deviceService: DeviceDetectorService,
    private _fileDownload:FileDownLoadAandOpen,
    private _tax: TaxService,
  ) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    this.isMobile = this.deviceService.isMobile();
    this.isPlaceOfSupply = this._tax.isPlaceOfSupply();
  }
  ngOnDestroy(): void {
    this.bosSubscription.unsubscribe()
  }
  
  openDetails(): void {
    this.routeToDetail=!this.routeToDetail;
    this.openDetailsEmitter.next(this.routeToDetail)
   }

  ngOnInit() {
    this.isTax = this._tax.getTax();
    this.isTDS=this._tax.getVat();
    this.preFixUrl = this._preFixUrl.getprefixUrl();
    this._commonService.fetchCompanyLogo().subscribe((response: any) => {
      this.company_logo = response.result.image_blob;
    }, (err) => {
      this.company_logo = null;

    });

    setTimeout(() => {
      this.currency_type = this.currency.getCurrency();
    }, 1000);
    this.getBillOfSupplyDetail();
  }

  getBillOfSupplyDetail() {
   this.bosSubscription= this.billofsupplyId.subscribe((id) => {
      this._billOfSupplyService.getBillOfSupplyPrintView(id).subscribe((response) => {
        this.billOfSupplyData = response.result;
        if(this.billOfSupplyData.signature){
          this.digitalSignature = this.billOfSupplyData.signature.document
        }

        this.isTPEmpty = this.evaluateEmptyTP(response.result.challan.challans_v1.annexure)
        this.isNewTPEmpty = this.evaluateEmptyNewTP(response.result.challan.challans_v2.annexure)
        this.isLRNoEmpty = this.evaluateEmptyLRNo(response.result.challan.challans_v2.annexure)
        this.isFixedQty = this.evaluateFixedQty(response.result.challan.challans_v2.annexure)
        if (this.defaultDownload) {
          setTimeout(() => { this.downloadPdf(this.billOfSupplyData, false); }, 1500);
        }

        setTimeout(() => {
          const pdf = this.pdfGenerateView(this.billOfSupplyData)
          const pdfDocGenerator = pdfMake.createPdf(pdf);
          pdfDocGenerator.getDataUrl((dataUrl) => {
            this.pdfSrc = dataUrl
          });
        }, 1500);

        this.checkAdvanceValue();
        this.checkToShowNewAdvanceValue()
        this.initializeExistence();

      });

      this._advances.getAdvances('bos').subscribe(data => {
        this.isMoneyReceived = data['result'].cash_view;
        this.isFuelReceived = data['result'].fuel_view;
        this.isBataReceivaed = data['result'].batta_view;
      })
    });
  }

  checkAdvanceValue() {
    if (this.billOfSupplyData.challan.challans_v1.annexure.length == 0) {
      this.isAdvanceGreaterThenZero = false;
    }
    this.billOfSupplyData.challan.challans_v1.annexure.forEach(item => {
      if (item.advance > 0 || item.fuel > 0 || item.bata > 0) {
        this.isAdvanceGreaterThenZero = true;
      }
    });
    this.isAdvanceGreaterThenZero = this.isAdvanceGreaterThenZero &&
      (this.isFuelReceived || this.isMoneyReceived || this.isBataReceivaed)
  }

  checkToShowNewAdvanceValue() {
    if (this.billOfSupplyData.challan.challans_v2.annexure.length == 0) {
      this.isNewAdvanceGreaterThenZero = false;
    }

    this.billOfSupplyData.challan.challans_v2.annexure.forEach(item => {
      const advances = item.advances
      if (advances.advance > 0 || advances.fuel > 0 || advances.bata > 0) {
        this.isNewAdvanceGreaterThenZero = true;
      }
    });

    this.isNewAdvanceGreaterThenZero = this.isNewAdvanceGreaterThenZero &&
      (this.isFuelReceived || this.isMoneyReceived || this.isBataReceivaed)
  }

  initializeExistence() {
    this.otherDetailExists = false;
    this.oldTripDataExists = false;
    this.tripDataExists = false;

    if (this.billOfSupplyData['other_items'].length > 0) {
      this.otherDetailExists = true;
    }

    if (this.billOfSupplyData['challan']['challans_v1']['challan_data'].length > 0) {
      this.oldTripDataExists = true;
    }
    if (this.billOfSupplyData['challan']['challans_v2']['challan_data'].length > 0) {
      this.tripDataExists = true;
    }
  }

  evaluateEmptyTP(data) {
    let flag: boolean = false;
    for (let index in data) {
      flag = checkEmptyDataKey(data[index].challans, "transporter_permit_no")
      if (!flag) {
        return false
      }
    }
    return true
  }

  evaluateEmptyNewTP(data) {
    let flag: boolean = false;
    for (let index in data) {
      flag = data[index].work_order_no
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
    let annexure_array = this.billOfSupplyData.challan.annexure[index_value].challans as Array<any>;
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

  createPdfDownload(data, fileTitleAnnexure, fileNameAnnexure, fileTitle, fileName, annexure = true) {
    const type=".pdf";
      if (this.excludeAnnexure) {
        setTimeout(() => {
          let fileNameA = fileName + "_" + this.generateFileName()+type;
          const pdfDocGenerator = pdfMake.createPdf(this.pdfGenerateOriginalWOAnnexure(data, fileTitle));
          pdfDocGenerator.getBlob((blob) => {
            this._fileDownload.writeAndOpenFile(blob, fileNameA).then(data => {
            });
          });
        }, 500);
      } else {
        setTimeout(() => {
          let fileNameB = fileName + "_" + this.generateFileName()+type;
          const pdfDocGenerator = pdfMake.createPdf(this.pdfGenerateOriginal(data, fileTitle));
          pdfDocGenerator.getBlob((blob) => {
            this._fileDownload.writeAndOpenFile(blob, fileNameB).then(data => {
            });
          });
        }, 500);

        if (annexure) {
          setTimeout(() => {
            let fileNameC = fileNameAnnexure + "_" + this.generateFileName()+type;
            const pdfDocGenerator = pdfMake.createPdf(this.generatePDFAnnexure(data, fileTitleAnnexure));
            pdfDocGenerator.getBlob((blob) => {
              this._fileDownload.writeAndOpenFile(blob, fileNameC).then(data => {
              });
            });
          }, 500);
        }

      }
  }

  processPdf(data, print: Boolean = false) {
    this.ngxService.start();
    let fileTitle = 'ORIGINAL FOR RECIPIENT';
    let fileTitleAnnexure = 'ANNEXURE'
    let fileName = 'Original_for_Recipient'
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

      else if (this.createCopySeleted == 1) {
        this.createPdfDownload(data, fileTitleAnnexure, fileNameAnnexure, fileTitle, fileName)
        fileTitle = 'DUPLICATE FOR SUPPLIER';
        fileName = 'Duplicate_for_Supplier'
        this.createPdfDownload(data, fileTitleAnnexure, fileNameAnnexure, fileTitle, fileName, false)
      }

      else if (this.createCopySeleted == 2) {
        this.createPdfDownload(data, fileTitleAnnexure, fileNameAnnexure, fileTitle, fileName)
        fileTitle = 'DUPLICATE FOR SUPPLIER';
        fileName = 'Duplicate_for_Supplier'
        this.createPdfDownload(data, fileTitleAnnexure, fileNameAnnexure, fileTitle, fileName, false)
        fileTitle = 'TRIPLICATE FOR TRANSPORT';
        fileName = 'Triplicate_for_Transporter'
        this.createPdfDownload(data, fileTitleAnnexure, fileNameAnnexure, fileTitle, fileName, false)
      }


    }
    setTimeout(() => {
      this.ngxService.stop();
    }, 500);
  }

  createCopySelect(i) {
    this.createCopySeleted = i;
    this.showOptions = false;
  }

  generateFileName() {
    let partyName = this.billOfSupplyData['party']['display_name'];
    let bosNumber = this.billOfSupplyData['bos_number'];
    return `${partyName}_${bosNumber}`;
  }

  pdfGenerateView(data) {
    const content1 = this.pdfDataGeneration(data, "Annexure", 'annexure')
    const content2 = this.pdfDataGeneration(data, "ORIGINAL FOR RECIPIENT", 'original')
    if (data['terms_and_condition']) {
      if (data['terms_and_condition'].content && !data['terms_and_condition'].same_page_display) {
        const content3 = [{ fontSize: 9, stack: [{ bold: true, text: "Terms And Conditions:\n" }, { stack: htmlToPdfmake(data['terms_and_condition'].content) }], margin: [20, 20, 20, 20] }]        
        return this.pdfPageCreation([content2, content3, content1])
      }
    }
    return this.pdfPageCreation([content2, content1])
  }

  generatePDFAnnexure(data, title) {
    const content = this.pdfDataGeneration(data, title, 'annexure')
    return this.pdfPageCreation([content])
  }

  pdfGenerateOriginal(data, title) {
    const content = this.pdfDataGeneration(data, title, 'original')
    if (data['terms_and_condition']) {
      if (data['terms_and_condition'].content && !data['terms_and_condition'].same_page_display) {
        const content2 = [{ fontSize: 9, stack: [{ bold: true, text: "Terms And Conditions:\n" }, { stack: htmlToPdfmake(data['terms_and_condition'].content) }], margin: [20, 20, 20, 20] }]
        return this.pdfPageCreation([content, content2])
      }
    }
    return this.pdfPageCreation([content])
  }

  pdfGenerateOriginalWOAnnexure(data, title) {
    const content = this.pdfDataGeneration(data, title, 'original_wo_annexure')
    return this.pdfPageCreation([content])
  }


  addCal(cals) {
    let tempArr = []
    const digitalSignature = this.addDigitalSignatureColumn();
    for (let i = 0; i < cals.length; i++) {
      tempArr.push([{ text: cals[i][0], alignment: "right", bold: cals[i][2] },
      { text: cals[i][1], alignment: "right", bold: cals[i][2] }])

    }
    tempArr.push(digitalSignature);
    return tempArr
  }


  createAnnexureOldTripData(data) {
    let item_challans = []
    item_challans.push([
      { text: 'DN No.', bold: true }, { text: 'Vehicle No. ', bold: true },
      { text: 'From', bold: true }, { text: 'To', bold: true },
      { text: 'Material', bold: true }, { text: 'Unit', bold: true },
      { text: [{ text: 'Rate' }, '\n', { text: '(' + this.currency_type.symbol + ')' }], bold: true },
      { text: 'Qty', bold: true },
      { text: [{ text: 'Amount' }, '\n', { text: '(' + this.currency_type.symbol + ')' }], bold: true }
    ])

    let narrationColSpan = item_challans[0].length
    if (!this.isTPEmpty) {
      narrationColSpan += 1
      item_challans[0].splice(2, 0, { text: 'Work Order No.', bold: true })
    }

    if (this.billOfSupplyData.trip_advance_data.fuel && this.isFuelReceived) {
      narrationColSpan += 1
      item_challans[0].push({ text: [{ text: 'Fuel' }, '\n', { text: '(' + this.currency_type.symbol + ')' }], bold: true })
    }

    if (this.billOfSupplyData.trip_advance_data.advance && this.isMoneyReceived) {
      narrationColSpan += 1
      item_challans[0].push({ text: [{ text: 'Advance' }, '\n', { text: '(' + this.currency_type.symbol + ')' }], bold: true })
    }

    if (this.billOfSupplyData.trip_advance_data.batta && this.isBataReceivaed) {
      narrationColSpan += 1
      item_challans[0].push({ text: [{ text: 'Batta' }, '\n', { text: '(' + this.currency_type.symbol + ')' }], bold: true })
    }

    data.forEach((ele2, i) => {
      ele2.challans.forEach((ele, j) => {
        let push_row = [
          {
            text:
              [
                { text: checkEmpty(ele, ['challan_no']) },
                '\n',
                { text: this.dateChange(ele.created_at), fontSize: 6 }
              ]
          }, checkEmpty(ele, ['reg_number']),
          checkEmpty(ele, ['consignor']), checkEmpty(ele, ['consignee']), checkEmpty(ele, ['material']),
          checkEmpty(ele, ['unit']), checkEmpty(ele, ['rate_per_unit']), checkEmpty(ele, ['final_weight'], true),
          checkEmpty(ele, ['total_amount'], true)
        ]

        if (!this.isTPEmpty) {
          push_row.splice(2, 0, ele.transporter_permit_no)
        }

        if (this.isAdvanceGreaterThenZero) {
          if (this.isFuelReceived) {
            if (j == 0) {
              let ch = ele2.challans as Array<any>;
              push_row.push({ text: checkEmpty(ele2, ['fuel'], true), rowSpan: ch.length });
            }
            else { push_row.push({}); }
          }

          if (this.isMoneyReceived) {
            if (j == 0) {
              let ch = ele2.challans as Array<any>;
              push_row.push({ text: checkEmpty(ele2, ['advance'], true), rowSpan: ch.length });
            }
            else { push_row.push({}); }
          }

          if (this.isBataReceivaed) {
            if (j == 0) {
              let ch = ele2.challans as Array<any>;
              push_row.push({ text: checkEmpty(ele2, ['batta'], true), rowSpan: ch.length });
            }
            else { push_row.push({}); }
          }
        }

        item_challans.push(push_row);

        if (ele.narration) {
          let narrationRow = []
          for (let i = 0; i < narrationColSpan; i++) narrationRow.push({})
          narrationRow.splice(0, 1, {
            text: [{ text: 'Narration ', alignment: 'left', bold: true },
            { text: checkEmpty(ele, ['narration']), alignment: 'left' }],
            colSpan: narrationColSpan
          })
          item_challans.push(narrationRow)
        }
      });
    });

    const widthString = (100 / item_challans[0].length).toFixed(3);
    const itemChallanWidths = Array(item_challans[0].length).fill(widthString + "%");

    return [item_challans, itemChallanWidths]
  }

  createAnnexureTripData(data) {
    let sectionData = [];
    let borderAdd = [];
    let totalColumns = 0
    let totalCommonRow = 1
    let lrNoPosition = 0
    let qtyPosition = 4

    sectionData.push([
    { text: "Date", bold: true, border: [true, true, false, true]  },
    { text: "Vehicle No.", bold: true, border: [false, true, false, true] },
    { text: "Material", bold: true, border: [false, true, false, true] },
    { text: "From - To", bold: true, border: [false, true, false, true] },
    { text: "Rate" + '(' + this.currency_type.symbol + ')', bold: true, border: [false, true, false, true] },
    { text: "Charges/Deductions" + '(' + this.currency_type.symbol + ')', bold: true, border: [false, true, false, true] },
    { text: "Amount" + '(' + this.currency_type.symbol + ')', bold: true, border: [false, true, true, true] }])

    if (!this.isLRNoEmpty){
      qtyPosition += 1
      sectionData[0][0].border = [false, true, false, true]
      sectionData[0].splice(lrNoPosition, 0, { text: "LR No.", bold: true, border: [true, true, false, true] })
    }

    if (!this.isFixedQty) {
      sectionData[0].splice(qtyPosition, 0, { text: "QTY", bold: true, border: [false, true, false, true] })
    }

    totalColumns = sectionData[0].length
    if (!this.isNewTPEmpty) totalCommonRow += 1
    if (this.isNewAdvanceGreaterThenZero) totalCommonRow += 1
    const equalAllotment = Math.floor(totalColumns / totalCommonRow)
    const extraAllotment = totalColumns % totalCommonRow

    for (let i = 0; i < data.length; i++) {
      let tripData = data[i].estimate
      const innerRow = [
      { text: tripData['date'], border: [true, true, false, true]  },
      { text: tripData['vehicle'], border: [false, false, false, false] },
      { text: tripData['material'], border: [false, false, false, false] },
      { text: tripData['from-to'], border: [false, false, false, false] },
      { text: formatNumber(tripData['rate']), border: [false, false, false, false] },
      { text: formatNumber(tripData['adjustment']), border: [false, false, false, false] },
      { text: formatNumber(tripData['amount']), border: [false, false, true, false] }]

      if (!this.isLRNoEmpty){
        innerRow[0].border = [false, false, false, false]
        innerRow.splice(lrNoPosition, 0, { text: tripData['cn_no'], border: [true, false, false, false] })
      }

      if (!this.isFixedQty){
        innerRow.splice(qtyPosition, 0, { text: tripData['qty'], border: [false, false, false, false] })
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
            customFieldRow[customFieldNextSplice].border = [false, true, true, true]
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

    item_challans.push([{ text: "Job Count", bold: true }, { text: "Qty.", bold: true },
    { text: "Unit Cost" + '(' + this.currency_type.symbol + ')', bold: true },
    { text: "Amount" + '(' + this.currency_type.symbol + ')', bold: true },
    { text: "Charges" + '(' + this.currency_type.symbol + ')', bold: true },
    { text: "Deductions" + '(' + this.currency_type.symbol + ')', bold: true },
    { text: "Final Amount" + '(' + this.currency_type.symbol + ')', bold: true }])

    data.forEach(ele => {
      item_challans.push([
        { text: ele['trip_count'], bold: false }, { text: `${ele['qty']}`, bold: false },
        { text: formatNumber(Number(ele['rate'])), bold: false }, { text: formatNumber(Number(ele['amount'])), bold: false },
        { text: formatNumber(Number(ele['charge'])), bold: false }, { text: formatNumber(Number(ele['deduction'])), bold: false },
        { text: formatNumber(Number(ele['final_amount'])), bold: false }
      ])
    });

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

  createOldTripData(data) {
    let item_challans = []
    item_challans.push([
      { text: 'Challan Count', bold: true }, { text: 'Material', bold: true },
      { text: 'Qty', bold: true },
      { text: 'Uunit Cost' + '(' + this.currency_type.symbol + ')', bold: true },
      { text: 'From', bold: true }, { text: 'To', bold: true },
      { text: 'Amount' + '(' + this.currency_type.symbol + ')', bold: true },
      { text: 'Adjustment' + '(' + this.currency_type.symbol + ')', bold: true },
      { text: 'Total' + '(' + this.currency_type.symbol + ')', bold: true }])

    data.forEach((ele, i) => {
      item_challans.push([
        checkEmpty(ele, ['total_challans']), checkEmpty(ele, ['material']), checkEmpty(ele, ['final_weight'], true), { text: '₹ ' + checkEmpty(ele, ['rate_per_unit'], true) },
        checkEmpty(ele, ['consignor']), checkEmpty(ele, ['consignee']), { text: '₹ ' + checkEmpty(ele, ['challan_amount'], true) },
        { text: '₹ ' + checkEmpty(ele, ['adjustment'], true) },
        { text: '₹ ' + checkEmpty(ele, ['total_amount'], true) }
      ]);
    });

    const widthString = (100 / item_challans[0].length).toFixed(3);
    const itemChallanWidths = Array(item_challans[0].length).fill(widthString + "%");

    return [item_challans, itemChallanWidths]
  }

  createOtherItemData(data) {
    let otherItems = [];

    otherItems.push([{ text: 'Item', bold: true },
    { text: 'Hsn Code', bold: true }, { text: 'Qty', bold: true },
    { text: 'Unit Cost' + '(' + this.currency_type.symbol + ')', bold: true },
    { text: 'Amount' + '(' + this.currency_type.symbol + ')', bold: true },
    { text: 'Discount' + '(' + this.currency_type.symbol + ')', bold: true },
    { text: 'Total' + '(' + this.currency_type.symbol + ')', bold: true }])

    data.forEach((ele, i) => {
      otherItems.push([
        checkEmpty(ele, ['item', 'name']), checkEmpty(ele, ['hsn_code']), checkEmpty(ele, ['quantity'], true),
        { text: '₹ ' + formatNumber(Number(checkEmpty(ele, ['unit_cost'], true))) }, { text: '₹ ' + formatNumber(Number(checkEmpty(ele, ['amount'], true))) },
        { text: '₹ ' + formatNumber(Number(checkEmpty(ele, ['discount'], true))) },
        { text: '₹ ' + formatNumber(Number(checkEmpty(ele, ['total_amount'], true))) }
      ]);
    });

    const oldLength = otherItems.length
    this.challanLength += otherItems.length;
    for (let i=0; i< 10-this.challanLength; i++)
    otherItems.push(Array(otherItems[0].length).fill({text: "\n\n"}))

    const widthString = (100 / otherItems[0].length).toFixed(3);
    const itemChallanWidths = Array(otherItems[0].length).fill(widthString + "%");
    return [otherItems, itemChallanWidths, oldLength]
  }

  createOtherItemDataWOExtend(data) {
    let otherItems = [];

    otherItems.push([{ text: 'Item', bold: true },
    { text: 'Hsn Code', bold: true }, { text: 'Qty', bold: true },
    { text: 'Unit Cost' + '(' + this.currency_type.symbol + ')', bold: true },
    { text: 'Amount' + '(' + this.currency_type.symbol +  ')', bold: true },
    { text: 'Discount' + '(' + this.currency_type.symbol + ')', bold: true },
    { text: 'Total' + '(' + this.currency_type.symbol + ')', bold: true }])

    data.forEach((ele, i) => {
      otherItems.push([
        checkEmpty(ele, ['item', 'name']), checkEmpty(ele, ['hsn_code']), checkEmpty(ele, ['quantity'], true),
        { text: '₹ ' + formatNumber(Number(checkEmpty(ele, ['unit_cost'], true))) }, { text: '₹ ' + formatNumber(Number(checkEmpty(ele, ['amount'], true))) },
        { text: '₹ ' + checkEmpty(ele, ['discount'], true) },
        { text: '₹ ' + formatNumber(Number(checkEmpty(ele, ['total_amount'], true)) )}
      ]);
    });

    const widthString = (100 / otherItems[0].length).toFixed(3);
    const itemChallanWidths = Array(otherItems[0].length).fill(widthString + "%");
    return [otherItems, itemChallanWidths]
  }

  addCalculations(data) {
    const arr = []
    if (data['total_challan_amount'] > 0) {
      arr.push(["Subtotal Challan:",
        `${this.currency_type.symbol} ${formatNumber(data['total_challan_amount'])}`, false])
    }
    if (data['total_others_amount'] > 0) {
      arr.push(["Subtotal Others:",
        `${this.currency_type.symbol} ${formatNumber(Number(data['total_others_amount']))}`, false])
    }

    arr.push(["Total:", `${this.currency_type.symbol} ${formatNumber(data['subtotal'])}`, true])
    if (data['adjustment_account'] && data['total_adjustment'] > 0) {
      arr.push([`${data['adjustment_account']['label']}:`,
      `${this.currency_type.symbol} ${formatNumber(Number(data['total_adjustment']))}`, false])
    }
    arr.push(["Round Off:", `${this.currency_type.symbol} ${(data['roundoff_amount'])}`, false])
    arr.push(["BoS Amount:", `${this.currency_type.symbol} ${formatNumber(Number(data['total_amount']))}`, true])
    if (this.isMoneyReceived && data['trip_advance_data']['advance'] > 0) {
      arr.push(["Advance:", `${this.currency_type.symbol} ${formatNumber(Number(data['trip_advance_data']['advance']))}`, false])
    }
    if (this.isBataReceivaed && data['trip_advance_data']['batta'] > 0) {
      arr.push(["Batta:", `${this.currency_type.symbol} ${formatNumber(Number(data['trip_advance_data']['batta']))}`, false])
    }
    if (this.isFuelReceived && data['trip_advance_data']['fuel'] > 0) {
      arr.push(["Fuel:", `${this.currency_type.symbol} ${formatNumber(Number(data['trip_advance_data']['fuel']))}`, false])
    }
    arr.push(["Balance:", `${this.currency_type.symbol} ${formatNumber(Number(data['due_amount']))}`, true])
    arr.push(["Total in Words:", data['due_amount_in_word'], true]);
    for (let index = 0; index < 10; index++) {
      arr.push(['', '', true])

    }
    arr.push(['For ' + data['company']['company_name'] + ':', '', true])
    return arr
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


  pdfDataGeneration(data, fileTitle, type) {
    this.challanLength = 0
    this.addToOthers = false
    const customerName = data['party']['company_name']
    const seqNo = data['bos_number']
    const contactPerson = data['contact_person']
    const companyName = data['company']['company_name']
    const companyAddress = addressToText(data.company.address.filter((ele) => ele.address_type_index == 0)[data.company.address.length ? data.company.address.length / 2 - 1 : 0], 1, -1)
    const companyMobileMail = `Mobile No: ${data['company']['primary_mobile_number']} | Mail: ${data['company']['email_address']}`
    const companyGstPan = this.isTDS?'TRN :'+`${data['company']['gstin']}`:'GSTIN | PAN:'+`${data['company']['gstin']} | ${data['company']['pan']}`
    const companyLogo = addImageColumn(this.company_logo)
    const customerGstPan = data['party']['tax_details']['gstin_view'] ? data['party']['tax_details']['gstin_view'] :'-'
    const customerPos = data['place_of_supply']
    const customerMob = data['party']['mob_number']
    const customerBillingAdd = addressToText(data.party.address.filter((ele) => ele.address_type_index == 0)[0], 1, -1)
    const customerShippingAdd = addressToText(data.party.address.filter((ele) => ele.address_type_index == 1)[0], 1, -1)
    const customerCopyFor = fileTitle
    const bosNumber = data['bos_number']
    const bosDate = data['bos_date']
    const dueDate = data['due_date'] ? data['due_date'] : ""
    const term = checkEmpty(data, ['payment_term_meta', 'label'])
    const accountNo = checkEmpty(data, ['bank_account', 'account_number'])
    const accountHolder = checkEmpty(data, ['bank_account', 'account_holder_name'])
    const ifscCode = checkEmpty(data, ['bank_account', 'ifsc_code']);
    const swiftCode =  checkEmpty(data, ['bank_account', 'swift_code']);
    const ibanCode = checkEmpty(data, ['bank_account', 'iban_code']);
    const narrations = data['narrations'];
    // const disclaimer =data['disclaimer'];
    const arr = this.addCalculations(data);
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

    if (data['other_items'].length>0) {
      this.addToOthers = true;
    }

    const tripsAmount = this.createTripData(data['challan']['challans_v2']['challan_data'])
    const annexureTripSectionData = this.createAnnexureTripData(data['challan']['challans_v2']['annexure'])
    const oldTripsAmount = this.createOldTripData(data['challan']['challans_v1']['challan_data'])
    const annexureOldTripRows = this.createAnnexureOldTripData(data['challan']['challans_v1']['annexure'])
    const otherItemRows = this.createOtherItemData(data['other_items']);
    const otherItemRowsWOExtend = this.createOtherItemDataWOExtend(data['other_items'])


    const annexureHeaderSection = {
      width: "*",
      table: {
        widths: ["49.9%", "0.2%", "49.9%"],
        body: [
          [{
            width: "*",
            fontSize: 9,
            stack: [{ text: `Customer: ${customerName}\n`, bold: true },
            { text: `Bill Of Supply No: ${seqNo}\n` }]
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
      margin: [0, 4, 0, 0],
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

    const bosCopySection = { text: `BOS - ${customerCopyFor}`, fontSize:11,
                              bold: true, alignment: 'center', margin: [10, 0, 10, 10] }

    const bosDetailSection = {
      margin: [0, 2, 0, 2],
      width: "*",
      fontSize: 9,
      table: {
        widths: ["33.33%", "*", "33.33%"],
        body: [
          [{
            margin: [5, 5, 5, 5],
            border: [true, true, false, true],
            stack: [{ text: `Bos No: ${bosNumber}`, bold: false, margin: [0, 0, 0, 5] },
                    { text: `Bos Date: ${bosDate}`, bold: false, margin: [0, 0, 0, 5] }]},

          {
            margin: [5, 5, 5, 5],
            border: [false, true, false, true],
            stack: [{ text: `Terms: ${term}`, bold: false, margin: [0, 0, 0, 5] }]},


          {
            margin: [5, 5, 5, 5],
            border: [false, true, true, true],
            stack: [{ text: `Due Date: ${dueDate}`, bold: false, margin: [0, 0, 0, 5] }]},
          ]
        ]
      }
    }

    let contactPersonPhn = `Contact Person: ${contactPerson}`

    const partyDetailSection: any = {
      margin: [0, 2, 0, 2],
      width: "*",
      fontSize: 9,
      table: {
        widths: ["50%", "50%"],
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
                  stack: [{ text: this.isTDS?'TRN:'+`${customerGstPan}\n`:'GSTIN:'+ `${customerGstPan}\n`, margin: [0, 0, 0, 2], bold: false },
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
        margin: [5, 5, 5, 5], border: [true, true, true, true] },
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

    if (!this.isPlaceOfSupply) {
        partyDetailSection.table.body[0][0].table.body[0][2].stack.splice(0, 1);
    }

    const oldTripsTable = {
      margin: [0, 2, 0, 2],
      width: "*",
      headerRows: 1,
      fontSize: 9,
      alignment: 'center',
      table: {
        widths: oldTripsAmount[1],
        body: oldTripsAmount[0]
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

    const otherItemTable = {
      margin: [0, 2, 0, 2],
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
      margin: [0, 2, 0, 2],
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

    const oldAnnexureTripTable = {
      margin: [0, 2, 0, 2],
      width: "*",
      headerRows: 1,
      fontSize: 9,
      alignment: 'center',
      table: {
        widths: annexureOldTripRows[1],
        body: annexureOldTripRows[0]
      },
      layout: {

        vLineWidth: function (i, node) {
          if (i === 0 || i === node.table.widths.length || i === node.table.widths.length - 3) {
            return null;
          }
          return 0;
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
      margin: [0, 2, 0, 2],
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
      if(this.isTDS){
        bankDetails.push({ text: `Swift Code: ${swiftCode}\n`, fontSize: 9, margin: [0, 0, 0, 2] })
      }else{
        bankDetails.push({ text: `IFSC Code: ${ifscCode}\n`, fontSize: 9, margin: [0, 0, 0, 2] })
      }
    }else{
      bankDetails.push({ text: `Swift Code: ${swiftCode}\n`, fontSize: 9, margin: [0, 0, 0, 2] })
    }

    // const content2 = [{ fontSize: 9, stack: [{ bold: true, text: "Terms And Conditions:\n" }, { stack: htmlToPdfmake(data['terms_and_condition'].content) }], margin: [20, 20, 20, 20] }]

    const bankTerms = {
      width: "50%",
      table: {
        widths: ["*"],
        body: [
          [{
            width: "*",
            stack: bankDetails
          }],

          [{ text: "", border: [false, false, false] }],

          [{
            width: "*",
            stack: [
            //   { text: "Terms And Condition:\n", fontSize: 9, bold: true, margin: [0, 0, 0, 2] },
            // { text: disclaimer? `${disclaimer.description}`:'' , fontSize: 9, margin: [0, 0, 0, 2] },
            { text: "Narration: ", fontSize: 9, bold: true, margin: [0, 0, 0, 2] },
            { text: `${narrations}`, fontSize: 9, margin: [0, 0, 0, 2] }]
          },

          ]]
      }
    }
    if (isValidValue(data['terms_and_condition']) && data['terms_and_condition']['content'] && data['terms_and_condition']['same_page_display']) {
      bankTerms.table.body[2][0]['stack'].splice(0, 0, {
        width: '*',
        stack: [
          { text: "Terms And Condition:\n", fontSize: 9, bold: true, margin: [0, 0, 0, 2] },
          { fontSize: 9, stack: htmlToPdfmake(data['terms_and_condition']['content']) }]
      })
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
      margin: [0, 5, 0, 0],
      columnGap: 10,
      columns: [
        bankTerms,
        calculations
      ]
    }
    let content = []
    if (type == 'annexure') {
      content = [annexureHeaderSection]
      if (this.tripDataExists) content.push(annexureTripTable);
      if (this.oldTripDataExists) content.push(oldAnnexureTripTable);
      if (this.otherDetailExists) content.push(otherItemTableWOExtend);
    }

    else if (type == 'original') {
      content = [bosCopySection, bosDetailSection, partyDetailSection]
      if (this.tripDataExists) content.push(tripsTable);
      if (this.oldTripDataExists) content.push(oldTripsTable);
      if (this.otherDetailExists) content.push(otherItemTable);
      content.push(bankTermsCalTable);

    }

    else {
      content = [bosCopySection, bosDetailSection, partyDetailSection]
      if (this.tripDataExists) content.push(annexureTripTable);
      if (this.oldTripDataExists) content.push(oldAnnexureTripTable);
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
    let invoiceNumber = data.bos_number;
    let senderCompany = data.company.company_name;
    let debitAmount = data.total_amount;
    let subject = senderCompany + "| BoS Number : " + invoiceNumber
    let userName = this.toTitleCase(localStorage.getItem('TS_USER_NAME'))

    let dataFormat = {
      base64Code: "",
      email: data['party']['email_address'],
      content: "\nHi " + partyCompanyName + " ,\n\n I hope you're well! Please see attached BoS number "
        + invoiceNumber + " with a BoS amount of " +this.currency_type.symbol+" "+ debitAmount + ". Don't hesitate to reach out if you have any questions.\n\nKind regards,\n\n" + userName + "\n\n" + senderCompany,
      fileName: fileName + "_" + this.generateFileName(),
      subject: subject, isOpen: true
    }


    let dataFormatAnnexure = {
      base64Code: "",
      content: "\nHi " + partyCompanyName + " ,\n\n I hope you're well! Please see attached BoS number "
        + invoiceNumber + " with a BoS amount of "+this.currency_type.symbol+" " + debitAmount + ". Don't hesitate to reach out if you have any questions.\n\nKind regards,\n\n" + userName + "\n\n" + senderCompany,
      fileName: fileTitleAnnexure + "_" + this.generateFileName(),
      subject: subject, isOpen: true
    }

    if (this.excludeAnnexure) {
      setTimeout(() => {
        pdfMake.createPdf(this.pdfGenerateOriginalWOAnnexure(data, fileTitleAnnexure)).getBase64(data => {
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
    let fileTitle = 'ORIGINAL FOR RECIPIENT';
    let fileTitleAnnexure = 'ANNEXURE'
    let fileName = 'Original_for_Recipient'
    if (this.createCopySeleted == 0) {
      this.createEmailPdf(data, fileTitleAnnexure, fileTitle, fileName)
    }
    else if (this.createCopySeleted == 1) {
      this.createEmailPdf(data, fileTitleAnnexure, fileTitle, fileName)
      fileTitle = 'DUPLICATE FOR SUPPLIER';
      fileName = 'Duplicate_for_Supplier'
      this.createEmailPdf(data, fileTitleAnnexure, fileTitle, fileName, false)
    }
    else if (this.createCopySeleted == 2) {
      this.createEmailPdf(data, fileTitleAnnexure, fileTitle, fileName)
      fileTitle = 'DUPLICATE FOR SUPPLIER';
      fileName = 'Duplicate_for_Supplier'
      this.createEmailPdf(data, fileTitleAnnexure, fileTitle, fileName, false)
      fileTitle = 'TRIPLICATE FOR TRANSPORT';
      fileName = 'Triplicate_for_Transporter'
      this.createEmailPdf(data, fileTitleAnnexure, fileTitle, fileName, false)
    }
    setTimeout(() => {
      this.ngxService.stop();
    }, 1100);
  }


}
