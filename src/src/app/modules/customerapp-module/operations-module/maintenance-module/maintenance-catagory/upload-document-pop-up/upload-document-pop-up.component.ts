import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, AbstractControl, UntypedFormArray, UntypedFormControl } from '@angular/forms';
import { OperationConstants, ScreenConstants } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { MaintenanceService } from '../../operations-maintenance.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-upload-document-pop-up',
  templateUrl: './upload-document-pop-up.component.html',
  styleUrls: ['./upload-document-pop-up.component.scss']
})
export class UploadDocumentPopUpComponent implements OnInit {
  @Output() dataFromUpload=new EventEmitter(false);
  @Input()jobCardDetails;
  showDocument=true;
  isDocumentThere=true;
  addUploadForm:UntypedFormGroup;
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;
  documentList=[]

  constructor(private _fb:UntypedFormBuilder,private _maintenanceService:MaintenanceService,private _analytics:AnalyticsService,private apiHandler:ApiHandlerService) { }

  ngOnInit(): void {

    this.addUploadForm= this._fb.group({
      note:['',[Validators.maxLength(120),Validators.required]],
      jobcard:'',
      documents:[[]]

    })
  }

  onClickCancel(){
   this.showDocument = false
   this.dataFromUpload.emit(false)
  }

  fileUploader(filesUploaded) {
    let documents = this.addUploadForm.get('documents').value;
    filesUploaded.forEach((element) => {
      documents.push(element.id);
      element['presigned_url']=element['url']
      this.documentList.push(element)
    });
    this.isDocumentThere =true;
  }
  fileDeleted(deletedFileIndex) {
    let documents = this.addUploadForm.get('documents').value;
    documents.splice(deletedFileIndex, 1);
    this.documentList.splice(deletedFileIndex, 1);
  }

  saveUpload(){
    let form = this.addUploadForm;
    if(!form.value['documents'].length){
      this.isDocumentThere =false;
    }
    if(form.valid&&form.value['documents'].length){
      form.value['jobcard']=this.jobCardDetails
      this.apiHandler.handleRequest( this._maintenanceService.postUpload(form.value),'Document uploaded successfully!').subscribe(
        {
          next: (resp) => {
            this._analytics.addEvent(this.analyticsType.UPDATED,this.analyticsScreen.JOBCARD);
        this.showDocument = false;
        this.dataFromUpload.emit(true)
            },
            error: (err) => {
              console.log(err)

            },
        }
      )
    }else{
      this.setAsTouched(form)
    }

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

}
