import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, AbstractControl, UntypedFormArray, UntypedFormControl } from '@angular/forms';
import { TransportValidator } from '../../../../../shared-module/components/validators/validators';
import { RevenueService } from 'src/app/modules/customerapp-module/api-services/reports-module-services/revenue-service/revenue.service';

@Component({
  selector: 'app-add-disclaimer',
  templateUrl: './add-disclaimer.component.html',
  styleUrls: ['./add-disclaimer.component.scss']
})
export class AddDisclaimerComponent implements OnInit, OnChanges {
  @Input() disclaimerPopDetail: any = {name: '', status: false};
  @Output() closeModal = new EventEmitter<any>();
  @Output() disclaimerAdded = new EventEmitter<any>();
  addItemForm: UntypedFormGroup;
  apiError: string;

  constructor(
    private _fb: UntypedFormBuilder,
    private _revenueService: RevenueService
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.addItemForm = this._fb.group({
      name: [
        '',
        Validators.required
      ],
      description: [
        '',
        Validators.required
      ]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
	  //Change in input decorator
	for (let propName in changes) {  
		if (propName == 'disclaimerPopDetail'){
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
    this.disclaimerPopDetail.status = false;
    this.closeModal.emit(false);
  }

  resetFormValues() {
    this.addItemForm.reset({rate_per_unit: 0});
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
      this._revenueService.postDisclaimer(form.value).subscribe((response: any) => {
        this.close();
        this.disclaimerAdded.emit({label: response.result.name, id: response.result.id, status: true});
      }, (err) => {
        this.disclaimerAdded.emit({label: '',  id: null, status: false});
      });
    } else {
      this.setAsTouched(form);
      console.log(form.errors);
    }
  }
}
