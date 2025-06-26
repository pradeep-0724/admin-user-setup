import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, UntypedFormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { CommonService } from 'src/app/core/services/common.service';
import { CountryIdService } from 'src/app/core/services/countryid.service';
import { PhoneCodesFlagService } from 'src/app/core/services/phone-code_flag.service';
import { CompanyModuleServices } from 'src/app/modules/customerapp-module/api-services/company-service/company-module-service.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { getCountryCode } from 'src/app/shared-module/utilities/countrycode-utils';

@Component({
	selector: 'app-party-contact-person',
	templateUrl: './party-contact-person.component.html',
	styleUrls: ['./party-contact-person.component.scss']
})
export class PartyContactPersonComponent implements OnInit {
	@Input() partyForm: FormGroup;
	@Input() editData?: Observable<any>
	staticApi = TSAPIRoutes.static_options;
	initialValues: any = {
		designation:[],
		contact_number_country_code: [],
		contact_number_country_flag:[]
	};
	countryId = ''
	salutationList = [];
	countryPhoneCode = [];
	designationParam: any = {};
	designationList=[];
	countryPhoneCodeList=[]
	defaultPhoneFlag = {
		code: '',
		flag: ''
	  }

	constructor(private _countryId: CountryIdService, private _fb: FormBuilder, private _commonService: CommonService, private _companyModuleService: CompanyModuleServices, private _phone_codes_flag_service: PhoneCodesFlagService
	) { }

	ngOnInit(): void {
		this.defaultPhoneFlag = this._phone_codes_flag_service.phoneCodesFlag;
		this.countryId = this._countryId.getCountryId();
		this.getPhoneCountryCode()
		this.addContactItem([{}]);
		
		this._commonService.getStaticOptions('user-salutation,party-contact-designation').subscribe((response: any) => {
			this.salutationList = response.result['user-salutation'];
			this.designationList=response.result['party-contact-designation'];
		})
		this._companyModuleService.getPhoneCode().subscribe(result => {
			this.countryPhoneCode = result['results'].map(code => code.phone_code)
		})
		if (this.editData) {
			this.editData.subscribe(data => {
				this.patchContacts(data);
			})
		}
	}
	onCountryCodeSelection(form: AbstractControl,i) {	
		let contact_no = form.get('contact') as FormArray
		let code=contact_no.at(i).value['contact_number_country_code']
		let flag=this.getFlagByCode(code);
		this.initialValues.contact_number_country_flag[i]=flag
	  }

	addErrorClass(controlName: AbstractControl) {
		return TransportValidator.addErrorClass(controlName);
	}
	getPhoneCountryCode() {
		this._companyModuleService.getPhoneCode().subscribe(result => {
		  this.countryPhoneCodeList = result['results'];
		});
	  }

	changeinMarkasDefault(i) {
		const itemarray = this.partyForm.controls['contact'] as UntypedFormArray;
		itemarray.controls.forEach((item, index) => {
			if (i != index) {
				item.get('default_contact_person').setValue(false);
			}
		});
	}

	removeContactItem(i) {
		const itemarray = this.partyForm.controls['contact'] as UntypedFormArray;
		itemarray.removeAt(i);
		this.initialValues.designation.splice(i, 1);
		this.initialValues.contact_number_country_code.splice(i, 1);
		this.initialValues.contact_number_country_flag.splice(i,1);

	}

	addMoreItem() {
		const itemarray = this.partyForm.controls['contact'] as UntypedFormArray;
		const arrayItem = this.getContactForm({});
		itemarray.push(arrayItem);
		this.initialValues.designation.push({});
		this.initialValues.contact_number_country_code.push({ label: getCountryCode(this.countryId) });
		this.initialValues.contact_number_country_flag.push(this.defaultPhoneFlag.flag );

	}

	getContactForm(item) {
		return this._fb.group({
			id: [item.id || null],
			default_contact_person: [item.default_contact_person ? item.default_contact_person : false],
			designation: [item.designation || ''],
			first_name: [item.first_name || ''],
			contact_number: [item.contact_number || '', [TransportValidator.mobileNumberValidator()]],
			email_address: [item.email_address || '', [TransportValidator.emailValidator]],
			contact_number_country_code: [getCountryCode(this.countryId)],
			work_number: this._fb.group({
				ext: [item?.work_number?.ext || ''],
				no: [item?.work_number?.no || '']
			})
		})
	}

	addContactItem(items = []) {
		this.initialValues.designation=[]
		this.initialValues.contact_number_country_code=[];
		const itemarray = this.partyForm.controls['contact'] as UntypedFormArray;
		itemarray.controls = [];
		itemarray.reset();
		if (items.length == 0) {
			const arrayItem = this.getContactForm({});
			itemarray.push(arrayItem);
			this.initialValues.designation.push({})
			this.initialValues.contact_number_country_code.push({ label: getCountryCode(this.countryId) });
			this.initialValues.contact_number_country_flag.push(this.defaultPhoneFlag.flag );

		} else {
			items.forEach((item) => {
				const arrayItem = this.getContactForm(item);
				itemarray.push(arrayItem);
				this.initialValues.designation.push({})
				this.initialValues.contact_number_country_code.push({ label: getCountryCode(this.countryId) });
				this.initialValues.contact_number_country_flag.push(this.defaultPhoneFlag.flag );

			});
		}

	}
	getFlagByCode(code :String){
		let flag = this.countryPhoneCodeList.filter(e => e.phone_code == code)[0]?.flag_url
		return flag


	}

	patchContacts(data) {
		this.addContactItem(data['contact']);
		setTimeout(() => {
			data['contact'].forEach((contact, index) => {
				this.initialValues.designation[index]={label:contact['designation']};
				this.initialValues.contact_number_country_code[index]={label:contact['contact_number_country_code']};
				this.initialValues.contact_number_country_flag[index]=this.getFlagByCode(contact.contact_number_country_code)
			});
		}, 500);
	}

	addNewDesignation(event) {
		this.designationParam = { "label": event, "key": "party-contact-designation" }

	}

	getNewDesignation(e,form:FormGroup,index) {
		if(e){
			this.designationList.push(e)
			form.get('designation').setValue(e.label)
			this.initialValues.designation[index]={label:e.label};
		}
	}
}
