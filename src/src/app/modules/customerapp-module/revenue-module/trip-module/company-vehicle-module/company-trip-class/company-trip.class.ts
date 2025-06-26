import { AbstractControl, UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { BehaviorSubject } from 'rxjs';
import { ErrorList } from 'src/app/core/constants/error-list';
import { debounceTime } from 'rxjs/operators';
import {setFuelExpensePaidValidatorsUtil,setFuelReceivedValidatorsUtil,calculateExpenseAmounts,calcFuelClientTotalAmountUtil,gettotalAdvanceAmountAndtotalEstimateAmount,
setDriverExpensePaidValidatorsUtil,setAdvancePaidValidatorsUtil,fileUploaderUtil,
calExpenseTotal,calcFuelExpenseUtil,calcFuelExpenseTotalAmountUtil,calcFuelClientUtil,fileDeletedUtil,calculateFuelClientUtil
} from '../company-trip-class/company-trip-utils';
import { trimExtraSpaceBtwWords, roundOffQuantity, roundOffAmount, getBlankOption, } from 'src/app/shared-module/utilities/helper-utils';
import { bankChargeRequired } from 'src/app/shared-module/utilities/payment-utils';

export class CompanyTripClass {
  prefixUrl=''
  ItemDropdownIndex: number = -1;
  expenseItemDropdownIndex: number = -1;
  basicDetailsCollapse: Boolean = true;
  estimateCollapse: Boolean = true;
  expensesCollapse: Boolean = true;
  customFieldCollapse: Boolean = true;
  remarksCollapse: Boolean = false;
  vehicleList: any = [];
  employeeList: any = [];
  is_driver_message: any = false
  addTripForm;
  vehicleRoute: any;
  lenghtOfTripLine;
  xPadding = 30;
  yPadding = 30;
  apiError: string;
  filteredOptions: Observable<any[]>;
  materialList: any = [];
  unitOptionList: any = [];
  bataEmployeeList: any = [];
  tripEmployeeTypeList: any = [];
  paymentStatus: any = [];
  accountList: any = [];
  advanceClientAccountList: Array<any> = [];
  fuelClientAccountList: Array<any> = [];
  battaClientAccountList: Array<any> = [];
  expenseAccountList: Array<any> = [];
  allAccountList: any = [];
  partyList: any = [];
  expenseList: any = [];
  isCurrentTripExist: any;
  partyListApiCall: string = TSAPIRoutes.party;
  expenseListApiCall: string = TSAPIRoutes.operation + TSAPIRoutes.expense;
  materialApiCall: string = TSAPIRoutes.get_and_post_material;
  showAddPartyPopup: any = {name: '', status: false};
  partyPopupDropDownIndex:number=-1;
  isEndTripPending:boolean=true;
  isEndLoopPending:boolean=false;
  otherExpenseParams = {
    name: '',
  }
  materialParams = {
		name: '',
		unit: null,
		rate_per_unit: 0.0,
	};
  initialDetails = {
    vehicleDetail: {},
    accountType: {},
    consignee: {},
    consigner: {},
    party: {},
    driver: {},
    unit: [],
    material: [],
    driverName: [],
    driverAccount: [],
    driverDesignation: [],
    paymentStatusDriver: [],
    fuelName: [],
    otherItem: [],
    otherAccount: [],
    expenseAccount: [],
    otherPaymentStatus: [],
    advanceClientAccount:  [],
    fuelClientAccount: [],
    battaClientAccount: [],
    driverHelperBankingCharges: [],
    otherExpenseBankingCharges: [],
    month :[],
    isMonthlyPaymentModeSelected :[],
    startDateHour :{ label : 'HH' ,value :null},
    endDateHour :{ label : 'HH' ,value :null},
    startDateMin :{ label : 'MM' ,value :null},
    endDateMin :{ label : 'MM' ,value :null},
    startDatePeriod :{ label : 'AM' ,value :null},
    endDatePeriod :{ label : 'AM' ,value :null},
    consignmentNo: {},



  };
  partyNamePopup: string = '';
  hideIllustration: Boolean = true;
  isLatestTrip: boolean = false;
  isClosedLoop: boolean = false;
  isClosedTrip: boolean = false;
  accountType = new ValidationConstants().accountType.join(',');
  deletedOtherExpenses:any = [];
  endTripButton:boolean=false;
  endLoopButton:boolean=false;
  documentPatchData: any=[];
  patchFileUrls=new BehaviorSubject([]);
  dateSelected='';
  dateSelectedEnd='';
  customFieldDetails=[];
  showSuccessPopup: boolean = false;
  is_draft :boolean = false;
  tripPopup=new BehaviorSubject({
    is_draft: false,
    trip_id: ''
  });

  hourPlaceholderOption: any = { label: 'HH', value: null }
  monthPlaceholderOption: any = { label: 'MM', value: null }
  periodPlaceholderOption: any = { label: 'AM', value: 'AM' }

  tripList: any = [
    {
      consignor: 'Bengaluru',
      consignee: 'Channai'
    },
    {
      consignor: 'Channai',
      consignee: 'Pondicherry'
    },
    {
      consignor: 'Hydrabad',
      consignee: 'Channai'
    },
    {
      consignor: 'Channai',
      consignee: 'Bengaluru'
    }
  ];
  consignorList = [];
  consigneeList = [];
  consigneeUrl = TSAPIRoutes.revenue + TSAPIRoutes.consignee;
  consignorUrl = TSAPIRoutes.revenue + TSAPIRoutes.consignor;
  consignorParams = {};
  consigneeParams = {};
  consignorSubscription$: Subscription;
  consigneeSubscription$: Subscription;
  pumpPartyList = [];
  tripData: any;
  popupInputData = {
    'msg': 'Trip Added Successfully',
    'type': 'success',
    'show': false
  }
  tripListForIllustration: any;
  initializeD3: boolean = false;
  vehicleIllustrationData: any = [];
  edit_date_min: Date;
  showAddItemPopup: any = {name: '', status: false};
  showAddExpenseItemPopup: any = {name: '', status: false}

  otherExpenseValidatorSub: Subscription;
  driverExpenseValidatorSub: Subscription;
  fuelExpenseValidatorSub: Subscription;
  estimateValidatorSub: Subscription;
  advancePaidValidatorSub: Subscription;
  fuelReceivedValidatorSub: Subscription;

  globalFormErrorList: any = [];
  possibleErrors = new ErrorList().possibleErrors;
  errorHeaderMessage = new ErrorList().headerMessage;

  driverList: any = [];
  helperList: any = [];
  vendor: boolean=false;
  canPopulateShortageValue=true;
  acceptedShortage: number=0;
  currency_type;
  isMonthlyPaymentModeSelected: boolean = false;
  months = new ValidationConstants().month
  monthsDropdownValues: any =[];
  hours = new ValidationConstants().hours;
  minutes = new ValidationConstants().minutes;
  tripId: string = "";


  showAddCoaPopup: any = {name: '', status: false};
  coaParams: any = {
	name: '',
  };
  coaDropdownIndex: number = -1;
  vehicleId='';
  vehicleIdFromParams: any;
  showSuccessPopupBackdrop: boolean = false;
  consignmentNoteList: any;
  isMoneyReceived:boolean=false;
  isFuelReceived:boolean=false;
  isBataReceivaed:boolean=false;
  delivaryNoteCustomFieldsValues=[];
  calExpenseTotal(i){
    calExpenseTotal(i,this.addTripForm);
  }

  calculateExpenseAmounts(i){
    calculateExpenseAmounts(i,this.addTripForm);
  }

  is_latest_trip(){
    return this.tripData.is_latest_trip;
  }

  is_loop_closed(){
    return this.tripData.loop_status.label == "Closed";
  }

  is_trip_closed(){
    return this.tripData.status.label == "Closed";
  }

  openAddItemModal($event, index) {
		if ($event)
			this.ItemDropdownIndex = index;
			this.showAddItemPopup = {name: this.materialParams.name, status: true};
	}

	closeItemPopup(){
		this.showAddItemPopup = {name: '', status: false};
  }

  openAddExpenseItemModal($event, index) {
    if ($event)
      this.expenseItemDropdownIndex = index;
      this.showAddExpenseItemPopup = {name: this.otherExpenseParams.name, status: true};
    }

  closeExpenseItemPopup(){
      this.showAddExpenseItemPopup = {name: '', status: false};
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

  checkDriverListSelected(){
    let driversId=[],
    driverId=''
    driversId =this.employeeList.map(item => item.id);
       driverId =this.addTripForm.controls.driver.value;
      if(driverId){
        if(!driversId.includes(driverId)){
          this.addTripForm.controls.driver.setValue('');
          this.initialDetails.driver= getBlankOption();
        }
      }
     let driver_helper =  this.addTripForm.controls.expenses['controls']['driver_helper'] as UntypedFormArray;
     driver_helper.controls.forEach((element,index)=>{
      if(element.get('name').value){
        if(!driversId.includes(element.get('name').value)){
          element.get('name').setValue('');
          this.initialDetails.driverName[index] =getBlankOption();
        }
      }
     })
    }


  populateMonthsDropdown(value){
    let month = value.getMonth() ;
    if(month == 11){
      this.monthsDropdownValues = [{id :12 , name: 'December'},{id:1 , name :'January'},{id:2, name: 'Febuary'}]
    }
    else if(month ==10){
      this.monthsDropdownValues = [{id :11 , name: 'November'},{id:12 , name :'December'},{id:1, name: 'January'}]
    }
    else{
      this.monthsDropdownValues = this.months.slice(month,month+3);
    }
   }

   calcFuelExpense(index) {
    calcFuelExpenseUtil(index,this.addTripForm)
  }

  calcFuelExpenseTotalAmount(index) {
    calcFuelExpenseTotalAmountUtil(index,this.addTripForm)
    }

    calculateFuelClient(index_value: number){
      calculateFuelClientUtil(index_value,this.addTripForm)
    }

    calcFuelClient(index) {
     calcFuelClientUtil(index,this.addTripForm)
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

    calcFuelClientTotalAmount(index) {
      calcFuelClientTotalAmountUtil(index,this.addTripForm)
      }

      addConsignor(event) {
        if (event) {
          const val = trimExtraSpaceBtwWords(event);
          const arrStr = val.toLowerCase().split(' ');
          const titleCaseArr:string[] = [];
          for (const str of arrStr) {
            titleCaseArr.push(str.charAt(0).toUpperCase() + str.slice(1));
          }
          const word_joined = titleCaseArr.join(' ');
          this.consignorParams = {
            name: word_joined
          };
          }
      }

      validateEsitmateAdvance() {
        let totalData={
          totalAdvanceAmount:0,
          totalEstimateAmount:0
        }
        totalData=  gettotalAdvanceAmountAndtotalEstimateAmount(this.addTripForm);
        if (totalData.totalAdvanceAmount > totalData.totalEstimateAmount) {
          this.apiError = 'Total advance should be less or greater than total Net Receiveable Amount'
          this.addTripForm.setErrors({ 'invalid': true });
        }
      }

      setAdvancePaidValidators() {
        const advances = this.addTripForm.controls['advance_client'] as UntypedFormArray;
        this.advancePaidValidatorSub = advances.valueChanges.pipe(debounceTime(500)).subscribe((items) => {
        setAdvancePaidValidatorsUtil(items,this.addTripForm)
        });
      }

      setFuelReceivedValidators() {
        const fuels = this.addTripForm.controls['fuel_client'] as UntypedFormArray;
        this.fuelReceivedValidatorSub = fuels.valueChanges.pipe(debounceTime(500)).subscribe((items) => {
          setFuelReceivedValidatorsUtil(items,this.addTripForm)
        });
      }

      setFuelExpensePaidValidators() {
        const fuels = this.addTripForm.controls['expenses'].get('fuel') as UntypedFormArray;
        this.fuelExpenseValidatorSub = fuels.valueChanges.pipe(debounceTime(500)).subscribe((items) => {
          setFuelExpensePaidValidatorsUtil(items,this.addTripForm);
        });
      }

      setDriverExpensePaidValidators() {
        const driverExpenses = this.addTripForm.controls['expenses'].get('driver_helper') as UntypedFormArray;
        this.driverExpenseValidatorSub = driverExpenses.valueChanges.pipe(debounceTime(500)).subscribe((items) => {
          setDriverExpensePaidValidatorsUtil(items,this.addTripForm)
        });
      }

      fileUploader(filesUploaded) {
        fileUploaderUtil(filesUploaded,this.addTripForm);
      }

        fileDeleted(deletedFileIndex) {
          fileDeletedUtil(deletedFileIndex,this.addTripForm);
        }

        patchDocuments(data){
          if(data.documents.length>0){
          let documentsArray = this.addTripForm.get('documents') as UntypedFormControl;
          documentsArray.setValue([]);
          const documents = data.documents;
          let pathUrl=[];
          documents.forEach(element => {
            documentsArray.value.push(element.id);
            pathUrl.push(element);
          });
          this.patchFileUrls.next(pathUrl);
        }
      }

      addParamsCoaItem($event) {
        this.coaParams = {
          name: $event
        };
      }

      openAddCoaModal($event, index) {
        if ($event)
          this.coaDropdownIndex = index;
          this.showAddCoaPopup = {name: this.coaParams.name, status: true};
        }

        closeCoaPopup(){
          this.showAddCoaPopup = {name: '', status: false};
        }


  addValueToExpense(event) {
		if (event) {
			const val = trimExtraSpaceBtwWords(event);
			const arrStr = val.toLowerCase().split(' ');
			const titleCaseArr:string[] = [];
			for (const str of arrStr) {
			  titleCaseArr.push(str.charAt(0).toUpperCase() + str.slice(1));
			}
			const word_joined = titleCaseArr.join(' ');
			this.otherExpenseParams = {
        name: word_joined
      };
		  }
  }

  pymentStatus(index) {
    const driver_helpher = this.addTripForm.controls['expenses'].get('driver_helper') as UntypedFormArray;
    let paymentStatus: Number;
    this.initialDetails.paymentStatusDriver[index] = {};
    driver_helpher.value[index].batta = Number(driver_helpher.value[index].batta).toFixed(3);
    driver_helpher.value[index].paid = Number(driver_helpher.value[index].paid).toFixed(3);
    Number(driver_helpher.value[index].batta) > 0 && Number(driver_helpher.value[index].paid) > 0 && (Number(driver_helpher.value[index].batta) === Number(driver_helpher.value[index].paid)) ? paymentStatus = 2
      : (Number(driver_helpher.value[index].paid) < Number(driver_helpher.value[index].batta)) && Number(driver_helpher.value[index].paid) > 0 ? paymentStatus = 1
        : Number(driver_helpher.value[index].batta) > 0 && Number(driver_helpher.value[index].paid) == 0 ? paymentStatus = 0
          : Number(driver_helpher.value[index].batta) == 0 && Number(driver_helpher.value[index].paid) == 0 ? paymentStatus = undefined : '';
    const payment = this.paymentStatus.filter(payment => payment.value === paymentStatus)[0];
    this.initialDetails.paymentStatusDriver[index] = { value: payment ? payment.id : '', label: payment ? payment.label : '' };
    driver_helpher.controls[index].get('payment_status').setValue(payment ? payment.id : '');
  }

  errorLine(controlName: AbstractControl) {
    return {
      error_line: controlName.invalid && (controlName.dirty || controlName.touched)
    };
  }

  // round off amount
  roundOffQuantity(formControl) {
    roundOffQuantity(formControl);
  }

   // round off amount
   roundOffAmount(formControl) {
    roundOffAmount(formControl);
  }

  addConsignee(event) {
		if (event) {
			const val = trimExtraSpaceBtwWords(event);
			const arrStr = val.toLowerCase().split(' ');
			const titleCaseArr:string[] = [];
			for (const str of arrStr) {
			  titleCaseArr.push(str.charAt(0).toUpperCase() + str.slice(1));
			}
			const word_joined = titleCaseArr.join(' ');
			this.consigneeParams = {
				name: word_joined
			};
		  }
	}


  populateDriverBatta(driverselected){
    let driverDesignation = getBlankOption();
    this.tripEmployeeTypeList.forEach((ele) => {
      if(ele.label.toLowerCase() == 'driver'){
        driverDesignation = {label: ele.label, value: ele.id}
      }
    });

    if (driverselected.value){
      let driver_helper_expense = this.addTripForm.controls['expenses'].get('driver_helper') as UntypedFormArray;
      driver_helper_expense.at(0).get('name').setValue(driverselected.value);
      driver_helper_expense.at(0).get('employee_type').setValue(driverDesignation.value);
      this.initialDetails.driverDesignation[0] = driverDesignation;
      this.initialDetails.driverName[0] = driverselected;
    }
  }

  populateDriverHelperList(driverDeg) {
    if (driverDeg.value) {
        if (driverDeg.label.toLowerCase() == 'driver')
          this.bataEmployeeList.push(this.driverList);
        else
          this.bataEmployeeList.push(this.helperList);
    }
    else
      this.bataEmployeeList.push([]);
  }

  initializeDriverHelperBankingCharges(account) {
    this.initialDetails.driverHelperBankingCharges.push(bankChargeRequired(account.value, null, this.accountList));
  }

  initializeTripStatus(trip_status, loop_status, is_latest_trip){
    this.isLatestTrip = is_latest_trip;
    this.isClosedLoop = loop_status.label == "Closed";
    this.isClosedTrip = trip_status.label == "Closed";
  }

  checkInitialDetails(response: any, data?: any) {
    if (response !== undefined) {
      if (Object.keys(response).length > 2 && Object.keys(data).length !== 0) {
        return true;
      }
      else {
        return false;
      }
    }
  }

  addValueToMaterial(event) {
		if (event) {
			const val = trimExtraSpaceBtwWords(event);
			const arrStr = val.toLowerCase().split(' ');
			const titleCaseArr:string[] = [];
			for (const str of arrStr) {
			  titleCaseArr.push(str.charAt(0).toUpperCase() + str.slice(1));
			}
			const word_joined = titleCaseArr.join(' ');
			this.materialParams = {
        name: word_joined,
        unit: null,
        rate_per_unit: 0.0,
      }
		  }
	}

  /* For  Opening the Party MOdal */
  openAddPartyModal($event,index ) {
    if ($event && index == 0 || index)
    {
      this.partyPopupDropDownIndex=index;
      this.vendor=true;
      this.showAddPartyPopup = {name: this.partyNamePopup, status: true};
    }
    else{
      this.showAddPartyPopup = {name: this.partyNamePopup, status: true}
    }
  }

  /* Adding the entered value to the list */
  addValueToPartyPopup(event){
    if (event) {
      const val = trimExtraSpaceBtwWords(event);
      const arrStr = val.toLowerCase().split(' ');
      const titleCaseArr:string[] = [];
      for (const str of arrStr) {
        titleCaseArr.push(str.charAt(0).toUpperCase() + str.slice(1));
      }
      const word_joined = titleCaseArr.join(' ');
      this.partyNamePopup = word_joined;
      }
  }

  /* After closing the modal to clear all the values */
  closePartyPopup(){
    this.showAddPartyPopup = {name: '', status: false};
    this.vendor=false;

  }

  resetAdvanceClient(formGroup: UntypedFormGroup, index) {
    formGroup.patchValue({account: null, amount: 0, description: ''});
    this.initialDetails.advanceClientAccount[index] = getBlankOption();
  }

  removeAdvanceClient(index) {
    this.initialDetails.advanceClientAccount.splice(index, 1);
    (this.addTripForm.controls['advance_client'] as UntypedFormArray).removeAt(index);
  }

  drawRoute() {
    this.vehicleRoute = document.getElementById('loopRoute');
    const wrapper = document.getElementById('canvasWrapper');
    this.vehicleRoute.width = wrapper.offsetWidth - this.yPadding;
    const c = this.vehicleRoute.getContext('2d');
    const numOfRides = this.tripList.length;
    let level = 1;
    c.clearRect(0, 0, wrapper.offsetWidth, this.vehicleRoute.height);
    this.lenghtOfTripLine = this.vehicleRoute.width / numOfRides;

    for (let i = 0; i < this.tripList.length; i++) {
      // const trip = this.tripList[Math.floor((i / 2))];
      const trip = this.tripList[i];
      const lineFrom = i === 0 ? i * this.lenghtOfTripLine + 30 : i * this.lenghtOfTripLine;
      const lineTo =
        i === numOfRides - 1
          ? (i + 1) * this.lenghtOfTripLine - (this.xPadding + 10)
          : (i + 1) * this.lenghtOfTripLine - 10;
      let lineYPosition = this.vehicleRoute.height - (level + 2) * this.yPadding;

      const currentCordinate = {
        from: {
          x: lineFrom,
          y: lineYPosition
        },
        to: {
          x: lineTo,
          y: lineYPosition
        }
      };

      if (i > 0) {
        if (this.tripList[i - 1].consignee.toUpperCase() !== trip.consignor.toUpperCase()) {
          level = level + 3;
          lineYPosition = this.vehicleRoute.height - (level + 2) * this.yPadding;
          currentCordinate.to.y = lineYPosition;
          this.drawUpCurve(
            c,
            currentCordinate,
            trip.consignor.substr(0, 3) + ' - ' + trip.consignee.substr(0, 3)
          );
          continue;
        }
      }

      this.drawLine(c, currentCordinate, trip.consignor.substr(0, 3) + ' - ' + trip.consignee.substr(0, 3));
    }
  }

  drawLine(c, cordinate, label) {
    c.beginPath();
    c.strokeStyle = '#595fab';
    c.moveTo(cordinate.from.x + 10, cordinate.from.y);
    c.lineTo(cordinate.to.x, cordinate.to.y);
    c.stroke();

    this.drawCircle(c, cordinate, '#595fab', true, label);
  }

  drawArrow(c, cordinate, label) {
    const headlen = 10;

    const angle = Math.atan2(cordinate.to.y - cordinate.from.y, cordinate.to.x - cordinate.from.x);

    c.beginPath();
    c.moveTo(cordinate.from.x + 10, cordinate.from.y);
    c.lineTo(cordinate.to.x - 10, cordinate.to.y);
    c.strokeStyle = '#007BE9';
    c.lineWidth = 1;
    c.stroke();

    c.beginPath();
    c.moveTo(cordinate.to.x, cordinate.to.y);
    c.lineTo(
      cordinate.to.x - headlen * Math.cos(angle - Math.PI / 7),
      cordinate.to.y - headlen * Math.sin(angle - Math.PI / 7)
    );

    c.lineTo(
      cordinate.to.x - headlen * Math.cos(angle + Math.PI / 7),
      cordinate.to.y - headlen * Math.sin(angle + Math.PI / 7)
    );

    c.lineTo(cordinate.to.x, cordinate.to.y);
    c.lineTo(
      cordinate.to.x - headlen * Math.cos(angle - Math.PI / 7),
      cordinate.to.y - headlen * Math.sin(angle - Math.PI / 7)
    );

    c.strokeStyle = '#007BE9';
    c.lineWidth = 1;
    c.stroke();
    c.fillStyle = '#007BE9';
    c.fill();

    this.drawCircle(c, cordinate, '#007BE9', true, label);
  }

  drawCircle(c, cordinate, color, fill: Boolean = false, label: String) {
    const radius = 5;

    c.beginPath();
    c.arc(cordinate.from.x, cordinate.from.y, radius, 0, 2 * Math.PI, false);
    if (fill) {
      c.fillStyle = color;
      c.fill();
    }
    c.lineWidth = 1;
    c.strokeStyle = color;
    c.stroke();

    c.lineWidth = 1;
    c.strokeStyle = '#ffffff00';
    c.font = 'bold 8pt sans-serif';
    c.textAlign = 'center';

    c.fillText(label.toUpperCase(), cordinate.from.x, cordinate.from.y + this.xPadding);
  }

  drawUpCurve(c, cordinate, label) {
    c.beginPath();
    c.strokeStyle = '#595fab';
    c.moveTo(cordinate.from.x + 10, cordinate.from.y);
    c.bezierCurveTo(
      cordinate.from.x,
      cordinate.from.y,
      (cordinate.to.x + cordinate.from.x) / 2 + this.lenghtOfTripLine,
      (cordinate.to.y + cordinate.from.y) / 2 - 50,
      cordinate.to.x,
      cordinate.to.y
    );
    c.stroke();
    this.drawCircle(c, cordinate, '#595fab', true, label);
  }

}
