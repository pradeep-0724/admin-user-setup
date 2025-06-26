import { SettingSeviceService } from 'src/app/modules/customerapp-module/api-services/orgainzation-setting-module-services/setting-service/setting-sevice.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { normalDate } from 'src/app/shared-module/utilities/date-utilis';
import { checkEmpty, checkEmptyDataKey } from 'src/app/shared-module/utilities/helper-utils';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { CurrencyService } from 'src/app/core/services/currency.service';
import * as _ from 'lodash';
import { TaxService } from 'src/app/core/services/tax.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { OperationsActivityService } from '../../../../api-services/operation-module-service/operations-activity.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { addImageColumn, addressToText } from 'src/app/shared-module/utilities/pdfmake-uitls';
import { Permission } from 'src/app/core/constants/permissionConstants';


@Component({
  selector: 'app-detail-fleetowner-v2',
  templateUrl: './detail-fleetowner-v2.component.html',
  styleUrls: ['./detail-fleetowner-v2.component.scss']
})
export class DetailFleetownerV2Component implements OnInit,OnDestroy {
  company_logo: any = '';
  @ViewChild('content',{static: true}) content: ElementRef;
  @Input() defaultDownload: boolean = false;
  @Input() routeToDetail: boolean = false;
  @Output() openDetailsEmitter =new EventEmitter<boolean>();
  vehicleProviderPermission = Permission.vehicle_provider.toString().split(',');

  isTPEmpty: boolean = false;
  isNewTPEmpty: boolean = false;
  currency_type;
  isTax:boolean=false;
  isAdvanceGreaterThenZero:boolean=false;
  isMoneyReceived:boolean=false;
  isFuelReceived:boolean=false;
  otherDetailExists: boolean = false;
  oldTripDataExists: boolean = false;
  tripDataExists: boolean = false;
  isNewAdvanceGreaterThenZero: boolean = false;
  preFixUrl = ''
  pdfSrc = ""
  fleetData: any;
  isMobile = false;
  isTDS=false;
  isPlaceOfSupply: boolean = false;
  private detailVehiclePaymentSubscription: Subscription;
  constructor(private _operationsActivityService: OperationsActivityService,
    private ngxService: NgxUiLoaderService,
     private _commonService: CommonService,
     private currency:CurrencyService,
     private _advances:SettingSeviceService,
     private _tax :TaxService,
     private _preFixUrl:PrefixUrlService,
     private deviceService: DeviceDetectorService,
     private _fileDownload:FileDownLoadAandOpen,
    )  {
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
      this.isMobile = this.deviceService.isMobile();
      this.isTax=this._tax.getTax();
      this.isPlaceOfSupply = this._tax.isPlaceOfSupply();
      this.isTDS = this._tax.getVat();
    }
  ngOnDestroy(): void {
    if(this.detailVehiclePaymentSubscription){
      this.detailVehiclePaymentSubscription.unsubscribe()
    }
  }
  openDetails(): void {
    this.routeToDetail=!this.routeToDetail;
    this.openDetailsEmitter.next(this.routeToDetail)
   }

  ngOnInit() {
    this._commonService.fetchCompanyLogo().subscribe((response: any) => {
      this.company_logo = response.result.image_blob;
    }, (err) => {
      this.company_logo = null;
    });
    this.preFixUrl = this._preFixUrl.getprefixUrl();
    this.fleetOwnerDetails();
     setTimeout(() => {
      this.currency_type = this.currency.getCurrency();
    }, 1000);
  }

  @Input() 'fleetOwnerId':BehaviorSubject<String>;
  fleetOwnerDetails(){

    this.detailVehiclePaymentSubscription= this.fleetOwnerId.subscribe((id)=>{
    this._operationsActivityService.getFleetOwnerPrintScreenData(id).subscribe((data: any) => {
    this.isTPEmpty = this.evaluateEmptyTP(data.result.expenses.expense_v1.data)
    this.isNewTPEmpty = this.evaluateEmptyNewTP(data.result.expenses.expense_v2.data)
    this.fleetData = data.result;
    if (this.defaultDownload) {
        setTimeout(() => { this.downloadPdf(this.fleetData, false); }, 1500);}

    setTimeout(() => {
    const pdf = this.pdfGenerateView(this.fleetData)
    const pdfDocGenerator = pdfMake.createPdf(pdf);
    pdfDocGenerator.getDataUrl((dataUrl) => {
        this.pdfSrc = dataUrl
    }); }, 1500);

    this._advances.getAdvances('vehicle_provider').subscribe(data=>{
      this.isMoneyReceived=data['result'].cash_view;
      this.isFuelReceived=data['result'].fuel_view;
      this.checkAdvanceValue();
      this.checkToShowNewAdvanceValue()
     })

    this.initializeExistence()
        });
    });
  }

  initializeExistence(){
    this.otherDetailExists = false;
    this.oldTripDataExists = false;
    this.tripDataExists = false;

    if (this.fleetData.other_expenses.length > 0){
      this.otherDetailExists = true;
    }
    if (this.fleetData.expenses.expense_v1.data.length > 0) {
      this.oldTripDataExists = true;
    }
    if (this.fleetData.expenses.expense_v2.data.length > 0) {
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

  downloadPdf(data, print: boolean = false){
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

  generateFileName() {
    let vendorName = this.fleetData.vendor.company_name;
    let billNumber = this.fleetData['bill_number'];
    return `${vendorName}_${billNumber}`;
  }

  createPdfDownload(data, fileTitle){
    setTimeout(() => {
      let fileName =this.generateFileName()+".pdf";
      const pdfDocGenerator = pdfMake.createPdf(this.pdfGenerateOriginal(data, fileTitle));
        pdfDocGenerator.getBlob((blob) => {
          this._fileDownload.writeAndOpenFile(blob, fileName).then(data => {
          });
        });
    }, 500);
  }


  processPdf(data, print: Boolean=false) {
    this.ngxService.start();
    let fileTitle = 'VEHICLE PROVIDER DETAILS'
    if (print) {
        pdfMake.createPdf(this.pdfGenerateOriginal(data, fileTitle)).print({}, window.frames['printPdf']);
    } else {
        this.createPdfDownload(data, fileTitle)
    }
    setTimeout(() => {
      this.ngxService.stop();
    }, 500);
  }

  pdfGenerateView(data){
    const content1 = this.pdfDataGenerationV2(data)
    return this.pdfPageCreation([content1])
  }

  pdfGenerateOriginal(data, title){
    const content = this.pdfDataGenerationV2(data)
    return this.pdfPageCreation([content])
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

  createOldExpenseData(data){
    let item_challans = [];
    item_challans.push([
      { text: 'DN No.', bold: true }, { text: 'Vehicle No. ', bold: true },
      { text: 'Start', bold: true }, { text: 'End', bold: true },
      { text: 'Material', bold: true },{ text: 'Unit', bold: true },
      { text: [{text: 'Rate'}, '\n', {text: '(' + this.currency_type.symbol + ')'}], bold: true },
      { text: 'Qty', bold: true },
      { text: [{text: 'Amount'}, '\n', {text: '(' + this.currency_type.symbol + ')'}], bold: true }
    ])

    if (!this.isTPEmpty) {
      item_challans[0].splice(2, 0, { text: 'Work Order No.', bold: true })
    }

    if (this.fleetData.expenses.expense_v1.fuel_advance && this.isFuelReceived) {
      item_challans[0].push({ text: [{text: 'Fuel'}, '\n', {text: '(' + this.currency_type.symbol + ')'}], bold: true})
    }

    if (this.fleetData.expenses.expense_v1.general_advance && this.isMoneyReceived) {
      item_challans[0].push({ text: [{text: 'Advance'}, '\n', {text: '(' + this.currency_type.symbol + ')'}], bold: true})
    }

    if (this.isTax){
      if(this.fleetData.is_interstate){
        item_challans[0].splice(8, 0, { text: 'IGST', bold: true })
      } else {
        item_challans[0].splice(8, 0, { text: 'CGST', bold: true })
        item_challans[0].splice(8, 0, { text: 'SGST', bold: true })
      }}

    data.forEach((ele2, i) => {
          ele2.challans.forEach((ele, j) => {
          let push_row = [
            {
              text:
                [
                  { text: checkEmpty(ele, ['tp_number']) },
                  '\n',
                  { text: this.dateChange(ele.tp_date), fontSize: 6 }
                ]
            },checkEmpty(ele, ['reg_number']),
            checkEmpty(ele, ['consignor']), checkEmpty(ele, ['consignee']), checkEmpty(ele, ['material']),
            checkEmpty(ele, ['unit']),checkEmpty(ele, ['rate']), checkEmpty(ele, ['final_quantity'], true),
            checkEmpty(ele, ['total'], true)
          ]


          if(!this.isTPEmpty){
            push_row.splice(2, 0, ele.transporter_permit_no)
          }


          if (this.isTax){
            if(this.fleetData.is_interstate){
              push_row.splice(8, 0,
                {
                  text:
                    [checkEmpty(ele, ['tax_description', 'IGST'], true) + '%', '\n',
                    { text: '' + checkEmpty(ele, ['tax_description', 'IGST_amount'], true) }]})
            } else {
              push_row.splice(8, 0,
                {text:
                    [{ text: checkEmpty(ele, ['tax_description', 'CGST'], true) + '%' }, '\n',
                    { text: '' + checkEmpty(ele, ['tax_description', 'CGST_amount'], true) }]})
              push_row.splice(8, 0,
                {text:
                    [{ text: checkEmpty(ele, ['tax_description', 'SGST'], true) + '%' }, '\n',
                    { text: '' + checkEmpty(ele, ['tax_description', 'SGST_amount'], true) }]})
            }}



          if (this.isAdvanceGreaterThenZero){
            if (this.isFuelReceived) {
              if(j == 0){
                let ch = ele2.challans as Array<any>;
                push_row.push({ text: checkEmpty(ele2, ['fuel_advances'], true), rowSpan: ch.length});}
                else{push_row.push({});}
            }

            if (this.isMoneyReceived) {
              if(j == 0){
                let ch = ele2.challans as Array<any>;
                push_row.push({ text: checkEmpty(ele2, ['item_advance_amt'], true), rowSpan: ch.length});}
                else{push_row.push({});}
            }

          }
          item_challans.push(push_row);
        });
    });

    const widthString = (100/item_challans[0].length).toFixed(3);
    const itemChallanWidths = Array(item_challans[0].length).fill(widthString + "%");

    return [item_challans, itemChallanWidths]
  }

  createExpenseData(data){
    let GSTTYPE='IGST';
    if(this.isTDS){
      GSTTYPE='VAT'
    }
    let sectionData = [];
    let borderAdd = [];
    let totalColumns = 0
    let totalCommonRow = 1
    sectionData.push([
                 {text: "Date", bold: true, border: [true,true,false,true]},
                 {text: "Vehicle No.", bold: true, border: [false,true,false,true]},
                 {text: "Start - End", bold: true, border: [false,true,false,true]},
                 {text: "QTY", bold: true, border: [false,true,false,true]},
                 {text: "Charged QTY", bold: true, border: [false,true,false,true]},
                 {text: "Rate" + '(' + this.currency_type.symbol + ')', bold: true, border: [false,true,false,true]},
                 {text: "Adjustments" + '(' + this.currency_type.symbol + ')', bold: true, border: [false,true,false,true]},
                 {text: "Amount" + '(' + this.currency_type.symbol + ')', bold: true, border: [false,true,true,true]}])

    if (this.isTax){
      if(this.fleetData.is_interstate){
        sectionData[0].splice(7, 0, { text: GSTTYPE, bold: true, border: [false,true,false,true] })
      } else {
      sectionData[0].splice(7, 0, { text: 'CGST', bold: true, border: [false,true,false,true] })
      sectionData[0].splice(7, 0, { text: 'SGST', bold: true, border: [false,true,false,true] })}
    }
    totalColumns = sectionData[0].length

    if(!this.isNewTPEmpty) totalCommonRow += 1
    if(this.isNewAdvanceGreaterThenZero) totalCommonRow += 1
    const equalAllotment = Math.floor(totalColumns/totalCommonRow)
    const extraAllotment = totalColumns%totalCommonRow

    for(let i=0; i<data.length; i++){
      console.log(i);
      
        let tripData = data[i].estimate
        const innerRow = [
          {text: tripData['date'], border: [true,false,false,false]},
          {text: tripData['vehicle'], border: [false,false,false,false]},
          {text: tripData['from-to'], border: [false,false,false,false]},
          {text: tripData['qty'], border: [false,false,false,false]},
          {text: tripData['charged_qty'], border: [false,false,false,false]},
          {text: tripData['rate'], border: [false,false,false,false]},
          {text: tripData['adjustment'], border: [false,false,false,false]},
          {text: tripData['amount'], border: [false,false,true,false]}]
        sectionData.push(innerRow)

        if (this.isTax){
          if(this.fleetData.is_interstate){
              const igst = {
                text:
                  [checkEmpty(data[i], ['tax_description', 'IGST'], true) + '%', '\n',
                  { text: '' + checkEmpty(data[i], ['tax_description', 'IGST_amount'], true) }],
                  border: [false,false,false,false]}
              innerRow.splice(7, 0, igst)

          } else {
            const cgst = {text:
              [{ text: checkEmpty(data[i], ['tax_description', 'CGST'], true) + '%' }, '\n',
               { text: '' + checkEmpty(data[i], ['tax_description', 'CGST_amount'], true) }],
               border: [false,false,false,false]}
            innerRow.splice(7, 0, cgst)

            const sgst = {text:
              [{ text: checkEmpty(data[i], ['tax_description', 'SGST'], true) + '%' }, '\n',
                { text: '' + checkEmpty(data[i], ['tax_description', 'SGST_amount'], true) }],
                border: [false,false,false,false]}
            innerRow.splice(7, 0, sgst)
          }
        }

        let commonRow = []
        let nextSplice = 0
        for(let i=0; i<totalColumns; i++){commonRow.push({})}
        if(!this.isNewTPEmpty){
          commonRow.splice(nextSplice, 1, {text: [{text:`Work Order No: ${data[i].work_order_no}`}],
              colSpan: equalAllotment, bold: true, alignment: 'left'})
          nextSplice = equalAllotment
          }


        let charges = data[i].charges_deductions
        let chargesSection = []
        for(let j=0; j<charges.length; j++){
            chargesSection.push({text: `${charges[j].name}: ${charges[j].amount}\n`})}
        commonRow.splice(nextSplice, 1, {columns: [{width: "40%", text: "Charges and Deductions:", bold: true},
                       {width: "60%", margin: [0,0,10,0], alignment: 'right', text: chargesSection}],
                       colSpan: equalAllotment + extraAllotment})
        nextSplice += equalAllotment + extraAllotment

      if(this.isNewAdvanceGreaterThenZero){
        const advances = data[i].advances
        let advanceSection = []
        if(this.isFuelReceived && advances.fuel > 0){
          advanceSection.push({text: `Fuel: ${advances.fuel}\n`})
        }

        if(this.isMoneyReceived && advances.advance > 0){
          advanceSection.push({text: `Advance: ${advances.advance}\n`})
        }

        commonRow.splice(nextSplice, 1, {columns: [{width: "40%", text: "Advances:", bold: true},
        {width: "60%", margin: [0,0,10,0], alignment: 'right', text: advanceSection}], colSpan: equalAllotment})
      }

      sectionData.push(commonRow)
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


    const widthString = (100/sectionData[0].length).toFixed(3);
    const itemChallanWidths = Array(sectionData[0].length).fill(widthString + "%");
    return [sectionData, borderAdd, itemChallanWidths]
  }

  createOtherItemData(data){
    let otherItems = [];
    let GSTTYPE='IGST';
    if(this.isTDS){
      GSTTYPE='VAT'
    }
    otherItems.push([{ text: 'Expense Account', bold: true }, { text: 'Item', bold: true },
    { text: 'Qty', bold: true },
    { text: 'Unit Cost' + '(' + this.currency_type.symbol + ')', bold: true },
    { text: 'Amount' + '(' + this.currency_type.symbol + ')', bold: true },
    { text: 'Total' + '(' + this.currency_type.symbol + ')', bold: true }])

    data.forEach((ele, i) => {
      otherItems.push([checkEmpty(ele, ['expense_account']),
        checkEmpty(ele, ['item']), checkEmpty(ele, ['quantity'], true),
        { text: checkEmpty(ele, ['unit_cost'], true) },
        { text: checkEmpty(ele, ['total_before_tax'], true) },
        { text: checkEmpty(ele, ['total'], true) }
      ]);
    });

    if (this.isTax){
      if(this.fleetData.is_interstate){
        otherItems[0].splice(5, 0, { text: GSTTYPE, bold: true })
        data.forEach((ele, j) => {
          otherItems[1+j].splice(5, 0,
              {
                text:
                  [checkEmpty(ele, ['tax_description', 'IGST'], true) + '%', '\n',
                  { text: '' + checkEmpty(ele, ['tax_description', 'IGST_amount'], true) }]})
        });
      } else {
        otherItems[0].splice(4, 0, { text: 'CGST', bold: true })
        otherItems[0].splice(4, 0, { text: 'SGST', bold: true })
        data.forEach((ele, j) => {
          otherItems[1+j].splice(5, 0,
              {text:
                  [{ text: checkEmpty(ele, ['tax_description', 'CGST'], true) + '%' }, '\n',
                   { text: '' + checkEmpty(ele, ['tax_description', 'CGST_amount'], true) }]})
          otherItems[1+j].splice(5, 0,
              {text:
                  [{ text: checkEmpty(ele, ['tax_description', 'SGST'], true) + '%' }, '\n',
                   { text: '' + checkEmpty(ele, ['tax_description', 'SGST_amount'], true) }]})
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
      `${this.currency_type.symbol} ${data['expense_before_tax']}`, false])
    }
    if (data['other_expense_before_tax'] > 0){
      arr.push(["Subtotal Others:",
      `${this.currency_type.symbol} ${data['other_expense_before_tax']}`, false])
    }

    arr.push(["Sub Total:", `${this.currency_type.symbol} ${data['subtotal_before_tax']}`, true])

    if (data['discount_amount'] > 0){
        arr.push(["Discount:",
        `${this.currency_type.symbol} ${data['discount_amount']}`, false])
    }

    if(this.isTax) {
      arr.push(["Tax Amount: ", `${this.currency_type.symbol} ${data.total_tax}`, true])
      arr.push(["Discount After Tax: ", `${this.currency_type.symbol} ${data.discount_after_tax_amount}`, false])
    }

    if (data['adjustment_account'] && data['adjustment_amount'] > 0){
      arr.push([`${data['adjustment_account']}:`,
      `${this.currency_type.symbol} ${data['adjustment_amount']}`, false])
    }

    arr.push(["Bill Amount:", `${this.currency_type.symbol} ${data['total']}`, true])

    if(this.isTax){
      if(!this.isTDS)
      arr.push(["TDS: ", `${this.currency_type.symbol} ${data.tds_amount}`, false])
    }

    if (this.isMoneyReceived && data.expenses.general_advance > 0){
      arr.push(["Advance:", `${this.currency_type.symbol} ${data.expenses.general_advance}`, false])
    }

    if (this.isFuelReceived && data.expenses.fuel_advance > 0){
      arr.push(["Fuel:", `${this.currency_type.symbol} ${data.expenses.fuel_advance}`, false])
    }

    arr.push(["Total Amount:", `${this.currency_type.symbol} ${data['balance']}`, true])
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

  pdfDataGenerationV2(data){
    const customerName = data['vendor']['company_name']
    const companyName = data['company']['company_name']
    const companyAddress = addressToText(data.company.address.filter((ele)=> ele.address_type_index == 0)[data.company.address.length?data.company.address.length/2-1:0], 1, -1)
    const companyMobileMail = `Mobile No: ${data['company']['primary_mobile_number']} | Mail: ${data['company']['email_address']}`
    const companyGstPan = this.isTDS?'TRN: '+`${data['company']['gstin']}`+' CRN: '+`${data['company']['crn_no']}`:'GSTIN | PAN'+`: ${data['company']['gstin']} | ${data['company']['pan']}`
    const companyLogo = addImageColumn(this.company_logo,70,50)
    const customerGstPan = data['vendor']['tax_details']['gstin_view']
    const customerCRN = data['vendor']['tax_details']['crn_view']
    const customerPos = data['place_of_supply']
    const customerMob = data['vendor']['mob_number']
    const bosNumber = data['bill_number']
    const bosDate = data['bill_date']
    const dueDate = data['due_date'] ? data['due_date'] : ""
    const isReverseCharge = data['is_transaction_under_reverse'] ? "Yes" : "No"
    const term = data.payment_term
    const arr = this.addCalculations(data);

    const tripsAmount = this.createExpenseData(data.expenses.expense_v2.data)
    const oldTripsAmount =  this.createOldExpenseData(data.expenses.expense_v1.data)
    const otherItemRows = this.createOtherItemData(data['other_expenses'])



    const expenseTable = {
                margin: [0, 5, 0, 0],
          width: "*",
          headerRows: 1,
          fontSize: 9,
          alignment: 'center',
          table: {
              widths: tripsAmount[2],
              body: tripsAmount[0]
                },
            layout: {

            paddingTop: function(i, node) {return 5},
            paddingBottom: function(i, node) {return 5},
            hLineStyle: function (i, node) {
              if (i === 0 || i === node.table.body.length || !tripsAmount[1].includes(i)) {
                return null;
              }
              return {dash: {length: 4, space: 3}};
            },
            vLineStyle: function (i, node) {
              if (i === 0 || i === node.table.widths.length) {
                return null;
              }
              return {dash: {length: 4, space: 3}};
            },
                }
        }

    const companyDetailSection = {
              margin: [5, 5, 5, 5],
              columnGap: 10,
              columns: [
              companyLogo,
            {
              width: "90%",
              margin: [10, 0, 0, 0],
                stack: [{text: `${companyName}\n`, fontSize:13, bold:true, margin:[0,0,0,2]},
                       {text: `${companyAddress}\n`, fontSize: 9, bold:false, margin:[0,0,0,2]},
                       {text: `${companyMobileMail}\n`, fontSize: 9, bold:false, margin:[0,0,0,2]}]
            }

          ]
        }

    let clientdetailsSection=[
      {text: `Vendor: ${customerName}\n`, bold:true, margin:[0,0,0,2]},
      {text: `Place of Supply: ${customerPos}\n`, bold:false, margin:[0,0,0,2]},
      {text: `Contact No: ${customerMob}\n`, bold:false, margin:[0,0,0,2]},
    ]

    if(!this.isPlaceOfSupply){
      clientdetailsSection.splice(1,1)
    }

    const customerSection = {
          margin: [0, 5, 0, 0],
          width: "*",
          fontSize:9,
          table: {
                widths: ["49.9%","0.2%", "49.9%"],
              body: [
                [{
              width: "*",
              stack: clientdetailsSection
                },

                 {text: "", border:[false,false,false]},

                 {
              width: "*",
                stack: [
                       {text: `Bill No: ${bosNumber}\n`, bold:false, margin:[0,0,0,2]},
                       {text: `Bill Date: ${bosDate}\n`, bold:false, margin:[0,0,0,2]},
                       {text: `Due Date: ${dueDate}\n`, bold:false, margin:[0,0,0,2]},
                       {text: `Terms: ${term}\n`, bold:false, margin:[0,0,0,2]}]
                    },

                 ]]
                }
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

                vLineWidth: function (i, node) {
                      return (i === 0 || i === node.table.widths.length) ? 1 : 0;
                },
                hLineColor: function (i, node) {
                  return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
                },
                vLineColor: function (i, node) {
                      return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
                },
                paddingTop: function(i, node) {return 5},
                paddingBottom: function(i, node) {return 5},
                }
        }

    const oldExpenseTable = {
                margin: [0, 5, 0, 0],
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
                  if (i === 0 || i === node.table.widths.length || i === node.table.widths.length - 2) {
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
                paddingTop: function(i, node) {return 5},
                paddingBottom: function(i, node) {return 5},
                }
        }

    const calculationArr = this.addCal(arr)
    const calculations = {
                  width: "50%",
                  fontSize: 9,
                  table: {
                widths: ["70%","30%"],
              body: calculationArr
                },
            layout: {
                vLineWidth: function (i, node) {return  0;},
                  hLineWidth: function (i, node) {return  0;},
                paddingTop: function(i, node) {return 2},
                paddingBottom: function(i, node) {return 2},
                }

    }

    const CalTable = {
      margin: [0, 10, 0, 0],
      columnGap: 10,
      columns: [
      '',
      calculations
      ]
    }

    const line = {
      style: 'line',
      canvas: [{ type: 'rect', x: -100, y: 0, w: 700, h: 0, r: 0, lineColor: '#000000', color: '#fff' }]
    }

    if(this.isTax) {
      companyDetailSection.columns[1]['stack'].
      push({text: `${companyGstPan}\n`, fontSize: 9, margin:[0,0,0,2]})

      customerSection.table.body[0][0]['stack'].splice(1, 0, {text: this.isTDS?'TRN :'+`${customerGstPan?customerGstPan:''}\n`:'GSTIN'+ `: ${customerGstPan?customerGstPan:''}\n`, margin:[0,0,0,2], bold: false})
      customerSection.table.body[0][0]['stack'].splice(2, 0, {text: this.isTDS?'CRN :'+`${customerCRN?customerCRN : ''}\n`:'', margin:[0,0,0,2], bold: false})
      customerSection.table.body[0][2]['stack'].splice(3, 0, {text: `Reverse Charge: ${isReverseCharge}\n`, margin:[0,0,0,2], bold: false})
    }

    let content = []
    content = [companyDetailSection, line, customerSection]
    if(this.tripDataExists) content.push(expenseTable);
    if(this.oldTripDataExists) content.push(oldExpenseTable);
    if(this.otherDetailExists) content.push(otherItemTable);
    content.push(CalTable)
    return content
  }

  checkAdvanceValue(){
    this.isAdvanceGreaterThenZero = true;
    if(this.fleetData.expenses.expense_v1.total_advance == 0){
      this.isAdvanceGreaterThenZero=false;
    }

    this.isAdvanceGreaterThenZero = this.isAdvanceGreaterThenZero &&
    (this.isFuelReceived || this.isMoneyReceived)
  }

  checkToShowNewAdvanceValue(){
    this.isNewAdvanceGreaterThenZero = true;
    if(this.fleetData.expenses.expense_v2.total_advance == 0){
      this.isNewAdvanceGreaterThenZero=false;
    }

    this.isNewAdvanceGreaterThenZero = this.isNewAdvanceGreaterThenZero &&
    (this.isFuelReceived || this.isMoneyReceived)
  }
}
