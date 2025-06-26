import { TaxModuleServiceService } from './../../tax-module-service.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, AbstractControl, UntypedFormArray, UntypedFormControl } from '@angular/forms';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { BehaviorSubject, Observable } from 'rxjs';
import { getBlankOption, isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { TaxService } from 'src/app/core/services/tax.service';
import { TerminologiesService } from 'src/app/core/services/terminologies.service';
import { debounceTime } from 'rxjs/operators';
import { setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { CountryIdService } from 'src/app/core/services/countryid.service';


@Component({
	selector: 'app-party-tax',
	templateUrl: './party-tax.component.html',
	styleUrls: ['./party-tax.component.scss']
})

export class PartyTaxComponent implements OnInit {
	partyTaxFormIndian: UntypedFormGroup;
	applyTDS: Boolean = false;
	hideGst: boolean = false;
	tdsParams = {};
	treatmentOption = getBlankOption();
	corporateTaxSelectedOption = getBlankOption();
	unregisteredGst = new ValidationConstants().unregisteredGst;
	gstTreatments = [];
	tds = [];
	sos = [];
	isTds = false;
	isPOSRequired = false;
	@Output() partyTax = new EventEmitter<any>();
	@Input() makeFormDirty: Observable<any>;
	@Input() taxEdit: boolean;
	@Input() indianPartyPatchData: Observable<any>;
	@Input() isLarge = true;
	patchFileUrls = new BehaviorSubject([]);
	placeOfSupplyOption: { label: any; value: any; };
	terminology: any;
	isPlaceOfSupply: boolean = false;
	alphaNumneric = new ValidationConstants().VALIDATION_PATTERN.ALPHA_NUMERIC;
	countryId = '';
	hideCrn: boolean = true;

	constructor(
		private _fb: UntypedFormBuilder,
		private _taxService: TaxModuleServiceService,
		private _tax: TaxService,
		private _terminologiesService: TerminologiesService,
		private countryID: CountryIdService

	) {
		this.isTds = this._tax.getVat();
		this.isPlaceOfSupply = this._tax.isPlaceOfSupply();
		this.terminology = this._terminologiesService.terminologie;
	}

	ngOnInit() {
		this.buildForm();
		this.countryId = this.countryID.getCountryId();
		if (this.isTds) {
			this.partyTaxFormIndian.get('crn_treatment').setValidators(Validators.required);
			this.partyTaxFormIndian.get('crn_treatment').updateValueAndValidity();
		}
		let outputValue = {
			isFormValid: this.partyTaxFormIndian.valid,
			formData: this.partyTaxFormIndian.value
		}
		this.partyTax.emit(outputValue)
		this._taxService.getTaxOptions(this.countryId).subscribe(result => {
			this.gstTreatments = result.result['gst_treatments'];
			this.tds = result.result['tds'];
			this.sos = result.result['sos'];
		})

		this.partyTaxFormIndian.valueChanges.pipe(debounceTime(1000)).subscribe(data => {
			let outputValue = {
				isFormValid: this.partyTaxFormIndian.valid,
				formData: this.partyTaxFormIndian.value
			}
			this.partyTax.emit(outputValue)
		});
		this.makeFormDirty.subscribe(data => {
			if (!data) {
				this.setAsTouched(this.partyTaxFormIndian)
			}
		})

		if (this.taxEdit) {
			this.indianPartyPatchData.subscribe(data => {
				this.patchForm(data)
			});
		}
	}

	buildForm() {
		this.partyTaxFormIndian = this._fb.group({
			treatment: [
				'',
				[
					Validators.required
				]
			],
			gstin: [
				'',
				[
					Validators.required]
			],
			place_of_supply: [
				'',
				[
					Validators.required
				]
			],
			tds_section: [null],
			tds_percentage: [0],
			apply_tds: [
				false
			],
			tds_attachment: [[]],
			tds_declaration: [
				false
			],
			pan: [
				'', [
					TransportValidator.panNumberValidator
				]
			],
			id: [null],
			crn_treatment : [null],
			crn_no : ['']
		});
	}

	changeApplyTDS(ele) {

		this.applyTDS = ele.target.checked;
		this.partyTaxFormIndian.get('apply_tds').setValue(ele.target.checked);
		if (!this.applyTDS) {
			this.tdsParams = {}
			this.partyTaxFormIndian.get('tds_section').clearValidators();
			this.partyTaxFormIndian.get('tds_percentage').clearValidators();
			this.partyTaxFormIndian.get('tds_percentage').updateValueAndValidity();
			this.partyTaxFormIndian.get('tds_section').updateValueAndValidity();
		} else {
			this.partyTaxFormIndian.get('tds_section').setValidators(Validators.required);
			this.partyTaxFormIndian.get('tds_percentage').setValidators(Validators.required);
			this.partyTaxFormIndian.get('tds_percentage').updateValueAndValidity();
			this.partyTaxFormIndian.get('tds_section').updateValueAndValidity();
		}
	}

	addErrorClass(controlName: AbstractControl) {
		return TransportValidator.addErrorClass(controlName);
	}

	setAsTouched(group: UntypedFormGroup | UntypedFormArray) {
		group.markAsTouched();
		for (const i in group.controls) {
			if (group.controls[i] instanceof UntypedFormControl) {
				group.controls[i].markAsTouched();
			} else {
				this.setAsTouched(group.controls[i]);
			}
		}
	}

	upadteSectionPercentage(ele) {
		if (ele.target.value !== '') {
			this.tds.filter((section) => {
				if (section.id === ele.target.value) {
					this.partyTaxFormIndian.get('tds_percentage').patchValue(section.value);
				}
			});
			return;
		}
		this.partyTaxFormIndian.get('tds_percentage').patchValue('');
	}

	updateTdsValidity() {
		if (this.partyTaxFormIndian.get('apply_tds').value === false) {
			this.partyTaxFormIndian.get('tds_section').clearValidators();
			this.partyTaxFormIndian.get('tds_percentage').clearValidators();
			this.partyTaxFormIndian.get('tds_percentage').updateValueAndValidity();
			this.partyTaxFormIndian.get('tds_section').updateValueAndValidity();
		}
	}

	hideGstOnUnregister() {
		const gstForm = this.partyTaxFormIndian as UntypedFormGroup;
		if (gstForm.get('treatment').value == this.unregisteredGst) {
			this.hideGst = true;
			gstForm.controls.place_of_supply.disable();
			gstForm.controls.tds_section.disable();
			gstForm.controls.tds_percentage.disable();
			gstForm.controls.tds_declaration.setValue(false);
			gstForm.controls.gstin.setValidators(null);
			gstForm.controls.gstin.setValue('');
			gstForm.controls.gstin.updateValueAndValidity();
			this.placeOfSupplyOption = getBlankOption();
			if (!this.isPlaceOfSupply) {
				gstForm.controls.place_of_supply.disable();
				gstForm.controls.place_of_supply.setValidators(null);
				gstForm.controls.place_of_supply.updateValueAndValidity();
				this.isPOSRequired = false;
			}
		} else {
			this.hideGst = false;
			gstForm.controls.place_of_supply.enable();
			gstForm.controls.tds_section.enable();
			gstForm.controls.tds_percentage.enable();
			gstForm.controls.gstin.enable();
			if (!this.isPlaceOfSupply) {
				this.isPOSRequired = false;
				gstForm.controls.place_of_supply.setValidators([Validators.nullValidator]);
				gstForm.controls.place_of_supply.updateValueAndValidity();
			} else {
				this.isPOSRequired = true;
				gstForm.controls.gstin.setValidators([Validators.required, TransportValidator.gstValidator]);
			}
			if (this.isTds) {
				gstForm.controls.gstin.setValidators([Validators.required, TransportValidator.tranValidator, Validators.maxLength(15)]);
			}
			gstForm.controls.gstin.updateValueAndValidity();
			gstForm.controls.pan.setValue('');
		}

		if (!this.isPlaceOfSupply) {
			gstForm.controls.place_of_supply.disable();
			gstForm.controls.tds_section.disable();
			gstForm.controls.tds_percentage.disable();
			gstForm.controls.tds_declaration.setValue(false);
		}
	}

	patchForm(data) {
		let form = this.partyTaxFormIndian;
		if (data['id']) {
			form.patchValue(data);
			if (isValidValue(data['treatment'])) {
				form.get('treatment').setValue((data['treatment'].id))
				this.treatmentOption = { label: data['treatment'].label, value: data['treatment'].id }
			}
			if (isValidValue(data['place_of_supply']) && this.isPlaceOfSupply) {
				form.get('place_of_supply').setValue((data['place_of_supply']))
				this.placeOfSupplyOption = { label: data['place_of_supply'], value: data['place_of_supply'] }
			}
			if (isValidValue(data['crn_treatment'])) {
				form.get('crn_treatment').setValue((data['crn_treatment']?.id))
				this.corporateTaxSelectedOption = { label: data['crn_treatment']?.label, value: data['crn_treatment']?.id }
			}
			if (isValidValue(data['tds_section'])) {
				form.get('tds_section').setValue((data['tds_section'].id))
				this.tdsParams = { label: data['tds_section'].label, value: data['tds_section'].id };
				this.tds.filter((section) => {
					if (section.id === data['tds_section'].id) {
						this.partyTaxFormIndian.get('tds_percentage').patchValue(section.value);
					}
				});
				this.applyTDS = true;
				this.partyTaxFormIndian.get('apply_tds').setValue(true);
			}
			if (isValidValue(data['tds_declaration'])) {
				this.patchDocuments(data);
			}
			this.hideGstOnUnregister();
			this.updateTdsValidity();
			this.corporateTaxChanged();
		}
	}


	fileUploader(filesUploaded) {
		let documents = this.partyTaxFormIndian.get('tds_attachment').value;
		filesUploaded.forEach((element) => {
			documents.push(element.id);
		});
	}

	fileDeleted(deletedFileIndex) {
		let documents = this.partyTaxFormIndian.get('tds_attachment').value;
		documents.splice(deletedFileIndex, 1);
	}

	patchDocuments(data) {
		if (data.tds_attachment.length > 0) {
			let documentsArray = this.partyTaxFormIndian.get('tds_attachment') as UntypedFormControl;
			documentsArray.setValue([]);
			const documents = data.tds_attachment;
			let pathUrl = [];
			documents.forEach(element => {
				documentsArray.value.push(element.id);
				pathUrl.push(element);
			});
			this.patchFileUrls.next(pathUrl);
		}
	}

	corporateTaxChanged() {
		let tax = this.partyTaxFormIndian.get('crn_treatment').value;
		if (isValidValue(tax) && tax != this.unregisteredGst) {
			this.hideCrn = false;
			setUnsetValidators(this.partyTaxFormIndian, 'crn_no', [TransportValidator.crnValidator, Validators.maxLength(20), Validators.required])
		} else {
			this.hideCrn = true;
			this.partyTaxFormIndian.get('crn_no').setValue('')
			setUnsetValidators(this.partyTaxFormIndian, 'crn_no', [Validators.nullValidator])
		}


	}
}
