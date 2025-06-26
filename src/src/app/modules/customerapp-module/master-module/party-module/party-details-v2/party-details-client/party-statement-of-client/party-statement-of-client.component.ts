import { Component, Input, OnInit } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { PartyDetailsClientService } from '../party-details-client.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import moment from 'moment';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { formatNumber } from 'src/app/shared-module/pipes/numberformat.pipe';

@Component({
  selector: 'app-party-statement-of-client',
  templateUrl: './party-statement-of-client.component.html',
  styleUrls: ['./party-statement-of-client.component.scss']
})
export class PartyStatementOfClientComponent implements OnInit {
  pdfSrc: ''
  @Input() partyId = ''
  params = { start_date: '', end_date: '', is_export: false ,type:''}
  currency_type: any
  companyLogo = ''
  companyDetails;
  partyDetails;
  soaTableData;
  soaType='all'
  constructor(private _partyDetailsClientService: PartyDetailsClientService, private _fileDownload: FileDownLoadAandOpen, private currency: CurrencyService, private _loader: CommonLoaderService) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    this.currency_type = this.currency.getCurrency();
  }

  ngOnInit(): void {

  }

  dateRange(e) {
    this.params.is_export = false
    this.params.end_date = changeDateToServerFormat(e.endDate)
    this.params.start_date = changeDateToServerFormat(e.startDate)
    this.params.type =this.soaType
    this.getInitialDetails()
  }
  optionSelect(){
    this.params.is_export = false
    this.params.type =this.soaType
    this.getInitialDetails() 
  }

  getInitialDetails() {
    this._loader.getShow()
    const request1 = this._partyDetailsClientService.getCompanyLogo();
    const request2 = this._partyDetailsClientService.getCompanyDetails();
    const request3 = this._partyDetailsClientService.getPartyDetails(this.partyId)
    const request4 = this._partyDetailsClientService.getStatementOfAccounts(this.partyId, this.params)
    forkJoin([request1, request2, request3, request4]).subscribe(
      ([response1, response2, response3, response4]) => {
        this.companyLogo = response1['result']['image_blob']
        this.companyDetails = response2['result']
        this.partyDetails = response3['result']
        this.soaTableData = response4['result']
        const pdf = this.pdfGenerateView()
        const pdfDocGenerator = pdfMake.createPdf(pdf);
        pdfDocGenerator.getDataUrl((dataUrl) => {
          this.pdfSrc = dataUrl
          this._loader.getHide()
        });
      },
      (error) => {
        this._loader.getHide()
        console.error('Error occurred:', error);
      }
    );

  }

  downLodExcel() {
    this.params.is_export = true
    this._loader.getShow()
    let fileType=''
    if(this.soaType=='all'){
      fileType='All_Entries'
    }else{
     fileType='Outstanding'
    }
    this._partyDetailsClientService.getStatementOfAccountsExcel(this.partyId, this.params).subscribe(resp => {
      let fileName = `${fileType}_SOA_${moment(this.params.start_date).format('DD/MM/YYYY')}_${moment(this.params.end_date).format('DD/MM/YYYY')}` + ".xlsx"
      this._fileDownload.writeAndOpenFile(resp, fileName).then(data => {
        this._loader.getHide()
      });
    })
  }

  downloadPdf() {
    let fileType=''
    if(this.soaType=='all'){
      fileType='All_Entries'
    }else{
     fileType='Outstanding'
    }
    let fileName = `${fileType}_SOA_${moment(this.params.start_date).format('DD/MM/YYYY')}_${moment(this.params.end_date).format('DD/MM/YYYY')}` + ".pdf"
    const pdfDocGenerator = pdfMake.createPdf(this.pdfGenerateView());
    pdfDocGenerator.getBlob((blob) => {
      this._fileDownload.writeAndOpenFile(blob, fileName).then(data => {
      });
    });
  }


  getdetailsSection(data) {
    let section = []
    if (data) {
      section.push(data.company_name)
      if (data.address.length) {
        let billingAddress = data.address[0]
        if (billingAddress.address_line_1) {
          section.push(billingAddress.address_line_1 + " " + billingAddress.street)
        }
        if (billingAddress.state || billingAddress.pincode) {
          section.push(billingAddress.state + "  " + billingAddress.pincode)
        }
        if (billingAddress.country) {
          section.push(billingAddress.country)
        }
      }

    }
    return section
  }

  pdfGenerateView() {

    let imageSection = {
      image: 'data:image/png;base64,' + this.companyLogo,
      width: 70,
      height: 40,
      alignment: 'right',
      margin: [0, 0, 0, 10],
    }
    let companySection = this.getdetailsSection(this.companyDetails);
    let partySection = this.getdetailsSection(this.partyDetails);
    let headerSection = {
      margin: [0, 0, 0, 10],
      alignment: 'auto',
      fontSize: 7,
      columns: [
        {
          alignment: 'left',
          stack: partySection
        },
        {
          alignment: 'right',
          fontSize: 7,
          stack: companySection
        }
      ]
    }

    let headingSection = {
      margin: [0, 0, 0, 10],
      fontSize: 7,
      alignment: 'right',
      stack: [
        { text: 'Statement of Accounts', bold: true, fontSize: '12' },
        { text: `DATE - ${moment(this.params.start_date).format('DD/MM/YYYY')} to ${moment(this.params.end_date).format('DD/MM/YYYY')}` },
      ],
    }

    let summarySection = {
      margin: [0, 0, 0, 10],
      columns: [
        { text: '', width: '50%' },
        {
          style: '',
          fontSize: 7,
          table: {
            headerRows: 4,
            margin: [0, 0, 0, 0],
            widths: ["*", "*"],
            body: [
              [{ text: 'Account Summary', bold: true, fillColor: '#F6F6F6', fontSize: '10', margin: [10, 0, 0, 0], }, { text: '', fillColor: '#F6F6F6' }],
              [{ text: "Opening Balance", margin: [10, 0, 0, 0] }, { text: `${this.currency_type?.symbol} ${formatNumber(this.soaTableData.opening_balance)}`, alignment: 'right', margin: [0, 0, 10, 0] }],
              [{ text: "Invoiced Amount", margin: [10, 0, 0, 0] }, { text: `${this.currency_type?.symbol} ${formatNumber(this.soaTableData.total_invoices)}`, alignment: 'right', margin: [0, 0, 10, 0] }],
              [{ text: "Amount Recieved", margin: [10, 0, 0, 0] }, { text: `${this.currency_type?.symbol} ${formatNumber(this.soaTableData.total_payments_received)}`, alignment: 'right', margin: [0, 0, 10, 0] }],
              [{ text: 'Balance Due', bold: true, margin: [10, 0, 0, 0] }, { text: `${this.currency_type?.symbol} ${this.soaTableData.closing_balance}`, alignment: 'right',bold: true, margin: [0, 0, 10, 0] }],
            ]
          },
          layout: 'headerLineOnly'
        },
      ]
    }

    let tableData = []
    tableData = [[
      { text: 'DATE', color: 'white', fillColor: '#595FAB', margin: [10, 0, 0, 0] },
      { text: 'TRANSACTION', color: 'white', fillColor: '#595FAB' },
      { text: 'DETAILS', color: 'white', fillColor: '#595FAB' },
      { text: `AMOUNT (${this.currency_type?.symbol})`, color: 'white', fillColor: '#595FAB' },
      { text: `PAYMENTS (${this.currency_type?.symbol})`, color: 'white', fillColor: '#595FAB' },
      { text: `BALANCE (${this.currency_type?.symbol})`, color: 'white', fillColor: '#595FAB' },
    ]];
    let tableDataList = this.soaTableData['table_data']
    tableDataList.forEach(data => {
      let tableRow = []
      tableRow.push({ text: data.date, margin: [10, 0, 0, 0] })
      tableRow.push({ text: data.transaction })
      let details = [];
      data.detail.detail.forEach(detail => {
        details.push(detail)
      });
      tableRow.push({ stack: details })
      tableRow.push({ text: formatNumber(data.amount) })
      tableRow.push({ text: formatNumber(data.payment) })
      tableRow.push({ text: formatNumber(data.balance) })
      tableData.push(tableRow)
    });
    let tableSection = {
      alignment: 'left',
      fontSize: 7,
      table: {
        headerRows: 1,
        widths: Array(tableData[0].length).fill((100 / tableData[0].length).toFixed(3) + "%"),
        body: tableData
      },
      layout: {
        fillColor: function (rowIndex, node, columnIndex) {
          return (rowIndex % 2 === 0) ? '#F6F6F6' : null;
        },
        hLineColor: function (i, node) {
          return (i === 1 || i === node.table.body.length) ? '#DCDBDB' : '#DCDBDB';
        },
        vLineColor: function (i, node) {
          return (i === 0 || i === node.table.widths.length) ? 'gray' : 'white';
        },
        vLineWidth: function (i, node) {
          return 0;
        }
      }
    }

    let balanceSection = {
      margin: [0, 10, 0, 0],
      columns: [
        { text: '', width: '50%' },
        {
          style: '',
          fontSize: 7,
          table: {
            margin: [0, 0, 0, 0],
            widths: ["*", "*"],
            body: [
              [{ text: 'Balance Due', bold: true, margin: [10, 0, 0, 0] }, { text: `${this.currency_type?.symbol} ${this.soaTableData.closing_balance}`, alignment: 'right', bold: true, margin: [0, 0, 10, 0] }],
            ]
          },
          layout: 'headerLineOnly'
        },
      ]
    }


    let content = {
      content: [imageSection, headerSection, headingSection, summarySection, tableSection, balanceSection],
      pageOrientation: 'potrait',
      pageSize: 'A4',
    }
    return content

  }

}
