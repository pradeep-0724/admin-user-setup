import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { CompanyTripGetApiService } from 'src/app/modules/customerapp-module/revenue-module/trip-module/company-vehicle-module/company-trip-class/company-trip-service.service';
import { getBlankOption, isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { TripsAddEditPopUp } from '../trip-details-v2.interface';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { NewTripV2Service } from '../../../../api-services/trip-module-services/trip-service/new-trip-v2.service';
import { NewTripV2Constants } from '../../new-trip-v2-constants/new-trip-v2-constants';
import { ToolTipInfo } from '../../new-trip-v2-utils/new-trip-v2-utils';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { TokenExpireService } from 'src/app/core/services/token-expire.service';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { CommonService } from 'src/app/core/services/common.service';
import { NewTripV2DataService } from '../../new-trip-v2-dataservice';
import { Subscription } from 'rxjs';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-add-driver-allowance',
  templateUrl: './add-driver-allowance.component.html',
  styleUrls: ['./add-driver-allowance.component.scss']
})
export class AddDriverAllowanceComponent implements OnInit {

  constructor(private dialogRef: DialogRef<boolean>, @Inject(DIALOG_DATA) private data: TripsAddEditPopUp, private formbuilder: FormBuilder, private _tokenExpireService:TokenExpireService,
    private _companyTripGetApiService: CompanyTripGetApiService, private commonloaderservice: CommonLoaderService, private _newTripv2service: NewTripV2Service,
    private _commonService: CommonService,private _tripDataService : NewTripV2DataService,private _newTripV2Service : NewTripV2Service,
    private currency: CurrencyService,private apiHandler: ApiHandlerService) { }
  addDriverAllowanceForm: FormGroup;
  months = new ValidationConstants().month;
  monthsDropdownValues: any = [];
  employeeList = [];
  accountList = [];
  initialDetails = {
    driver: getBlankOption(),
    driverAccount: getBlankOption(),
    month: getBlankOption(),
    reason : getBlankOption(),
    timesheet : getBlankOption(),
    driverPaid : getBlankOption()
  }
  timeSheets : any[] = [];
  vehicleCategory : number;
  isMonthlyPaymentModeSelected: boolean = false;
  accountType = new ValidationConstants().accountType.join(',');
  tripStartDate = new Date(dateWithTimeZone());
  tripToolTip: ToolTipInfo;
  calculation_Month_info:ToolTipInfo;
  constantsTripV2 = new NewTripV2Constants();
  manufacturerApi = TSAPIRoutes.static_options;
  manufacturerParams: any = {};
  staticOptions: any = {}
  $subscriptions: Array<Subscription> = [];
  currency_type:any;
  
  ngOnInit(): void {
    this.currency_type = this.currency.getCurrency();
    this.tripStartDate = new Date(this.data.tripStartDate);
    this.vehicleCategory = this.data.vehicle_category;        
    this.buildForm();        
    if (this.data.type == 'Edit') {
      this.patchForm(this.data.editdata)
    }else{
      this.addDriverAllowanceForm.get('employee').setValue(this.data?.driver[0]?.id);
      this.initialDetails.driver={label : this.data?.driver[0]?.name , value :this.data?.driver[0]?.id}
    }
    setTimeout(() => {
      this.initialDetail();
    }, 100);
    this.commonloaderservice.getHide();
    this.tripToolTip = {
      content: this.constantsTripV2.toolTipMessages.DRIVER_ALLOWANCE.CONTENT
    };
    this.calculation_Month_info = {
      content: this.constantsTripV2.toolTipMessages.CALCULATION_MONTH_INFO.CONTENT
    }

    this._tokenExpireService.observeTokenExpire.subscribe(isExpired=>{
      if(isExpired){
        this.dialogRef.close(false)
      }
    })

    this.getApprovedTimeSheets();
    this.$subscriptions.push(this._tripDataService.approvedTimeSheets.subscribe(isTrue => {
      if (isTrue == 'true' || isTrue == true) {
        this.getApprovedTimeSheets()
      }
    }));
    this._commonService.getStaticOptions('reason').subscribe((response) => {
      this.staticOptions.tyreManufacturer = response.result['reason'];
    });
    this.data.type === 'Add' && this._newTripv2service.getPaymentModeHistoryForDriverCommission().subscribe((data)=>{
      let result = data['result'];
      if(result?.is_employee_paid){
        this.initialDetails.driverAccount.label = 'Paid By Employee';
        this.addDriverAllowanceForm.patchValue({
          account: 'paid_by_driver',
        });    
        setTimeout(() => {
          this.onemployeeChange(this.addDriverAllowanceForm)
        }, 300);
        setUnsetValidators(this.addDriverAllowanceForm,'paid_employee',[Validators.required]);
      }
      if(result?.is_monthly){
        this.addDriverAllowanceForm.patchValue({
          is_driver_paid: false,
          account: 'monthly',
        });
        this.initialDetails.driverAccount.label = "Monthly";
        this.changeMonths(this.addDriverAllowanceForm,false);
        const monthToFillIndex = result?.month_to_fill === 'current' ? 0 :
                result?.month_to_fill === 'next' ? 1 : 2;
        const { name, id } = this.monthsDropdownValues[monthToFillIndex];
        this.addDriverAllowanceForm.get('month').setValue(id);
        this.initialDetails.month.label = name;
      }
      if(isValidValue(result?.payment_mode?.id)){
        this.addDriverAllowanceForm.get('account').setValue(result?.payment_mode?.id);
        this.initialDetails.driverAccount.label = result?.payment_mode?.name;
      }
    })

  }

  getApprovedTimeSheets(){
    this._newTripV2Service.getApprovedTimeSheets(this.data.tripId).subscribe((res:any)=>{
      this.timeSheets = res['result'].filter((ele)=>ele.timesheet_no.length>0);      
    })
  }

  buildForm() {
    this.addDriverAllowanceForm = this.formbuilder.group({
      id: [null],
      employee: [null, [Validators.required]],
      month: [-1],
      account: [null, [Validators.required]],
      paid: [0.00, [Validators.required, Validators.min(0.01)]],
      transaction_date: [this.tripStartDate],
      is_driver_paid: [false],
      designation: '',
      paid_designation : '',
      paid_employee : [null],
      reason : [null,[Validators.required]],
      month_to_fill : [''],
      timesheet : [null]
    })
  }

  patchForm(data) {        
    this.addDriverAllowanceForm.patchValue({
      id: data.id,
      employee: data.employee ? data.employee.id : null,
      paid: data.paid,
      transaction_date: data.transaction_date,
      designation:  data.employee ? data.employee['designation'] : '',
      paid_employee : data?.paid_employee ? data?.paid_employee?.id : null,
      paid_designation : data?.paid_employee ? data.paid_employee['designation'] : null,
      reason : data?.reason?.id ? data.reason.id : null,
      timesheet : data?.timesheet?.id ? data.timesheet.id : null,
      month_to_fill : data?.month_to_fill
    })

    if (data.employee) this.initialDetails.driver.label = data.employee.display_name;
    if (data.paid_employee) this.initialDetails.driverPaid.label = data.paid_employee.display_name;
    if (data?.reason) this.initialDetails.reason.label = data?.reason?.name;
    if (data?.timesheet) this.initialDetails.timesheet.label = data.timesheet.label;

    if(data.account){
      if (data.account['id']) {
        this.initialDetails.driverAccount.label = data.account.name;
        this.addDriverAllowanceForm.get('account').setValue(data.account.id)
      }else{
        if (data.is_driver_paid) {
          this.initialDetails.driverAccount.label = "Paid By Employee";
          this.addDriverAllowanceForm.get('account').setValue('paid_by_driver')
        } 
      }
    }else{
      this.addDriverAllowanceForm.get('account').setValue('monthly')
      this.initialDetails.driverAccount.label = "Monthly";
      this.addDriverAllowanceForm.get('month').setValue(data.month.id);
      this.initialDetails.month.label = data.month.name
    }
   
    this.changeMonths(this.addDriverAllowanceForm,false);

  }

  ngOnDestroy(): void {
    if (this.$subscriptions.length) {
      this.$subscriptions.forEach(sub => {
        sub.unsubscribe();
      });
    }
  }


  cancel() {
    this.dialogRef.close(false)
    this.commonloaderservice.getShow()
  }

  save() {
    let form = this.addDriverAllowanceForm;
    if (form.valid) {
      form.value['transaction_date'] = changeDateToServerFormat(form.value['transaction_date'])
      if (form.value['account'] == 'paid_by_driver') {
        form.value['is_driver_paid'] = true;
        form.value['account'] = null;
      }
      if (form.value['account'] == 'monthly') {
        form.value['account'] = null;
      }
      let paylaod = { driver_allowances: form.value }
      this.apiHandler.handleRequest(this._newTripv2service.putDriverAllowances(this.data.tripId, paylaod), 'Driver Commission saved successfully!').subscribe(
        {
          next: () => {
            this.dialogRef.close(true);
            this._tripDataService.updateTimeSheet(true);
            this.commonloaderservice.getShow()
          }
        }
      );
    }
    else {
      this.setAsTouched(form)
    }

  }

  setAsTouched(group: UntypedFormGroup | UntypedFormArray) {
    group.markAsTouched();
    for (let i in group.controls) {
      if (group.controls[i] instanceof UntypedFormControl) {
        group.controls[i].markAsTouched();
      } else {
        this.setAsTouched(group.controls[i]);
      }
    }
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  populateMonthsDropdown(value) {
    let month = value.getMonth();
    if (month == 11) {
      this.monthsDropdownValues = [{ id: 12, name: 'December' }, { id: 1, name: 'January' }, { id: 2, name: 'Febuary' }]
    }
    else if (month == 10) {
      this.monthsDropdownValues = [{ id: 11, name: 'November' }, { id: 12, name: 'December' }, { id: 1, name: 'January' }]
    }
    else {
      this.monthsDropdownValues = this.months.slice(month, month + 3);
    }
  }

  initialDetail() {
    this._companyTripGetApiService.getAll(employeeList => {
      this.employeeList = employeeList;
    });
    this._companyTripGetApiService.getAccountsV2(this.accountType, accountList => { this.accountList = accountList });

  }

  onDriverHelperPaymentModeSelected() {
    const form = this.addDriverAllowanceForm;
    form.get('paid_employee').setValue(null);
    form.get('account').value ==='paid_by_driver' ? setUnsetValidators(form,'paid_employee',[Validators.required]) : setUnsetValidators(form,'paid_employee',[Validators.nullValidator]);
    if(form.get('account').value ==='paid_by_driver'){
      form.get('paid_employee').setValue(form.get('employee').value);
      this.initialDetails.driverPaid = getBlankOption();
      this.initialDetails.driverPaid.label =  this.employeeList.find(emp=>emp.id == form.get('employee').value)?.first_name 
      form.get('paid_designation').setValue(this.employeeList.find(emp=>emp.id == form.get('paid_employee').value)?.designation)
    }else{
      form.get('paid_employee').setValue(null);
      setUnsetValidators(form,'paid_employee',[Validators.nullValidator])
    }
    this.changeMonths(form);
    let drivername = this.employeeList.find(driver => driver.id == form.value['employee']);
    form.get('designation').setValue(drivername?.designation)
  }

  changeMonths(form,isSettripStartDate=true) {
    let account = form.get('account').value
    if (account == 'monthly') {
      this.populateMonthsDropdown(this.tripStartDate);
      this.isMonthlyPaymentModeSelected = true;
      this.monthEnableDisable(true, form);
      form.get('transaction_date').setValue(null);
    }
    else {
      this.isMonthlyPaymentModeSelected = false;
      this.initialDetails.month = getBlankOption();
      if(isSettripStartDate){
        form.get('transaction_date').setValue(this.tripStartDate);
      }
      
      this.monthEnableDisable(false, form);
    }
  }

  monthEnableDisable(enable: boolean = false, form: AbstractControl) {
    if (enable) {
      form.get('month').enable();
      form.get('month').setValidators([Validators.required, Validators.min(0.01)]);
      form.get('month').updateValueAndValidity();
    } else {
      form.get('month').setValue(0);
      form.get('month').disable();
      setUnsetValidators(form, 'month', [Validators.nullValidator]);
    }
  }


  onemployeeChange(form) {
    if (form.value['employee']) {      
      let drivername = this.employeeList.find(driver => driver.id == form.value['employee']);
      form.get('designation').setValue(drivername.designation)
      if(form.get('account').value ==='paid_by_driver'){
        form.get('paid_employee').setValue(form.get('employee').value);
        this.initialDetails.driverPaid = getBlankOption();
        this.initialDetails.driverPaid.label =  this.employeeList.find(emp=>emp.id == form.get('paid_employee').value)?.first_name;        
        form.get('paid_designation').setValue(this.employeeList.find(emp=>emp.id == form.get('paid_employee').value)?.designation)
      }else{
        setUnsetValidators(form,'paid_employee',[Validators.nullValidator]);
      }
    }
  }

  paidEmployeeSelected(form){
    form.get('paid_designation').setValue(this.employeeList.find(emp=>emp.id == form.get('paid_employee').value)?.designation)

  }

  addNewManufacturer(event) {
    this.manufacturerParams = {
      key: 'reason',
      label: event,
      value: 0
    };
  }
  getNewManufacturer(event) {
		if (event) {
			this._commonService
			.getStaticOptions('reason')
			.subscribe((response) => {
        this.staticOptions.tyreManufacturer = response.result['reason'];
        this.addDriverAllowanceForm.get('reason').setValue(event.id)
        this.initialDetails.reason.label = event.label;
        this.initialDetails.reason.value = event.id;
			});
		}
	}

  monthSelected(){
    const monthMap = {
      '0': 'current',
      '1': 'next',
      '2': 'third',
    };
    const selectedMonth = this.addDriverAllowanceForm.get('month').value;
    const value = this.monthsDropdownValues.findIndex(ele=>ele.id == selectedMonth);    
    this.addDriverAllowanceForm.get('month_to_fill').setValue(monthMap[value]);    
    
  }
}
