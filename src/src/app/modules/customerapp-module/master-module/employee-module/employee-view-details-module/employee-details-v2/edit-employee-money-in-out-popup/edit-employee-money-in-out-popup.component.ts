import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { RevenueService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/revenue-service/revenue.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { setAsTouched, setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { getBlankOption } from 'src/app/shared-module/utilities/helper-utils';
import { EmployeeDetailsService } from '../employee-details.service';

type DialogData={
  name: string,
  type: string,
  employeeId:string
  editData?:any
}
@Component({
  selector: 'app-edit-employee-money-in-out-popup',
  templateUrl: './edit-employee-money-in-out-popup.component.html',
  styleUrls: ['./edit-employee-money-in-out-popup.component.scss']
})
export class EditEmployeeMoneyInOutPopupComponent implements OnInit {
 
  moneyInAndOutForm :FormGroup
  initialValues = {
    account : getBlankOption()
  };
  paymentAccountList = []
  driverId;
  maxdate=null;
  mindate=null;
  constructor(private formBuilder :FormBuilder,private _revenueService: RevenueService,private dialogRef: DialogRef<boolean>,private employeeDetailsService:EmployeeDetailsService,
    @Inject(DIALOG_DATA) public dialogData: DialogData) { }

  ngOnInit():void {
    this.buildForm();
    this._revenueService.getAccounts().subscribe((response) => {
      this.paymentAccountList = response.result;
    });
    this.driverId = this.dialogData.employeeId
    if (this.dialogData.type=='money_in') {
        this.moneyInAndOutForm.addControl('account', new FormControl(null, Validators.required));
    }
    if (this.dialogData.type!='reset') {
      setUnsetValidators(this.moneyInAndOutForm,'amount',[Validators.min(0.01)])
    }else{
      this.maxdate = new Date(dateWithTimeZone())
    }

    if(this.dialogData.editData){
      if(this.dialogData.editData.account){
        this.initialValues.account ={label:this.dialogData.editData.account.name,value:this.dialogData.editData.account.id}
        this.dialogData.editData.account =this.dialogData.editData.account.id
      }
      this.moneyInAndOutForm.patchValue(this.dialogData.editData)
    }
  }

  buildForm(){
    this.moneyInAndOutForm= this.formBuilder.group({
      amount :[0,Validators.required],
      date :[new Date(dateWithTimeZone()),Validators.required],
      reason :[''],
      id:null

    })
  }
  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  close(){
    this.dialogRef.close(false)
  }

  save(){
    let form = this.moneyInAndOutForm;
    if(form.valid){
      this.employeeDetailsService.postDiverLedger(this.prepareData(form.value)).subscribe(resp=>{
        this.dialogRef.close(true)
      })
     
    }else{
      setAsTouched(form)
    }

  }

  prepareData(values){
    let payload={
      "date": changeDateToServerFormat(values['date']),
      "reason": values['reason'],
      "amount": values['amount'],
      "id": values['id'],
      "is_self": true,
      "type":this.getType(this.dialogData.type),
      "driver_id": this.driverId,
      "account_id": values['account']?values['account']:null
    }
    return payload
  }

  getType(type){
    if(type=='money_in') return 'in'
    if(type=='money_out') return 'out'
    return 'reset'

  }

}
