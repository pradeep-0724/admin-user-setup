import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { CommonService } from '../../../../../../core/services/common.service';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { CompanyTripGetApiService } from '../../../../revenue-module/trip-module/company-vehicle-module/company-trip-class/company-trip-service.service';
import { getBlankOption } from 'src/app/shared-module/utilities/helper-utils';
import {  Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormArray, AbstractControl, UntypedFormControl } from '@angular/forms';
import { NewTripDataService } from '../new-trip-data.service';

import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';

@Component({
  selector: 'app-trip-other-expense',
  templateUrl: './trip-other-expense.component.html',
  styleUrls: ['./trip-other-expense.component.scss'],
 
})
export class TripOtherExpenseComponent implements OnInit {

  tripOtherExpenseForm  :UntypedFormGroup;
  otherExpenseData =[];
  initialDetails = {
    expenseType:[],
    expenseAccount:[],
    paymentModeOp:[],
  }
  bataEmployeeList=[];
  addExpenseType={}
  showAddCoaPopup: any = {name: '', status: false};
  coaParams: any = {
	name: '',
  };
  coaDropdownIndex: number = -1;
  expenseApi =TSAPIRoutes.static_options;
  @Input() tripEmployeeTypeList:[];
  @Input() expenseAccountList :[];
  @Input () expenseTypeList:[];
  @Input() accountList :[];
  @Input() isTripCode = false;
  @Input()isDriverSelected = true;
  @Input () tripstartDate:any
  @Input() singleEntry: boolean = false;
  @Input () isAddTrip :boolean = false;
  @Input() isFormValid = new BehaviorSubject(true);
  monthsDropdownValues: any =[];
  @Output () dataFromTripOthers =new EventEmitter<any>();
  constructor(private _fb:UntypedFormBuilder,private _newTripFuelService:NewTripDataService,private _commonService:CommonService,
    private _companyTripGetApiService:CompanyTripGetApiService) {}

  ngOnInit() {
    this.buildForm();
    this.prepareRequest();
    this.otherExpenseData = this._newTripFuelService.otherExpenseData;
    if( this.otherExpenseData.length>0){
      const obs1 = new Observable((observer) => {
        this._companyTripGetApiService.getexpenseAccountList((expenseAccountList) => {
          observer.next(expenseAccountList);
          observer.complete();
        });
      });

      const obs2 = this._commonService.getStaticOptions('expense-type');

      forkJoin([obs1, obs2]).subscribe(
        ([expenseAccountList, response]:any) => {
          this.expenseAccountList = expenseAccountList;
          this.expenseTypeList = response.result['expense-type'];
          this.patchFormData();
        },
        (error) => {
          console.error('Error:', error);
          this.patchFormData();
        }
      );
     this.addItem(this.otherExpenseData);

    }else{
      this.addItem([{}]);
    }
   this.tripOtherExpenseForm.valueChanges.subscribe(data=>{
   this._newTripFuelService.otherExpenseData = data['other_expense'];
   })
   this.isFormValid.subscribe(valid=>{
     if(!valid){
       this.setAsTouched(this.tripOtherExpenseForm)
     }
   })
  }

  buildForm(){
    this.tripOtherExpenseForm = this._fb.group({
      other_expense:this._fb.array([])
    })
  }


  addMoreItem(){
    const itemarray = this.tripOtherExpenseForm.controls['other_expense'] as UntypedFormArray;
    const arrayItem = this.buildItem({});
    itemarray.push(arrayItem);
    this.initialDetails.expenseType.push(getBlankOption());
    this.initialDetails.expenseAccount.push(getBlankOption());
    this.initialDetails.paymentModeOp.push(getBlankOption());
  }

  removeItem(i){
    const itemarray =this.tripOtherExpenseForm.controls['other_expense'] as UntypedFormArray;
    itemarray.removeAt(i);
    this.initialDetails.expenseType.splice(i,1);
    this.initialDetails.expenseAccount.splice(i,1);
    this.initialDetails.paymentModeOp.splice(i,1);
  }


  clearAllClient(){
    const itemarray = this.tripOtherExpenseForm.controls['other_expense'] as UntypedFormArray;
    itemarray.controls =[];
    itemarray.reset();
    this.initialDetails.expenseType =[];
    this.initialDetails.expenseAccount =[];
    this.initialDetails.paymentModeOp=[];
    this.addItem([{}]);
  }

  addItem(items: any){
    const itemarray = this.tripOtherExpenseForm.controls['other_expense'] as UntypedFormArray;
    items.forEach((item) => {
      const arrayItem = this.buildItem(item);
      itemarray.push(arrayItem);
      this.initialDetails.expenseType.push(getBlankOption());
      this.initialDetails.expenseAccount.push(getBlankOption());
      this.initialDetails.paymentModeOp.push(getBlankOption());
    });
  }

  buildItem(item){
    return this._fb.group({
      id: [item.id || null],
      expense_type: [item.expense_type||null],
      account: [item.account ||null],
      payment_mode: [item.payment_mode ||null],
      amount: [item.amount ||0.00],
      transaction_date: [item.transaction_date ||null],
      is_driver_paid:[item.is_driver_paid||false],
      is_driver_added:[item.is_driver_added||false]
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
    const ischanged = form.value['expense_type']||form.value['account']||form.value['payment_mode'] ||  Number(form.value['amount']) > 0;
  if(ischanged){
     this.setValidators(form,'expense_type');
     this.setValidators(form,'account');
     this.setValidators(form,'payment_mode');
     form.get('amount').setValidators([Validators.required,Validators.min(0.01)]);
     form.get('amount').updateValueAndValidity()
  }else{
    this.unsetValidators(form,'expense_type');
    this.unsetValidators(form,'account');
    this.unsetValidators(form,'payment_mode');
    this.unsetValidators(form,'amount');
  }
  if(form.value['payment_mode']=="paid_By_Driver"){
    form.get('is_driver_paid').setValue(true);
  }else{
    form.get('is_driver_paid').setValue(false);
  }

  if(typeof form.value['payment_mode'] =='object' && form.value['payment_mode']){
    if(form.value['payment_mode'].name== 'Paid By Driver'){
      form.get('is_driver_paid').setValue(true);
    }else{
      form.get('is_driver_paid').setValue(false);
    }
  }
}

addParamsCoaItem($event) {
  this.coaParams = {
    name: $event
  };
}

openAddCoaModal($event, index) {
  if ($event)
    this.coaDropdownIndex = index;
    this.showAddCoaPopup = {name: this.coaParams.name, status: true};
  }

  closeCoaPopup(){
    this.showAddCoaPopup = {name: '', status: false};
  }

  addExpenseToOption($event){
    if ($event) {
      this._companyTripGetApiService.getexpenseAccountList(expenseAccountList=>{ this.expenseAccountList=expenseAccountList});
      if (this.coaDropdownIndex != -1){
      this.initialDetails.expenseAccount[this.coaDropdownIndex] = {value: $event.id, label: $event.label};
      let form = ( this.tripOtherExpenseForm.controls.other_expense as UntypedFormArray).at(this.coaDropdownIndex)
       form.get('account').setValue($event.id);
      this.coaDropdownIndex = -1;

      }
    }
  }

  addNewExpenseType(event) {
    if (event) {
      const arrStr = event.toLowerCase().split(' ');
      const titleCaseArr:string[] = [];
      for (const str of arrStr) {
        titleCaseArr.push(str.charAt(0).toUpperCase() + str.slice(1));
      }
      const word_joined = titleCaseArr.join(' ');
      this.addExpenseType = {
        key: 'expense-type',
        label: word_joined,
        value: 0
      };
    }
  }

  getNewExpenseType(e,i,form){
    if(e){
      this.initialDetails.expenseType[i] ={label:e['label']};
      form.get('expense_type').setValue(e.id)
    }

    this.getExpenseTypeList();
  }

  getExpenseTypeList() {
    this._commonService.getStaticOptions('expense-type').subscribe((response: any) => {
      this.expenseTypeList = response.result['expense-type'];
    });
  }

  patchFormData(){
    let otherExpenses = this.tripOtherExpenseForm.get('other_expense') as UntypedFormArray;
    otherExpenses.controls.forEach((ele,index) => {
      this.onAmountChange(ele);
      const expenseType = ele.get('expense_type').value;
      if(expenseType){
        if(this.isAddTrip){
           let expenseTypeData:any;
           expenseTypeData= this.expenseTypeList.filter(item => item['id'] ==expenseType)[0];
           this.initialDetails.expenseType[index] = {label: expenseTypeData['label'], id:''};
        }else{
          this.initialDetails.expenseType[index] = {label: expenseType['label'], id: expenseType['id']}
          ele.get('expense_type').setValue(expenseType['id'])
        }
      }
      const account = ele.get('account').value;
      if(account){
        if(this.isAddTrip){
          let accountTypeData:any;
          accountTypeData= this.expenseAccountList.filter(item => item['id'] ==account)[0];
          this.initialDetails.expenseAccount[index] = {label: accountTypeData['name'], id:''};

        }else{
          this.initialDetails.expenseAccount[index] = {label: account['name'], id: account['id']}
          ele.get('account').setValue(account['id']);
        }
      }

      const paymentMode = ele.get('payment_mode').value;
      if(paymentMode){
        if(this.isAddTrip){
          if(paymentMode=='paid_By_Driver'){
            this.initialDetails.paymentModeOp[index] = {label:'Paid By Driver', id:''}
          }else{
          let paymentModeData:any;
          paymentModeData= this.accountList.filter(item => item['id'] ==paymentMode)[0];
          this.initialDetails.paymentModeOp[index] = {label: paymentModeData['name'], id:''}
          }
        }else{
          this.initialDetails.paymentModeOp[index] = {label: paymentMode['name'], id: paymentMode['id']}
          if(ele.get('is_driver_paid').value){
            ele.get('payment_mode').setValue('paid_By_Driver');
          }else{
            ele.get('payment_mode').setValue(paymentMode['id'])
          }
        }
      }
    })

  }

  prepareRequest(){
    this.tripOtherExpenseForm.valueChanges.subscribe(data=>{
    let outPutData={
      isFormValid:this.tripOtherExpenseForm.valid,
      allData :[]
    }
     if(this.tripOtherExpenseForm.valid){
      outPutData={
        isFormValid:this.tripOtherExpenseForm.valid,
        allData :this.getAllValues(data['other_expense'])
      }
     }else{
      outPutData={
        isFormValid:this.tripOtherExpenseForm.valid,
        allData :[]
      }
     }
    this.dataFromTripOthers.emit(outPutData)
    })
  }
  getAllValues(data){
   let dataWithValid =[];
   data.forEach(element => {
     if(Number(element['amount'])>0){
      element['transaction_date'] =changeDateToServerFormat( element['transaction_date'])
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
