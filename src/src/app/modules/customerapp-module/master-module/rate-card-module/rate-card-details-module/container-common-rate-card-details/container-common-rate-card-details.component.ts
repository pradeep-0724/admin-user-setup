import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { CompanyServices } from 'src/app/modules/customerapp-module/api-services/company-service/company-services.service';
import { addFonts, addImageColumn, addressToText, reorderMixedText } from 'src/app/shared-module/utilities/pdfmake-uitls';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { CommonService } from 'src/app/core/services/common.service';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { normalDate } from 'src/app/shared-module/utilities/date-utilis';
import { generatePdfTemplate1, pdfTemplate1 } from 'src/app/shared-module/utilities/pdftemplate-utils';
import { cloneDeep } from 'lodash';
import { formatNumber } from 'src/app/shared-module/pipes/numberformat.pipe';

@Component({
  selector: 'app-container-common-rate-card-details',
  templateUrl: './container-common-rate-card-details.component.html',
  styleUrls: ['./container-common-rate-card-details.component.scss']
})
export class ContainerCommonRateCardDetailsComponent implements OnInit {

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
   pullout={
    isSelected: true,
    regular:true,
    couple:true,
    boggy:true,
    sideloader:true,
    lowbed:true

   }
   deposit={
    isSelected: true,
    regular:true,
    couple:true,
    boggy:true,
    sideloader:true,
    lowbed:true
   }
   pulloutDeposit={
    isSelected: true,
    regular:true,
    couple:true,
    boggy:true,
    sideloader:true,
    lowbed:true
   }
   liveLoading={
    isSelected: true,
    regular:true,
    couple:true,
    boggy:true,
    sideloader:true,
    lowbed:true
   }
   
   rateCardPermission = Permission.rate_card.toString().split(',');
  
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
       this.pullout={
        isSelected: data['container_handling']['pullout'],
        regular:data['container_handling']['pullout'],
        couple:data['container_handling']['pullout'],
        boggy:data['container_handling']['pullout'],
        sideloader:data['container_handling']['pullout'],
        lowbed:data['container_handling']['pullout']
    
       }
       this.deposit={
        isSelected: data['container_handling']['deposit'],
        regular:data['container_handling']['deposit'],
        couple:data['container_handling']['deposit'],
        boggy:data['container_handling']['deposit'],
        sideloader:data['container_handling']['deposit'],
        lowbed:data['container_handling']['deposit']
       }
       this.pulloutDeposit={
        isSelected:  data['container_handling']['pullout_deposit'],
        regular: data['container_handling']['pullout_deposit'],
        couple: data['container_handling']['pullout_deposit'],
        boggy: data['container_handling']['pullout_deposit'],
        sideloader: data['container_handling']['pullout_deposit'],
        lowbed: data['container_handling']['pullout_deposit']
       }
       this.liveLoading={
        isSelected: data['container_handling']['live_loading'],
        regular:data['container_handling']['live_loading'],
        couple:data['container_handling']['live_loading'],
        boggy:data['container_handling']['live_loading'],
        sideloader:data['container_handling']['live_loading'],
        lowbed:data['container_handling']['live_loading']
       }
       this.rateCardList = data.ratecardmeta;
       this.rateCardList.forEach(ratecard => {
         ratecard['is_checked'] = true;
       });
       this.parentRateCardChecked(true);
 
     })
     this.currency_type = this._currency.getCurrency();
     this.companyDetails();
     this.getCompanyLogo();
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
 
   allPullout(isChecked) {
     this.pullout.regular = isChecked;
     this.pullout.couple = isChecked;
     this.pullout.boggy = isChecked;
     this.pullout.lowbed = isChecked;
     this.pullout.sideloader = isChecked;
     this.pullout.isSelected=isChecked
   }

   allDeposit(isChecked) {
    this.deposit.regular = isChecked;
    this.deposit.couple = isChecked;
    this.deposit.boggy = isChecked;
    this.deposit.lowbed = isChecked;
    this.deposit.sideloader = isChecked;
    this.deposit.isSelected=isChecked

  }

  allPulloutAndDeposit(isChecked) {
    this.pulloutDeposit.regular = isChecked;
    this.pulloutDeposit.couple = isChecked;
    this.pulloutDeposit.boggy = isChecked;
    this.pulloutDeposit.lowbed = isChecked;
    this.pulloutDeposit.sideloader = isChecked;
    this.pulloutDeposit.isSelected=isChecked
  }

  allLiveLoading(isChecked) {
    this.liveLoading.regular = isChecked;
    this.liveLoading.couple = isChecked;
    this.liveLoading.boggy = isChecked;
    this.liveLoading.lowbed = isChecked;
    this.liveLoading.sideloader = isChecked;
    this.liveLoading.isSelected=isChecked
  }
 
  
 
  
  
   pulloutSelection(isChecked, type){
    if (type == 'regular') {
      this.pullout.regular = isChecked;
    } else if (type == 'couple') {
      this.pullout.couple = isChecked;
    } else if (type == 'boggy') {
      this.pullout.boggy = isChecked;
    }
    else if (type == 'sideloader') {
     this.pullout.sideloader = isChecked;
   }
   else if (type == 'lowbed') {
     this.pullout.lowbed = isChecked;
   }
    this.pullout.isSelected = (  this.pullout.regular  ||  this.pullout.couple || this.pullout.boggy || this.pullout.sideloader||  this.pullout.lowbed)
   }

   depositSelection(isChecked, type){
    if (type == 'regular') {
      this.deposit.regular = isChecked;
    } else if (type == 'couple') {
      this.deposit.couple = isChecked;
    } else if (type == 'boggy') {
      this.deposit.boggy = isChecked;
    }
    else if (type == 'sideloader') {
     this.deposit.sideloader = isChecked;
   }
   else if (type == 'lowbed') {
     this.deposit.lowbed = isChecked;
   }
    this.deposit.isSelected = (  this.deposit.regular  ||  this.deposit.couple || this.deposit.boggy || this.deposit.sideloader||  this.deposit.lowbed)
   }

   pulloutdepositSelection(isChecked, type){
    if (type == 'regular') {
      this.pulloutDeposit.regular = isChecked;
    } else if (type == 'couple') {
      this.pulloutDeposit.couple = isChecked;
    } else if (type == 'boggy') {
      this.pulloutDeposit.boggy = isChecked;
    }
    else if (type == 'sideloader') {
     this.pulloutDeposit.sideloader = isChecked;
   }
   else if (type == 'lowbed') {
     this.pulloutDeposit.lowbed = isChecked;
   }
    this.pulloutDeposit.isSelected = (  this.pulloutDeposit.regular  ||  this.pulloutDeposit.couple || this.pulloutDeposit.boggy || this.pulloutDeposit.sideloader||  this.pulloutDeposit.lowbed)
   }

   liveLoadingSelection(isChecked, type){
    if (type == 'regular') {
      this.liveLoading.regular = isChecked;
    } else if (type == 'couple') {
      this.liveLoading.couple = isChecked;
    } else if (type == 'boggy') {
      this.liveLoading.boggy = isChecked;
    }
    else if (type == 'sideloader') {
     this.liveLoading.sideloader = isChecked;
   }
   else if (type == 'lowbed') {
     this.liveLoading.lowbed = isChecked;
   }
    this.liveLoading.isSelected = (  this.liveLoading.regular  ||  this.liveLoading.couple || this.liveLoading.boggy || this.liveLoading.sideloader||  this.liveLoading.lowbed)
   }

 
  
   getCompanyLogo() {
     this._commonService.fetchCompanyLogo().subscribe((response: any) => {
       this.companyLogo = response.result.image_blob;
     }, (err) => {
       this.companyLogo = null;
     });
   }
 
   export() {
     const companyName = this.companyDetailsData['company_name']
     const companyAddress = addressToText(this.companyDetailsData.address.filter((ele) => ele.address_type_index == 0)[this.companyDetailsData.address.length ? this.companyDetailsData.address.length / 2 - 1 : 0], 1, -1)
     const companyMobileMail = `Mobile No: ${this.companyDetailsData['primary_mobile_number']} | Mail: ${this.companyDetailsData['email_address']}`
     const companyGstPan = this.isTDS ? 'TRN:' + `${this.companyDetailsData['gstin']}` + ' CRN: ' + `${this.companyDetailsData['crn_no']}` : 'GSTIN | PAN:' + `${this.companyDetailsData['gstin']} | ${this.companyDetailsData['pan']}`
     const companyLogo = addImageColumn(this.companyLogo)
     const companyNameNative = this.companyDetailsData['company_native_name']
 
     this.companyHeaderDetails = {
       companyLogo: companyLogo,
       companyName: companyName,
       companyAddress: companyAddress,
       companyMobileMail: companyMobileMail,
       companyGstPan: companyGstPan,
       companyNative: companyNameNative
 
 
     }
     this.footerDetails = {
       companyName: companyName,
       contactEmail: this.companyDetailsData['email_address'],
       contactNumber: this.companyDetailsData['primary_mobile_number'],
       companyNative: companyNameNative
     }
     if (!this.isTax) {
       this.companyHeaderDetails.companyGstPan = '';
     }
     let rowsSpan = 0;
     if (this.pullout.isSelected) {
       rowsSpan += 1;
     }
     if (this.deposit.isSelected) {
       rowsSpan += 1;
     }
     if (this.pulloutDeposit.isSelected) {
       rowsSpan += 1;
     }
     if (this.liveLoading.isSelected) {
      rowsSpan += 1;
    }
     let isRegular=this.pullout.regular||this.deposit.regular||this.pulloutDeposit.regular||this.liveLoading.regular
     let isCouple=this.pullout.couple||this.deposit.couple||this.pulloutDeposit.couple||this.liveLoading.couple
     let isBoggy=this.pullout.boggy||this.deposit.boggy||this.pulloutDeposit.boggy||this.liveLoading.boggy
     let issideLoader=this.pullout.sideloader||this.deposit.sideloader||this.pulloutDeposit.sideloader||this.liveLoading.sideloader
     let isLowBed=this.pullout.lowbed||this.deposit.lowbed||this.pulloutDeposit.lowbed||this.liveLoading.lowbed

     let tableHeader = [
       { text: 'Port Location', alignment: 'center', bold: true },
       { text: 'Client Location', alignment: 'center', bold: true },
       { text: 'Scope of Work', alignment: 'center',bold: true },
     ]
     if (isRegular) {
      tableHeader.push({ text: `Regular (${this.currency_type?.symbol})`, alignment: 'center', bold: true })
    }
    if (isCouple) {
      tableHeader.push({ text: `Couple (${this.currency_type?.symbol})`, alignment: 'center', bold: true })
    }
    if (isBoggy) {
      tableHeader.push({ text: `Boggy (${this.currency_type?.symbol})`, alignment: 'center', bold: true })
    }
    if (issideLoader) {
      tableHeader.push({ text: `Side Loader (${this.currency_type?.symbol})`, alignment: 'center', bold: true })
    }
    if (isLowBed) {
      tableHeader.push({ text: `Low Bed (${this.currency_type?.symbol})`, alignment: 'center', bold: true })
    } 
     let selectedRateCard = this.rateCardList.filter(ratecard => ratecard['is_checked'] === true)
     let rowsData = []
     selectedRateCard.forEach((ratecard) => {
       if (this.pullout.isSelected) {
         let rowData = [
           { text: ratecard['pullout_zone']['name'], rowSpan: rowsSpan, alignment: 'center' },
           { text: ratecard['zone']['name'], rowSpan: rowsSpan, alignment: 'center' },
           { text:'Pullout', alignment: 'center' },
         ]
         if (this.pullout.regular) {
           rowData.push({ text: formatNumber(Number(ratecard['pullout']['regular'])), alignment: 'center' })
         } else {
           if (isRegular) {
             rowData.push({ text: '-', alignment: 'center' })
           }
         }
         if (this.pullout.couple) {
          rowData.push({ text: formatNumber(Number(ratecard['pullout']['couple'])), alignment: 'center' })
        } else {
          if (isCouple) {
            rowData.push({ text: '-', alignment: 'center' })
          }
        }
        if (this.pullout.boggy) {
          rowData.push({ text: formatNumber(Number(ratecard['pullout']['boggy'])) , alignment: 'center' })
        } else {
          if (isBoggy) {
            rowData.push({ text: '-', alignment: 'center' })
          }
        }
        if (this.pullout.sideloader) {
          rowData.push({ text: formatNumber(ratecard['pullout']['sideLoader']), alignment: 'center' })
        } else {
          if (issideLoader) {
            rowData.push({ text: '-', alignment: 'center' })
          }
        }
        if (this.pullout.lowbed) {
          rowData.push({ text: formatNumber(ratecard['pullout']['lowBed']), alignment: 'center' })
        } else {
          if (isLowBed) {
            rowData.push({ text: '-', alignment: 'center' })
          }
        }
         rowsData.push(rowData)
       }
       if (this.deposit.isSelected) {
         let depositRowSpan = rowsSpan;
         if (this.pullout.isSelected) {
           depositRowSpan = 0;
         }
         let rowData = [
           { text: ratecard['pullout_zone']['name'], rowSpan: depositRowSpan, alignment: 'center' },
           { text: ratecard['zone']['name'], rowSpan: depositRowSpan, alignment: 'center' },
           { text:'Deposit', alignment: 'center' },
         ]
         if (this.deposit.regular) {
          rowData.push({ text: formatNumber(ratecard['deposit']['regular']), alignment: 'center' })
        } else {
          if (isRegular) {
            rowData.push({ text: '-', alignment: 'center' })
          }
        }
        if (this.deposit.couple) {
         rowData.push({ text: formatNumber(ratecard['deposit']['couple']), alignment: 'center' })
       } else {
         if (isCouple) {
           rowData.push({ text: '-', alignment: 'center' })
         }
       }
       if (this.deposit.boggy) {
         rowData.push({ text: formatNumber(Number(ratecard['deposit']['boggy'])), alignment: 'center' })
       } else {
         if (isBoggy) {
           rowData.push({ text: '-', alignment: 'center' })
         }
       }
       if (this.deposit.sideloader) {
         rowData.push({ text: formatNumber(Number(ratecard['deposit']['sideLoader'])), alignment: 'center' })
       } else {
         if (issideLoader) {
           rowData.push({ text: '-', alignment: 'center' })
         }
       }
       if (this.deposit.lowbed) {
         rowData.push({ text: formatNumber(Number(ratecard['deposit']['lowBed'])), alignment: 'center' })
       } else {
         if (isLowBed) {
           rowData.push({ text: '-', alignment: 'center' })
         }
       }
        
         rowsData.push(rowData)
       }
       if (this.pulloutDeposit.isSelected) {
         let pulloutAndDepositRowSpan = rowsSpan;
         if (this.pullout.isSelected || this.deposit.isSelected) {
           pulloutAndDepositRowSpan = 0;
         }
         let rowData = [
           { text: ratecard['pullout_zone']['name'], rowSpan: pulloutAndDepositRowSpan, alignment: 'center' },
           { text: ratecard['zone']['name'], rowSpan: pulloutAndDepositRowSpan, alignment: 'center' },
           { text:'Pullout and Deposit', alignment: 'center' },
         ]
         if (this.pulloutDeposit.regular) {
          rowData.push({ text: formatNumber(Number(ratecard['pullout_deposit']['regular'])), alignment: 'center' })
        } else {
          if (isRegular) {
            rowData.push({ text: '-', alignment: 'center' })
          }
        }
        if (this.pulloutDeposit.couple) {
         rowData.push({ text: formatNumber(Number(ratecard['pullout_deposit']['couple'])), alignment: 'center' })
       } else {
         if (isCouple) {
           rowData.push({ text: '-', alignment: 'center' })
         }
       }
       if (this.pulloutDeposit.boggy) {
         rowData.push({ text: formatNumber(Number(ratecard['pullout_deposit']['boggy'])), alignment: 'center' })
       } else {
         if (isBoggy) {
           rowData.push({ text: '-', alignment: 'center' })
         }
       }
       if (this.pulloutDeposit.sideloader) {
         rowData.push({ text: formatNumber(Number(ratecard['pullout_deposit']['sideLoader'])), alignment: 'center' })
       } else {
         if (issideLoader) {
           rowData.push({ text: '-', alignment: 'center' })
         }
       }
       if (this.pulloutDeposit.lowbed) {
         rowData.push({ text: formatNumber(Number(ratecard['pullout_deposit']['lowBed'])), alignment: 'center' })
       } else {
         if (isLowBed) {
           rowData.push({ text: '-', alignment: 'center' })
         }
       }
       
         rowsData.push(rowData)
       }
       if (this.liveLoading.isSelected) {
        let liveLoadingRowSpan = rowsSpan;
        if (this.pullout.isSelected || this.deposit.isSelected||this.pulloutDeposit.isSelected) {
          liveLoadingRowSpan = 0;
        }
        let rowData = [
          { text: ratecard['pullout_zone']['name'], rowSpan: liveLoadingRowSpan, alignment: 'center' },
          { text: ratecard['zone']['name'], rowSpan: liveLoadingRowSpan, alignment: 'center' },
          { text:'Live Loading', alignment: 'center' },
        ]
        if (this.liveLoading.regular) {
         rowData.push({ text: formatNumber(Number(ratecard['live_loading']['regular'])), alignment: 'center' })
       } else {
         if (isRegular) {
           rowData.push({ text: '-', alignment: 'center' })
         }
       }
       if (this.liveLoading.couple) {
        rowData.push({ text: formatNumber(Number(ratecard['live_loading']['couple'])), alignment: 'center' })
      } else {
        if (isCouple) {
          rowData.push({ text: '-', alignment: 'center' })
        }
      }
      if (this.liveLoading.boggy) {
        rowData.push({ text: formatNumber(Number(ratecard['live_loading']['boggy'])), alignment: 'center' })
      } else {
        if (isBoggy) {
          rowData.push({ text: '-', alignment: 'center' })
        }
      }
      if (this.liveLoading.sideloader) {
        rowData.push({ text: formatNumber(Number(ratecard['live_loading']['sideLoader'])), alignment: 'center' })
      } else {
        if (issideLoader) {
          rowData.push({ text: '-', alignment: 'center' })
        }
      }
      if (this.liveLoading.lowbed) {
        rowData.push({ text: formatNumber(Number(ratecard['live_loading']['lowBed'])), alignment: 'center' })
      } else {
        if (isLowBed) {
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
       },
       margin: [0, 0, 0, 0]

     };
 
     rowsData.forEach((rows, index) => {
       rateCardTable.table.body.push(rows)
     })
     this.pdfTemplate1.contents.push(rateCardTable)
   
   }
 
   companyDetails() {
     this._companyDetailsService.getCompanyDetailPrintView().subscribe((res) => {
       this.companyDetailsData = res['result'];
     })
   }

   buildPdf() {  
    this.pdfTemplate1.contents = []
    this.pdfTemplate1.headerDetails.companyname = this.companyDetailsData.company_name;
    this.pdfTemplate1.headerDetails.companynameNative = reorderMixedText(this.companyDetailsData.company_native_name);
    this.pdfTemplate1.headerDetails.crnNo = this.companyDetailsData.crn_no;
    this.pdfTemplate1.headerDetails.trnNo = this.companyDetailsData?.gstin;
    this.pdfTemplate1.headerDetails.panNo = this.companyDetailsData?.pan;
    this.pdfTemplate1.headerDetails.companyEmailId = this.companyDetailsData.email_address;
    this.pdfTemplate1.headerDetails.companyAddress = this.companyDetailsData.shipping_address[0]+''+this.companyDetailsData.shipping_address[1];
    this.pdfTemplate1.headerDetails.mobileNo = this.companyDetailsData.primary_mobile_number;
    this.pdfTemplate1.footerDetails.companyname = this.companyDetailsData.company_name;
    this.pdfTemplate1.footerDetails.companynameNative = reorderMixedText(this.companyDetailsData.company_native_name);
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