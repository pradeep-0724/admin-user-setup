import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, AbstractControl, UntypedFormArray, UntypedFormControl, FormGroup } from '@angular/forms';
import { PartyService } from '../../../../api-services/master-module-services/party-service/party.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { getBlankOption, isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { CompanyModuleServices } from 'src/app/modules/customerapp-module/api-services/company-service/company-module-service.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { AddressLengthService } from 'src/app/core/services/addresslength.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { getCountryCode, getCountryDetails } from 'src/app/shared-module/utilities/countrycode-utils';
import { CountryIdService } from 'src/app/core/services/countryid.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { cloneDeep } from 'lodash';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';
import { EmployeeService } from 'src/app/modules/customerapp-module/api-services/master-module-services/employee-service/employee-service';
import { getEmployeeObject } from '../../../employee-module/employee-utils';

@Component({
	selector: 'app-edit-party',
	templateUrl: './party.component.html',
	styleUrls: [
		'./party.component.scss'
	]
})
export class PartyComponent implements OnInit, OnDestroy ,AfterViewInit {
	partyId = '';
	editPartyForm: FormGroup;
	initialValues: any = {
		partyType: {},
		category: {},
		mobile_country_code: getBlankOption(),
		salesPerson : getBlankOption(),
		partyApprover : getBlankOption()

	};
	partyType: Array<any> = [{ label: 'Customer', id: 0 }, { label: 'Vendor', id: 1 }]
	partyData: any;
	pattern = new ValidationConstants();
	mobile_error: string;
	contact_number_error: string;
	apiError: string;
	display_name_error: any;
	currency_type;
	taxDetails = {
		formData: {},
		isFormValid: true
	}
	isTaxFormValid = true;
	isTaxValid = new BehaviorSubject(true);
	taxEditData = new BehaviorSubject({});
	isFormValid = new BehaviorSubject(true);
	isOtherDetailsValid = new BehaviorSubject(true);
	isTax = false;
	prefixUrl = '';
	categoryTypes = [
		{
			id: 2,
			value: 'Vehicle Provider'
		},
		{
			id: 0,
			value: 'Others'
		},
	];
	isCategoryTypeDisable = true;
	goThroughDetais = {
		show: false,
		url: "https://demo.arcade.software/share/La6OqQ5AHBg01Sj3jtbw"
	}
	countryId = ""
	analyticsType = OperationConstants;
	analyticsScreen = ScreenConstants;
	screenType = ScreenType;
	emailEditable = true;
	countryPhoneCode = [];
	openingBalanceDate;
	addressLength;
	editData = new Subject();
	documentEditList = new Subject();
	isClient = false;
	selectedTabIndex = 0;
	isValidCertificate=new Subject();
	isCertificatetabError=false;
	isCustomFieldTabError : boolean = false;
	employeeList:Array<any>=[];
	usersList:Array<any>=[];


	constructor(
		private _fb: UntypedFormBuilder,
		private _route: Router,
		private _partyService: PartyService,
		private _activeRoute: ActivatedRoute,
		private currency: CurrencyService,
		private _companyModuleService: CompanyModuleServices,
		private _prefixUrl: PrefixUrlService,
		private _isTax: TaxService,
		private _addressLength: AddressLengthService,
		private _analytics: AnalyticsService,
		private _countryId: CountryIdService,
		private _commonloaderservice: CommonLoaderService,
		private _scrollToTop: ScrollToTop,
		private apiHandler: ApiHandlerService,
		private _employeeService:EmployeeService,

	) {
		this.countryId = this._countryId.getCountryId();
	}
	
	ngOnDestroy(): void {
		this._commonloaderservice.getShow()
	}

	ngOnInit() {
		this.getUsersList();
		this.getEmployeeList().subscribe((response)=>{
      this.employeeList=response.result;
    })
		this.initialValues.partyType = { label: 'Customer', value: 0 },
		this.isCategoryTypeDisable = true;
		this.isClient = true;
		this.addressLength = this._addressLength.adressLength;
		this.prefixUrl = this._prefixUrl.getprefixUrl();
		this.isTax = this._isTax.getTax();
		this.currency_type = this.currency.getCurrency();
		this.buildForm();
		this.initialValues.mobile_country_code['label'] = getCountryCode(this.countryId)
		this._companyModuleService.getPhoneCode().subscribe(result => {
			this.countryPhoneCode = result['results'].map(code => code.phone_code)
		})

		

	}
	getUsersList(){
    this._companyModuleService.getActiveUsers().subscribe((res)=>{
      this.usersList=res.result['users'];
    })
  }
	handlePartyApproverChange(){
    let userId=this.editPartyForm.get('others').get('party_approver').value;
    let userObj=getEmployeeObject(this.usersList,userId);
    if(userObj){
      this.initialValues.partyApprover={label:userObj?.display_name,value:userId}
    }

  }
	handleEmployeeChange(){
			let empId=this.editPartyForm.get('basic_detail').get('sales_person_name').value;
			let empObj=getEmployeeObject(this.employeeList,empId);
			if(empObj){
				this.initialValues.salesPerson={label:empObj?.first_name,value:empId}
			}
		}
		getEmployeeList(){
			return this._employeeService.getEmployeesListV2()
		}

	ngAfterViewInit(): void {
		this._activeRoute.params.subscribe((params: any) => {
			this.partyId = params.party_id;
			this._commonloaderservice.getHide();
			if (this.partyId) {
				this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.PARTY, this.screenType.EDIT, "Navigated");
				this._partyService.getPartyDetails(this.partyId).subscribe((response) => {
					this.emailEditable = response.result.email_editable;
					this.buildPatchValues(response.result);
					this.taxEditData.next(response.result.tax_details)
				});

			}
			if (!this.partyId) {
				this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.PARTY, this.screenType.ADD, "Navigated");
			}
		});
		this._activeRoute.queryParamMap.subscribe((paramMap: ParamMap) => {   
			if (paramMap.has('tab')) {
			  this.selectedTabIndex=Number(paramMap.get('tab'))
			 }
		});
	}




	openGothrough() {
		this.goThroughDetais.show = true;
	}

	buildPatchValues(data: any) {
		const partyData = cloneDeep(data);
		this.patchPartyType(partyData);
		this.patchTopCountryCode(partyData);
		this.patchCategory(partyData)
		this.editPartyForm.patchValue(partyData);
		setTimeout(() => {
			this.documentEditList.next(partyData['certificates'])
			if(isValidValue(partyData)){
				if(partyData['basic_detail']['sales_person_name']){
					this.editPartyForm.get('basic_detail').get('sales_person_name').patchValue(partyData['basic_detail']['sales_person_name']['id']);
					this.initialValues.salesPerson.label = partyData['basic_detail']['sales_person_name']['name'];
				}
				if(partyData['others']['party_approver']){
					this.editPartyForm.get('others').get('party_approver').patchValue(partyData['others']['party_approver']['id']);
					this.initialValues.partyApprover.label = partyData['others']['party_approver']['name'];
				}
			}
			this.editData.next(data)
		}, 1000);
	}

	setDisplayName() {
		this.editPartyForm.get('basic_detail').get('display_name').setValue(this.editPartyForm.get('basic_detail').get('company_name').value)
	}

	patchPartyType(data) {
		if (isValidValue(data.basic_detail.party_type)) {
			this.initialValues.partyType['label'] = data.basic_detail.party_type.label;
			this.initialValues.partyType['value'] = data.basic_detail.party_type.index;
			data.basic_detail.party_type = data.basic_detail.party_type.index;
		}
	}

	patchTopCountryCode(data) {
		if (isValidValue(data.basic_detail.mobile_country_code)) {
			this.initialValues.mobile_country_code['label'] = data.basic_detail.mobile_country_code;
			this.initialValues.mobile_country_code['value'] = data.basic_detail.mobile_country_code;
			data.basic_detail.mobile_country_code = data.basic_detail.mobile_country_code;
		}

	}

	patchCategory(data) {
		if (isValidValue(data)) {
			this.initialValues.category = { label: data.vendor_party_type.label };
			this.editPartyForm.controls.basic_detail['controls'].vendor_party_type.setValue(data.vendor_party_type.index);
			if (data.vendor_party_type.index == -1) {
				this.isCategoryTypeDisable = true;
				this.isClient = true;
			} else {
				this.isCategoryTypeDisable = false;
				this.isClient = false;
			}
		}

	}


	buildForm() {
		this.editPartyForm = this._fb.group({
			certificates: this._fb.array([]),
			basic_detail: this._fb.group({
				party_type: [
					0,
					Validators.required
				],
				vendor_party_type: ["-1"],
				company_name: [
					'',
					[Validators.required, Validators.maxLength(255)]
				],
				email_address: [
					'',
					[TransportValidator.emailValidator, Validators.maxLength(42)]
				],
				display_name: [
					'',
					[Validators.required, Validators.maxLength(255)]
				],
				mobile: [
					'',
					[TransportValidator.mobileNumberValidator()]
				],
				mobile_country_code: [
					getCountryCode(this.countryId)
				],
				sales_person_name : null,
			}),
			tax_details: {},
			address: this._fb.array([
				this._fb.group({
					address_line_1: [
						'', Validators.maxLength(parseInt(this.addressLength.address_length))
					],
					street: [
						'', Validators.maxLength(parseInt(this.addressLength.address_length))
					],
					country: [
						getCountryDetails(this.countryId).country
					],
					state: [
						''
					],
					pincode: [
						null,
						[Validators.maxLength(70)]
					],
					address_type: [
						0
					]
				}),
				this._fb.group({
					is_same_as_billing: false,
					address_line_1: [
						'', Validators.maxLength(parseInt(this.addressLength.address_length))
					],
					street: [
						'', Validators.maxLength(parseInt(this.addressLength.address_length))
					],
					country: [
						''
					],
					state: [
						''
					],
					pincode: [
						null,
						[Validators.maxLength(70)]
					],
					address_type: [
						1
					]
				})
			]),

			balance_billing: this._fb.group({
				opening_balance: [
					0
				],
				opening_balance_date: [
					null
				],
				billing_payment_method: [
					null
				],
				credit_limit: 0,
				terms: [
					null
				],
				grace_period: 0,
				terms_days:0,
				kyc: [false],
				payment_mode : 0
			}),
			others: this._fb.group({
				notes: [
					'', [Validators.maxLength(255)]
				],
				party_approver:null,
			}),
			contact: this._fb.array([])
		});
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

	submitPartyForm() {
		this._commonloaderservice.getHide();
		const form = this.editPartyForm;
		if (!this.taxDetails.formData['tds_declaration']) {
			this.taxDetails.formData['tds_attachment'] = []
		}
		form.patchValue({
			tax_details: this.taxDetails.formData
		});
		if (!this.isTax) {
			this.taxDetails.isFormValid = true;
		}
		if (form.valid && this.taxDetails.isFormValid) {
			if (this.partyId) {
				const putData = this.buildRequest(form);
				this.apiHandler.handleRequest(this._partyService.putPartyDetails(putData, this.partyId),'Party details updated successfully!').subscribe(
					 {
						next: () => {
					if (this.isCategoryTypeDisable) {
						this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.CLIENTPARTIES);
					} else {
						this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.VENDORPARTIES);
					}
					let partyType = this.editPartyForm.get('basic_detail.party_type').value;
					if(Number(partyType)==0){
						this._route.navigate([this.prefixUrl + '/onboarding/party/details/client/',this.partyId],{ queryParams: { details: 'party' } })
					}else{
						this._route.navigate([this.prefixUrl + '/onboarding/party/details/vendor/',this.partyId],{ queryParams: { details: 'party' } })
					}
				  },
				  error: (error) => {
						this.display_name_error = ''
						this.apiError = '';
						if (error.error.message.includes('Party email already exists')) {
							this.editPartyForm.get('basic_detail').get('email_address').setErrors({ partyEmailError: true });
							this.editPartyForm.get('basic_detail').get('email_address').markAsTouched();
							this.apiError = new ValidationConstants().enterValidDetail;
							this._scrollToTop.scrollToTop();
						}
						if (error.error.message.includes('Form error')) {
							this.editPartyForm.get('basic_detail').get('display_name').setErrors({ companyUniqueError: true });
							this.editPartyForm.get('basic_detail').get('display_name').markAsTouched();

							this.apiError = new ValidationConstants().enterValidDetail;
							this._scrollToTop.scrollToTop();
						}
					}
					});
			}
			else {
				this.apiHandler.handleRequest(this._partyService.postPartyDetails(this.buildRequest(form)), 'Party details added successfully!').subscribe(
					{
						next: () => {
							if (this.isCategoryTypeDisable) {
								this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.CLIENTPARTIES);
							} else {
								this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.VENDORPARTIES);
							}
							this._route.navigateByUrl(this.prefixUrl + '/onboarding/party/view');
						},
						error: (error) => {
							this.display_name_error = ''
							this.apiError = '';
							if (error.error.message.includes('Party email already exists')) {
								this.editPartyForm.get('basic_detail').get('email_address').setErrors({ partyEmailError: true });
								this.editPartyForm.get('basic_detail').get('email_address').markAsTouched();
								this.apiError = new ValidationConstants().enterValidDetail;
								this._scrollToTop.scrollToTop();
							}
							if (error.error.message.includes('Form error')) {
								this.editPartyForm.get('basic_detail').get('display_name').setErrors({ companyUniqueError: true });
								this.editPartyForm.get('basic_detail').get('display_name').markAsTouched();

								this.apiError = new ValidationConstants().enterValidDetail;
								this._scrollToTop.scrollToTop();
							}
						}
					}
				);
			}
		} else {
			console.log(form)
			this.setAsTouched(form);
			this._scrollToTop.scrollToTop();
			this.isValidCertificate.next(form.get('certificates').valid)
			this.isCertificatetabError = form.get('certificates').invalid
			this.isTaxValid.next(this.taxDetails.isFormValid);
			this.isTaxFormValid = this.taxDetails.isFormValid;
			this.isOtherDetailsValid.next(form.get('others.other_details.other_details').valid);
			this.isCustomFieldTabError = form.get('others.other_details.other_details').invalid;
			
		}
	}


	removeCountryFromAddress(address) {
		if (address['address_line_1'].trim().length
			|| (typeof (address['pincode']) == 'object' && address['pincode'] != null)
			|| (typeof (address['pincode']) == 'string' && address['pincode'].trim().length)
			|| (address['state'] != null  && address['state'].trim().length) ||
			(address['street'] != null  && address['street'].trim().length)) {
			return false
		}
		return true;
	}

	buildRequest(form: UntypedFormGroup) {
		form.patchValue({
			balance_billing: {
				opening_balance_date: changeDateToServerFormat(form.get('balance_billing').get('opening_balance_date').value),
				grace_period:form.get('balance_billing.grace_period').value?form.get('balance_billing.grace_period').value:0
			}
		});
		var data = form.value;
		data['address'][0]['address_type']=0
		data['address'][1]['address_type']=1
		if (this.removeCountryFromAddress(data['address'][0])) {
			data['address'][0]['country'] = ""
		}
		if (this.removeCountryFromAddress(data['address'][1])) {
			data['address'][1]['country'] = ""
		}
		data['certificates'].forEach((doc, index) => {
			doc['expiry_date'] = changeDateToServerFormat(doc['expiry_date'])
			doc['issue_date'] = changeDateToServerFormat(doc['issue_date'])
			if (doc['files'].length) {
				doc['files'] = doc['files'].map(file => file.id)
			}
		});
		data['others']['custom_others'] = this.processCutsomFieldData(data['others']['other_details']['other_details']);
		// data['basic_detail']['sales_person_name'] = data['others']['sales_person_name']
		delete data['others']['other_details'];
		// delete data['others']['sales_person_name']		
		return data
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
		  if (item['field_type'] != "datetime") {
			item['value'] = (item['value'].toString())
		  }
		});
	
		return customFieldData
	  }

	partyTaxOutputData(data) {
		this.taxDetails = data;
	}

	changePartyType() {
		let form = this.editPartyForm.controls.basic_detail as UntypedFormGroup
		if (Number(form.get('party_type').value) == 1) {
			form.get('vendor_party_type').setValue('2');
			this.initialValues.category = { label: this.categoryTypes[0].value }
			form.get('vendor_party_type').setValidators([Validators.required]);
			this.isCategoryTypeDisable = false;
			this.isClient = false;
		} else {
			form.get('vendor_party_type').setValue("-1");
			this.initialValues.category = { label: '' }
			form.get('vendor_party_type').setValidators([Validators.nullValidator]);
			this.isCategoryTypeDisable = true;
			this.isClient = true;

		}
		form.get('vendor_party_type').updateValueAndValidity();
	 }






}
