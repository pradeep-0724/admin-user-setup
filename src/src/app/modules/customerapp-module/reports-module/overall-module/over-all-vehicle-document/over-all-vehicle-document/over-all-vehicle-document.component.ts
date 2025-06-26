import { Component, OnInit } from '@angular/core';
import { OverallModuleService } from '../../../../api-services/reports-module-services/over-all-service/overall.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { Dialog } from '@angular/cdk/dialog';
import { AddVehicleDocumentPopupComponent } from '../add-vehicle-document-popup/add-vehicle-document-popup.component';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { CurrencyService } from 'src/app/core/services/currency.service';
@Component({
  selector: 'app-over-all-vehicle-document',
  templateUrl: './over-all-vehicle-document.component.html',
  styleUrls: ['./over-all-vehicle-document.component.scss'],
})
export class OverAllVehicleDocumentComponent implements OnInit {

  constructor(private overallService: OverallModuleService,public dialog: Dialog, private router: Router, private route: ActivatedRoute,
    private currency: CurrencyService
) { };
  listQueryPrams={
    start_date:null,
    end_date:null,
    search:'',
    filters:'',
    next_cursor:'',
    is_critical:false,
    label :''
  };
  defaultParams = {
    start_date: null,
    end_date: null,
    next_cursor: '',
    search: '',
    filters:'',
    is_critical:false,
    label :''
  };
  start_date='';
  end_date='';
  reports=[];
  prefixUrl=getPrefix();
  critical_count=0;
  popUpRenewDocuments = {
    show: false,
    data: {}
  };
  filterUrl='vehicle/all/document/filters/'
  scrollFlag=false;
  listUrl='/reports/overall/vehicle/document'
  currency_type:any;
  
  ngOnInit(): void {
    this.currency_type = this.currency.getCurrency();
    this.route.queryParamMap.subscribe((paramMap: ParamMap) => {      
      if (paramMap.has('search') ) {        
        this.selectedParamsTripList()
      } else {
        this.listQueryPrams = cloneDeep(this.defaultParams)
        this.reports=[];
        this.getAllVehicleDocsReport(this.listQueryPrams)

      }
    });
  }

  selectedParamsTripList() {
    this.reports=[]
    const queryParams = this.route.snapshot.queryParams;
    this.listQueryPrams = {
      start_date: changeDateToServerFormat(queryParams['start_date']),
      end_date: changeDateToServerFormat(queryParams['end_date']),
      search: queryParams['search'],
      next_cursor: '',
      is_critical:false,
      filters: queryParams['filter'],
      label: queryParams['label'],
    }
    this.getAllVehicleDocsReport(this.listQueryPrams)
  }

  getAllVehicleDocsReport(listQueryPrams){
    this.scrollFlag=true;
    this.overallService.getAllVehcleDocsReport(listQueryPrams).subscribe((data:any)=>{
      this.scrollFlag=false
      this.reports=[...this.reports,...data.result.documents];
      this.listQueryPrams.next_cursor='';
      this.listQueryPrams.next_cursor=data.result.next_cursor;
      this.critical_count=data.result.critical_count;
    })
  }

  scrollEvent() {
    const container = document.querySelector('#vehicle-document-reports');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10)&& !this.scrollFlag && this.listQueryPrams.next_cursor?.length > 0) {
        this.getAllVehicleDocsReport(this.listQueryPrams)
    }
  }
  
  listWidgetData(widgetData){
    let queryParams = new Object(
      {
        start_date: widgetData.dateRange.startDate,
        end_date: widgetData.dateRange.endDate,
        search: widgetData.searchValue,
        filter: JSON.stringify(widgetData.filterKeyData),
        label : widgetData.dateRange.selectedOpt,
      }
    );
    this.router.navigate([getPrefix() + this.listUrl], { queryParams });
  }

  openAddVehDocumentPopUp(){
    const dialogRef = this.dialog.open(AddVehicleDocumentPopupComponent, {
      minWidth: '75%',
      maxWidth:'75%',
      data: { },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result:boolean) => {
      if(result){
        this.listQueryPrams=cloneDeep(this.defaultParams)
        this.router.navigate([getPrefix() + this.listUrl]);
        this.getAllVehicleDocsReport(this.listQueryPrams)
        dialogRefSub.unsubscribe();
      }
      

    });
  }



  lastWeekReports(){
   this.listQueryPrams.is_critical=true;
    this.listQueryPrams.next_cursor='';
    this.overallService.getAllVehcleDocsReport(this.listQueryPrams).subscribe((data:any)=>{      
      this.reports=data.result.documents;
      this.listQueryPrams.next_cursor=data.result.next_cursor;
      this.critical_count=data.result.critical_count;
      
    })
    
  }


  dataFromRenewalDoc(e) {
    this.popUpRenewDocuments.data = {};
    if (e) {
      this.listQueryPrams.next_cursor='';
      this.reports=[];
      setTimeout(() => {
        this.getAllVehicleDocsReport(this.listQueryPrams)
      }, 350);
      this.popUpRenewDocuments.show = false;

    }
  }

 
  renewDocuments(event) {
    this.popUpRenewDocuments.data = event
    this.popUpRenewDocuments.data['isSubAsset'] = true
    this.popUpRenewDocuments.data['vehicle_number']=event.vehicle['reg_no']
    this.popUpRenewDocuments.show = true;
  }


  getStyle(color){
    if(color =="red")
    return {color :'red'};
    if(color=='yellow')
     return { color: 'rgb(255, 185, 0)' }

  }
}
