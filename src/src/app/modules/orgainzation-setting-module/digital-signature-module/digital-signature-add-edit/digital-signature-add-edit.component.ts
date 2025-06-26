import { ValidationConstants } from 'src/app/core/constants/constant';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { trimExtraSpaceBtwWords } from 'src/app/shared-module/utilities/helper-utils';
import { CommonService } from 'src/app/core/services/common.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { DocumentService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/document.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { DigitalSignatureService } from '../../../customerapp-module/api-services/orgainzation-setting-module-services/digital-signature-service/digitalsignaturesetting.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-digital-signature-add-edit',
  templateUrl: './digital-signature-add-edit.component.html',
  styleUrls: ['./digital-signature-add-edit.component.scss']
})
export class DigitalSignatureAddEditComponent implements OnInit {
  
  signatureForm :UntypedFormGroup;
  employeeDesignationApi = TSAPIRoutes.static_options;
  designationParams: any = {};
  fileName=''
  designationList =[];
  showDigitalSignature = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  isFileSizeValid = true;
  digitalSignature =''
  initialValues={designation:{}};
  patern = new ValidationConstants().VALIDATION_PATTERN;
  employeeDeg ='';

  @Output() digitalSignatureStatus  : EventEmitter<any> = new EventEmitter();
  @Input() editData:any
  constructor(private _fb:UntypedFormBuilder, private _commoservice: CommonService,private _documentsService:DocumentService,private _digitalSignature:DigitalSignatureService,private apiHandler:ApiHandlerService) { }

  ngOnInit() {
    this.getDesignation();
    this.buildForm();
    if(this.editData['id']){
      this.initialValues.designation = {label: this.editData.designation ? this.editData.designation.label : '', value:''};
      this.employeeDeg = this.editData.designation ? this.editData.designation.label : '';
      this.digitalSignature = this.editData.document.presigned_url
      this.signatureForm.patchValue({
        name:this.editData['name'],
        designation: this.editData.designation ? this.editData.designation['id'] : '',
        document:this.editData.document.id,
        id:this.editData['id'],
      });
    }
  }

  buildForm(){
    this.signatureForm = this._fb.group({
      name:['',[Validators.required,Validators.maxLength(60),Validators.pattern(this.patern.ACCOUNT_HOLDER_NAME)]],
      designation:['',[Validators.required]],
      document:[null,[Validators.required]],
      id:[null]
    })
  }

  getNewDesignations($event) {
    if ($event) {
      this._commoservice.getStaticOptions('employee-designation').subscribe((response) => {
        this.designationList = response.result['employee-designation'];
        this.signatureForm.controls.designation.setValue($event.id);
      });
    }
  }

  addParamsToDesignation (event) {
    if (event) {
      const val = trimExtraSpaceBtwWords(event);
      const arrStr = val.toLowerCase().split(' ');
      const titleCaseArr:string[] = [];
      for (const str of arrStr) {
        titleCaseArr.push(str.charAt(0).toUpperCase() + str.slice(1));
      }
      const word_joined = titleCaseArr.join(' ');
      this.designationParams = {
        key: 'employee-designation',
        label: word_joined,
        value: 0
      };
    }
  }

  getDesignation(){
    this._commoservice.getStaticOptions('employee-designation').subscribe((response: any) => {
      this.designationList = response.result['employee-designation'];
    });
  }
 
  fileChangeEvent(event: any): void {
    if (event.target.files.length > 0) {
      if (event.target.files[0].size < 2111775) {
        this.imageChangedEvent = event;
        this.isFileSizeValid = true;
        this.fileName = event.target.files[0]['name']
      } else {
        this.isFileSizeValid = false;
      }
    } else {
      this.isFileSizeValid = true;
      this.croppedImage = ''
    }
  }


  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  save() {
    var formData = new FormData();
    var timestamp = new Date(dateWithTimeZone()).getTime();
    const base64 = this.croppedImage
    fetch(base64)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], timestamp + "_" + this.fileName);
        formData.append('files', file);
        this._documentsService.uploadFiles(formData).subscribe(response => {
          this.digitalSignature = response.result[0].url;
          this.signatureForm.get('document').setValue(response.result[0].id);
          this.showDigitalSignature = false;
          this.resetInage();
        })
      })
  }

  close() {
   this.resetInage();
   this.showDigitalSignature = false;
  }


  employeeDesignation(){
    let id  = this.signatureForm.get('designation').value;
    this.employeeDeg= this.designationList.filter(item =>item.id ==id)[0].label
    
  }

  saveSignature(){
    let form = this.signatureForm
    if(form.valid){
      if(this.editData['id']){
        this.apiHandler.handleRequest(this._digitalSignature.putDigitalSignature(this.editData['id'],form.value),'Signature Details updated Successfully!').subscribe({
          next:(resp)=>{
            this.digitalSignatureStatus.emit(true);
          },
          error:(err)=>{
            console.log(err)
          }
        })
      }else{
        this.apiHandler.handleRequest(this._digitalSignature.postDigitalSignature(form.value),'Signature Details added Successfully!').subscribe({
          next:(resp)=>{
            this.digitalSignatureStatus.emit(true);
          },
          error:(err)=>{
            console.log(err)
          }
        })
        
      }
    
    }else{
      this.setAsTouched(form);
    }
 
  }

  cancelSignature(){
    this.digitalSignatureStatus.emit(false)
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


  resetInage(){
    this.imageChangedEvent= '';
    this.croppedImage = '';
    this.isFileSizeValid = true;
  }
  deleteUploadedImage(){
    this.digitalSignature =''
    this.signatureForm.get('document').setValue(null);
  }



}
