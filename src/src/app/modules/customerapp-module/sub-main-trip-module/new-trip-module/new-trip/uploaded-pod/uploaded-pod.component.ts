import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-uploaded-pod',
  templateUrl: './uploaded-pod.component.html',
  styleUrls: ['./uploaded-pod.component.scss']
})
export class UploadedPodComponent implements OnInit {
  documentForm: UntypedFormGroup;
  @Output () dataFromAtt =new EventEmitter<any>()
  patchFileUrls = new BehaviorSubject([]);

  constructor(private _fb: UntypedFormBuilder) { }

  ngOnInit() {
    this.buildForm();
    this.prepareRequest();
  }

  buildForm(){
    this.documentForm = this._fb.group({
      documents: [[]]
    })
  }

	fileUploader(filesUploaded) {
		let documents = this.documentForm.get('documents').value;
		filesUploaded.forEach((element) => {
			documents.push(element.id);
	});
  this.prepareRequest();
}

  fileDeleted(deletedFileIndex) {
    let documents = this.documentForm.get('documents').value;
    documents.splice(deletedFileIndex, 1);
    this.prepareRequest();
  }

prepareRequest(){

  let outPutData={
    isFormValid: this.documentForm.valid,
    allData : {}
  }
   if(this.documentForm.valid){
    outPutData = {
      isFormValid: this.documentForm.valid,
      allData : this.documentForm.value
    }
   }else{
    outPutData={
      isFormValid:this.documentForm.valid,
      allData : {}
    }
   }
  this.dataFromAtt.emit(outPutData)

}


}
