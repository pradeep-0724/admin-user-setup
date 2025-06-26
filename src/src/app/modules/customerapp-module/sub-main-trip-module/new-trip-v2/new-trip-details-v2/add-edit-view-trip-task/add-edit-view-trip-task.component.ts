import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, UntypedFormArray, UntypedFormGroup, AbstractControl, UntypedFormControl, Validators } from '@angular/forms';
import { Observable, Subject, } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { NewTripV2Service } from '../../../../api-services/trip-module-services/trip-service/new-trip-v2.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { NewTripV2DataService } from '../../new-trip-v2-dataservice';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { isArray } from 'lodash';

@Component({
  selector: 'app-add-edit-view-trip-task',
  templateUrl: './add-edit-view-trip-task.component.html',
  styleUrls: ['./add-edit-view-trip-task.component.scss']
})
export class AddEditViewTripTaskComponent implements OnInit, AfterViewInit {

  tripTaskForm: FormGroup;
  VehicleTripCustomField = [];
  @Input() inlineUpdate: boolean = false;
  @Input() tripId: string = '';
  @Input() destinationIndex: number = 0
  @Input() isMandatory: boolean = true
  @Input() tripTaskList: Array<any>
  @Input() markForTouched?: Observable<boolean>
  @Output() tripTaskData = new EventEmitter();
  formSubject = new Subject<FormGroup>();
  isFileUpload:boolean=false;
  isOtherTripTask:boolean =false;
  constructor(private _fb: FormBuilder, private _newTripV2Service: NewTripV2Service, private _tripDataService: NewTripV2DataService,private commonloaderservice:CommonLoaderService,) { }


  ngOnInit(): void {
    this.tripTaskForm = this._fb.group({
      trip_task: this._fb.array([]),
    });

    if (this.tripTaskList.length) {
      this.addTaskList(this.tripTaskList);
      this.emitTripTask();
    }
    this.formSubject.pipe(debounceTime(1000)).subscribe((form) => {
      this.updateTripTask(form);
    });
    this.tripTaskForm.valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe(data => {
      this.emitTripTask();
    })


  }

  emitTripTask(){
    this.tripTaskData.emit({ isValid: this.tripTaskForm.valid, value: this.tripTaskForm.value['trip_task']})
  }

  ngAfterViewInit(): void {
    if (this.markForTouched) {
      let subscription = this.markForTouched.subscribe(mark => {
        if (!mark) {
          this.setAsTouched(this.tripTaskForm);
          subscription.unsubscribe()
        }
      });
    }
  }



  buildNormalTaskList(items: any) {
    return this._fb.group({
      id: [items.id],
      is_edit: [items.is_edit],
      field_label: [items.field_label],
      value: [items.value || null, [items.mandatory && this.isMandatory ? Validators.required : Validators.nullValidator]],
      mandatory: [items.mandatory && this.isMandatory],
      field_type: [items.field_type],
    })
  }

  buildUploadTaskList(items: any) {
    return this._fb.group({
      id: [items.id],
      is_edit: [items.is_edit],
      field_label: [items.field_label],
      value: [items.value||[], [items.mandatory && this.isMandatory ? TransportValidator.fileUploadValidator() : Validators.nullValidator]],
      mandatory: [items.mandatory && this.isMandatory],
      field_type: [items.field_type],
    })
  }

  addTaskList(items: any = []) {
    const taskItem = this.tripTaskForm.get('trip_task') as UntypedFormArray;
    taskItem.controls = [];
    items.forEach((item) => {
      if (item.field_type != "upload") {
        const task = this.buildNormalTaskList(item);
        taskItem.push(task);
        this.isOtherTripTask =true;
      } else {
        const task = this.buildUploadTaskList(item);
        taskItem.push(task);
        this.isFileUpload =true;

      }

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

  oncheckBoxChange(fg: UntypedFormGroup) {
    if (fg.get('field_type').value == "checkbox") {
      if (fg.get('value').value == "false" || fg.get('value').value == false) {
        fg.get('value').setValue('')
      }
    }
  }

  fileUploader(e, form: FormGroup) {
    let files=[];
    let fileValue=[];
    if (e.length) {
      e.forEach(element => {
        element['presigned_url']=element['url']
        files.push(element);
      });
    }
    fileValue=  form.get('value').value
    if(isArray(fileValue)){
      form.get('value').setValue(fileValue.concat(files));
    }
    if(this.inlineUpdate)this.updateTripTask(form)
    if (this.inlineUpdate)this.emitTripTask();
  }

  tripTaskValueChange(task: FormGroup) {
    if(this.inlineUpdate)
    this.formSubject.next(task);
  }

  updateTripTask(form: FormGroup) {
    let formValue = form.value
    if (formValue['field_type'] == 'date') {
      formValue['value'] = changeDateToServerFormat(formValue['value'])
    }
    if(formValue['field_type'] == 'upload'){
      formValue['value'] = formValue['value'].map(value=>value.id)
    }
    let payload = {
      "order_no": this.destinationIndex,
      "field_label": formValue['field_label'],
      "field_value": formValue['value']
    }
    if (this.inlineUpdate) {
      this.commonloaderservice.getHide();
      this._newTripV2Service.putCheckList(this.tripId, payload).subscribe(resp => {
        this._tripDataService.inlineTaskAdded =true;
      })
    }

  }

  fileDeleted(e,form: FormGroup){
    let value= form.get('value').value;
    form.get('value').setValue(value.filter(item => item.id !== e));
    if(this.inlineUpdate)this.updateTripTask(form)
    if (this.inlineUpdate) this.emitTripTask();
  }

 


}
