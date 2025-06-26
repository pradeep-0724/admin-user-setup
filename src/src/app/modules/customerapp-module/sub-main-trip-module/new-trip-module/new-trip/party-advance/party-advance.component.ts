import { BehaviorSubject } from 'rxjs';
import { NewTripDataService } from '../new-trip-data.service';
import { getBlankOption } from 'src/app/shared-module/utilities/helper-utils';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormArray, AbstractControl, UntypedFormControl } from '@angular/forms';

import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';

@Component({
  selector: 'app-party-advance',
  templateUrl: './party-advance.component.html',
  styleUrls: ['./party-advance.component.scss'],
})
export class PartyAdvanceComponent implements OnInit {
  partyAdvanceForm  :UntypedFormGroup;
  advanceData =[];
  initialAccount: any = [];
  @Input() advanceClientAccountList: [];
  @Input () typeOfScreen :any;
  @Input () isTripCode= false;
  @Input () isAddTrip :boolean = false;
  @Input () isFormValid = new BehaviorSubject(true);

  @Output () dataFromAdvance =new EventEmitter<any>();

  constructor(private _fb:UntypedFormBuilder,private _newTripFuelService:NewTripDataService) { }
  ngOnInit() {
    this.buildForm();
    this.prepareRequest();
    if(this.typeOfScreen=="partyAdvance"){
      this.advanceData = this._newTripFuelService.advanceData;
    }else{
      this.advanceData = this._newTripFuelService.vehicleProvideradvanceData;
    }

    if( this.advanceData.length>0){
     this.addItem(this.advanceData);
     const itemarray = this.partyAdvanceForm.controls['advance_array'] as UntypedFormArray;
     itemarray.controls.forEach((item,index) => {
       this.onAmountChange(item);
       this.patchFormData(item,index);
     });
    }else{
      this.addItem([{}]);
    }

   this.partyAdvanceForm.valueChanges.subscribe(data=>{
    if(this.typeOfScreen=="partyAdvance"){
      this._newTripFuelService.advanceData = data['advance_array'];
    }else{
      this._newTripFuelService.vehicleProvideradvanceData = data['advance_array'];
    }
   });
   this.isFormValid.subscribe(valid=>{
     if(!valid){
      this.setAsTouched(this.partyAdvanceForm)
     }
   })
  }

  buildForm(){
    this.partyAdvanceForm = this._fb.group({
      advance_array:this._fb.array([])
    })
  }

  patchFormData(form,index){
    if(form.value['account']){
      if(this.isAddTrip){
         let account :any;
         account = this.advanceClientAccountList.filter(item =>item['id']==form.value['account'])[0];
         this.initialAccount[index] = { label: account['name'], id: ''}
      }else{
        this.initialAccount[index] = { label: form.value['account']['name'], id: form.value['account']['id']}
        form.get('account').setValue(form.value['account']['id'])
      }
    }
  }


  addMoreItem(){
    const itemarray = this.partyAdvanceForm.controls['advance_array'] as UntypedFormArray;
    const arrayItem = this.buildItem({});
    itemarray.push(arrayItem);
    this.initialAccount.push(getBlankOption());

  }

  removeItem(i){
    const itemarray =this.partyAdvanceForm.controls['advance_array'] as UntypedFormArray;
    itemarray.removeAt(i);
    this.initialAccount.push(getBlankOption());
  }


  clearAllClient(){
    const itemarray = this.partyAdvanceForm.controls['advance_array'] as UntypedFormArray;
    itemarray.controls = [];
    itemarray.reset();
    this.initialAccount = [];
    this.addItem([{}]);
  }

  addItem(items: any){
    const itemarray = this.partyAdvanceForm.controls['advance_array'] as UntypedFormArray;
    items.forEach((item) => {
      const arrayItem = this.buildItem(item);
      itemarray.push(arrayItem);
      this.initialAccount.push(getBlankOption());
    });
  }

  buildItem(item){
    return this._fb.group({
      id: [item.id || null],
      account: [item.account||null],
      amount: [item.amount ||0.00],
      date: [item.date ||null],
    });
  }

  setValidators(form,controlName){
    form.get(controlName).setValidators([Validators.required]);
    form.get(controlName).updateValueAndValidity()
  }

  unsetValidators(form,controlName){
    form.get(controlName).clearValidators();
    form.get(controlName).updateValueAndValidity()
  }

  onAmountChange(form){
  const ischanged = form.value['account'] || Number(form.value['amount']) > 0;
  if(ischanged){
     this.setValidators(form,'account');
     form.get('amount').setValidators([Validators.required,Validators.min(0.01)]);
     form.get('amount').updateValueAndValidity()
  }else{
    this.unsetValidators(form,'account');
    this.unsetValidators(form,'amount');
  }
}

prepareRequest(){
  this.partyAdvanceForm.valueChanges.subscribe(data=>{
  let outPutData={
    isFormValid:this.partyAdvanceForm.valid,
    allData :[]
  }
   if(this.partyAdvanceForm.valid){
    outPutData={
      isFormValid:this.partyAdvanceForm.valid,
      allData :this.getAllValues(data['advance_array'])
    }
   }else{
    outPutData={
      isFormValid:this.partyAdvanceForm.valid,
      allData :[]
    }
   }
  this.dataFromAdvance.emit(outPutData)
  })
}

getAllValues(data){
 let dataWithValid =[];
 data.forEach(element => {
   if(Number(element['amount'])>0){
    element['date']=changeDateToServerFormat(element['date'])
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
