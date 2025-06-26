import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { CompanyServices } from 'src/app/modules/customerapp-module/api-services/company-service/company-services.service';
import { addFonts } from 'src/app/shared-module/utilities/pdfmake-uitls';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { CommonService } from 'src/app/core/services/common.service';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { normalDate } from 'src/app/shared-module/utilities/date-utilis';
import { RateCardBillingBasedOn } from 'src/app/core/constants/constant';
import { generatePdfTemplate1, pdfTemplate1 } from 'src/app/shared-module/utilities/pdftemplate-utils';
import { cloneDeep } from 'lodash';
import { formatNumber } from 'src/app/shared-module/pipes/numberformat.pipe';
@Component({
  selector: 'app-rate-card-header-details',
  templateUrl: './rate-card-header-details.component.html',
  styleUrls: ['./rate-card-header-details.component.scss']
})
export class RateCardHeaderDetailsComponent implements OnInit {

  @Input() rateCardDetails = new Observable();
  rateCardHeaderDetails;
  rateCardList = [];
  isFormList: boolean = false;
  prefixUrl = getPrefix();
  currency_type;
  parentBoxChecked: boolean = true;
  companyDetailsData: any;
  companyHeaderDetails: any;
  footerDetails: any;
  isTDS = false;
  isTax: boolean = false;
  companyLogo = ''
  daily = {
    withFuel: true,
    withoutFuel: true,
    additionalHours: true,
    isSelected: true
  }
  weekly = {
    withFuel: true,
    withoutFuel: true,
    additionalHours: true,
    isSelected: true
  }
  monthly = {
    withFuel: true,
    withoutFuel: true,
    additionalHours: true,
    isSelected: true
  };
  rateCardPermission = Permission.rate_card.toString().split(',');
  rateCardBilling = new RateCardBillingBasedOn();
  rateCardBillingList = this.rateCardBilling.RateCardbillingUnitsList
  rateCardBillingHour = this.rateCardBilling.hour
  billingUnit=''
  rateCardTableLabel={
    daily:'',
    weekly:'',
    monthly:''
  }

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




  constructor(private _route: ActivatedRoute, private _router: Router, private _tax: TaxService,
    private _fileDownload: FileDownLoadAandOpen, private _commonService: CommonService,
    private _currency: CurrencyService, private _companyDetailsService: CompanyServices,
  ) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    addFonts(pdfMake);
  }

  ngOnInit(): void {
    this.isTax = this._tax.getTax();
    this.isTDS = this._tax.getVat();
    this._route.queryParamMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('fromlist')) {
        this.isFormList = true;
      }
    });
    this.rateCardDetails.subscribe((data: any) => {
      data.date = normalDate(data.date);
      this.rateCardHeaderDetails = data;
      this.billingUnit=this.rateCardBillingList.find(type=>type.value==this.rateCardHeaderDetails?.billing_unit).label
      this.rateCardList = data.ratecardmeta;
      this.rateCardList.forEach(ratecard => {
        ratecard['is_checked'] = true;
      });
      this.parentRateCardChecked(true);
      this.formatLabel()

    })
    this.currency_type = this._currency.getCurrency();
    this.companyDetails();
    this.getCompanyLogo();
  }

  formatLabel(){
    const billingUnit=this.rateCardHeaderDetails?.billing_unit
    if(billingUnit=='hour'){
      this.rateCardTableLabel={
        daily:`DAILY (${this.currency_type?.symbol}) (${this.rateCardBillingHour.day} Hours)`,
        weekly:`WEEKLY (${this.currency_type?.symbol}) (${this.rateCardBillingHour.week} Hours)`,
        monthly:`MONTHLY (${this.currency_type?.symbol}) (${this.rateCardBillingHour.month} Hours)`,
      }
    }else{
      this.rateCardTableLabel={
        daily:`DAILY (${this.currency_type?.symbol})`,
        weekly:`WEEKLY (${this.currency_type?.symbol})`,
        monthly:`MONTHLY (${this.currency_type?.symbol})`,
      }
    }

  }

  historyBack() {
    if (this.isFormList) {
      history.back();
    } else {
      this._router.navigate([this.prefixUrl + '/onboarding/rate-card/list'])
    }
  }

  rateCardChecked(isChecked, index) {
    this.rateCardList.forEach((ratecard, ind) => {
      if (ind === index) {
        ratecard['is_checked'] = isChecked;
      }
    });
    this.parentBoxChecked = this.rateCardList.every(ratecard => ratecard['is_checked'] === true)
  }

  parentRateCardChecked(isChecked) {
    this.rateCardList.forEach((ratecard, index) => {
      this.rateCardChecked(isChecked, index)
    });

  }

  selectAllDaily(isChecked) {
    this.daily.withFuel = isChecked;
    this.daily.withoutFuel = isChecked;
    this.daily.additionalHours = isChecked;
    this.daily.isSelected = isChecked;
  }

  selectAllWeekly(isChecked) {
    this.weekly.withFuel = isChecked;
    this.weekly.withoutFuel = isChecked;
    this.weekly.additionalHours = isChecked;
    this.weekly.isSelected = isChecked;
  }

  selectAllMonthly(isChecked) {
    this.monthly.withFuel = isChecked;
    this.monthly.withoutFuel = isChecked;
    this.monthly.additionalHours = isChecked;
    this.monthly.isSelected = isChecked
  }
  dailySelection(isChecked, type) {
    if (type == 'withFuel') {
      this.daily.withFuel = isChecked;
    } else if (type == 'withoutFuel') {
      this.daily.withoutFuel = isChecked;
    } else if (type == 'additionalHours') {
      this.daily.additionalHours = isChecked;
    }
    this.daily.isSelected = (this.daily.withFuel || this.daily.withoutFuel || this.daily.additionalHours)
  }
  weeklySelection(isChecked, type) {
    if (type == 'withFuel') {
      this.weekly.withFuel = isChecked;
    } else if (type == 'withoutFuel') {
      this.weekly.withoutFuel = isChecked;
    } else if (type == 'additionalHours') {
      this.weekly.additionalHours = isChecked;
    }
    this.weekly.isSelected = (this.weekly.withFuel || this.weekly.withoutFuel || this.weekly.additionalHours)
  }
  monthlySelection(isChecked, type) {
    if (type == 'withFuel') {
      this.monthly.withFuel = isChecked;
    } else if (type == 'withoutFuel') {
      this.monthly.withoutFuel = isChecked;
    } else if (type == 'additionalHours') {
      this.monthly.additionalHours = isChecked;
    }
    this.monthly.isSelected = (this.monthly.withFuel || this.monthly.withoutFuel || this.monthly.additionalHours)
  }
  getCompanyLogo() {
    this._commonService.fetchCompanyLogo().subscribe((response: any) => {
      this.companyLogo = response.result.image_blob;
    }, (err) => {
      this.companyLogo = null;
    });
  }

  export() {  
    if (!this.isTax) {
      this.companyHeaderDetails.companyGstPan = '';
    }
    let rowsSpan = 0;
    if (this.daily.isSelected) {
      rowsSpan += 1;
    }
    if (this.weekly.isSelected) {
      rowsSpan += 1;
    }
    if (this.monthly.isSelected) {
      rowsSpan += 1;
    }
    let isWithFuel = this.daily.withFuel || this.weekly.withFuel || this.monthly.withFuel;
    let isWithoutFuel = this.daily.withoutFuel || this.weekly.withoutFuel || this.monthly.withoutFuel;
    let isAdditionalHours = this.daily.additionalHours || this.weekly.additionalHours || this.monthly.additionalHours;
    let tableHeader = [
      { text: 'Zones', alignment: 'center', bold: true },
      { text: 'Specifications', alignment: 'center', bold: true },
      { text: 'Duration', alignment: 'center',bold: true },
    ]
    if (isWithFuel) {
      tableHeader.push({ text: `With Fuel (${this.currency_type?.symbol})`, alignment: 'center', bold: true })
    }
    if (isWithoutFuel) {
      tableHeader.push({ text: `Without Fuel (${this.currency_type?.symbol})`, alignment: 'center', bold: true })
    }
    if (isAdditionalHours) {
      const billingUnit = this.rateCardHeaderDetails?.billing_unit;
      let extraType=''
      if(billingUnit=='hour'){
        extraType='Extra Hours'
      }
      if(billingUnit=='day'){
        extraType='Extra Days'
      }
      

      tableHeader.push({ text: `${extraType} (${this.currency_type?.symbol})`, alignment: 'center', bold: true })
    }
    let selectedRateCard = this.rateCardList.filter(ratecard => ratecard['is_checked'] === true)
    let rowsData = []
    selectedRateCard.forEach((ratecard) => {
      if (this.daily.isSelected) {
        let rowData = [
          { text: ratecard['zone']['name'], rowSpan: rowsSpan, alignment: 'center' },
          { text: ratecard['specification']['name'], rowSpan: rowsSpan, alignment: 'center' },
          this.getDurationType('day'),
        ]
        
        if (this.daily.withFuel) {
          rowData.push({ text: formatNumber(ratecard['daily']['with_fuel']) , alignment: 'center' })
        } else {
          if (isWithFuel) {
            rowData.push({ text: '-', alignment: 'center' })
          }
        }
        if (this.daily.withoutFuel) {
          rowData.push({ text: formatNumber(ratecard['daily']['without_fuel']) , alignment: 'center' })
        } else {
          if (isWithoutFuel) {
            rowData.push({ text: '-', alignment: 'center' })
          }
        }
        if (this.daily.additionalHours) {
          rowData.push({ text: formatNumber(ratecard['daily']['additional_hours']), alignment: 'center' })
        } else {
          if (isAdditionalHours) {
            rowData.push({ text: '-', alignment: 'center' })
          }
        }
        rowsData.push(rowData)
      }
      if (this.weekly.isSelected) {
        let weeklyrowSpan = rowsSpan;
        if (this.daily.isSelected) {
          weeklyrowSpan = 0;
        }
        let rowData = [
          { text: ratecard['zone']['name'], rowSpan: weeklyrowSpan, alignment: 'center' },
          { text: ratecard['specification']['name'], rowSpan: weeklyrowSpan, alignment: 'center' },
          this.getDurationType('week'),
        ]
        if (this.weekly.withFuel) {
          rowData.push({ text: formatNumber(Number(ratecard['weekly']['with_fuel']) ) , alignment: 'center' })
        } else {
          if (isWithFuel) {
            rowData.push({ text: '-', alignment: 'center' })
          }
        }
        if (this.weekly.withoutFuel) {          
          rowData.push({ text: formatNumber(Number(ratecard['weekly']['without_fuel'])) , alignment: 'center' })
        } else {
          if (isWithoutFuel) {
            rowData.push({ text: '-', alignment: 'center' })
          }
        }
        if (this.weekly.additionalHours) {
          rowData.push({ text: formatNumber(Number(ratecard['weekly']['additional_hours'])), alignment: 'center' })
        } else {
          if (isAdditionalHours) {
            rowData.push({ text: '-', alignment: 'center' })
          }
        }
        rowsData.push(rowData)
      }
      if (this.monthly.isSelected) {
        let monthlyrowSpan = rowsSpan;
        if (this.daily.isSelected || this.weekly.isSelected) {
          monthlyrowSpan = 0;
        }
        let rowData = [
          { text: ratecard['zone']['name'], rowSpan: monthlyrowSpan, alignment: 'center' },
          { text: ratecard['specification']['name'], rowSpan: monthlyrowSpan, alignment: 'center' },
          this.getDurationType('month'),
        ]
        if (this.monthly.withFuel) {
          rowData.push({ text: formatNumber(Number(ratecard['monthly']['with_fuel'])) , alignment: 'center' })
        } else {
          if (isWithFuel) {
            rowData.push({ text: '-', alignment: 'center' })
          }
        }
        if (this.monthly.withoutFuel) {
          rowData.push({ text: formatNumber(Number(ratecard['monthly']['without_fuel'])), alignment: 'center' })
        } else {
          if (isWithoutFuel) {
            rowData.push({ text: '-', alignment: 'center' })
          }
        }
        if (this.monthly.additionalHours) {
          rowData.push({ text: formatNumber(Number(ratecard['monthly']['additional_hours'])), alignment: 'center' })
        } else {
          if (isAdditionalHours) {
            rowData.push({ text: '-', alignment: 'center' })
          }
        }
        rowsData.push(rowData)
      }
    }
    )
    let rateCardWidth = new Array(tableHeader.length).fill('');
    let rateCardTable = {
      table: {
        widths: rateCardWidth.map((_, index) => `${(100 / tableHeader.length).toFixed(2)}%`),
        body: [
          tableHeader
        ]
      },
      margin : [0,0,0,0],
      layout: {
        hLineWidth: function (i, node) {
          return 0.5;
        },
        vLineWidth: function (i, node) {
          return 0.5;
        },
        hLineColor: function (i, node) {
          return 'rgba(0, 0, 0, 0.3)';
        },
        vLineColor: function (i, node) {
          return 'rgba(0, 0, 0, 0.3)';
        },
      }
    };

    rowsData.forEach((rows, index) => {
      rateCardTable.table.body.push(rows)
    })
    const content = [
      rateCardTable
    ]
    this.pdfTemplate1.contents.push(content)
  }

  companyDetails() {
    this._companyDetailsService.getCompanyDetailPrintView().subscribe((res) => {
      this.companyDetailsData = res['result'];
    })
  }

  getDurationType(type: string) {
    const durationMap: Record<string, string> = {
        day: 'Daily',
        week: 'Weekly',
        month: 'Monthly'
    };
    const durationText = durationMap[type] || type;
    return { text: durationText, alignment: 'center' };
}

buildPdf() {  
  this.pdfTemplate1.contents = []
  this.pdfTemplate1.headerDetails.companyname = this.companyDetailsData.company_name;
  this.pdfTemplate1.headerDetails.companynameNative = ''
  this.pdfTemplate1.headerDetails.crnNo = this.companyDetailsData.crn_no;
  this.pdfTemplate1.headerDetails.trnNo = this.companyDetailsData?.gstin;
  this.pdfTemplate1.headerDetails.panNo = this.companyDetailsData?.pan;
  this.pdfTemplate1.headerDetails.companyEmailId = this.companyDetailsData.email_address;
  this.pdfTemplate1.headerDetails.companyAddress = this.companyDetailsData.shipping_address[0]+''+this.companyDetailsData.shipping_address[1];
  this.pdfTemplate1.headerDetails.mobileNo = this.companyDetailsData.primary_mobile_number;
  this.pdfTemplate1.footerDetails.companyname = this.companyDetailsData.company_name;
  this.pdfTemplate1.footerDetails.companynameNative = '';
  this.pdfTemplate1.footerDetails.companyEmailId = this.companyDetailsData.email_address;
  this.pdfTemplate1.footerDetails.mobileNo = this.companyDetailsData.primary_mobile_number;
  this.pdfTemplate1.headerDetails.companyLogo = this.companyLogo;
  this.pdfTemplate1.headerDetails.pdfTitle = 'Rate Card';
  this.pdfTemplate1.footerDetails.systemGenerated = 'This is a computer-generated Rate Card receipt. No signature is required for validation'
  this.pdfTemplate1.footerDetails.poweredBy = 'Powered By Transportsimple.com';
  this.export();
  let fileName = 'Rate Card' + ".pdf";
  const pdfDocGenerator = pdfMake.createPdf(generatePdfTemplate1(cloneDeep(this.pdfTemplate1)));
  pdfDocGenerator.getBlob((blob) => {
    this._fileDownload.writeAndOpenFile(blob, fileName).then(data => {
    });
  });
}

}
