import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DriverAccessService } from '../../../customerapp-module/api-services/orgainzation-setting-module-services/driver-app-access-service/driver-access.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { cloneDeep } from 'lodash';
import { ListWidgetData } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2-interface';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { getBlankOption } from 'src/app/shared-module/utilities/helper-utils';
import { setAsTouched } from 'src/app/shared-module/utilities/form-utils';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-driver-app-access-management',
  templateUrl: './driver-app-access-management.component.html',
  styleUrls: ['./driver-app-access-management.component.scss']
})
export class DriverAppAccessManagementComponent implements OnInit,AfterViewChecked {

  driverAccessForm: FormGroup;
  employeeSelectedOption = getBlankOption();
  employeeList = [];
  isAddDriverOpen = false;
  popupInputData = {
    'msg': '',
    'type': 'warning',
    'show': false
  }
  employeeDetail = {
    contact_number: '',
    country_code: '',
    designation: '',
    display_name: '',
    id: '',
    toggle_status: true
  };
  driverAppUsersList = [];
  listQueryParams = {
    next_cursor: '',
    search: '',
    filters: '',
  };
  isLoading = false;
  defaultParams = {
    next_cursor: '',
    search: '',
    filters: '',
  };
  filterUrl = 'company/driver-app/user-filters/'
  listUrl = '/organization_setting/driver_app_access_management';
  apiError = '';
  constructor(private _fb: FormBuilder, private _driverAccessService: DriverAccessService, private router: Router, private route: ActivatedRoute,
    private _setHeight : SetHeightService,
    private apiHandler: ApiHandlerService) { }

  ngOnInit(): void {
    this.driverAccessForm = this._fb.group({
      emp_id: [null,[Validators.required]],
      designation: null,
      number: null
    });
    this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('search')) {
        this.selectedParamsDriversListList()
      } else {
        this.listQueryParams = cloneDeep(this.defaultParams)
        this.getDriverAppUserList(this.listQueryParams);
      }
    });
    this.getDriverList();
  }

  ngAfterViewChecked(): void {
    this._setHeight.setTableHeight2(['.calc-height'],'driver-list',0)
  }


  onClickCancel() {
    this.employeeSelectedOption = getBlankOption();
    this.isAddDriverOpen = false;
  }

  onRefreshAuthKey(data) {
    this.apiHandler.handleRequest(this._driverAccessService.createAuthKey({
      "mobile_no": data.contact_number, "country_code": data.country_code
      , is_webapp: true
    }), 'Auth Key generated successfully!').subscribe(
      {
        next: (resp) => {
          this.driverAppUsersList.forEach((driver) => {
            if (driver.id === data.id) {
              driver['otp'] = resp['result']['otp']

            }
          })
        },
        error: () => {
        }
      }
    )
  }


  saveDriverAssign() {
    let form = this.driverAccessForm
    if (form.valid) {
      form.get('designation').disable();
      form.get('number').disable();
      this.apiHandler.handleRequest(this._driverAccessService.createDriverAppUser(form.value), 'Driver added successfully!').subscribe(
        {
          next: () => {
            this.isAddDriverOpen = false;
            this.getDriverAppUserList(this.listQueryParams);
          },
          error: () => {
            this.apiError = 'Failed to add driver!';
            setTimeout(() => (this.apiError = ''), 3000);
            form.get('designation').enable();
            form.get('number').enable();
          }
        })
    }else{
      setAsTouched(form)
    }

  }

  getDriverList() {
    this._driverAccessService.getDriverList().subscribe(resp => {
      this.employeeList = resp.result;
    });
  }

  onEmployeeSelected() {
    let form = this.driverAccessForm
    let employeeDetails = this.employeeList.filter(item => item.id == form.get('emp_id').value)[0];
    form.get('designation').setValue(employeeDetails.designation_label);
    form.get('number').setValue(employeeDetails.contact_country_code + " " + employeeDetails.contact);
  }

  addNewAccess() {
    this.driverAccessForm.reset();
    this.employeeSelectedOption = getBlankOption()
    this.isAddDriverOpen = true;
  }

  confirmButton(e) {
    if (e) {
      let payload = {
        driver_user_id: this.employeeDetail.id,
        status: this.employeeDetail.toggle_status
      }
      this._driverAccessService.appUserStatus(payload).subscribe(resp => {
        this.driverAppUsersList.forEach((driver)=>{
          if(driver.id === this.employeeDetail.id){
            driver['toggle_status'] = resp['result']['toggle_status']
          }
        })
      })
    }else{
      this.driverAppUsersList.forEach((driver)=>{
        if(driver.id === this.employeeDetail.id){
          driver['toggle_status'] = !this.employeeDetail.toggle_status;
        }
      })
    }
  }

  switchToggle(data) {
    this.employeeDetail = data;
    if (!this.employeeDetail.toggle_status) {
      this.popupInputData.show = true;
      this.popupInputData.msg = `Are you sure you want to make ${this.employeeDetail.display_name} Inactive, This will remove his/her the access to Driver App`;
    } else {
      let payload = {
        driver_user_id: this.employeeDetail.id,
        status: this.employeeDetail.toggle_status
      }
      this._driverAccessService.appUserStatus(payload).subscribe(resp => {
        this.driverAppUsersList.forEach((driver)=>{
          if(driver.id === data.id){
            driver['toggle_status'] = resp['result']['toggle_status']
          }
        })
      })
    }
  }

  selectedParamsDriversListList() {
    const queryParams = this.route.snapshot.queryParams;
    this.listQueryParams = {
      search: queryParams['search'],
      next_cursor: '',
      filters: queryParams['filter'],
    }
    this.getDriverAppUserList(this.listQueryParams);
  }

  getDriverAppUserList(params) {
    this.driverAppUsersList = [];
    this.listQueryParams.next_cursor = '';
    this._driverAccessService.getDriverUserList(params).subscribe((data) => {  
      this.driverAppUsersList = data['result']['drivers'];    
        this.listQueryParams.next_cursor = data['result']?.next_cursor;
    });
  }

  listWidgetData(widgetData: ListWidgetData) {
    let queryParams = new Object(
      {
        search: widgetData.searchValue,
        filter: JSON.stringify(widgetData.filterKeyData),
      }
    );
    this.router.navigate([getPrefix() + this.listUrl], { queryParams });
  }

  onScroll() {
    const container = document.querySelector('.custom-table-container');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoading && this.listQueryParams.next_cursor?.length > 0) {
      this.onScrollGetTripList(this.listQueryParams);
    }
  }

  onScrollGetTripList(params) {
    this.isLoading = true;
    this._driverAccessService.getDriverUserList(params).subscribe((data) => {
      this.driverAppUsersList.push(...data['result']['drivers']);
      this.listQueryParams.next_cursor = data['result'].next_cursor;
      this.isLoading = false;
    })
  }

  settingsApplied(event: boolean) {
    if (event) {
      this.listQueryParams.next_cursor = '';
      this.getDriverAppUserList(this.listQueryParams);
    }
  }

  trackById(item: any): string {
    return item.id;
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

}


