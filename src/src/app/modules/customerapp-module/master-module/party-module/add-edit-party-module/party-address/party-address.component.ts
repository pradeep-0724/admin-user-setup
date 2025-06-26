import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CountryIdService } from 'src/app/core/services/countryid.service';
import { CompanyModuleServices } from 'src/app/modules/customerapp-module/api-services/company-service/company-module-service.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { getCountryDetails } from 'src/app/shared-module/utilities/countrycode-utils';

@Component({
  selector: 'app-party-address',
  templateUrl: './party-address.component.html',
  styleUrls: ['./party-address.component.scss']
})
export class PartyAddressComponent implements OnInit ,AfterViewInit{
  billingAddress=false;
  shippingAddress=false;
  is_same_as_billing=false;
  @Input() partyAddress:FormArray;
  @Input() editData?:Observable<any>
  statesShipping=[];
  country=[];
  statesBilling=[];
  countryId=''
  constructor(private _companyModuleService: CompanyModuleServices,		private _countryId: CountryIdService,
    ) { }

  ngOnInit(): void {
    this.countryId = this._countryId.getCountryId();
		this._companyModuleService.getStates(getCountryDetails(this.countryId).id).subscribe(result => {
			this.statesBilling = result['results'];
		})
    this.getCountry();
    if(this.editData){
      this.editData.subscribe(data=>{
        setTimeout(() => {
          this.patchAddress(data);
        }, 1000);
     
      })
      }

  }

  addErrorClass(controlName: AbstractControl) {
		return TransportValidator.addErrorClass(controlName);
	}

  ngAfterViewInit(): void {
    const billingAddress = this.partyAddress.at(0);
    const shippingAddress = this.partyAddress.at(1);
    billingAddress.valueChanges.pipe(debounceTime(100),distinctUntilChanged()).subscribe(changed=>{
      if (shippingAddress.get('is_same_as_billing').value) {
        shippingAddress.patchValue(billingAddress.value)
				shippingAddress.get('address_type').setValue(1);
				this.getStateShipping()
			}
    })
  }

  toggleSameAddress() {
    const billingAddress = this.partyAddress.at(0);
    const shippingAddress = this.partyAddress.at(1);
    if (shippingAddress.get('is_same_as_billing').value) {
      shippingAddress.patchValue(billingAddress.value)
      shippingAddress.get('address_type').setValue(1);
      this.getStateShipping()
    } else {
      shippingAddress.reset();
      shippingAddress.get('address_type').setValue(1);
    }
	}

  billingCountryChange(){
   this.getStates();
   this.partyAddress.at(0).get('state').setValue('');
  }

  shippingCountryChange(){
    this.partyAddress.at(1).get('state').setValue('');
    this.getStateShipping();
  }




  getStates() {
		let countryName = this.partyAddress.at(0).get('country').value;
		let val = this.country.filter(country => country.name === countryName);
    if(val.length)
		this._companyModuleService.getStates(val[0].id).subscribe(result => {
			this.statesBilling = result['results'];
		})
	}

  getStateShipping() {
		let countryName = this.partyAddress.at(1).get('country').value;
		let val = this.country.filter(country => country.name == countryName);
    if(val.length)
		this._companyModuleService.getStates(val[0].id).subscribe(result => {
			this.statesShipping = result['results'];
		})
	}

  getCountry() {
		this._companyModuleService.getCountry().subscribe(result => {
			this.country = result['results'];

		})
	}

  patchAddress(data){
    
    let billingAddress = this.partyAddress.at(0);
    let shippingAddress = this.partyAddress.at(1);
    billingAddress.patchValue(data['address'][0])
    shippingAddress.patchValue(data['address'][1])
    billingAddress.get('address_type').setValue(0)
    shippingAddress.get('address_type').setValue(1)
    if(!billingAddress.get('country').value){
      billingAddress.get('country').setValue( getCountryDetails(this.countryId).country)
    }
    const isSame=(billingAddress.value['address_line_1']==shippingAddress.value['address_line_1'])&& (billingAddress.value['country']==shippingAddress.value['country'])&&(billingAddress.value['pincode']==shippingAddress.value['pincode'])&& (billingAddress.value['state']==shippingAddress.value['state'])&& (billingAddress.value['street']==shippingAddress.value['street'])
    shippingAddress.get('is_same_as_billing').setValue(isSame)
  }

}
