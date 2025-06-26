import { PrefixUrlService } from '../../../../../../core/services/prefixurl.service';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { Router, ActivatedRoute } from '@angular/router';
import { BillOfSupplyService } from '../../../../api-services/revenue-module-service/bos-service/bill-of-supply.service';
import { RevenueService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/revenue-service/revenue.service';
import { PartyService } from 'src/app/modules/customerapp-module/api-services/master-module-services/party-service/party.service';
import { EmployeeService } from 'src/app/modules/customerapp-module/api-services/master-module-services/employee-service/employee-service';
import { CommonService } from 'src/app/core/services/common.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormArray, AbstractControl, UntypedFormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { getObjectFromList, getBlankOption, checkEmptyDataKey, getObjectFromListByKey, isValidValue, getMinOrMaxDate } from 'src/app/shared-module/utilities/helper-utils';
import { changeDateToServerFormat, PaymentDueDateCalculator } from 'src/app/shared-module/utilities/date-utilis';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ErrorList } from 'src/app/core/constants/error-list';

import { roundOffToCeilFloor } from 'src/app/shared-module/utilities/currency-utils';
import { TaxModuleServiceService } from 'src/app/tax-module/tax-module-service.service';
import { NewTripService } from '../../../../api-services/trip-module-services/trip-service/new-trip-service';
import { TaxService } from 'src/app/core/services/tax.service';
import { NewTripDataService } from '../../../../sub-main-trip-module/new-trip-module/new-trip/new-trip-data.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { TerminologiesService } from 'src/app/core/services/terminologies.service';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { NewTripV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/trip-service/new-trip-v2.service';
import { cloneDeep } from 'lodash';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-add-bill-of-supply',
  templateUrl: './add-bill-of-supply.component.html',
  styleUrls: ['./add-bill-of-supply.component.scss'],
  host: {
		"(window:click)": "clickOutToHide($event)"
	  },
})
export class AddBillOfSupplyComponent implements OnInit {
  videoUrl = 'https://ts-pub-directory.s3.ap-south-1.amazonaws.com/New+BOS.mp4';
  ItemDropdownIndex: number = -1;
  saveButton: boolean = false;
  showGstinModal: Boolean = false;
  challanModalInline: Boolean = false;
  unregisteredGst = new ValidationConstants().unregisteredGst;
  addBillOFSupplyForm;
  partyList = [];
  PlaceOfSupplyStateList = [];
  treatmentList = [];
  paymentTermList = [];
  bankList = [];
  employeeList = [];
  challansList = [];

  staticOptions: any = {
  }
  initialValues: any = {
    party: {},
    placeOfSupply: {},
    gstTreatment: {},
    paymentTerm: {},
    employee: {},
    items: [],
    units: [],
    adjustmentAccount: getBlankOption(),
    disclaimer: {},
    digitalSignature:{},
    bank_account:getBlankOption(),
    contactperson:{},
    termsAndCondition : getBlankOption()
  }
  billofsupply_id;
  billOfSupplyDetailsById;
  additionalDetails: any;
  materialApiCall: string = TSAPIRoutes.get_and_post_material;
  materialParams = {
		name: '',
		unit: null,
		rate_per_unit: 0.0,
  };
  totals: any = {
    subtotal_challan: 0.0,
    subtotal_others: 0.0,
    subtotal: 0.0,
    adjustment: 0.0,
    total: 0.0,
    roundOffAmount: 0.00,
    tax: [],
    taxes: [],
    battaAdvance:0.00,
    advanceTotal:0.00,
    fuelTotal:0.00,
    billofSupplyBalance:0.00,
    totalAdvance:0.00
  };
  apiError = '';
  selectedParty;
  partyId;
  selectedPaymentTerm: any;
  showAddPartyPopup: any = {name: '', status: false};
	partyNamePopup: string = '';
  inv_date: Date;
  hsn_code = new ValidationConstants().HSN_CODE;
  alphaNumericPattern= new ValidationConstants().VALIDATION_PATTERN.ALPHA_NUMERIC2;
  bill_id;
  showAddItemPopup: any = {name: '', status: false};
  expenseAccountList: any = [];
  afterTaxAdjustmentAccount = new ValidationConstants().afterTaxAdjustmentAccountOption;
	globalFormErrorList: any = [];
	possibleErrors = new ErrorList().possibleErrors;
	errorHeaderMessage = new ErrorList().headerMessage;
	otherExpenseValidatorSub: Subscription;
	adjustmentValidatorSub: Subscription;
  challanValidatorSub: Subscription;
  disclaimerApiCall: string = TSAPIRoutes.revenue + TSAPIRoutes.disclaimer;
  showAddDisclaimerPopup: any = {name: '', status: false};
  disclaimerList: any = [];
  disclaimerParams: any = {};
  isAdd:boolean=true;
  isTPEmpty: boolean = false;
  isWOEmpty: boolean = false;
  prefixurl =''
  showFreightPopup ={
		type:'',
		show:false,
		data:{},
		extras: {id: ''}
	}
	showChargesPopup ={
		type:'',
		show:false,
		data:{},
		extras: {id: ''}
	}
  tripChallansList: any = [];
  currency_type;
  tripChallanModelInline: boolean = false
  isTripAdd: boolean = true;
  isTax = false;
  tripId ='';
  taxDetails;
    gstin: any;
  showAdvancePopup ={
		type:'',
		show:false,
		data:{},
		extras: {id: ''}
	}
  minDate: Date;
  isDueDateMan=false;
  pattern =  new ValidationConstants();
  contactPersonList =[];
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;
  screenType=ScreenType;
  terminology :any;
  digitalSignature=[];
  doChallanExists: boolean = false;
	doTripChallanExists: boolean = false;
  isPlaceOfSupply: boolean = false;
  creditRemaining = {
		credit_remaining: 0,
		check_credit: false
	};
	customerDetails: any;
	creditLimit = {
		open: false,
		msg: ''
	}

	creditOnsaveLimit = {
		open: false,
		msg: ''
	}
	creditOnsaveAsDraftLimit = {
		open: false,
		msg: ''
	};
	tersmAndConditions = [];
  paymentTermCustom=new ValidationConstants().paymentTermCustom;



  constructor(private _fb: UntypedFormBuilder,
    private _commonService: CommonService,
    private _employeeService: EmployeeService,
    private _partyService: PartyService,
    private _revenueService: RevenueService,
    private _billOfSupplyService: BillOfSupplyService,
    private _router: Router,
    private _taxService:TaxModuleServiceService,
    private _prefixurl:PrefixUrlService,
    private _activatedRoute: ActivatedRoute,
    private dataService:NewTripDataService,
    private currency:CurrencyService,
    private _tax :TaxService,
    private _analytics:AnalyticsService,
    private _terminologiesService:TerminologiesService,
    private _scrollToTop:ScrollToTop,
    private _newTripV2Service: NewTripV2Service,private apiHandler: ApiHandlerService,
    private _tripService: NewTripService) { }

  ngOnDestroy() {
    this.otherExpenseValidatorSub.unsubscribe();
    this.challanValidatorSub.unsubscribe();
    this.adjustmentValidatorSub.unsubscribe();
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove('removeLoader');
  }

  ngOnInit() {
    this.bill_id = this._activatedRoute.snapshot.params['billofsupply_id'];
    this.terminology = this._terminologiesService.terminologie;
    this.isTax = this._tax.getTax();
    this.isPlaceOfSupply = this._tax.isPlaceOfSupply();
    setTimeout(() => {
      this.currency_type = this.currency.getCurrency();
    }, 1000);
    this.buildForm();
    this.getEmployeeList();
    this.getPartyList();
    this.getOptionList();
    this.getPlaceOfSupply();
    this.getMaterialList();
    this.getSuggestedIds();
    this.getBankList();
    this.getTersmAndConditionList();
    this. getDigitalSignatureList();
    this.getExpenseAccountsAndSetAccount();
    this.getDisclaimerOptions();
    this.prefixurl = this._prefixurl.getprefixUrl();
    if(this.bill_id){
      this.getBillOfSuplyById();
      this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.BOS,this.screenType.EDIT,"Navigated");
    }else{
      this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.BOS,this.screenType.ADD,"Navigated");
      this.addBillOFSupplyForm.get('bos_date').setValue(new Date(dateWithTimeZone()));
      this.minDate=new Date(dateWithTimeZone())
    }

    if(this.dataService.customerDetails['id']){
      let customer = this.dataService.customerDetails['customer'];
      this.tripId = this.dataService.customerDetails['id']
      this.initialValues.party = {label :customer['display_name']};
      this.addBillOFSupplyForm.controls['party'].setValue(customer['id']);
      this.dataService.customerDetails = {};
      this.initialDetailsOnpartySelected(customer['id']);
    }
  }

  checkTripChallanExist(value){
		this.doTripChallanExists = value
	}

	checkChallanExist(value){
		this.doChallanExists = value
	}

  getdefaultBank(id){
    let params={
      is_account :'False',
      is_tenant :'False',
      remove_cash_account:'True'
    }
		this._revenueService.getDefaultBank(id,params).subscribe((data)=>{			
			this.initialValues.bank_account=getBlankOption();
      if(data['result']){
        this.addBillOFSupplyForm.get('bank_account').setValue(data['result'].id);
        this.initialValues.bank_account['label']=data['result'].name;
      }
	
		})
	}

  buildForm() {
    this.addBillOFSupplyForm = this._fb.group({
      party: [
        '',
        Validators.required
      ],
      place_of_supply: [''],
      signature:[''],
      employee: [
        ''
      ],
      reference_no:['',[Validators.pattern(this.pattern.VALIDATION_PATTERN.ALPHA_NUMERIC2)]],
			contact_person:[null],
      bos_number: [
        '',
        Validators.required
      ],
      bos_date: [
        null,
        Validators.required
      ],
      due_date: [
        null
      ],
      hsn_code: [
        '',[Validators.pattern(this.alphaNumericPattern)]
      ],
      payment_term: [
        null
      ],
      bank_account: [
        null
      ],
      adjustment_account: [
        null
      ],
      adjustment_amount: [
        0
      ],
      adjustment_choice: [
        0
      ],
      disclaimer: [
				null
			],
      narrations: [
        ''
      ],
      is_roundoff: [
				true
			],
      terms_and_condition : [null],
      item_challan: this._fb.array([]),
      trip_challan: this._fb.array([]),
      item_others: this._fb.array([]),
      address: this._fb.array([
        this._fb.group({
          address_line_1: [
            ''
          ],
          address_type: [
            ''
          ],
          address_type_index: 0,
          city: [
            ''
          ],
          district: [
            ''
          ],
          document: [],
          pincode: [
            null
          ],
          state: [
            ''
          ],
          street: [
            ''
          ]
        }),
        this._fb.group({
          address_line_1: [
            ''
          ],
          address_type: [
            ''
          ],
          address_type_index: 1,
          city: [
            ''
          ],
          district: [
            ''
          ],
          document: [],
          pincode: [
            null
          ],
          state: [
            ''
          ],
          street: [
            ''
          ]
        })
      ])
    });
    if(!this.bill_id){
      this.buildOtherItems([
        {}
      ]);
    }

    this.setOtherValidators();
		this.setChallanValidators();
		this.setAdusjtmentAmountValidator();
  }
  onpaymentTermSelected(termId) {
		if (termId) {
			this.selectedPaymentTerm = getObjectFromList(termId, this.paymentTermList);
			this.inv_date = this.addBillOFSupplyForm.controls['bos_date'].value;
      this.addBillOFSupplyForm.controls['due_date'].setValidators([Validators.required]);
      this.addBillOFSupplyForm.controls['due_date'].updateValueAndValidity();
      this.isDueDateMan = true;
      if(termId==this.paymentTermCustom){
        this.addBillOFSupplyForm.controls['due_date'].setValue(
          PaymentDueDateCalculator(this.inv_date, this.selectedParty['terms_days']));
      }else{
        this.addBillOFSupplyForm.controls['due_date'].setValue(
          PaymentDueDateCalculator(this.inv_date, this.selectedPaymentTerm ? this.selectedPaymentTerm.value : ''));
      }
		
		}
	}
  onCalendarChangePTerm(billDate) {
		if (billDate) {
			this.addBillOFSupplyForm.controls['due_date'].patchValue(null);
			this.minDate = getMinOrMaxDate(billDate);
		}
		let existingTerm = this.addBillOFSupplyForm.controls['payment_term'].value;
		if (existingTerm)
			this.onpaymentTermSelected(existingTerm);
	}
  onDueDateChange() {
		let item = this.paymentTermList.filter((item: any) => item.label == 'Custom')[0]				
		this.initialValues.paymentTerm = { label: item.label, value: item.id };
		this.addBillOFSupplyForm.get('payment_term').setValue(item.id)
	} 
  clickOutToHide(e){
    if(!e.target.className.includes('saveButton')){
			this.saveButton = false;
		}
  }

  getTersmAndConditionList() {
		this._revenueService.getTersmAndConditionList('bos').subscribe((response: any) => {
		  this.tersmAndConditions = response.result['tc_content'];
		});
	}

  buildChallan(items: any = []) {
    const challans = this.addBillOFSupplyForm.controls['item_challan'] as UntypedFormArray;
    const existingchallan = challans.value;
    challans.controls = [];
    challans.setValue([]);
    this.challansList = [];
    this.isTPEmpty = checkEmptyDataKey(items, "transporter_permit_no")
    items.forEach((item) => {
      let arritem = getObjectFromList(item.id, existingchallan)
      if (arritem) {
        item.tax = arritem.tax;
        item.adjustment = arritem.adjustment;
      }
      challans.push(this.addChallan(item));
      this.challansList.push(item);
    });
  }

  buildTripChallans(items: any = []) {
		const challans = this.addBillOFSupplyForm.controls['trip_challan'] as UntypedFormArray;
		const existingchallan = challans.value;
		challans.controls = [];
		challans.setValue([]);
		this.tripChallansList = [];
    this.isWOEmpty = checkEmptyDataKey(items, "work_order_no")
		items.forEach((item) => {
			let arritem = getObjectFromListByKey('trip', item.trip, existingchallan);
			if (arritem) {
				item.adjustment = arritem.adjustment;
			}
			challans.push(this.addTripChallan(item));
			this.tripChallansList.push(item);
		});
	}

  buildOtherItems(items: any = []) {
    const otherItems = this.addBillOFSupplyForm.controls['item_others'] as UntypedFormArray;
    items.forEach((item) => {
      otherItems.push(this.addOtherItem(item));
    });
  }

  addOtherItem(item) {
    const form = this._fb.group({
      id: [
        item.id || ''
      ],
      item: [
        item.item || null
      ],
      quantity: [
        item.quantity || 0
      ],
      units: [
        item.units || null
      ],
      unit_cost: [
        item.unit_cost || 0
      ],
      amount: [
        item.amount || 0
      ],
      discount: [
        item.discount || 0
      ],
      total_amount: [
        item.total_amount || 0
      ]
    });
    return form;
  }

  resetOtherExceptItem(absControl: AbstractControl, index){
		absControl.patchValue({units: null, unit_cost: 0.00, discount: 0.00, total_amount: 0.00,
							  quantity: 0.000, amount: 0.00});
		this.initialValues.units[index] = getBlankOption();
  }

  resetOther(formGroup: UntypedFormGroup, index){
		const otherItems = this.addBillOFSupplyForm.controls['item_others'] as UntypedFormArray;
		if (otherItems.length == 1 && index == 0) {
		}

		formGroup.patchValue({units: null, unit_cost: 0.00, discount: 0.00, total_amount: 0.00,
							  quantity: 0.000, amount: 0.00, item: null});
		this.initialValues.units[index] = getBlankOption();
    this.initialValues.items[index] = getBlankOption();

    this.calculateItemOther(index);
	}

  addChallan(item) {
    return this._fb.group({
      id: [
        item.id || ''
      ],
      created_at: [
        item.created_at || ''
      ],
      challan_no: [
        item.challan_no || ''
      ],
      final_weight: [
        item.final_weight || 0
      ],
      rate_per_unit: [
        item.rate_per_unit || 0
      ],
      net_receiveable_amount: [
        item.net_receiveable_amount || 0
      ],
      challan: [
        item.id || ''
      ],
      adjustment: [
        item.adjustment || 0
      ],
      total_amount: [
        item.net_receiveable_amount || 0
      ],
      narration: [
				item.narration || ''
			],
			additionalDetails: [
				false
      ],
      transporter_permit_no : [
				item.transporter_permit_no || ""
			]
    });
  }

  addTripChallan(item) {
		return this._fb.group({
			id: [
				item.id || null
			],
			date: [
				item.date || null
			],
			vehicle: [
				item.vehicle || null
			],
      work_order_no: [
				item.work_order_no || ''
			],
			lr_no: [
				item.lr_no || ''
			],
			dn_date: [
				item.dn_date || null
			],
			freights: [
				item.freights || 0.00
			],
			charges: [
				item.charges || 0.00
			],
			deductions: [
				item.deductions || 0.00
			],
      advance:[item.advance||0.00],
      balance:[item.balance||0.00],
			trip: [
				item.trip, [Validators.required]
			],
			adjustment: [
				item.adjustment || 0.00
			],
			total_amount: [
				0.00
			]
		});
	}

  removeItemChallan(index) {
    const challan = this.addBillOFSupplyForm.controls['item_challan'] as UntypedFormArray;
    challan.removeAt(index);
  }

  removeOtherItem(index) {
    const otherItems = this.addBillOFSupplyForm.controls['item_others'] as UntypedFormArray;
    this.initialValues.items.splice(index, 1);
		this.initialValues.units.splice(index, 1);
    otherItems.removeAt(index);
    this.calculationsChanged();
  }

	addMoreOtherItem() {
		const otherItems = this.addBillOFSupplyForm.controls['item_others'] as UntypedFormArray;
    this.initialValues.units.push(getBlankOption());
    this.initialValues.items.push(getBlankOption());
    otherItems.push(this.addOtherItem({}));
  }

  emptyOtherItems(){
		this.initialValues.items = [];
		this.initialValues.units = [];
	}

  clearAllOtherItems() {
    const otherItems = this.addBillOFSupplyForm.controls['item_others'] as UntypedFormArray;
    otherItems.reset();
    otherItems.controls = [];
    this.emptyOtherItems();
		this.addMoreOtherItem();
		this.calculationsChanged();
	}

  clearChallanItems() {
		const challanItems = this.addBillOFSupplyForm.controls['item_challan'] as UntypedFormArray;
		challanItems.controls.forEach((controls, index) => {
			controls.get('adjustment').patchValue(0);
		});
		this.calculationsChanged();
	}

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  onClenderChangeBoSDate(event) {
  }

  getOptionList() {
    this._commonService
      .getStaticOptions('gst-treatment,tax,item-unit,payment-term')
      .subscribe((response) => {
        this.treatmentList = response.result['gst-treatment'];
        this.paymentTermList = response.result['payment-term'];
        this.staticOptions.itemUnits = response.result['item-unit'];
      });
  }

  getMaterialList() {
    this._revenueService.getMaterials().subscribe((response) => {
      if (response !== undefined) {
        this.staticOptions.materialList = response.result;
      }
    });
  }

  getEmployeeList() {
    this._employeeService.getEmployeeList().subscribe((employeeList) => {
      this.employeeList = employeeList;
    });
  }

  getPlaceOfSupply() {
    this._taxService.getTaxDetails().subscribe(result=>{
      this.PlaceOfSupplyStateList=result.result['pos'];
    })
  }

  getBankList(){
    this._commonService.getBankDropDownList().subscribe((stateData) => {
			if (stateData !== undefined) {
				this.bankList = stateData.result;
			}
		});
  }


	getDisclaimerOptions() {
		this._revenueService.getDisclaimerOptions().subscribe((response) => {
			this.disclaimerList = response.result;
		});
  }

  getExpenseAccountsAndSetAccount() {
		this._revenueService.getAccounts('Expense,Other Expense,Cost of Services / COGS').subscribe((response) => {
			if (response !== undefined) {
				this.expenseAccountList = response.result;
        this.initialValues.adjustmentAccount = this.afterTaxAdjustmentAccount;
        this.addBillOFSupplyForm.get('adjustment_account').setValue(this.afterTaxAdjustmentAccount.value);
			}
		});
  }

  getPartyList() {
    const ClientPramas = '0';
    this._partyService.getPartyList('',ClientPramas).subscribe((response) => {
      this.partyList = response.result;
    });
  }

  onPartySelected() {
    const party = this.addBillOFSupplyForm.get('party').value;
    this._partyService.getPartyAdressDetails(party).subscribe((response) => {
      this.customerDetails = response['result']
			this.creditRemaining.check_credit = this.customerDetails.check_credit
			this.creditRemaining.credit_remaining = this.customerDetails.credit_remaining
			if (this.creditRemaining.check_credit) {
				if (this.creditRemaining.credit_remaining > 0) {
					this.initialDetailsOnpartySelected(party);
				} else {
					this.creditLimit.msg = 'The customer has reached the credit limit, Remaining Credit Amount: ' + this.currency_type?.symbol + " "+  this.creditRemaining.credit_remaining + ', Do you still want to continue ?';
					this.creditLimit.open = true;
				}
			} else {
				this.initialDetailsOnpartySelected(party);
			}

    });
  }


  initialDetailsOnpartySelected(ele){
    this.apiError = '';
    if (ele === '') {
      this.selectedParty = null;

      this.partyId = null;
      return;
    }
    this.getdefaultBank(ele)

    this.initialValues.gstTreatment = {};
    this.initialValues.placeOfSupply = {};
    this.initialValues.paymentTerm = {};
    const x = ele;
    this.getContactPersonList(x)
    this._partyService.getPartyAdressDetails(ele).subscribe((response) => {
      this.selectedParty = response.result;
      if(isValidValue(this.selectedParty.tax_details) && this.isPlaceOfSupply){
        this.addBillOFSupplyForm.controls['place_of_supply'].setValue(this.selectedParty.tax_details.place_of_supply);
        this.gstin =response.result.tax_details.gstin;
      }
      this.partyId = x;
      this.addBillOFSupplyForm.controls['address'].patchValue(this.selectedParty.address);
      this._revenueService.sendPartyIntime(this.partyId);
      if(this.tripId){
        this._revenueService.getTripChallanListByParty(x).subscribe((response) => {
          let selectedTripChallan=[];
          let tripChallanList = [];
          tripChallanList = response['result'];
          if(tripChallanList.length>0){
            tripChallanList.forEach(item=>{
              if(item.trip==this.tripId){
                selectedTripChallan.push(item)
              }
            })
            this.tripChallansSelected(selectedTripChallan);
          }
      });
      }

      if(isValidValue(this.selectedParty.terms)){
        this.addBillOFSupplyForm.controls['payment_term'].setValue(this.selectedParty.terms.id);
        this.initialValues.paymentTerm={value:this.selectedParty.terms.id,label:this.selectedParty.terms.label};
        this.onpaymentTermSelected(this.selectedParty.terms.id);
      }else{
      this.addBillOFSupplyForm.controls['payment_term'].setValue('');
      this.addBillOFSupplyForm.controls['due_date'].setValue(null);
      this.initialValues.paymentTerm={}
      }
      if(this.isPlaceOfSupply){
        this.initialValues.placeOfSupply['value'] = this.selectedParty.tax_details.place_of_supply ? this.selectedParty.tax_details.place_of_supply : '';
        this.initialValues.placeOfSupply['label'] = this.selectedParty.tax_details.place_of_supply ? this.selectedParty.tax_details.place_of_supply : '';
      }

    });
    const challans = this.addBillOFSupplyForm.controls['item_challan'] as UntypedFormArray;
    challans.controls = [];
    challans.setValue([]);
    this.challansList = [];

    const tripChallans = this.addBillOFSupplyForm.controls['trip_challan'] as UntypedFormArray;
    tripChallans.controls = [];
		tripChallans.setValue([]);
    this.tripChallansList = [];
    this.calculationsChanged();
  }

  tripChallansSelected(ele) {


		this.apiError = '';

		this.tripChallanModelInline = false;
		if (ele.length > 0){
    this.totals.advanceTotal =0;
    this.totals.fuelTotal  =0;
    this.totals.battaAdvance =0;
			this.tripChallanModelInline = true;
		}

		this.buildTripChallans(ele);
		this.calTripChallan();
		if (this.addBillOFSupplyForm.get('trip_challan').controls.length) {
			this.addBillOFSupplyForm.controls['hsn_code'].setValidators([Validators.required,Validators.pattern(this.alphaNumericPattern)]);
			this.addBillOFSupplyForm.controls['hsn_code'].setValue(this.hsn_code);
			this.addBillOFSupplyForm.controls['hsn_code'].updateValueAndValidity({ onlySelf: true });
		} else {
			this.addBillOFSupplyForm.controls['hsn_code'].clearValidators();
			this.addBillOFSupplyForm.controls['hsn_code'].reset('');
			this.addBillOFSupplyForm.controls['hsn_code'].updateValueAndValidity();
		}
	}

  calculationsChanged() {
    const challans = this.addBillOFSupplyForm.controls['item_challan'] as UntypedFormArray;
    const tripChallans = this.addBillOFSupplyForm.controls['trip_challan'] as UntypedFormArray;
    const otherItems = this.addBillOFSupplyForm.controls['item_others'] as UntypedFormArray;
    this.totals.subtotal_challan = 0;
    this.totals.subtotal_others = 0;
    this.totals.billofSupplyBalance=0;
    this.totals.totalAdvance =0;
    this.totals.subtotal = 0;
    this.totals.total = 0;
    this.totals.taxTotal = 0;
    otherItems.controls.forEach((item, index) => {
      this.totals.subtotal_others += Number(item.get('total_amount').value);
    });

    challans.controls.forEach((challan, index) => {
      this.totals.subtotal_challan += Number(challan.get('total_amount').value);
    });
    tripChallans.controls.forEach((challan, index) => {
      this.totals.subtotal_challan += Number(challan.get('total_amount').value);
      challan.get('balance').setValue(Number(challan.get('total_amount').value)-Number(challan.get('advance').value))
      this.totals.totalAdvance = (Number(this.totals.totalAdvance) + Number(challan.get('advance').value)).toFixed(3);
    });

    this.calculateTotals();
  }

  calculateTotals() {
    let adjestmentAmount = 0;
    this.totals.adjustment = Number(adjestmentAmount).toFixed(3);
    this.totals.subtotal_others = (this.totals.subtotal_others).toFixed(3);
    this.totals.subtotal_challan = (this.totals.subtotal_challan).toFixed(3);
    this.totals.subtotal = (Number(this.totals.subtotal_challan) + Number(this.totals.subtotal_others)).toFixed(3);
    if (this.addBillOFSupplyForm.controls['adjustment_choice'].value == 0) {
      adjestmentAmount = this.totals.subtotal * this.addBillOFSupplyForm.controls['adjustment_amount'].value / 100;
    } else {
      adjestmentAmount = this.addBillOFSupplyForm.controls['adjustment_amount'].value;
    }

    this.totals.adjustment = Number(adjestmentAmount).toFixed(3);
    this.totals.total = (Number(this.totals.subtotal) + Number(adjestmentAmount)).toFixed(3);
    this.roundOffTotalAmount();
    this.totals.billofSupplyBalance = (Number(this.totals.total) - Number(this.totals.totalAdvance)).toFixed(3);

  }

  challansSelected(ele) {
    this.apiError = '';

    this.challanModalInline = false;
    if (ele.length > 0)
      this.challanModalInline = true;

    this.buildChallan(ele);
    this.calculationsChanged();
    if (this.addBillOFSupplyForm.get('item_challan').controls.length) {
      this.addBillOFSupplyForm.controls['hsn_code'].setValidators([Validators.required,Validators.pattern(this.alphaNumericPattern)]);
      this.addBillOFSupplyForm.controls['hsn_code'].setValue(this.hsn_code);
      this.addBillOFSupplyForm.controls['hsn_code'].updateValueAndValidity({ onlySelf: true });
    } else {
      this.addBillOFSupplyForm.controls['hsn_code'].clearValidators();
      this.addBillOFSupplyForm.controls['hsn_code'].reset('');
      this.addBillOFSupplyForm.controls['hsn_code'].updateValueAndValidity();
    }
  }

  setAdjustmentValue(index) {
    const challan = this.addBillOFSupplyForm.controls['item_challan'] as UntypedFormArray;
    const net_receiveable_amount = challan.controls[index].get('net_receiveable_amount').value;
    const adjustment = challan.controls[index].get('adjustment').value;
    challan.controls[index].get('total_amount').setValue((Number(net_receiveable_amount) + Number(adjustment)).toFixed(3));
    this.calculationsChanged();
  }

  setTripAdjustmentValue(index) {
    const challan = this.addBillOFSupplyForm.controls['trip_challan'] as UntypedFormArray;
    const net_receiveable_amount = Number(challan.controls[index].value.charges) +
                                   Number(challan.controls[index].value.freights) - Number(challan.controls[index].value.deductions)
    const adjustment = challan.controls[index].get('adjustment').value;
    challan.controls[index].get('total_amount').setValue((Number(net_receiveable_amount) + Number(adjustment)).toFixed(3));
    this.calculationsChanged();
  }

  calTripChallan() {
    const challan = this.addBillOFSupplyForm.controls['trip_challan'] as UntypedFormArray;
    challan.controls.forEach(ele => {
      const net_receiveable_amount = Number(ele.value.adjustment) + Number(ele.value.charges) +
      Number(ele.value.freights) - Number(ele.value.deductions)
      const adjustment = ele.get('adjustment').value;
      ele.get('total_amount').setValue((Number(net_receiveable_amount) + Number(adjustment)).toFixed(3));
    })
    this.calculationsChanged();
  }

  onMaterialSelected(ele, index) {
    const itemId = ele.target.value;
    if (itemId !== '') {
      const itemSelected = this.getItemById(itemId, this.staticOptions.materialList);
      const otherItems = this.addBillOFSupplyForm.controls['item_others'] as UntypedFormArray;
      const itemControl = otherItems.controls[index];

      this.resetOtherExceptItem(itemControl, index);
      itemControl.patchValue({
        units: itemSelected.unit ? itemSelected.unit.id : null,
        unit_cost: itemSelected.rate_per_unit
      });

      if (itemSelected.unit){
        this.initialValues.units[index] = {label: itemSelected.unit.label, value: itemSelected.unit.id }
      }
      this.calculateItemOther(index);
    }
  }

  getItemById(id: String, list: []): any {
    return list.filter((item: any) => item.id === id)[0];
  }

  // auto calulate rate or amount or quantity if any two value is entered
	calculateItemOthersAmount(index) {
		const otherItems = this.addBillOFSupplyForm.controls['item_others'] as UntypedFormArray;
    let quantity = otherItems.at(index).get('quantity').value;
		let rate = otherItems.at(index).get('unit_cost').value;
		let setamount = otherItems.at(index).get('amount');
		const amount = (quantity * rate).toFixed(3);
    setamount.setValue(amount);
    this.calculateOtherFinalAmount(index);
  }

  calculateOtherFinalAmount(index) {
    const otherItems = this.addBillOFSupplyForm.controls['item_others'] as UntypedFormArray;
    let amount = Number(otherItems.at(index).get('amount').value);
    let discount = Number(otherItems.at(index).get('discount').value);
    let totalAmountControl = otherItems.at(index).get('total_amount');
    const totalAmount = (Number(amount) - Number(discount)).toFixed(3);
    totalAmountControl.setValue(totalAmount);
    this.calculationsChanged();
  }

	calculateItemOther(index) {
		const otherItems = this.addBillOFSupplyForm.controls['item_others'] as UntypedFormArray;
		let quantity = otherItems.at(index).get('quantity');
		let rate = otherItems.at(index).get('unit_cost');
		let amount = Number(otherItems.at(index).get('amount').value);

		if (amount == 0) {
		  quantity.setValue(0.000);
		}

		if (rate.value == 0 && quantity.value == 0) {
      this.calculateOtherFinalAmount(index);
		  return;
		}

		if (quantity.value == 0 && rate.value != 0) {
		  const setFuelQuantity = (amount / rate.value).toFixed(3);
      quantity.setValue(setFuelQuantity);
      this.calculateOtherFinalAmount(index);
		  return;
    }

		const setRate = (amount / quantity.value).toFixed(3);
    rate.setValue(setRate);
    this.calculateOtherFinalAmount(index);
	}

  toggleItemOtherFilled(enable: Boolean = false) {
		const otherItems = this.addBillOFSupplyForm.controls['item_others'] as UntypedFormArray;
		otherItems.controls.forEach(ele => {
			if (enable) {
				ele.enable();
			} else {
				if (ele.value.item == null && ele.value.quantity == 0  && ele.value.units == null
				    && ele.value.unit_cost == 0 && ele.value.discount == 0) {
					ele.disable();
				}
			}
		});
	}

  submitBillOfSupply() {
  	this.toggleItemOtherFilled();
		const form = this.addBillOFSupplyForm;
		// this.patchValue();
		this.apiError = '';
		if (this.totals.total <= 0) {
			this.apiError = 'Please check detail, Total amount should be greater than zero'
			form.setErrors({ 'invalid': true });
      this._scrollToTop.scrollToTop();
			window.scrollTo(0, 0);
		}
		if (form.valid) {
      if (this.creditRemaining.check_credit && this.creditRemaining.credit_remaining > 0) {
				const totalDebitAmount = Number(this.totals.total);
				if ((this.creditRemaining.credit_remaining - totalDebitAmount) < 0) {
					this.creditOnsaveLimit.msg = 'The customer has reached the credit limit, Remaining Credit Amount: ' + this.currency_type?.symbol +" "+ this.creditRemaining.credit_remaining + ', Do you still want to continue ?';
					this.creditOnsaveLimit.open = true;
				} else {
					this.saveBillOfSupply();
				}
			} else {
				this.saveBillOfSupply();
			}
		} else {
			this.setAsTouched(form);
      this._scrollToTop.scrollToTop();
			this.setFormGlobalErrors();
    }
    this.toggleItemOtherFilled(true);
  }

  saveBillOfSupply(){
    this.apiError = '';
    const form = this.addBillOFSupplyForm;
    if(this.bill_id){
      this.apiHandler.handleRequest(this._billOfSupplyService.saveBillOfSupplyById(this.buildRequest(form), this.bill_id), 'BOS updated successfully!').subscribe(
        {
          next: () => {
            this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.BOS);
            this._router.navigate([this.prefixurl + '/income/billofsupply/list'], { queryParams: { pdfViewId: this.bill_id } });
          },
          error: (err) => {
            this.apiError = '';
            if (err.error.status == 'error') {
              this.apiError = err.error.message;
              this._scrollToTop.scrollToTop();
              window.scrollTo(0, 0);
            }
          }
        }
      );
    }else{
      this.apiHandler.handleRequest(this._billOfSupplyService.saveBillOfSupply(this.buildRequest(form)), 'BOS added successfully!').subscribe(
        {
          next: () => {
            this.updateGstinInParty();
            this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.BOS);
            this._router.navigate([this.prefixurl + '/income/billofsupply/list']);
          },
          error: (err) => {
            this.apiError = '';
            if (err.error.status == 'error') {
              this.apiError = err.error.message;
              this._scrollToTop.scrollToTop();
              window.scrollTo(0, 0);
            }
          }
        }
      );
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

  getGstin($event) {
		this.showGstinModal = false;
	}

  updateGstinInParty() {
    if(this.isPlaceOfSupply){
      let request = {
        place_of_supply: this.addBillOFSupplyForm.controls['place_of_supply'].value
      }
      let apiUrl = TSAPIRoutes.edit_gst_in_party + this.partyId + '/';
      if (request && request.place_of_supply)
        this._commonService.updateGstinInParty(apiUrl, request).subscribe();
    }

  }

  setDefaultGstin($event) {
		if ($event) {
			this.showGstinModal = false;
		}
  }

  buildRequest(form: UntypedFormGroup) {
    form.controls['bos_date'].setValue(changeDateToServerFormat(form.controls['bos_date'].value));
    form.controls['due_date'].setValue(changeDateToServerFormat(form.controls['due_date'].value));
    (this.addBillOFSupplyForm.controls['address'] as UntypedFormArray).controls[0].get('address_type').setValue(0);
    (this.addBillOFSupplyForm.controls['address'] as UntypedFormArray).controls[1].get('address_type').setValue(1);
    return form.value;
  }

  saveAsDraft() {
    if (this.creditRemaining.check_credit && this.creditRemaining.credit_remaining >= 0) {
      const totalInvoiceAmount = Number(this.totals.total);
      if ((this.creditRemaining.credit_remaining - totalInvoiceAmount) < 0) {
        this.creditOnsaveAsDraftLimit.msg = 'The customer has reached the credit limit, Remaining Credit Amount:' + this.currency_type?.symbol + this.creditRemaining.credit_remaining + ', Do you still want to continue ?';
        this.creditOnsaveAsDraftLimit.open = true;
      } else {
        this.bosOnSaveDraft();
      }
    } else {
      this.bosOnSaveDraft();
    }
  }


  bosOnSaveDraft(){
    this.toggleItemOtherFilled()
		const form = this.addBillOFSupplyForm as UntypedFormGroup;
		form.markAsUntouched();
    if(this.bill_id){
      this.apiHandler.handleRequest(this._billOfSupplyService.saveBillOfSupplyByIdDraft(this.buildRequest(form), this.bill_id),'BOS draft updated successfully!').subscribe((response) => {
        this._analytics.addEvent(this.analyticsType.UPDATED,this.analyticsScreen.BOS);
        this._router.navigate([ this.prefixurl+'/income/billofsupply/list']);
      });
    }else{
      if (this.partyId) {
        this.apiHandler.handleRequest(this._billOfSupplyService.saveBillOfAsDraft(this.buildRequest(form)), 'BOS draft added successfully!').subscribe(
          {
            next: () => {
              this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.BOS);
              if (this.addBillOFSupplyForm.controls.party.value) {
                this.updateGstinInParty();
              }
              this._router.navigate([this.prefixurl + '/income/billofsupply/list']);
            }
          }
        );
      }
      else {
        this.apiError = 'Please select party';
        window.scrollTo(0, 0);
        form.get('party').markAsTouched();
        this._scrollToTop.scrollToTop();
      }
    }

		this.toggleItemOtherFilled(true)
  }




  getAddress(event) {
    this.addBillOFSupplyForm.controls['address'].patchValue(event);
  }

  addValueToMaterial($event) {
    this.materialParams = {
      name: $event,
      unit: null,
      rate_per_unit: 0.0,
    };
  }

  addValueToDisclaimer($event) {
		this.disclaimerParams = {
			name: $event,
			description: ''
		};
	}

	addDropDownMaterial($event) {
		if ($event.status)
		  this._revenueService.getMaterials().subscribe((response) => {
			if (response && response.result && response.result.length > 0) {
			  this.staticOptions.materialList = response.result;
			  if (this.ItemDropdownIndex != -1) {
				this.initialValues.items[this.ItemDropdownIndex] = {value: $event.id, label: $event.label};
				this.addBillOFSupplyForm.controls.item_others.at(this.ItemDropdownIndex).get('item').setValue($event.id);
        this.addBillOFSupplyForm.controls.item_others.at(this.ItemDropdownIndex).get('unit_cost').setValue($event.rate_per_unit);
        this.addBillOFSupplyForm.controls.item_others.at(this.ItemDropdownIndex).get('units').setValue($event.unitId);
        this.initialValues.units[this.ItemDropdownIndex] = { value : $event.unitId, label : $event.unitName}
				this.ItemDropdownIndex = -1;
			  }
			}
		  });
    }

    setDisclaimer($event) {
      if ($event.status)
        this._revenueService.getDisclaimerOptions().subscribe((response) => {
        if (response && response.result && response.result.length > 0) {
          this.disclaimerList = response.result;
          this.initialValues.disclaimer = {value: $event.id, label: $event.label};
          this.addBillOFSupplyForm.get('disclaimer').setValue($event.id);
        }
        });
      }

  getSuggestedIds() {
    this._billOfSupplyService.getSuggestedIds('bos').subscribe( (response) => {
      this.addBillOFSupplyForm.controls.bos_number.setValue(response.result.bos);
    });
  }

  openAddItemModal($event, index) {
		if ($event)
			this.ItemDropdownIndex = index;
			this.showAddItemPopup = {name: this.materialParams.name, status: true};
	}

	closeItemPopup(){
		this.showAddItemPopup = {name: '', status: false};
  }

  openAddDisclaimerModal($event) {
		if ($event)
			this.showAddDisclaimerPopup = {name: this.disclaimerParams.name, status: true};
  }

  closeDisclaimerPopup(){
		this.showAddDisclaimerPopup = {name: '', status: false};
  }

  onRoundOffEvent($event) {
		if ($event.checked) {
			const roundOffAmounts = roundOffToCeilFloor(this.totals.total);
			this.totals.roundOffAmount = roundOffAmounts.roundOffAmount;
			this.totals.total = roundOffAmounts.roundedOffAmount;
		} else {
			this.totals.roundOffAmount = 0;

		}
    this.calculationsChanged();
  }


	roundOffTotalAmount() {
		if (this.addBillOFSupplyForm.get('is_roundoff').value) {
			const roundOffAmounts = roundOffToCeilFloor(this.totals.total);
			this.totals.roundOffAmount = roundOffAmounts.roundOffAmount;
			this.totals.total = roundOffAmounts.roundedOffAmount;
		} else {
			this.totals.roundOffAmount = 0;
		}
  }

   /* For  Opening the Party Modal */
   openAddPartyModal($event ) {
		if ($event)
			this.showAddPartyPopup = {name: this.partyNamePopup, status: true};
       }

  /* Adding the entered value to the list */
  addValueToPartyPopup(event){
    if (event) {
      this.partyNamePopup = event;
		  }
  }

  /* For Displaying the party name in the subfield  */
  addPartyToOption($event) {
    if ($event.status) {
	  this.getPartyList();
	  this.initialValues.party = {value: $event.id, label: $event.label};
        this.addBillOFSupplyForm.get('party').setValue($event.id);

    }
  }

  /* After closing the party modal to clear all the values */
  closePartyPopup(){
		this.showAddPartyPopup = {name: '', status: false};
	}



	// set validators for other expense in any value is added
	setOtherValidators() {
		const item_other = this.addBillOFSupplyForm.controls['item_others'] as UntypedFormArray;
		this.otherExpenseValidatorSub = item_other.valueChanges.pipe(debounceTime(500)).subscribe((items) => {
		  items.forEach((key, index) => {
			const item = item_other.at(index).get('item');
			const unit_cost = item_other.at(index).get('unit_cost');
			const quantity = item_other.at(index).get('quantity');
			const amount = item_other.at(index).get('amount');
			const discount = item_other.at(index).get('discount');

			item.setValidators(Validators.required);
			amount.setValidators(Validators.min(0.01));
			discount.setValidators(TransportValidator.lessThanEqualValidator(Number(amount.value)));
			if (items.length == 1) {
			  if (!Number(unit_cost.value) && !item.value && !Number(discount.value) && !Number(quantity.value) && !Number(amount.value)) {
				item.clearValidators();
				amount.clearValidators();
				discount.clearValidators();
			  }
			}
			item.updateValueAndValidity({ emitEvent: true });
			amount.updateValueAndValidity({ emitEvent: true });
			discount.updateValueAndValidity({ emitEvent: true });
		  });
		});
	  }


	setChallanValidators() {
		let item_challans = this.addBillOFSupplyForm.controls['item_challan'] as UntypedFormArray;
		this.challanValidatorSub = item_challans.valueChanges.pipe(debounceTime(500)).subscribe((item_challan) => {

			item_challan.forEach((key, index) => {
				const adjustment = item_challans.at(index).get('adjustment');
				const total_amount = Number(item_challans.at(index).get('total_amount').value);
				adjustment.setValidators(TransportValidator.createPositiveValidator(total_amount));
				adjustment.updateValueAndValidity({ emitEvent: true });
			});
		});

	}

	setAdusjtmentAmountValidator(){
		let adjustmentAmount = this.addBillOFSupplyForm.get('adjustment_amount');
		this.adjustmentValidatorSub = adjustmentAmount.valueChanges.pipe(debounceTime(500)).subscribe((amount) => {

		const adjustmentAmount = this.addBillOFSupplyForm.get('adjustment_amount');
		const adjustmentChoice = this.addBillOFSupplyForm.get('adjustment_choice');
		const adjustmentAfterSubtotal = this.totals.adjustment;
		const totalAmount = this.totals.total;
		let validators: any  = [];

		if (adjustmentAfterSubtotal < 0 && totalAmount < 0) {
			validators.push(TransportValidator.createPositiveValidator(totalAmount))
		}

		if (adjustmentChoice.value == 0) {
			validators.push(Validators.max(100));
			validators.push(Validators.min(-100));
		}
		adjustmentAmount.setValidators(validators);
		adjustmentAmount.updateValueAndValidity({emitEvent: true})
	});
	}

  editTripFreight(id: string = "", workOrderNumber){
		if (id) {
			this._newTripV2Service.getTripProfitandLossDetails(id).subscribe((res: any) => {
				let data = res.result
				data['id'] = id
				data['customerId'] = this.addBillOFSupplyForm.get('party').value;
				this.showFreightPopup = {
					type: 'client-freights',
					show: true,
					data: res.result,
					extras: { id: workOrderNumber }
				}
			})
		}
	}


	setFreightValueToChallan(tripId, value) {
		let tripChallans = this.addBillOFSupplyForm.get('trip_challan') as UntypedFormArray;
		let formChallan = tripChallans.controls.filter(ele => ele.value.trip == tripId)[0]
		if (formChallan) {
			formChallan.get('freights').setValue(value);
			this.calTripChallan();
		}
	}

	editCompleteTripFreight($event){
    const tripId = this.showFreightPopup.data['id'];
		if (tripId) {
			this._tripService.getTripSubDetails(tripId, 'freights', { type: 'client-freights', operation: 'sum' }).subscribe((res: any) => {
				this.setFreightValueToChallan(tripId, res['result']);
			});
		}
		this.showFreightPopup = {
			type: '',
			show: false,
			data: {},
			extras: { id: '' },
		}
	}


	editTripAddBillCharges(id: string = "", extras: any = {}){
		if (id) {
			this._newTripV2Service.getTripProfitandLossDetails(id).subscribe((res: any) => {
				res['result']['status'] = -1
				res['result']['fl_status'] = -1
				let charges = res.result['revenue']['charges']
				charges['id'] = id
				extras.id = id
				this.showChargesPopup = {
					type: 'party-charge-bill',
					show: true,
					data: cloneDeep(res.result['revenue']['charges']),
					extras: extras
				}
			})
		}
	}

	editTripReduceBillCharges(id: string = "", extras: any = {}){
    if (id) {
			this._newTripV2Service.getTripProfitandLossDetails(id).subscribe((res: any) => {
				res['result']['status'] = -1
				res['result']['fl_status'] = -1
				extras.id = id
				let charges = res.result['expense']['charges']
				charges['id'] = id
				this.showChargesPopup = {
					type: 'party-charge-reduce-bill',
					show: true,
					data: cloneDeep(res.result['expense']['charges']),
					extras: extras
				}
			})
		}
	}


	setAddChargeValueToChallan(tripId, value) {
		let tripChallans = this.addBillOFSupplyForm.get('trip_challan') as UntypedFormArray;
		let formChallan = tripChallans.controls.filter(ele => ele.value.trip == tripId)[0]
		if (formChallan) {
			formChallan.get('charges').setValue(value);
			this.calTripChallan();
		}
	}

	setReduceChargeValueToChallan(tripId, value) {
		let tripChallans = this.addBillOFSupplyForm.get('trip_challan') as UntypedFormArray;
		let formChallan = tripChallans.controls.filter(ele => ele.value.trip == tripId)[0]
		if (formChallan) {
			formChallan.get('deductions').setValue(value);
			this.calTripChallan();
		}
	}

	editCompleteTripCharges($event){
	if ($event){
		const tripId = this.showChargesPopup.data['id'];
		const type = this.showChargesPopup.type
		if (tripId && type == "party-charge-bill"){
			this._tripService.getTripSubDetails(tripId, 'charges', {type: 'add-bill-party', operation: 'sum'}).subscribe((res: any) => {
				this.setAddChargeValueToChallan(tripId, res['result']);
			});
		}

		if (tripId && type == "party-charge-reduce-bill"){
			this._tripService.getTripSubDetails(tripId, 'charges', {type: 'reduce-bill-party', operation: 'sum'}).subscribe((res: any) => {
				this.setReduceChargeValueToChallan(tripId, res['result']);
			});
		}
	}

	this.showChargesPopup = {
		type: '',
		show:false,
		data: {},
		extras: {id: ''},
		}
	}

  getBillOfSuplyById() {
    if (this._router.url.indexOf('edit') !== -1) {
      this.billofsupply_id = this._activatedRoute.params.subscribe(res => {
        this.billofsupply_id = res.billofsupply_id;
        this._billOfSupplyService.getBillOfSupplyById(this.billofsupply_id).subscribe((response) => {
          this.billOfSupplyDetailsById = response.result;
          this.totals.adjustment = this.billOfSupplyDetailsById.total_adjustment;
          this.totals.battaAdvance=Number(this.billOfSupplyDetailsById.trip_advance_data.batta).toFixed(3);
          this.totals.advanceTotal =Number(this.billOfSupplyDetailsById.trip_advance_data.advance).toFixed(3);
          this.totals.fuelTotal =Number(this.billOfSupplyDetailsById.trip_advance_data.fuel).toFixed(3);
          this.partyId = this.billOfSupplyDetailsById.party ? this.billOfSupplyDetailsById.party.id : null;
          if(this.partyId){
            this._partyService.getPartyAdressDetails(this.partyId).subscribe((response) => {
              this.selectedParty = response.result;
            });
          }
          
          this._partyService.getPartyAdressDetails(this.partyId).subscribe((response) => {
            this.gstin =response.result.tax_details.gstin;
          });
          this.totals.total = this.billOfSupplyDetailsById.total_amount
          this.partyNamePatch(this.billOfSupplyDetailsById);
          this.placeOfSupplyPatch(this.billOfSupplyDetailsById.place_of_supply);
          this.gstTreatmentPatch(this.billOfSupplyDetailsById);
          this.employeePatch(this.billOfSupplyDetailsById);
          this.paymentTermPatch(this.billOfSupplyDetailsById);
          this.itemOtherPatch(this.billOfSupplyDetailsById);
          this.patchSignature(this.billOfSupplyDetailsById.signature)
          this.bankAccountPatch(this.billOfSupplyDetailsById.bank_account);
          this.patchAdjustmentAccount(this.billOfSupplyDetailsById);
          this.patchDisclaimer(this.billOfSupplyDetailsById);
          this.patchContactPerson();
          this.patchTermsAndConditions(this.billOfSupplyDetailsById)
          this.patchFormValues(this.billOfSupplyDetailsById);
          this.calculationsChanged();
        });
      });
    }
  }

  partyNamePatch(vendorData) {
		if (vendorData.party) {
			this.initialValues.party['value'] = vendorData.party.id;
			this.initialValues.party['label'] = vendorData.party.display_name;
		} else {
			this.initialValues.party = getBlankOption();
		}
	}

  patchSignature(signature){
    if(signature){
        this.initialValues.digitalSignature['value']=signature.id
        this.initialValues.digitalSignature['label']=signature.name
    }else{
        this.initialValues.digitalSignature['label']=''
    }
}

	placeOfSupplyPatch(place_of_supply) {
		if (place_of_supply) {
			this.initialValues.placeOfSupply['value'] = place_of_supply;
			this.initialValues.placeOfSupply['label'] = place_of_supply;
		} else {
			this.initialValues.placeOfSupply = getBlankOption();
		}
	}

  patchTermsAndConditions(editCredit) {		
		if (editCredit.terms_and_condition) {
			this.initialValues.termsAndCondition['value'] = editCredit.terms_and_condition.id,
			this.initialValues.termsAndCondition['label'] = editCredit.terms_and_condition.name
		} else {
			this.initialValues.termsAndCondition = getBlankOption()
		}
	}


	gstTreatmentPatch(invoiceDetails) {
		if (invoiceDetails.gst_treatment) {
			this.initialValues.gstTreatment['value'] = invoiceDetails.gst_treatment.id;
			this.initialValues.gstTreatment['label'] = invoiceDetails.gst_treatment.label;
		} else {
			this.initialValues.gstTreatment = getBlankOption();
		}
	}

	employeePatch(invoiceDetails) {
		if (invoiceDetails.employee) {
			this.initialValues.employee['value'] = invoiceDetails.employee.id;
			this.initialValues.employee['label'] = invoiceDetails.employee.first_name + ' ' + invoiceDetails.employee.last_name;
		} else {
			this.initialValues.employee = getBlankOption();
		}
	}

	paymentTermPatch(invoiceDetails) {
		if (invoiceDetails.payment_term_meta) {
      this.isDueDateMan = true;
			this.initialValues.paymentTerm['value'] = invoiceDetails.payment_term_meta.id;
			this.initialValues.paymentTerm['label'] = invoiceDetails.payment_term_meta.label;
		} else {
			this.initialValues.paymentTerm = getBlankOption();
		}
  }

  patchDisclaimer(invoiceDetails){
		if (invoiceDetails.disclaimer) {
			this.initialValues.disclaimer['value'] = invoiceDetails.disclaimer.id,
			this.initialValues.disclaimer['label'] = invoiceDetails.disclaimer.name
		} else {
			this.initialValues.disclaimer = getBlankOption()
		}
	}


  bankAccountPatch(bankAccount) {
		if (bankAccount) {
			this.initialValues.bank_account['value'] = bankAccount.id;
			this.initialValues.bank_account['label'] = bankAccount.account_holder_name;
		} else {
			this.initialValues.bank_account = getBlankOption();
		}
	}


	itemOtherPatch(invoiceDetails) {
		invoiceDetails.other_items.forEach((ele, index) => {
			if (ele.item) {
				const obj = {
					value: ele.item.id,
					label: ele.item.name
				}
				this.initialValues.items.push(obj);
			} else {
				this.initialValues.items.push(getBlankOption());
			}

			if (ele.units) {
				const obj = {
					value: ele.units.id,
					label: ele.units.label
				}
				this.initialValues.units.push(obj);
			} else {
				this.initialValues.units.push(getBlankOption());
			}

		});
  }
	stopLoaderClasstoBody(){
		let body = document.getElementsByTagName('body')[0];
        body.classList.add('removeLoader');
	}
  patchAdjustmentAccount(bosDetails){
		if (bosDetails.adjustment_account) {
			this.initialValues.adjustmentAccount['value'] = bosDetails.adjustment_account.id,
			this.initialValues.adjustmentAccount['label'] = bosDetails.adjustment_account.name
		} else {
			this.initialValues.adjustmentAccount = this.afterTaxAdjustmentAccount;
		}
	}

  patchFormValues(data: any) {
		if (isValidValue(data)) {
			this.addBillOFSupplyForm.controls['bos_date'].setValue(data.bos_date);
      this.minDate=data.bos_date;
			this._revenueService.sendPartyIntime(data.party);
			data.party = isValidValue(data.party) ? data.party.id : '';

			this.addBillOFSupplyForm.controls['address'].patchValue(data.address);
			data.gst_treatment = isValidValue(data.gst_treatment) ? data.gst_treatment.id : '';
			data.employee = isValidValue(data.employee) ? data.employee.id : '';
			data.adjustment_choice = isValidValue(data.adjustment_choice.index) ? data.adjustment_choice.index : '';
      data.reason = isValidValue(data.reason) ? data.reason.id : '';
      data.bank_account = isValidValue(data.bank_account) ? data.bank_account.id : '';
      data.signature = isValidValue(data.signature) ? data.signature.id : '';
      data.adjustment_account = isValidValue(data.adjustment_account) ? data.adjustment_account.id : this.afterTaxAdjustmentAccount.value;
      data.disclaimer = isValidValue(data.disclaimer) ? data.disclaimer.id : null
      data.terms_and_condition = isValidValue(data.terms_and_condition) ? data.terms_and_condition.id : null
			const challans = this.addBillOFSupplyForm.controls['item_challan'] as UntypedFormArray;
			challans.controls = [];
			this.challansList = [];
      const trip_challan = this.addBillOFSupplyForm.controls['trip_challan'] as UntypedFormArray;
			trip_challan.controls = [];
			this.challansList = [];
			data.payment_term = isValidValue(data.payment_term) ? data.payment_term : '';
			// data.invoice = isValidValue(data.invoice) ? data.invoice.id : '';
			if (data.other_items.length > 0) {
				data.other_items.forEach((otherItem) => {
					otherItem.item = isValidValue(otherItem.item) ? otherItem.item.id : null;
					otherItem.units = isValidValue(otherItem.units) ? otherItem.units.id : null;
				});
				this.buildOtherItems(data.other_items);
			} else {
				this.buildOtherItems([
					{}
				]);
			}
			if (data.challan.length > 0) {
        this.challanModalInline = true;
				data.challan.forEach((challan) => {
					challan = isValidValue(challan) ? challan : '';
					challan.total = isValidValue(challan.total) ? challan.total : '';
				});
				this.buildChallan(data.challan);
			}
			else {
				this.challanModalInline = false;
			}
      if (data.trip_challan.length > 0) {
        this.tripChallanModelInline = true;
				data.trip_challan.forEach((challan) => {
					challan = isValidValue(challan) ? challan : '';
					challan.total = isValidValue(challan.total) ? challan.total : '';
				});
				this.buildTripChallans(data.trip_challan);
			}
			else {
				this.tripChallanModelInline = false;
			}
			this.addBillOFSupplyForm.patchValue(data);
		}
	}

  dataFromAdavnces(data){
    this.totals.battaAdvance=0;
    this.totals.advanceTotal =0;
    this.totals.fuelTotal =0;
    if(data){
      const tripId = this.showAdvancePopup.data['id'];
      let tripChallans = this.addBillOFSupplyForm.get('trip_challan') as UntypedFormArray;
      let formChallan = tripChallans.controls.filter(ele => ele.value.trip == tripId)[0]
      if (formChallan) {
        formChallan.get('advance').setValue(data.totalAdvances);
        this.calculationsChanged();
      }
      
    }


  }

  editTripAddAdvances(id: string = "", extras: any = {}){
    if (id) {
			this._tripService.getTripsDetails(id).subscribe((res: any) => {
				extras.id = id
				this.showAdvancePopup ={
				  type: '',
				  show: true,
				  data: res.result,
				  extras: extras
				}
			})
		}
  }



  getContactPersonList(id){
    this._partyService.getContactPersonList(id).subscribe(data=>{
	  this.contactPersonList = data['result'].contact_person;
	  if (!this.bill_id) {
		this.patchDefaultContactPerson()
	  }
	})
  }

  setContactPerson(contactPerson){
	if (!isValidValue(contactPerson)) return
	this.initialValues.contactperson = {label: contactPerson.display_name, value: contactPerson.id}
	this.addBillOFSupplyForm.get('contact_person').setValue(contactPerson.id)
  }

  clearContactPerson(){
    this.initialValues.contactperson = {label: "", value: ""}
    this.addBillOFSupplyForm.get('contact_person').setValue(null)
  }

  patchDefaultContactPerson(){
  this.clearContactPerson();
	const defaultContact = this.contactPersonList.filter((item)=> item.default == true)[0]
	if (defaultContact) {
		this.setContactPerson(defaultContact)
	}
  }

  patchContactPerson(){
	this.getContactPersonList(this.partyId)
	const contactPerson = this.billOfSupplyDetailsById.contact_person;
	if (!isValidValue(contactPerson)) return
  this.billOfSupplyDetailsById.contact_person = contactPerson.id
	this.setContactPerson(contactPerson)
  }

  getDigitalSignatureList(){
    this._commonService.getDigitalSignatureList().subscribe(data=>{
      this.digitalSignature = data['result']['data']
    })
  }

  onCreditLimit(e) {
		if (e) {
			this.initialDetailsOnpartySelected(this.addBillOFSupplyForm.get('party').value);
		} else {
			this.addBillOFSupplyForm.get('party').setValue(null);
			this.initialValues.party = getBlankOption();
			this.gstin = '';
		}
	}

	onCreditLimitOnSave(e) {
		if (e) {
			this.saveBillOfSupply();
		}
	}

	onCreditLimitOnSaveDraft(e) {
		if (e) {
			this.bosOnSaveDraft();
		}
	}

}
