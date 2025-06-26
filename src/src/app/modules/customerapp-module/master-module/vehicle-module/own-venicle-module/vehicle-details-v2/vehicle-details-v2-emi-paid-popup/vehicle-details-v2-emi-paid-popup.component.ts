import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { DialogData } from 'src/app/modules/customerapp-module/sub-main-trip-module/quotation-module/list-view-quotation-module/quotation-list/quotation-list.component';
import { VehicleDetailsV2Service } from '../../../../../api-services/master-module-services/vehicle-services/vehicle-details-v2.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';

@Component({
  selector: 'app-vehicle-details-v2-emi-paid-popup',
  templateUrl: './vehicle-details-v2-emi-paid-popup.component.html',
  styleUrls: ['./vehicle-details-v2-emi-paid-popup.component.scss']
})
export class VehicleDetailsV2EMIPaidPopupComponent implements OnInit {

  constructor(private dialogRef: DialogRef<boolean>, @Inject(DIALOG_DATA) private data: DialogData,private formBuilder:FormBuilder,private vehicleservice:VehicleDetailsV2Service,) { }
  addeEMIPaidForm:FormGroup;
  todaysDate=new Date(dateWithTimeZone());
  ngOnInit(): void {
    this.buildForm();
    
  
  }
  buildForm(){
    this.addeEMIPaidForm=this.formBuilder.group({
      amount:[this.data['amount']||0,[Validators.min(0.01)]],
      payment_date:[this.todaysDate],
      is_je:[false],
      vendor:[null],
      account:[null]
    })
  }

  cancel(){
    this.dialogRef.close()

  }
  save(){
    let form= this.addeEMIPaidForm;
    let date=form.get('payment_date').value;
    this.addeEMIPaidForm.get('payment_date').setValue(changeDateToServerFormat(date))
    if(form.valid){
      this.vehicleservice.postEMiPaidData(this.data['id'],this.addeEMIPaidForm.value).subscribe((data)=>{        
        this.dialogRef.close(true)
      })
    }else{
     this.setAsTouched(form)
    }

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
  
  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }
  

	

}
