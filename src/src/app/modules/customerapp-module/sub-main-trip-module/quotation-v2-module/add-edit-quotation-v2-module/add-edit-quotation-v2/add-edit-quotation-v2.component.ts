import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { getBlankOption, getObjectFromList, isValidValue, trimExtraSpaceBtwWords } from 'src/app/shared-module/utilities/helper-utils';
import { ValidityDateCalculator, changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { NewTripV2Constants } from '../../../new-trip-v2/new-trip-v2-constants/new-trip-v2-constants';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { CommonService } from 'src/app/core/services/common.service';
import { setAsTouched } from 'src/app/shared-module/utilities/form-utils';
import { QuotationV2Service } from '../../../../api-services/trip-module-services/quotation-service/quotation-service-v2';
import { ActivatedRoute, Router } from '@angular/router';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { PartyService } from 'src/app/modules/customerapp-module/api-services/master-module-services/party-service/party.service';
import { ScreenConstants, ScreenType, OperationConstants } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { ErrorList } from 'src/app/core/constants/error-list';
import { cloneDeep } from 'lodash';
import { EmployeeService } from 'src/app/modules/customerapp-module/api-services/master-module-services/employee-service/employee-service';
import { Dialog } from '@angular/cdk/dialog';
import { QuotationV2ValidationPopupComponent } from '../quotation-v2-validation-popup/quotation-v2-validation-popup.component';
import moment from 'moment';
import { CompanyServices } from 'src/app/modules/customerapp-module/api-services/company-service/company-services.service';
import { SiteInspectionServiceService } from 'src/app/modules/customerapp-module/api-services/trip-module-services/site-inspection-service/site-inspection-service.service';
import { getEmployeeObject } from 'src/app/modules/customerapp-module/master-module/employee-module/employee-utils';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';
@Component({
  selector: 'app-add-edit-quotation-v2',
  templateUrl: './add-edit-quotation-v2.component.html',
  styleUrls: ['./add-edit-quotation-v2.component.scss'],
})
export class AddEditQuotationV2Component implements OnInit, OnDestroy {

  constructor(private _fb: FormBuilder, private _quotationV2Service: QuotationV2Service, private _commonService: CommonService, private _route: Router, private _scrollToTop: ScrollToTop,private apiHandler: ApiHandlerService,
    private _partyService: PartyService, private _analytics: AnalyticsService, private commonloaderservice: CommonLoaderService,  private _activateRoute: ActivatedRoute,private _employeeService:EmployeeService,
    private dialog : Dialog, private _companyService:CompanyServices,private _siteInspectionService : SiteInspectionServiceService) { }


	saveButton: boolean = false;
  quotationForm: UntypedFormGroup;
  isFormValidclientFright = new Subject();
  isFormValid = new Subject();
  quotationId = '';
  showAddPartyPopup: any = { name: '', status: false };
  partyNamePopup: string = '';
  customerNameList = [];
  validityTerms = [];
  payementTermUrl = TSAPIRoutes.quotation + 'payment-term/'
  payementTermsParms = {}
  payementTermList = [];
  bankList = [];
  constantsTripV2 = new NewTripV2Constants()
  preFixUrl = getPrefix();
  initialValues = {
    customer: {},
    payementTerms: {},
    validity_term: {},
    employee_in_charge:{},
    bank: getBlankOption(),
    siteInspectionNo : getBlankOption(),
    typeOfMovement : getBlankOption(),
    poc: getBlankOption(),
  }
  clinetFreightValues;
  goThroughDetais = {
    show: false,
    url: "https://demo.arcade.software/lYimjVv1eM1D2myZMl8P?embed%22"
  }
  movementTypes = [
    {
      label : 'Import',
      value : '1'
    },
    {
      label : 'Export',
      value : '2'
    },    {
      label : 'Local',
      value : '3'
    },    {
      label : 'Cross Border',
      value : '4'
    },
  ]

  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  analyticsType = OperationConstants;
  customerDetails: any;
  apiError = ''
  globalFormErrorList: any = [];
  possibleErrors = new ErrorList().possibleErrors;
  errorHeaderMessage = new ErrorList().headerMessage;
  isCatagorySelected = false;
  quotationDetails:any='';
  employeeList=[];
  isCustomerChanged=false;
  isApprovalConfigured : boolean;
  validationDetailsList : any[];
  heading_text : string = '';
  is_Submit : boolean ;
  type_of_save :any ;
  areCertificatesExpired : boolean;
  isCustomerRateCardExisted : boolean;
  grace_period_expired : any;
  creditLimit :any
  dataForSubmission :any;
  failedValidations = []
  totalValue :any;
  canBeInDraft: boolean = true;
  checkCreditLimit: boolean = true;
  partyRateCardvalues = {
    rental_charges : {},
    additional_charges : {}
  } ;
  rentalChargesArray : any = [];
  additionalCharges : any[] = [];
  vehicleCategiriesObj={
    hasMultipleCategories:false,
    categories:[]
  };
  vehicleAndDriverData: any = {
    vehicle : [],
    driver :  [],
    customer : []
  };

  documentExpiryData=new Subject();
  siteInspectionList = [];
  isPartyApproverRequired=false;
  isPartyApproverAvailable:boolean = true;
  partyApproverErrorMesg={
    validation:'Party Approver',
     message:'Please add a Party Approver before proceeding',
     action_key:'stop_quote_create',
  }
  isLinkedClicked=false;
  pointOfContactsList = [];
  pocURL = '';
  pocParam = {};
  
  ngOnDestroy(): void {
    this.commonloaderservice.getShow()
  }
  ngOnInit(): void {
    this.commonloaderservice.getHide();
    this.buildForm();
    this.getPartyTripDetails();
    this.getBank();
    this.getStaticOptions();
    this.getPayementTermList();
    this.getEmployeeWithoutDriver();
    this.getValidationDetils();
  }

  ngAfterViewInit(): void {
    this._activateRoute.params.subscribe(prams => {
      if (prams['quotation-id']) {
      this.quotationId = prams['quotation-id']
      this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.QUOTATION, this.screenType.EDIT, "Navigated");
      this.getQuotationDetails();
      this._commonService.getVehicleCatagoryType().subscribe(resp=>{
        this.vehicleCategiriesObj.hasMultipleCategories=resp['result']['has_multiple_categories']
        this.vehicleCategiriesObj.categories=resp['result']['categories']
        if([0,3].some(value => this.vehicleCategiriesObj.categories.includes(value))){
          this.vehicleCategiriesObj.hasMultipleCategories=true
        }
      })
      } else {
        this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.QUOTATION, this.screenType.ADD, "Navigated");
        this._commonService.getSuggestedIds('quotation').subscribe((response) => {
          this.quotationForm.controls['quotation_no'].setValue(response.result['quotation']);
        });
        this._commonService.getVehicleCatagoryType().subscribe(resp=>{
          this.vehicleCategiriesObj.hasMultipleCategories=resp['result']['has_multiple_categories']
          this.vehicleCategiriesObj.categories=resp['result']['categories']
          if([0,3].some(value => this.vehicleCategiriesObj.categories.includes(value))){
            this.vehicleCategiriesObj.hasMultipleCategories=true
          }
          if(this.vehicleCategiriesObj.categories.includes(1)){
            this.quotationForm.get('vehicle_category').setValue('1')
            this.getApprovalLevelDetails('',1);
            this.isCatagorySelected = true;
            return
          }
          if(this.vehicleCategiriesObj.categories.includes(2)){
            this.quotationForm.get('vehicle_category').setValue('2')
            this.getApprovalLevelDetails('',2);
            this.isCatagorySelected = true;
            return
          }
          if(this.vehicleCategiriesObj.categories.includes(0)|| this.vehicleCategiriesObj.categories.includes(0)){
            this.quotationForm.get('vehicle_category').setValue('0')
            this.getApprovalLevelDetails('',0);
            this.isCatagorySelected = true;
            return
          }
        })
      }
    })
  }
  handleEmployeeChange(){
    let empId=this.quotationForm.get('employee_in_charge').value;
    let empObj=getEmployeeObject(this.employeeList,empId);
    this.initialValues.employee_in_charge={label:empObj?.display_name,value:empId}

  }
  getValidationDetils(){
    this._quotationV2Service.getValidationDetails().subscribe((res)=>{
      this.validationDetailsList = res['result'];
    })
  }

  getApprovalLevelDetails(lastestBy: string = "",category){
    this._quotationV2Service.getApprovalLevelDetails(lastestBy,category).subscribe((res)=>{
      this.isApprovalConfigured = res['result'].is_approval_configured
      if(res['result'].approvals.find(ele=>ele.id == "party_approver")){
        this.isPartyApproverRequired=true
      }
    })
  }

  getDefaultBank(id) {
    let params = {
      is_account: 'False',
      is_tenant: 'False',
      remove_cash_account: 'True'
    }
    this._quotationV2Service.getDefaultBank(id, params).subscribe((data) => {
      this.initialValues.bank = getBlankOption();
      if(data['result']){
        this.quotationForm.get('bank_account').setValue(data['result'].id);
        this.initialValues.bank['label'] = data['result'].name
        this.initialValues.bank['value'] = data['result'].id
      }
    })
  }

  openGothrough() {
    this.goThroughDetais.show = true;
  }

  buildForm() {
    this.quotationForm = this._fb.group({
      id: [null],
      vehicle_category: ['', [Validators.required]],
      customer: ['', [Validators.required]],
      quotation_no: [''],
      quote_date: [new Date(dateWithTimeZone()), [Validators.required]],
      validity_term: ['', [Validators.required]],
      validity_date: [null, [Validators.required]],
      payment_term: [null],
      bank_account: [null],
      employee_in_charge: '',
      ref_no: '',
      site_inspection_no : [null],
      type_of_movement : [null],
      poc : null,
    })
    
  }

  getSiteInspectionList() {
    let customer = this.quotationForm.get('customer').value;
    this._siteInspectionService.getApprovedSiteInspection(customer, this.quotationForm.get('vehicle_category').value).subscribe((data) => {
      this.siteInspectionList = data.result
    })
  }

  getPartyTripDetails() {
    this._quotationV2Service.getCustomerList().subscribe(data => {
      this.customerNameList = data['result'];
    })
  }

  getEmployeeWithoutDriver(){
    this._employeeService.getEmployeeList({no_drivers:true}).subscribe(resp=>{
      this.employeeList = resp
    })
  }

  getStaticOptions() {
    this._quotationV2Service.getStaticOptions('item-unit,quotation-validity-term').subscribe((response: any) => {
      this.validityTerms = response.result['quotation-validity-term'];
      this.quotationForm.get('validity_term').setValue(this.validityTerms[1].id);
      this.initialValues.validity_term = this.validityTerms[1];
      this.setValidityDate()
    });
  }

  addPartyToOption($event) {
    this.isCustomerChanged=true
    if ($event.status) {
      this.initialValues.customer = { value: $event.id, label: $event.label };
      this.quotationForm.get('customer').setValue($event.id);
      this.getPartyTripDetails();
      this.isCustomerChanged=false
    }

  }

  closePartyPopup() {
    this.showAddPartyPopup = { name: '', status: false };
  }


  saveQuotation(type: string, heading,isSubmit) {
    this.type_of_save = type;
    this.heading_text = heading;
    this.is_Submit = isSubmit;
    let form = this.quotationForm;  
    form.value['saving_as'] = type;  
    if(Number(form.value['vehicle_category'])===0){
      if (form.valid && form.value['truck']['is_freight_vaild'] && form.value['truck']['is_other_charges_valid'] ) {
         this.vehicleCatagoryOthersAsve(cloneDeep(form.value))
         if(type=== 'save_and_submit' || type === 'send_for_approval'){
          this.checkingForvalidation();
        }else{
          this.dataForSubmission['approval_remark']=''
         this.saveApi(this.dataForSubmission)
        } 
      }else{
        this.isFormValid.next(form.valid)
        setAsTouched(form);
        this.setFormGlobalErrors();
        this._scrollToTop.scrollToTop();
      }
    }else{
      if (form.valid) {
        if(Number(form.value['vehicle_category'])===1){
          this.vehicleCatagoryCrane(cloneDeep(form.value))
        }
        if(Number(form.value['vehicle_category'])===2){
          this.vehicleCatagoryAWP(cloneDeep(form.value))
        }
        if(type=== 'save_and_submit' || type === 'send_for_approval'){
          this.checkingForvalidation();
        }else{
          this.dataForSubmission['approval_remark']=''
          this.saveApi(this.dataForSubmission)
        }  
      } else {
        this.isFormValid.next(form.valid)
        setAsTouched(form);
        this.setFormGlobalErrors();
        this._scrollToTop.scrollToTop();
      }
    }
   
  }

  setFormGlobalErrors() {
    this.globalFormErrorList = [];
    let errorIds = Object.keys(this.possibleErrors);
    for (let prop of errorIds) {
      const error = this.possibleErrors[prop];
      if (error.status == true) {
        this.globalFormErrorList.push(error.message);
      }
    }
  }


  saveApi(payload) {
    let category = Number(payload['vehicle_category']);
    if(category >0){
      payload['type_of_movement'] = 0;
    }
    if(this.quotationId){
      this.apiHandler.handleRequest(this._quotationV2Service.putQuotation(this.quotationId,payload),'Quotation updated successfully!').subscribe(
        {
          next: (data) => {
            this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.QUOTATION, this.screenType.EDIT, "Quotation Updated");
            this._route.navigateByUrl(this.preFixUrl + "/trip/quotation/details/" + data['result']);
            },
            error: () => {
            this.apiError = 'Failed to update  Quotation!';
            setTimeout(() => (this.apiError = ''), 3000);
            },
        }
      )

    }else{
      this.apiHandler.handleRequest( this._quotationV2Service.postQuotation(payload),'Quotation added successfully!').subscribe(
        {
          next: (data) => {
            this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.QUOTATION, this.screenType.ADD, "Quotation Created");
            this._route.navigateByUrl(this.preFixUrl + "/trip/quotation/details/" + data['result']);
            },
            error: () => {
            this.apiError = 'Failed to add  Quotation!';
            setTimeout(() => (this.apiError = ''), 3000);
            },
        }
      )
    }
   
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  openAddPartyModal($event) {
    if ($event) {
      this.showAddPartyPopup = { name: this.partyNamePopup, status: true };
    }

  }

  addValueToPartyPopup(event) {
    if (event) {
      this.partyNamePopup = event;

    }
  }

  onvendorSelected(id) {    
    this.isCustomerChanged=true
    this.isLinkedClicked=false;
    this.quotationForm.patchValue({
      quote_date: new Date(dateWithTimeZone()),
      validity_date: null,
      bank_account: null,
      employee_in_charge: '',
      validity_term: this.validityTerms[1].id,
      ref_no: '',
      site_inspection_no: null,
      type_of_movement : 1,
      poc : null,
    })
    this.setValidityDate();
    this.initialValues.bank=getBlankOption();
    this.initialValues.typeOfMovement = this.movementTypes[0]
    this.initialValues.validity_term = getBlankOption()
    this.initialValues.siteInspectionNo = getBlankOption();
    this.initialValues.employee_in_charge =getBlankOption();
    this.initialValues.poc = getBlankOption();
    this._partyService.getPartyAdressDetails(id).subscribe((response) => {
      this.customerDetails = response['result']
      this.isCustomerChanged=false
      if(isValidValue(this.customerDetails?.party_approver)){
        this.isPartyApproverAvailable=true 
      }else{
        this.isPartyApproverAvailable=false 
      }
      this.initialValues.validity_term =new Object(this.validityTerms[1]);
      this.patchInitialDetailsOnVendorSelection();
    });
    this.getDocsExpiryLIst();
    this.getSiteInspectionList();
    this.getPointOfContactsList(id);

  }

  getpartyDetails(customer) {
    this._partyService.getPartyAdressDetails(customer).subscribe((response) => {
      if(isValidValue(response['result']?.party_approver)){
        this.isPartyApproverAvailable=true 
      }else{
        this.isPartyApproverAvailable=false 
      }
    });
  }

  patchInitialDetailsOnVendorSelection() {
    let customer = this.quotationForm.get('customer').value;
    if(this.customerDetails.sales_person_name?.id){
      this.quotationForm.get('employee_in_charge').patchValue(this.customerDetails.sales_person_name?.id);
      this.initialValues.employee_in_charge={value:this.customerDetails.sales_person_name?.id,label:this.customerDetails.sales_person_name?.name}
    }
    if (this.customerDetails.terms?.id) {
      this.initialValues.payementTerms = {};
      this.quotationForm.get('payment_term').setValue('');
      this.initialValues.payementTerms = this.customerDetails.terms
      this.quotationForm.get('payment_term').setValue(this.customerDetails.terms?.id ? this.customerDetails.terms.id : "")
    }
    else {
      this.initialValues.payementTerms = this.payementTermList[0];
      this.quotationForm.get('payment_term').setValue(this.payementTermList[0].id)
    }
    this.getDefaultBank(customer)
  }


  setValidityDate() {

    const validity_term = this.quotationForm.get('validity_term').value;
    let item = getObjectFromList(validity_term, this.validityTerms);
    let quotationDate = this.quotationForm.get("quote_date").value;
    let da = ValidityDateCalculator(new Date(quotationDate), item.value);
    this.quotationForm.get('validity_date').setValue(da);
  }

  addRemoveValidators(form: AbstractControl, key: string, ValidatorsList: Array<any>) {
    form.get(key).setValidators(ValidatorsList);
    form.get(key).updateValueAndValidity();
  }

  onValidityDateChange() {
    let item = this.validityTerms.filter((item: any) => item.label == 'Custom')[0]
    this.quotationForm.get('validity_term').setValue(item.id)
    this.initialValues.validity_term = { label: item.label, value: item.id };
  }

  addPayementTerm(event) {
    if (event) {
      const val = trimExtraSpaceBtwWords(event);
      const arrStr = val.toLowerCase().split(' ');
      const titleCaseArr: string[] = [];
      for (const str of arrStr) {
        titleCaseArr.push(str.charAt(0).toUpperCase() + str.slice(1));
      }
      const word_joined = titleCaseArr.join(' ');
      this.payementTermsParms = {
        name: word_joined
      };
    }
  }

  getPayementTerm(event) {
    if (event) {
      this.getPayementTermList();
      this.quotationForm.controls['payment_term'].setValue(event.id)
    }
  }

  getPayementTermList() {
    this._commonService.getStaticOptions('payment-term').subscribe((response) => {
      this.payementTermList = response.result['payment-term'];
      this.initialValues.payementTerms = this.payementTermList[0];
      this.quotationForm.get('payment_term').setValue(this.payementTermList[0].id)
    });
  }

  getBank() {
    this._quotationV2Service.getBankDropDownList().subscribe((response: any) => {
      this.bankList = response.result;
    });
  }

  prepareRequest(formValue) {
    formValue['quote_date'] = changeDateToServerFormat(formValue['quote_date'])
    formValue['validity_date'] = changeDateToServerFormat(formValue['validity_date'])
    return formValue
  }

  vehicleCatagoryChange(val) {
    this.quotationForm.get('vehicle_category').setValue(val)
    this.isCatagorySelected = true;
    this.isPartyApproverRequired=false;
    this.isPartyApproverAvailable = true;
    this.resetQuotationHeaderForm()
    this.getApprovalLevelDetails('',val);
  }


  resetQuotationHeaderForm() {
    let category = Number(this.quotationForm.get('vehicle_category').value);
    this.quotationForm.patchValue({
      customer: null,
      quote_date: new Date(dateWithTimeZone()),
      validity_date: null,
      bank_account: null,
      employee_in_charge: '',
      validity_term: this.validityTerms[1]?.id,
      ref_no: '',
      site_inspection_no: null,
      type_of_movement : category ==0 ?  null : 0,
      poc : null,
    })
    this.initialValues.customer=getBlankOption();
    this.initialValues.bank=getBlankOption();
    this.initialValues.validity_term=getBlankOption();
    this.initialValues.siteInspectionNo = getBlankOption();
    this.initialValues.typeOfMovement = getBlankOption();
    this.initialValues.poc = getBlankOption();
    setTimeout(() => {
      this.initialValues.validity_term =new Object(this.validityTerms[1]);
    }, 100);
    this.initialValues.employee_in_charge =getBlankOption();
    this.pointOfContactsList = [];
    this.setValidityDate()
    this.getDocsExpiryLIst();
    this.addRemoveValidators(this.quotationForm, 'type_of_movement',category == 0 ? [Validators.required]: [Validators.nullValidator])
  }


  vehicleCatagoryOthersAsve(formValue){
    formValue['quote_date'] = changeDateToServerFormat(formValue['quote_date'])
    formValue['validity_date'] = changeDateToServerFormat(formValue['validity_date'])
    formValue['truck']['path'] = formValue['truck']['start_end_destination']
    formValue['truck']['materials'] = formValue['truck']['materials']['materials']
    delete formValue['truck']['start_end_destination'];
    delete formValue['truck']['materials']['materials'];
    this.dataForSubmission = formValue;
  }

  vehicleCatagoryCrane(formValue){
    formValue['quote_date'] = changeDateToServerFormat(formValue['quote_date'])
    formValue['validity_date'] = changeDateToServerFormat(formValue['validity_date'])
    formValue['crane']['rental_charge']['no_of_shifts'] =Number(formValue['crane']['rental_charge']['no_of_shifts'])==1?0:1
    formValue['crane']['additional_charge'] =formValue['crane']['additional_charge'].filter(item => item.is_checked==true)
    formValue['crane']['additional_charge'].forEach(item =>{
      item['name'] = item['name'].id;
      item['unit_of_measurement']= item['unit_of_measurement'] ? item['unit_of_measurement'].id : null;
    })
    this.dataForSubmission = formValue;
    this.rentalChargesArray = formValue['crane']['rental_charge']['rental_charges'];
    this.additionalCharges = formValue['crane']['additional_charge'];
    let totals :number[] = [];
    let total_amount1 = Number(formValue['crane']['crane_calculations']?.['quotation_total']['daily_with_fuel_total_with_vat']);
    let total_amount2 = Number(formValue['crane']['crane_calculations']?.['quotation_total']['daily_without_fuel_total_with_vat']);
    let total_amount3 = Number(formValue['crane']['crane_calculations']?.['quotation_total']['monthly_with_fuel_total_with_vat']);
    let total_amount4 = Number(formValue['crane']['crane_calculations']?.['quotation_total']['monthly_without_fuel_total_with_vat']);
    let total_amount5 = Number(formValue['crane']['crane_calculations']?.['quotation_total']['weekly_with_fuel_total_with_vat']);
    let total_amount6 = Number(formValue['crane']['crane_calculations']?.['quotation_total']['weekly_without_fuel_total_with_vat']);
    totals = [...totals,total_amount1,total_amount2,total_amount3,total_amount4,total_amount5,total_amount6];
    this.totalValue = Math.max(...totals);    
  }

  vehicleCatagoryAWP(formValue){
    formValue['quote_date'] = changeDateToServerFormat(formValue['quote_date'])
    formValue['validity_date'] = changeDateToServerFormat(formValue['validity_date'])
    formValue['awp']['rental_charge']['no_of_shifts'] =Number(formValue['awp']['rental_charge']['no_of_shifts'])==1?0:1
    formValue['awp']['additional_charge'] =formValue['awp']['additional_charge'].filter(item => item.is_checked==true)
    formValue['awp']['additional_charge'].forEach(item =>{
      item['name']=item['name'].id;
      item['unit_of_measurement'] = item['unit_of_measurement'] ? item['unit_of_measurement'].id : null;
    })
    this.dataForSubmission = formValue;
    this.rentalChargesArray = formValue['awp']['rental_charge']['rental_charges'];
    this.additionalCharges = formValue['awp']['additional_charge'];
    let totals :number[] = [];
    let total_amount1 = Number(formValue['awp']['awp_calculations']?.['quotation_total']['daily_with_fuel_total_with_vat']);
    let total_amount2 = Number(formValue['awp']['awp_calculations']?.['quotation_total']['daily_without_fuel_total_with_vat']);
    let total_amount3 = Number(formValue['awp']['awp_calculations']?.['quotation_total']['monthly_with_fuel_total_with_vat']);
    let total_amount4 = Number(formValue['awp']['awp_calculations']?.['quotation_total']['monthly_without_fuel_total_with_vat']);
    let total_amount5 = Number(formValue['awp']['awp_calculations']?.['quotation_total']['weekly_with_fuel_total_with_vat']);
    let total_amount6 = Number(formValue['awp']['awp_calculations']?.['quotation_total']['weekly_without_fuel_total_with_vat']);
    totals = [...totals,total_amount1,total_amount2,total_amount3,total_amount4,total_amount5,total_amount6];
    this.totalValue = Math.max(...totals);
    
  }
  getQuotationDetails(){
     this._quotationV2Service.getQuotationEditDetails(this.quotationId).subscribe(resp=>{
      this.quotationDetails =resp['result']
      this.canBeInDraft = this.quotationDetails.can_be_in_draft
      this.patchQuotationHeader();
      this.getApprovalLevelDetails(this.quotationDetails.created_at,this.quotationDetails['vehicle_category']);
     })
  }

  patchQuotationHeader(){
   if(this.quotationDetails.customer){
    this.initialValues.customer={label:this.quotationDetails.customer.display_name,value:''};
    this.quotationDetails.customer =this.quotationDetails.customer.id;    

   } 
   if(this.quotationDetails.bank_account){
    this.initialValues.bank={label:this.quotationDetails.bank_account.name,value:''};
    this.quotationDetails.bank_account =this.quotationDetails.bank_account.id
   } 
   if(this.quotationDetails.validity_term){
    this.initialValues.validity_term={label:this.quotationDetails.validity_term.label,value:''}
    this.quotationDetails.validity_term =this.quotationDetails.validity_term.id
   } 

   if(this.quotationDetails.payment_term){
    this.initialValues.payementTerms={label:this.quotationDetails.payment_term.label,value:''}
    this.quotationDetails.payment_term =this.quotationDetails.payment_term.id
   } 

   if(this.quotationDetails.employee_in_charge){
    this.initialValues.employee_in_charge={label:this.quotationDetails.employee_in_charge.display_name,value:''}
    this.quotationDetails.employee_in_charge=this.quotationDetails.employee_in_charge.id
   }   
   if(this.quotationDetails.site_inspection_no){
    this.initialValues.siteInspectionNo={label:this.quotationDetails.site_inspection_no.site_inspection_no,value:''}
    this.quotationDetails.site_inspection_no=this.quotationDetails.site_inspection_no.id
   } 
   if(this.quotationDetails.type_of_movement){
    let res = this.movementTypes.find(ele=>ele.label == this.quotationDetails.type_of_movement);
    this.initialValues.typeOfMovement = res;
    this.quotationDetails.type_of_movement = res.value;
   }   
   if(this.quotationDetails.poc){
    this.initialValues.poc = {label : this.quotationDetails?.poc?.display_name , value : this.quotationDetails?.poc?.id};
    this.quotationDetails.poc = this.quotationDetails?.poc?.id;
   }   
   this.quotationForm.patchValue(this.quotationDetails)
   this.isCatagorySelected =true;
   this.getDocsExpiryLIst();
   this.getSiteInspectionList();
   this._quotationV2Service.getPointOfContactsList(this.quotationDetails.customer).subscribe((response) => {
    this.pointOfContactsList = response['result'];
   })
  }
 
  checkingForvalidation(){        
    this.failedValidations = [];
    let stoppedValidations = [];
    let category = Number(this.quotationForm.get('vehicle_category').value);
    if(this.isApprovalConfigured){
      this.validationDetailsList.forEach((data)=>{
        if(data.validation_key.includes('customer_credit_limit')){
          if(this.checkCreditLimit && Number(this.creditLimit) < Number(this.totalValue)){
            this.failedValidations.push(data);
          }
          if(this.checkCreditLimit && Number(this.creditLimit) < Number(this.totalValue) && data.action_key ==='stop_quote_create'){
            stoppedValidations.push(true)
          }
        } 
        if(data.validation_key.includes('customer_document')){
          if(this.areCertificatesExpired){
            this.failedValidations.push(data);
          }if(this.areCertificatesExpired && data.action_key ==='stop_quote_create'){
            stoppedValidations.push(true)
          }
        }  
        if((category==1 || category ==2) &&  data.validation_key.includes('customer_rate_card')){
          if(!this.isCustomerRateCardExisted){
            this.failedValidations.push(data);
          }if(!this.isCustomerRateCardExisted && data.action_key ==='stop_quote_create'){
            stoppedValidations.push(true)
          }
        }   
        if(data.validation_key.includes('customer_grace_period')){
          if(this.grace_period_expired){
            this.failedValidations.push(data);
          }if(this.grace_period_expired && data.action_key ==='stop_quote_create'){
            stoppedValidations.push(true)
          }
        }
        if(data.validation_key.includes('rate') && category !=0 && !(category >2)){
          const paths = [
            'daily.without_fuel',
            'daily.with_fuel',
            'daily.additional_hours',
            'weekly.without_fuel',
            'weekly.with_fuel',
            'weekly.additional_hours',
            'monthly.without_fuel',
            'monthly.with_fuel',
            'monthly.additional_hours',
          ];
          category !=3 && this.rentalChargesArray.forEach(element => {
            if(Object.keys(this.partyRateCardvalues['rental_charges']).includes(element.specification)){
              paths.forEach(path => {
                let str1 = path.split('.')[0];
                let str2 = path.split('.')[1];
                if( Number(element[str1][str2]) < Number(this.partyRateCardvalues['rental_charges'][element.specification][str1][str2]) &&   !this.failedValidations.some(ele => ele.id === data.id)){
                  this.failedValidations.push(data);
                  if (data.action_key === 'stop_quote_create') {
                    stoppedValidations.push(true);
                  }
                }              
              });
            }
          });
          this.additionalCharges.forEach(element => {           
            if(element.is_checked && Object.keys(this.partyRateCardvalues['additional_charges']).includes(element.name)){
              if(Number(element.unit_cost) < Number(this.partyRateCardvalues['additional_charges'][element.name]) &&    !this.failedValidations.some(ele => ele.id === data.id)){                
                this.failedValidations.push(data)
                if (data.action_key === 'stop_quote_create') {
                  stoppedValidations.push(true);
                }
              }
            }
          });
        }
      })
      if(this.isPartyApproverRequired&&!this.isPartyApproverAvailable){
        this.failedValidations.push(this.partyApproverErrorMesg)
         stoppedValidations.push(true);
      }
      if(this.failedValidations.length>0 && stoppedValidations.length>0){
        this.is_Submit = false;
        this.heading_text ='Validation Failed';
        this.openValidationPopup(this.dataForSubmission)
      }else if(this.failedValidations.length>0 && stoppedValidations.length == 0){
        this.is_Submit = true;
        this.heading_text ='Send Approval';
        this.dataForSubmission['saving_as'] = 'send_for_approval';
        this.openValidationPopup(this.dataForSubmission)
      }else if(this.failedValidations.length == 0 && this.is_Submit){
        this.openValidationPopup(this.dataForSubmission)
      }
      else{
        this.dataForSubmission['approval_remark']=''
        this.saveApi(this.dataForSubmission)
      }
    }else{
      this.dataForSubmission['approval_remark']=''
      this.saveApi(this.dataForSubmission)
    }

  }

  openValidationPopup(formdata){
      const dialogRef = this.dialog.open(QuotationV2ValidationPopupComponent, {
        data : {
          data : this.failedValidations,
          heading :this.heading_text,
          is_Submit : this.is_Submit
        },
        width: '500px',
        maxWidth: '90%',
        closeOnNavigation: true,
        disableClose: true,
        autoFocus: false
      });
      let dialogRefSub = dialogRef.closed.subscribe((item: any) => {      
        if(isValidValue(item) && item.is_approved){
          formdata['approval_remark'] = item.remarkValue
          this.saveApi(formdata)
        }
        dialogRefSub.unsubscribe();
      });
  }

  quotationFinalValues(e){
    this.totalValue = e.total
  }

  partyPrefilledRateCardValues(e){
    this.partyRateCardvalues = e;
  }

  customerRateCardExisted(rateCards:any[]){    
    this.isCustomerRateCardExisted = rateCards.every(ratecard=> ratecard === true);
  }

  getDocsExpiryLIst() {
    let quotationDate = this.quotationForm.get('quote_date').value;
    quotationDate = moment(quotationDate).format('YYYY-MM-DD');
    let customerId = this.quotationForm.get('customer').value;
    if(isValidValue(customerId)){
      this.vehicleAndDriverData = {
        customer : [ { date : quotationDate, id : customerId }],
      }    
      this._companyService.getExpiryDocs(this.vehicleAndDriverData).subscribe((res)=>{
        this.areCertificatesExpired = res['result']['customer'].expired_count >0 ;
        this.grace_period_expired = res['result']['customer'].grace_period_expired;
        this.creditLimit = res['result']['customer'].credit_remaining;
        this.checkCreditLimit = res['result']['customer'].check_credit_limit;   
        this.documentExpiryData.next(res)  
      })  
    }else{
      this.documentExpiryData.next(null)
    }
  }
  linkClicked(){
    this.isLinkedClicked=true;
  }

  getAddedPoC(event) {    
    if (event) {
      this.pointOfContactsList = [];
      this.quotationForm.get('poc').setValue(null);
      this.initialValues.poc = getBlankOption();
      this._quotationV2Service.getPointOfContactsList(this.quotationForm.get('customer').value).subscribe((response) => {
        this.quotationForm.get('poc').setValue(event.id);
        this.pointOfContactsList = response.result;
        this.initialValues.poc = {
          label: event.label,
          value: event.id
        };
      });
    }
  }

  addNewPoC(event) {
    this.pocURL = `report/party/poc/${this.quotationForm.get('customer').value}/`;
    this.pocParam = {
      name: event
    }; 
  }

  getPointOfContactsList(id) {
    this._quotationV2Service.getPointOfContactsList(id).subscribe((response) => {
      this.pointOfContactsList = response['result'];
      let defaultPOC = this.pointOfContactsList.find(poc=>poc.default==true)
      this.quotationForm.get('poc').setValue(defaultPOC?.id);
      this.initialValues.poc = {
        label : defaultPOC?.display_name,
        value : defaultPOC?.id
      }
    })
  }

}
