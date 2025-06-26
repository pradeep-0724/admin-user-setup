import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';

@Component({
  selector: 'app-upload-pod',
  templateUrl: './upload-pod.component.html',
  styleUrls: ['./upload-pod.component.scss']
})
export class UploadPodComponent implements OnInit {
  podForm: UntypedFormGroup;
  @Input() tripDateData;
  patchFileUrls = new BehaviorSubject([]);
  @Output () dataFromPod =new EventEmitter<any>();
  mindate = new Date ()
  maxdate= new Date(dateWithTimeZone());

  constructor(private _fb: UntypedFormBuilder) { }

  ngOnInit() {
    this.buildForm();
    this.prepareRequest();
    this.mindate= new Date(this.tripDateData.start_date);
    if(this.tripDateData.driver_trip_pod_date){
      this.podForm.get('pod_received_date').setValue(this.tripDateData.driver_trip_pod_date)
    }
  }

  buildForm(){
    this.podForm = this._fb.group({
      pod_received_date: [new Date(dateWithTimeZone())],
      documents: [[]]
    })

    let data = this.podForm.value
    data.pod_received_date = changeDateToServerFormat(data.pod_received_date)
    this.emitOutPutData(data, this.podForm.valid)
  }

  prepareRequest(){
    this.podForm.valueChanges.subscribe(data=>{
     if(this.podForm.valid){
      data.pod_received_date = changeDateToServerFormat(data.pod_received_date)
      this.emitOutPutData(data, this.podForm.valid)
     }else{
      this.emitOutPutData({}, this.podForm.valid)
     }
    })
  }

  emitOutPutData(data, isValid) {
    let outPutData={
      isFormValid: isValid,
      allData : data
    }
    this.dataFromPod.emit(outPutData)

  }



	fileUploader(filesUploaded) {
		let documents = this.podForm.get('documents').value;
		filesUploaded.forEach((element) => {
			documents.push(element.id);
	});
  this.onFileUploaded();
}

  fileDeleted(deletedFileIndex) {
    let documents = this.podForm.get('documents').value;
    documents.splice(deletedFileIndex, 1);
     this.onFileUploaded();
  }

  onFileUploaded(){
    let data = this.podForm.value
    data.pod_received_date = changeDateToServerFormat(data.pod_received_date)
    this.emitOutPutData(data, this.podForm.valid)
  }

  patchDocuments(data){
		if(data.documents.length>0){
		let documentsArray = this.podForm.get('documents') as UntypedFormControl;
		documentsArray.setValue([]);
		const documents = data.documents;
		let pathUrl=[];
		documents.forEach(element => {
			documentsArray.value.push(element.id);
			pathUrl.push(element);
		});
		this.patchFileUrls.next(pathUrl);
	  }
	}

}
