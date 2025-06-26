import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { Component, OnInit, Inject, AfterViewChecked, OnDestroy } from '@angular/core';
import { normalDate } from '../../../../../../shared-module/utilities/date-utilis';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { EmployeeService } from '../../../../api-services/master-module-services/employee-service/employee-service';
import { PrefixUrlService, getPrefix } from 'src/app/core/services/prefixurl.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { TabIndexService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/tab-index.service';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { ButtonData, DropDownType, ListWidgetData } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2-interface';
import { cloneDeep } from 'lodash';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import moment from 'moment';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-view',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.scss'],
  host: {
    '(document:click)': 'outSideClick($event)'
  }
})
export class ViewEmployeeComponent implements OnInit, AfterViewChecked, OnDestroy {
  showOptions: string = '';
  employeePer = Permission.employee.toString().split(',')
  videoUrl = "https://ts-pub-directory.s3.ap-south-1.amazonaws.com/Employee.mp4";
  tabSelectionList: Array<DropDownType> = [
    {
      label: "Active Employee ",
      value: "1",
    },
    {
      label: "All Employee",
      value: "0",
    },
    {
      label: "Removed Employee",
      value: "2",
    },
  ];
  popupInputData = {
    'msg': 'Are you sure, you want to delete?',
    'type': 'warning',
    'show': false
  }
  buttonData: ButtonData = {
    name: 'Add Employee',
    permission: Permission.employee.toString().split(',')[0],
    url: getPrefix() + '/onboarding/employee/add'
  };
  listIndexData = {};
  apiError: String = "";
  prefixUrl = '';
  analyticsType = OperationConstants;
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  defaultParams = {
    next_cursor: '',
    search: '',
    status: '1',
    filters: '[]'
  };

  listQueryParams = {
    next_cursor: '',
    search: '',
    status: '',
    filters: '[]'
  }
  filterUrl = 'employee/filters/';
  goThroughDetais = {
    show: false,
    url: "https://demo.arcade.software/B8JsDS1QdpjjX5oUfQQg?embed%22"
  }
  isLoading = false;
  listUrl = '/onboarding/employee/view';
  settingsUrl = 'employee/setting/';
  empHeader=[];
  employeeList=[];

  constructor(private _employeeService: EmployeeService, private _fileDownload: FileDownLoadAandOpen,
    private _router: Router, public dialog: MatDialog, private _analytics: AnalyticsService, private route: ActivatedRoute,
   private _setHeight:SetHeightService , private _prefixUrl: PrefixUrlService, private _tabIndex: TabIndexService, private _commonloaderservice: CommonLoaderService,) { }

  ngOnInit() {
    this._commonloaderservice.getHide();
    this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.EMPLOYEE, this.screenType.LIST, "Navigated");
    this.prefixUrl = this._prefixUrl.getprefixUrl();
    this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('selectedTab')) {
        this.selectedParamsEmployeeList();
      } else {
        this.listQueryParams = cloneDeep(this.defaultParams)
        this.getEmployeeList(this.listQueryParams);

      }
    });
  }

  ngAfterViewChecked(): void {
    this._tabIndex.tabIndexRemove();
    this._setHeight.setTableHeight2(['.calc-height'],'employee-list',0)
  }

  ngOnDestroy(): void {
    this._commonloaderservice.getShow();
  }
  openGothrough() {
    this.goThroughDetais.show = true;
  }

  settingsApplied(event: boolean) {
    if (event) {
      this.listQueryParams.next_cursor = '';
      this.getEmployeeList(this.listQueryParams);
    }
  }

  getEmployeeList(params) {
    this.empHeader=[];
    this.employeeList=[];
    this._employeeService.getEmployeeListonScroll(params).subscribe((data) => {
      this.empHeader =data['result']['column'];

      if(data['result'].emp.length){
        this.employeeList =data['result'].emp
        params.next_cursor = data['result'].next_cursor;
      }
    });
  }

  trackById(item: any): string {
    return item.id;
  }

  onScrollGetEmpList(params) {
    this.isLoading = true;
    this._employeeService.getEmployeeListonScroll(params).subscribe(data => {
      this.employeeList.push(...data['result'].emp)
      params.next_cursor = data['result'].next_cursor;
      this.isLoading = false;
    })
  }



  scrollEvent() {
    const container = document.getElementById('employee-list');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoading && this.listQueryParams.next_cursor?.length > 0) {
      this.onScrollGetEmpList(this.listQueryParams)
    }
  }


  routeToEdit(employee_id) {
    this._router.navigate([this.prefixUrl + '/onboarding/employee/edit/' + employee_id]);
  }

  outSideClick(env) {
    if (env.target.className.indexOf('more-icon') == -1) this.showOptions = '';
  }

  optionsList(event, list_index) {
    return (this.showOptions = list_index);
  }

  dateChange(date) {
    return normalDate(date);
  }


  popupFunction(id, index: any = null) {
    this.listIndexData = { 'id': id, 'index': index };
    this.popupInputData['show'] = true;
  }

  confirmButton(event) {
    if (event) {
      this.listIndexData = {};
    }
  }

  openLastWorkingDatePopup(employee) {
    const dialogRef = this.dialog.open(LastWorkingDateDialog, {
      width: '500px',
      height: 'auto',
      data: { last_working_date: '', employee: employee },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.listQueryParams.next_cursor = '';
        this._commonloaderservice.getHide();
        this.getEmployeeList(this.listQueryParams);
      }
    })
  }

  listWidgetData(widgetData: ListWidgetData) {
    let queryParams = new Object(
      {
        selectedTab: widgetData.tabSelection,
        search: widgetData.searchValue,
        filter: JSON.stringify(widgetData.filterKeyData)
      }
    );
    this._router.navigate([getPrefix() + this.listUrl], { queryParams });
  }

  exportList(e) {
    let companyName = localStorage.getItem('companyName');
    let todaysDate = moment().format('DD-MM-YYYY')
    let fileType = this.tabSelectionList[this.listQueryParams.status].label
    let params = cloneDeep(this.listQueryParams)
    params['export'] = true;
    delete params['next_cursor']
    this._employeeService.getEmployeeListExcel(params).subscribe(resp => {
      let type = 'xlsx';
      let fileName = companyName + '_' + fileType + '_' + todaysDate + '.' + type;
      this._fileDownload.writeAndOpenFile(resp, fileName).then(data => {
      });
    })
  }

  selectedParamsEmployeeList() {
    const queryParams = this.route.snapshot.queryParams;
    this.listQueryParams = {
      search: queryParams['search'],
      status: queryParams['selectedTab'],
      next_cursor: '',
      filters: queryParams['filter']

    }
    this.getEmployeeList(this.listQueryParams);
  }



}


@Component({
  selector: 'app-add-employee-last-working-date',
  template: `<form [formGroup]="addLastWorkingDayForm">
	<div class="alert-msg" *ngIf="apiError">
    <span class="icon-wrap"></span>
    <p class="message-cont">{{ apiError }}</p>
</div>
	<h5 mat-dialog-title>Last Working Date</h5>
	<div mat-dialog-content class="mt-4">

	  <mat-form-field class="width--100">
		  <input matInput [matDatepicker]="last_working_date" (focus)="last_working_date.open()"  formControlName="last_working_date">
		  <mat-datepicker-toggle matSuffix [for]="last_working_date"></mat-datepicker-toggle>
		  <mat-datepicker #last_working_date></mat-datepicker>
	  </mat-form-field>


	</div>
	<div mat-dialog-actions class="row mt-4 justify-content-between mx-0 gap-4">
	  <button class="col-6 btn btn-primary " mat-button (click)="close()">Cancel</button>
	  <button class="col-6 btn btn-primary "mat-raised-button color="primary" (click)="save()">Save</button>
	</div>
	</form>`,
})

export class LastWorkingDateDialog implements OnInit {
  constructor(public dialogRef: MatDialogRef<LastWorkingDateDialog>, private fb: UntypedFormBuilder, private _employeeService: EmployeeService,private apiHandler: ApiHandlerService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  addLastWorkingDayForm: UntypedFormGroup;
  apiError = '';


  ngOnInit(): void {
    this.buildform();
  }
  buildform() {
    this.addLastWorkingDayForm = this.fb.group({
      last_working_date: [new Date(dateWithTimeZone())],
    })

  }
  close(): void {
    const closeValue = false;
    this.dialogRef.close(closeValue);
  }

  save() {
    let data = this.addLastWorkingDayForm.get('last_working_date').value
    if (data) {
      let employeeName = this.data.employee.extras.find(item=>item.id == 'display_name').value;
      let date = changeDateToServerFormat(data);
      let payload = { last_working_date: date }
      this.apiHandler.handleRequest(this._employeeService.postArchiveLastWorkingDate(payload, this.data.employee.id), `${ employeeName} marked inactive successfully!`).subscribe(
        {
          next: () => {
            this.dialogRef.close(true);
          },
          error: (e) => {
            this.apiError = e.error.message
          }
        })
    }
  }
}
