import { getBlankOption, isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { TransportValidator } from '../../../../../shared-module/components/validators/validators';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder, AbstractControl, UntypedFormArray, UntypedFormControl } from '@angular/forms';
import { CustomFieldServiceService } from './custom-field-service.service';
import { BehaviorSubject } from 'rxjs';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';
@Component({
  selector: 'app-add-custom-fields',
  templateUrl: './add-custom-fields.component.html',
  styleUrls: ['./add-custom-fields.component.scss']
})
export class AddCustomFieldsComponent implements OnInit {
  @Input() showNoteModal:boolean = true;
  @Input() category='0'
  @Output() noteEntered = new EventEmitter<any>();
  @Output() modalClosed = new EventEmitter<any>();
  @Input() url: string;
  @Input() isFieldTypeChange:boolean=true;
  @Input() editData: BehaviorSubject<[]>;
  @Input() isShowMandatory :boolean=true;
  @Input() canShowDateTime?:boolean = false;
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
      name:'Check Box',
      id:'checkbox'
    },
    {
      name:'Date',
      id:'date'
    },
    {
      name:'Date Time',
      id:'datetime'
    }
  ]
 validators= new ValidationConstants();
 fieldTypeOption=getBlankOption();
 editItem=[]
 noOptionErrMsg = '';
 itemList=[];
 apiError='';





  addCustomFiled:UntypedFormGroup;
  constructor(
      private _fb: UntypedFormBuilder,private apiHandler: ApiHandlerService,
      private _customFiledService: CustomFieldServiceService,

    ) { }

  ngOnInit() {
    this.buildForm();
    this.editData.subscribe(data=>{
      this.editItem=[]
      this.editItem =data;
      if(this.editItem.length>0){
        this.addCustomFiled.patchValue(this.editItem[0]);
       this.fieldTypeOption ={label:this.editItem[0].field_type.name,value:this.editItem[0].field_type.data_type}
       if(this.editItem[0].field_type.data_type=='select_option'){
         this.itemList =this.editItem[0].option_list
       }
       this.addCustomFiled.patchValue({
        field_type:this.editItem[0].field_type.data_type
       });
      }
    })
  }


  buildForm() {
    this.addCustomFiled = this._fb.group({
			field_label: ['',[Validators.required]],
      field_type: [	'', Validators.required],
      mandatory:[false],
      option:'',
      option_list:[]
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

  submitNote(form:UntypedFormGroup) {
    this.noOptionErrMsg = '';
    if (form.valid) {
      form.get('option_list').patchValue(this.itemList)
    if(this.editItem.length>0){
      let payload = JSON.parse(JSON.stringify(form.value))
      payload['category'] = this.category;
      payload['is_field_edit'] = true
      this.apiHandler.handleRequest(this._customFiledService.editCustomFiled(this.url, payload, this.editItem[0].id), `${form.get('field_label').value} updated successfully!`).subscribe(
        {
          next: () => {
            this.resetForm();
            this.modalClosed.emit(false);
          },
          error: (error) => {
            this.apiError = error.error.result['field_label'][0]
          }
        }
      )
    }else{
      if(form.value['field_type']=='select_option' && form.value['option_list'].length==0){
        this.noOptionErrMsg = 'Add atleast one option';
      }else{
        this.noOptionErrMsg = '';
      }
      if(!isValidValue(this.noOptionErrMsg)){
        form.value['category'] = this.category;
        this.apiHandler.handleRequest(this._customFiledService.addCustomFiled(this.url, form.value), `${form.get('field_label').value} added successfully!`).subscribe(
          {
            next: () => {
              this.resetForm();
              this.modalClosed.emit(false);
            },
            error: (error) => {
              this.apiError = error.error.result['field_label'][0]
            }
          }
        )
      }
    }
    }
    else{
      this.setAsTouched(form);
    }
  }



  addErrorClass(controlName: AbstractControl) {
		return TransportValidator.addErrorClass(controlName);
  }

  closeModal() {
    this.resetForm();
    this.modalClosed.emit(true);
  }

  resetForm() {
    this.addCustomFiled.reset();
    this.fieldTypeOption=getBlankOption();
    this.addCustomFiled.patchValue({field_label: "", field_type: "", mandatory: false, option: '', option_list: []});
    this.itemList=[];
    this.apiError='';
    this.editItem=[];
    this.showNoteModal = false;

  }
  addNewItem(form){
    this.noOptionErrMsg = '';
    if(form.get('option').value){
      this.itemList.push(form.get('option').value);
      form.get('option').setValue('');
    }

  }
  emptyFiled(){
    this.itemList=[];
  }




}
