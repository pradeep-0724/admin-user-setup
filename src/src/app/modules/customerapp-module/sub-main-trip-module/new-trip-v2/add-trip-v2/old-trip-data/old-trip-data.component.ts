import { Dialog } from '@angular/cdk/dialog';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, UntypedFormGroup, UntypedFormArray, UntypedFormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { cloneDeep, isArray } from 'lodash';
import moment from 'moment';
import { Subject } from 'rxjs';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { ScreenConstants, ScreenType, OperationConstants } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { CommonService } from 'src/app/core/services/common.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { PartyService } from 'src/app/modules/customerapp-module/api-services/master-module-services/party-service/party.service';
import { NewTripV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/trip-service/new-trip-v2.service';
import { CompanyTripGetApiService } from 'src/app/modules/customerapp-module/revenue-module/trip-module/company-vehicle-module/company-trip-class/company-trip-service.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { changeDateTimeToServerFormat, changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { getBlankOption, trimExtraSpaceBtwWords } from 'src/app/shared-module/utilities/helper-utils';
import { AddMarketVehiclePopupComponent } from '../../add-market-vehicle-popup/add-market-vehicle-popup/add-market-vehicle-popup.component';
import { NewTripV2Constants } from '../../new-trip-v2-constants/new-trip-v2-constants';
import { NewTripV2DataService } from '../../new-trip-v2-dataservice';
import { ToolTipInfo } from '../../new-trip-v2-utils/new-trip-v2-utils';
type workOrderFrightDataType = {
  freight_amount: number | string,
  freight_type: number | string,
  rate: number | string,
  total_units: number | string,
}
@Component({
  selector: 'app-old-trip-data',
  templateUrl: './old-trip-data.component.html',
  styleUrls: ['./old-trip-data.component.scss']
})
export class OldTripDataComponent implements OnInit , AfterViewInit ,OnDestroy{

  constantsTripV2 = new NewTripV2Constants()
  addTrip: FormGroup;
  apiError: string = '';
  vehicleList = [];
  isTransporterTrip: boolean = false;
  partyList = [];
  gstin: string = '';
  vehicleNamePopup: string = '';
  postDriverAPI: any = TSAPIRoutes.lorrychallan_driver;
  showAddPartyPopup: any = { name: '', status: false };
  addDriverParams: any = {};
  partyNamePopup: string = '';
  transporterDriverList = [];
  employeeList = [];
  vendor = false;
  vehicleprovider = "Vehicle Provider";
  billingParty = "Billing Party";
  partyType: any;
  partyListVendor = [];
  ismultipleDestinationFormValid = new Subject();
  driverId = new Subject();
  routeId = new Subject();
  initialDetails = {
    driver: getBlankOption(),
    vehicle: getBlankOption(),
    customer: getBlankOption(),
    vehicle_provider: getBlankOption(),
    route_code: getBlankOption(),
    workOrder: getBlankOption(),
  }
  isAllFormValid = {
    clientFright: true,
    vehicleFreight: true,
    multipleDestination: true,
    driverAllowance: true,
    customField: true
  }
  isAllFormValidError = {
    clientFright: true,
    vehicleFreight: true,
    multipleDestination: true,
    driverAllowance: true,
    customField: true
  }
  isFormValidDriverAllowance = new Subject();
  isFormValidvehicleFreight = new Subject();
  isFormValidclientFright = new Subject();
  isFormValidCustomField = new Subject();
  routeDestinations = new Subject();
  customerId = new Subject();
  preFixUrl = '';
  contactPersonList = [];
  routeCodeList = [];
  driverList=[];
  workOrderToolTip: ToolTipInfo;
  tripToolTip: ToolTipInfo;
  routeToolTip: ToolTipInfo;
  customFieldToolTip:ToolTipInfo;
  vehicleType: string = '  ';
  workOrderList = [];
  popupWorkOrderInputData = {
    'msg': '',
    'type': 'warning-work-order',
    'show': false,
  }
  workOrderTripDetails = {};
  workOrderClientFrightData: Subject<workOrderFrightDataType> = new Subject();
  deFaultWorkOrderFreight = {
    freight_amount: 0.000,
    freight_type: 7,
    rate: 0.000,
    total_units: 0.000,
  }
  popupWorkOrderInputDataSave = {
    'msg': '',
    'type': 'warning-work-order',
    'show': false,
  }
  isDisableBillingTypes = false
  goThroughDetais = {
    show: false,
    url: "https://demo.arcade.software/ljKsSnQjmBBz2cJWMFjO?embed%22"
  };
  docToolTip: ToolTipInfo;  
  tripDocuments=[];
  documents=[];
  analyticsScreen=ScreenConstants;
  screenType=ScreenType;
  analyticsType= OperationConstants;
  vehicleAndDriverData:any;
  displayDocsSection:boolean=false;
  creditRemaining={
    credit_remaining:0,
    check_credit:false
  };
  customerDetails:any;
  creditLimit={
    open:false,
    msg:''
  }

  creditOnsaveLimit={
    open:false,
    msg:''
  }
  currency_type;
  selectedOptions ={
    customer : getBlankOption(),
    vehicle : getBlankOption(),
  }



  constructor(private _fb: FormBuilder,
    private _companyTripGetApiService: CompanyTripGetApiService,
    private _commonservice: CommonService,
    private _newTripService: NewTripV2Service,
    private _route: Router,
    private _newTripDataService: NewTripV2DataService,
    private route: ActivatedRoute,
    private _scrollToTop:ScrollToTop,
    private _partyService: PartyService,
    private currency: CurrencyService,
    private _analytics:AnalyticsService,
    private commonloaderservice :CommonLoaderService,
    private dialog : Dialog
  ) {
  }

  ngOnDestroy(): void {
    this.commonloaderservice.getShow();
  }


  ngAfterViewInit(): void {
    this.route.queryParamMap.subscribe((paramMap: ParamMap) => {      
      if (paramMap.has('customerId') && paramMap.has('workOrderId')) {
        setTimeout(() => {
          this.patchCustomerAndWorkOrder(paramMap.get('customerId'), paramMap.get('workOrderId'))
        }, 100);
      }else if(paramMap.has('bdpCustomerId') && paramMap.has('bdpRouteCode') && paramMap.has('tenderNumber') ){
        setTimeout(() => {
          this.patchCustomerAndRouteCodeAndTenderNumber(paramMap.get('bdpCustomerId'), paramMap.get('bdpRouteCode'),paramMap.get('tenderNumber'))
        }, 100);
      }
      else if (paramMap.has('vehicleId')){
        this.getPartyTripDetails();
        this.patchVehicleNumber(paramMap.get('vehicleId'))
      }
      
      else {
        this.getPartyTripDetails();
      }
    });
  }

  ngOnInit(): void {
    this.commonloaderservice.getHide();
    this.buildTripForm();
    this.getVehicleList();
    this.getTripId();
    this.getDriverList();
    this.currency_type = this.currency.getCurrency();
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.NEWTRIP,this.screenType.ADD,"Navigated");
    this.preFixUrl = getPrefix();
    this._newTripDataService.newRouteName.subscribe((routeName: string) => {
      if (routeName) {
        this.addTrip.get('route_code').setValue(routeName);
        this.initialDetails.route_code = { label: routeName, value: routeName };
        this.routeId.next(routeName)
      }
    });
     this._newTripDataService.newUpdateRoute.subscribe((update: boolean) => {
      if (update) {
        this.addTrip.get('update_route').setValue(update);
      }
    });
    this.workOrderToolTip = {
      content: this.constantsTripV2.toolTipMessages.WORK_ORDER.CONTENT

    }
    this.tripToolTip = {
      content: this.constantsTripV2.toolTipMessages.TRIP_NUMBER.CONTENT
    }
    this.routeToolTip = {
      content: this.constantsTripV2.toolTipMessages.ROUTE.CONTENT
    }
    this.customFieldToolTip = {
      content: this.constantsTripV2.toolTipMessages.CUSTOM_FIELD.CONTENT
    }
    this.docToolTip = {
      content: this.constantsTripV2.toolTipMessages.TRIP_DOCUMENT.CONTENT
    }
  }

  buildTripForm() {
    this.addTrip = this._fb.group({
      c_vehicle: [null],
      driver: '',
      customer: ['', [Validators.required]],
      vehicle_provider: '',
      trip_id: '',
      is_transporter: false,
      lr_no: '',
      route_code: '',
      bdp_tender_number:'',
      update_route: false,
      client_freights: [[]],
      path: [[]],
      driver_allowances: [[]],
      work_order_no: '',
      vehicle_freights: [[]],
      other_details: [[]],
      documents:[[]]
    })
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }
  openAddVehicle(event) {    
    const dialogRef = this.dialog.open(AddMarketVehiclePopupComponent, {
      data : {
        name : this.vehicleNamePopup,
      },
      width: '800px',
      maxWidth: '90%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((item: any) => {      
      if(item.isValid){
        this.addNewVehicle(item)
      }else{
        this.initialDetails.vehicle = getBlankOption()
        this.initialDetails.vehicle.label = this.selectedOptions.vehicle.label;
        this.initialDetails.vehicle.value = this.selectedOptions.vehicle.value;
        this.addTrip.get('c_vehicle').setValue(this.selectedOptions.vehicle.value);
      }
      dialogRefSub.unsubscribe();
    });

  }

  addNewVehicle(newVehicleData) {
      this._companyTripGetApiService.getVehicleNewTripList(vehicleList => {
        this.vehicleList = vehicleList;
        this.addTrip.get('c_vehicle').setValue(newVehicleData.id);
        this.initialDetails.vehicle = { value: '', label: newVehicleData.reg_number };
        this.onVehicleChange()
      });
  }
  
  prefillDriverSelf(e) {
    if(e)
    this.driverId.next(e)
    this.getDocsExpiryLIst()
  }

  getDocsExpiryLIst(){
    let ids=[];
    if( this.addTrip.get('driver').value!=null){
      this.addTrip.get('driver').value.map((ele)=>ids.push(ele.id))
    }
    this.displayDocsSection=this.addTrip.get('c_vehicle').value.length>0 || ids.length>0
    this.vehicleAndDriverData={
      vehicle:this.addTrip.get('c_vehicle').value,
      drivers:ids
    }

  }

  addValueToVehiclePopUp(event) {    
    if (event) {
      const val = trimExtraSpaceBtwWords(event);
      const arrStr = val.toLowerCase().split(' ');
      const titleCaseArr: string[] = [];
      for (const str of arrStr) {
        titleCaseArr.push(str.charAt(0).toUpperCase() + str.slice(1));
      }
      const word_joined = titleCaseArr.join(' ').toUpperCase();
      this.vehicleNamePopup = word_joined;
    }
  }

  onVehicleChange() {
    let options =  this.vehicleList.filter((item)=>item.id ==this.addTrip.get('c_vehicle').value)[0];
    this.selectedOptions.vehicle.label = options.reg_number;
    this.selectedOptions.vehicle.value = options.id;
    this.vehicleType = ''
    let vehicleId = this.addTrip.get('c_vehicle').value;
    this.addTrip.get('driver').setValue(null);
    let selectedVehicle = [];
    this.addTrip.get('vehicle_provider').setValue(null)
    selectedVehicle = this.vehicleList.filter(item => item.id == vehicleId);
    this.isTransporterTrip = selectedVehicle[0].is_transporter;
    this.addTrip.get('is_transporter').setValue(this.isTransporterTrip)
    if (this.isTransporterTrip) {
      setUnsetValidators(this.addTrip,'vehicle_provider',[Validators.required])
    } else {
      setUnsetValidators(this.addTrip,'vehicle_provider',[Validators.nullValidator])
    }
    if (selectedVehicle[0].driver_id) {
      this.driverId.next(selectedVehicle[0].driver_id)
      this.addTrip.get('driver').setValue([{id:selectedVehicle[0].driver_id,first_name: selectedVehicle[0].driver_name}]);
    } else {
      setTimeout(() => {
        this.addTrip.get('driver').setValue(selectedVehicle[0]['market_driver']);
      }, 100);
    }
    if (!this.isTransporterTrip && this.addTrip.controls.c_vehicle.valid) {
      this.vehicleType = 'Own Vehicle';
    }
    if (this.isTransporterTrip && this.addTrip.controls.c_vehicle.valid) {
      this.vehicleType = 'Market Vehicle';
    }
    this.getDocsExpiryLIst()
  }

  openAddPartyModal($event, type) {
    if ($event) {
      if (type == 'client') {
        this.vendor = false;
      } else {
        this.vendor = true;
      }
      this.showAddPartyPopup = { name: this.partyNamePopup, status: true };
    }
    else {
      this.showAddPartyPopup = { name: this.partyNamePopup, status: true }
    }
  }


  
  fileUploader(e){
    e.forEach(element => {
      let docs={
        document:element.id,
        note:''
      }
      this.documents.push(docs);
      element['presigned_url']=element['url']
      this.tripDocuments.push(element);
      this.addTrip.get('documents').setValue(this.documents)
    });
  }

  fileDeleted(id){
    this.tripDocuments =  this.tripDocuments.filter(doc=>doc.id !=id);
    this.documents =  this.documents.filter(doc=>doc.document !=id);
    this.addTrip.get('documents').setValue(this.documents)
  }

  closePartyPopup() {
    this.showAddPartyPopup = { name: '', status: false };
    this.vendor = false;
    this.initialDetails.customer = getBlankOption();
    this.initialDetails.customer.label = this.selectedOptions.customer.label;
    this.initialDetails.customer.value = this.selectedOptions.customer.value;  
    this.addTrip.get('customer').setValue(this.initialDetails.customer.value)

  }

  addPartyToOption($event) {
    if ($event.status && this.partyType == this.vehicleprovider) {
      this.getPartyTripDetails();
      this.initialDetails.vehicle_provider = { value: $event.id, label: $event.label };
      this.addTrip.get('vehicle_provider').setValue($event.id);
    }
    if ($event.status && this.partyType == this.billingParty) {
      this.initialDetails.customer = { value: $event.id, label: $event.label };
      this.addTrip.get('customer').setValue($event.id);
      this.getPartyTripDetails();
      this.routeCodeList = [];
      this.customerId.next($event.id);
      this.contactPersonList = [];
      this.clearRouteCode();

    }

  }


  getPartyTripDetails() {
    this._companyTripGetApiService.getPartyTripDetailsV2(partyList => {
      this.partyList = partyList['clients']
      this.partyListVendor = partyList['vendors']
    })
  }

  onvendorSelected() {
    let options = this.partyList.filter((item)=>item.id == this.addTrip.get('customer').value)[0];
    this.selectedOptions.customer['label'] = options.party_display_name;
    this.selectedOptions.customer['value'] = options.id;    
    let customer = this.addTrip.get('customer').value;
    this._newTripService.getAllRoutes(customer).subscribe(resp => {
      this.routeCodeList = resp['result']
    });

    this._partyService.getPartyAdressDetails(customer).subscribe((response) => {
      this.customerDetails = response['result']
      this.creditRemaining.check_credit=this.customerDetails.check_credit 
      this.creditRemaining.credit_remaining=this.customerDetails.credit_remaining 
      if(this.creditRemaining.check_credit){
       if(this.creditRemaining.credit_remaining>0){
        this.initialDetailsOnClientSelected();
       }else{
        this.creditLimit.msg='The customer has reached the credit limit, Remaining Credit Amount: '+this.currency_type?.symbol+ " " +this.creditRemaining.credit_remaining+', Do you still want to continue ?';
        this.creditLimit.open=true;
       }
      }else{
        this.initialDetailsOnClientSelected();
      }
  });
  

  }

  initialDetailsOnClientSelected(){
    let customer = this.addTrip.get('customer').value;
    if (customer) {
      let contactPersonList = cloneDeep(this.partyList.filter(party => party.id == customer)[0].contacts)
      if (isArray(contactPersonList)) {
        this.contactPersonList = contactPersonList
      }
    }
   

    this.getWorkorderDropDownList(customer);
    this.customerId.next(customer);
    this.clearWorkorder();
  }

  clearRouteCode() {
    this.addTrip.get('route_code').setValue(null);
    this.routeId.next('');
    this.initialDetails.route_code = getBlankOption();
  }

  addValueToPartyPopup(event, partyType) {
    if (event) {
      this.partyNamePopup = event;
      this.partyType = partyType;
    }
  }

  getVehicleList() {
    this._companyTripGetApiService.getVehicleNewTripList(vehicleList => {
      this.vehicleList = vehicleList;      
    })
  }


  routeSelected() {
    this.routeId.next(this.addTrip.get('route_code').value)
    this.routeDestinations.next(this.routeCodeList.filter(route => route.name == this.addTrip.get('route_code').value)[0].paths);
    this.patchFrights(this.routeCodeList.filter(route => route.name == this.addTrip.get('route_code').value)[0].freight)
  }

  multipleDestinationFormData(e) {
    let destinations = [];
    this.isAllFormValid.multipleDestination = e.isFormValid
    destinations = cloneDeep(e.formData)
    if (destinations.length > 0) {
      destinations.forEach((destination, index) => {
        if (index == 0) {
          destination['time'] = changeDateTimeToServerFormat(destination['time'] ? moment(destination['time']) : null);
        } else {
          destination['time'] = changeDateTimeToServerFormat(destination['reach_time'] ? moment(destination['reach_time']) : null)
        }
        delete destination.reach_time
        if (destination['checklist'].length > 0) {
          destination['checklist'].forEach(checkListItem => {
            if (typeof checkListItem['field_type'] != 'string')
              checkListItem['field_type'] = checkListItem['field_type']['data_type']
          });
        }
      })
    }
    if (e.isFormValid) {
      this.addTrip.get('path').setValue(destinations)
    }
  }

  dataFromSelfDriver(e) {
    this.isAllFormValid.driverAllowance = e.isFormValid
    let selfDriverData = [];
    if (e['allData'].length > 0) {
      selfDriverData = cloneDeep(e['allData']);
      selfDriverData.forEach(ele => {
        if (ele['account'] == "paid_by_driver") {
          ele['is_driver_paid'] = true;
          ele['account'] = null;
        }
      });
    }
    this.addTrip.get('driver_allowances').setValue(selfDriverData)
  }

  vehicleFreight(e) {
    this.isAllFormValid.vehicleFreight = e.isFormValid
    let vehicle_freights = this.addTrip.get('vehicle_freights') as FormGroup;
    vehicle_freights.setValue([])
    if (e.isFormValid) {
      vehicle_freights.setValue([e.value])
    }
  }
  clientFreight(e) {
    let client_freights = this.addTrip.get('client_freights') as FormGroup;
    client_freights.setValue([])
    this.isAllFormValid.clientFright = e.isFormValid
    if (e.isFormValid) {
      client_freights.setValue([e.value])
    }
    if(!this.isTransporterTrip){
      let vehicle_freights = this.addTrip.get('vehicle_freights') as FormGroup;
      vehicle_freights.setValue([])

    }
  }
  customFieldForm(e) {
    let other_details = this.addTrip.get('other_details') as FormGroup;
    other_details.setValue([])
    this.isAllFormValid.customField = e.valid;
    if (e.valid) {
      other_details.setValue(this.processCutsomFieldData((e.formData)))
    }
  }

  getTripId() {
    this._commonservice.getSuggestedIds('trip').subscribe(resp => {
      this.addTrip.get('trip_id').setValue(resp.result.trip)
    })
  }

  getDriverList() {
    this._companyTripGetApiService.getDrivers(employeeList => {
      this.driverList = employeeList;
    });
  }


  saveTrip() {
    let form = this.addTrip;
    if (form.valid && this.isAllFormsValid()) {
      if (this.workOrderTripDetails['freights']) {
        this.checkRemainingQuantity();
      } else {
        this.callSaveApi(form.value)
        this._analytics.addEvent(this.analyticsType.CREATED,this.analyticsScreen.NEWTRIP,this.screenType.ADD,"Trip created");
      }

    } else {
      this.setAsTouched(form);
      this.setAllFormsError();
     this._scrollToTop.scrollToTop();
    }
  }

  callSaveApi(formValue) {
    if(this.creditRemaining.check_credit && this.creditRemaining.credit_remaining>0){
      const freightAmount=Number(formValue['client_freights'][0].freight_amount);
      if((this.creditRemaining.credit_remaining-freightAmount)<0){
        this.creditOnsaveLimit.msg='The customer has reached the credit limit, Remaining Credit Amount: '+this.currency_type?.symbol+" " +this.creditRemaining.credit_remaining+', Do you still want to continue ?';
        this.creditOnsaveLimit.open=true;
      }else{
       this.saveApi(formValue);
      }
     }else{
       this.saveApi(formValue);
     }

   
  }

  saveApi(formValue){
    if(!this.isTransporterTrip){
      if(!formValue['driver']){
        formValue['driver']=[]
      }else{
        formValue['driver']=formValue['driver'].map(driver=>driver.id)
      } 
    }else{
      if(!formValue['driver']){
        formValue['driver']='';
      }
    }
    this._newTripService.postTrips(formValue).subscribe(resp => {
      this._route.navigate([this.preFixUrl + '/trip/new-trip/details', resp['result']])
    });
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

  isAllFormsValid() {
    if(!this.isTransporterTrip){
      this.isAllFormValid.vehicleFreight=true
    }
    for (const key in this.isAllFormValid) {
      if (Object.prototype.hasOwnProperty.call(this.isAllFormValid, key)) {
        const isValid = this.isAllFormValid[key];
        if (!isValid) {
          return false;
        }

      }
    }
    return true
  }

  setAllFormsError() {
    this.isAllFormValidError = cloneDeep(this.isAllFormValid)
    this.isFormValidDriverAllowance.next(this.isAllFormValid.driverAllowance)
    this.isFormValidvehicleFreight.next(this.isAllFormValid.vehicleFreight)
    this.isFormValidclientFright.next(this.isAllFormValid.clientFright);
    this.ismultipleDestinationFormValid.next(this.isAllFormValid.multipleDestination);
    this.isFormValidCustomField.next(this.isAllFormValid.customField)


  }
  
 openGothrough(){
  this.goThroughDetais.show=true;
}

  processCutsomFieldData(customFieldData) {
    customFieldData.forEach((item) => {
      if (item['field_type'] == "checkbox") {
        if (item.value == "false" || item.value == false) {
          item['value'] = ''
        }
      }
      if (item['field_type'] == "date") {
        item['value'] = changeDateToServerFormat(item['value'])
      }
      if (item['field_type'] == "datetime") {
        item['value'] = changeDateTimeToServerFormat(item['value'])
      }
      if (item['field_type'] != "datetime") {
        item['value'] = (item['value'].toString())
      }
    });

    return customFieldData
  }

  getWorkorderDropDownList(id) {
    this._newTripService.getWorkorderDropDown(id).subscribe(resp => {
      this.workOrderList = resp['result'];
    });
  }

  workOrderNonOption(e) {
    let selectedWorkorder = []
    selectedWorkorder = this.workOrderList.filter(workorderitem => workorderitem.workorder_no == e);
    if (!selectedWorkorder.length) {
      this.clearWorkorder();
      this.addTrip.get('work_order_no').setValue(e)
      this.initialDetails.workOrder = { label: e, value: e };
    }

  }

  onWorkOrderSelection() {
    this.clearRouteCode();
    let workOrder = this.addTrip.get('work_order_no').value
    if (workOrder) {
      let selectedWorkorder = []
      selectedWorkorder = this.workOrderList.filter(workorderitem => workorderitem.workorder_no == workOrder);
      if (selectedWorkorder.length) {
        if (!selectedWorkorder[0].is_remaining) {
          this.showPopUpMsgForWorkOrder(selectedWorkorder[0].is_trip)
        } else {
          this.getWorkOrderTripDetails(selectedWorkorder[0].id)
        }
      }
    }

  }

  confirmWorkOrderButton(e) {
    if (e) {
      let workOrder = this.addTrip.get('work_order_no').value
      if (workOrder) {
        let selectedWorkorder = []
        selectedWorkorder = this.workOrderList.filter(workorderitem => workorderitem.workorder_no == workOrder);
        this.getWorkOrderTripDetails(selectedWorkorder[0].id)

      }
    } else {
      this.clearWorkorder();
    }
  }

  clearWorkorder() {
    this.addTrip.get('work_order_no').setValue('');
    this.initialDetails.workOrder = { label: '', value: '' };
    this.workOrderTripDetails = {};
    this.workOrderClientFrightData.next(this.deFaultWorkOrderFreight);
    this.clearRouteCode()
  }

  showPopUpMsgForWorkOrder(isTrip) {
 
      this.popupWorkOrderInputData = {
        'msg': 'The Work Order requirement is fulfilled, do you still want to continue?',
        'type': 'warning-work-order',
        'show': true,
      }
  
    
     
  }

  getWorkOrderTripDetails(id) {
    this._newTripService.getWorkOrderTripDetails(id).subscribe(resp => {
      this.workOrderTripDetails = resp['result']
      this.routeId.next(null);
      let frightDetails = cloneDeep(this.workOrderTripDetails['freights'][0]);
      frightDetails['total_units'] = 0.000
      frightDetails['freight_amount'] =0.000
      if (Number(frightDetails['freight_type']) == 10) {
        frightDetails['freight_amount'] = frightDetails['rate']
        frightDetails['rate'] = 0
      }
      if (this.workOrderTripDetails['route_code']) {
        this.addTrip.get('route_code').setValue(this.workOrderTripDetails['route_code']);
        this.routeId.next(this.workOrderTripDetails['route_code']);
        this.initialDetails.route_code = { label: this.workOrderTripDetails['route_code'], value: this.workOrderTripDetails['route_code'] }
      }   
      this.isDisableBillingTypes=true;  
      this.workOrderClientFrightData.next(frightDetails)
      this.routeDestinations.next(cloneDeep(this.workOrderTripDetails['paths']))
    });
  }

  confirmWorkOrderSaveButton(e) {
    if (e) {
      let form = this.addTrip;
      this.callSaveApi(form.value)
    }
  }

  checkRemainingQuantity() {
    let form = this.addTrip;
    let total_units = Number(form['value']['client_freights'][0]['total_units']);
    let balance = this.workOrderTripDetails['total_units'] - this.workOrderTripDetails['utilized_units'];
    if ((total_units > balance) &&this.workOrderTripDetails['freights'][0]['freight_type']!=10) {
      this.popupWorkOrderInputDataSave = {
        'msg': 'The Quantity mentioned in the Trip ' + total_units + ' is greater than the Remaining Quantity ' + balance + ' of the Work order, Do you still want to Continue to Create the Trip?',
        'type': 'warning-work-order',
        'show': true,
      }
    } else {
      this.callSaveApi(form.value)
      this._analytics.addEvent(this.analyticsType.CREATED,this.analyticsScreen.NEWTRIP,this.screenType.ADD,"Trip created with workOrder");
    }
  }

  patchCustomerAndWorkOrder(customerId, workOrderId) {
    this.customerId.next(customerId);
    this.addTrip.get('customer').setValue(customerId);
    this._newTripService.getAllRoutes(customerId).subscribe(resp => {
      this.routeCodeList = resp['result']
    });
    this._companyTripGetApiService.getPartyTripDetailsV2(partyList => {
      this.partyList = partyList['clients'];
      const selectedParty = this.partyList.filter(party => party.id == customerId);
      if (selectedParty.length) {
        this.initialDetails.customer = { label: selectedParty[0].party_display_name, value: '' }
        if (customerId) {
          let contactPersonList = cloneDeep(this.partyList.filter(party => party.id == customerId)[0].contacts)
          if (isArray(contactPersonList)) {
            this.contactPersonList = contactPersonList
          }
        }
      }
      this._newTripService.getWorkorderDropDown(customerId).subscribe(resp => {
        this.workOrderList = resp['result'];
        const selectedWorkOrder = this.workOrderList.filter(workorder => workorder.id == workOrderId);
        if (selectedWorkOrder.length) {
          this.initialDetails.workOrder = { label: selectedWorkOrder[0].workorder_no, value: '' }
          this.addTrip.get('work_order_no').setValue(selectedWorkOrder[0]['workorder_no']);
          this.onWorkOrderSelection();
        }
      });
      this.partyListVendor = partyList['vendors']
    });
  }

   patchCustomerAndRouteCodeAndTenderNumber(customerId, routeCode,tenderNumber) {
    this.customerId.next(customerId);
    this.addTrip.get('customer').setValue(customerId);
    this.addTrip.get('bdp_tender_number').setValue(tenderNumber);
    this._newTripService.getAllRoutes(customerId).subscribe(resp => {
      this.routeCodeList = resp['result'];
      if(routeCode){
        this.addTrip.get('route_code').setValue(routeCode);
        this.routeId.next(routeCode);
        this.initialDetails.route_code = { label: routeCode, value: routeCode }
        setTimeout(() => {
          this.routeId.next(this.addTrip.get('route_code').value)
          this.routeDestinations.next(this.routeCodeList.filter(route => route.name == this.addTrip.get('route_code').value)[0].paths);
        }, 100);
      }
      
    });

    this._companyTripGetApiService.getPartyTripDetailsV2(partyList => {
      this.partyList = partyList['clients'];
      const selectedParty = this.partyList.filter(party => party.id == customerId);
      if (selectedParty.length) {
        this.initialDetails.customer = { label: selectedParty[0].party_display_name, value: '' }
        if (customerId) {
          let contactPersonList = cloneDeep(this.partyList.filter(party => party.id == customerId)[0].contacts)
          if (isArray(contactPersonList)) {
            this.contactPersonList = contactPersonList
          }
        }
      }
      this.partyListVendor = partyList['vendors']
    });
  }

  patchVehicleNumber(vehicleId){
    setTimeout(() => {
      this.addTrip.get('c_vehicle').setValue(vehicleId)
      const selectedParty = this.vehicleList.filter(vehicle => vehicle.id == vehicleId);
      this.initialDetails.vehicle = { label: selectedParty[0].reg_number, value: vehicleId};
      this.onVehicleChange();
    }, 700);

  }

  patchFrights(data) {
    if(data){
      data['total_units']=0.000
      if (Number(data['freight_type']) == 10) {
        data['rate']=0.000
      } else{
        data['freight_amount'] =0.000
      }
      this.isDisableBillingTypes=false;  
      this.workOrderClientFrightData.next(data)
    }

  }

  onCreditLimit(e){
    if(e){
     this.initialDetailsOnClientSelected();
    }else{
     this.addTrip.get('customer').setValue(null);
     this.initialDetails.customer=getBlankOption();
    }
   }
 
   onCreditLimitOnSave(e){
     if(e){
      let form =this.addTrip;
      this.callSaveApi(form.value)
      }
   }
}
