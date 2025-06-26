import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { CountryIdService } from 'src/app/core/services/countryid.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { CompanyModuleServices } from 'src/app/modules/customerapp-module/api-services/company-service/company-module-service.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { getCountryCode } from 'src/app/shared-module/utilities/countrycode-utils';
import { EmployeeService } from '../../../../api-services/master-module-services/employee-service/employee-service';
import { CommonService } from 'src/app/core/services/common.service';
import { EditEmployeeService } from '../../edit-employee-module/edit-employee-services/edit-employee-service';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { isValidValue, roundOffAmount } from 'src/app/shared-module/utilities/helper-utils';
import * as _ from 'lodash';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { ParamMap, Router } from '@angular/router';
import { DriverAccessService } from 'src/app/modules/customerapp-module/api-services/orgainzation-setting-module-services/driver-app-access-service/driver-access.service';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { ActivatedRoute, } from '@angular/router';
import { Subject } from 'rxjs';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-add-edit-employee-v2',
  templateUrl: './add-edit-employee-v2.component.html',
  styleUrls: ['./add-edit-employee-v2.component.scss']
})
export class AddEditEmployeeV2Component implements OnInit {
  countryId = '';
  employeeDetails: UntypedFormGroup;
  prefixUrl = '';
  initialValues: any = {
    designation: {},
    vehicles_assigned: {},
    contact_country_code: {},
    accountType: {},
    bankName: {}
  };
  countryPhoneCode = [];
  vehicleData: Array<any>;
  designationList: any;
  analyticsType = OperationConstants;
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  profile_img_url: any;
  apiError = '';
  contact_error = '';
  display_name_error = ''
  designationParams: any = {};
  employeeDesignationApi = TSAPIRoutes.static_options;
  bankDetails: any;
  patterns = new ValidationConstants().VALIDATION_PATTERN;
  bankList: any;
  accountTypeList: any;
  addBankApi = TSAPIRoutes.static_options;
  accountTypePostApi = TSAPIRoutes.static_options;
  accountTypeParams: any = {};
  accountTypes = []
  editDocsData: Subject<any> = new Subject();
  isRequiedForm = false;
  employee_id = '';
  isTax = true;
  isTDS = false;
  addBankParams: any = {};
  showAssignVehicleSectioon: boolean = false;
  selectedTabIndex = 0;
  vehicleTypeSelection: any = [
    {
      isSelected: false,
      type: 1,
      specification: [],
      specificationList: [],
      errorMsg: '',
      isValid: false,
      image: "../../../../../../../assets/img/icons/crane-truck.svg ",
      vehicle_type: 'Crane',
      index  : 1

    },
    {
      isSelected: false,
      type: 2,
      specification: [],
      specificationList: [],
      errorMsg: '',
      isValid: false,
      image: "../../../../../../../assets/img/icons/awp.svg ",
      vehicle_type: 'AWP',
      index  : 2,

    },
    {
      isSelected: false,
      type: 3,
      specification: [],
      specificationList: [],
      errorMsg: '',
      isValid: false,
      image: "../../../../../../../../assets/img/icons/trailer-head.svg ",
      vehicle_type: ' Trailer Head',
      index  : 3
    },
    {
      isSelected: false,
      type: 0,
      specification: [],
      specificationList: [],
      errorMsg: '',
      isValid: false,
      image: "../../../../../../../assets/img/icons/truck-vehicle.svg ",
      vehicle_type: ' Others',
      index  : 0
    },
  ];
  allSelected: boolean = false;
  vehicleTypeAndSpecsList = [];
  dropdownSettings = {
    singleSelection: false,
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    itemsShowLimit: 2,
    enableCheckAll: true,
    allowSearchFilter: false,
    defaultOpen: false,

  };
  popupInputData = {
    'msg': '',
    'type': 'warning',
    'show': false
  };
  uniqueMobileerr = '';
  newPartyDetails = new Subject();
  showAddPartyPopup: any = { name: '', status: false };
  isCertificateValid=new Subject()
  isCertificateTabError=false;
  dropdownSettingsForVehicle = {
    singleSelection: false,
    idField: 'id',
    textField: 'reg_number',
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    itemsShowLimit:2,
    enableCheckAll: true,
    allowSearchFilter: true,
    defaultOpen:false,

    
  };
  currency_type:any;
  vehicleCategories=[]

  constructor(
    private _editEmployeeService: EditEmployeeService,
    private _employeeService: EmployeeService,
    private editEmpService: EditEmployeeService,
    private _commonService: CommonService,
    private _fb: UntypedFormBuilder,
    private _routeParam: ActivatedRoute,
    private _router: Router,
    private _analytics: AnalyticsService,
    private _companyModuleService: CompanyModuleServices,
    private _prefixUrl: PrefixUrlService,
    private _countryId: CountryIdService,
    private _driverAccessService: DriverAccessService,
    private _scrollToTop: ScrollToTop,
    private _isTax: TaxService,
    private currency: CurrencyService,
    private apiHandler: ApiHandlerService

  ) {
    this.countryId = this._countryId.getCountryId();
  }

  ngOnInit() {
    this.isTax = this._isTax.getTax();
    this.isTDS = this._isTax.getVat();
    this.getVehicleTypesAndSpecsList();
    this._commonService.getVehicleCatagoryType().subscribe(resp => {
      this.vehicleCategories = resp['result']['categories']
    })
    this.prefixUrl = this._prefixUrl.getprefixUrl();
    this.buildForm();
    this.currency_type = this.currency.getCurrency();
    this.employeeDetails.get('contract_type').setValue('1');
    this.setPhoneCode();
    this._companyModuleService.getPhoneCode().subscribe(result => {
      let codes = [];
      codes = result['results'];
      this.countryPhoneCode = codes.map(code => code.phone_code)
    })
    this._employeeService.getVehicleAssigend().subscribe((data: any) => this.vehicleData = data);
    this._commonService.getStaticOptions('blood-group,employee-designation').subscribe((response: any) => {
      this.designationList = response.result['employee-designation'];
    });
    this._commonService.getStaticOptions('financier,account-type').subscribe((response: any) => {
      this.bankList = response.result['financier'];
      this.accountTypeList = response.result['account-type'];
    });
    this._routeParam.params.subscribe((params: any) => {
      if (params.id) {
        this.employee_id = params.id;
      }

      this.getFormValues();
      this._routeParam.queryParamMap.subscribe((paramMap: ParamMap) => {
        if (paramMap.has('veh_assign')) {
          this.showAssignVehicleSectioon = true
        }
      });

    }


    )

  }

  buildForm() {
    this.employeeDetails = this._fb.group({
      first_name: ['', [Validators.required]],
      employee_id: [''],
      employee_no:[''],
      display_name: ['', [Validators.required, Validators.maxLength(20)]],
      joining_date: [null],
      designation: [null],
      date_of_birth: [null],
      contract_type: [''],
      contact: ['', [Validators.required,TransportValidator.mobileNumberValidator]],
      email_address: ['', [TransportValidator.emailValidator, Validators.maxLength(42)]],
      vehicles_assigned: [[]],
      profile_image: [[]],
      salary : [0],
      contact_country_code: [getCountryCode(this.countryId), [Validators.required]],
      specifications: [[]],
      bank: this._fb.group({
        id: [''],
        bank_name: [
          null,
        ],
        account_holder_name: [
          '',
        ],
        employee: [''],
        account_number: [
          '',
          [
            Validators.maxLength(20)
          ]
        ],
        account_type: [
          null,
        ],
        iban_code: [null, [Validators.maxLength(34), Validators.pattern(this.patterns.ALPHA_NUMERIC)]],
        swift_code: [null, [Validators.maxLength(14), Validators.pattern(this.patterns.ALPHA_NUMERIC)]],
        ifsc_code: [
          null,
          [Validators.pattern(this.patterns.IFSC)]
        ],
        branch: [
          ''
        ],
      }),
      documents: this._fb.array([])

    })
  }

  setPhoneCode() {
    this.initialValues.contact_country_code = { label: getCountryCode(this.countryId) };
    this.employeeDetails.get('contact_country_code').setValue(getCountryCode(this.countryId))
  }
  getNewAccountTypesTypes($event) {
    if ($event) {
      this.initialValues.accountType = {}
      this.getAccountTypes();
      this.initialValues.accountType = { value: $event.id, label: $event.label };
      this.employeeDetails.controls.account_type.setValue($event.id);
    }
  }
  getFormValues() {
    if (this.employee_id) {
      this._editEmployeeService.getAllEditDetails(this.employee_id).subscribe((response) => {
        this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.EMPLOYEE, this.screenType.EDIT, "Navigated");
        this.patchFormValues(response);
        this.profile_img_url = response.profile_image_url;
        this.editDocsData.next(response.documents)
        this.bankDetails = response.bank_details
        if (this.bankDetails['id']) {
          this.employeeDetails.get('bank').setValue(this.bankDetails);
          this.patchBankeName();
          this.patchAccountType();
          this.valueChange();
        }
      });
    } else {
      this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.EMPLOYEE, this.screenType.ADD, "Navigated");
    }
  }
  getAccountTypes() {
    this._commonService.getStaticOptions('account-type').subscribe((response: any) => {
      this.accountTypeList = response.result['account-type'];
    });

  }

  addParamsToAccountType(event) {
    if (event) {
      this.accountTypeParams = {
        key: 'account-type',
        label: event,
        value: 0
      };
    }
  }

  valueChange() {
    if (this.employeeDetails.get('bank').get('account_holder_name').value || this.employeeDetails.get('bank').get('bank_name').value || this.employeeDetails.get('bank').get('account_number').value || this.employeeDetails.get('bank').get('account_type').value || this.employeeDetails.get('bank').get('ifsc_code').value) {
      this.makeMandatory('bank_name');
      this.makeMandatory('account_number')
      this.makeMandatory('account_type')
      this.employeeDetails.get('bank').get('account_holder_name').setValidators([Validators.required, Validators.pattern(this.patterns.ACCOUNT_HOLDER_NAME)]);
      this.employeeDetails.get('bank').get('account_holder_name').updateValueAndValidity();
      this.employeeDetails.get('bank').get('account_number').setValidators([Validators.required, Validators.pattern(this.patterns.NUMBER_ONLY)]);
      this.employeeDetails.get('bank').get('account_number').updateValueAndValidity();
      this.isRequiedForm = true;
    } else {
      this.makeNonMandatory('bank_name');
      this.makeNonMandatory('account_number')
      this.makeNonMandatory('account_type')
      this.makeNonMandatory('account_holder_name');
      this.isRequiedForm = false;
    }
  }

  patchBankeName() {
    if (isValidValue(this.bankDetails.bank_name)) {
      this.initialValues.bankName['label'] = this.bankDetails.bank_name.label;
      this.initialValues.bankName['value'] = this.bankDetails.bank_name.id;
      this.employeeDetails.get('bank').get('bank_name').setValue(this.bankDetails.bank_name.id);
    }
    else {
      this.employeeDetails.get('bank').get('bank_name').setValue(null);
    }
  }

  patchAccountType() {
    if (isValidValue(this.bankDetails.account_type)) {
      this.initialValues.accountType['label'] = this.bankDetails.account_type.label;
      this.initialValues.accountType['value'] = this.bankDetails.account_type.id;
      this.employeeDetails.controls['bank'].get('account_type').setValue(this.bankDetails.account_type.id);
    }
    else {
      this.employeeDetails.controls['bank'].get('account_type').setValue(null);
    }
  }
  makeMandatory(formControlName) {
    this.employeeDetails.get('bank').get(formControlName).setValidators([Validators.required]);
    this.employeeDetails.get('bank').get(formControlName).updateValueAndValidity();

  }


  makeNonMandatory(formControlName) {
    this.employeeDetails.get('bank').get(formControlName).setValidators([Validators.nullValidator]);
    this.employeeDetails.get('bank').get(formControlName).updateValueAndValidity();

  }
  addNewBank(event) {
    if (event) {
      this.addBankParams = {
        key: 'financier',
        label: event,
        value: 0
      };
    }
  }

  getNewBank(event) {
    if (event) {
      this.bankList = [];
      this._commonService.getStaticOptions('financier').subscribe((response: any) => {
        this.initialValues.bankName = {};
        this.bankList = response.result['financier'];
        this.initialValues.bankName = { value: event.id, label: event.label };
        this.employeeDetails.get('bank').get('bank_name').setValue(event.id);
      });
    }
  }

  roundOffValue(formControl) {
    roundOffAmount(formControl);
  }

  patchFormValues(data: any) {
    const employeeData = _.cloneDeep(data);
    this.patchCountryCode(employeeData);
    this.patchDesignation(employeeData);
    this.employeeDetails.patchValue(employeeData);
    this.showAssignVehicleSectioon = data.specifications.some(element => element.isSelected == true);
    data.specifications.forEach((element,ind) => {
      const index = this.vehicleTypeSelection.findIndex(vehicle => vehicle.type === element.type);
      this.vehicleTypeSelection[index].isSelected = data.specifications[ind].isSelected;
      this.vehicleTypeSelection[index].specification = data.specifications[ind].specification;
      this.vehicleTypeSelection[index].type = data.specifications[ind].type;
      this.vehicleTypeSelection[index].specificationList = data.specifications[ind].specificationList;
    });
  }


  patchCountryCode(data) {
    if (data.contact_country_code) {
      this.initialValues.contact_country_code['label'] = data.contact_country_code;
      this.initialValues.contact_country_code['value'] = data.contact_country_code;
      data.contact_country_code = data.contact_country_code
    }
    else {
      this.initialValues.contact_country_code = { label: getCountryCode(this.countryId) }
    }
  }

  patchDesignation(data: any) {
    if (isValidValue(data.designation)) {
      this.initialValues.designation['label'] = data.designation.label;
      this.initialValues.designation['value'] = data.designation.id;
      data.designation = data.designation.id;
    }
  }

  onImageUploaded(files: any) {
  }


  imageUpload(filesUploaded, documentIndex = 0) {
    this.employeeDetails.get('profile_image').setValue(filesUploaded[0].id)
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  setDisplayName() {
    let form = this.employeeDetails;
    form.get('display_name').setValue(form.get('first_name').value)
  }

  checkMobileNumber() {    
    let payload = {
      mobile_no: this.employeeDetails.get('contact').value,
      country_code: this.employeeDetails.get('contact_country_code').value,
    }
    this._driverAccessService.checkDriverMobileNumber(payload).subscribe(resp => {
      if (!resp.result.mobile_unique) {
        this.employeeDetails.controls.contact.markAsTouched()
        this.uniqueMobileerr = 'Number already registered in our system';
        this._scrollToTop.scrollToTop();
      } else {
        this.uniqueMobileerr  = '';
        this._scrollToTop.scrollToTop();
      }
    });
  }
  onDateChange(event) {
    if (this.employee_id) {
      let date = changeDateToServerFormat(event.target.value);
      this._editEmployeeService.editCheckJoiningDate(this.employee_id, date).subscribe((res) => {
      },
        (e) => {
          this.apiError = e.error.message;
        })
    }
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
      this._commonService.getStaticOptions('employee-designation').subscribe((response) => {
        this.initialValues.designation = {};
        this.designationList = response.result['employee-designation'];
        this.initialValues.designation = { value: $event.id, label: $event.label };
        this.employeeDetails.controls.designation.setValue($event.id);
      });
    }
  }


  prepareRequest() {
    let form = this.employeeDetails
    form.value['joining_date'] = changeDateToServerFormat(form.value['joining_date'])
    form.value['documents'].forEach((doc, index) => {
      doc['expiry_date'] = changeDateToServerFormat(doc['expiry_date'])
      doc['issue_date'] = changeDateToServerFormat(doc['issue_date'])
      if (doc['files'].length) {
        doc['files'] = doc['files'].map(file => file.id)
      }
    });
    return form.value
  }

  checkSpecificationSelected() {
    this.vehicleTypeSelection.forEach((ele, ind) => {
      if (ele.isSelected && ele.specification.length == 0) {
        ele.errorMsg = 'Select atleast one Specification';
        ele.isValid = false;
      }
      if (!ele.isSelected && ele.specification.length == 0) {
        ele.errorMsg = '';
        ele.isValid = true;
      }
      if (ele.isSelected && ele.specification.length > 0) {
        ele.errorMsg = '';
        ele.isValid = true;
      }
    })
    this.allSelected = this.vehicleTypeSelection.every(item => item.isValid == true);
  }

  confirmButton(e) {
    if (e) {
      this.submitForm()
    }
  }
  dataSelected(e){    
  }

  checkQualificationofEmp() {
    this.popupInputData.show = false;
    this.popupInputData.msg = '';
    this.checkSpecificationSelected()
    let vehiclesAssigned = this.employeeDetails.get('vehicles_assigned').value;    
    let emp = this.employeeDetails.get('display_name').value
    if (vehiclesAssigned.length>0) {
      let selectedVehicleDetails = this.vehicleData.filter((item) => 
      vehiclesAssigned.some(vehicleItem => vehicleItem.id === item.id));      
      let selectedTypes = this.vehicleTypeSelection.filter((item) => item.isSelected == true);
      let sampleArray:any[] = [];
      let unmatchedSpecs : any = [];
      selectedTypes.forEach((ele)=>{
        selectedVehicleDetails.forEach(element => {
          if(element.vehicle_category===ele.type && ele.specification.includes(element.vehicle_type?.label)){
            sampleArray.push(true);
          }else{
            unmatchedSpecs.push(element);
            sampleArray.push(false);
          }
        });
      })      
      if(sampleArray.every((ele)=>ele==true)){
        this.submitForm();
      }else{
        let commonRegNumbers:any = [];
        const unmatchedVehicles = selectedVehicleDetails.filter(vehicle => {
          return selectedTypes.every(typeObj => typeObj.type != vehicle.vehicle_category);
        });
        unmatchedVehicles.forEach((ele)=>{
          commonRegNumbers.push(ele.reg_number);
        })
        const specUnMatched = selectedVehicleDetails.filter(vehicleDetail => {
          return selectedTypes.every(typeObj => 
            !typeObj.specification.includes(vehicleDetail.vehicle_type?.label)
          );
        });        
        specUnMatched.forEach((ele)=>{
          commonRegNumbers.push(ele.reg_number);
        })
        commonRegNumbers = [...new Set(commonRegNumbers)];
        if(commonRegNumbers.length>0){
          if (this.allSelected) {
            this.popupInputData.show = true;
            this.popupInputData.msg = `${emp} is not qualified to operate ${commonRegNumbers} .`;
          } else {
            this._scrollToTop.scrollToTop();
          }
        }else{
          this.submitForm();
        } 
      }
    }
    else {
      this.submitForm();
    }
  }


  submitForm() {
    let form = this.employeeDetails;
    form.value['vehicles_assigned'] = form.value['vehicles_assigned'].map((ele=>ele?.id))
    if (form.valid) {
      if (this.allSelected) {
        if (this.employee_id) {
          this.apiHandler.handleRequest(this.editEmpService.editEmployeeInformation(this.employee_id, this.prepareRequest()), 'Employee details updated successfully!').subscribe(
            {
              next: () => {
                this._router.navigate([this.prefixUrl + '/onboarding/employee/view', this.employee_id])
              },
              error: (e) => {
                this.setAsTouched(form);
                this._scrollToTop.scrollToTop();
                this.showError(e);
              }
            }
          );
        }
        else {
          this.apiHandler.handleRequest(this._editEmployeeService.addEmployee(this.prepareRequest()), 'Employee details added successfully!').subscribe(
            {
              next: (response) => {
                this._router.navigate([this.prefixUrl + '/onboarding/employee/view'])
              },
              error: (e) => {
                this.setAsTouched(form);
                this._scrollToTop.scrollToTop();
                this.showError(e);
              }
            })

        }
      } else {
        this.setAsTouched(form);
        this._scrollToTop.scrollToTop();
      }
    } else {
      this.isCertificateValid.next(form.valid)
      this.isCertificateTabError = form.get('documents').invalid
      this.setAsTouched(form);
      this._scrollToTop.scrollToTop();
    }
  }

  showError(e) {
    this.apiError = '';
    this.contact_error = '';
    this.display_name_error = '';
    if (e.error.hasOwnProperty("message") && e.error.message == 'Form error') {
      this.apiError = e.error.result.display_name[0];
      this._scrollToTop.scrollToTop();
    }
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


  vehicleChange() {
    if (this.apiError == "This vehicle already exists with other employee") {
      this.apiError = '';
    }
  }


  getVehicleTypesAndSpecsList() {
    this._employeeService.getVehicleSpecsList().subscribe((data) => {
      this.vehicleTypeAndSpecsList = data['result']
    })
  }
  vehicleTypeSelected(id,index,isChecked) {    
    this.vehicleTypeSelection[id].isSelected = !this.vehicleTypeSelection[id].isSelected;
    if (this.vehicleTypeSelection[id].isSelected) {
      this.vehicleTypeSelection[id].specificationList =  this.vehicleTypeAndSpecsList.find(type=>type.type==index)?.specifications;
    } else {
      this.vehicleTypeSelection[id].specificationList = [];
      this.vehicleTypeSelection[id].specification = [];
    }
    this.employeeDetails.get('specifications').setValue(this.vehicleTypeSelection);
    if (isChecked) {
      this.checkSpecificationSelected()
    }
  }


  onModelChange(e) {
    this.employeeDetails.get('specifications').setValue(this.vehicleTypeSelection)
    this.checkSpecificationSelected();
  }

  addPartyToOption(e){
    this.newPartyDetails.next(e)
   }
 
   closePartyPopup(){
     this.showAddPartyPopup={ name: '', status: false };
   }
   addNewParty(e){
     this.showAddPartyPopup=e
   }

}
