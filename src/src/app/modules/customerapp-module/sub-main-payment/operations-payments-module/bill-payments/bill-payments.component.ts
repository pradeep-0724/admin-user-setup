import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormArray, AbstractControl, UntypedFormControl, Validators, FormArray } from '@angular/forms';
import { PartyService } from '../../../api-services/master-module-services/party-service/party.service';
import { isValidValue, getObjectFromList, getBlankOption } from 'src/app/shared-module/utilities/helper-utils';
import { OperationsPaymentService } from '../../../api-services/payment-module-service/payment-service/operations-payments.service';
import { Router, ActivatedRoute } from '@angular/router';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { normalDate } from 'src/app/shared-module/utilities/date-utilis';
import { defaultZero } from 'src/app/shared-module/utilities/currency-utils';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { ErrorList } from 'src/app/core/constants/error-list';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { BehaviorSubject } from 'rxjs';
import { TaxService } from 'src/app/core/services/tax.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { BillPaymentClass } from './bill-payments-class/bill-payments.class';
import { BillPaymentsClassService } from './bill-payments-class/bill-payments.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { TerminologiesService } from 'src/app/core/services/terminologies.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { RevenueService } from '../../../api-services/revenue-module-service/revenue-service/revenue.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { getEmployeeObject } from '../../../master-module/employee-module/employee-utils';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';
@Component({
	selector: 'app-edit-bill-payments',
	templateUrl: './bill-payments.component.html',
	styleUrls: [
		'./bill-payments.component.scss'
	],
})
export class BillPaymentsComponent extends BillPaymentClass implements OnInit, AfterViewInit, OnDestroy {
	editBillPaymentForm: UntypedFormGroup;
	employeeList: any = [];
	accountList: any = [];
	vendorList: any = [];
	list = [];
	vendorSelected: any = {};
	partyId: any;
	billPaymentsTotals: any = {
		amountPaid: 0,
		creditAvailed: 0,
		advanceAvailed: 0,
		total: 0,
		discountAmount: 0
	};
	advanceList: any = [];
	creditList: any = [];
	billList: any = [];
	labourList: any[] = [];
	foremanList: any = [];
	billPaymentId: any;
	billPaymentData: any;
	loadPage: boolean = false;
	isDomReady: boolean = false;
	removeSelectedCreditList: any = [];
	removeSelectedVendorAdvance: any = [];
	removeSelectedOutBills: any = [];
	removeSelectedOutBillsLabour: any = [];
	removeSelectedOutBillsForeman: any = [];
	apiError: any;
	currency_type;
	deductAmountDisabled: boolean = false;
	@ViewChild('alertMsg', { static: true })
	alertMsgRef: ElementRef;
	initialValues: any = {
		employee: {},
		vendor: {},
		paymentMode: {},
		digitalSignature: {},
		party: {}
	}
	globalFormErrorList: any = [];
	possibleErrors = new ErrorList().possibleErrors;
	errorHeaderMessage = new ErrorList().headerMessage;
	documentPatchData: any = [];
	patchFileUrls = new BehaviorSubject([]);
	showAddPartyPopup: any = { name: '', status: false };
	partyNamePopup: string = '';
	doAutoFill: boolean = true;
	data: any;
	advanceCount: any = [];
	creditCount: any = [];
	billCount: any = [];
	isFormValid: boolean = true;
	isTax: boolean = false;
	editData = new BehaviorSubject<any>({
		deduction_amount: 0
	});
	prefixUrl: string;
	gstin = '';
	isTdsDecleration = false;
	analyticsType = OperationConstants;
	analyticsScreen = ScreenConstants;
	screenType = ScreenType;
	isTds = false;
	terminology: any;
	digitalSignature = [];
	goThroughDetais = {
		show: false,
		url: "https://demo.arcade.software/yHgEG86oyq4uNRMAUly2?embed%22"
	}
	total_Outstanding_Summation = {
		amount_paid: 0,
		adjustment: 0,
		withheld: 0
	}
	total_Vendor_Credit_Summation = {
		aviling: 0,
		vendor_Credits: 0,
		balance: 0,
		total_Balance: 0
	};
	total_Vendor_Advances_Summation = {
		aviling: 0,
		vendor_Credits: 0,
		balance: 0,
		total_Balance: 0
	};
	total_outstanding_labour_Summation = {
		amount_paid: 0,
		adjustment: 0,
		totalBalance: 0
	}
	isAmount_Paid_Require = false

	constructor(
		private _fb: UntypedFormBuilder,
		private _partyService: PartyService,
		private _operationPaymentsService: OperationsPaymentService,
		private _router: Router,
		private _commonService: CommonService,
		private _activateRoute: ActivatedRoute,
		private currency: CurrencyService,
		private _tax: TaxService,
		private _terminologiesService: TerminologiesService,
		private _prefixUrl: PrefixUrlService,
		private _billPaymentsClassService: BillPaymentsClassService,
		private _analytics: AnalyticsService,
		private _scrollToTop: ScrollToTop,
		private _revenueService: RevenueService,
		private apiHandler: ApiHandlerService,

	) {
		super();
		this.isTax = this._tax.getTax();
		this.isTds = this._tax.getVat();
		this.terminology = this._terminologiesService.terminologie;
	}

	dateChange(date) {
		if (date == "") return "-"
		return normalDate(date);
	}
	handleEmployeeChange() {
		let empId = this.editBillPaymentForm.get('employee').value;
		let empObj = getEmployeeObject(this.employeeList, empId);
		this.initialValues.employee = { label: empObj?.display_name, value: empId }

	}


	emptyString(value) {
		if (value == "") return "-"
		return value
	}
	openGothrough() {
		this.goThroughDetais.show = true;
	}

	ngOnDestroy() {
		let body = document.getElementsByTagName('body')[0];
		body.classList.remove('removeLoader');
	}
	ngOnInit() {
		setTimeout(() => {
			this.prefixUrl = this._prefixUrl.getprefixUrl();
			this.currency_type = this.currency.getCurrency();
		}, 1000);
		this._activateRoute.params.subscribe((pramas) => {
			this.billPaymentId = pramas.bill_payment_id;
			this.buildForm();

			this._billPaymentsClassService.getPartyList(vendorList => {
				if (vendorList && vendorList.length > 0) {
					this.vendorList = vendorList;
				}
			})

			this._billPaymentsClassService.getEmployeeList(employeeList => {
				if (employeeList && employeeList.length > 0) {
					this.employeeList = employeeList;
				}
			})

			this._billPaymentsClassService.getPaymentAccountsList(accountList => {
				if (accountList && accountList.length > 0) {
					this.accountList = accountList;
				}
			})

			this.editBillPaymentForm.controls['date_of_payment'].setValue(new Date(dateWithTimeZone()));
		});
		this.getDigitalSignatureList();
	}

	ngAfterViewInit() {
		if (this.billPaymentId) {
			this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.PAYMENTBILL, this.screenType.EDIT, "Navigated");
			setTimeout(() => {
				this.getFormValues();
				this.isDomReady = true;
			}, 100);
		} else {
			this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.PAYMENTBILL, this.screenType.ADD, "Navigated");
			this._operationPaymentsService.getPrefixOperationsIds('operation_bill').subscribe((response) => {
				this.editBillPaymentForm.controls['payment_no'].setValue(response.result['operation_bill']);
			});
		}
	}

	getFormValues() {
		this._operationPaymentsService.getBillPaymentDetails(this.billPaymentId).subscribe((data: any) => {
			this.billPaymentData = data.result;
			if (this.isTax) {
				this.editData.next(this.billPaymentData)
			}
			this._partyService.getPartyAdressDetails(this.billPaymentData.party.id).subscribe(
				res => {
					this.gstin = res.result.tax_details.gstin;
					this.isTdsDecleration = res.result.tax_details.tds_declaration;
				});
			this.partyId = this.billPaymentData.party.id;
			this.onPartySelected();
			this.calculateTotal();
			this.employeePatch(this.billPaymentData);
			this.vendorNamePatch(this.billPaymentData);
			this.paymentModePatch(this.billPaymentData);
			if (this.billPaymentData.signature) {
				this.patchSignature(this.billPaymentData.signature);
				this.billPaymentData.signature = this.billPaymentData.signature.id
			}
			this.editBillPaymentForm.patchValue(this.billPaymentData);
			this.patchDocuments(this.billPaymentData);
		});
	}

	patchSignature(signature) {
		if (signature) {
			this.initialValues.digitalSignature['value'] = signature.id
			this.initialValues.digitalSignature['label'] = signature.name
		} else {
			this.initialValues.digitalSignature['label'] = ''
		}
	}


	fileUploader(filesUploaded) {
		let documents = this.editBillPaymentForm.get('documents').value;
		filesUploaded.forEach((element) => {
			documents.push(element.id);
		});
	}
	fileDeleted(deletedFileIndex) {
		let documents = this.editBillPaymentForm.get('documents').value;
		documents.splice(deletedFileIndex, 1);
	}

	patchDocuments(data) {
		if (data.documents.length > 0) {
			let documentsArray = this.editBillPaymentForm.get('documents') as UntypedFormControl;
			documentsArray.setValue([]);
			const documents = data.documents;
			let pathUrl = [];
			documents.forEach(element => {
				documentsArray.value.push(element.id);
				pathUrl.push(element);
			});
			this.patchFileUrls.next(pathUrl);
		}
	}

	buildForm() {
		this.editBillPaymentForm = this._fb.group({
			amount_paid: [
				0,
			],
			payment_no: [
				'',
				Validators.required
			],
			signature: [''],
			date_of_payment: [
				null,
				Validators.required
			],
			reference_no: [
				''
			],
			party: [
				null,
				Validators.required
			],
			payment_mode: [
				null,
				Validators.required
			],
			employee: [
				null
			],
			comment: '',
			documents: [
				[]
			],
			is_tax_deducted: [false],
			deduction_amount: [0.00],
			vendor_credit: this._fb.array([]),
			vendor_advances: this._fb.array([]),
			outstanding_bills: this._fb.array([]),
			outstanding_labour_bills: this._fb.array([]),
			outstanding_foreman_bills: this._fb.array([]),
			credit_availed: [0],
			advance_availed: [0],
			withheld_amount: [0],
			outStandingbillsAllSelect: [false],
			vendorCreditAllSelect: [false],
			vendorAdvanceAllSelect: [false],
			outStandingLaborBillsAllSelect: [false],
			foremanAllSelect: [false]
		});
		// total calulations for outstanding bills
		const outstandingBillsFormArray = this.editBillPaymentForm.get('outstanding_bills') as FormArray;
		outstandingBillsFormArray.valueChanges.subscribe((values) => {
			this.total_Outstanding_Summation.amount_paid = 0;
			this.total_Outstanding_Summation.adjustment = 0;
			this.total_Outstanding_Summation.withheld = 0;
			this.calculateTotal();
			values.forEach((item) => {
				this.total_Outstanding_Summation.amount_paid += Number(item.amount_paid);
				this.total_Outstanding_Summation.adjustment += Number(item.adjustment);
				this.total_Outstanding_Summation.withheld += Number(item.withheld);
			});
		});

		// total calculations for vendor credit
		const vendor_creditBillsFormArray = this.editBillPaymentForm.get('vendor_credit') as UntypedFormArray;
		vendor_creditBillsFormArray.valueChanges.subscribe((values) => {
			this.total_Vendor_Credit_Summation.aviling = 0;
			this.calculateTotal();
			values.forEach((item, i) => {
				this.total_Vendor_Credit_Summation.aviling += Number(item.availing);
			})

		});
		// total caluclations for vendor advance
		const vendor_advancesBillsFormArray = this.editBillPaymentForm.get('vendor_advances') as FormArray;
		vendor_advancesBillsFormArray.valueChanges.subscribe((values) => {
			this.total_Vendor_Advances_Summation.aviling = 0;
			this.calculateTotal();
			values.forEach((item) => {
				this.total_Vendor_Advances_Summation.aviling += Number(item.availing);
			})
		});
		// total calculations for outstanding labour bills
		const outstanding_labour_bills = this.editBillPaymentForm.get('outstanding_labour_bills') as FormArray;
		outstanding_labour_bills.valueChanges.subscribe((values) => {
			this.total_outstanding_labour_Summation.amount_paid = 0;
			this.total_outstanding_labour_Summation.adjustment = 0;
			this.total_outstanding_labour_Summation.totalBalance = 0;
			values.forEach((item) => {
				this.total_outstanding_labour_Summation.amount_paid += Number(item.amount_paid);
				this.total_outstanding_labour_Summation.adjustment += Number(item.adjustment);
				this.total_outstanding_labour_Summation.totalBalance += Number(item.total_balance);
			});
		});
	}


	alreadySelectedVendorCredit() {
		this.billPaymentData.vendor_credit.forEach((selectedData, index) => {
			this.creditList.forEach((data, i) => {
				const allSelected = this.creditList.every(item => item.selected === true) || this.creditList.selected === true;
				this.editBillPaymentForm.get('vendorCreditAllSelect').setValue(allSelected);
				if (selectedData.vendor_credits === data.id) {
					this.creditList[i]['selected'] = true;
					this.creditList[i]['id'] = selectedData.id;
					this.creditList[i]['vendor_credits'] = selectedData.vendor_credits
					this.creditList[i]['availing'] = selectedData.availing;
					this.creditList[i]['balance'] = Number(data.balance) + Number(selectedData.availing);
				}
			});
		});
	}
	alreadySelectedVendorAdvance() {
		this.billPaymentData.vendor_advances.forEach((selectedData, index) => {
			this.advanceList.forEach((data, i) => {
				const allSelected = this.advanceList.every(item => item.selected === true) || this.advanceList.selected === true;
				this.editBillPaymentForm.get('vendorAdvanceAllSelect').setValue(allSelected);
				if (selectedData.vendor_advance === data.id) {
					this.advanceList[i]['selected'] = true;
					this.advanceList[i]['id'] = selectedData.id;
					this.advanceList[i]['vendor_advance'] = selectedData.vendor_advance
					this.advanceList[i]['availing'] = selectedData.availing;
					this.advanceList[i]['balance'] = Number(data.balance) + Number(selectedData.availing);
				}
			});
		});
	}
	alreadySelectedOutstandingBill() {
		this.billPaymentData.outstanding_bills.forEach((selectedData, index) => {
			this.billList.forEach((data, i) => {
				const allSelected = this.billList.every(item => item.selected === true) || this.billList.selected === true;
				this.editBillPaymentForm.get('outStandingbillsAllSelect').setValue(allSelected);
				if (selectedData.bill === data.id) {
					this.billList[i]['selected'] = true;
					this.billList[i]['id'] = selectedData.id;
					this.billList[i]['bill'] = selectedData.bill;
					this.billList[i]['adjustment'] = selectedData.adjustment;
					this.billList[i]['amount_paid'] = selectedData.amount_paid;
					this.billList[i]['withheld'] = selectedData.withheld;
					this.billList[i]['balance'] = Number(data.balance) + Number(selectedData.adjustment) +
						Number(selectedData.amount_paid)
				}
			});
		});
	}
	setPartyTax(partyId) {
		this._partyService.getPartyAdressDetails(partyId).subscribe(
			res => {
				this.gstin = res.result.tax_details.gstin;
				this.isTdsDecleration = res.result.tax_details.tds_declaration;
			})
	}

	alreadySelectedOutstandingLabourBill() {

		this.billPaymentData.outstanding_labour_bills.forEach((selectedData, index) => {
			this.labourList.forEach((data, i) => {
				if (selectedData.labour_bill === data.id) {
					this.labourList[i]['selected'] = true;
					this.labourList[i]['id'] = selectedData.id;
					this.labourList[i]['labour_bill'] = selectedData.labour_bill;
					this.labourList[i]['adjustment'] = selectedData.adjustment;
					this.labourList[i]['amount_paid'] = selectedData.amount_paid;
					this.labourList[i]['withheld'] = selectedData.withheld;
					this.labourList[i]['labour_balance'] = Number(data.labour_balance) + Number(selectedData.adjustment) +
						Number(selectedData.amount_paid)
				}
			});
		});
		const allSelected = this.labourList.every((item: any) => item['selected'] === true);
		this.editBillPaymentForm.get('outStandingLaborBillsAllSelect').setValue(allSelected);
	}


	alreadySelectedOutstandingForemanSalary() {
		const allSelected = this.foremanList.every(item => item.selected === true);
		this.editBillPaymentForm.get('foremanAllSelect').setValue(allSelected)
		this.billPaymentData.outstanding_foreman_bills.forEach((selectedData, index) => {
			this.foremanList.forEach((data, i) => {
				if (selectedData.foreman_bill === data.id) {
					this.foremanList[i]['selected'] = true;
					this.foremanList[i]['id'] = selectedData.id;
					this.foremanList[i]['foreman_bill'] = selectedData.foreman_bill;
					this.foremanList[i]['adjustment'] = selectedData.adjustment;
					this.foremanList[i]['amount_paid'] = selectedData.amount_paid;
					this.foremanList[i]['withheld'] = selectedData.withheld;
					this.foremanList[i]['foreman_balance'] = Number(data.foreman_balance) + Number(selectedData.adjustment) +
						Number(selectedData.amount_paid)
				}
			});
		});
	}

	onPartySelected() {
		this._partyService.getPartyVendorCreditsSettlement(this.partyId, this.billPaymentId).subscribe((response) => {
			this.creditList = response.result;
			this.alreadySelectedVendorCredit();
			this.buildVendorCredits(this.creditList);
			this.calculateCreditAvail();
		});

		this._partyService.getPartyVendorAdvancesSettlement(this.partyId, this.billPaymentId).subscribe((response) => {
			this.advanceList = response.result;
			this.alreadySelectedVendorAdvance();
			this.buildVendorAdvances(this.advanceList);
			this.calculateAdvanceAvail();
		});
		this._partyService.getPartyBillsSettlement(this.partyId, this.billPaymentId).subscribe((response) => {
			this.billList = response.result;

			this.alreadySelectedOutstandingBill();
			this.buildOutstandingBills(this.billList);
			this.calculateAmountPaid();
		});
		this._partyService.getPartyBillsSettlementLabour(this.partyId, this.billPaymentId).subscribe((response) => {
			this.labourList = response.result;
			this.alreadySelectedOutstandingLabourBill();
			this.buildLabourBills(this.labourList);
			this.calculateLabourAmountPaid();
		});

		this._partyService.getPartyBillsSettlementForeman(this.partyId, this.billPaymentId).subscribe((response) => {
			this.foremanList = response.result;
			this.alreadySelectedOutstandingForemanSalary();
			this.buildForemanBills(this.foremanList);
			this.calculateForemanAmountPaid();
		});
	}

	/* For  Opening the Party Modal */
	openAddPartyModal($event) {
		if ($event)
			this.showAddPartyPopup = { name: this.partyNamePopup, status: true };
	}

	/* Adding the entered value to the list */
	addValueToPartyPopup(event) {
		if (event) {
			this.partyNamePopup = event;
		}
	}

	/* For Displaying the party name in the subfield  */
	addPartyToOption($event) {
		if ($event.status) {
			this.getVendorDetails();
			this.initialValues.party = { value: $event.id, label: $event.label };
			this.editBillPaymentForm.get('party').setValue($event.id);
		}
	}

	/* To get all the Vendor Details */

	getVendorDetails() {
		this._partyService.getPartyList('0,1,2,3', '1').subscribe((response) => {
			this.vendorList = response.result;
		});
	}

	/* After closing the party modal to clear all the values */
	closePartyPopup() {
		this.showAddPartyPopup = { name: '', status: false };
	}

	setAmountPaid() {
		this.billPaymentsTotals.amountPaid = this.editBillPaymentForm.value["amount_paid"];
	}

	onVendorCreditSelected(ele, index) {
		const bills = this.editBillPaymentForm.controls['vendor_credit'] as UntypedFormArray;
		let val = bills.controls.every((control) => {
			return control.get('selected').value === true
		})
		if (bills.controls[index].get('selected').value) {
			bills.controls[index].get('availing').setValue(bills.controls[index].get('balance').value);
		} else {
			bills.controls[index].get('availing').setValue(0);
		}
		if (val) {
			this.editBillPaymentForm.get('vendorCreditAllSelect').setValue(true);
		}
		else {
			this.editBillPaymentForm.get('vendorCreditAllSelect').setValue(false);
		}
		this.onCheckboxChangeCredit(ele, this.creditList, index);
		this.calculateCreditAvail();
		this.calculateTotal()
	}

	vendorCreditAll(event) {
		const vendorCreditAllSelect = this.editBillPaymentForm.get('vendorCreditAllSelect').value
		if (vendorCreditAllSelect) {
			const bills = this.editBillPaymentForm.controls['vendor_credit'] as UntypedFormArray;
			bills.controls.forEach((controls) => {
				controls.get('selected').setValue(true)
				controls.get('availing').setValue(controls.get('balance').value);
			})
			this.creditList.forEach((ele, index) => {
				ele['target'] = {}
				ele['target']['value'] = ele.id;
				ele['target']['checked'] = true;
				this.onCheckboxChangeCredit(ele, this.creditList, index);
				this.calculateCreditAvail();
			})
		}
		else {
			const bills = this.editBillPaymentForm.controls['vendor_credit'] as UntypedFormArray;
			bills.controls.forEach((controls) => {
				controls.get('selected').setValue(false);
				controls.get('availing').setValue(0);
			})
			this.creditList.forEach((ele, index) => {
				ele['target']['value'] = ele.id;
				ele['target']['checked'] = false;
				this.onCheckboxChangeCredit(ele, this.creditList, index);
				this.calculateCreditAvail();
			})
		}
	}

	onVendorAdvanceSelected(ele, index) {
		const bills = this.editBillPaymentForm.controls['vendor_advances'] as UntypedFormArray;
		let val = bills.controls.every((control) => {
			return control.get('selected').value === true
		})
		if (bills.controls[index].get('selected')) {
			bills.controls[index].get('availing').setValue(bills.controls[index].get('balance').value)
		}
		if (val) {
			this.editBillPaymentForm.get('vendorAdvanceAllSelect').setValue(true);
		}
		else {
			this.editBillPaymentForm.get('vendorAdvanceAllSelect').setValue(false);
		}
		this.onCheckboxChangeAdvance(ele, this.advanceList, index);
		this.calculateAdvanceAvail();
		this.calculateTotal()
	}
	vendorAdvanceAll(event) {
		const vendorAdvanceAllSelect = this.editBillPaymentForm.get('vendorAdvanceAllSelect').value
		if (vendorAdvanceAllSelect) {
			const bills = this.editBillPaymentForm.controls['vendor_advances'] as UntypedFormArray;
			bills.controls.forEach((controls) => {
				controls.get('selected').setValue(true)
				controls.get('availing').setValue(controls.get('balance').value);
			})
			this.advanceList.forEach((ele, index) => {
				ele['target'] = {}
				ele['target']['value'] = ele.id;
				ele['target']['checked'] = true;
				this.onCheckboxChangeAdvance(ele, this.advanceList, index);
				this.calculateAdvanceAvail();
			})
		}
		else {
			const bills = this.editBillPaymentForm.controls['vendor_advances'] as UntypedFormArray;
			bills.controls.forEach((controls) => {
				controls.get('selected').setValue(false)
				controls.get('availing').setValue(0);
			})
			this.advanceList.forEach((ele, index) => {
				ele['target'] = {}
				ele['target']['value'] = ele.id;
				ele['target']['checked'] = false;
				this.onCheckboxChangeAdvance(ele, this.advanceList, index);
				this.calculateAdvanceAvail();
			})
		}
	}

	onOutstandingSelected(ele, index) {
		const bills = this.editBillPaymentForm.controls['outstanding_bills'] as UntypedFormArray;
		let val = bills.controls.every((control) => {
			return control.get('selected').value === true
		});
		if (bills.controls[index].get('selected')) {
			bills.controls[index].get('amount_paid').setValue(bills.controls[index].get('balance').value)
		}
		if (val) {
			this.editBillPaymentForm.get('outStandingbillsAllSelect').setValue(true);
		}
		else {
			this.editBillPaymentForm.get('outStandingbillsAllSelect').setValue(false);
		}
		this.onCheckboxChangeOutstanding(ele, this.billList, index);
		this.calculateAmountPaid();
	}
	outStandingBillsAll(event) {
		const outStandingbillsAllSelect = this.editBillPaymentForm.get('outStandingbillsAllSelect').value
		if (outStandingbillsAllSelect) {
			const bills = this.editBillPaymentForm.controls['outstanding_bills'] as UntypedFormArray;
			bills.controls.forEach((controls) => {
				controls.get('selected').setValue(true)
				controls.get('amount_paid').setValue(controls.get('balance').value)
			})
			this.billList.forEach((ele, index) => {
				ele['target'] = {}
				ele['target']['value'] = ele.id;
				ele['target']['checked'] = true;
				this.onCheckboxChangeOutstanding(ele, this.billList, index);
				this.calculateAmountPaid();
			})
		}
		else {
			const bills = this.editBillPaymentForm.controls['outstanding_bills'] as UntypedFormArray;
			bills.controls.forEach((controls) => {
				controls.get('selected').setValue(false)
				controls.get('amount_paid').setValue(0)
			})
			this.billList.forEach((ele, index) => {
				ele['target'] = {}
				ele['target']['value'] = ele.id
				ele['target']['checked'] = false;;
				this.onCheckboxChangeOutstanding(ele, this.billList, index);
				this.calculateAmountPaid();
			})
		}
	}

	onLabourSelected(ele, index) {
		const bills = this.editBillPaymentForm.controls['outstanding_labour_bills'] as UntypedFormArray;
		let val = bills.controls.every((control) => {
			return control.get('selected').value === true
		})
		if (val) {
			this.editBillPaymentForm.get('outStandingLaborBillsAllSelect').setValue(true);
		}
		else {
			this.editBillPaymentForm.get('outStandingLaborBillsAllSelect').setValue(false);
		}
		this.onCheckboxChangeOutstandingLabour(ele, this.labourList, index);
		this.calculateLabourAmountPaid();
	}
	outStandingLaborBillsAll(event) {
		if (event.target.checked) {
			const bills = this.editBillPaymentForm.controls['outstanding_labour_bills'] as UntypedFormArray;
			bills.controls.forEach((controls) => {
				controls.get('selected').setValue(true)
			})
			this.labourList.forEach((ele, index) => {
				ele['target'] = {}
				ele['target']['value'] = ele.id;
				ele['target']['checked'] = true;
				this.onCheckboxChangeOutstandingLabour(ele, this.labourList, index);
				this.calculateLabourAmountPaid();
			})
		}
		else {
			const bills = this.editBillPaymentForm.controls['outstanding_labour_bills'] as UntypedFormArray;
			bills.controls.forEach((controls) => {
				controls.get('selected').setValue(false)
			})
			this.labourList.forEach((ele, index) => {
				ele['target'] = {}
				ele['target']['value'] = ele.id;
				ele['target']['checked'] = false;
				this.onCheckboxChangeOutstandingLabour(ele, this.labourList, index);
				this.calculateLabourAmountPaid();
			})
		}

	}

	onForemanSelected(ele, index) {
		const bills = this.editBillPaymentForm.controls['outstanding_foreman_bills'] as UntypedFormArray;
		let val = bills.controls.every((control) => {
			return control.get('selected').value === true
		})
		if (val) {
			this.editBillPaymentForm.get('foremanAllSelect').setValue(true);
		}
		else {
			this.editBillPaymentForm.get('foremanAllSelect').setValue(false);
		}
		this.onCheckboxChangeOutstandingForemanSalary(ele, this.labourList, index);
		this.calculateForemanAmountPaid();
	}
	foremanAllSelected(event) {
		if (event.target.checked) {
			const bills = this.editBillPaymentForm.controls['outstanding_foreman_bills'] as UntypedFormArray;
			bills.controls.forEach((controls) => {
				controls.get('selected').setValue(true)
			})
			this.labourList.forEach((ele, index) => {
				ele['target'] = {}
				ele['target']['value'] = ele.id;
				ele['target']['checked'] = true;
				this.onCheckboxChangeOutstandingForemanSalary(ele, this.labourList, index);
				this.calculateForemanAmountPaid();
			})
		}
		else {
			const bills = this.editBillPaymentForm.controls['outstanding_foreman_bills'] as UntypedFormArray;
			bills.controls.forEach((controls) => {
				controls.get('selected').setValue(false)
			})
			this.labourList.forEach((ele, index) => {
				ele['target'] = {}
				ele['target']['value'] = ele.id;
				ele['target']['checked'] = false;
				this.onCheckboxChangeOutstandingForemanSalary(ele, this.labourList, index);
				this.calculateForemanAmountPaid();
			})
		}

	}

	onCheckboxChangeCredit(event, list, index) {
		const creditNotes = this.editBillPaymentForm.controls['vendor_credit'] as UntypedFormArray;
		if (event.target.checked) {
			if (this.removeSelectedCreditList.length && this.removeSelectedCreditList.indexOf(event.target.value) > -1) {
				let position = this.removeSelectedCreditList.indexOf(event.target.value);
				this.removeSelectedCreditList.splice(position, 1);
				list.filter(data => {
					if (event.target.value == data.id) {
						creditNotes.controls[index].get('vendor_credits').setValue(data.id);
					}
				});
			}
			else {
				list.filter(data => {
					if (event.target.value == data.id) {
						creditNotes.controls[index].get('vendor_credits').setValue(data.id);
					}
				});
			}
		}
		else {
			if (isValidValue(creditNotes.controls[index].get('id').value) && !creditNotes.controls[index].get('selected').value)
				this.removeSelectedCreditList.push(creditNotes.controls[index].get('id').value);
			creditNotes.controls[index].get('vendor_credits').setValue('');
			creditNotes.controls[index].get('availing').setValue(0);
			creditNotes.controls[index].get('total_balance').setValue(0);
		}
	}

	buildVendorCredits(items) {
		const vendorCredits = this.editBillPaymentForm.controls['vendor_credit'] as UntypedFormArray;
		vendorCredits.controls = [];
		items.forEach((item) => {
			vendorCredits.push(this.buildVendorCredit(item));
		});
	}

	buildVendorCredit(item) {
		return this._fb.group({
			id: [
				item.id || null
			],
			selected: [
				item.selected || false
			],
			vendor_credits: [
				item.vendor_credits || null
			],
			availing: [
				item['availing'] || 0
			],
			balance: [
				item.balance || 0
			],
			total_balance: [0]
		});
	}

	onCheckboxChangeAdvance(event, list, index) {
		const VendorAdvance = this.editBillPaymentForm.controls['vendor_advances'] as UntypedFormArray;
		if (event.target.checked) {
			if (this.removeSelectedVendorAdvance.length && this.removeSelectedVendorAdvance.indexOf(event.target.value) > -1) {
				let position = this.removeSelectedVendorAdvance.indexOf(event.target.value);
				this.removeSelectedVendorAdvance.splice(position, 1);
				list.filter(data => {
					if (event.target.value == data.id) {
						VendorAdvance.controls[index].get('vendor_advance').setValue(data.id);
					}
				});
			}
			else {
				list.filter(data => {
					if (event.target.value == data.id) {
						VendorAdvance.controls[index].get('vendor_advance').setValue(data.id);
					}
				});
			}
		}
		else {
			if (isValidValue(VendorAdvance.controls[index].get('id').value) && !VendorAdvance.controls[index].get('selected').value)
				this.removeSelectedVendorAdvance.push(VendorAdvance.controls[index].get('id').value);
			VendorAdvance.controls[index].get('vendor_advance').setValue('');
			VendorAdvance.controls[index].get('availing').setValue(0);
			VendorAdvance.controls[index].get('total_balance').setValue(0);
		}
	}

	buildVendorAdvances(items) {
		const vendorAdvances = this.editBillPaymentForm.controls['vendor_advances'] as UntypedFormArray;
		vendorAdvances.controls = [];
		items.forEach((item) => {
			vendorAdvances.push(this.buildVendorAdvance(item));
		});
	}

	buildVendorAdvance(item) {
		return this._fb.group({
			id: [
				item.id || null
			],
			selected: [
				item.selected || false
			],
			vendor_advance: [
				item.vendor_advance || null
			],
			availing: [
				item.availing || 0
			],
			balance: [
				item.balance || 0
			],
			total_balance: [0]
		});
	}

	onCheckboxChangeOutstanding(event, list, index) {
		const Outstanding = this.editBillPaymentForm.controls['outstanding_bills'] as UntypedFormArray;
		if (event.target.checked) {
			if (this.removeSelectedOutBills.length && this.removeSelectedOutBills.indexOf(event.target.value) > -1) {
				let position = this.removeSelectedOutBills.indexOf(event.target.value);
				this.removeSelectedOutBills.splice(position, 1);
				list.filter(data => {
					if (event.target.value === data.id) {
						Outstanding.controls[index].get('bill').setValue(data.id);
					}
				});
			}
			else {
				list.filter(data => {
					if (event.target.value === data.id) {
						Outstanding.controls[index].get('bill').setValue(data.id);
					}
				});
			}
		}
		else {
			if (isValidValue(Outstanding.controls[index].get('id').value) && !Outstanding.controls[index].get('selected').value)
				this.removeSelectedOutBills.push(Outstanding.controls[index].get('id').value);
			Outstanding.controls[index].get('bill').setValue('');
			Outstanding.controls[index].get('adjustment').setValue(0);
			Outstanding.controls[index].get('amount_paid').setValue(0);
			Outstanding.controls[index].get('total_balance').setValue(0);
			Outstanding.controls[index].get('withheld').setValue(0);
		}
	}

	onCheckboxChangeOutstandingLabour(event, list, index) {
		const Outstanding = this.editBillPaymentForm.controls['outstanding_labour_bills'] as UntypedFormArray;
		if (event.target.checked) {
			if (this.removeSelectedOutBillsLabour.length && this.removeSelectedOutBillsLabour.indexOf(event.target.value) > -1) {
				let position = this.removeSelectedOutBillsLabour.indexOf(event.target.value);
				this.removeSelectedOutBillsLabour.splice(position, 1);
				list.filter(data => {
					if (event.target.value == data.id) {
						Outstanding.controls[index].get('labour_bill').setValue(data.id);
					}
				});
			}
			else {
				list.filter(data => {
					if (event.target.value == data.id) {
						Outstanding.controls[index].get('id').setValue(null);
						Outstanding.controls[index].get('labour_bill').setValue(data.id);
					}
				});
			}
		}
		else {
			if (isValidValue(Outstanding.controls[index].get('id').value) && !Outstanding.controls[index].get('selected').value)
				this.removeSelectedOutBillsLabour.push(Outstanding.controls[index].get('id').value);
			Outstanding.controls[index].get('labour_bill').setValue('');
			Outstanding.controls[index].get('adjustment').setValue(0);
			Outstanding.controls[index].get('amount_paid').setValue(0);
			Outstanding.controls[index].get('total_balance').setValue(0);
			Outstanding.controls[index].get('withheld').setValue(0);
		}
	}

	onCheckboxChangeOutstandingForemanSalary(event, list, index) {
		const Outstanding = this.editBillPaymentForm.controls['outstanding_foreman_bills'] as UntypedFormArray;
		if (event.target.checked) {
			if (this.removeSelectedOutBillsForeman.length && this.removeSelectedOutBillsForeman.indexOf(event.target.value) > -1) {
				let position = this.removeSelectedOutBillsForeman.indexOf(event.target.value);
				this.removeSelectedOutBillsForeman.splice(position, 1);
				list.filter(data => {
					if (event.target.value == data.id) {
						Outstanding.controls[index].get('foreman_bill').setValue(data.id);
					}
				});
			}
			else {
				list.filter(data => {
					if (event.target.value == data.id) {
						Outstanding.controls[index].get('id').setValue(null);
						Outstanding.controls[index].get('foreman_bill').setValue(data.id);
					}
				});
			}
		}
		else {
			if (isValidValue(Outstanding.controls[index].get('id').value) && !Outstanding.controls[index].get('selected').value)
				this.removeSelectedOutBillsForeman.push(Outstanding.controls[index].get('id').value);
			Outstanding.controls[index].get('foreman_bill').setValue('');
			Outstanding.controls[index].get('adjustment').setValue(0);
			Outstanding.controls[index].get('amount_paid').setValue(0);
			Outstanding.controls[index].get('total_balance').setValue(0);
			Outstanding.controls[index].get('withheld').setValue(0);
		}
	}

	buildOutstandingBills(items) {
		const outstandingBills = this.editBillPaymentForm.controls['outstanding_bills'] as UntypedFormArray;
		outstandingBills.controls = [];
		items.forEach((item) => {
			outstandingBills.push(this.buildOutstandingBill(item));
		});
	}

	buildLabourBills(items) {
		const labourBills = this.editBillPaymentForm.controls['outstanding_labour_bills'] as UntypedFormArray;
		labourBills.controls = [];
		items.forEach((item) => {
			labourBills.push(this.buildOutstandingLabourBill(item));
		});
	}

	buildForemanBills(items) {
		const foremanBills = this.editBillPaymentForm.controls['outstanding_foreman_bills'] as UntypedFormArray;
		foremanBills.controls = [];
		items.forEach((item) => {
			foremanBills.push(this.buildOutstandingForemanSalary(item));
		});
	}

	buildOutstandingBill(item) {
		return this._fb.group({
			id: [
				item.id || null
			],
			selected: [
				item.selected || false
			],
			bill: [
				item.bill || null
			],
			balance: [
				item.balance || 0
			],
			adjustment: [
				item.adjustment || 0
			],
			amount_paid: [
				item.amount_paid || 0
			],
			withheld: [
				item.withheld || 0
			],
			total_balance: [0],
		});
	}


	buildOutstandingLabourBill(item) {
		return this._fb.group({
			id: [
				item.id || null
			],
			selected: [
				item.selected || false
			],
			type: [
				item.type || null
			],
			date: [
				item.date || null
			],
			labour_bill: [item.labour_bill || ''],
			bill_number: [
				item.bill_number || null
			],
			due_date: [
				item.due_date || null
			],
			labour_balance: [
				item.labour_balance || 0
			],
			adjustment: [
				item.adjustment || 0
			],
			balance: [item.balance || 0],
			amount_paid: [
				item.amount_paid || 0
			],
			total_balance: [item.total_balance || 0],
			withheld: [
				item.withheld || 0
			],
			labour_total_balance: [item.labour_total_balance || 0],
		});
	}

	buildOutstandingForemanSalary(item) {
		return this._fb.group({
			id: [
				item.id || null
			],
			selected: [
				item.selected || false
			],
			type: [
				item.type || null
			],
			date: [
				item.date || null
			],
			foreman_bill: [item.foreman_bill || ''],
			bill_number: [
				item.bill_number || null
			],
			due_date: [
				item.due_date || null
			],
			foreman_balance: [
				item.foreman_balance || 0
			],
			adjustment: [
				item.adjustment || 0
			],
			balance: [item.balance || 0],
			amount_paid: [
				item.amount_paid || 0
			],
			total_balance: [item.total_balance || 0],
			withheld: [
				item.withheld || 0
			],
			foreman_total_balance: [item.foreman_total_balance || 0],
		});
	}

	onVendorSelected(e) {
		if (isValidValue(e.target.value)) {
			this.setPartyTax(e.target.value)
			this.doAutoFill = true;
			this.resetFormData();
			this.vendorSelected = getObjectFromList(e.target.value, this.vendorList);
			this.populatePaymentMethod();
			this.getLabourBills(this.vendorSelected.id);
			this.getForemanBills(this.vendorSelected.id)
			this._partyService.getPartyBills(this.vendorSelected.id).subscribe((response) => {
				this.billList = response.result;
				this.billCount = this.billList.filter(bill => { return bill.balance > 0 })
				this.buildOutstandingBills(this.billList);
			});
			this._partyService.getPartyVendorCredits(this.vendorSelected.id).subscribe((response) => {
				this.creditList = response.result;
				this.creditCount = this.creditList.filter(credit => { return credit.balance > 0 })
				this.buildVendorCredits(this.creditList);
			});
			this._partyService.getPartyVendorAdvances(this.vendorSelected.id).subscribe((response) => {
				this.advanceList = response.result;
				this.advanceCount = this.advanceList.filter(advance => { return advance.balance > 0 })
				this.buildVendorAdvances(this.advanceList);
			});
			this.calculateTotal();
		} else {
			this.vendorSelected = null;
		}
	}
	getDefaultBank(id) {
		let params = {
			is_account: 'True',
			is_tenant: 'False'
		}
		this._revenueService.getDefaultBank(id, params).subscribe((data) => {
			this.initialValues.paymentMode = getBlankOption();
			if (data['result']) {
				this.editBillPaymentForm.get('payment_mode').setValue(data['result'].id);
				this.initialValues.paymentMode['label'] = data['result'].name
				this.initialValues.paymentMode['value'] = data['result'].id
			}
		})
	}


	populatePaymentMethod() {
		let vendorId = this.editBillPaymentForm.get('party').value;
		this.getDefaultBank(vendorId)
		if (vendorId) {
			this.data = this.vendorList.filter((ele) => ele.id === vendorId)[0];
		}
	}

	resetFormData() {
		this.billPaymentsTotals.amountPaid = 0;
		this.billPaymentsTotals.amountPayable = 0;
		this.billPaymentsTotals.discountAmount = 0;
		this.billPaymentsTotals.advanceAvailed = 0;
		this.billPaymentsTotals.creditAvailed = 0;
		this.billPaymentsTotals.withheldAmount = 0;
		this.editBillPaymentForm.controls['amount_paid'].patchValue(0);
		this.editBillPaymentForm.controls['payment_mode'].patchValue(null);
		this.initialValues.paymentMode = getBlankOption();
		this.deductAmountDisabled = true;
		this.editBillPaymentForm.controls['reference_no'].patchValue('');
	}

	updateBillPayment() {
		this.setValidators();
		const form = this.editBillPaymentForm;
		form.get('amount_paid').clearValidators();
		form.get('amount_paid').updateValueAndValidity();
		this.isAmount_Paid_Require = false
		if (form.valid) {
			if (this.billPaymentsTotals.amountPaid != (this.billPaymentsTotals.amountPayable) || 0) {
				this.apiError = 'Amount Paid should be equal to Total!';
				this._scrollToTop.scrollToTop();
			}
			else if (form.get('amount_paid').value == 0 && this.billPaymentsTotals.amountPaid == 0) {
				this.apiError = 'Amount Paid should not be equal to 0!';
				form.get('amount_paid').setValidators(Validators.min(0.01));
				form.get('amount_paid').updateValueAndValidity();
				this.isAmount_Paid_Require = true
				this.setAsTouched(form)
				this._scrollToTop.scrollToTop();
			}
			else if (form.value["deduction_amount"] != (this.billPaymentsTotals.withheldAmount || 0)) {
				this.apiError = 'Withheld Amount should be equal to Deducted Amount!';
				this._scrollToTop.scrollToTop();
			} else {
				this.apiHandler.handleRequest(this._operationPaymentsService.putNewBillPayment(this.prepareEditRequest(form), this.billPaymentId), 'Payment updated successfully!').subscribe(
					{
						next: () => {
							this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.PAYMENTBILL)
							this._router.navigate([this.prefixUrl + '/payments/list/bill'], { queryParams: { pdfViewId: this.billPaymentId } });
						},
						error: (err) => {
							this.apiError = '';
							if (err.error.status == 'error') {
								this.setAsTouched(form);
								this.apiError = err.error.message;
								this._scrollToTop.scrollToTop();
								window.scrollTo(0, 0);
							}
						},
					}
				)
			}
		} else {
			this.setAsTouched(form);
			this._scrollToTop.scrollToTop();
			this.setFormGlobalErrors();
		}
	}
	submitBillPayment() {
		this.setValidators();
		const form = this.editBillPaymentForm;
		form.get('amount_paid').clearValidators();
		form.get('amount_paid').updateValueAndValidity();
		this.isAmount_Paid_Require = false
		if (form.valid) {
			if (this.billPaymentsTotals.amountPaid != (this.billPaymentsTotals.amountPayable) || 0) {
				this.apiError = 'Amount Paid should be equal to Total!';
				this._scrollToTop.scrollToTop();
			}
			else if (form.get('amount_paid').value == 0 && this.billPaymentsTotals.amountPaid == 0) {
				this.apiError = 'Amount Paid should not be equal to 0!';
				form.get('amount_paid').setValidators(Validators.min(0.01));
				form.get('amount_paid').updateValueAndValidity();
				this.isAmount_Paid_Require = true
				this.setAsTouched(form)
				this._scrollToTop.scrollToTop();
			}
			else if (form.value["deduction_amount"] != (this.billPaymentsTotals.withheldAmount || 0)) {
				this.apiError = 'Withheld Amount should be equal to Deducted Amount!';
				this._scrollToTop.scrollToTop();
			} else {
				this.apiHandler.handleRequest(this._operationPaymentsService.postNewBillPayment(this.prepareRequest(form)), 'Payment added successfully!').subscribe(
					{
						next: () => {
							this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.PAYMENTBILL)
							this._router.navigateByUrl(this.prefixUrl + '/payments/list/bill');
						},
						error: (err) => {
							this.apiError = '';
							if (err.error.status == 'error') {
								this.setAsTouched(form);
								this._scrollToTop.scrollToTop();
								this.apiError = err.error.message;
							}
						},
					}
				)
			}
		} else {
			this.setAsTouched(form);
			this._scrollToTop.scrollToTop();
			this.setFormGlobalErrors();
		}
		window.scrollTo(0, 0);
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

	prepareEditRequest(form: UntypedFormGroup) {
		let params = form.value;
		params['delete_vendor_credit'] = this.removeSelectedCreditList;
		params['delete_vendor_advance'] = this.removeSelectedVendorAdvance;
		params['delete_outstanding_bills'] = this.removeSelectedOutBills;
		params['delete_outstanding_labour_bills'] = this.removeSelectedOutBillsLabour;
		params['delete_outstanding_foreman_bills'] = this.removeSelectedOutBillsForeman;
		params['vendor_advances'] = params['vendor_advances'].filter(advance => {
			return advance.selected;
		});
		params['vendor_credit'] = params['vendor_credit'].filter(credit => {
			return credit.selected;
		});
		params['outstanding_bills'] = params['outstanding_bills'].filter(debit => {
			return debit.selected;
		});
		params['outstanding_foreman_bills'] = params['outstanding_foreman_bills'].filter(debit => {
			return debit.selected;
		});
		params['outstanding_labour_bills'] = params['outstanding_labour_bills'].filter(debit => {
			return debit.selected;
		});
		params['date_of_payment'] = changeDateToServerFormat(form.controls['date_of_payment'].value);
		return params;


	}

	prepareRequest(form: UntypedFormGroup) {
		let params = form.value;
		params['vendor_advances'] = params['vendor_advances'].filter(invoice => {
			return invoice.selected;
		});
		params['vendor_credit'] = params['vendor_credit'].filter(credit => {
			return credit.selected;
		});
		params['outstanding_bills'] = params['outstanding_bills'].filter(debit => {
			return debit.selected;
		});
		params['outstanding_labour_bills'] = params['outstanding_labour_bills'].filter(debit => {
			return debit.selected;
		});
		params['outstanding_foreman_bills'] = params['outstanding_foreman_bills'].filter(debit => {
			return debit.selected;
		});
		params['date_of_payment'] = changeDateToServerFormat(form.controls['date_of_payment'].value);
		return params;
	}


	employeePatch(billPaymentData) {
		if (billPaymentData.employee) {
			this.initialValues.employee['value'] = billPaymentData.employee.id;
			this.initialValues.employee['label'] = billPaymentData.employee.display_name;
			billPaymentData.employee = billPaymentData.employee.id;
		} else {
			this.initialValues.employee['value'] = '';
		}
	}

	vendorNamePatch(billPaymentData) {
		if (billPaymentData.party) {
			this.initialValues.vendor['value'] = billPaymentData.party.id;
			this.initialValues.vendor['label'] = billPaymentData.party.display_name;
			billPaymentData.party = billPaymentData.party.id;
		} else {
			this.initialValues.vendor['value'] = '';
		}
	}

	paymentModePatch(billPaymentData) {
		if (billPaymentData.payment_mode) {
			this.initialValues.paymentMode['value'] = billPaymentData.payment_mode.id;
			this.initialValues.paymentMode['label'] = billPaymentData.payment_mode.name;
			billPaymentData.payment_mode = billPaymentData.payment_mode.id;
		} else {
			this.initialValues.paymentMode['value'] = '';
		}
	}

	addErrorClass(controlName: AbstractControl) {
		return TransportValidator.addErrorClass(controlName);
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

	setValidators() {
		const outBills = this.editBillPaymentForm.controls['outstanding_bills'] as UntypedFormArray;
		const outBillsLabour = this.editBillPaymentForm.controls['outstanding_labour_bills'] as UntypedFormArray;
		const vendorAdvances = this.editBillPaymentForm.controls['vendor_advances'] as UntypedFormArray;
		let creditNotes = this.editBillPaymentForm.controls['vendor_credit'] as UntypedFormArray;

		outBills.controls.forEach((bill) => {
			const totalBalance = bill.get('total_balance');
			const balance = bill.get('balance').value;
			if (bill.get('selected').value) {
				const usedAmount = defaultZero(balance) - defaultZero(totalBalance.value);
				if (usedAmount == 0) {
					totalBalance.setValidators(TransportValidator.forceInvalidate);
				} else {
					totalBalance.setValidators([Validators.min(0), Validators.max(balance)]);
				}
			} else {
				totalBalance.clearValidators();
			}
			totalBalance.updateValueAndValidity({ emitEvent: true });
		});


		// labour bill validation
		outBillsLabour.controls.forEach((bill) => {
			const totalBalance = bill.get('total_balance');
			const balance = bill.get('labour_balance').value;
			if (bill.get('selected').value) {
				const usedAmount = defaultZero(balance) - defaultZero(totalBalance.value);
				if (usedAmount == 0 && defaultZero(balance) > 0) {
					totalBalance.setValidators(TransportValidator.forceInvalidate);
				} else {
					totalBalance.setValidators([Validators.min(0), Validators.max(balance)]);
				}
			} else {
				totalBalance.clearValidators();
			}
			totalBalance.updateValueAndValidity({ emitEvent: true });
		});

		vendorAdvances.controls.forEach((cadvance) => {
			const amountUsed = cadvance.get('availing');
			const totalBalance = cadvance.get('balance');
			if (cadvance.get('selected').value) {
				amountUsed.setValidators([Validators.min(0.01), Validators.max(totalBalance.value)])
			} else {
				amountUsed.clearValidators();
			}
			amountUsed.updateValueAndValidity({ emitEvent: true });
		});

		creditNotes.controls.forEach((cnote) => {
			let amountUsed = cnote.get('availing');
			let totalBalance = cnote.get('balance');
			if (cnote.get('selected').value) {
				amountUsed.setValidators([Validators.min(0.01), Validators.max(totalBalance.value)])
			} else {
				amountUsed.clearValidators();
			}
			amountUsed.updateValueAndValidity({ emitEvent: true });
		});
	}

	clearControlValidator(control: AbstractControl) {
		control.clearValidators();
		control.updateValueAndValidity({ emitEvent: true });
	}

	stopLoaderClasstoBody() {
		let body = document.getElementsByTagName('body')[0];
		body.classList.add('removeLoader');
	}
	revenueHeader(data) {
		if (this.isTax) {
			this.editBillPaymentForm.get('is_tax_deducted').setValue(data['payementDetails'].is_tax_deducted)
			this.editBillPaymentForm.get('deduction_amount').setValue(Number(data['payementDetails'].deduction_amount));
			this.deductAmountDisabled = false;
			if (this.editBillPaymentForm.controls['is_tax_deducted'].value == false) {
				this.deductAmountDisabled = true;
				this.editBillPaymentForm.controls['deduction_amount'].setValue('0.00');
				const bills = this.editBillPaymentForm.controls['outstanding_bills'] as UntypedFormArray;
				bills.controls.forEach(element => {
					element.get('withheld').setValue(0);
				});
				this.calculateAmountPaid();
			} else {
				this.deductAmountDisabled = false;
			}
		}
	}

	onChangeBillWithheld(index, id) {
		const amount = this.editBillPaymentForm.get('outstanding_bills')['controls'][index].controls.withheld.value;
		const selected = this.editBillPaymentForm.get('outstanding_bills')['controls'][index].controls.selected;
		this.editBillPaymentForm.get('outstanding_bills')['controls'][index].controls.bill.setValue(id);
		amount > 0 ? selected.setValue(true) : '';
		this.calculateAmountPaid();
	}

	onChangeBillLabourWithheld(index, id) {
		const amount = this.editBillPaymentForm.get('outstanding_labour_bills')['controls'][index].controls.withheld.value;
		const selected = this.editBillPaymentForm.get('outstanding_labour_bills')['controls'][index].controls.selected;
		this.editBillPaymentForm.get('outstanding_labour_bills')['controls'][index].controls.labour_bill.setValue(id);
		amount > 0 ? selected.setValue(true) : '';
		this.calculateLabourAmountPaid();
	}

	onChangeBillForemanWithheld(index, id) {
		const amount = this.editBillPaymentForm.get('outstanding_foreman_bills')['controls'][index].controls.withheld.value;
		const selected = this.editBillPaymentForm.get('outstanding_foreman_bills')['controls'][index].controls.selected;
		this.editBillPaymentForm.get('outstanding_foreman_bills')['controls'][index].controls.labour_bill.setValue(id);
		amount > 0 ? selected.setValue(true) : '';
		this.calculateLabourAmountPaid();
	}

	getLabourBills(id) {
		this._partyService.getOperationLabourBill(id).subscribe(resp => {
			this.labourList = resp['result'];
			this.buildLabourBills(this.labourList);
		});
	}


	getForemanBills(id) {
		this._partyService.getOperationForemanBill(id).subscribe(resp => {
			this.foremanList = resp['result'];
			this.buildForemanBills(this.foremanList);
		});
	}

	getDigitalSignatureList() {
		this._commonService.getDigitalSignatureList().subscribe(data => {
			this.digitalSignature = data['result']['data']
		})
	}
}


