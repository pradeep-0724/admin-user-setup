import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormArray, UntypedFormControl, AbstractControl, Validators } from '@angular/forms';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { CustomFieldServiceV2 } from '../../custom-field-v2/customfield-v2.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-add-custom-field-v2',
  templateUrl: './add-custom-field-v2.component.html',
  styleUrls: ['./add-custom-field-v2.component.scss']
})
export class AddCustomFieldV2Component implements OnInit {

  @Input() showAddCustomField:boolean = true;
  @Input() customFieldUrl:string ='';
  @Input() clientColumn =0;
  @Input() maxClientColumn =0;
  showMaxError=false;
  
  
  @Output() modalClosed = new EventEmitter<any>();
  @Input() url: string;

  fieldType=[
    {
      name:'Text',
      id:'string'
    },
    {
      name:'Dropdown',
      id:'select_option'
    },
    {
      name:'Date',
      id:'date'
    },
    {
      name:'Number',
      id:'decimal'
    }
  ]
 validators= new ValidationConstants();

 apiError='';





  addCustomFiled:UntypedFormGroup;
  constructor(
      private _fb: UntypedFormBuilder,
      private _customFieldServiceV2:CustomFieldServiceV2,
      private apiHandler: ApiHandlerService
    ) { }

  ngOnInit() {
    this.buildForm();
  
  }


  buildForm() {
    this.addCustomFiled = this._fb.group({
			field_label: [null,[Validators.required]],
      field_type: [null, Validators.required],
      is_private:[false],
      description:'',
    });
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

  submitNote() {
    if(this.addCustomFiled.valid){
      if(this.clientColumn<this.maxClientColumn){
        this.saveAPI()
      }else{
        if(this.addCustomFiled.get('is_private').value){
          this.saveAPI()
        }else{
          this.showMaxError=true;
        }
      }
  
    }else{
      this.setAsTouched(this.addCustomFiled)
    }
   
  }

  saveAPI(){
    this.apiHandler.handleRequest(this._customFieldServiceV2.postCustomField(this.customFieldUrl, this.addCustomFiled.value), 'Custom Field added sucessfully!').subscribe(
      {
        next: () => {
          this.modalClosed.emit(true);
          this.showAddCustomField = false;
        },
        error: (error) => {
          if (error.error.message === 'Invalid data') {
            this.apiError = 'Column Name already exists. Try different name.';
          }
        }
      }
    )

  }



  addErrorClass(controlName: AbstractControl) {
		return TransportValidator.addErrorClass(controlName);
  }

  closeModal() {
    this.modalClosed.emit(false);
    this.showAddCustomField=false;
    
  }


}
