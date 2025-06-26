import { TSAPIRoutes } from '../../../../../../core/constants/api-urls.constants';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormArray, Validators, AbstractControl, UntypedFormGroup, UntypedFormControl, UntypedFormBuilder } from '@angular/forms';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { CommonService } from 'src/app/core/services/common.service';
import { BankService } from '../../../../api-services/master-module-services/bank-service/bank.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { isValidValue, roundOffAmount } from 'src/app/shared-module/utilities/helper-utils';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { TerminologiesService } from 'src/app/core/services/terminologies.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';



@Component({
	selector: 'app--edit-bank',
	templateUrl: './bank.component.html',
	styleUrls: [
		'./bank.component.scss'
	]
})
export class BankComponent implements OnInit,OnDestroy {
	bankId: any;
	editBankForm;
	bankDetails: any;
	apiError: String = "";
	patterns = new ValidationConstants().VALIDATION_PATTERN;
	initialValues: any = {
		accountType: {},
		bankName: {}
	};
	bankList: any;
	accountTypeList: any;
	addBankApi = TSAPIRoutes.static_options;
	addBankParams: any = {};
	display_name_error: string = "";
	currency_type;

	accountTypePostApi = TSAPIRoutes.static_options;
	accountTypeParams: any = {};
	opening_balance_present: boolean = false;
	opening_balance_date = null;
	accountTypes = []

	current_date: Date = new Date(dateWithTimeZone());
	prefixUrl = '';
	terminology: any;
	isTax = true;
	analyticsType = OperationConstants;
	analyticsScreen = ScreenConstants;
	screenType = ScreenType;
	goThroughDetais = {
		show: false,
		url: "https://demo.arcade.software/lsS6oKXpKBJhCkdRruWW?embed"
	}
	isTDS = false;

	videoUrl = "https://ts-pub-directory.s3.ap-south-1.amazonaws.com/Bank+n+Chart+of+Accounts.mp4"
	constructor(
		private _fb: UntypedFormBuilder,
		private _routeParam: ActivatedRoute,
		private _commonService: CommonService,
		private _bankService: BankService,
		private _router: Router,
		private currency: CurrencyService,
		private _prefixUrl: PrefixUrlService,
		private _terminologiesService: TerminologiesService,
		private _isTax: TaxService,
		private _analytics: AnalyticsService,
		private _scrollToTop: ScrollToTop,
		private _commonloaderservice: CommonLoaderService,
		private apiHandler: ApiHandlerService, 
	) { }

	ngOnDestroy(): void {
		this._commonloaderservice.getShow();
	}
	ngOnInit() {
		this._commonloaderservice.getHide();
		this.isTax = this._isTax.getTax();
		this.isTDS = this._isTax.getVat();
		this.terminology = this._terminologiesService.terminologie;
		this.prefixUrl = this._prefixUrl.getprefixUrl();
		setTimeout(() => {
			this.currency_type = this.currency.getCurrency();
		}, 1000);
		this.buildForm();
		this._commonService.getStaticOptions('financier,account-type').subscribe((response: any) => {
			this.bankList = response.result['financier'];
			this.accountTypeList = response.result['account-type'];
		});
		this._routeParam.params.subscribe((params) => {
			this.bankId = params.bank_id;
			if (this.bankId) {
				this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.BANK, this.screenType.EDIT, "Navigated");
				this._bankService.getSingleBank(this.bankId).subscribe((response: any) => {
					this.bankDetails = response.result;
					this.patchAccountType()
					this.patchBankeName();
					this.patchFormValues(this.bankDetails);
					this.patchOpenings();
					this.editBankForm.controls['confirm_account_number'].setValue(this.bankDetails.account_number);
					

				});
			}
			if (!this.bankId) {
				this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.BANK, this.screenType.ADD, "Navigated");
				this._commonService.getOpeningBalanceStatus().subscribe((response: any) => {
					if (response.result.present) {
						this.opening_balance_present = true;
						this.opening_balance_date = response.result.date;
						this.patchOpeningBalanceDate();
					}
				});
			}
		});
	}

	patchOpenings() {
		this.editBankForm.controls['opening_balance_date'].setValue(this.bankDetails.opening_balance_date);
		this.editBankForm.controls['opening_balance'].setValue(this.bankDetails.opening_balance);
	}

	openGothrough() {
		this.goThroughDetais.show = true;
	}

	patchOpeningBalanceDate() {

		this.editBankForm.get('opening_balance_date').setValue(this.opening_balance_date);
		this.editBankForm.get('opening_balance_date').disable();
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

	getNewAccountTypesTypes($event) {
		if ($event) {
			this.initialValues.accountType = {}
			this.getAccountTypes();
			this.initialValues.accountType = { value: $event.id, label: $event.label };
			this.editBankForm.controls.account_type.setValue($event.id);
		}
	}


	patchBankeName() {
		if (isValidValue(this.bankDetails.bank_name)) {
			this.initialValues.bankName['label'] = this.bankDetails.bank_name.label;
			this.initialValues.bankName['value'] = this.bankDetails.bank_name.id;
			this.editBankForm.controls.bank_name.setValue(this.bankDetails.bank_name.id);
		}
		else {
			this.editBankForm.controls.account_type.setValue(null);
		}
	}

	patchAccountType() {
		if (isValidValue(this.bankDetails.account_type)) {
			this.initialValues.accountType['label'] = this.bankDetails.account_type.label;
			this.initialValues.accountType['value'] = this.bankDetails.account_type.id;
			this.editBankForm.controls.bank_name.setValue(this.bankDetails.account_type.id);
		}
		else {
			this.editBankForm.controls.account_type.setValue(null);
		}
	}

	buildForm() {
		this.editBankForm = this._fb.group({
			id: [
				Validators.required
			],
			display_name: [
				'', [Validators.required, Validators.maxLength(30)]
			],
			bank_name: [
				'',
				Validators.required
			],
			account_holder_name: [
				'',
				Validators.required
			],
			account_number: [
				'',
				[
					Validators.required, Validators.maxLength(20), Validators.pattern(this.patterns.NUMBER_ONLY)
				]
			],
			confirm_account_number: [
				'',
				[
					Validators.required,
					Validators.pattern(this.patterns.NUMBER_ONLY),
					TransportValidator.confirmAccount
				]
			],
			account_type: [
				null, Validators.required
			],
			ifsc_code: [
				'', [Validators.pattern(this.patterns.IFSC)]
			],
			remarks: [
				''
			],
			iban_code: [null, [Validators.maxLength(34), Validators.pattern(this.patterns.ALPHA_NUMERIC)]],
			swift_code: [null, [Validators.maxLength(14), Validators.pattern(this.patterns.ALPHA_NUMERIC)]],
			opening_balance: [
				0
			],
			opening_balance_date: [
				null
			],
		});

		this.editBankForm.controls.account_number.valueChanges.subscribe((newValue) => {
			this.editBankForm.controls.confirm_account_number.reset();
		});
		return this.editBankForm;
	}

	patchFormValues(data: any) {
		data.bank_name = data.bank_name !== null ? data.bank_name.id : '';
		data.account_type = data.account_type !== null ? data.account_type.id : '';
		this.editBankForm.patchValue(data);
	}

	setDisplayName() {
		this.editBankForm.get('display_name').setValue(this.editBankForm.get('account_holder_name').value)
	}

	/* getFormValues() {
		this._stateService.getFromStore(TSStoreKeys.master_employee_edit_information).subscribe((storeData) => {
		  if (storeData !== undefined) {
			this.patchFormValues(storeData.detail);
		  }
		});
	  } */

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


	submitForm(form: UntypedFormGroup) {
		event.preventDefault();
		this.display_name_error = "";
		if (form.valid) {
			this.apiError = '';
			if (this.bankId) {
				this.apiHandler.handleRequest(this._bankService.putBankDetails(this.prepareRequest(form), this.bankId), 'Bank details updated sucessfully!').subscribe(
					{
						next: () => {
							this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.BANK)
							this._router.navigate([this.prefixUrl +
								'/onboarding/bank/list/']);
						},
						error: (err) => {
							this.apiError = '';
							if (err.error.hasOwnProperty("message")) {
								this.apiError = err.error.message;
								this._scrollToTop.scrollToTop();
							}
							try {
								if (err.error.result.display_name[0]) {
									this.display_name_error = "Display Name already exists. Try different name"
								}
							} catch (error) {
							}
						}
					}
				);
			}
			else {
				this.apiHandler.handleRequest(this._bankService.postBankDetails(this.prepareRequest(form)),'Bank details added sucessfully!').subscribe((response: any) => {
					this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.BANK)
					this._router.navigate([this.prefixUrl +
						'/onboarding/bank/list/'
					]);
				},
					(err) => {						
						this.apiError = '';
						if (err.error.hasOwnProperty("message")) {
							this.apiError = err.error.message;
							this._scrollToTop.scrollToTop();
						}

						try {
							if (err.error.result[0].display_name) {
								this.display_name_error = "Display Name already exists. Try different name"
							}
						} catch (error) {
						}

					});
			}
		} else {
			this.setAsTouched(form);
			this._scrollToTop.scrollToTop();
		}
	}

	prepareRequest(form) {
		form.patchValue({
			opening_balance_date: changeDateToServerFormat(form.controls.opening_balance_date.value),
		})
		return form.value;
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
				// this.initialValues.bankName = {};
				this.bankList = response.result['financier'];
				// this.initialValues.bankName = {value: event.id, label: event.label};
				this.editBankForm.controls.bank_name.setValue(event.id);
			});
		}
	}

	// round off amount
	roundOffValue(formControl) {
		roundOffAmount(formControl);
	}

}
