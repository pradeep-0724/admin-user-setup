import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { isArray } from 'lodash';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { GenericChecklistServiceService } from '../api-services/generic-checklist-service/generic-checklist-service.service';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';

@Component({
  selector: 'app-generic-inspection-checklist',
  templateUrl: './generic-inspection-checklist.component.html',
  styleUrls: ['./generic-inspection-checklist.component.scss']
})
export class GenericInspectionChecklistComponent implements OnInit, AfterViewInit, OnDestroy {

  checklistForm: FormGroup;
  @Input() parentForm: FormGroup
  @Input() markForTouched?: Observable<boolean>
  @Input() inspectionDetails?:any;
  @Input() isInspectionCheckListmandatory : Observable<boolean>;
  @Input() settingsRoute = '';
  @Input() inspectionScreen = '';
  @Input() apiUrl = new Observable();
  @Input() inspectionPermission = '';
  checkListAllData = [];
  isFileUpload = false;
  isOtherTripTask: boolean = false;
  isFileUploads=[]
  isOtherTripTasks=[];

  activeDoc = 0
  formType = 'site_details'
  prefixUrl=getPrefix()
  isPageRefresh=false;
  constructor(private _fb: FormBuilder,private _genericCheckListService : GenericChecklistServiceService) { }
  ngOnInit(): void {
    this.checklistForm = this._fb.group({
      site_details: this._fb.array([]),
    });
    this.parentForm.addControl(this.formType, this.checklistForm);
    if(this.inspectionDetails){      
      this.patchCheckList();
    }else{
      // this.getAllCheckList()
    }
    this.apiUrl.subscribe((url)=>{
      this.getAllCheckList(url)
    })

    this.isInspectionCheckListmandatory.subscribe((res)=>{
      const site_details = this.checklistForm.get('site_details') as UntypedFormArray;
      site_details.controls.forEach((form: FormGroup, index) => {
        const taskItem = form.get('checklist') as UntypedFormArray;
        taskItem.controls.forEach((ele)=>{          
          if(res){
            ele.get('value').setValidators([ele.get('mandatory').value? Validators.required: Validators.nullValidator]);
          }else{
            ele.get('value').setValidators([Validators.nullValidator])
          }
          ele.get('value').updateValueAndValidity()
        })
      })
    })
  }

  ngAfterViewInit(): void {
    if (this.markForTouched) {
      let subscription = this.markForTouched.subscribe(mark => {
        if (!mark) {
          this.setAsTouched(this.checklistForm);
          subscription.unsubscribe()
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.parentForm.removeControl(this.formType);
  }


  buildInspectionDetails(items: any) {
    return this._fb.group({
      name: [items.name],
      id : [items.id],
      checklist: this._fb.array([]),
      documents: [items.documents],
    })
  }


  buildNormalTaskList(items: any) {    
    return this._fb.group({
      id: [items.id],
      field_label: [items.field_label],
      value: [items.value || null, [items.mandatory ? Validators.required : Validators.nullValidator]],
      mandatory: [items.mandatory],
      field_type: [items.field_type],
      option_list: [items.option_list],
    })
  }

  buildUploadTaskList(items: any) {
    return this._fb.group({
      id: [items.id],
      field_label: [items.field_label],
      value: [items.value || [], [items.mandatory ? TransportValidator.fileUploadValidator() : Validators.nullValidator]],
      mandatory: [items.mandatory],
      field_type: [items.field_type],
      option_list: [items.option_list],
    })
  }

  addTaskList(form: FormGroup, items: any = []) {
    this.isFileUpload = false;
    this.isOtherTripTask= false;
    const taskItem = form.get('checklist') as UntypedFormArray;
    taskItem.controls = [];
    items.forEach((item) => {
      if (item.field_type != "upload") {
        const task = this.buildNormalTaskList(item);
        taskItem.push(task);
        this.isOtherTripTask = true;
      } else {
        const task = this.buildUploadTaskList(item);
        taskItem.push(task);
        this.isFileUpload = true;

      }

    });
  }

  buildinspectionDetailsList(items: any = []) {
    const site_details = this.checklistForm.get('site_details') as UntypedFormArray;
    site_details.controls = [];
    items.forEach((item) => {
      const detailForm = this.buildInspectionDetails(item);
      site_details.push(detailForm);
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



  fileUploader(e, form: FormGroup) {
    let files = [];
    let fileValue = [];
    if (e.length) {
      e.forEach(element => {
        element['presigned_url'] = element['url']
        files.push(element);
      });
    }
    fileValue = form.get('value').value
    if (isArray(fileValue)) {
      form.get('value').setValue(fileValue.concat(files));
    }

  }




  fileDeleted(e, form: FormGroup) {
    let value = form.get('value').value;
    form.get('value').setValue(value.filter(item => item.id !== e));

  }


  getAllCheckList(url) {    
    
    isValidValue(url) && this._genericCheckListService.getCheckListView(url).subscribe(resp => {
      console.log(resp);
      
      this.checkListAllData = resp['result']['inspections']
      this.buildinspectionDetailsList(resp['result']['inspections'])
      const site_details = this.checklistForm.get('site_details') as UntypedFormArray;
      site_details.controls.forEach((form: FormGroup, index) => {
      this.addTaskList(form, this.checkListAllData[index]['checklist'])
        this.isOtherTripTasks.push(this.isOtherTripTask)
        this.isFileUploads.push(this.isFileUpload)
      })


    })
  }

  changeDocument(i) {
    this.activeDoc = i
  }

  addNewOption(event,detailForm: FormGroup,form: FormGroup) {
    if (event) {
      let payLoad = { 
        field_label:form.get('field_label').value,
        name:detailForm.get('name').value,
        option:event,
        vehicle_category:this.parentForm.get('vehicle_category').value
       }
      this._genericCheckListService.updateOption(this.apiUrl,payLoad).subscribe(resp => {
        form.value['option_list'].push(event)
        form.get('value').setValue(event)
      })

    }

  }

  linkClicked(){
    // this.isPageRefresh=true;
  }

  refresh(){
    // this.getAllCheckList();
  }


  patchCheckList(){
    this.checkListAllData =this.inspectionDetails
    this.isOtherTripTasks=[]
    this.isFileUploads=[];
    this.buildinspectionDetailsList(this.inspectionDetails)
    const site_details = this.checklistForm.get('site_details') as UntypedFormArray;
    site_details.controls.forEach((form: FormGroup, index) => {
    this.addTaskList(form, this.checkListAllData[index]['checklist'])
      this.isOtherTripTasks.push(this.isOtherTripTask)
      this.isFileUploads.push(this.isFileUpload)
    })
  }



}