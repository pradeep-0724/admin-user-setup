import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { DocumentService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/document.service';
import * as _ from "lodash";

@Component({
    selector: 'profile-pic',
    templateUrl: 'profile-pic.component.html',
    styleUrls: ['profile-pic.component.scss']
})
export class ProfilePicComponent implements OnInit {
    @Input() imagePreview: any = '';
    showName: boolean = false;
    files = [];
    filesResult: any = [];
    @Input() uploaderId:string='browse';
    @Input() accept:string;
    @Input() uploadFile: boolean = true;
    @Output() onFileRead = new EventEmitter<any>();
    @Output() onFileUploaded = new EventEmitter<any>();
    image_error: string;

    constructor (private _documentsService: DocumentService) {}

    ngOnInit() { }

    onFileChange(event) {
      let reader = new FileReader();
      if (event.target.files && event.target.files.length) {
          const file = event.target.files[0];
        if( (this.checkFileType(file['name']))){
          if(file['size'] < 2111775){
            this.handlerFileUpload(file);
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.imagePreview = reader.result;
                // this.cd.markForCheck();
            };
            this.image_error = "";
           }else {
            this.image_error = "Your file size is no more than 2MB"; 
           }
        }
         else{
          this.image_error = "We currently support JPG and PNG formats only"; 
         }
      }
    }

    handlerFileUpload(files) {
        this.onFileRead.emit(files);
        var formData = new FormData();
        if(files)
          this.files.push({
            name: files.name,
            url: ''
          });
          formData.append('files', files, files.name);
        if (this.uploadFile) {
          this._documentsService.uploadFiles(formData).subscribe(response => {
            this.onFileUploaded.emit(response.result);
            response.result.forEach((fileResponse) => {
              this.filesResult.push(fileResponse);
            });
            
            this.files.forEach((file,index) => {
              file.url = '../../../assets/img/done.svg';
            });
          });
        }
      }


      checkFileType(fileType){
        let regx="[^\\s]+(.*?)\\.(jpg|jpeg|png|JPG|JPEG|PNG)$"
        if(fileType.match(regx)){
          return  true
        }else{
          return false
        }
    
      }

}