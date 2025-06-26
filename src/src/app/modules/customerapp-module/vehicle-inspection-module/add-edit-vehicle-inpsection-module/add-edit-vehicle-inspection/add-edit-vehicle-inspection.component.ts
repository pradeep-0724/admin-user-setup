import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { setAsTouched } from 'src/app/shared-module/utilities/form-utils';
import { getBlankOption, isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { CommonService } from 'src/app/core/services/common.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { Subject } from 'rxjs';
import { VehicleInspectionServiceService } from '../../../api-services/vehicle-inspection/vehicle-inspection-service.service';
import { EmployeeService } from '../../../api-services/master-module-services/employee-service/employee-service';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';

@Component({
  selector: 'app-add-edit-vehicle-inspection',
  templateUrl: './add-edit-vehicle-inspection.component.html',
  styleUrls: ['./add-edit-vehicle-inspection.component.scss']
})
export class AddEditVehicleInspectionComponent implements OnInit {

  vehicleInspectionForm: FormGroup
  isInspectionFormSelected = false
  preFixUrl = getPrefix()
  apiError = ''
  initialValues = {
    vehicle: getBlankOption(),
    driver : getBlankOption(),
    inspected_by: getBlankOption(),
    inspectionName : getBlankOption(),
  }
  markForTouched = new Subject();
  isInspectionCheckListmandatory = new Subject();
  inspectionDetails=null;
  pattern = new ValidationConstants().VALIDATION_PATTERN;
  settingsRoute = '/organization_setting/settings/vehicle-inspection/custom-field';
  inspectionScreen = 'Vehicle';
  apiUrl = new Subject()
  vehiclesList = [];
  driverList = [];
  employeeList = [];
  inspectionsList =[];
  vehicleInspectionId = '';
  isCategoryChanged  = false;
  inspectionPermission = Permission.vehicleInspection.toString().split(',')[3];
  vehicleCategiriesObj={
    hasMultipleCategories:false,
    categories:[1,2]
  }
  analyticsType = OperationConstants;
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  formNameApi='vehicle-inspection-form-name'
 
  constructor(private _fb: FormBuilder,
     private _route: Router, private _scrollToTop: ScrollToTop,private apiHandler: ApiHandlerService,private _analytics: AnalyticsService,
    private _commonService: CommonService, private _loader: CommonLoaderService, private _activateRoute: ActivatedRoute,private _vehicleInspectionService : VehicleInspectionServiceService,
    private _employeeService : EmployeeService) { }

  ngOnInit(): void {
    this.buildForm();
    this.getDriverList();
    this.getEmployeeList();
    this.getInspectionFormNamesList();
    this._loader.getHide();
  }

  ngOnDestroy(): void {
    this._loader.getShow();
  }

  ngAfterViewInit(): void {
    this._activateRoute.params.subscribe(prams => {
      if (prams['InspectionId']) {
        this.vehicleInspectionId = prams['InspectionId']
        this._commonService.getVehicleCatagoryType().subscribe(resp => {
          this.vehicleCategiriesObj.categories = resp['result']['categories']
        })
        this.getVehicleInspectionDetails();
      }else{
        this._commonService.getVehicleCatagoryType().subscribe(resp => {
          this.vehicleCategiriesObj.categories = resp['result']['categories']
          if(this.vehicleCategiriesObj.categories.includes(1)){
            this.vehicleCatagoryChange('1')
            return
          }
          if(this.vehicleCategiriesObj.categories.includes(2)){
            this.vehicleCatagoryChange('2')
            return
          }
        })
        this.getVehicleInspectionNumber()
      }
    })
  }


  buildForm() {
    this.vehicleInspectionForm = this._fb.group({
      id: [null],
      driver : [null],
      form_name : [null],
      inspected_by : [null],
      vehicle : [null,[Validators.required]],
      job_ready_mandatory : [null,[Validators.required]],
      maintenance_required : [-1],
      inspection_date: [new Date(dateWithTimeZone()), Validators.required],
      vehicle_category: ['', [Validators.required]],
      inspection_no: ['', [Validators.required]],
      remarks : ['']
    })
  }

  headReset() {
    this.vehicleInspectionForm.patchValue({
      vehicle : '',
      driver : '',
      inspected_by : ''
    })
    this.initialValues.vehicle = getBlankOption();
    this.initialValues.driver = getBlankOption();
    this.initialValues.inspected_by = getBlankOption();
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  getInspectionFormNamesList(){
    this._vehicleInspectionService.getVehicleInspectionforms().subscribe((response) => {      
      this.inspectionsList = response.result;
    });
  }

  vehicleCatagoryChange(type) {
    this.headReset();
    this.vehicleInspectionForm.get('vehicle_category').setValue(type);
    this.isInspectionFormSelected = true;
    this.inspectionDetails = null;
    setTimeout(() => {
      this.isCategoryChanged = false;
    }, 100);
    this.getActiveOwnVehicleList();
  }


  getVehicleInspectionNumber() {
    this._commonService.getSuggestedIds('vehicleinspection').subscribe((response) => {      
      this.vehicleInspectionForm.controls['inspection_no'].setValue(response.result['vehicleinspection']);
    });
  }

  getActiveOwnVehicleList(){
    let params = {
      is_market_vehicle : 'false',
      vehicle_category : this.vehicleInspectionForm.get('vehicle_category').value
    }
    this._vehicleInspectionService.getActiveOwnVehicles(params).subscribe((res)=>{
      this.vehiclesList = res['result']['veh'];
    })
  }

  getDriverList(){
    this._employeeService.getDriverList().subscribe((response) => {
      this.driverList = response['result'];
    });
  }

  getEmployeeList(){
    this._employeeService.getEmployeeList().subscribe((response) => {
      this.employeeList = response;
    });
  }

  getVehicleInspectionDetails() {
    this._vehicleInspectionService.getVehicleInspectionDetails(this.vehicleInspectionId).subscribe(resp => {
      this.isInspectionFormSelected = true;
      this.patchForm(resp['result']);
      this.inspectionDetails=resp['result']['vehicle_details'];
    })
  }

  patchForm(data){
    if(isValidValue(data['form_name'])){
      this.initialValues.inspectionName.label = data['form_name']['label'];
      this.initialValues.inspectionName.value = data['form_name']['id'];
      data['form_name'] = data['form_name']['id'];
    }
    if(isValidValue(data['driver'])){
      this.initialValues.driver.label = data['driver']['name'];
      this.initialValues.driver.value = data['driver']['id'];
      data['driver'] = data['driver']['id'];
    }
    if(isValidValue(data['inspected_by'])){
      this.initialValues.inspected_by.label = data['inspected_by']['name'];
      this.initialValues.inspected_by.value = data['inspected_by']['id'];
      data['inspected_by'] = data['inspected_by']['id'];
    }
    this.initialValues.vehicle.label = data['vehicle']['name'];
    this.initialValues.vehicle.value = data['vehicle']['id'];
    data['vehicle'] = data['vehicle']['id'];
    this.vehicleInspectionForm.patchValue(data);
    this.getActiveOwnVehicleList();

  }


  onVehicleSelected(){
    this.vehicleInspectionForm.patchValue({
      driver : '',
      inspected_by : ''
    })
    this.initialValues.driver = getBlankOption();
    this.initialValues.inspected_by = getBlankOption();
    let vehicle = this.vehicleInspectionForm.get('vehicle').value;
    let selectedvehicle = this.vehiclesList.filter((res)=>res.id=== vehicle);
    if(selectedvehicle[0].employees_assigned.length > 0){
      this.vehicleInspectionForm.get('driver').setValue(selectedvehicle[0].employees_assigned[0].id);
      this.initialValues.driver.label = selectedvehicle[0].employees_assigned[0].first_name;
      this.initialValues.driver.value = selectedvehicle[0].employees_assigned[0].id;
      this.vehicleInspectionForm.get('inspected_by').setValue(selectedvehicle[0].employees_assigned[0].id);
      this.initialValues.inspected_by.label = selectedvehicle[0].employees_assigned[0].first_name;
      this.initialValues.inspected_by.value = selectedvehicle[0].employees_assigned[0].id;
    }else{
      this.initialValues.driver = getBlankOption();
      this.initialValues.inspected_by = getBlankOption();
      this.vehicleInspectionForm.get('inspected_by').setValue('');
      this.vehicleInspectionForm.get('driver').setValue('');
    }
    
  }

  onInspectionSelected(){
    this.isInspectionFormSelected = true;
    let inspectionFormId = this.vehicleInspectionForm.get('form_name').value;
    this.apiUrl.next(`revenue/vehicle_detail/setting/form/${inspectionFormId}/`)
  }

  onDriverSelected(){
    let driver = this.vehicleInspectionForm.get('driver').value;
    let selectedDriver  = this.driverList.find(ele=>ele.id===driver);
    this.initialValues.inspected_by = getBlankOption();
    this.vehicleInspectionForm.get('inspected_by').setValue(null);
    if(isValidValue(selectedDriver)){
      this.initialValues.inspected_by.label = selectedDriver.emp_name_id;
      this.initialValues.inspected_by.value = selectedDriver.id;
      this.vehicleInspectionForm.get('inspected_by').setValue(driver);
    }
  }




  saveVehicleInspection() {
    let form = this.vehicleInspectionForm;
    let formValue = cloneDeep(form.value)
    formValue['inspection_date'] = changeDateToServerFormat(formValue['inspection_date'])
    formValue['vehicle_details'] = this.formatInspectionDetails(formValue['site_details']['site_details'])
    if (formValue['vehicle_category']) {
      if (form.valid) {
        if(this.vehicleInspectionId){
          this.apiHandler.handleRequest(this._vehicleInspectionService.putvehicleInspection(this.vehicleInspectionId, formValue), 'Vehicle Inspection updated successfully!').subscribe(
            {
              next: () => {
                this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.VEHICLEINSPECTION, this.screenType.EDIT);
                this._route.navigate([this.preFixUrl + '/vehicle-inspection/view', this.vehicleInspectionId])
              },
              error: () => {
                this.apiError = 'Failed to update vehicle inspection!';
                setTimeout(() => (this.apiError = ''), 3000);
              }
            }
          )
        }else{
          this.apiHandler.handleRequest(this._vehicleInspectionService.postVehicleInspection(formValue), 'Vehicle Inspection added successfully!').subscribe(
            {
              next: (resp) => {
                this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.VEHICLEINSPECTION, this.screenType.ADD);
                this._route.navigate([this.preFixUrl + '/vehicle-inspection/view', resp['result']['id']])
              },
              error: () => {
                this.apiError = 'Failed to add vehicle inspection!';
                setTimeout(() => (this.apiError = ''), 3000);
              }
            }
          )
        }
      } else {
        this.markForTouched.next(true)
        setAsTouched(form);
        this._scrollToTop.scrollToTop()
      }
    }
  }


  formatInspectionDetails(inspectionDetails = []) {
    inspectionDetails.forEach(details => {
      details['documents'] = details['documents'].map(documents => documents['id'])
      details['checklist'] = this.formatCheckList(details['checklist'])
    })

    return inspectionDetails
  }

  formatCheckList(checkListData = []) {
    checkListData.forEach(checkList => {
      if (checkList['field_type'] == 'date') {
        checkList['value'] = changeDateToServerFormat(checkList['value'])
      }
      if (checkList['field_type'] == 'upload') {
        checkList['value'] = checkList['value'].map(documents => documents['id'])
      }
    })
    return checkListData
  }
}


