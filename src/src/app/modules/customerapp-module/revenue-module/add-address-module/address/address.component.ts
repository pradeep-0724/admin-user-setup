import { TransportValidator } from '../../../../../shared-module/components/validators/validators';
import { UntypedFormGroup, UntypedFormBuilder, AbstractControl, Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {  getBlankOption } from '../../../../../shared-module/utilities/helper-utils';
import { CompanyModuleServices } from 'src/app/modules/customerapp-module/api-services/company-service/company-module-service.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {

  @Input() address;
  @Output() emitAddress = new EventEmitter();
  addressForm: UntypedFormGroup;
  isEdit: Boolean = false;
  selectedIndex;
  addressTypes = ['Billing Address:', 'Shipping/Delivery Address:'];
  display_address = '';
  shippingStateList = [];
  initialValues: any = {
    state: {},
    country: {},

  };
  address_id;
  checked: Boolean = false;
  selectedState;
  country: any=[];

  constructor(private _fb: UntypedFormBuilder,
    private _companyModuleService:CompanyModuleServices,
    ) { }

  ngOnInit() {

     this.getCountry();

  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  buildForm(item) {
    this.addressForm = this._fb.group({
      address_line_1: [item.address_line_1 || ''],
      street: [item.street || ''],
      state: [item.state || ''],
      pincode: [item.pincode || null,[Validators.maxLength(70)]],
      country: [item.country || ''],
    });
    this.patchStateValues(item);
    this.patchCountryValues(item);
    this.patchFormValue(item);
    this.getStates()
  }

  patchFormValue(item) {
    this.addressForm.patchValue({
      address_line_1: item.address_line_1,
      street: item.street,
      state: item.state,
      country: item.country,
      pincode: item.pincode
    });
  }

  getStates(){
    let countryName = this.addressForm.get('country').value;
    if(!countryName) return
    let val = this.country.filter(country => country.name ==countryName );
    this._companyModuleService.getStates(val[0].id).subscribe(result=>{
      this.shippingStateList= result['results'];
    })
  }

  getCountry(){
    this._companyModuleService.getCountry().subscribe(result=>{
      this.country = result['results'];
    })
  }

  onEdit(index) {
    this.selectedIndex = index;
    this.display_address = this.addressTypes[index];
    this.buildForm(this.address[index]);
    this.address_id = this.address[index].id;
    this.onBillingStateChange();
    this.isEdit = true;
  }

  resetSelectedValues() {

    this.initialValues.country = getBlankOption();
    this.addressForm.controls.country.setValue(null);

  }

  onBillingStateChange() {
    this.selectedState = this.addressForm.controls['state'].value;
    if (this.selectedState !== '') {

    }
  }

  patchStateValues(address) {
    if (address.state) {
      this.initialValues.state['value'] = address.state;
      this.initialValues.state['label'] = address.state;
    } else {
      this.initialValues.state = getBlankOption();
    }
  }


  patchCountryValues(address) {
    if (address.country) {
      this.initialValues.country['value'] = address.country;
      this.initialValues.country['label'] = address.country;
    } else {
      this.initialValues.country = getBlankOption();
    }
  }



  cancelAddress() {
    this.isEdit = false;
  }

  toggleSameAddress(event) {
    this.checked = event.target.checked;
  }

  saveAddress() {
    if (this.checked) {
      this.address[0] = this.addressForm.value;
      this.address[1] = this.addressForm.value;
    }
    this.address[this.selectedIndex] = this.addressForm.value;
    this.emitAddress.emit(this.address);
    this.isEdit = false;
    this.checked = false;
  }



}
