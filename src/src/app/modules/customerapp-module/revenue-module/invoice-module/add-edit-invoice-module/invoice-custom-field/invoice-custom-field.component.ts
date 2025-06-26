import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, UntypedFormGroup } from '@angular/forms';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';

@Component({
  selector: 'app-invoice-custom-field',
  templateUrl: './invoice-custom-field.component.html',
  styleUrls: ['./invoice-custom-field.component.scss']
})
export class InvoiceCustomFieldComponent implements OnInit {
  
  @Input()customfiled : FormGroup
  constructor() { }

  ngOnInit(): void {
  }


  oncheckBoxChange(fg: UntypedFormGroup) {
    if (fg.get('field_type').value == "checkbox") {
      if (fg.get('value').value == "false" || fg.get('value').value == false) {
        fg.get('value').setValue('')
      } else if (fg.get('value').value == "true" || fg.get('value').value == true) {
        fg.get('value').setValue('true')
      }
    }
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

}
