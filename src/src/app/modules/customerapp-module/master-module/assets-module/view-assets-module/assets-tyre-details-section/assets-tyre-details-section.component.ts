
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { Subject } from 'rxjs';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { AssetsDetailsService } from 'src/app/modules/customerapp-module/api-services/master-module-services/assets-service/assets-details.service';
import { OwnVehicleReportService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/own-vehicle-report.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';

@Component({
  selector: 'app-assets-tyre-details-section',
  templateUrl: './assets-tyre-details-section.component.html',
  styleUrls: ['./assets-tyre-details-section.component.scss']
})
export class AssetsTyreDetailsSectionComponent implements OnInit {
  @Input() assetId='';
  @Input() assetHeaderDetails:any;
   assetsDetailsForm:FormGroup
   editTyreDetails= new Subject();
   isLoading=false
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

  constructor( private _assetsDetailsService:AssetsDetailsService,private _fb:FormBuilder,private _ownVehicleReportService:OwnVehicleReportService,private _fileDownload:FileDownLoadAandOpen,private _currency:CurrencyService) { }

  ngOnInit(): void {    
    this.currency_type=this._currency.getCurrency()
    this.assetsDetailsForm=this._fb.group({
      tyre_positions: this._fb.array([]),
      tyres_info: this._fb.array([]),
      spare_tyres_info: this._fb.array([]),
    })
    this.isLoading=true;
    this._assetsDetailsService.getAssetsTyreDetails(this.assetId).subscribe(resp=>{
      this.isLoading=false;
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
      this._ownVehicleReportService.getTyreChangeHistory(this.assetId, this.queryParamsTyresHistory).subscribe(resp => {
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
        this._ownVehicleReportService.getTyreChangeHistory(this.assetId, params).subscribe(data => {
          this.TyresHistoryList.push(...data['result']?.tc);
          params.next_cursor = data['result'].next_cursor;
        })
      }
      exportTable(e){
        if(e){
          let queryParams = cloneDeep(this.queryParamsTyresHistory)
          queryParams['is_export']=true
          delete queryParams['next_cursor']
          this._ownVehicleReportService.getTyreChangeHistoryFile(this.assetId,queryParams).subscribe(resp => {
            let fileName;
            let type = 'xlsx'
            fileName = this.assetHeaderDetails?.display_no + "_Tyre_Change_History" + '.' + type;
            this._fileDownload.writeAndOpenFile(resp, fileName).then(data => {
            });
          })
  
  
        }
      }

}

