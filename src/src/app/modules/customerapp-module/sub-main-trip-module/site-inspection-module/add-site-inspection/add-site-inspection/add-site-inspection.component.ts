import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { SiteInspectionServiceService } from '../../../../api-services/trip-module-services/site-inspection-service/site-inspection-service.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { RateCardService } from 'src/app/modules/customerapp-module/api-services/master-module-services/rate-card-service/rate-card.service';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { setAsTouched, setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { CompanyModuleServices } from 'src/app/modules/customerapp-module/api-services/company-service/company-module-service.service';
import { PhoneCodesFlagService } from 'src/app/core/services/phone-code_flag.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { CommonService } from 'src/app/core/services/common.service';
import { getBlankOption, isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { cloneDeep } from 'lodash';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { VehicleService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/vehicle.service';
import { QuotationV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/quotation-service/quotation-service-v2';
import { WorkOrderV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/work-order-service/work-order-v2.service';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';


@Component({
  selector: 'app-add-site-inspection',
  templateUrl: './add-site-inspection.component.html',
  styleUrls: ['./add-site-inspection.component.scss']
})
export class AddSiteInspectionComponent implements OnInit, OnDestroy, AfterViewInit {
  siteInspectionForm: FormGroup
  isInspectionFormSelected = false
  preFixUrl = getPrefix()
  apiError = ''
  initialValues = {
    customer: {},
    zone: {},
    area: {},
    inspectionName : getBlankOption(),
    contactName: {},
    countryCode: {},
    siteInspectionfrom: getBlankOption(),
    inspectedBy: {},
    siteInspectionfromValue: {},
    inspectedByValue: {},
    specification: []
  };
  inspectionsList = [];
  showAddPartyPopup: any = { name: '', status: false };
  partyNamePopup: string = '';
  customerNameList = [];
  isLocationValid = new BehaviorSubject(true);
  markForTouched = new Subject();
  isInspectionCheckListmandatory = new Subject();
  zonesList = [];
  contactPersonList = [];
  countryPhoneCodeList = [];
  defaultPhoneFlag = {
    code: '',
    flag: ''
  }
  siteInspectionFrom = [
    {
      label: 'Quotation',
      value: 0

    },
    {
      label: 'Sales Order',
      value: 1

    },
    {
      label: 'Reference No',
      value: 3

    },
    {
      label: 'N/A',
      value: 2

    }
  ]

  inspectedBy = [
    {
      label: 'Inhouse',
      value: 0

    },
    {
      label: 'Third Party',
      value: 1

    },
    {
      label: 'N/A',
      value: 2

    }
  ]
  activeUsers = [];
  currentUser: any;
  isCustomerChanged = false;
  quotationList = [];
  salesOrderList = [];
  specificationList = [];
  quotationListOrsalesOrderList = [];
  vechileSpecifications = []
  siteInspectionId = ''
  inspectionDetails=null;
  areaList=[]
  fromQuoteOrSales : boolean = false;
  isStatusRequired : boolean = false;
  isRemarkRequired : boolean = false;
  isLocationRequired : boolean = true;
  settingsRoute = '/organization_setting/settings/site-inspection/custom-field';
  inspectionScreen = 'Site';
  apiUrl = new Subject();
  formNameApi='vehicle-inspection-form-name'
  pattern = new ValidationConstants().VALIDATION_PATTERN;
  inspectionPermission = Permission.siteInspection.toString().split(',')[3];
  vehicleCategiriesObj={
    hasMultipleCategories:false,
    categories:[1,2]
  }
  

  constructor(private _fb: FormBuilder, private _siteInspectionServiceService: SiteInspectionServiceService, 
    private _rateCard: RateCardService, private _route: Router, private _scrollToTop: ScrollToTop, private _vehicleService: VehicleService,
    private _companyModuleService: CompanyModuleServices, private _phone_codes_flag_service: PhoneCodesFlagService,
    private _commonService: CommonService, private _loader: CommonLoaderService, private _activateRoute: ActivatedRoute,private apiHandler: ApiHandlerService,
    private _quotationV2Service: QuotationV2Service,private _workOrderV2Service: WorkOrderV2Service,private _commonservice:CommonService) { }

  ngOnInit(): void {
    this.defaultPhoneFlag = this._phone_codes_flag_service.phoneCodesFlag;
    this.initialValues.countryCode = { label: this.defaultPhoneFlag.code, value: this.defaultPhoneFlag.code }
    this.buildForm();
    this.getPartyTripDetails();
    this.getPhoneCountryCode();
    this.getAreaList();
    this.getZoneList();
    this.getInspectionFormNamesList();
    this._loader.getHide();
  }

  ngOnDestroy(): void {
    this._loader.getShow();
  }

  ngAfterViewInit(): void {
    this._activateRoute.params.subscribe(prams => {
      if (prams['siteinspection-id']) {
        this.siteInspectionId = prams['siteinspection-id']
        this.getSiteInspectionDetails();
        this._commonservice.getVehicleCatagoryType().subscribe(resp => {
          this.vehicleCategiriesObj.categories = resp['result']['categories']
        })
      }else{
        this.getSiteInspectionNumber()
        this.getUserList();
        this.getZonesList();
      }
    })
    this._activateRoute.queryParamMap.subscribe((paramMap: ParamMap) =>{
      if (paramMap.has('quotationId')) {
        this._quotationV2Service.getQuotationDetails(paramMap.get('quotationId')).subscribe(resp => {
				  setTimeout(() => {
            this.patchValuesWithQuotationOrSalesOrder(resp['result'],true)
          }, 260);
        })
			}
			if (paramMap.has('salesOrderId')) {
        this._workOrderV2Service.getWorkOrderDetails(paramMap.get('salesOrderId')).subscribe(resp => {          
          setTimeout(() => {
					  this.patchValuesWithQuotationOrSalesOrder(resp['result'],false)
          }, 260);
        })
          
			}
    })

  

  }


  buildForm() {
    this.siteInspectionForm = this._fb.group({
      id: [null],
      form_name : [null],
      is_approved: null,
      inspection_date: [new Date(dateWithTimeZone()), Validators.required],
      vehicle_category: ['', [Validators.required]],
      customer: ['', [Validators.required]],
      zone: '',
      location: this._fb.group({
        name: [''],
        lng: '',
        lat: '',
        alias: ''
      }),
      area: ['',[Validators.required]],
      contact_name: '',
      contact_no: this._fb.group({
        number: '',
        flag: this.defaultPhoneFlag.flag,
        code: this.defaultPhoneFlag.code,
      }),
      inspection_from: this._fb.group({
        type: [2,Validators.required],
        id: '',
        name:'',
        na:'',
      }),
      inspected_type: this._fb.group({
        type: [null, Validators.required],
        id: '',
        name: '',
        na: ''
      }),
      site_inspection_no: ['', [Validators.required]],
      specification: this._fb.array([]),
      inherited_specification: this._fb.array([]),
      remark : ['']
    })
    this.siteInspectionForm.get('is_approved').valueChanges.subscribe((data)=>{
      if(isValidValue(data)){
        this.isRemarkRequired = true;
        setUnsetValidators(this.siteInspectionForm,'remark',[Validators.required])
      }
      
    })
  }

  headReset() {
    this.siteInspectionForm.patchValue({
      customer: '',
    });
    this.initialValues.customer = getBlankOption();
    this.reSetForm()
  }

  reSetOnCustomerChange() {
    this.reSetForm()
  }
  onInspectionSelected(){
    this.isInspectionFormSelected = true;
    let inspectionFormId = this.siteInspectionForm.get('form_name').value;
    this.apiUrl.next(`revenue/site_detail/setting/form/${inspectionFormId}/`)
  }


  reSetForm() {
    console.log('reset', this.currentUser);
    this.siteInspectionForm.patchValue({
      inspection_date: new Date(dateWithTimeZone()),
      zone: '',
      contact_name: '',
    });
    this.siteInspectionForm.get('area').reset();
    this.siteInspectionForm.get('location').reset();
    this.siteInspectionForm.get('inspection_from').reset();
    this.patchCurrentUser();
    this.siteInspectionForm.get('contact_no').patchValue({
      number: '',
      flag: this.defaultPhoneFlag.flag,
      code: this.defaultPhoneFlag.code,
    })
    this.initialValues.contactName = getBlankOption();
    this.initialValues.zone = getBlankOption();
    this.initialValues.inspectedBy = this.inspectedBy[0];
    this.initialValues.siteInspectionfrom = getBlankOption();
    this.initialValues.siteInspectionfromValue = getBlankOption();
    this.initialValues.countryCode = { label: this.defaultPhoneFlag.code, value: this.defaultPhoneFlag.code }
  }

  patchValuesWithQuotationOrSalesOrder(data,isFromQuotation){    
      this.fromQuoteOrSales = true
      if(data['customer']){
        this.initialValues.customer={label:data['customer']?.display_name ? data['customer']?.display_name : data['customer']?.name,value:data['customer']['id']}
      }
      let customer = data['customer']['id'];
      this.siteInspectionForm.get('customer').setValue(customer)
      let categories = [
        {
          label : 'Crane',
          value : 1
        },
        {
          label : 'AWP',
          value : 2
        },
        {
          label : 'Others',
          value : 0
        }
      ]
      let value ;
      if(isFromQuotation){
        let type = categories.filter((ele)=>ele.label === data['vehicle_category']);        
        this.siteInspectionForm.get('vehicle_category').setValue(type[0].value);
        value = 0;
      }else{
        this.siteInspectionForm.get('vehicle_category').setValue(data['vehicle_category']);
        value = 1;
      }
      this.isInspectionFormSelected =true;
      this.isCustomerChanged=true;
      this.reSetOnCustomerChange();
      if (customer) {
        let contactPersonList = cloneDeep(this.customerNameList.filter(party => party.id == customer))
        if (contactPersonList.length) {
          this.contactPersonList = contactPersonList[0].contact_person
        }
      }
      this.inspectionDetails=null;    
      this._siteInspectionServiceService.getQuotationSalesOrder(customer, this.siteInspectionForm.get('vehicle_category').value).subscribe(resp => {
        this.quotationList = resp['result']['quotation'];      
        this.salesOrderList = resp['result']['salesorder']
        this.quotationListOrsalesOrderList = []
        this.isCustomerChanged = false;
        this.siteInspectionForm.get('inspection_from.type').setValue(value)
        this.initialValues.siteInspectionfrom = {label :  isFromQuotation ? 'Quotation': 'Sales Order', value : value};
        this.siteInspectionfromChange();
        this.siteInspectionForm.get('inspection_from.id').setValue(data.id);
        this.initialValues.siteInspectionfromValue = { label : isFromQuotation ? data.quotation_no : data.workorder_no, value  : data.id}
        this.siteInspectionfromValueChange();
        setTimeout(() => {
          this.siteInspectionForm.get('is_approved').setValue(null)
        }, 1000);
      })
  }

  patchCurrentUser(){
    this.initialValues.inspectedByValue = getBlankOption();    
    if (this.currentUser) {
      this.siteInspectionForm.get('inspected_type').patchValue({
        type: 0, id: this.currentUser.id, name: this.currentUser.display_name
      });
      this.initialValues.inspectedByValue = {
        value: this.currentUser.id,
        label: this.currentUser.display_name
      };      
    } else {
      this.siteInspectionForm.get('inspected_type').patchValue({
        type: 0, id: '', name: ''
      });
      this.initialValues.inspectedByValue = getBlankOption();
    }

  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  getInspectionFormNamesList(){
    this._siteInspectionServiceService.getSiteInspectionforms().subscribe((response) => {      
      this.inspectionsList = response.result;
    });
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

  addPartyToOption($event) {
    if ($event.status) {
      this.initialValues.customer = { value: $event.id, label: $event.label };
      this.siteInspectionForm.get('customer').setValue($event.id);
      this.inspectionDetails=null;
      this.getPartyTripDetails();
    }

  }

  getPartyTripDetails() {
    this._siteInspectionServiceService.getCustomerList().subscribe(data => {
      this.customerNameList = data['result'];
    })
  }

  getUserList() {
    this._companyModuleService.getActiveUsers().subscribe((response) => {
      this.activeUsers = response.result['users'];
      this.currentUser = response.result['current_user'];      
      this.siteInspectionForm.get('inspected_type').patchValue({
        type: 0, id: this.currentUser.id, name: this.currentUser.display_name
      });
      setTimeout(() => {
        this.patchCurrentUser();
      }, 500);
    })
  }

  closePartyPopup() {
    this.showAddPartyPopup = { name: '', status: false };
  }

  getZonesList() {
    this._rateCard.getZonesList().subscribe((res) => {
      this.zonesList = res['result'].zone
    })
  }


  locationSelected(e) {
    this.siteInspectionForm.get('location').patchValue(e['value'])
  }

  setContactPerson(contactPerson: string) {
    let contact_no = this.siteInspectionForm.get('contact_no') as AbstractControl;
    if (contactPerson.trim()) {
      this.siteInspectionForm.get('contact_name').setValue(contactPerson);
      setUnsetValidators(contact_no, 'number', [Validators.required, Validators.pattern(this.pattern.PHONE_NUMBER_NULL_10)]);
      this.initialValues.contactName = new Object({ label: contactPerson, value: contactPerson });
    } else {
      setUnsetValidators(contact_no, 'number', [Validators.nullValidator, Validators.pattern(this.pattern.PHONE_NUMBER_NULL_10)]);
      contact_no.get('code').setValue(this.defaultPhoneFlag.code)
      contact_no.get('number').setValue('');
      this.siteInspectionForm.get('contact_name').setValue('')
      this.initialValues.countryCode = { label: this.defaultPhoneFlag.code, value: this.defaultPhoneFlag.code }
      this.initialValues.contactName = new Object({ label: '', value: '' });
    }

  }

  onContactPersonSelection(contactPerson: string) {

    let contact_no = this.siteInspectionForm.get('contact_no') as AbstractControl;
    if (contactPerson.trim()) {
      setUnsetValidators(contact_no, 'number', [Validators.required]);
    } else {
      setUnsetValidators(contact_no, 'number', [Validators.nullValidator, Validators.pattern(this.pattern.PHONE_NUMBER_NULL_10)]);
    }
    let contactDetails = this.contactPersonList.filter(contact => contact.name == contactPerson)[0];
    this.initialValues.contactName = { label: contactPerson, value: contactPerson }
    this.initialValues.countryCode = { label: contactDetails.country_code, value: contactDetails.country_code }
    contact_no.get('code').setValue(contactDetails.country_code);
    contact_no.get('number').setValue(contactDetails.contact_number);
    let flag = this.countryPhoneCodeList.filter(codeFlag => codeFlag.phone_code == contact_no.value['code'])[0].flag_url
    contact_no.get('flag').setValue(flag)
  }

  getPhoneCountryCode() {
    this._companyModuleService.getPhoneCode().subscribe(result => {
      this.countryPhoneCodeList = result['results'];
    });
  }

  onCountryCodeSelection(form: AbstractControl) {
    let contact_no = form.get('contact_no')
    let flag = this.countryPhoneCodeList.filter(codeFlag => codeFlag.phone_code == contact_no.value['code'])[0].flag_url
    contact_no.get('flag').setValue(flag)
    this.initialValues.countryCode = { label: contact_no.value['code'], value: contact_no.value['code'] }
  }

  siteInspectionfromChange() {
    this.siteInspectionForm.get('inspection_from.id').setValue('')
    this.siteInspectionForm.get('inspection_from.name').setValue('')
    this.patchOrResetLocationDetails('',true)
    this.initialValues.siteInspectionfromValue = getBlankOption();
    const type = this.siteInspectionForm.get('inspection_from.type').value
    if (Number(type) == 0) {
      this.quotationListOrsalesOrderList = this.quotationList      
      setUnsetValidators(this.siteInspectionForm.get('inspection_from'), 'id', [Validators.required])
      setUnsetValidators(this.siteInspectionForm.get('inspection_from'), 'name', [Validators.nullValidator])
    } else if (Number(type) == 1) {
      setUnsetValidators(this.siteInspectionForm.get('inspection_from'), 'name', [Validators.nullValidator])
      this.quotationListOrsalesOrderList = this.salesOrderList
      setUnsetValidators(this.siteInspectionForm.get('inspection_from'), 'id', [Validators.required])

    }else if(Number(type) == 3){
      setUnsetValidators(this.siteInspectionForm.get('inspection_from'), 'name', [Validators.required])
      setUnsetValidators(this.siteInspectionForm.get('inspection_from'), 'id', [Validators.nullValidator])
    }
     else {
      setUnsetValidators(this.siteInspectionForm.get('inspection_from'), 'name', [Validators.nullValidator])
      this.quotationListOrsalesOrderList = []
      setUnsetValidators(this.siteInspectionForm.get('inspection_from'), 'id', [Validators.nullValidator])

    }
    this.buildSpecifications([])
    this.specificationList = []

  }
  inspectedByChange() {
    this.initialValues.inspectedByValue = getBlankOption();
    this.siteInspectionForm.get('inspected_type').patchValue({
      name: '',
      id: ''
    })
    const type = this.siteInspectionForm.get('inspected_type.type').value
    if (Number(type) == 0) {
      setUnsetValidators(this.siteInspectionForm.get('inspected_type'), 'id', [Validators.required])
      setUnsetValidators(this.siteInspectionForm.get('inspected_type'), 'name', [Validators.nullValidator])
    } else if (Number(type) == 1) {
      setUnsetValidators(this.siteInspectionForm.get('inspected_type'), 'name', [Validators.required])
      setUnsetValidators(this.siteInspectionForm.get('inspected_type'), 'id', [Validators.nullValidator])

    } else {
      setUnsetValidators(this.siteInspectionForm.get('inspected_type'), 'id', [Validators.nullValidator])
      setUnsetValidators(this.siteInspectionForm.get('inspected_type'), 'name', [Validators.nullValidator])

    }
  }

  getSiteInspectionNumber() {
    this._commonService.getSuggestedIds('siteinspection').subscribe((response) => {
      this.siteInspectionForm.controls['site_inspection_no'].setValue(response.result['siteinspection']);
    });
  }


  onvendorSelected() {
    this.isCustomerChanged = true;
    this.reSetOnCustomerChange();
    this.initialValues.siteInspectionfrom = { label : 'N/A',value : 2};
    this.siteInspectionForm.get('inspection_from.type').setValue(2)
    let customer = this.siteInspectionForm.get('customer').value;
    if (customer) {
      let contactPersonList = cloneDeep(this.customerNameList.filter(party => party.id == customer))
      if (contactPersonList.length) {
        this.contactPersonList = contactPersonList[0].contact_person
      }
    }
    this.inspectionDetails=null;    
    this._siteInspectionServiceService.getQuotationSalesOrder(customer, this.siteInspectionForm.get('vehicle_category').value).subscribe(resp => {
      this.quotationList = resp['result']['quotation'];      
      this.salesOrderList = resp['result']['salesorder']      
      this.quotationListOrsalesOrderList = []
      this.isCustomerChanged = false;
    })
  }

  buildSpecifications(items = []) {
    const specification = this.siteInspectionForm.controls['specification'] as FormArray
    specification.controls = [];
    this.initialValues.specification = []
    items.forEach(item => {
      const specification = this.siteInspectionForm.controls['specification'] as FormArray
      specification.push(this.defaultSpecifications(item))
      this.initialValues.specification.push({ label: item, value: item })
    });
    if (items.length == 0) {
      this.addSpecifications();
    }
    const inherited_specification = this.siteInspectionForm.controls['inherited_specification'] as FormArray
    inherited_specification.controls = [];
    items.forEach(item => {
      inherited_specification.push(this.defaultSpecifications(item))
    })

  }

  defaultSpecifications(item) {
    return this._fb.group({
      name: [item || null]
    })
  }

  addSpecifications() {
    const specification = this.siteInspectionForm.controls['specification'] as FormArray
    specification.push(this.defaultSpecifications(null))
    this.initialValues.specification.push(getBlankOption())

  }

  removeSpecifications(i) {
    const specification = this.siteInspectionForm.controls['specification'] as FormArray
    specification.removeAt(i)
    this.initialValues.specification.splice(i, 1)


  }

  siteInspectionfromValueChange() {
    const value = this.siteInspectionForm.get('inspection_from.id').value
    let quotationOrSalesObj = null
    quotationOrSalesObj = this.quotationListOrsalesOrderList.find(list => list.id == value)
    if (quotationOrSalesObj) {
      this.specificationList = quotationOrSalesObj['specification'].map(specification => specification['name'])
      this.buildSpecifications(this.specificationList)
     this.patchOrResetLocationDetails(quotationOrSalesObj)
    } else {
      this.buildSpecifications([])
      this.specificationList = []

    }

  }

  patchOrResetLocationDetails(quotationOrSalesObj,isReset=false){
    if(isReset){
      this.initialValues.zone = {}
      this.siteInspectionForm.get('zone').setValue(null)
      this.initialValues.area = {}
      this.siteInspectionForm.get('area').reset()
      this.siteInspectionForm.get('location').reset()
    }else{
      let area = this.areaList.find(area=>area.id==quotationOrSalesObj['area']);
      this.initialValues.area = { label: area?.label, value: quotationOrSalesObj['area'] }
      this.siteInspectionForm.get('area').setValue(quotationOrSalesObj['area'])
      this.initialValues.zone = { label: quotationOrSalesObj['zone']?.name, value: '' }
      this.siteInspectionForm.get('zone').setValue(quotationOrSalesObj['zone']['id'])
      this.siteInspectionForm.get('location').patchValue({
        lat : quotationOrSalesObj['location']['lat'] || '',
        lng : quotationOrSalesObj['location']['lng'] || '',
        alias :quotationOrSalesObj['location']['alias'] || '',
        name : quotationOrSalesObj['location']['name'] || ''
      })
    }
  }

  saveSiteInspection(isStatusMandatory) {
    let form = this.siteInspectionForm;
    let formValue = cloneDeep(form.value)
    if(isStatusMandatory){
      formValue['saving_as'] = 'save_and_submit';
      setUnsetValidators(form,'is_approved',[Validators.required]);
      this.isStatusRequired = true;
      this.isLocationRequired = true;
      this.isInspectionCheckListmandatory.next(true)
    }else{
      this.isStatusRequired = false;
      this.isInspectionCheckListmandatory.next(false);
      formValue['saving_as'] = 'save_and_schedule';
      setUnsetValidators(form,'is_approved',[Validators.nullValidator]);
      this.isLocationRequired = false;
      this.isLocationValid.next(true)
    }
    formValue['inspection_date'] = changeDateToServerFormat(formValue['inspection_date'])
    formValue['specification'] = formValue['specification'].map(specification => specification['name']).filter(val => val != null)
    formValue['inherited_specification'] = formValue['inherited_specification'].map(specification => specification['name']).filter(val => val != null)
    formValue['site_details'] = this.formatSiteDetails(formValue['site_details']['site_details'])
    if (formValue['vehicle_category']) {
      if (form.valid) {
        if(this.siteInspectionId){
          this.apiHandler.handleRequest(this._siteInspectionServiceService.putSiteInspection(this.siteInspectionId,formValue),'Site Inspection updated successfully!').subscribe(
            {
              next: (resp) => {
                this._route.navigate([this.preFixUrl + '/trip/site-inspection/view', resp['result']['id']])
                },
                error: () => {
                 this.apiError = 'Failed to update  Site Inspection!';
                 setTimeout(() => (this.apiError = ''), 3000);
                },
            }
          )
        }else{
          this.apiHandler.handleRequest( this._siteInspectionServiceService.postSiteInspection(formValue),'Site Inspection added successfully!').subscribe(
            {
              next: (resp) => {
                this._route.navigate([this.preFixUrl + '/trip/site-inspection/view', resp['result']['id']])
              },
                error: () => {
                 this.apiError = 'Failed to add  Site Inspection!';
                 setTimeout(() => (this.apiError = ''), 3000);
                },
            }
          )
        }
      } else {
        this.markForTouched.next(true)
        this.isLocationValid.next(form.get('location').valid)
        setAsTouched(form);
        this._scrollToTop.scrollToTop()
      }
    }
  }


  formatSiteDetails(inspectionDetails = []) {
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


  getVehicleSpecifications() {
    this._vehicleService.getVehicleSpecifications(this.siteInspectionForm.get('vehicle_category').value).subscribe((response: any) => {
      this.vechileSpecifications = response.result.map(specification => specification.specification);
    });
  }

  getSiteInspectionDetails() {
    this._siteInspectionServiceService.getSiteInspectionDetails(this.siteInspectionId).subscribe(resp => {
      this.patchHeader(resp['result'])
    })
  }

  patchHeader(data){
    if(isValidValue(data['form_name'])){
      this.initialValues.inspectionName.label = data['form_name']['label'];
      this.initialValues.inspectionName.value = data['form_name']['id'];
      data['form_name'] = data['form_name']['id'];
    }
    if(data['customer']){
      this.initialValues.customer={label:data['customer']['name'],value:''}
      data['customer']=data['customer']['id']
    }
    if(data['inspected_type']){
      this.initialValues.inspectedBy = this.inspectedBy.find(inspected=>inspected.value==data['inspected_type']['type'])
      if(data['inspected_type']['type']!=2)
      this.initialValues.inspectedByValue={label: data['inspected_type']['name']}
    }
    if(data['zone']){
      this.initialValues.zone = {label:data['zone']['name'],value:''}
      data['zone']=data['zone']['id']
    }
    this.initialValues.area = {label:data['area']?.['label'],value:''}
    data['area'] = data['area']?.id
    if(data['inspection_from']){
      this.initialValues.siteInspectionfrom = this.siteInspectionFrom.find(inspectionFrom=>inspectionFrom.value==data['inspection_from']['type'] )
      if(data['inspection_from']['type']!=2)
      this.initialValues.siteInspectionfromValue={label: data['inspection_from']['name']}
    }    
    this.siteInspectionForm.patchValue(data)
    this.patchSpecification(data)
    let customer = this.siteInspectionForm.get('customer').value;
    if (customer) {
      let contactPersonList = cloneDeep(this.customerNameList.filter(party => party.id == customer))
      if (contactPersonList.length) {
        this.contactPersonList = contactPersonList[0].contact_person
      }
    }
    this._siteInspectionServiceService.getQuotationSalesOrder(customer, this.siteInspectionForm.get('vehicle_category').value).subscribe(resp => {
      this.quotationList = resp['result']['quotation'];
      this.salesOrderList = resp['result']['salesorder']
      this.quotationListOrsalesOrderList = []
      if(data['inspection_from']['type'] ==0){
        this.quotationListOrsalesOrderList = this.quotationList
      }else{
        this.quotationListOrsalesOrderList = this.salesOrderList
      }
    })
    this._companyModuleService.getActiveUsers().subscribe((response) => {
      this.activeUsers = response.result['users'];
      this.currentUser = response.result['current_user'];
    });
    this.isInspectionFormSelected =true;
    this.isCustomerChanged=true;
    this.inspectionDetails=data['site_details'];
    this.initialValues.contactName = {label:data['contact_name'],value:''}
    this.initialValues.countryCode={label:data['contact_no']['code'],value:''}
    setTimeout(() => {
      this.isCustomerChanged=false;
    }, 1000);
  }

  getZoneList(){
    this._rateCard.getZonesList().subscribe((res) => {
      this.zonesList = res['result'].zone
    })
  }

  getAreaList(){
    this._commonService.getStaticOptions('area').subscribe((response) => {
      this.areaList = response.result['area'];
    });
  }

  patchSpecification(data){
    const specification = this.siteInspectionForm.controls['specification'] as FormArray
    specification.controls = [];
    this.initialValues.specification = []
    data['specification'].forEach(item => {
      const specification = this.siteInspectionForm.controls['specification'] as FormArray
      specification.push(this.defaultSpecifications(item))
      this.initialValues.specification.push({ label: item, value: item })
    });
    if (data['specification'].length == 0) {
      this.addSpecifications();
    }
    const inherited_specification = this.siteInspectionForm.controls['inherited_specification'] as FormArray
    inherited_specification.controls = [];
    data['inherited_specification'].forEach(item => {
      inherited_specification.push(this.defaultSpecifications(item))
    })
    this.specificationList= data['inherited_specification']
    this.getVehicleSpecifications();


  }
}


