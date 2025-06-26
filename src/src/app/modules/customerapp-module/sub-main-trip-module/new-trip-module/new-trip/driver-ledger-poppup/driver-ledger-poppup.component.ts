import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { CommonService } from '../../../../../../core/services/common.service';
import { getBlankOption, trimExtraSpaceBtwWords } from 'src/app/shared-module/utilities/helper-utils';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit, Output, EventEmitter, AfterViewChecked } from '@angular/core';
import { filterDriver } from '../../../../revenue-module/trip-module/company-vehicle-module/company-trip-class/company-trip-utils';
import { CompanyTripGetApiService } from '../../../../revenue-module/trip-module/company-vehicle-module/company-trip-class/company-trip-service.service';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { NewTripService } from '../../../../api-services/trip-module-services/trip-service/new-trip-service';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { TabIndexService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/tab-index.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';

@Component({
  selector: 'app-driver-ledger-poppup',
  templateUrl: './driver-ledger-poppup.component.html',
  styleUrls: ['./driver-ledger-poppup.component.scss'],
 
})
export class DriverLedgerPoppupComponent implements OnInit,AfterViewChecked {

 driverLedgerform: UntypedFormGroup;
 driverListCompanyOrTransporter =[];
 isTransporter = false;
 driverList =[];
 transporterDriverList =[];
 driverLedgerReason =[];
 bankAccountList =[];
 reasonParams : any = {};;
 reasonPostApi= TSAPIRoutes.static_options;
 todaysDate =new Date(dateWithTimeZone());
 initialDetails={
  driver:getBlankOption(),
  entry_type:getBlankOption(),
  reason:getBlankOption(),
  account:getBlankOption()
 };
 entryTypePrams={};
 entryType = ['Paid To Driver','Record Expenses','Paid To Company','Ledger Settlement'];
 isOpeningBalance =false;
 isOpeningDate =false;
 isDriverSelected = false;
 tripExpense ="Trip Expense";
 paidToDriver ="Paid To Driver";
 diasableAccount = false;
 popupInputDataAssignDriver = {
  'msg': '',
  'type': 'warning-driver-allowance',
  'show': false,
}

 @Input () driverLedgerPopup;
 @Output () dataFromDriverLedger = new EventEmitter();
 @Input () driverLedgerId;
 @Input() isNewTripView =false;
 @Input() isBalanceNegative = false;

 @Input() ladgerAmount =0;

  constructor(private _fb:UntypedFormBuilder,
    private _companyTripGetApiService :CompanyTripGetApiService,
    private _commonService:CommonService,
    private _newTripService:NewTripService,
    private _popupBodyScrollService:popupOverflowService,
    private _tabIndex:TabIndexService
    ) { }

  ngOnInit() {
    this.builtForm();
    this.getInitialDetails();
    if(this.driverLedgerId){
       this._newTripService.getDriverLedger(this.driverLedgerId).subscribe(resp=>{
         this.patchEdit(resp['result'])
       })
    }else{
      this.driverLedgerform.get('date').setValue(this.todaysDate);
      this.patchDetails();
    }
  }

  ngAfterViewChecked() {

    this._tabIndex.tabIndexRemove();

  }
  onClickCancel(){

    this.driverLedgerPopup.show = false;
    this.dataFromDriverLedger.emit(false);
    this._popupBodyScrollService.popupHide();

  }

  onClickSave(){
    let form =this.driverLedgerform;
    this.driverLedgerform.get('trip').setValue(this.driverLedgerPopup.data['id'])
    form.value['opening_date'] = changeDateToServerFormat(form.value['opening_date']);
    form.value['date'] = changeDateToServerFormat(form.value['date']);
    if(form.valid){
      this._popupBodyScrollService.popupHide();
      if(form.value['account']=='paid_by_driver'){
          form.value['account']='';
          form.value['is_driver_paid']=true;
      }
      if(this.driverLedgerId){
        this._newTripService.putDriverLedger(this.driverLedgerId,form.value).subscribe(data=>{
          this.dataFromDriverLedger.emit(true);
          this.driverLedgerPopup.show = false;
      });
      }else{
        if(!this.driverLedgerPopup.data['c_driver']){
          let driverDetails =  this.driverListCompanyOrTransporter.filter(item=>item.id ==form.value['driver'])
          if(driverDetails.length){
            let driverName=driverDetails[0].display_name
            this.popupInputDataAssignDriver.msg=`Please Note: ${driverName} is not assigned to this Trip.Do you want to Assign ${driverName} to this Trip ?`
            this.popupInputDataAssignDriver.show=true;
          }
        }else{
           this.driverLedgerPostAPI();
        }
      }

    }else{
      this.setAsTouched(form)
    }

  }

  driverLedgerPostAPI(){
    let form =this.driverLedgerform;
    this._newTripService.postDriverLedger(form.value).subscribe(data=>{
      this.dataFromDriverLedger.emit(true);
      this.driverLedgerPopup.show = false;
  });
  }

  builtForm(){
     this.driverLedgerform = this._fb.group({
      driver : ['',Validators.required],
      trip : [null],
      amount_got : ['',[Validators.required,Validators.min(0.01)]],
      date : ['',Validators.required],
      reason : ['',Validators.required],
      description : [''],
      account : ['',Validators.required],
      opening_balance : ['',[Validators.required,Validators.min(0)]],
      entry_type : ['',Validators.required],
      opening_date : ['',Validators.required],
      is_driver_paid:[false]
     });
  }

  getInitialDetails(){
    this._companyTripGetApiService.getTransporterDrivers(transporterDriverList=>{ this.transporterDriverList=transporterDriverList
      this._companyTripGetApiService.getEmployeeList(employeeList=>{
        this.driverList =filterDriver(employeeList);
        if(!this.isTransporter){
          this.driverListCompanyOrTransporter = this.driverList
        }else{
          this.driverListCompanyOrTransporter= this.transporterDriverList;
        }
      });

     });
     this._companyTripGetApiService.getClientExpenseAccounts(accountListObjCb=>{
      this.bankAccountList = accountListObjCb.advanceClientAccountList;
    });
    this.getDriverLedgerReasons();
  }


  getReason(event){
    if(event){
      this.driverLedgerform.get('reason').setValue(event.label);
      this.initialDetails.reason = {label:event.label,value:''}
      this.getDriverLedgerReasons();
    }

  }

  addParamsToReason(event){
    if (event) {
      const val = trimExtraSpaceBtwWords(event);
      const arrStr = val.toLowerCase().split(' ');
      const titleCaseArr:string[] = [];
      for (const str of arrStr) {
      titleCaseArr.push(str.charAt(0).toUpperCase() + str.slice(1));
      }
      const word_joined = titleCaseArr.join(' ');
      this.reasonParams = {
      key: 'driver-ledger-reason',
      label: word_joined,
      value: 0
      };
    }
  }

  getDriverLedgerReasons(){
    this._commonService.getStaticOptions('driver-ledger-reason').subscribe((response) => {
      this.driverLedgerReason= response.result['driver-ledger-reason'];
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

  getDriverBalance(){
    let id =  this.driverLedgerform.get('driver').value;
    this._newTripService.getDriverBalance(id).subscribe(resp=>{
       this.driverLedgerform.get('opening_balance').setValue(resp['result'].amount)
       this.driverLedgerform.get('opening_date').setValue(resp['result'].date)
       if(Number(resp['result'].amount)>0){
        this.isOpeningBalance =true;
       }else{
        this.isOpeningBalance =false;
       }
       if(resp['result'].date){
        this.isOpeningDate =true;
       }else{
        this.isOpeningDate =false;
       }
    });
  }

  patchDetails(){

    if(isValidValue(this.driverLedgerPopup.data['c_driver'])){
      this.driverLedgerform.get('driver').setValue(this.driverLedgerPopup.data['c_driver'].id);
      this.initialDetails.driver = {label:this.driverLedgerPopup.data['c_driver'].display_name,value:''}
      this.isDriverSelected = true;
      this.getDriverBalance();
    }
      if(this.isBalanceNegative){
        let settlementLedger='Ledger Settlement';
        this.driverLedgerform.get('entry_type').setValue(settlementLedger);
        this.initialDetails.entry_type = {label:settlementLedger,value:''};
        this.initialDetails.reason = {label:settlementLedger,value:''};
        this.driverLedgerform.get('reason').setValue(settlementLedger);
        this.driverLedgerform.get('amount_got').setValue(Math.abs(this.ladgerAmount));

      }else{
        this.driverLedgerform.get('entry_type').setValue(this.paidToDriver);
        this.initialDetails.entry_type = {label:this.paidToDriver,value:''};
        this.initialDetails.reason = {label:this.tripExpense,value:''};
        this.driverLedgerform.get('reason').setValue(this.tripExpense);
        this.entryType.splice(3,1);
      }


  }

  patchEdit(data){
    this.driverLedgerform.patchValue(data);
    this.isDriverSelected = true;
    this.initialDetails.entry_type = {label:data['entry_type'],value:''};
    this.initialDetails.reason = {label:data['reason'],value:''};
    this.initialDetails.driver =  {label:data['driver'].display_name,value:''};
    this.driverLedgerform.get('driver').setValue(data['driver'].id);
    if(isValidValue(data['account'])){
      this.driverLedgerform.get('account').setValue(data['account'].id);
      this.initialDetails.account = {label:data['account'].name,value:''};
    }

    if(data['is_driver_paid']){
      this.initialDetails.account= {label:'Paid By Driver',value:''};
      this.driverLedgerform.get('is_driver_paid').setValue(true);
      this.driverLedgerform.get('account').setValue('');
      this.driverLedgerform.get('account').setValidators(null);
      this.driverLedgerform.get('account').updateValueAndValidity();
      this.diasableAccount = true;
    }
    this.isOpeningBalance =true;
    this.isOpeningDate =true;
    if(!this.isBalanceNegative){
      this.entryType.splice(3,1);
    }
  }

  entryTypeChange(){
    let paidToCompany="Paid To Company";
    let settlementLedger='Ledger Settlement';
    this.isBalanceNegative = false;
    if(this.driverLedgerform.get('entry_type').value==paidToCompany){
      this.initialDetails.reason = {label:paidToCompany,value:''};
      this.driverLedgerform.get('reason').setValue(paidToCompany);
    }

    if(this.driverLedgerform.get('entry_type').value ==settlementLedger){
        this.driverLedgerform.get('entry_type').setValue(settlementLedger);
        this.initialDetails.entry_type = {label:settlementLedger,value:''};
        this.initialDetails.reason = {label:settlementLedger,value:''};
        this.driverLedgerform.get('reason').setValue(settlementLedger);
        this.isBalanceNegative = true;
    }

    if(this.driverLedgerform.get('entry_type').value=='Record Expenses'||this.driverLedgerform.get('entry_type').value=='Paid To Driver'){
      this.initialDetails.reason = {label:'Trip Expense',value:''};
      this.driverLedgerform.get('reason').setValue('Trip Expense');

    }

    if(this.driverLedgerform.get('entry_type').value=='Record Expenses'){
        this.initialDetails.account= {label:'Paid By Driver',value:''};
        this.driverLedgerform.get('is_driver_paid').setValue(true);
        this.driverLedgerform.get('account').setValue('');
        this.driverLedgerform.get('account').setValidators(null);
        this.driverLedgerform.get('account').updateValueAndValidity();
        this.diasableAccount = true;

    }else{
      this.driverLedgerform.get('is_driver_paid').setValue(false);
      this.driverLedgerform.get('account').setValidators(Validators.required);
      this.driverLedgerform.get('account').updateValueAndValidity();
      this.diasableAccount = false;
    }

  }

  assignDriver(isTrue:boolean){
    let form =this.driverLedgerform;
    if(isTrue){
      form.value['to_add_driver_to_trip']= true;
      form.value['driver_to_trip_id']= form.value['driver'];
      this.driverLedgerPostAPI();
    }else{
      form['to_add_driver_to_trip']= false;
      form.value['driver_to_trip_id']='';
      this.driverLedgerPostAPI();
    }
  }

}
