import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { RevenueService } from '../../../../api-services/revenue-module-service/revenue-service/revenue.service';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { getBlankOption, isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, AbstractControl, UntypedFormArray, UntypedFormControl } from '@angular/forms';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { CommonService } from 'src/app/core/services/common.service';
import { JournalService } from 'src/app/modules/customerapp-module/reports-module/accountant-module/journal-entry-module/services/journal.service';
import { BehaviorSubject } from 'rxjs';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';

@Component({
  selector: 'app-update-cheque-status',
  templateUrl: './update-cheque-status.component.html',
  styleUrls: ['./update-cheque-status.component.scss'],
})
export class UpdateChequeStatusComponent implements OnInit {

  @Input() inputData: BehaviorSubject<any>;
  @Output() outputData  = new EventEmitter<any>();
  updateChequeStatus: UntypedFormGroup;
  apiError: string;
  isClearedCheque = false;
  checequeConstants = new ValidationConstants().paymentChequeIds
  chequeStatusList=[];
  accountsList=[];
  accountNoCash=[];
  accountNoBank=[];
  isShow=false;
  chequeData=[];
  chequeStatusListpem=[];
  maxDate = new Date(dateWithTimeZone());
  initialValues: any = {
    account: getBlankOption(),
    chequeStatus: getBlankOption()
  }
  constructor(
    private _fb: UntypedFormBuilder,
    private _commonService:CommonService,
    private _journalService:JournalService,
    private _revenueService:RevenueService
  ) { }

  ngOnInit() {
    this.buildForm();
    this._commonService
    .getStaticOptions(
      'cheque-status'
    )
    .subscribe((response) => {
      this.chequeStatusList =response.result['cheque-status'];
    });
    this._journalService.getAccountList().subscribe((response: any) => {
      let allAccountList =response.result;
      this.accountNoBank = allAccountList.filter(item=> item.account_type =="Bank");
      this.accountsList = this.accountNoBank;
    });
    this.inputData.subscribe(data=>{
       this.isShow= data.show
        this.chequeData= data.chequeData
        if( this.chequeData.length>0){
          this.chequeStatusListpem= this.chequeStatusLists(this.chequeData[0].cheque_status.id);
          this.patchForm(this.chequeData[0])
        }
    })
  }

  onOkButtonClick() {
    this.outputData.emit(true)
  }


  buildForm() {
    this.updateChequeStatus = this._fb.group({
      cheque_status: [
        null
      ],
      account:[null],
      clearance_date:[null]
    });
  }

  close(){
   this.resetForm();
   this.isShow =false;
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
  chequeStatus(){
    let checkistatusId =this.updateChequeStatus.controls.cheque_status.value;
    if(checkistatusId== this.checequeConstants.chequeClearedId){
      this.isClearedCheque = true;
      this.updateChequeStatus.controls['clearance_date'].setValidators([Validators.required]);
      this.updateChequeStatus.controls['clearance_date'].updateValueAndValidity();
      this.updateChequeStatus.controls['account'].setValidators([Validators.required]);
      this.updateChequeStatus.controls['account'].updateValueAndValidity();
    }else{
      this.isClearedCheque = false;
      this.updateChequeStatus.controls['account'].setValidators(null);
      this.updateChequeStatus.controls['account'].updateValueAndValidity();
      this.updateChequeStatus.controls['clearance_date'].setValidators(null);
      this.updateChequeStatus.controls['clearance_date'].updateValueAndValidity();
    }
  }

  chequeStatusLists(id){
   let chequeList = this.chequeStatusList.filter(item => item.id !==id);
   return chequeList;
  }

  patchForm(data){
    this.updateChequeStatus.patchValue(data);
    if(isValidValue(data.cheque_status)){
      this.initialValues.chequeStatus={label:data.cheque_status.label,value:data.cheque_status.id};
      this.updateChequeStatus.controls.cheque_status.patchValue(data.cheque_status.id)
    }else{
      this.initialValues.chequeStatus=getBlankOption();
      this.updateChequeStatus.controls.cheque_status.patchValue(null)
    }
    if(isValidValue(data.account)){
      this.initialValues.account={label:data.account.label,value:data.account.id};
      this.updateChequeStatus.controls.account.patchValue(data.account.id);
    }else{
      this.initialValues.account= getBlankOption();
      this.updateChequeStatus.controls.account.patchValue(null);
    }
  }


  resetForm(){
    this.updateChequeStatus.reset()
    this.initialValues.account= getBlankOption();
    this.updateChequeStatus.controls.account.patchValue(null);
    this.initialValues.chequeStatus=getBlankOption();
    this.updateChequeStatus.controls.cheque_status.patchValue(null)
  }

  updateCheque(){
    if(this.chequeData.length>0){
      this.updateChequeStatus.controls['clearance_date'].patchValue(changeDateToServerFormat( this.updateChequeStatus.controls['clearance_date'].value))
      if(this.updateChequeStatus.valid){
        this._revenueService.putChequePayementUpdate( this.chequeData[0].id,this.updateChequeStatus.value).subscribe(data=>{
          this.resetForm();
          this.isShow =false;
          this.outputData.emit(true)
     }, error => {
      this.apiError = error['error']['message'];
      setTimeout(() => {
        this.apiError = '';
      }, 10000);
    })
      }else{
        this.setAsTouched(this.updateChequeStatus)
      }

    }
  }

}
