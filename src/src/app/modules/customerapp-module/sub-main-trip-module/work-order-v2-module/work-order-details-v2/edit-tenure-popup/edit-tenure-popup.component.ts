import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { getBlankOption, getObjectFromList } from 'src/app/shared-module/utilities/helper-utils';
import { ValidityDateCalculator, changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { addErrorClass, setAsTouched } from 'src/app/shared-module/utilities/form-utils';
import { WorkOrderV2Service } from '../../../../api-services/trip-module-services/work-order-service/work-order-v2.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { TokenExpireService } from 'src/app/core/services/token-expire.service';
type TenurePopup={
  workOrderId:string
  editData:{
    workstart_date:string,
    workend_date:string,
    workorder_date:string
    expected_tenure:{
      id:string,
      label:string
    }
  }
}
@Component({
  selector: 'app-edit-tenure-popup',
  templateUrl: './edit-tenure-popup.component.html',
  styleUrls: ['./edit-tenure-popup.component.scss']
})
export class EditTenurePopupComponent implements OnInit {

  constructor(private dialogRef: DialogRef<boolean>, @Inject(DIALOG_DATA)private data: TenurePopup, private _tokenExpireService:TokenExpireService,
  private formbuilder:FormBuilder,private _commonservice: CommonService,private _workOrderV2Service:WorkOrderV2Service){};
  initialDetails={
    expectedTenure:getBlankOption()
  }
  expectedTenures=[];
  editTenurePopUpForm:FormGroup;
  minDate= new Date(dateWithTimeZone());
  ngOnInit(): void {
    this.buildForm();
    setTimeout(() => {
      this.getStaticValues();
    }, 100);
    this._tokenExpireService.observeTokenExpire.subscribe(isExpired=>{
      if(isExpired){
        this.dialogRef.close(false)
      }
    })
  }

  buildForm(){
    this.editTenurePopUpForm=this.formbuilder.group({
      workstart_date:[this.data.editData.workstart_date,Validators.required],
      workend_date:[this.data.editData.workend_date,Validators.required],
      expected_tenure:[this.data.editData.expected_tenure.id,Validators.required]
    });
    this.minDate = new Date(this.data.editData.workorder_date)
    this.initialDetails.expectedTenure = {label:this.data.editData.expected_tenure.label,value:this.data.editData.expected_tenure.id}
  }

  getStaticValues() {
    this._commonservice.getStaticOptions('work-order-tenure')
      .subscribe((response) => {
        this.expectedTenures = response.result['work-order-tenure']
      });
  }

  cancel(){
    this.dialogRef.close(false)

  }

  save(){
    let form = this.editTenurePopUpForm;
     if(form.valid) {
      form.value['workstart_date']= changeDateToServerFormat(form.value['workstart_date']);
      form.value['workend_date']= changeDateToServerFormat(form.value['workend_date'])
      this._workOrderV2Service.putWorkOrderFields(this.data.workOrderId,'tenure',form.value).subscribe((data)=>{
        this.dialogRef.close(true)
      })
    }else{
      setAsTouched(form);
    } 

  }

  setWorkEndDate() {
    const expectedTenure = this.editTenurePopUpForm.get('expected_tenure').value
    if (!expectedTenure) return
    let item = getObjectFromList(expectedTenure, this.expectedTenures);
    const workStartDate = this.editTenurePopUpForm.get('workstart_date').value;
    if (!workStartDate) return

    this.editTenurePopUpForm.get('workend_date').setValue(null);
    let da = ValidityDateCalculator(workStartDate, item.value);
    this.editTenurePopUpForm.get('workend_date').setValue(da);
  }
  addErrorClass(controlName: AbstractControl) {
    return addErrorClass(controlName);
  }

  onWorkEndDateChange() {
    let item = this.expectedTenures.filter((item: any) => item.label == 'Custom')[0]
    this.initialDetails.expectedTenure = { label: item.label, value: item.id };
    this.editTenurePopUpForm.get('expected_tenure').setValue(item.id)
  }

}
