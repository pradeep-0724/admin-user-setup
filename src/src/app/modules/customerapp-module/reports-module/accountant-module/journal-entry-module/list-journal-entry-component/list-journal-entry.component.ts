import { JournalService } from './../services/journal.service';
import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { changeDateToServerFormat} from 'src/app/shared-module/utilities/date-utilis';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { ButtonData, ListWidgetData } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2-interface';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';



@Component({
  selector: 'app-list-journal-entry',
  templateUrl: './list-journal-entry.component.html',
  styleUrls: ['./list-journal-entry.component.scss'],
	
})
export class ListJournalEntryComponent implements OnInit,AfterViewChecked, OnDestroy {
  journalEntryData: any=[];
  routeDetail: any = new ValidationConstants().routeConstants;
  prefixUrl = getPrefix();
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;
  screenType=ScreenType;
  buttonData: ButtonData = {
    name: 'Add Journal Entry',
    permission: Permission.journalentry.toString().split(',')[0],
    url: this.prefixUrl+ '/journalentry/add'
  };
  filterUrl = 'revenue/journal_entry/filter_set/'
  listUrl = '/journalentry/list';
  listQueryParams = {
    start_date: '',
    end_date: '',
    next_cursor: '',
    search: '',
    filters: '',
    label : ''
  };
  isLoading = false;
  defaultParams = {
    start_date: null,
    end_date: null,
    next_cursor: '',
    search: '',
    filters: '',
    label : '' 
  };
  currency_type;

  detailsscreenlist =['invoice',"creditnote","debitnote","fuel","otherexpenseactivity","inventoryactivity","fleetowner",
  "tyrerotation","tyrechangenew","tyrechangeinventory","maintenancenew","maintenanceinventory", "foreman",
   "tripexpense","billofsupply","billpayment","employeesalary","paymentsettlement","paymentmadedetail","employeeotherexpenseactivity","vendoradvance","pettyexpense"]



  constructor(private _setHeight:SetHeightService,private _journalEntryService: JournalService,private route : ActivatedRoute,
    private currency:CurrencyService,private _analytics:AnalyticsService,private _fileDownload:FileDownLoadAandOpen,
    private _router: Router,private _commonloaderService : CommonLoaderService) {    
  }

  ngOnInit() {
    this._commonloaderService.getHide();
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.MANUALJOURNALENTRY,this.screenType.LIST,"Navigated");
   setTimeout(() => {
      this.currency_type = this.currency.getCurrency();
    }, 1000);
    this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
			if (paramMap.has('search')) {
				this.selectedParamsPartyList()
			} else {
				this.listQueryParams = cloneDeep(this.defaultParams)
				this.getJournalEntryData();
			}
		});
  }

  ngAfterViewChecked() {
    this._setHeight.setTableHeight2(['.calc-height'],'journal-entry-table',0);
  }

getJournalEntryData(){
  this.journalEntryData=[];
  this.listQueryParams.next_cursor = '';
  this._journalEntryService.getJournalEntryList(this.listQueryParams).subscribe((response: any) => {
    this.listQueryParams.next_cursor = response['result'].next_cursor;
    this.journalEntryData = this.assignPrefix(response.result.je);;    
});

}

assignPrefix(data) {  
  let result = data;
  result.forEach(element => {
    element.link_exists = false;
    if (element.url.id && element.url.name) {
      const formName = element.url.name;
      if (formName){
        const routeName = this.findRoute(formName);
        if (routeName){
          element.route = routeName.route;
          element.transaction_no = routeName.prefix + " " + element.transaction_no
          element.link_exists = true;
        }
      }
    }
  });
  return data
}




  findRoute(name: string) {
      for (let index in this.routeDetail) {
        if (this.routeDetail[index].name == name) {
            return this.routeDetail[index]
        }
      }
      return {}
  }

  

  ngOnDestroy():void{
    this._commonloaderService.getShow();
  }


  exportList(e){
    this.listQueryParams['export'] = true;
    this.listQueryParams['file_type'] = 'xlsx';
    this._journalEntryService.downloadJournalEntry(this.listQueryParams).subscribe((data)=>{
      let fileName = this.listQueryParams.start_date ? 'Journal Ledger'+ '(' + this.listQueryParams.start_date+'-To-'+this.listQueryParams.end_date+ ').'+'xlsx' : 'Journal Ledger.xlsx'
      this._fileDownload.writeAndOpenFile(data, fileName).then(data => {
      });
  })
  }

navigateTo(data,id){
  if(this.detailsscreenlist.includes(data.url.name)){
    let queryParms='?pdfViewId='+id
    let url = this.prefixUrl+data.route +queryParms;
    window.open(url, '_blank')
    }else{
    let subroute=  this.subName(data.url.subname);
    let url =''
    if(subroute){
       url = this.prefixUrl+data.route+id+'/'+subroute;

    }else{
      url = this.prefixUrl+data.route+id

    }
    window.open(url, '_blank')
  }
}

subName(subname){
  if(subname){
    for (let index in this.routeDetail) {
      if(this.routeDetail[index]['subname']){
        if(this.routeDetail[index]['subname'].includes(subname)){
         let indexof  = this.routeDetail[index]['subname'].indexOf(subname);
         let subRoute = this.routeDetail[index]['subroute'][indexof]
        return subRoute
        }

      }
    }
    return ''
  }
}

fixedTo3Decimal(value){
  return Number(value).toFixed(3)
 }

selectedParamsPartyList() {
  const queryParams = this.route.snapshot.queryParams;
  this.listQueryParams = {
    search: queryParams['search'],
    next_cursor: '',
    filters: queryParams['filter'],
    start_date: changeDateToServerFormat(queryParams['start_date']),
    end_date: changeDateToServerFormat(queryParams['end_date']),
    label : queryParams['label'],
    
  }
  this.getJournalEntryData();
}

listWidgetData(widgetData: ListWidgetData) {      
  let queryParams = new Object(
    {
      search: widgetData.searchValue,
      start_date: widgetData.dateRange.startDate,
      end_date: widgetData.dateRange.endDate,
      filter: JSON.stringify(widgetData.filterKeyData),
      label : widgetData.dateRange.selectedOpt,
    }
  );
  this._router.navigate([getPrefix() + this.listUrl], { queryParams });
}

onScroll() {
  
  const container = document.querySelector('#journal-entry-table');
  if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoading && this.listQueryParams.next_cursor?.length > 0) {
    this.onScrollGetTripList(this.listQueryParams);
  }
}

onScrollGetTripList(params) {
  this.isLoading = true;
  this._journalEntryService.getJournalEntryList(params).subscribe((data) => {
    this.journalEntryData.push(...this.assignPrefix(data['result'].je));
    this.listQueryParams.next_cursor = data['result'].next_cursor;
    this.isLoading = false;
  })
}

}
