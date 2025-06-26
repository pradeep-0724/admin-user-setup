import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, AbstractControl, UntypedFormArray, UntypedFormControl } from '@angular/forms';
import { TransportValidator } from '../../../../../../shared-module/components/validators/validators';
import { InvoiceService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/invoice-service/invoice.service';
import { getBlankOption } from '../../../../../../shared-module/utilities/helper-utils';
import { ValidationConstants } from 'src/app/core/constants/constant';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit, OnChanges {
  @Input() itemPopDetail: any = {name: '', status: false};
  @Output() closeModal = new EventEmitter<any>();
  @Output() itemAdded = new EventEmitter<any>();
  @Input() units = [];
  addItemForm: UntypedFormGroup;
  alphaNumericPattern= new ValidationConstants().VALIDATION_PATTERN.ALPHA_NUMERIC2;
  apiError: string;
  initialValues: any = {
    account: {},
    unit: getBlankOption()
  }

  constructor(
    private _fb: UntypedFormBuilder,
    private _invoiceService: InvoiceService
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.addItemForm = this._fb.group({
      name: [
        '',
        [Validators.required,Validators.maxLength(35)]
      ],
      rate_per_unit: [
        0,[Validators.required,Validators.min(0.01)]
      ],
      unit: [
        null,[Validators.required]
      ],
      acceptable_shortage :[
        0
      ],
      shortage_rate :[
        0
      ],
      vehicle_freight_acceptable_shortage :[
        0
      ],
      vehicle_freight_shortage_rate :[
        0
      ],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
	  //Change in input decorator
	for (let propName in changes) {
		if (propName == 'itemPopDetail'){
      const name = changes[propName].currentValue.name;
      setTimeout(() =>{
        this.addItemForm.controls.name.setValue(name);
      }, 1);
		}
	}
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  close() {
    this.resetFormValues();
    this.itemPopDetail.status = false;
    this.closeModal.emit(false);
  }

  resetFormValues() {

    this.addItemForm.reset({
      rate_per_unit: 0,acceptable_shortage:0 ,shortage_rate:0 ,unit: null,vehicle_freight_acceptable_shortage:0 ,vehicle_freight_shortage_rate:0 });


    this.initialValues.unit  = getBlankOption();




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

  addNewItem(form: UntypedFormGroup) {

    if (form.valid) {
      this.apiError = '';
      this._invoiceService.addItem(form.value).subscribe((response: any) => {
        this.itemAdded.emit({label: response.result.name,
                             id: response.result.id,
                              status: true,
                              rate_per_unit :response['result'].rate_per_unit,
                              shortage_rate : response['result'].shortage_rate,
                              acceptable_shortage: response['result'].acceptable_shortage,
                              unitId :response['result']['unit']['id'],
                              unitName :response['result']['unit']['label'],
                              vehicle_freight_unit_cost :response['result'].vehicle_freight_unit_cost,
                              vehicle_freight_acceptable_shortage :response['result'].vehicle_freight_acceptable_shortage,
                              vehicle_freight_shortage_rate :response['result'].vehicle_freight_shortage_rate,



                            });
                            this.itemPopDetail.status=false;
                            this.resetFormValues()
      }, (err) => {
        if(err.status==400){
          this.apiError =err.error.result.name[0]
        }
      });
    } else {
      this.setAsTouched(form);
      console.log(form.errors);
    }
  }
}
