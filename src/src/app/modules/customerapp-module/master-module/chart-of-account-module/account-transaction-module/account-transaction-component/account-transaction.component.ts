import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { OpeningBalanceService } from '../../../../api-services/master-module-services/chart-of-account-service/chart-of-account.service';
import { changeDateToServerFormat, monthDate } from 'src/app/shared-module/utilities/date-utilis';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { checkEmpty } from 'src/app/shared-module/utilities/helper-utils';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CompanyServices } from '../../../../api-services/company-service/company-services.service';
import { CommonService } from 'src/app/core/services/common.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { getSetViewDetails } from 'src/app/core/services/getsetviewdetails.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { addImageColumn } from 'src/app/shared-module/utilities/pdfmake-uitls';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';


@Component({
  selector: 'app-account-transaction',
  templateUrl: './account-transaction.component.html',
  styleUrls: ['./account-transaction.component.scss'],
})
export class AccountTransactionComponent implements OnInit {

  id: any;
  selectedRange: Date[];
  dateToday = new Date(dateWithTimeZone());
  type: string;
  startDate = new Date(this.dateToday.getFullYear(), this.dateToday.getMonth(), 1);
  opening_balance: any;
  end_balance: any;
  transactions: any;
  closing_balance: any;
  final_balance: any;
  account_name: any;
  domReady: boolean = false;
  from_date: any;
  to_date: any;
  companyDetails: any;
  company_logo: any;
  currency_type;
  openCoa=false;
  urlList=new ValidationConstants().routeConstants;
  viewable_attr={
    id: "",
    screen: "",
    sub_screen: ""
    }
    prefixUrl='';
    isMobile = false;
    detailsscreenlist =['invoice',"creditnote","debitnote","fuel","otherexpenseactivity","inventoryactivity","fleetowner",
     "tyrerotation","tyrechangenew","tyrechangeinventory","maintenancenew","maintenanceinventory", "foreman",
     "tripexpense"]
  constructor(
    private route: ActivatedRoute, private _obService: OpeningBalanceService, private viewService:getSetViewDetails,  private ngxService: NgxUiLoaderService, private deviceService: DeviceDetectorService,private _fileDownload:FileDownLoadAandOpen,
    private _companyService: CompanyServices, private _commonService: CommonService, private currency:CurrencyService,private _preFixUrl:PrefixUrlService, private _router:Router,
		) {
      this.selectedRange = [this.startDate, this.dateToday];
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
      this.isMobile = this.deviceService.isMobile();
    }


  ngOnInit() {
     setTimeout(() => {
      this.currency_type = this.currency.getCurrency();
    }, 1000);
    this.route.params.subscribe((params) => {
      this.id = params;
    });
    this._commonService.fetchCompanyLogo().subscribe((response: any) => {
      this.company_logo = response.result.image_blob
    });
    this.prefixUrl = this._preFixUrl.getprefixUrl();
    this.from_date = this.formatDate(this.startDate);
    this.to_date = this.formatDate(this.dateToday);
    this.accountTransactionDetail({start_date: this.from_date, end_date: this.to_date});
  }

  formatDate(date: Date){
    return date.getFullYear().toString() + '-' + (Number(date.getMonth())+1).toString() + '-' + date.getDate().toString();
  }


  filterAccountTransactionDetail(dateRange) {
    if (dateRange && dateRange.length > 0) {
      this.from_date = changeDateToServerFormat(dateRange[0].toString());
      this.to_date = changeDateToServerFormat(dateRange[1].toString());
      let dateParams = {
        start_date: this.from_date,
        end_date: this.to_date
      }
      this.accountTransactionDetail(dateParams);
    }
  }

  accountTransactionDetail(dateParams) {
    this._obService.getAccountTransaction(this.id.account_id, dateParams).subscribe((response: any) => {
        this.getCompanyInformation();
        this.account_name = response.result;
        this.opening_balance = response.result.opening_balance;
        this.end_balance = response.result.end_balance;
        this.transactions = response.result.transactions;
        this.closing_balance = response.result.closing_balance;
        this.final_balance = response.result.final_balance;
		});
  }

  getCompanyInformation() {
    this._companyService.getCompanyDetailPrintView().subscribe((res: any) => {
        this.companyDetails = res.result;
        this.companyDetails.address = this.companyDetails.address ? this.parseAddress(this.companyDetails.address) : null
    });
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

  generateFileName(){
    const accountName = this.account_name.account_name;
    return `${accountName}`;
  }

  downloadPdf(print: boolean = false){
    this.ngxService.start();
    let fileTitle = 'ORIGINAL FOR RECIPIENT';
    let fileName = 'COA';
    if (print) {
      pdfMake.createPdf(this.generatePDF(fileTitle)).print();
    } else {
      let fileNameis =fileName+'_'+this.generateFileName()+".pdf"
      const pdfDocGenerator = pdfMake.createPdf(this.generatePDF(fileTitle));
      pdfDocGenerator.getBlob((blob) => {
        this._fileDownload.writeAndOpenFile(blob, fileNameis).then(data => {
        });
      });
    }
    setTimeout(() => {
      this.ngxService.stop();
    }, 500);
  }

  generatePDF(title: string) {
    // Item Challans
    let items = [];
    let itemWidths = [];

    itemWidths = ["14.28%", "14.28%", "14.28%", "14.28%", "14.28%", "14.28%", "14.28%"];
    items.push(
      [
        { text: 'DATE', bold: true }, { text: 'TRANSACTION TYPE', bold: true },
        { text: 'TRANSACTION NO.', bold: true }, { text: 'DEBIT ' + '(' + this.currency_type.symbol + ')', bold: true }, { text: 'CREDIT ' + '(' + this.currency_type.symbol + ')', bold: true }, { text: 'AMOUNT '+ '(' + this.currency_type.symbol + ')', bold: true },
        { text: 'BALANCE ' + '(' + this.currency_type.symbol + ')', bold: true }
      ]
    );

    items.push(
      [
        { text: 'As on ' + this.opening_balance.date },
        'Opening Balance',
        {},
        this.opening_balance.debit,
        this.opening_balance.credit,
        this.opening_balance.amount,
        this.opening_balance.balance,
      ]
    );

    this.transactions.forEach((ele) => {
      items.push([
        ele.date,
        ele.transaction_type,
        ele.transaction_no,
        ele.debit,
        ele.credit,
        ele.amount,
        ele.balance
      ]);
    });

    items.push(
      [
        { text: 'Sum of all Credits and Debits', colSpan: 3, bold: true, alignment: 'center' },
        {},
        {},
        {text: this.end_balance.debit, bold: true},
        {text: this.end_balance.credit, bold: true},
        {},
        {}
      ]
    );

    items.push(
      [
        { text: 'As on ' + this.closing_balance.date },
        'Closing Balance',
        {},
        this.closing_balance.debit,
        this.closing_balance.credit,
        this.closing_balance.amount,
        {}
      ]
    );

    items.push(
      [
        {},
        {},
        {},
        {text: this.final_balance.debit, bold: true},
        {text: this.final_balance.credit, bold: true},
        {},
        {text: this.final_balance.balance, bold: true},
      ]
    );

    let header = {
      text: 'TRANSACTION SUMMARY',
      style: 'header',
      alignment: 'center'
    }

    let lineStyle1 = {
      style: 'line',
      canvas: [{ type: 'rect', x: -100, y: 0, w: 700, h: .2, r: 0, lineColor: '#868686', color: '#fff' }]
    }
     let address=[];
     if(checkEmpty(this.companyDetails, ['company_display_name'])){
      address.push( { text: checkEmpty(this.companyDetails, ['company_display_name']), fontSize: 10, bold: true });
      address.push('\n')
     }
     if(checkEmpty(this.companyDetails, ['address', 'billingAddress', 'address_line_1']) ||  checkEmpty(this.companyDetails, ['address', 'billingAddress', 'street']) ){
      address.push( { text: checkEmpty(this.companyDetails, ['address', 'billingAddress', 'address_line_1']) + ' ' + checkEmpty(this.companyDetails, ['address', 'billingAddress', 'street']), fontSize: 9 })
      address.push('\n')
     }
     if( checkEmpty(this.companyDetails, ['address', 'billingAddress', 'district'])|| checkEmpty(this.companyDetails, ['address', 'billingAddress', 'city'])){
      address.push( { text: checkEmpty(this.companyDetails, ['address', 'billingAddress', 'district']) + ' ' + checkEmpty(this.companyDetails, ['address', 'billingAddress', 'city']), fontSize: 9 })
      address.push('\n')
     }
     if(checkEmpty(this.companyDetails, ['address', 'billingAddress', 'state'])|| checkEmpty(this.companyDetails, ['address', 'billingAddress', 'pincode'])){
      address.push({ text: checkEmpty(this.companyDetails, ['address', 'billingAddress', 'state']) + ' ' + checkEmpty(this.companyDetails, ['address', 'billingAddress', 'pincode']), fontSize: 9 })
     }
    const companyAddress = {
      columns: [
        addImageColumn(this.company_logo,100,100),
        {
          style: 'address',
          text: address
        },
      ]
    };

    const line2 = {
      style: 'line',
      canvas: [{ type: 'rect', x: -100, y: 0, w: 700, h: .2, r: 0, lineColor: '#000000', color: '#fff' }]
    };


    const companyDetails = {
      columns: [
        {
          alignment: 'left',
          text: [
            { text: checkEmpty(this.companyDetails, ['email_address']) + '  | ' + checkEmpty(this.companyDetails, ['primary_mobile_number']), fontSize: 9 }
          ]
        },
      ]
    };

    const line3 =  {
      style: 'line',
      canvas: [{ type: 'rect', x: -100, y: 0, w: 700, h: .2, r: 0, lineColor: '#000000', color: '#fff' }]
    };


    let account_header = {
      columns: [
        {
          margin: [0, 10, 0, 10],
          alignment: 'center',
          bold: true,
          text: [{text: `${this.account_name.account_name}`, fontSize: 20},
          '\n',
          {text: `From ${monthDate(this.from_date)} To ${monthDate(this.to_date)}`, fontSize: 10}]
        },

      ]
    }

    let item_table = {
      margin: [0, 10, 0, 10],
      alignment: 'left',
      fontSize: 7,
      table: {
        margin: "15",
        widths: itemWidths,
        headerRows: 2,
        keepWithHeaderRows: 0,
        body: items
      },
      layout: {
        hLineColor: function (i, node) {
          return (i === 0 || i === node.table.body.length) ? '#868686' : '#868686';
        },
        vLineColor: function (i, node) {
          return (i === 0 || i === node.table.widths.length) ? '#868686' : '#868686';
        },
        vLineWidth: function (i, node) {
          if (i === 0 || i === node.table.widths.length) {
            return null;
          }
          return 0;
        },
        paddingLeft: function (i, node) { return 10; },
        paddingRight: function (i, node) { return 1; },
        paddingTop: function (i, node) { return 5; },
        paddingBottom: function (i, node) { return 5; },
      }
    }

    let contentList: Array<any> = [];
    contentList = [header, lineStyle1, companyAddress, line2, companyDetails, line3,, account_header, item_table];



    // <!-- PDF GENERATOR STARTS HERE  --> //
    return {
      pageSize: 'A4',
      pageMargins: [10, 10, 10, 10],
      content: contentList,
      styles: {
        header: {
          fontSize: 10,
          bold: true,
          alignment: 'justify',
          margin: [0, 0, 0, 0]
        },
        line: {
          alignment: 'center',
          margin: [0, 10, 0, 10]
        },
        table_head: {
          margin: [5, 5, 5, 5]
        },
        address: {
          alignment: 'right',
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
        }
      }
    }
    // <!-- PDF GENERATOR ENDS HERE  --> //
  }

  }

  routeToview(data){
    let dataSelected:any
      dataSelected= this.urlList.filter(item =>item.name==data.url.name)[0];
   if(dataSelected){
    if(this.detailsscreenlist.includes(data.url.name)){
      this.viewable_attr={
        id:data.url.id,
        screen:data.url.name,
        sub_screen:data.url.name
        }
     this.viewService.viewInfo =  this.viewable_attr;
     let url = this.prefixUrl+dataSelected.route
     this._router.navigateByUrl(url)
  }else{
    let subroute=  this.subName(data.url.subname);
    let url =''
    if(subroute){
       url = this.prefixUrl+dataSelected.route+data.url.id+'/'+subroute;
    }else{
      url = this.prefixUrl+dataSelected.route+data.url.id;
    }
    // this._router.navigateByUrl(url)
     window.open(url,'_blank')
   }
  }
  }

  downloadXlsx(){
    let dateParams = {
      start_date: this.from_date,
      end_date: this.to_date
    }
    let fileName = "COA_" + this.generateFileName()+ '.' + 'xlsx';
    this._obService.getCOAExport(this.id.account_id,dateParams).subscribe(data=>{
      this._fileDownload.writeAndOpenFile(data, fileName).then(data => {
      });
    })
  }


subName(subname){
  if(subname){
    for (let index in this.urlList) {
      if(this.urlList[index]['subname']){
        if(this.urlList[index]['subname'].includes(subname)){
         let indexof  = this.urlList[index]['subname'].indexOf(subname);
         let subRoute = this.urlList[index]['subroute'][indexof]
        return subRoute
        }

      }
    }
    return ''
  }
}


}
