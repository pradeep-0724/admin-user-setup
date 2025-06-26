import { BehaviorSubject } from 'rxjs';
import { NewTripDataService } from '../new-trip-data.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormArray, UntypedFormControl, AbstractControl } from '@angular/forms';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';

@Component({
  selector: 'app-party-advance-fuel',
  templateUrl: './party-advance-fuel.component.html',
  styleUrls: ['./party-advance-fuel.component.scss']
})
export class PartyAdvanceFuelComponent implements OnInit {
  partyAdvanceFuelForm  :UntypedFormGroup;
  partyFuelData =[];
  @Output () dataFromPartyAdvance =new EventEmitter<any>();
  @Input () isFormValid = new BehaviorSubject(true);
  constructor(private _fb:UntypedFormBuilder,private _newTripFuelService:NewTripDataService) { }

  ngOnInit() {
    this.buildForm();
    this.prepareRequest();
    this.partyFuelData = this._newTripFuelService.partyAdvanceFuelData;
    if( this.partyFuelData.length>0){
      this.addItem(this.partyFuelData);
      const itemarray = this.partyAdvanceFuelForm.controls['party_advance_fuel'] as UntypedFormArray;
      itemarray.controls.forEach((item) => {
        this.calculateFreightAmount(item)
      });

    }else{
      this.addItem([{}]);
    }
   this.partyAdvanceFuelForm.valueChanges.subscribe(data=>{
    this._newTripFuelService.partyAdvanceFuelData = data['party_advance_fuel'];
   });
   this.isFormValid.subscribe(valid=>{
     if(!valid){
       this.setAsTouched(this.partyAdvanceFuelForm)
     }
   })
  }

  buildForm(){
    this.partyAdvanceFuelForm = this._fb.group({
      party_advance_fuel:this._fb.array([])
    })
  }


  addMoreItem(){
    const itemarray = this.partyAdvanceFuelForm.controls['party_advance_fuel'] as UntypedFormArray;
    const arrayItem = this.buildItem({});
    itemarray.push(arrayItem);
  }

  removeItem(i){
    const itemarray =this.partyAdvanceFuelForm.controls['party_advance_fuel'] as UntypedFormArray;
    itemarray.removeAt(i);
  }


  clearAllClient(){
    const itemarray = this.partyAdvanceFuelForm.controls['party_advance_fuel'] as UntypedFormArray;
    itemarray.controls =[];
    itemarray.reset();
    this.addItem([{}]);
  }
  addItem(items: any){
    const itemarray = this.partyAdvanceFuelForm.controls['party_advance_fuel'] as UntypedFormArray;
    items.forEach((item) => {
      const arrayItem = this.buildItem(item);
      itemarray.push(arrayItem);
    });
  }

  buildItem(item){
    return this._fb.group({
      id: [item.id || null],
      fuel_quantity: [item.fuel_quantity||0.00],
      rate: [item.rate || 0.00],
      amount: [item.amount || 0.00],
    });
  }



  calculateFreightAmount(form){
    const fuel_quantity = Number(form.get('fuel_quantity').value);
    const rate = Number(form.get('rate').value);
    const amount =(Number(fuel_quantity) *  Number(rate)).toFixed(3);
    form.get('amount').setValue(amount)
    if((fuel_quantity+rate)>0){
      this.setValidators(form,'fuel_quantity');
      this.setValidators(form,'rate');
    }else{
      this.unsetValidators(form,'fuel_quantity');
      this.unsetValidators(form,'rate');
    }
  }


  setValidators(form,controlName){
    form.get(controlName).setValidators([Validators.required,Validators.min(0.01)]);
    form.get(controlName).updateValueAndValidity()
  }

  unsetValidators(form,controlName){
    form.get(controlName).clearValidators();
    form.get(controlName).updateValueAndValidity()
  }

  prepareRequest(){
    this.partyAdvanceFuelForm.valueChanges.subscribe(data=>{
    let outPutData={
      isFormValid:this.partyAdvanceFuelForm.valid,
      allData :[]
    }
     if(this.partyAdvanceFuelForm.valid){
      outPutData={
        isFormValid:this.partyAdvanceFuelForm.valid,
        allData :this.getAllValues(data['party_advance_fuel'])
      }
     }else{
      outPutData={
        isFormValid:this.partyAdvanceFuelForm.valid,
        allData :[]
      }
     }
    this.dataFromPartyAdvance.emit(outPutData)
    })
  }
  getAllValues(data){
   let dataWithValid =[];
   data.forEach(element => {
     if(Number(element['amount'])>0){
      dataWithValid.push(element)
     }
   });
   return dataWithValid
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




}
