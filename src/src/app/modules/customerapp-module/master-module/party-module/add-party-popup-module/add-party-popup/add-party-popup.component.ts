import { roundOffAmount } from 'src/app/shared-module/utilities/helper-utils';
import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, AbstractControl, UntypedFormArray, UntypedFormControl, FormGroup } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';

import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { PartyService } from 'src/app/modules/customerapp-module/api-services/master-module-services/party-service/party.service';
import { TripService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/trip-services/trip.service';
import { CompanyModuleServices } from 'src/app/modules/customerapp-module/api-services/company-service/company-module-service.service';
import { AddressLengthService } from 'src/app/core/services/addresslength.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { BehaviorSubject } from 'rxjs';
import { getCountryCode } from 'src/app/shared-module/utilities/countrycode-utils';
import { CountryIdService } from 'src/app/core/services/countryid.service';

@Component({
  selector: 'app-add-party-popup',
  templateUrl: './add-party-popup.component.html',
  styleUrls: [
    './add-party-popup.component.scss'
  ],

})
export class AddPartyPopupComponent implements OnInit, OnChanges {
  @Input() popDetail: any = { name: '', status: false };
  @Output() closeModal = new EventEmitter<any>();
  @Output() partyAdded = new EventEmitter<any>();
  @Input() isVendor = false;
  @Input() vendorPartyType: string = '0'


  activeTab = 1;
  billingAddress: Boolean = true;
  shippingAddress: Boolean = true;
  documentAttachments: any = [];
  addPartyForm;
  billingStateList: any;
  PlaceOfSupplyStateList: any;
  billingStateSelected: Boolean = false;
  shippingStateList: any;
  shippingStateSelected: Boolean = false;
  applyTDS: Boolean = false;
  tdsSections: any = [];
  accountList: any = [];
  accountType = new ValidationConstants().accountType.join(',');
  hideGst: boolean = false;
  initialDetails = {
    state: {},
    billingState: {},
    placeOfSupply: {},
    tdsSection: {},
    country: {},
    billingCountry: {},
    mobile_country_code: {}

  };
  tdsApi = TSAPIRoutes.static_options;
  tdsParams = {};
  partyType: Array<any> = [{ label: 'Client', id: 0 }, { label: 'Vendor', id: 1 }]
  unregisteredGst = new ValidationConstants().unregisteredGst;
  mobile_error: string;
  contact_number_error: string;
  display_name_error: string
  apiError: string;
  selectedState: String;
  selectedStateShipping: any;
  documents: any = [];
  i;
  opening_balance_present: boolean = false;
  country = [];
  countryPhoneCode = [];
  addressLength: any
  isTax = true;
  taxDetails = {
    formData: {},
    isFormValid: false
  }
  isTaxValid = new BehaviorSubject(true);



  constructor(
    private _fb: UntypedFormBuilder,
    private _commonService: CommonService,
    private _partyService: PartyService,
    private _tripService: TripService,
    private _companyModuleService: CompanyModuleServices,
    private _addressLength: AddressLengthService,
    private _isTax: TaxService,
    private _countryId: CountryIdService,


  ) { }

  close() {
    this.buildForm();
    this.initialDetails = {
      state: {},
      billingState: {},
      placeOfSupply: {},
      tdsSection: {},
      country: {},
      billingCountry: {},
      mobile_country_code: {}


    };
    this.popDetail.status = false;
    this.hideGst = false;
    this.applyTDS = false;
    this.apiError = "";
    this.display_name_error = "";
    this.contact_number_error = "";
    this.mobile_error = "";
    this.closeModal.emit(false);
  }
  countryId
  ngOnChanges(changes: SimpleChanges) {
    //Change in input decorator
    for (let propName in changes) {
      if (propName == 'popDetail') {
        const name = changes[propName].currentValue.name;
        setTimeout(() => {
          this.addPartyForm.controls.basic_detail.get('company_name').setValue(name);
          this.addPartyForm.controls.basic_detail.get('display_name').setValue(name);
        }, 1);
      }
    }
  }

  ngOnInit() {
    this.addressLength = this._addressLength.adressLength;
    this.isTax = this._isTax.getTax();
    this.countryId = this._countryId.getCountryId();
    this.buildForm();
    this.initialDetails.mobile_country_code['label'] = getCountryCode(this.countryId)
    this._companyModuleService.getPhoneCode().subscribe(result => {
      let codes = [];
      codes = result['results'];
      this.countryPhoneCode = codes.map(code => code.phone_code)
    })
    this._commonService.getOpeningBalanceStatus().subscribe((response: any) => {
      if (response.result.present) {
        this.opening_balance_present = true;
        this.patchOpeningBalanceDate(response.result.date);
      }
    });
    this._tripService.getAccounts({ q: this.accountType }).subscribe((response: any) => {
      this.accountList = response.result;
    });
    this.getCountry();

    this.onChanges();
  }


  onChanges() {
    this.addPartyForm.valueChanges.subscribe(val => {
      if (this.addPartyForm.valid)
        this.apiError = '';
    });
  }

  getCountry() {
    this._companyModuleService.getCountry().subscribe(result => {
      this.country = result['results'];
    })
  }

  getStates() {
    let countryName = this.addPartyForm.controls.address.controls[0].get('country').value;
    let val = this.country.filter(country => country.name == countryName);
    this._companyModuleService.getStates(val[0].id).subscribe(result => {
      this.billingStateList = result['results'];
    })
  }

  getStateShipping() {
    let countryName = this.addPartyForm.controls.address.controls[1].get('country').value;
    let val = this.country.filter(country => country.name == countryName);
    this._companyModuleService.getStates(val[0].id).subscribe(result => {
      this.shippingStateList = result['results'];
    })
  }


  patchOpeningBalanceDate(opening_balance_date) {
    this.addPartyForm.controls.balance_billing.get('opening_balance_date').setValue(opening_balance_date);
    this.addPartyForm.controls.balance_billing.get('opening_balance_date').disable();
  }

  setDisplayName() {
    this.addPartyForm.get('basic_detail').get('display_name').setValue(this.addPartyForm.get('basic_detail').get('company_name').value)
  }


  buildForm() {
    this.addPartyForm = this._fb.group({
      tax_details: this._fb.group({
        apply_tds: false,
        gstin: "",
        id: null,
        pan: "",
        tds_attachment: [[]],
        tds_declaration: false,
        treatment: "aa5ce0dc-bf9f-4e01-b7bd-ed58b76d9ac4",
        crn_no : '',
        crn_treatment : null
      }),
      basic_detail: this._fb.group({
        party_type: [
          0
        ],
        vendor_party_type: ["-1"],
        display_name: [
          '',
          [Validators.required, Validators.maxLength(255)]
        ],
        company_name: [
          '',
          [Validators.required, Validators.maxLength(255)]
        ],
        email_address: [
          '',
          [TransportValidator.emailValidator, Validators.maxLength(46)]
        ],
        phone: [
          '',

        ],
        mobile: [
          '',[TransportValidator.mobileNumberValidator()]

        ],
        mobile_country_code: [
          getCountryCode(this.countryId)
        ],
      }),
      address: this._fb.array([
        this._fb.group({
          address_line_1: [
            '', Validators.maxLength(this.addressLength.address_length)
          ],
          street: [
            '', Validators.maxLength(parseInt(this.addressLength.address_length))
          ],
          state: [
            ''
          ],
          country: [
            ''
          ],
          pincode: [
            null,
            [TransportValidator.pinCodeValidator,
            Validators.maxLength(70)
            ]
          ],
          address_type: [
            0
          ]
        }),
        this._fb.group({
          address_line_1: [
            '', Validators.maxLength(parseInt(this.addressLength.address_length))
          ],
          street: [
            '', Validators.maxLength(parseInt(this.addressLength.address_length))
          ],
          state: [
            ''
          ],
          country: [
            ''
          ],
          pincode: [
            null,
            [TransportValidator.pinCodeValidator,
            Validators.maxLength(70)
            ]
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
        billing_delivery_method: [
          null
        ],
        terms: [
          null
        ]
      }),
      attachments: this._fb.group({
        notes: [
          ''
        ],
        documents: [
          []
        ]
      }),
      contact: this._fb.array([this._fb.group({
        title: [
          ''
        ],
        first_name: [
          ''
        ],
        last_name: [
          ''
        ],
        contact_number: [
          ''
        ],
        email_address: [
          '', [TransportValidator.emailValidator]
        ]
      })])
    });
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

  fileUploaded(filesUploaded: any, documentIndex: any) {
    filesUploaded.forEach((element: any) => {
      this.documentAttachments.push(element.id);
    });
  }

  fileDeleted(deletedFileIndex: any, documentIndex: any) {
    this.documentAttachments.splice(deletedFileIndex, 1);
  }



  submitPartyForm() {
    this.apiError = '';
    const address = this.addPartyForm.controls['address'] as UntypedFormGroup;
    address.get('0').get('address_type').setValue(0);
    address.get('1').get('address_type').setValue(1);

    let form = this.addPartyForm as FormGroup;

    if (this.isVendor) {
      this.addPartyForm.controls.basic_detail.get('party_type').setValue(1);
      this.addPartyForm.controls.basic_detail.get('vendor_party_type').setValue(this.vendorPartyType);
    }
    form.patchValue({
      tax_details: this.taxDetails.formData
    });
    if (!this.isTax) {
      this.taxDetails.isFormValid = true;
    }
    if (form.valid && this.taxDetails.isFormValid) {
      this._partyService.postPartyDetails(this.buildRequest(form)).subscribe((response: any) => {
        this.apiError = '';
        this.partyAdded.emit({ label: form.value.basic_detail.display_name, id: response.result, status: true });
        this.close();
      },
        (error) => {
          this.mobile_error = ''
          this.contact_number_error = ''
          this.display_name_error = ''
          this.apiError = ''
          if (error.error.hasOwnProperty("message")) {
            this.apiError = error.error.message;
            window.scrollTo(0, 0);
          }
          if (error.error.hasOwnProperty("serializer")) {
            let controlsName = Object.keys(error.error.serializer)[0]
            switch (controlsName) {
              case 'mobile':
                this.mobile_error = error.error.serializer.mobile;
                window.scrollTo(0, 0);
                break;
              case 'contact_number':
                this.contact_number_error = error.error.serializer.contact_number;
                window.scrollTo(0, 0);
                break;
              case 'display_name':
                this.display_name_error = error.error.serializer.display_name;
                window.scrollTo(0, 0);
                break;

            }
          }
        });
    } else {
      this.apiError = new ValidationConstants().enterValidDetail;
      this.isTaxValid.next(this.taxDetails.isFormValid);
      this.setAsTouched(form);
      window.scrollTo(0, 0);
    }
  }


  removeCountryFromAddress(address) {
    if (address['address_line_1'].trim().length
      || (typeof (address['pincode']) == 'object' && address['pincode'] != null)
      || (typeof (address['pincode']) == 'string' && address['pincode'].trim().length)
      || address['state'].trim().length ||
      address['street'].trim().length) {
      return false
    }
    return true;
  }

  buildRequest(form: UntypedFormGroup) {
    form.patchValue({
      balance_billing: {
        opening_balance_date: changeDateToServerFormat(form.get('balance_billing.opening_balance_date').value)
      },
      attachments: {
        documents: this.documentAttachments
      }
    });

    var data = form.value;

    if (this.removeCountryFromAddress(data['address'][0])) {
      data['address'][0]['country'] = ""
    }
    if (this.removeCountryFromAddress(data['address'][1])) {
      data['address'][1]['country'] = ""
    }
    return data
  }


  // round off amount
  roundOffValue(formControl) {
    roundOffAmount(formControl);
  }

  partyTaxOutputData(data) {
    this.taxDetails = data;
  }
}
