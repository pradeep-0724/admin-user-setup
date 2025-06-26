import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { TaxModuleServiceService } from '../tax-module-service.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-tax-inclusive',
  templateUrl: './tax-inclusive.component.html',
  styleUrls: ['./tax-inclusive.component.scss']
})
export class TaxInclusiveComponent implements OnInit {

    @Input()taxInclusiveForm: UntypedFormGroup;
    companyRegistered =true;
    initialValues={
      placeOfSupply:{}
    }
    placeOfSupply =[];
    isunregisteredGst = false;
    isplaceOfSupplyRequired = false;
    isPlaceOfSupply: boolean = false;
    @Input() partyDetails :Observable<any>;
    @Input() isValidForm :Observable<any>;
    @Input() editData :Observable<any>;
    @Output () taxInclusiveFormValueChange = new EventEmitter<any>();

  constructor(
    private _taxService :TaxModuleServiceService,
    private _tax:TaxService,
  ) { }

  ngOnInit() {
    this.isPlaceOfSupply = this._tax.isPlaceOfSupply();
    this._taxService.getTaxDetails().subscribe(result=>{
      this.placeOfSupply=result.result['pos'];
    });
    this.isValidForm.subscribe(data=>{
      if(!data){
        this.setAsTouched(this.taxInclusiveForm);
      }
    })
    this.partyDetails.subscribe(data=>{
      this.reset();
      this.isunregisteredGst = data.isPartyRegistered;
      if( this.isunregisteredGst && this.isPlaceOfSupply){
        this.addRemoveValidators(this.taxInclusiveForm,'place_of_supply',[Validators.required]);
        this.isplaceOfSupplyRequired = true;
      }else{
        this.addRemoveValidators(this.taxInclusiveForm,'place_of_supply',[Validators.nullValidator]);
        this.isplaceOfSupplyRequired = false;
      }
      this.companyRegistered = data['companyRegistered'];
      if(data.taxDeatils['place_of_supply']&& this.isPlaceOfSupply){
         this.initialValues.placeOfSupply = {label:data.taxDeatils['place_of_supply'],value:data.taxDeatils['place_of_supply']};
        this.taxInclusiveForm.get('place_of_supply').setValue(data.taxDeatils['place_of_supply']);
      }
      this.trackChanges();
    });
    this.editData.subscribe(data=>{
      if(data['patchData']){
        this.taxInclusiveForm.patchValue({
          is_transaction_includes_tax:data['patchData']['is_transaction_includes_tax'],
          place_of_supply:data['patchData']['place_of_supply'],
        })
        if(this.isPlaceOfSupply){
          this.initialValues.placeOfSupply = {label:data['patchData']['place_of_supply'],value:data['patchData']['place_of_supply']};
        }else{
          this.initialValues.placeOfSupply = {label:'',value:''};
        }
      }
    });
  }

  trackChanges() {
    const keysToTrack = ['place_of_supply', 'is_transaction_includes_tax'];
    keysToTrack.forEach(key => {
      this.taxInclusiveForm.get(key)?.valueChanges.pipe(debounceTime(100)).subscribe(value => {
        this.taxInclusiveFormValueChange.emit(true)
      });
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

    reset(){
      this.taxInclusiveForm.patchValue({
        is_transaction_includes_tax: false,
        place_of_supply:''
      })
      this.companyRegistered = false;
      this.initialValues.placeOfSupply={}
    }

    addRemoveValidators(form:UntypedFormGroup,key:string,validators:Array<any>){
      form.get(key).setValidators(validators);
      form.get(key).updateValueAndValidity();
    }

}
