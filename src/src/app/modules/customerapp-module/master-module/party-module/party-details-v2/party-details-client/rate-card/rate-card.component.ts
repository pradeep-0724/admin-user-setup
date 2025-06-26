import { AUTO_STYLE, animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { addImageColumn, addressToText, pdfGenerate } from 'src/app/shared-module/utilities/pdfmake-uitls';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { RateCardService } from '../../../../../api-services/master-module-services/rate-card-service/rate-card.service';
import { checkEmpty, isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { RateCardBillingBasedOn } from 'src/app/core/constants/constant';
const DEFAULT_DURATION = 300;
@Component({
  selector: 'app-rate-card',
  templateUrl: './rate-card.component.html',
  styleUrls: ['./rate-card.component.scss'],
  animations: [
    trigger('collapse', [
      state('true', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('false', style({ height: '0', display: 'none', overflow: 'hidden' })),
      transition('true => false', animate(DEFAULT_DURATION + 'ms ease-in')),
      transition('false => true', animate(DEFAULT_DURATION + 'ms ease-out'))
    ])
  ],
  host: {
    '(document:click)': 'outSideClick($event)',
  }
})
export class RateCardComponent implements OnInit { 
  preFixUrl = getPrefix();
  @Input() partyId = ''
  company_logo = ''
  isTax: boolean = false;
  filterUrl = 'party/ratecard/filters/'
  listQueryPrams = {
    next_cursor: '',
  };
  listQueryPramsCharges = {
    next_cursor: '',
  }
  rentalRateCardDetails = [];
  AdditionalRateCardDetails = [];
  showOptions = '';
  popupInputData = {
    'msg': 'Are you sure, you want to delete?',
    'type': 'warning',
    'show': false
  };
  listIndexId = '';
  rateCardDetails=[];
  isTDS = false;
  currency_type;
  isExpandCollapse = [];
  isExpandCollapseForCustomerRateCard=[];
  selectedTab = 1;
  isExpandCollapseForAdditionlCharges = [];
  isLoadingCharges :boolean = false;
	isLoading = false
  partyPermission= Permission.party.toString().split(',')
  rateCardBilling=new RateCardBillingBasedOn();
  rateCardBillingList=this.rateCardBilling.RateCardbillingUnitsList
  rateCardBillingHour=this.rateCardBilling.hour
 
  rateCardHeaderDetails=[];
  rateCardList = [];
  doesCompanyRateCardExisted : boolean =true;

  constructor(private _commonService: CommonService, private _tax: TaxService, private _fileDownload: FileDownLoadAandOpen,
    private route: Router, private _rateCard: RateCardService, private currency: CurrencyService,private activatedRoute : ActivatedRoute) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }
  companyHeaderDetails: any;
  footerDetails: any;


  ngOnInit(): void {
    this.isTax = this._tax.getTax();
    this.isTDS = this._tax.getVat();
    this.currency_type = this.currency.getCurrency();
    this.getRateCardList()
    this.customerContainerRateCardExists()
    this._commonService.fetchCompanyLogo().subscribe((response: any) => {
      this.company_logo = response.result.image_blob;
    }, (err) => {
      this.company_logo = null;
    });
    this.activatedRoute.queryParamMap.subscribe((paramMap: ParamMap) => {      
      if (paramMap.has('chargesTab')) {
       this.selectedTab = Number(paramMap.get('chargesTab'));
       this.tabChanged(this.selectedTab)
      }
    });
  }

  optionsList(event, list_index) {
    return this.showOptions = list_index;
  }

  outSideClick(env) {
    if ((env.target.className).indexOf('more-icon') == -1)
      this.showOptions = ''
  }

   changeDate(date){
    if(!date) return '-'
    return moment(date).format('DD-MM-YYYY')
   }

  getCustomerrateCard(){
    this._rateCard.getCustomerRateCardDetails(this.partyId).subscribe(resp => {
      this.rateCardList = [];
      this.isExpandCollapseForCustomerRateCard = [];
      this.rateCardHeaderDetails = [];
      if (isValidValue(resp['result'])) {
        this.rateCardHeaderDetails = [resp['result']];
        this.rateCardList = resp['result']['ratecardmeta'];
        this.isExpandCollapseForCustomerRateCard = cloneDeep([resp['result']])
        this.isExpandCollapseForCustomerRateCard.fill(false);
        for (let index = 0; index < this.isExpandCollapseForCustomerRateCard.length; index++) {
          if (index <= 0) {
            this.isExpandCollapseForCustomerRateCard[index] = true
          }
        }
        this.doesCompanyRateCardExisted = true;
      } else {
        this.doesCompanyRateCardExisted = false;
      }
    }, (err) => {
      this.doesCompanyRateCardExisted = false;
    })
  }

  customerContainerRateCardExists(){
    this._rateCard.getCustomerRateCardDetails(this.partyId).subscribe(resp => {
      if (isValidValue(resp['result'])) {
        this.doesCompanyRateCardExisted = true;
      } else {
        this.doesCompanyRateCardExisted = false;
      }
    }, (err) => {
      this.doesCompanyRateCardExisted = false;
    })
  }


  generatePdf(data) {
    const headTitle = { text: `Rate Card`, alignment: 'center', fontSize: 10 ,bold:true};
    const companyName = data['company']['company_name']
    const companyAddress = addressToText(data.company.address.filter((ele) => ele.address_type_index == 0)[data.company.address.length ? data.company.address.length / 2 - 1 : 0], 1, -1)
    const companyMobileMail = `Mobile No: ${data['company']['primary_mobile_number']} | Mail: ${data['company']['email_address']}`
    const companyGstPan = this.isTDS ? 'TRN:' + `${data['company']['gstin']}` : 'GSTIN | PAN:' + `${data['company']['gstin']} | ${data['company']['pan']}`
    const companyLogo = addImageColumn(this.company_logo)
    this.companyHeaderDetails = {
      companyLogo: companyLogo,
      companyName: data.company.company_display_name,
      companyAddress: companyAddress,
      companyMobileMail: companyMobileMail,
      companyGstPan: companyGstPan

    }
    if (!this.isTax) {
      this.companyHeaderDetails.companyGstPan = '';
    }

    this.footerDetails = {
      companyName: companyName,
      contactEmail: data['company']['email_address'],
      contactNumber: data['company']['primary_mobile_number']

    }
    let clientDetails = {
      margin: [0, 10, 0, 10],
      table: {
        widths: ["*", "*", "*"],
        headerRows: 1,
        keepWithHeaderRows: 1,
        body: [
          [
            { text: 'Customer name: ' + data.party, fontSize: 9 ,margin:[0,3,0,3]},
            { text: 'Rate Card date: ' + moment(data.date).format('DD-MM-YYYY') , fontSize: 9 ,margin:[0,3,0,3]},
            { text: 'Terrain: ' + data.terrain.value, fontSize: 9 ,margin:[0,3,0,3]},
          ]
        ]
      },
      layout: {
        hLineColor: function (i, node) {
          return (i === 0 || i === node.table.body.length) ? '#000000' : '#000000';
        },
        vLineWidth: function (i, node) {
          return (i === 0 || i === node.table.widths.length) ? 1 : 0;
        },
      }
    };

    let cardDetails = {
      margin: [0, 0, 0, 0],
      table: {
        widths: ["16.66%", "16.66%", "16.66%", "16.66%", "16.66%", "16.66%"],
        headerRows: 1,
        keepWithHeaderRows: 1,
        body: [
          [
            { text: 'Specification', fontSize: 9, bold: true,margin:[0,3,0,3] },
            { text: 'Vehicle Make', fontSize: 9, bold: true , margin:[0,3,0,3]},
            { text: 'Vehicle Model', fontSize: 9, bold: true,margin:[0,3,0,3] },
            { text: 'Daily Rate' + '(' + this.currency_type.symbol + ')', fontSize: 9, bold: true,margin:[0,3,0,3] },
            { text: 'Weekly Rate' + '(' + this.currency_type.symbol + ')', fontSize: 9, bold: true,margin:[0,3,0,3] },
            { text: 'Monthly Rate' + '(' + this.currency_type.symbol + ')', fontSize: 9, bold: true,margin:[0,3,0,3] },
          ],
        ]
      },
      layout: {
        hLineColor: function (i, node) {
          return (i === 0 || i === node.table.body.length) ? '#000000' : '#000000';
        },
        vLineWidth: function (i, node) {
          return (i === 0 || i === node.table.widths.length) ? 1 : 0;
        },
      }
    };


    data.ratecardmeta.forEach(ele => {

      cardDetails.table.body.push(
        [
          { text: checkEmpty(ele, ['specification', 'name'], false), fontSize: 9, bold: false,margin:[0,3,0,3] },
          { text: checkEmpty(ele, ['make', 'name'], false), fontSize: 9, bold: false,margin:[0,3,0,3] },
          { text: checkEmpty(ele, ['model', 'name'], false), fontSize: 9, bold: false ,margin:[0,3,0,3]},
          { text: checkEmpty(ele, ['daily_rate'], true), fontSize: 9, bold: false ,margin:[0,3,0,3]},
          { text: checkEmpty(ele, ['weeky_rate'], true), fontSize: 9, bold: false,margin:[0,3,0,3] },
          { text: checkEmpty(ele, ['monthly_rate'], true), fontSize: 9, bold: false,margin:[0,3,0,3] },
        ]
      )
    });



    var dd = pdfGenerate([headTitle, clientDetails, cardDetails], this.companyHeaderDetails, this.footerDetails)

    setTimeout(() => {
      let fileName = data.party + "_" + moment(data.date).format('DD-MM-YYYY')+ "_" + data.terrain.value + ".pdf";
      const pdfDocGenerator = pdfMake.createPdf(dd);
      pdfDocGenerator.getBlob((blob) => {
        this._fileDownload.writeAndOpenFile(blob, fileName).then(data => {
        });
      });
    }, 500);
  }

  addRateCard(routeText) {
    let queryParams = {
      partyId: this.partyId
    };
    this.route.navigate([getPrefix() + '/onboarding/party/rate-card/'+routeText+'/'], { queryParams });
  }

  editRateCard(route,id) {
    let queryParams = {
      partyId: this.partyId,
      rateCardId: id
    };
    if(this.selectedTab==1 || this.selectedTab==0){
      this.route.navigate([getPrefix() + '/onboarding/party/rate-card/'+route, id], { queryParams });
    }else{
      this.route.navigate([getPrefix() + '/onboarding/party/rate-card/customer-rate-card/', id], { queryParams });
    }
  }


  getRateCardList() {
    this.listQueryPrams.next_cursor = '';
    this._rateCard.getRentalRateCardList(this.partyId).subscribe(resp => {      
      this.listQueryPrams.next_cursor = resp['result'].next_cursor
      this.rentalRateCardDetails = resp['result'].ratecards
      this.isExpandCollapse = cloneDeep(resp['result'].ratecards)
      this.isExpandCollapse.fill(false);
      for (let index = 0; index <  this.isExpandCollapse.length; index++) {
         if(index<=0){
          this.isExpandCollapse[index]=true
         }
      }
    })
  }

  deleteRateCard(id) {
    this.listIndexId = id
    this.popupInputData['show'] = true;
  }

  confirmButton(event) {
    if (event)
      this.deleteRate();
    this.popupInputData['show'] = false;
  }

  deleteRate() {
    let apiText =''
    if(this.selectedTab==1 || this.selectedTab==3){
      apiText = 'ratecard'
    }else{
      apiText = 'additionalcharges'
    }
    this._rateCard.deleteRateCard(apiText,this.listIndexId).subscribe(resp => {
      this.listIndexId = ''
      this.listQueryPrams.next_cursor = '';
      if(this.selectedTab==1){
        this.getRateCardList()
      }else if(this.selectedTab==3){
        this.getCustomerrateCard();
        this.customerContainerRateCardExists();
      }
      else{
        this.getAdditionalChargesRateCardList()
      }
    })
  }

  fileExportEvent(e, id) {
    // let listQueryPrams = {
    //   ratecard_id: id,
    //   add_company_details: true,
    // }
    // this._rateCard.getRentalRateCardList(this.partyId).subscribe(resp => {
    //   this.rateCardDetails = resp['result'];
    //   this.generatePdf(this.rateCardDetails)
    // })
  }

  expandCollapseInvoiceTable(e, i) {
    this.isExpandCollapse[i] = e
  }

  expandCollapseCustomerRateCardTable(e,i){
    this.isExpandCollapseForCustomerRateCard[i] = e
  }

  tabChanged(tab){
    this.selectedTab = tab;
    if(tab==1){
      this.isExpandCollapse = [];
      this.rentalRateCardDetails = []
      this.getRateCardList();
    }else if(tab==3){
      this.isExpandCollapseForCustomerRateCard = [];
      this.rateCardDetails = [];
      this.rateCardHeaderDetails =[]
      this.getCustomerrateCard();
    }
    else{
      this.isExpandCollapseForAdditionlCharges = [];
      this.AdditionalRateCardDetails = [];
      this.getAdditionalChargesRateCardList()
    }
  }

  onScroll() {
		const container = document.querySelector('#rental-rate-card-table');
		if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoading && this.listQueryPrams.next_cursor?.length > 0) {
			this.getScrollRateCardList();
		}
	}
  getScrollRateCardList() {
    this.isLoading = true;
    this._rateCard.getRentalRateCardList(this.partyId).subscribe(resp => {      
      this.listQueryPrams.next_cursor = resp['result'].next_cursor
      this.rentalRateCardDetails.push(...resp['result'].ratecards);
      this.isLoading = false ;

    })
  }
  // ///for additional charges;;
  expandCollapseInvoiceTableCharges(e, i) {    
    this.isExpandCollapseForAdditionlCharges[i] = e
  }

  getAdditionalChargesRateCardList() {
    this.listQueryPramsCharges.next_cursor = '';
    this._rateCard.getAdditionalChargesRateCardList(this.partyId).subscribe(resp => {      
      this.AdditionalRateCardDetails = resp['result'].additional_charges;
      this.listQueryPramsCharges.next_cursor = resp['result'].next_cursor
      this.isExpandCollapseForAdditionlCharges = cloneDeep(resp['result'].additional_charges)
      this.isExpandCollapseForAdditionlCharges.fill(false);
      for (let index = 0; index <  this.isExpandCollapseForAdditionlCharges.length; index++) {
        if(index<=0){
         this.isExpandCollapseForAdditionlCharges[index]=true
        }
      }
     
   })
  }

  scrollCharges() {
		const container = document.querySelector('#additional-rate-card-table');
		if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoadingCharges && this.listQueryPramsCharges.next_cursor?.length > 0) {
			this.getScrollChargesList();
		}
	}
  getScrollChargesList() {
    this.isLoading = true;
    this._rateCard.getAdditionalChargesRateCardList(this.partyId).subscribe(resp => {      
      this.listQueryPrams.next_cursor = resp['result'].next_cursor
      this.AdditionalRateCardDetails.push(...resp['result'].additional_charges);
      this.isLoadingCharges = false ;

    })
  }

  assignVehiclecategory(types){        
    let cartegories:Record<number,string> = {
      0:'Loose Cargo',
      1:'Crane',
      2:'Awp',
      4:'Container'
  };
  let vechCategories=[]
    types.forEach((item, index) => {
      vechCategories.push(cartegories[item])
    });
    return vechCategories.length==0?'':vechCategories.join(', ')
  }

  getBillingLabel(billingUnit){
    if(!billingUnit) return '-'
    return this.rateCardBillingList.find(billType=>billType.value==billingUnit).label
  }

  getDurationLabel(billingUnit){
    if(!billingUnit) return {
      daily:`DAILY (${this.currency_type?.symbol})`,
      weekly:`WEEKLY (${this.currency_type?.symbol})`,
      monthly:`MONTHLY (${this.currency_type?.symbol})`,
    }
    if(billingUnit=='hour'){
      return{
        daily:`DAILY (${this.currency_type?.symbol}) (${this.rateCardBillingHour.day} Hours)`,
        weekly:`WEEKLY (${this.currency_type?.symbol}) (${this.rateCardBillingHour.week} Hours)`,
        monthly:`MONTHLY (${this.currency_type?.symbol}) (${this.rateCardBillingHour.month} Hours)`,
      }
    }else{
      return{
        daily:`DAILY (${this.currency_type?.symbol})`,
        weekly:`WEEKLY (${this.currency_type?.symbol})`,
        monthly:`MONTHLY (${this.currency_type?.symbol})`,
      }
    }

  }
}
