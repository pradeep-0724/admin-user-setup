import { UntypedFormGroup, UntypedFormBuilder, Validators, AbstractControl, UntypedFormArray, UntypedFormControl } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { CompanyModuleServices } from '../../customerapp-module/api-services/company-service/company-module-service.service';
import {  Subject } from 'rxjs';
import { AddressLengthService } from 'src/app/core/services/addresslength.service';
import { cloneDeep } from 'lodash';



@Component({
  selector: 'app-company-detail-second-add',
  templateUrl: './company-detail-second-add.component.html',
  styleUrls: ['./company-detail-second-add.component.scss']
})
export class CompanyDetailSecondAddComponent implements OnInit {
	address: UntypedFormGroup;
	billing: Boolean = true;
	shipping: Boolean = true;
	billingStateSelected: Boolean = false;
  shippingStateSelected: Boolean = false;
  initialDetails={
    country1:{},
    state1:{},
    country2:{},
    state2:{}
  };
  country: any=[];
  statesBilling=[];
  statesShipping =[]
  @Output() addreesDetails =  new EventEmitter();
  @Input() editValues: Subject <any>=new Subject()
  addressLength:any


	constructor(
		private _fb: UntypedFormBuilder,
    private _companyModuleService:CompanyModuleServices,
    private _addressLength:AddressLengthService,


	) { }

	ngOnInit() {
    this.addressLength = this._addressLength.adressLength;
    if(localStorage.getItem('country')){
      this.addressLength ={
        address_length:'70'
      }
    }
    this.buildForm();
    this.getCountry();
    this.editValues.subscribe((data)=>{
       setTimeout(() => {
        if(data.address.length){
          this.patchForm(data)
        }else{
          this.patchCountry(data)
        }
    }, 1000);      
    })
    this.address.valueChanges.subscribe((data)=>{
      this.addreesDetails.emit(this.address.value)
    })

	}

  checkBillingSameAsShipping(){
        let billingAddress = cloneDeep( this.address.get('billing_address').value)
        let shipingAddress =cloneDeep(this.address.get('shipping_address').value)
        delete billingAddress['address_type']
        delete shipingAddress['address_type']
        let is_same_as_billing=JSON.stringify(billingAddress)==JSON.stringify(shipingAddress)
      if(!is_same_as_billing){
        this.address.get('is_same_as_billing').setValue(false)
      }else{
        this.address.get('is_same_as_billing').setValue(true)
      }
  }

	buildForm() {
		this.address = this._fb.group({
      is_same_as_billing:false,
			billing_address: this._fb.group({
				address_line_1: [
					'',Validators.maxLength(this.addressLength?parseInt(this.addressLength.address_length):70)
				],
				street: [
					'',Validators.maxLength(this.addressLength?parseInt(this.addressLength.address_length):70)
				],
				state: [
					''
        ],
        country:[''],

				pincode: [
					null,
					[Validators.maxLength(70)]
				],
				address_type: [
					0
				]
			}),
			shipping_address: this._fb.group({
        address_line_1: [
					'',
          Validators.maxLength(this.addressLength?parseInt(this.addressLength.address_length):70)
				],
				street: [
					'',
          Validators.maxLength(this.addressLength?parseInt(this.addressLength.address_length):70)
				],
				state: [
					''
        ],
        country:[''],
				pincode: [
					null,
					[Validators.maxLength(70)]
				],
				address_type: [
					0
				]
			})
		});
    this.addreesDetails.emit(this.address.value)
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

	toggleSameAddress() {        
		if (this.address.get('is_same_as_billing').value) {
      let country= this.address.controls['billing_address'].get('country').value
      let state= this.address.controls['billing_address'].get('state').value
			this.address.controls['shipping_address'].setValue(this.address.controls['billing_address'].value);
			this.initialDetails.state2 = new Object({
        label:state,
        value:state
      })
			this.initialDetails.country2 = new Object({
        label:country,
        value:country
      })
			this.address.controls['shipping_address'].get('address_type').setValue(1);
		} else {
			this.address.controls['shipping_address'].setValue(
        {
          address_line_1:  '',
          street:'',
          state:'',
          country:'',
          pincode:null,
          address_type:1
        })
        this.initialDetails.state2 = new Object({
          label:'',
          value:''
        })
        this.initialDetails.country2 = new Object({
          label:'',
          value:''
        })

		}
	}

	addErrorClass(controlName: AbstractControl) {
		return TransportValidator.addErrorClass(controlName);
	}


  getCountry(){
    this._companyModuleService.getCountry().subscribe(result=>{
      this.country = result['results'];
    })
  }

  getStates(){
    let countryName = this.address.controls['billing_address'].get('country').value;
    if(countryName){
      let val = this.country.filter(country => country.name ==countryName );
      this._companyModuleService.getStates(val[0].id).subscribe(result=>{
        this.statesBilling= result['results'];
      })
    }
  }

  getStateShipping(){
    let countryName = this.address.controls['shipping_address'].get('country').value;    
    if(countryName){
      let val = this.country.filter(country => country.name ==countryName );      
      this._companyModuleService.getStates(val[0].id).subscribe(result=>{
        this.statesShipping= result['results'];
      })
    }
  }

   patchForm(response){
        if (response!== undefined) {
          this.address.controls['billing_address'].get('country').setValue(response.address[0].country)
          this.address.controls['shipping_address'].get('country').setValue(response.address[1].country)
          response.address.map((data,i) => {
            if (i == 0) {
              this.address.controls['billing_address'].patchValue(data);
              let country= this.address.controls['billing_address'].get('country').value
              let state= this.address.controls['billing_address'].get('state').value
                    this.initialDetails.state1['label'] =state
		               	this.initialDetails.state1['value'] = state
		               	this.initialDetails.country1['label'] = country
			              this.initialDetails.country1['value'] = country
            }
            else if (i == 1) {
              this.address.controls['shipping_address'].patchValue(data);
              let country= this.address.controls['shipping_address'].get('country').value
              let state= this.address.controls['shipping_address'].get('state').value
                    this.initialDetails.state2['label'] =state
		               	this.initialDetails.state2['value'] = state
		               	this.initialDetails.country2['label'] = country
			              this.initialDetails.country2['value'] = country
            }
          });
         if(response.address.length>0){
           if(response.address[0].country) {
            this.getStates();
           }  
           if(response.address[1].country) {
            this.getStateShipping();     
            this.checkBillingSameAsShipping();     
          }     
         
          }
        }
        this.address.controls['billing_address'].get('address_type').setValue(response.address[0].address_type_index)
        this.address.controls['shipping_address'].get('address_type').setValue(response.address[1].address_type_index)
        if(!response.address[0].country){
          this.patchCountry(response)
        }
   }

   patchCountry(data){
    this.address.controls['billing_address'].get('country').setValue(data.country.name)
    this.initialDetails.country1['label'] =data.country.name;
    this.initialDetails.country1['value'] = data.country.name;
    this.address.get('is_same_as_billing').setValue(false)
    this._companyModuleService.getStates(data.country.id).subscribe(result=>{
      this.statesBilling= result['results'];
    });
   }

  
}
