import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { setAsTouched } from 'src/app/shared-module/utilities/form-utils';
import { cloneDeep } from 'lodash';
import { getBlankOption } from 'src/app/shared-module/utilities/helper-utils';

type SiteInpection ={
  catagorySelected:string,
  editId:string,
  isAdd:boolean,
  apiUrl : string,
  inspectionData :any
}
@Component({
  selector: 'app-add-inspection-popup',
  templateUrl: './add-inspection-popup.component.html',
  styleUrls: ['./add-inspection-popup.component.scss']
})
export class AddInspectionPopupComponent implements OnInit {

  addInspectionForm: FormGroup
  contentTypeList=[
    {
      label:'Text',
      value:'string'
    },
    {
      label:'Numbers',
      value:'decimal'
    },
    {
      label:'Date',
      value:'date'
    },
    {
      label:'Dropdown',
      value:'dropdown'
    },
    {
      label:'Upload',
      value:'upload'
    }
  ]
  fieldType=[];
  apiError=''
  isAdd=true
  isImageSizeReached=false;
  constructor(private _fb: FormBuilder, private dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) private dialogData: SiteInpection) { }

  ngOnInit(): void {
    this.addInspectionForm = this._fb.group({
      name: ['', Validators.required],
      id:null,
      documents: [[]],
      checklist: this._fb.array([])
    })
    this.buildDetailsField([{}])

    if(!this.dialogData.isAdd){
      this.isAdd=false;
      console.log(this.dialogData);
      
     this.getInpectionDetailsforEdit();
    }
  }



  save() {
    let form = this.addInspectionForm
    let formValue= cloneDeep(form.value)
    // formValue['documents']= formValue['documents'].map(file=>file.id)
    this.apiError=''
    if(form.valid && !this.isImageSizeReached){
      this.dialogRef.close({ isSave: true, data: formValue})
      // if(this.dialogData.isAdd){
        // this.dialogRef.close(formValue)
        // this.apiHandler.handleRequest(this._genericCheckListService.addInspection(this.dialogData.apiUrl, formValue), `${this.addInspectionForm.value.name} added successfully!`).subscribe(
        //   {
        //     next: () => {
        //       this.dialogRef.close(formValue)
        //     },
        //     error: (error) => {
        //       this.handleError(error.error)
        //     }
        //   })
      // }else{
        // formValue['id']=this.dialogData.editId
        // this.apiHandler.handleRequest(this._genericCheckListService.editInspection(this.dialogData.apiUrl, this.dialogData.editId, formValue), `${this.addInspectionForm.value.name} updated successfully!`).subscribe(
        //   {
        //     next: () => {
        //       this.dialogRef.close(formValue)
        //     },
        //     error: (error) => {
        //       this.handleError(error.error)
        //     }
        //   })
      // }
   
    }else{
      setAsTouched(form)
    }
   
  }

  cancel() {
    this.dialogRef.close({ isSave: false,})

  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }



  fileUploader(e) {
    let files = this.addInspectionForm.get('documents').value
    e.forEach(element => {
      element['presigned_url'] = element['url']
      files.push(element)
    });
    this.addInspectionForm.updateValueAndValidity();
    this.checkForImage();
  }

  fileDeleted(id) {
    let files = this.addInspectionForm.get('documents').value
    files = files.filter(doc => doc.id != id);
    this.addInspectionForm.get('documents').setValue(files);
    this.addInspectionForm.updateValueAndValidity();
    this.checkForImage();
  }


  buildDetailsField(items = []) {
    let checklist = this.addInspectionForm.get('checklist') as FormArray
    checklist.controls = [];
    items.forEach(item => {
      const form = this.getDefaultField(item)
      checklist.push(form)
      this.fieldType.push(getBlankOption())
    });
    if (items.length == 0) {
      this.addFields()
    }
  }

  getDefaultField(item) {
    return this._fb.group({
      field_type: [item.field_type || null, [Validators.required]],
      field_label: [item.field_label, [Validators.required]],
      mandatory: [item.mandatory ? true : false],
      option_list:[],
    })
  }


  addFields() {
    let checklist = this.addInspectionForm.get('checklist') as FormArray
    const form = this.getDefaultField({})
    checklist.push(form)
    this.fieldType.push(getBlankOption())

  }

  removeFields(index) {
    let checklist = this.addInspectionForm.get('checklist') as FormArray
    checklist.removeAt(index)
    this.fieldType.splice(index,1)
  }

  getInpectionDetailsforEdit(){
    this.addInspectionForm.patchValue(this.dialogData?.inspectionData)
      this.buildDetailsField(this.dialogData?.inspectionData['checklist'])
      this.dialogData?.inspectionData['checklist'].forEach((list,index) => {
        this.fieldType[index]=this.contentTypeList.find(content => content.value ==list.field_type)
      });
    // this._genericCheckListService.getInspectionDetails(this.dialogData.apiUrl,this.dialogData.editId).subscribe(resp=>{
    //   this.addInspectionForm.patchValue(this.dialogData?.inspectionData)
    //   this.buildDetailsField(this.dialogData?.inspectionData['checklist'])
    //   resp['result']['checklist'].forEach((list,index) => {
    //     this.fieldType[index]=this.contentTypeList.find(content => content.value ==list.field_type)
    //   });
    // })
  }

  handleError(error){
   this.apiError =error['result']['non_field_errors'][0]
  }

  checkForImage(){
    let form = this.addInspectionForm
      if(form.value['documents'].length>3){
      this.isImageSizeReached=true
    }else{
      this.isImageSizeReached=false;
    }
  }


}
