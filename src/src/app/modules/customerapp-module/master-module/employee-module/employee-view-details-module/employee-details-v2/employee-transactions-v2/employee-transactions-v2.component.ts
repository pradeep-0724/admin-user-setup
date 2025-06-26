import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AUTO_STYLE,
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { EmployeeDetailsService } from '../employee-details.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { Dialog } from '@angular/cdk/dialog';
import { EditEmployeeMoneyInOutPopupComponent } from '../edit-employee-money-in-out-popup/edit-employee-money-in-out-popup.component';
import moment from 'moment';
import { cloneDeep } from 'lodash';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { formatNumber } from 'src/app/shared-module/pipes/numberformat.pipe';
const DEFAULT_DURATION = 300;
@Component({
  selector: 'app-employee-transactions-v2',
  templateUrl: './employee-transactions-v2.component.html',
  styleUrls: ['./employee-transactions-v2.component.scss'],
  animations: [
    trigger('collapse', [
      state('true', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('false', style({ height: '0', display: 'none', overflow: 'hidden' })),
      transition('true => false', animate(DEFAULT_DURATION + 'ms ease-in')),
      transition('false => true', animate(DEFAULT_DURATION + 'ms ease-out'))
    ])
  ],
  host: {
    '(document:click)': 'outSideClick($event)'
  }
})
export class EmployeeTransactionsV2Component implements OnInit, OnDestroy {
  @Input() employeeId = '';
  @Input()empDisplayName = '';
  isExpandEmpLedger = true;
  isExpandEmpSalary = true
  employeeLedgerList = [];
  salaryIds = [];
  employeeLedgerisLoading = false;
  queryParamsEmpLedgerList = {
    start_date: '',
    end_date: '',
    filters: '',
    next_cursor: '',
    search: ''
  }
  queryParamsSalaryList = {
    start_date: '',
    end_date: '',
    filters: '',
    next_cursor: '',
    search: ''
  }
  empSalaryLoading = false
  currency_type: any;
  employeeSalaryList = []
  employeeSalaryHeaderList = [];
  popupInputData = {
    'msg': 'Are you sure, you want to delete?',
    'type': 'warning',
    'show': false
  }
  showOptions: string = '';
  deleteId = ''
  constructor(private _employeeDetails: EmployeeDetailsService, private currency: CurrencyService,
    private _fileDownload : FileDownLoadAandOpen,
    private commonloaderservice: CommonLoaderService, public dialog: Dialog) { }

  ngOnDestroy(): void {
    this.commonloaderservice.getShow();
  }

  ngOnInit(): void {
    this.commonloaderservice.getHide()
    this.currency_type = this.currency.getCurrency();
  }

  dateRangeEmployeeLedger(e) {
    this.queryParamsEmpLedgerList.next_cursor = '';
    this.queryParamsEmpLedgerList.start_date = changeDateToServerFormat(e.startDate);
    this.queryParamsEmpLedgerList.end_date = changeDateToServerFormat(e.endDate);
    this.getEmployeeLedgerList();
  }

  dateRangeEmployeeSalary(e) {
    this.queryParamsSalaryList.next_cursor = '';
    this.queryParamsSalaryList.start_date = changeDateToServerFormat(e.startDate);
    this.queryParamsSalaryList.end_date = changeDateToServerFormat(e.endDate);
    this.getSalaryList();
  }

  searchedDataEmployeeLedger(e) {
    this.queryParamsEmpLedgerList.next_cursor = '';
    this.queryParamsEmpLedgerList.search = e;
    this.getEmployeeLedgerList();
  }

  getSalaryList() {
    this._employeeDetails.getEmployeeSalaryList(this.employeeId, this.queryParamsSalaryList).subscribe((data) => {
      this.employeeSalaryList = data['result'].salary;
      this.employeeSalaryHeaderList = data['result'].header;
      this.salaryIds = data['result'].salary_ids;
      this.queryParamsSalaryList.next_cursor = data['result'].next_cursor;
    });
  }

  getEmployeeLedgerList() {
    this._employeeDetails.getEmployeeLedgerList(this.employeeId, this.queryParamsEmpLedgerList).subscribe((data) => {
      this.employeeLedgerList = data['result'].data;
      this.queryParamsEmpLedgerList.next_cursor = data['result'].next_cursor;
    });
  }

  onScrollEmployeeLedger(event) {
    const container = document.querySelector('.employee_ledger_details_scroll');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.employeeLedgerisLoading && this.queryParamsEmpLedgerList.next_cursor?.length > 0) {
      this.onScrollGetEmployeeLedgerList(this.queryParamsEmpLedgerList);
    }
  }

  onScrollGetEmployeeLedgerList(params) {
    this.employeeLedgerisLoading = true;
    this._employeeDetails.getEmployeeLedgerList(this.employeeId, params).subscribe(data => {
      this.employeeLedgerList.push(...data['result'].data);
      params.next_cursor = data['result'].next_cursor;
      this.employeeLedgerisLoading = false;
    })
  }

  onScrollEmployeeSalary(event) {
    const container = document.querySelector('.employee_salary_scroll');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.empSalaryLoading && this.queryParamsSalaryList.next_cursor?.length > 0) {
      this.onScrollGetBillingList(this.queryParamsSalaryList);
    }
  }

  onScrollGetBillingList(params) {
    this.empSalaryLoading = true;
    this._employeeDetails.getEmployeeSalaryList(this.employeeId, params).subscribe(data => {
      this.employeeSalaryList.push(...data['result'].salary);
      this.employeeSalaryHeaderList = data['result'].header
      this.salaryIds.push(...data['result'].salary_ids);
      params.next_cursor = data['result'].next_cursor;
      this.empSalaryLoading = false;
    })
  }

  expandCollapseEmployeeLedger(e) {
    this.isExpandEmpLedger = e;
  }
  expandCollapseEmployeeSalary(e) {
    this.isExpandEmpSalary = e;
  }

  searchedDataEmpLedger(e) {
    this.queryParamsEmpLedgerList.next_cursor = '';
    this.queryParamsEmpLedgerList.search = e;
    this.getEmployeeLedgerList();
  }

  searchedDataEmpSalary(e) {
    this.queryParamsSalaryList.next_cursor = '';
    this.queryParamsSalaryList.search = e;
    this.getSalaryList();
  }

  openMoneyINoUT(name, type) {
    const dialogRef = this.dialog.open(EditEmployeeMoneyInOutPopupComponent, {
      minWidth: '50%',
      data: {
        name: name,
        type: type,
        employeeId: this.employeeId
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      if (result) {
        this.queryParamsEmpLedgerList.next_cursor = '';
        this.getEmployeeLedgerList();
      }
      dialogRefSub.unsubscribe()

    });

  }

  editMoneyInOutReset(editdata) {
    let name = this.getName(editdata.type)
    let type = this.getType(editdata.type)
    const dialogRef = this.dialog.open(EditEmployeeMoneyInOutPopupComponent, {
      minWidth: '50%',
      data: {
        name: name,
        type: type,
        editData:cloneDeep(editdata),
        employeeId: this.employeeId
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      if (result) {
        this.queryParamsEmpLedgerList.next_cursor = '';
        this.getEmployeeLedgerList();
      }
      dialogRefSub.unsubscribe()

    });
  }

  getType(type) {
    if (type == 'in') return 'money_in'
    if (type == 'out') return 'money_out'
    return 'reset'

  }

  getName(type) {
    if (type == 'in') return 'Money In'
    if (type == 'out') return 'Money Out'
    return 'Reset Balance'

  }

  formatdate(date) {
    if (!date) return '-'
    return moment(date).format('DD-MM-YYYY')
  }

  outSideClick(env) {
    try {
      if ((env.target.className).indexOf('more-icon') == -1) {
        this.showOptions = ''
      }
    } catch (error) {
      console.log(error)
    }
  }

  optionsList(event, list_index) {
    return (this.showOptions = list_index);
  }


  popupFunction(id) {
    this.deleteId = id;
    this.popupInputData['show'] = true;
  }

  confirmButton(e) {
    if (e) {
      this._employeeDetails.deleteDiverLedger(this.deleteId).subscribe(resp => {
        this.queryParamsEmpLedgerList.next_cursor = '';
        this.getEmployeeLedgerList();
      })
    }
  }

  fileExportEventForJobCard(){
		this.commonloaderservice.getShow();
		let queryParams = cloneDeep(this.queryParamsEmpLedgerList)
		queryParams['is_export']=true;
    queryParams['next_cursor']='';
		this._employeeDetails.getEmployeeLedgerExport(this.employeeId,queryParams).subscribe(resp => {
			let fileName;
			let type = 'xlsx'      
			fileName = this.empDisplayName + "_Employee Ledger"  + "_" + (isValidValue(queryParams.start_date) ?  queryParams.start_date+ '_To_'+ queryParams.end_date : '') + '.' + type;
			this._fileDownload.writeAndOpenFile(resp, fileName).then(data => {        
				this.commonloaderservice.getHide();
      });
		})
  }

  fileExportEventForServices(){
		this.commonloaderservice.getShow();
		let queryParams = cloneDeep(this.queryParamsSalaryList)
		queryParams['is_export']=true;
    queryParams['next_cursor']='';
		this._employeeDetails.getEmployeeSalaryExport(this.employeeId,queryParams).subscribe(resp => {
			let fileName;
			let type = 'xlsx'      
			fileName = this.empDisplayName + "_Salary"  + "_" + (isValidValue(queryParams.start_date) ?  queryParams.start_date+ '_To_'+ queryParams.end_date : '') + '.' + type;
			this._fileDownload.writeAndOpenFile(resp, fileName).then(data => {        
				this.commonloaderservice.getHide();
      });
		})
  }

  fixedTo3DecimalPlaces(value : number){
    return formatNumber(value)
  }

}
