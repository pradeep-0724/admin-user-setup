import { PurchaseOrderService } from '../../../api-services/inventory-purchase-order-service/purchase-order.service';
import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonService } from 'src/app/core/services/common.service';
import { checkEmpty } from 'src/app/shared-module/utilities/helper-utils';
import { normalDate } from 'src/app/shared-module/utilities/date-utilis';
import { PartyService } from '../../../api-services/master-module-services/party-service/party.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CompanyServices } from '../../../api-services/company-service/company-services.service';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { addImageColumn } from 'src/app/shared-module/utilities/pdfmake-uitls';


@Component({
  selector: 'app-purchase-order-details',
  templateUrl: './purchase-order-details.component.html',
  styleUrls: ['./purchase-order-details.component.scss']
})
export class PurchaseOrderDetailsComponent implements OnInit {

  @Input()  purchaseOrderId :BehaviorSubject<any>;
  purchaseOrderData;
  currency_type;
  company_logo;
  partyData: any=[];
  partyAddress: any=[];
  companyDetails:any=[];
  isEditable = false;
  prefixUrl: string;
  isMobile = false;
  pdfSrc = "";
  companyAddress =[];
  purchasePer=Permission.purchase_order.toString().split(',')


  constructor(private currency:CurrencyService,private _poPrintView:PurchaseOrderService, private companyService:CompanyServices,
              private _partyService: PartyService, private ngxService: NgxUiLoaderService, private deviceService: DeviceDetectorService,private _fileDownload:FileDownLoadAandOpen,
              private _commonService: CommonService, private _prefixUrl:PrefixUrlService) {
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
    }

  ngOnInit() {
    this.prefixUrl = this._prefixUrl.getprefixUrl();
    this.currency_type = this.currency.getCurrency();
    this.isMobile = this.deviceService.isMobile();
    this._commonService.fetchCompanyLogo().subscribe((response: any) => {
      this.company_logo = response.result.image_blob;
    }, (err) => {
      this.company_logo = null;
    });
    this.purchaseOrderId.subscribe(data=>{
    if(data){
     this._poPrintView.getPrintPurchaseOrderDetail(data).subscribe(data=>{
       this.purchaseOrderData =data['result'];
       this.getPartyDetails(this.purchaseOrderData.vendor.id);
      if(this.purchaseOrderData.draft_po || this.purchaseOrderData.approval_status.label == 'Approval Pending'){
        this.isEditable = true;
      }
      else{
        this.isEditable = false ;
      }
     })
    }
    })
  }

  dateChange(date) {
    return normalDate(date);
  }

  getPartyDetails(id){
    this._partyService.getPartyAdressDetails(id).subscribe((res)=>{
      this.partyData = res['result'];
      this.partyAddress = this.partyData.address;
      this.getCompanyDetails();
    })
  }

  downloadPdf(data, print: boolean = false){
    this.processPdf(data, print);
  }

  processPdf(data, print: boolean = false) {
    this.ngxService.start();
    let fileTitle = 'PURCHASE ORDER '
    if (data.is_draft) {
      fileTitle += " (DRAFT)"
    }
    if (print) {
      pdfMake.createPdf(this.generatePDF(data, fileTitle)).print();
    } else {
      setTimeout(() => {
        let fileName = this.generateFileName()+".pdf";
          const pdfDocGenerator = pdfMake.createPdf(this.generatePDF(data, fileTitle));
          pdfDocGenerator.getBlob((blob) => {
            this._fileDownload.writeAndOpenFile(blob, fileName).then(data => {
            });
          });
      }, 500);
    }
    setTimeout(() => {
      this.ngxService.stop();
    }, 500);
  }

  generateFileName() {
    let vendorName = this.purchaseOrderData['vendor']['company_name'];
    let poNumber = this.purchaseOrderData['po_number'];
    return `${vendorName}_${poNumber}`;
  }

  generatePDF(data,fileTitle){

    const headTitle = { text: `${fileTitle}`, style: 'header', alignment: 'center' };

    const line1 = {
      style: 'line',
      canvas: [{ type: 'rect', x: -100, y: 0, w: 700, h: .2, r: 0, lineColor: '#000000', color: '#fff' }]
    };

    const companyAddress = {
      columns: [
        addImageColumn(this.company_logo,100,100),
        {
          text: ''
        },
        {
          text: ''
        },
        {
          style: 'address',
          text: [
            { text: checkEmpty(this.companyDetails, ['company_name']), fontSize: 10, bold: true },
            '\n',
            { text: checkEmpty(this.companyDetails, ['address', this.companyAddress.length?this.companyAddress.length-2:0, 'address_line_1']) + ' ' + checkEmpty(this.companyDetails, ['address', this.companyAddress.length?this.companyAddress.length-2:0, 'street']) + ',', fontSize: 9 },
            '\n',
            { text: checkEmpty(this.companyDetails, [ 'address', this.companyAddress.length?this.companyAddress.length-2:0, 'country']) + ' ' + checkEmpty(this.companyDetails, [ 'address', this.companyAddress.length?this.companyAddress.length-2:0, 'city']) + ',', fontSize: 9 },
            '\n',
            { text: checkEmpty(this.companyDetails, [ 'address', this.companyAddress.length?this.companyAddress.length-2:0, 'state']) + ' ' + checkEmpty(this.companyDetails, [ 'address', this.companyAddress.length?this.companyAddress.length-2:0, 'pincode']), fontSize: 9 }
          ]
        },
      ]
    };




    const companyDetails = {
      columns: [
        {
          alignment: 'left',
          text: [
            { text: checkEmpty(this.companyDetails, ['email_address']), fontSize: 9 }
          ]
        },
        {
          alignment: 'right',
          text: [
            { text:checkEmpty(this.companyDetails, ['primary_mobile_number']), fontSize: 9 }
          ]
        },
      ]
    };
    const vendorDetails = {
      columns: [
        {
          lineHeight: 1.2,
          alignment: 'left',
          text: [
            { text: 'Vendor Name: ', fontSize: 9 },
            { text: checkEmpty(this.partyData, ['company_name']), fontSize: 9, bold: true },
          ]
        }
      ]
    };

    const line2 = {
      style: 'line',
      canvas: [{ type: 'rect', x: -100, y: 0, w: 700, h: .2, r: 0, lineColor: '#000000', color: '#fff' }]
    };

    const billDetails = {
      columns: [
        {
          lineHeight: 1.2,
          alignment: 'left',
          text: [
            { text: 'PO Number: ', fontSize: 9 },
            { text: checkEmpty(data, ['po_number']), fontSize: 9, bold: true },
            { text: '\n' },
            { text: 'PO Date : ', fontSize: 9 },
            { text: this.dateChange(data.po_date), fontSize: 9, bold: true }
          ]
        },
        {
          lineHeight: 1.2,
          alignment: 'left',
          text: [
            { text: 'Expected Delivery Date : ', fontSize: 9 },
            { text: this.dateChange(data.expected_devliery_date), fontSize: 9, bold: true },
            { text: '\n' },
            { text: 'Payment Term ', fontSize: 9 },
            { text: checkEmpty(data, ['payment_term', 'label']), fontSize: 9, bold: true }
          ]
        },
        {
          lineHeight: 1.2,
          alignment: 'left',
          text: [
            { text: 'Employee Name: ', fontSize: 9 },
            { text: checkEmpty(data, ['employee', 'display_name']), fontSize: 9, bold: true },

          ]
        },
      ]
    };

    const line3 = {
      style: 'line',
      canvas: [{ type: 'rect', x: -100, y: 0, w: 700, h: .2, r: 0, lineColor: '#000000', color: '#fff' }]
    };

    let spareItems = [];
    let itemSpareWidths = [];

    itemSpareWidths = ["16.66%", "16.66%", "16.66%", "16.66%", "16.66%", "16.66%"]
      spareItems.push([
        {
          style: 'table_title',
          text:
            [
              { text: 'SPARES', fontSize: 10, bold: true },
            ],
          colSpan: 6
        }, {}, {}, {}, {}, {}
      ])
      spareItems.push(
        [
          { text: 'S.NO', bold: true }, { text: 'ITEM NAME', bold: true }, { text: 'QUANTITY', bold: true }, { text: 'UNIT', bold: true },
          { text: 'UNIT COST' + '(' + this.currency_type.symbol + ')', bold: true },
          { text: 'ESTIMATED TOTAL' + '(' + this.currency_type.symbol + ')' , bold: true }
        ]
      );

      data.spares.forEach((ele, i) => {
        spareItems.push([
          i + 1, checkEmpty(ele, ['item', 'name']), checkEmpty(ele, ['quantity']), checkEmpty(ele, ['unit', 'label']),
            { text:  checkEmpty(ele, ['rate'], true) }, { text:  checkEmpty(ele, ['total'], true) }
        ]);
      });


    let purchaseOrderSparesTab: any = {};
    if (data.spares.length > 0) {
      purchaseOrderSparesTab = {
        margin: [0, 10, 0, 10],
        alignment: 'center',
        fontSize: 7,
        table: {
          widths: itemSpareWidths,
          headerRows: 2,
          keepWithHeaderRows: 0,
          body: spareItems
        },
        layout: {
          hLineColor: function (i, node) {
            return (i === 0 || i === node.table.body.length) ? '#000000' : '#000000';
          },
          vLineColor: function (i, node) {
            return (i === 0 || i === node.table.widths.length) ? '#000000' : '#000000';
          },
          vLineWidth: function (i, node) {
            if (i === 0 || i === node.table.widths.length) {
              return null;
            }
            return 0;
          },
          paddingLeft: function (i, node) { return 1; },
          paddingRight: function (i, node) { return 1; },
          paddingTop: function (i, node) { return 5; },
          paddingBottom: function (i, node) { return 5; },
        }
      };
    }


    let tyreItems = [];
    let itemTyreWidths = [];

      itemTyreWidths = ["20%", "20%", "20%", "20%", "20%"]
      tyreItems.push([
        {
          style: 'table_title',
          text:
            [
              { text: 'TYRES', fontSize: 10, bold: true },
            ],
          colSpan: 5
        }, {}, {}, {}, {}
      ])
      tyreItems.push(
        [
          { text: 'S.NO', bold: true }, { text: 'TYRE', bold: true }, { text: 'QUANTITY', bold: true },
          { text: 'UNIT COST' + '(' + this.currency_type.symbol + ')', bold: true },
          { text: 'ESTIMATED TOTAL' + '(' + this.currency_type.symbol + ')' , bold: true }
        ]
      );

      data.tyres.forEach((ele, i) => {
        tyreItems.push([
          i + 1,
          {text: checkEmpty(ele, ['manufacturer', 'label']) + ' | ' + checkEmpty(ele, ['tyre_model', 'name']) + ' | ' +
          checkEmpty(ele, ['thread_type', 'label']) },

            { text:  checkEmpty(ele, ['quantity'], true) }, { text:  checkEmpty(ele, ['rate'], true) }, { text:  checkEmpty(ele, ['total'], true) }
        ]);
      });


    let purchaseOrderTyreTab: any = {};
    if (data.tyres.length > 0) {
      purchaseOrderTyreTab = {
        margin: [0, 10, 0, 10],
        alignment: 'center',
        fontSize: 7,
        table: {
          widths: itemTyreWidths,
          headerRows: 2,
          keepWithHeaderRows: 0,
          body: tyreItems
        },
        layout: {
          hLineColor: function (i, node) {
            return (i === 0 || i === node.table.body.length) ? '#000000' : '#000000';
          },
          vLineColor: function (i, node) {
            return (i === 0 || i === node.table.widths.length) ? '#000000' : '#000000';
          },
          vLineWidth: function (i, node) {
            if (i === 0 || i === node.table.widths.length) {
              return null;
            }
            return 0;
          },
          paddingLeft: function (i, node) { return 1; },
          paddingRight: function (i, node) { return 1; },
          paddingTop: function (i, node) { return 5; },
          paddingBottom: function (i, node) { return 5; },
        }
      };
    }

  const line5 = {
    style: 'line',
    canvas: [{ type: 'rect', x: -100, y: 0, w: 700, h: .2, r: 0, lineColor: '#000000', color: '#fff' }]
  };

  const line6 = {
    style: 'line',
    canvas: [{ type: 'rect', x: -100, y: 0, w: 700, h: .2, r: 0, lineColor: '#000000', color: '#fff' }]
  };

  const bottomCalculations = {
    columnGap: 10,
    columns: [
      '',
      '',
      {
        lineHeight: 1.5,
        alignment: 'right',
        bold: true,
        text: [

          { text: 'Total:', fontSize: 9 },
        ]
      },
      {
        lineHeight: 1.5,
        alignment: 'right',
        bold: true,
        text: [
          { text:  this.currency_type.symbol + " " + data.total, fontSize: 9 },
        ]
      },
    ]
  };

  const line9 = {
    style: 'line',
    canvas: [{ type: 'rect', x: -100, y: 0, w: 700, h: .2, r: 0, lineColor: '#000000', color: '#fff' }]
  };
  const bottomDetails1 = {
    columns: [
      {
        lineHeight: 1.2,
        alignment: 'left',
        text: [
          { text: 'Approval Status: ', fontSize: 9 },
          { text: checkEmpty(data, ['approval_status', 'label']), fontSize: 9, bold: true }
        ]
      },
      {
        lineHeight: 1.2,
        alignment: 'left',
        text: [
          { text: 'Approval User: ', fontSize: 9 },
          { text: checkEmpty(data, ['approval_user', 'display_name']), fontSize: 9, bold: true }
        ]
      },
      {
        lineHeight: 1.2,
        alignment: 'left',
        text: [
          { text: 'Optional Comment : ', fontSize: 9 },
          { text: checkEmpty(data, ['comments']), fontSize: 9, bold: true }
        ]
      },
    ]
  };

  const line11 = {
    style: 'line',
    canvas: [{ type: 'rect', x: -100, y: 0, w: 700, h: .2, r: 0, lineColor: '#000000', color: '#fff' }]
  };

    const partyDetails = {
      margin: [0, 10, 0, 10],
      table: {
        widths: ["*", 150, "*"],
        headerRows: 1,
        keepWithHeaderRows: 1,
        body: [
          [
            {
              style: 'address_table',
              border: [true, true, false, true],
              text: [
                { text: 'BILLING ADDRESS: ', fontSize: 9, bold: true },
                '\n',
                { text: checkEmpty(this.partyData, ['address', '0', 'address_line_1']) + ' ' + checkEmpty(this.partyData, ['address', '0', 'street']) + ',', fontSize: 9 },
                '\n',
                { text: checkEmpty(this.partyData, ['address', '0', 'country'])},
                '\n',
                { text: checkEmpty(this.partyData, ['address', '0', 'state']) + ' ' + checkEmpty(this.partyData, ['address', '0', 'pincode']), fontSize: 9 }
              ]
            },
            {
              style: 'address_table',
              border: [false, true, false, true],
              text: [
                { text: '' },
              ]
            },
            {
              style: 'address_table',
              border: [false, true, true, true],
              text: [
                { text: 'SHIPPING ADDRESS: ', fontSize: 9, bold: true },
                '\n',
                { text: checkEmpty(this.partyData, ['address', '1', 'address_line_1']) + ' ' + checkEmpty(this.partyData, ['address', '1', 'street']) + ',', fontSize: 9 },
                '\n',
                { text: checkEmpty(this.partyData, ['address', '1', 'country'])},
                '\n',
                { text: checkEmpty(this.partyData, ['address', '1', 'state']) + ' ' + checkEmpty(this.partyData, ['address', '1', 'pincode']), fontSize: 9 }
              ]
            }
          ]
        ]
      },
      layout: {
        hLineColor: function (i, node) {
          return (i === 0 || i === node.table.body.length) ? '#000000' : '#000000';
        },
        vLineColor: function (i, node) {
          return (i === 0 || i === node.table.widths.length) ? '#000000' : '#000000';
        },
      }
    };

    return {
      pageSize: 'A4',
      pageMargins: [40, 10, 40, 40],
      content: [
        headTitle,
        line1,
        companyAddress,
        line2,
        companyDetails,
        line3,
        vendorDetails,
        partyDetails,
        line5,
        billDetails,
        line9,
        purchaseOrderSparesTab,
        purchaseOrderTyreTab,
        line6,
        bottomCalculations,
        line11,
        bottomDetails1,
      ],
      styles: {
        header: {
          fontSize: 10,
          bold: true,
          alignment: 'justify',
          margin: [0, 0, 0, 0]
        },
        logo: {
          alignment: 'right',
          margin: [0, 10, 0, 10]
        },
        address: {
          alignment: 'right',
          lineHeight: 1.4,
          margin: [0, 20, 0, 10]
        },
        line: {
          alignment: 'center',
          margin: [0, 10, 0, 10]
        },
        table_head: {
          margin: [5, 5, 5, 5]
        },
        address_table: {
          alignment: 'left',
          lineHeight: 1.4,
          margin: [5, 5, 5, 5]
        },
        table_title: {
          margin: [2, 2, 2, 2],
          alignment: 'center'
        },
      },
      defaultStyle: {
        columnGap: 30,
        color: '#45505b',
        fontSize: 8
      },
      // Footer
      footer: function (currentPage, pageCount) {
        if (currentPage == pageCount) {
          return {
            columns: [
              '',
              {
                alignment: 'right',
                text: [
                  'Page: ',
                  { text: currentPage.toString(), italics: true },
                  ' of ',
                  { text: pageCount.toString(), italics: true }
                ],
                width: '*'
              }
            ],
            margin: [10, -2, 10, 0],
            columnGap: 5
          };
        } else {
          return {
            columns: [
              '',
              '',
              {
                alignment: 'right',
                text: [
                  'Page: ',
                  { text: currentPage.toString(), italics: true },
                  ' of ',
                  { text: pageCount.toString(), italics: true }
                ],
                width: '*'
              }
            ],
            margin: [10, -2, 10, 0],
            columnGap: 5
          };
        }
      }
    }
  }



  pdfView(data){
    let fileTitle = 'PURCHASE ORDER ';
      const pdfDocGenerator = pdfMake.createPdf(this.generatePDF(data, fileTitle));
      pdfDocGenerator.getDataUrl((dataUrl) => {
          this.pdfSrc = dataUrl
      });
  }

  getCompanyDetails(){
    this.companyService.getCompanyDetailPrintView().subscribe((res)=>{
      this.companyDetails=res['result'];
      this.companyAddress =  this.companyDetails['address'];
      setTimeout(() => {
        this.pdfView(this.purchaseOrderData);
      }, 1500);
    })
  }


}
