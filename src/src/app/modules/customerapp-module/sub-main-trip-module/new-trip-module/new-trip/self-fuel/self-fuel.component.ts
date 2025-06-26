import { BehaviorSubject } from 'rxjs';
import { NewTripDataService } from '../new-trip-data.service';
import { CompanyTripGetApiService } from '../../../../revenue-module/trip-module/company-vehicle-module/company-trip-class/company-trip-service.service';
import { getBlankOption, trimExtraSpaceBtwWords } from 'src/app/shared-module/utilities/helper-utils';
import { AfterViewChecked, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormArray, AbstractControl, UntypedFormControl } from '@angular/forms';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { TabIndexService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/tab-index.service';

@Component({
  selector: 'app-self-fuel',
  templateUrl: './self-fuel.component.html',
  styleUrls: ['./self-fuel.component.scss'],
 
})
export class SelfFuelComponent implements OnInit,AfterViewChecked {

  @Input() partyListVendor;
  @Input() isMarketVehicle = false;
  @Input()  isTripCode  = false;
  @Input() advanceClientAccountList;
  @Input () isAddTrip :boolean = false;
  @Input()isDriverSelected = true;
  @Input () isFormValid = new BehaviorSubject(true);
  @Input() bill_date=''
  initialDetails={
    party_name:[],
    advanceClientAccount:[],
    paymentStatus:[]
  }
  partyNamePopup: string = '';
  showAddPartyPopup: any = {name: '', status: false};
  vendor: boolean=false;
  partyPopupDropDownIndex:number=-1;
  isPaymentStatusTrue=[];
  selfFuelData =[];
  isSingleEntry: boolean = false;
  policyNumber = new ValidationConstants().VALIDATION_PATTERN.POLICY_NUMBER;


  selfFuelForm: UntypedFormGroup;
  @Output () dataFormSelfFuel =new EventEmitter<any>()

  constructor(private _fb:UntypedFormBuilder,
    private _companyTripGetApiService:CompanyTripGetApiService,private _newTripFuelService:NewTripDataService, private _tabIndex:TabIndexService) { }

  ngOnInit() {

    this.buildForm();
    this.prepareRequest();
    if(this.isMarketVehicle){
      this.selfFuelData = this._newTripFuelService.marketVehicleFuelData;
      this.selfFuelForm.valueChanges.subscribe(data=>{
       this._newTripFuelService.marketVehicleFuelData= data.self_fuel
     })
    }else{
      this.selfFuelData = this._newTripFuelService.selfFuelData;
      this.selfFuelForm.valueChanges.subscribe(data=>{
       this._newTripFuelService.selfFuelData= data.self_fuel
     })
    }
   if(this.selfFuelData.length>0){
    this._companyTripGetApiService.getPartyTripDetails('0,1','1',partyList=>{
      this.partyListVendor=partyList
      this.addNewField(this.selfFuelData);
      this.patchPaymentStatus();
    })

   }else{
    this.addNewField([{}]);
   }
   this.isFormValid.subscribe(valid=>{
     if(!valid){
       this.setAsTouched(this.selfFuelForm);
     }
   })

  }

  ngAfterViewChecked(): void {
    this._tabIndex.negativeTabIndex();

  }
  @Input()
  set singleEntry(data: any) {
    this.isSingleEntry = data;
  }

  get singleEntry() {
    return this.isSingleEntry
  }

  buildForm(){
    this.selfFuelForm = this._fb.group({
    self_fuel:this._fb.array([]),
    is_single_entry: false
    })
  }

  addNewField(items: any){
    const itemarray = this.selfFuelForm.controls['self_fuel'] as UntypedFormArray;
    items.forEach((item) => {
      const arrayItem = this.buildItem(item);
      itemarray.push(arrayItem);
      this.initialDetails.party_name.push(getBlankOption());
      this.initialDetails.advanceClientAccount.push(getBlankOption());
      this.initialDetails.paymentStatus.push({label:'Unpaid',value:'1'})
      this.isPaymentStatusTrue.push(false);
    });
  }

  buildItem(item){
    return this._fb.group({
      id: [item.id || null],
      fuel_quantity: [item.fuel_quantity||0.00],
      fuel_rate: [item.fuel_rate || 0.00],
      amount: [item.amount || 0.00],
      party_name: [item.party_name || null],
      payment_status: [item.payment_status ||'1'],
      payment_amount: [item.payment_amount ||0.00],
      payment_mode: [item.payment_mode ||null],
      bill_no: [item.bill_no || '',[Validators.pattern(this.policyNumber)]],
      bill_date: [item.bill_date ||null],
      valid_payment:[item.valid_payment||true],
      editable: [item.editable == undefined ? true : item.editable],
      is_driver_paid:[item.is_driver_paid||false],
      is_driver_added:[item.is_driver_added||false]
    });
  }

  addMoreItem(){
    const itemarray = this.selfFuelForm.controls['self_fuel'] as UntypedFormArray;
    const arrayItem = this.buildItem({});
    itemarray.push(arrayItem);
    this.initialDetails.party_name.push(getBlankOption());
    this.initialDetails.advanceClientAccount.push(getBlankOption());
    this.initialDetails.paymentStatus.push({label:'Unpaid',value:'1'})
    this.isPaymentStatusTrue.push(false);
  }
  removeItem(i){
    const itemarray = this.selfFuelForm.controls['self_fuel'] as UntypedFormArray;
    itemarray.removeAt(i)
    this.initialDetails.party_name.splice(i,1);
    this.initialDetails.advanceClientAccount.splice(i,1);
    this.isPaymentStatusTrue.splice(i,1);
  }


  openAddPartyModal($event,index ) {
    if ($event && index == 0 || index)
    {
      this.partyPopupDropDownIndex=index;
      this.vendor=true;
      this.showAddPartyPopup = {name: this.partyNamePopup, status: true};
    }
    else{
      this.showAddPartyPopup = {name: this.partyNamePopup, status: true}
    }
  }

  addValueToPartyPopup(event){
    if (event) {
      const val = trimExtraSpaceBtwWords(event);
      const arrStr = val.toLowerCase().split(' ');
      const titleCaseArr:string[] = [];
      for (const str of arrStr) {
        titleCaseArr.push(str.charAt(0).toUpperCase() + str.slice(1));
      }
      const word_joined = titleCaseArr.join(' ');
      this.partyNamePopup = word_joined;
      }
  }

  closePartyPopup(){
    this.showAddPartyPopup = {name: '', status: false};
    this.vendor=false;

  }

  addPartyToOption($event) {
    if ($event.status && this.partyPopupDropDownIndex != -1) {
      this.getPartyDetails();
      this.initialDetails.party_name[this.partyPopupDropDownIndex] = {value: $event.id, label: $event.label};
      const itemarray = this.selfFuelForm.controls['self_fuel'] as UntypedFormArray;
      itemarray.controls[ this.partyPopupDropDownIndex].get('party_name').setValue($event.id);
      this.partyPopupDropDownIndex == -1
    }

  }
  getPartyDetails(){
    this._companyTripGetApiService.getPartyTripDetails('0,1','1',partyList=>{this.partyListVendor=partyList})
  }

  paymentStatus(item,i){
    const paymetStatus=  item.get('payment_status').value;
    if(paymetStatus =='2'||paymetStatus =='3'){
      this.isPaymentStatusTrue[i]=true;
      if(!item.get('bill_date').value && this.bill_date){
        item.patchValue({
          payment_amount:item.get('amount').value,
          bill_date:new Date(this.bill_date),
        });
      }
      item.patchValue({
        payment_amount:item.get('amount').value,
      });
    }else{
      this.isPaymentStatusTrue[i]=false;
      this.initialDetails.advanceClientAccount[i] = getBlankOption();
      item.patchValue({
        payment_amount:"0.00",
        payment_mode:null,
        bill_no:'',
        bill_date:null,
        valid_payment:true,
      });
    }
    this.calculateAmount(item);
    this.changePaymentAmount(item)
  }

  calculateAmount(item){
    const quantity= item.get('fuel_quantity').value;
    const rate = item.get('fuel_rate').value;
    const partyName = item.get('party_name').value;
    const amount = (Number(rate)*Number(quantity)).toFixed(3)
    item.get('amount').setValue(amount);
    if(Number(quantity)>0 || Number(rate)>0 || partyName){
      this.setValidatorsForQuantityRateParty(item,'fuel_quantity',false);
      this.setValidatorsForQuantityRateParty(item,'fuel_rate',false);
      if(!this.isTripCode){
        this.setValidatorsForQuantityRateParty(item,'party_name',true);
      }

    }else{
      this.unsetValidatorsBill(item,'fuel_quantity');
      this.unsetValidatorsBill(item,'fuel_rate');
      this.unsetValidatorsBill(item,'party_name');
    }
  }

  changePaymentAmount(item){
    const paymentamount= item.get('payment_amount').value;
    const totalAmount = item.get('amount').value;
    const paymentType = item.get('payment_status').value;
    if(paymentType=='3'){
      if(Number(paymentamount)!==Number(totalAmount)){
        item.get('valid_payment').setValue(false);
        item.get('payment_amount').setErrors({'less or greater then total amount': true});
      }else{
        item.get('valid_payment').setValue(true);
        item.get('payment_amount').setErrors(null);
      }
      // paid option
    }
    if(paymentType=='1'){
      //unpaid
      this.unsetValidatorsBill(item,'payment_amount');
      this.unsetValidatorsBill(item,'payment_mode');
      this.unsetValidatorsBill(item,'bill_no');
      this.unsetValidatorsBill(item,'bill_date');
      this.unsetValidatorsBill(item,'party_name');
    }else{
      this.setValidatorsBill(item,'payment_amount',[Validators.required,Validators.min(0.01)]);
      this.setValidatorsBill(item,'payment_mode',[Validators.required]);
      this.setValidatorsBill(item,'bill_no',[Validators.required,Validators.pattern(this.policyNumber)]);
      this.setValidatorsBill(item,'bill_date',[Validators.required]);
      this.setValidatorsBill(item,'party_name',[Validators.required]);
    }

  }

  setValidatorsBill(form,controlName,validatorsList){
    form.get(controlName).setValidators(validatorsList);
    form.get(controlName).updateValueAndValidity()
  }

  unsetValidatorsBill(form,controlName){
    form.get(controlName).clearValidators();
    form.get(controlName).updateValueAndValidity()
  }

  setValidatorsForQuantityRateParty(form,controlName,isParty){
    if(isParty){
      form.get(controlName).setValidators([Validators.required]);
    }else{
      form.get(controlName).setValidators([Validators.required,Validators.min(0.01)]);
    }
    form.get(controlName).updateValueAndValidity();
  }
  clearItem(item,i){
    item.patchValue({
      payment_amount:0.00,
      payment_mode:null,
      bill_no:'',
      bill_date:null,
      valid_payment:true,
      fuel_quantity:0.00,
      fuel_rate:0.00,
      party_name:null,
      amount:0.00,
      payment_status:'1',
    });
    this.unsetValidatorsBill(item,'payment_amount');
    this.unsetValidatorsBill(item,'payment_mode');
    this.unsetValidatorsBill(item,'bill_no');
    this.unsetValidatorsBill(item,'bill_date');
    this.initialDetails.party_name[i]=getBlankOption();
    this.initialDetails.advanceClientAccount[i]=getBlankOption();
    this.isPaymentStatusTrue[i]=false;
    this.initialDetails.paymentStatus[i] ={label:'Unpaid',value:''}
    this.unsetValidatorsBill(item,'fuel_quantity');
    this.unsetValidatorsBill(item,'fuel_rate');
    this.unsetValidatorsBill(item,'party_name');
  }

  patchPaymentStatus(){
    this.initialDetails.party_name=[];
    this.initialDetails.paymentStatus =[];
    this.initialDetails.advanceClientAccount=[];
    const itemarray = this.selfFuelForm.controls['self_fuel'] as UntypedFormArray;
    itemarray.controls.forEach((item,index)=>{
      let itemValue: any = item.value
      if(itemValue['party_name']){
        if(this.isAddTrip){
           let partyName :any;
           partyName =  this.partyListVendor.filter(item => item['id']==itemValue['party_name'])[0];
           this.initialDetails.party_name[index]={label: partyName['party_display_name'], value:''};
        }else{
          this.initialDetails.party_name[index]={label: itemValue['party_name']['display_name'], value: itemValue['party_name']['id']}
          item.get('party_name').setValue(itemValue['party_name']['id'])
        }
      }
      if(itemValue['payment_status']){
        if(itemValue['payment_status'] == '3'){
          this.initialDetails.paymentStatus[index]={label:'Paid', value:''}
        }else{
          this.initialDetails.paymentStatus[index]={label:'Unpaid', value:''}
        }
      }
      if(itemValue['payment_mode']){
        if(this.isAddTrip){
          if(itemValue['payment_mode']=='paid_By_Driver'){
            this.initialDetails.advanceClientAccount[index]={label:'Paid By Driver',value:''}
          }else{
            let paymentMode:any;
              paymentMode =  this.advanceClientAccountList.filter(item => item['id']==itemValue['payment_mode'])[0];
              this.initialDetails.advanceClientAccount[index]={label: paymentMode['name'],value: ''}
          }
        }else{
          this.initialDetails.advanceClientAccount[index]={label: itemValue['payment_mode']['name'],value: itemValue['payment_mode']['id']}
          if(itemValue['is_driver_paid']){
            item.get('payment_mode').setValue('paid_By_Driver')
          }else{
            item.get('payment_mode').setValue(itemValue['payment_mode']['id'])
          }
        }
      }
    });
    itemarray.controls.forEach((item,index)=>{
     this.calculateAmount(item);
     this.changePaymentAmount(item);
     this.paymentStatus(item,index)
    })
  }

  findPartyItem(id){
    let partyItem=[]
    partyItem=  this.partyListVendor.filter(item => item.id === id);
    return partyItem[0]
  }

  findPaymentMode(id){
    let paymentMode=[]
    paymentMode=  this.advanceClientAccountList.filter(item => item.id === id);
    return paymentMode[0]
  }

  prepareRequest(){
    this.selfFuelForm.valueChanges.subscribe(data=>{
    let outPutData={
      isFormValid:this.selfFuelForm.valid,
      allData :[]
    }
     if(this.selfFuelForm.valid){
      outPutData={
        isFormValid:this.selfFuelForm.valid,
        allData :this.getAllValues(data['self_fuel'])
      }
     }else{
      outPutData={
        isFormValid:this.selfFuelForm.valid,
        allData :[]
      }
     }
    this.dataFormSelfFuel.emit(outPutData)
    })
  }
  getAllValues(data){
   let dataWithValid =[];
   data.forEach(element => {
     if(Number(element['amount'])>0){
      element['bill_date'] =changeDateToServerFormat( element['bill_date'])
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
