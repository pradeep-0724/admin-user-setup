import { TransportValidator } from '../../../../../../../shared-module/components/validators/validators';
import { CommonService } from '../../../../../../../core/services/common.service';
import { EditEmployeeService } from '../../edit-employee-services/edit-employee-service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormGroup, Validators, AbstractControl, UntypedFormArray, UntypedFormControl, UntypedFormBuilder } from '@angular/forms';
import { StoreService } from '../../../../../api-services/auth-and-general-services/store.service';
import { TSStoreKeys } from '../../../../../../../core/constants/store-keys.constants';
import { changeDateToServerFormat } from '../../../../../../../shared-module/utilities/date-utilis';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import * as _ from 'lodash';
import { CompanyModuleServices } from 'src/app/modules/customerapp-module/api-services/company-service/company-module-service.service';
import { EmployeeService } from '../../../../../api-services/master-module-services/employee-service/employee-service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { getCountryCode } from 'src/app/shared-module/utilities/countrycode-utils';
import { CountryIdService } from 'src/app/core/services/countryid.service';
import { DriverAccessService } from 'src/app/modules/customerapp-module/api-services/orgainzation-setting-module-services/driver-app-access-service/driver-access.service';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';

@Component({
  selector: 'edit-emloyee-information',
  templateUrl: './edit-information.component.html',
  styleUrls: ['./edit-information.component.scss']
}) 

export class EmployeeInformationComponent implements OnInit {

  information_toggle: Boolean = true;
  remarks_toggle: Boolean = true;
  employee_details: UntypedFormGroup;
  informationDropdown: any;
  employeeDesignation: any;
  addressDocumentAttachments = [];
  imageDocumentAttachment = [];
  vehicleData: Array<any>;
  profile_img_url: any;
  current_day: Date = new Date(dateWithTimeZone());
  dob: Date;
  id: any;
  employee_id: string;
  loadDetailData: any = [];
  bloodGroup: any;
  designationList: any;
  designationParams: any = {};
  employeeDesignationApi = TSAPIRoutes.static_options;
  initialValues: any = {
    bloodGroup: {},
    designation: {},
    vehicle_assigned: {},
    contact_country_code: {},
    contractType: {},
    assignedForeman: {},
    model: {}


  };
  apiError: string;
  contact_error: string;
  display_name_error: any;
  countryPhoneCode = [];
  prefixUrl = '';
  contractType = [{
    value: 'Company',
    id: 1
  },
  {
    value: 'Foreman',
    id: 2
  }]

  isForeMenEnabled = false;
  foreManAssignedList = [];
  foreManModelList = [];
  analyticsType = OperationConstants;
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;

  countryId = ""
  vehicle_error: any = '';


  constructor(private _editEmployeeService: EditEmployeeService,
    private _stateService: StoreService,
    private _employeeService: EmployeeService,
    private _commoservice: CommonService,
    private _fb: UntypedFormBuilder,
    private _router: Router,
    private _analytics: AnalyticsService,
    private _companyModuleService: CompanyModuleServices,
    private _prefixUrl: PrefixUrlService,
    private _countryId: CountryIdService,
    private _driverAccessService: DriverAccessService,
    private _scrollToTop:ScrollToTop

  ) {
    this.current_day = new Date(dateWithTimeZone());
    this.countryId = this._countryId.getCountryId();
  }

  ngOnInit() {    
    this.prefixUrl = this._prefixUrl.getprefixUrl();
    this.buildForm();
    this.employee_details.get('contract_type').setValue('1');
    this.initialValues.contractType = { label: this.contractType[0].value }
    this.setPhoneCode();
    let urlString = location.href.split('/');
    if (urlString[7] == "edit") {
      this.id = urlString[8];
    }
    this._companyModuleService.getPhoneCode().subscribe(result => {
      let codes = [];
      codes = result['results'];
      this.countryPhoneCode = codes.map(code => code.phone_code)
    })
    this._employeeService.getVehicleAssigend().subscribe((data: any) => this.vehicleData = data);
    this._commoservice.getStaticOptions('blood-group,employee-designation').subscribe((response: any) => {
      this.bloodGroup = response.result['blood-group'];
      this.designationList = response.result['employee-designation'];
    });
    this.employee_details.valueChanges.subscribe((data) => {
      this.dob = new Date(data.date_of_birth);
    });
    this.getFormValues();
  }

  addParamsToDesignation(event) {
    if (event) {
      this.designationParams = {
        key: 'employee-designation',
        label: event,
        value: 0
      };
    }
  }

  getNewDesignations($event) {
    if ($event) {
      this._commoservice.getStaticOptions('employee-designation').subscribe((response) => {
        // this.initialValues.designation = {};
        this.designationList = response.result['employee-designation'];
        // this.initialValues.designation = {value: $event.id, label: $event.label};
        this.employee_details.controls.designation.setValue($event.id);
      });
    }
  }

  checkInitialDetails(response: any, data?: any) {
    if (response !== undefined) {
      if (Object.keys(response).length &&
        Object.keys(data).length !== 0) {
        return true;
      }
      else {
        return false;
      }
    }
  }

  patchBloodGroup(data: any) {
    if (this.loadDetailData.length) {
      if (isValidValue(data.blood_group)) {
        this.initialValues.bloodGroup['label'] = this.loadDetailData[0].blood_group.label;
        this.initialValues.bloodGroup['value'] = this.loadDetailData[0].blood_group.id;
        this.checkInitialDetails(this.loadDetailData, this.initialValues.bloodGroup);
        data.blood_group = data.blood_group.id;
      }
      else {
        data.blood_group = '';
        this.checkInitialDetails(this.loadDetailData, { name: null });
      }
    }
  }

  patchCountryCode(data) {
    if (data.contact_country_code) {
      this.initialValues.contact_country_code['label'] = this.loadDetailData[0].contact_country_code;
      this.initialValues.contact_country_code['value'] = this.loadDetailData[0].contact_country_code;
      data.contact_country_code = data.contact_country_code
    }
    else {
      this.initialValues.contact_country_code = { label: getCountryCode(this.countryId) }
    }
  }

  patchDesignation(data: any) {
    if (this.loadDetailData.length) {
      if (isValidValue(data.designation)) {
        this.initialValues.designation['label'] = this.loadDetailData[0].designation.label;
        this.initialValues.designation['value'] = this.loadDetailData[0].designation.id;
        this.checkInitialDetails(this.loadDetailData, this.initialValues.designation);
        data.designation = data.designation.id;
      }
      else {
        data.designation = '';
        this.checkInitialDetails(this.loadDetailData, { name: null });
      }
    }
  }



  patchVehicleAssigned(data: any) {
    if (this.loadDetailData.length) {
      if (isValidValue(data.vehicle_assigned)) {
        this.initialValues.vehicle_assigned['label'] = this.loadDetailData[0].vehicle_assigned.reg_number;
        this.initialValues.vehicle_assigned['value'] = this.loadDetailData[0].vehicle_assigned.id;
        this.checkInitialDetails(this.loadDetailData, this.initialValues.vehicle_assigned);
        data.vehicle_assigned = data.vehicle_assigned.assign_driver.id;
      }
      else {
        data.vehicle_assigned = '';
        this.checkInitialDetails(this.loadDetailData, { name: null });
      }
    }
  }

  patchFormValues(data: any) {
    
    const employeeData = _.cloneDeep(data);
    this.patchBloodGroup(employeeData);
    this.patchCountryCode(employeeData);
    this.patchDesignation(employeeData);
    this.patchVehicleAssigned(employeeData);
    // const firstName = employeeData.first_name || '';
    // const lastName = employeeData.last_name || '';
    // const lastName = employeeData.last_name || '';
    // const fullName = (firstName + ' ' + lastName).trim();
    // this.employee_details.get('name').setValue(fullName);
    this.employee_details.patchValue(data);
    if (isValidValue(data.contract_type)) {
      this.employee_details.get('contract_type').setValue(data.contract_type.index);
      this.initialValues.contractType = { label: data.contract_type.label };
      this.contractTypeSelection();
      if (isValidValue(data.assigned_foreman)) {
        this.initialValues.assignedForeman = { label: data.assigned_foreman.display_name };
        this.employee_details.get('assigned_foreman').setValue(data.assigned_foreman.id);
      }
      this.assignForeMan();
      if (isValidValue(data.foreman_model)) {
        this.initialValues.model = { label: data.foreman_model.display_name };
        this.employee_details.get('foreman_model').setValue(data.foreman_model.id);
      }

    }

  }

  getFormValues() {
    if (this.id) {
      this._editEmployeeService.getAllEditDetails(this.id).subscribe((response) => {
        this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.EMPLOYEE, this.screenType.EDIT, "Navigated");
        if (response !== undefined) {
          if (response.detail) {
            this.loadDetailData.push(response.detail);
            this.patchFormValues(response.detail);
            this._stateService.getFromStore(TSStoreKeys.master_employee_edit_information).subscribe(storeData => {
              if (storeData !== undefined) {
                this.profile_img_url = storeData.detail.profile_image_url;
              }
            });
          }
        }
      });
    } else {
      this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.EMPLOYEE, this.screenType.ADD, "Navigated");
    }
  }

  buildForm() {
    this.employee_details = this._fb.group({
      first_name: ['', [Validators.required]],
      middle_name: [''],
      employee_id: [''],
      display_name: ['', [Validators.required, Validators.maxLength(20)]],
      joining_date: [this.current_day, [Validators.required]],
      designation: [null],
      date_of_birth: [null],
      contract_type: [''],
      contact: ['', [Validators.required]],
      email_address: ['', [TransportValidator.emailValidator, Validators.maxLength(42)]],
      blood_group: [''],
      father_name: [''],
      reference_person: [''],
      vehicle_assigned: [null],
      foreman_model: [''],
      assigned_foreman: [''],
      profile_image: [
        []
      ],
      remarks: [''],
      contact_country_code: [getCountryCode(this.countryId), [Validators.required]]

    })
  }

  onDateChange(event) {
    if (this.id) {
      let date = changeDateToServerFormat(event.target.value);
      this._editEmployeeService.editCheckJoiningDate(this.id, date).subscribe((res) => {
      },
        (e) => {
          this.apiError = e.error.message;
        })
    }
  }

  onImageUploaded(files: any) { }

  fileUploaded(filesUploaded, documentIndex = 0) {
    if (this.addressDocumentAttachments[documentIndex] === undefined) {
      this.addressDocumentAttachments[documentIndex] = [];
    }
    filesUploaded.forEach(element => {
      this.addressDocumentAttachments[documentIndex].push(element.id);
    });
  }

  imageUpload(filesUploaded, documentIndex = 0) {
    this.imageDocumentAttachment = [filesUploaded[0].id];
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  setAsTouched(group: UntypedFormGroup | UntypedFormArray) {
    group.markAsTouched()
    for (let i in group.controls) {
      if (group.controls[i] instanceof UntypedFormControl) {
        group.controls[i].markAsTouched();
      } else {
        this.setAsTouched(group.controls[i]);
      }
    }
  }

  patchForm(form: UntypedFormGroup) {
    if (this.id) {
      form.patchValue({
        profile_image: this.imageDocumentAttachment,
        joining_date: changeDateToServerFormat(this.employee_details.controls['joining_date'].value),
        date_of_birth: changeDateToServerFormat(this.employee_details.controls['date_of_birth'].value),
      });
      if (isValidValue(form.get('designation').value)) {
        if (typeof (form.get('designation').value) == 'object')
          form.get('designation').setValue(form.get('designation').value.id);
      }
      if (isValidValue(form.get('vehicle_assigned').value)) {
        if (typeof (form.get('vehicle_assigned').value) == 'object')
          form.get('vehicle_assigned').setValue(form.get('vehicle_assigned').value.id);
      }
      if (isValidValue(form.get('blood_group').value)) {
        if (typeof (form.get('blood_group').value) == 'object')
          form.get('blood_group').setValue(form.get('blood_group').value.id);
      }
    }
    else {
      form.patchValue({
        profile_image: this.imageDocumentAttachment[0],
        joining_date: changeDateToServerFormat(this.employee_details.controls['joining_date'].value),
        date_of_birth: changeDateToServerFormat(this.employee_details.controls['date_of_birth'].value),
      });
      this._stateService.setToStore(TSStoreKeys.master_employee_add_information, form.value);
    }
  }

  finishForm(form: UntypedFormGroup) {
    if (form.valid) {
      this.patchForm(form);
      if (this.id) {
        this._editEmployeeService.editEmployeeInformation(this.id, form.value).subscribe((response: any) => {
          this._editEmployeeService.editEmployeeDone.next(true);
          this._employeeService.addTimeline.isInformationSaved = true;

          this._router.navigate([this.prefixUrl + '/onboarding/employee/view']);
        },
          (e) => {
            if (e.error.hasOwnProperty("message")) {
              this.apiError = e.error.message;
              this._scrollToTop.scrollToTop();            }
            this.isVehicleAssigned(e);
            if (e.error.hasOwnProperty("serializer")) {
              let controlsName = Object.keys(e.error.serializer)[0]
              switch (controlsName) {
                case 'contact':
                  this.contact_error = e.error.serializer.contact
                  break;
                case 'display_name':
                  this.display_name_error = e.error.serializer.display_name[0];
                  this._scrollToTop.scrollToTop();
                  break;
              }
            }
          });
      } else {
        this._employeeService.postEmployeeInformation(form.value)
          .subscribe((response: any) => {
            if (response) {
              this._employeeService.addTimeline.isInformationSaved = true;
              this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.EMPLOYEE)
              this._router.navigate([this.prefixUrl + '/onboarding/employee/view']);
            }
          }, (e) => {
            this.apiError = '';

            this.contact_error = '';
            this.display_name_error = '';
            if (e.error.hasOwnProperty("message")) {
              this.apiError = e.error.message;
              this._scrollToTop.scrollToTop();
            }
            this.isVehicleAssigned(e);
            if (e.error.hasOwnProperty("serializer")) {
              let controlsName = Object.keys(e.error.serializer)[0]
              switch (controlsName) {
                case 'contact':
                  this.contact_error = e.error.serializer.contact
                  break;
                case 'display_name':
                  this.display_name_error = e.error.serializer.display_name[0];
                  this._scrollToTop.scrollToTop();
                  break;
              }
            }
          });
      }

    } else {
      this.setAsTouched(form);
      this._scrollToTop.scrollToTop();
      console.log(form.errors);
    }
  }

  submitForm(form: UntypedFormGroup) {
    if (form.valid) {
      this.patchForm(form);
      if (this.id) {
        this._editEmployeeService.editEmployeeInformation(this.id, form.value).subscribe((response: any) => {
          this._editEmployeeService.editEmployeeDone.next(true);
          this._employeeService.addTimeline.isInformationSaved = true;
          this._router.navigate([this.prefixUrl + '/onboarding/employee/edit/' + this.id + '/document']);
        },
          (e) => {
            this.apiError = '';
            this.contact_error = '';
            this.display_name_error = '';
            if (e.error.hasOwnProperty("message") && e.error.message == 'Form Error') {
              this.apiError = e.error.result.display_name[0];
              this._scrollToTop.scrollToTop();            
            }
            this.isVehicleAssigned(e);
            if (e.error.hasOwnProperty("serializer")) {
              let controlsName = Object.keys(e.error.serializer)[0]
              switch (controlsName) {
                case 'contact':
                  this.contact_error = e.error.serializer.contact
                  break;
                case 'display_name':
                  this.display_name_error = e.error.serializer.display_name[0];
                  this._scrollToTop.scrollToTop();  
                  break;
              }
            }
          });
      }
      else {
        this._employeeService.postEmployeeInformation(form.value)
          .subscribe((response: any) => {
            if (response) {
              this._employeeService.addTimeline.isInformationSaved = true;
              this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.EMPLOYEE)
              this._router.navigate([this.prefixUrl + '/onboarding/employee/add/document/' + response.result]);
            }
          }, (e) => {
            this.apiError = '';
            this.display_name_error = '';
            this.contact_error = '';
            if (e.error.result.hasOwnProperty("display_name")) {
              this.apiError = e.error.result.display_name[0];
              this._scrollToTop.scrollToTop();  
            }

            this.isVehicleAssigned(e);
            if (e.error.hasOwnProperty("serializer")) {
              let controlsName = Object.keys(e.error.serializer)[0]
              switch (controlsName) {
                case 'contact':
                  this.contact_error = e.error.serializer.contact
                  break;
                case 'display_name':
                  this.display_name_error = e.error.serializer.display_name[0];
                  this._scrollToTop.scrollToTop();  
                  break;
              }
            }

          });
      }
    } else {
      this.setAsTouched(form);
      this._scrollToTop.scrollToTop();  
      console.log(form.errors);
    }
  }

  setDisplayName() {
    let form = this.employee_details;
    form.get('display_name').setValue(form.get('first_name').value)
  }

  setPhoneCode() {
    this.initialValues.contact_country_code = { label: getCountryCode(this.countryId) };
    this.employee_details.get('contact_country_code').setValue(getCountryCode(this.countryId))
  }

  contractTypeSelection() {
    let form = this.employee_details
    if (Number(form.get('contract_type').value) == 2) {
      form.get('foreman_model').setValue('');
      this.initialValues.model = {};
      this._editEmployeeService.getForeManList().subscribe(data => {
        this.foreManAssignedList = data['result'];
      });
      this.isForeMenEnabled = true;
    } else {
      this.isForeMenEnabled = false;
      this.initialValues.model = {};
      this.initialValues.assignedForeman = {};
      form.get('foreman_model').setValue('');
      form.get('assigned_foreman').setValue('');
      form.get('foreman_model').setValidators([Validators.nullValidator]);
      form.get('foreman_model').updateValueAndValidity();
    }
  }

  assignForeMan() {
    let form = this.employee_details
    if (form.get('assigned_foreman').value) {
      this._editEmployeeService.getForeManModelList(form.get('assigned_foreman').value).subscribe(data => {
        this.foreManModelList = data['result'];
        form.get('foreman_model').setValidators([Validators.required]);
        form.get('foreman_model').updateValueAndValidity();
      })
    }
  }

  checkMobileNumber() {
    if (this.employee_details.get('contact').valid) {
      let payload = {
        mobile_no: this.employee_details.get('contact').value,
        country_code: this.employee_details.get('contact_country_code').value,
      }
      this._driverAccessService.checkDriverMobileNumber(payload).subscribe(resp => {
        if (!resp.result.mobile_unique) {
          this.employee_details.controls.contact.setErrors({ "mobileAlreadyRegistered": true })
        } else {
          this.employee_details.controls.contact.setErrors(null)
        }
      });
    }
  }

  isVehicleAssigned(e){
    if (e.error.hasOwnProperty("message")) {
      if (e.error.message == "This vehicle already exists with other employee") {
        this.employee_details.get('vehicle_assigned').setErrors({ vehicleAssignedError: true });
        this.apiError = e.error.message
        this.setAsTouched(this.employee_details);
      }

    }
  }
}
