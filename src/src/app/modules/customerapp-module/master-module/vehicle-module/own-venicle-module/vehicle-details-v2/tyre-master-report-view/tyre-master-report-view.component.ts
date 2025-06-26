import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { Subject } from 'rxjs';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { OwnVehicleReportService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/own-vehicle-report.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';

@Component({
  selector: 'app-tyre-master-report-view',
  templateUrl: './tyre-master-report-view.component.html',
  styleUrls: ['./tyre-master-report-view.component.scss']
})
export class TyreMasterReportViewComponent implements OnInit {
  @Input() vehicleId='';
  @Input() vehicleHeaderDetails:any;
   vehicleDetailsForm:FormGroup
   editTyreDetails= new Subject();
   isLoading=false;
   queryParamsTyresHistory = {
    start_date: '',
    end_date: '',
    filters: '',
    next_cursor: '',
    search: ''
  }
  TyresHistoryList = [];
  currency_type;
  prefixUrl=getPrefix()

  constructor(private _commonloaderservice:CommonLoaderService,private _ownVehicleReportService:OwnVehicleReportService,private _fb:FormBuilder,private _currency:CurrencyService,private _fileDownload:FileDownLoadAandOpen) { }

  ngOnInit(): void {
    this.currency_type=this._currency.getCurrency()
    
    this.vehicleDetailsForm=this._fb.group({
      tyre_positions: this._fb.array([]),
      tyres_info: this._fb.array([]),
      spare_tyres_info: this._fb.array([]),
    })
    this.isLoading=true
    this._ownVehicleReportService.getVehicleTyreDetails(this.vehicleId).subscribe(resp=>{
      this.isLoading=false
      this.editTyreDetails.next(resp['result'])
    })
  }
  filterDataTyresHistory(e) {
    this.queryParamsTyresHistory.filters = JSON.stringify(e);
    this.queryParamsTyresHistory.next_cursor = '';
    this.getTyresHistory();
  }
  searchedDataTyresHistory(e) {
    this.queryParamsTyresHistory.search = e;
    this.queryParamsTyresHistory.next_cursor = '';
    this.getTyresHistory();
  }
  getTyresHistory() {
    this._ownVehicleReportService.getTyreChangeHistory(this.vehicleId, this.queryParamsTyresHistory).subscribe(resp => {
      this.TyresHistoryList = resp['result']?.tc;
      this.queryParamsTyresHistory.next_cursor = resp['result'].next_cursor
    });
  }
   dateRangeTyresHistory(e) {
      this.queryParamsTyresHistory.next_cursor = ''
      this.queryParamsTyresHistory.start_date = changeDateToServerFormat(e.startDate);
      this.queryParamsTyresHistory.end_date = changeDateToServerFormat(e.endDate);
      this.getTyresHistory();
    }
    onScroll(event) {
      const container = document.querySelector('.tyres-table');
      if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoading && this.queryParamsTyresHistory.next_cursor?.length > 0) {
        this.onScrollTyresTable(this.queryParamsTyresHistory);
      }
    }
    onScrollTyresTable(params) {
      this._ownVehicleReportService.getTyreChangeHistory(this.vehicleId, params).subscribe(data => {
        this.TyresHistoryList.push(...data['result']?.tc);
        params.next_cursor = data['result'].next_cursor;
      })
    }
    exportTable(e){
      if(e){
        this._commonloaderservice.getShow();
        let queryParams = cloneDeep(this.queryParamsTyresHistory)
        queryParams['is_export']=true
        delete queryParams['next_cursor']
        this._ownVehicleReportService.getTyreChangeHistoryFile(this.vehicleId,queryParams).subscribe(resp => {
          let fileName;
          let type = 'xlsx'
          fileName = this.vehicleHeaderDetails?.reg_number + "_Tyre_Change_History" + '.' + type;
          this._fileDownload.writeAndOpenFile(resp, fileName).then(data => {
            this._commonloaderservice.getHide();
          });
        })


      }
    }

}
