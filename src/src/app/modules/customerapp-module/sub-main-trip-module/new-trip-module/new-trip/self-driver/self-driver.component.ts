import { BehaviorSubject } from 'rxjs';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { getBlankOption } from 'src/app/shared-module/utilities/helper-utils';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormArray, AbstractControl, UntypedFormControl } from '@angular/forms';
import { NewTripDataService } from '../new-trip-data.service';

import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
@Component({
  selector: 'app-self-driver',
  templateUrl: './self-driver.component.html',
  styleUrls: ['./self-driver.component.scss'],
 
})
export class SelfDriverComponent implements OnInit {
  selfDriverForm  :UntypedFormGroup;
  selfDriverData =[];
  initialDetails = {
    driverDesignation:[],
    driverName:[],
    driverAccount:[],
    month:[],
    isMonthlyPaymentModeSelected:[]
  }
  bataEmployeeList=[];
  @Input() tripEmployeeTypeList:[];
  @Input() driverList :[];
  @Input () helperList:[];
  @Input() accountList :[];
  @Input() istripCode= false;
  @Input()isDriverSelected = true;
  @Input () tripstartDate:any;
  @Input () isAddTrip :boolean = false;
  @Input () isFormValid = new BehaviorSubject(true);
  @Output () dataFromSelfDriver =new EventEmitter<any>()
  months = new ValidationConstants().month
  monthsDropdownValues: any =[];
  constructor(private _fb:UntypedFormBuilder,private _newTripFuelService:NewTripDataService) { }

  ngOnInit() {
    this.buildForm();
    this.prepareRequest();
    this.selfDriverData = this._newTripFuelService.selfDriverData;
    if( this.selfDriverData.length>0){
     this.addItem(this.selfDriverData);
     this.patchFormData();
    }else{
      this.addItem([{}]);
    }
   this.selfDriverForm.valueChanges.subscribe(data=>{
   this._newTripFuelService.selfDriverData = data['self_driver'];
   })
   this.isFormValid.subscribe(valid=>{
     if(!valid){
       this.setAsTouched(this.selfDriverForm);
     }
   })
  }

  buildForm(){
    this.selfDriverForm = this._fb.group({
      self_driver:this._fb.array([])
    })
  }

  addMoreItem(){
    const itemarray = this.selfDriverForm.controls['self_driver'] as UntypedFormArray;
    const arrayItem = this.buildItem({});
    itemarray.push(arrayItem);
    this.bataEmployeeList.push([]);
    this.initialDetails.isMonthlyPaymentModeSelected.push(false);
    this.initialDetails.month.push(getBlankOption());
    this.initialDetails.driverDesignation.push(getBlankOption());
    this.initialDetails.driverName.push(getBlankOption());
    this.initialDetails.driverAccount.push(getBlankOption())
  }

  removeItem(i){
    const itemarray =this.selfDriverForm.controls['self_driver'] as UntypedFormArray;
    itemarray.removeAt(i);
    this.bataEmployeeList.splice(i,1);
    this.initialDetails.isMonthlyPaymentModeSelected.splice(i,1);
    this.initialDetails.month.splice(i,1);
    this.initialDetails.driverDesignation.splice(i,1);
    this.initialDetails.driverName.splice(i,1);
    this.initialDetails.driverAccount.splice(i,1);
  }


  clearAllClient(){
    const itemarray = this.selfDriverForm.controls['self_driver'] as UntypedFormArray;
    itemarray.controls =[];
    itemarray.reset();
    this.bataEmployeeList=[]
    this.initialDetails.isMonthlyPaymentModeSelected =[];
    this.initialDetails.month =[];
    this.initialDetails.driverDesignation=[];
    this.initialDetails.driverName =[];
    this.initialDetails.driverAccount =[];
    this.addItem([{}]);
  }

  addItem(items: any){
    const itemarray = this.selfDriverForm.controls['self_driver'] as UntypedFormArray;
    items.forEach((item) => {
      const arrayItem = this.buildItem(item);
      itemarray.push(arrayItem);
      this.bataEmployeeList.push([]);
      this.initialDetails.isMonthlyPaymentModeSelected.push(false);
      this.initialDetails.month.push(getBlankOption());
      this.initialDetails.driverDesignation.push(getBlankOption());
      this.initialDetails.driverName.push(getBlankOption());
      this.initialDetails.driverAccount.push(getBlankOption())
    });
  }

  buildItem(item){
    return this._fb.group({
      id: [item.id || null],
      employee_type: [item.employee_type||null],
      employee: [item.employee ||null],
      month: [item.month || -1],
      account: [item.account ||null],
      paid: [item.paid ||0.00],
      transaction_date: [item.transaction_date ||null],
      is_driver_paid:[ item.is_driver_paid||false]
    });
  }

  setValidators(form,controlName){
    form.get(controlName).setValidators([Validators.required,Validators.minLength(1)]);
    form.get(controlName).updateValueAndValidity()
  }

  unsetValidators(form,controlName){
    form.get(controlName).clearValidators();
    form.get(controlName).updateValueAndValidity()
  }

  onEmployeeTypeSelected(ele, index) {
    this.initialDetails.driverName[index] =getBlankOption();
    const formGroup = (this.selfDriverForm.controls['self_driver'] as UntypedFormArray).at(index);
    formGroup.get('employee').setValue(null);
    if (ele.target.selectedOptions.length) {
      if (ele.target.selectedOptions[0].label.toLowerCase() === 'driver') {
        this.bataEmployeeList[index] = this.driverList;
        return;
      }
      this.bataEmployeeList[index] = this.helperList;
    } else {
      this.bataEmployeeList[index] = []
    }
  }

  onDriverHelperPaymentModeSelected(ele:any, index) {
    const formGroup = (this.selfDriverForm.controls['self_driver'] as UntypedFormArray).at(index);
    if(ele == 'monthly'){
      this.populateMonthsDropdown(new Date(this.tripstartDate));
      this.initialDetails.isMonthlyPaymentModeSelected[index] = true;
      this.monthEnableDisable(true,formGroup);
      formGroup.get('transaction_date').setValue(null);
    }
     else{
      this.initialDetails.isMonthlyPaymentModeSelected[index] = false;
      this.initialDetails.month[index] = getBlankOption();
      this.monthEnableDisable(false,formGroup);
     }
    this.onemployeeChange(formGroup)
  }

  monthEnableDisable(enable:boolean=false,form:AbstractControl) {
    if(enable){
      form.get('month').enable();
      form.get('month').setValidators([Validators.required,Validators.min(0.01)]);
      form.get('month').updateValueAndValidity();
      }else{
      form.get('month').setValue(0);
      form.get('month').disable();
      this.unsetValidators(form, 'month')
    }
  }

  populateMonthsDropdown(value){
    let month = value.getMonth() ;
    if(this.istripCode){
      this.monthsDropdownValues=[{id:1,name:'Current Month'},{ id:2,name:'Next Month'}]
    }else{
      if(month == 11){
        this.monthsDropdownValues = [{id :12 , name: 'December'},{id:1 , name :'January'},{id:2, name: 'Febuary'}]
      }
      else if(month ==10){
        this.monthsDropdownValues = [{id :11 , name: 'November'},{id:12 , name :'December'},{id:1, name: 'January'}]
      }
      else{
        this.monthsDropdownValues = this.months.slice(month,month+3);
      }
    }
   }

  onemployeeChange(form){
  const ischanged = Number(form.value['month']) > 0 ||form.value['account'] || Number(form.value['paid']) > 0;
  if(ischanged){
     if(!this.istripCode){
       this.setValidators(form,'employee_type');
       this.setValidators(form,'employee');
     }
     this.setValidators(form,'account');
     form.get('paid').setValidators([Validators.required,Validators.min(0.01)]);
     form.get('paid').updateValueAndValidity()
     form.get('month').setValidators([Validators.required,Validators.min(0.01)]);
     form.get('month').updateValueAndValidity()
  }else{
    this.unsetValidators(form,'employee_type');
    this.unsetValidators(form,'employee');
    this.unsetValidators(form,'month');
    this.unsetValidators(form,'account');
    this.unsetValidators(form,'paid');
  }

}

patchFormData(){

  const selfDrivers = this.selfDriverForm.get('self_driver') as UntypedFormArray;
  selfDrivers.controls.forEach((item,index)=>{
   this.onemployeeChange(item);
   const empType = item.get('employee_type').value;
   if(empType){
    if(this.isAddTrip){
      let employeeType :any;
        employeeType = this.tripEmployeeTypeList.filter(item => item['id'] == empType)[0];
        this.initialDetails.driverDesignation[index]= {label: employeeType['label'], value: ''};
        this.onEmployeeListPatch(employeeType['label'], index)
    }
    else{
      this.initialDetails.driverDesignation[index]= {label: empType['label'], value: empType['id']};
      item.get('employee_type').setValue(empType['id'])
      this.patchEmployeeTypeSelected(this.initialDetails.driverDesignation[index].label, index);
    }
   }

   const emp = item.get('employee').value;
   if(emp){
    if(this.isAddTrip){
         let employeeList :any;
         employeeList = this.bataEmployeeList[index].filter(item => item['id']==emp)[0];
         this.initialDetails.driverName[index] = {label: employeeList['display_name'], value:''}
    }else{
      this.initialDetails.driverName[index] = {label: emp['display_name'], value: emp['id']}
      item.get('employee').setValue(emp['id'])
    }
   }

   const month = item.get('month').value;
   if(month){
     if(this.isAddTrip){
       if(month>0){
         this.populateMonthsDropdown(new Date(this.tripstartDate))
         let months : any;
          months = this.monthsDropdownValues.filter(item => item['id']==month)[0];
           this.patchDriverHelperPaymentModeSelected('monthly', index);
           this.initialDetails.month[index]={label: months['name'], value:''}
       }
     }else{
        this.patchDriverHelperPaymentModeSelected('monthly', index)
        this.initialDetails.month[index]={label: month['name'], value: month['id']}
        item.get('month').setValue(month['id'])
     }
   }

   const account = item.get('account').value;
   if(account){
    if(this.isAddTrip){
       if(account=='monthly'){
        this.initialDetails.driverAccount[index] = {label: "Monthly", value: "monthly"}
       }else if(account =='paid_by_driver'){
        this.initialDetails.driverAccount[index] = {label: 'Paid By Driver', value:''};
       }
       else{
        let accounts :any;
        accounts = this.accountList.filter(item => item['id']==account)[0];
        this.initialDetails.driverAccount[index] = {label: accounts['name'], value:''};
       }
    }else{
      if(item.get('is_driver_paid').value){
        item.get('account').setValue('paid_by_driver');
       }else{
        item.get('account').setValue(account['id'])
       }
      this.initialDetails.driverAccount[index] = {label: account['name'], value:''};
    }
   } else if(month['id'] != -1) {
    if(account ==null||account==undefined||account==''){
      if(!this.isAddTrip){
        this.initialDetails.driverAccount[index] = {label: "Monthly", value: "monthly"}
        item.get('account').setValue("monthly")
      }
    }
   }
   this.onDriverHelperPaymentModeSelected(item.get('account').value, index);
  })
}

getMonth(id){
  let month=[]
  month =this.months.filter(item => item['id'] ==id);
  return  month[0]
}

getEmployeeType(id){
  let employeeType=[]
  employeeType =this.tripEmployeeTypeList.filter(item => item['id'] ==id);
  return  employeeType[0]
}

getPaymentOption(id){
  let allpayment=[]
  if(id=='monthly'){
    allpayment.push({
      name:'monthly'
    })
    return allpayment[0]
  }else{
    allpayment =this.accountList.filter(item => item['id'] ==id);
    return  allpayment[0]
  }


}
getEmployee(id){
 let allEmployee =[]
 let employeeall = allEmployee.concat(this.helperList,this.driverList);
 let employeeType=[]
 employeeType =employeeall.filter(item => item['id'] ==id);
 if(employeeType.length>0){
   let employeeName = employeeType[0]['first_name'] +' '+employeeType[0]['last_name']
   return employeeName
 }


}

patchDriverHelperPaymentModeSelected(id, index) {
  const formGroup = (this.selfDriverForm.controls['self_driver'] as UntypedFormArray).at(index);
  if(id == 'monthly'){
    this.initialDetails.isMonthlyPaymentModeSelected[index] = true;
    this.monthEnableDisable(true,formGroup);
  }
   else{
    this.initialDetails.isMonthlyPaymentModeSelected[index] = false;
    this.monthEnableDisable(false,formGroup);
   }
}

patchEmployeeTypeSelected(value, index) {
  if (value) {
    if (value.toLowerCase() === 'driver') {
      this.bataEmployeeList[index] = this.driverList;
      return;
    }
    this.bataEmployeeList[index] = this.helperList;
  } else {
    this.bataEmployeeList[index] = []
  }
}

prepareRequest(){
  this.selfDriverForm.valueChanges.subscribe(data=>{
  let outPutData={
    isFormValid:this.selfDriverForm.valid,
    allData :[]
  }
   if(this.selfDriverForm.valid){
    outPutData={
      isFormValid:this.selfDriverForm.valid,
      allData :this.getAllValues(data['self_driver'])
    }
   }else{
    outPutData={
      isFormValid:this.selfDriverForm.valid,
      allData :[]
    }
   }
  this.dataFromSelfDriver.emit(outPutData)
  })
}

getAllValues(data){
 let dataWithValid =[];
 data.forEach(element => {
   if(Number(element['paid'])>0 || element['employee_type']){
    element['transaction_date'] =changeDateToServerFormat( element['transaction_date'])
    dataWithValid.push(element)
   }
 });
 return dataWithValid
}

onEmployeeListPatch(type, index) {
    if (type=== 'Helper') {
      this.bataEmployeeList[index] = this.helperList;
    }else{
      this.bataEmployeeList[index] = this.driverList;
    }


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
