import { Component, Input, OnInit } from '@angular/core';
import { MaintenanceService } from '../../operations-maintenance.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { CurrencyService } from 'src/app/core/services/currency.service';

@Component({
  selector: 'app-service-history-list',
  templateUrl: './service-history-list.component.html',
  styleUrls: ['./service-history-list.component.scss']
})
export class ServiceHistoryListComponent implements OnInit {
  @Input() isOpenHistoryData={
    data:{},
    open:false
  }
  @Input() vehicleId='';
  historyList=[];
  prefixUrl=getPrefix()
  currency_type;
  constructor(private _maintenanceService:MaintenanceService,private currency: CurrencyService,) { }

  ngOnInit(): void {
    this.currency_type = this.currency.getCurrency();
    if(this.isOpenHistoryData.data['has_history'])
    this._maintenanceService.getJobCardServiceHistory(this.isOpenHistoryData.data['id'],this.vehicleId).subscribe(resp=>{
      this.historyList =resp['result']
    })
  }
  closeHistory(){
   this.isOpenHistoryData.open=false;
  }
}
