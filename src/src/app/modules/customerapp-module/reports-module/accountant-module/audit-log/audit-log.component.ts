import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { AccountantService } from '../../../api-services/reports-module-services/accountant-services/accountant.service';
import { ScreenType, OperationConstants, ScreenConstants } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { ListWidgetData } from '../../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2-interface';

@Component({
  selector: 'app-audit-log',
  templateUrl: './audit-log.component.html',
  styleUrls: ['./audit-log.component.scss']
})
export class AuditLogComponent implements OnInit, AfterViewChecked {

  auditLogData: any;
  filterUrl = 'company/audit-log/filters/'
  screenType = ScreenType;
  analyticsType = OperationConstants;
  analyticsScreen = ScreenConstants;
  prefixUrl = getPrefix();
  listQueryParams = {
    next_cursor: '',
    filters: '[]'
  }
  isLoading: boolean = false
  constructor(
    private _accountantService: AccountantService, private _analytics: AnalyticsService, private _fileDownload: FileDownLoadAandOpen, private _setHeight: SetHeightService
  ) { }

  ngOnInit() {
    this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.AUDITLOG, this.screenType.VIEW, "Navigated");
    this.getAuditLog();

  }
  ngAfterViewChecked(): void {
    this._setHeight.setTableHeight2(['.calc-height'], 'audit-log', 0)
  }

  getAuditLog() {
    this._accountantService.getAuditLog(this.listQueryParams).subscribe((response: any) => {
      this.auditLogData = response.result['audits'];
      this.listQueryParams.next_cursor = response['result']['next_cursor']
    });
  }

  onScroll(event) {
    const container = document.querySelector('#audit-log');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoading && this.listQueryParams.next_cursor?.length > 0) {
      this.onScrollAuditLogList(this.listQueryParams);
    }
  }
  onScrollAuditLogList(params) {
    this.isLoading = true;
    this._accountantService.getAuditLog(params).subscribe(data => {
      this.auditLogData.push(...data['result']['audits']);
      params.next_cursor = data['result']['next_cursor'];
      this.isLoading = false;
    })
  }

  downloadAuditLog() {
    let type = 'xlsx';
    let fileName = 'auditLog_' + '.' + type;
    this._accountantService.downloadAuditLog('', '', type).subscribe(resp => {
      this._fileDownload.writeAndOpenFile(resp, fileName).then(data => {
      });
    })


  }

  listWidgetData(widgetData: ListWidgetData) {
    this.listQueryParams.next_cursor = ''
    this.listQueryParams.filters = JSON.stringify(widgetData.filterKeyData)
    this.getAuditLog()
  }
  exportList(e) {
    if (e) {
      this.downloadAuditLog()
    }
  }

  getActivityDetails(data): {
    url: String
    screenValue: String
    screenName: string
    operation: string
  } {
    const key = data.screen
    let details = {
      url: '',
      screenValue: '',
      screenName: '',
      operation: ''
    }
    switch (key) {
      case 'zone':
        details.screenName = 'Zone'
        details.screenValue = data.name
        details.operation = data.operation
        details.url = this.prefixUrl + '/onboarding/zone/list'
        break;

      case 'market_vehicle':
        details.screenName = 'Market Vehicle'
        details.screenValue = data.name
        details.operation = data.operation
        details.url = this.prefixUrl + '/onboarding/vehicle/market/details/' + data?.id
        break;

      case 'own_vehicle':
        details.screenName = 'Own Vehicle'
        details.screenValue = data.name
        details.operation = data.operation
        details.url = this.prefixUrl + '/onboarding/vehicle/own/details/' + data?.id
        break;
      case 'own_asset':
        details.screenName = 'Own Assets'
        details.screenValue = data.name
        details.operation = data.operation
        details.url = this.prefixUrl + '/onboarding/assets/view/' + data?.id
        break;
      case 'container':
        details.screenName = 'Container'
        details.screenValue = data.name
        details.operation = data.operation
        details.url = this.prefixUrl + '/onboarding/container/list'
        break;
      case 'bank':
        details.screenName = 'Bank'
        details.screenValue = data.name
        details.operation = data.operation
        details.url = this.prefixUrl + '/onboarding/bank/list'
        break;
      case "employee":
        details.screenName = 'Employee'
        details.screenValue = data.name
        details.operation = data.operation
        details.url = this.prefixUrl + '/onboarding/employee/view/' + data?.id
        break;
      case "customer":
        details.screenName = 'Customer'
        details.screenValue = data.name
        details.operation = data.operation
        details.url = this.prefixUrl + '/onboarding/party/details/client/' + data?.id
        break;
      case "account":
        details.screenName = 'Opening Balance'
        details.screenValue = data.name
        details.operation = data.operation
        details.url = this.prefixUrl + '/onboarding/chart-of-account/transaction/' + data?.id
        break;
      case "vendor":
        details.screenName = 'Vendor'
        details.screenValue = data.name
        details.operation = data.operation
        details.url = this.prefixUrl + '/onboarding/party/details/vendor/' + data?.id
        break;
      case "tyre_master":
        details.screenName = 'Tyre Master'
        details.screenValue = data.name
        details.operation = data.operation
        details.url = this.prefixUrl + '/onboarding/vehicle/tyremaster/view'
        break;

      case 'invoice':
        details.screenName = 'Invoice'
        details.screenValue = data.name
        details.operation = data.operation
        details.url = this.prefixUrl + '/income/invoice/view/' + data?.id
        break;
      case 'trip':
        details.screenName = 'Job'
        details.screenValue = data.name
        details.operation = data.operation
        details.url = this.prefixUrl + '/trip/new-trip/details/' + data?.id
        break;
      case "work_order":
        details.screenName = 'Sales Order'
        details.screenValue = data.name
        details.operation = data.operation
        details.url = this.prefixUrl + '/trip/work-order/details/' + data?.id
        break;
      case "quotation":
        details.screenName = 'Quotation'
        details.screenValue = data.name
        details.operation = data.operation
        details.url = this.prefixUrl + '/trip/quotation/details/' + data?.id
        break;
      case "site_inspection":
        details.screenName = 'Site Inspection'
        details.screenValue = data.name
        details.operation = data.operation
        details.url = this.prefixUrl + '/trip/site-inspection/view/' + data?.id
        break;
      case "lpo":
        details.screenName = 'Local Purchase Order'
        details.screenValue = data.name
        details.operation = data.operation
        details.url = this.prefixUrl + '/trip/local-purchase-order/view/' + data?.id
        break;
      case "vehicle_inspection":
        details.screenName = 'Vehicle Inspection'
        details.screenValue = data.name
        details.operation = data.operation
        details.url = this.prefixUrl + '/vehicle-inspection/view/' + data?.id
        break;

      default:
        break;
    }

    return details

  }
}




