import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import * as _ from "lodash";
import { CommonLoaderService } from "src/app/core/services/common_loader_service.service";
import { DocumentService } from "src/app/modules/customerapp-module/api-services/auth-and-general-services/document.service";


@Component({
  selector: 'file-uploader-v2',
  templateUrl: 'file-uploader-v2.component.html',
  styleUrls: ['file-uploader-v2.component.scss']
})
export class FileUploaderV2Component implements OnInit {

  @Output() onFileRead = new EventEmitter<any>();
  @Output() onFileUploaded = new EventEmitter<any>();
  accept: string;
  @Input() isShowOnlyUpload: boolean = false;
  @Input() fileName:string='';
  @Input() fileNumber:number=0;
  multiple: boolean = true;
  @Input() uploaderId: string = 'browse';
  allFiles = [];
  maxfileSize = 10485760;
  allFilesize = 0;
  isMaximum = false;
  image_error: string;

  constructor(
    private _documentsService: DocumentService,
    private commonloaderservice:CommonLoaderService,
  ) { }

  ngOnInit() {
    this.uploaderId = this.uploaderId + Math.floor(Math.random() * (100 - 1 + 1)) + 1;
    this.accept = this.getFileAccept()
  }



  dragOverHandler(ev) {
    ev.preventDefault();
  }

  dropHandler(ev) {
    ev.preventDefault();
    let files = [];
    if (ev.dataTransfer.items) {
      for (var i = 0; i < ev.dataTransfer.items.length; i++) {
        if (ev.dataTransfer.items[i].kind === 'file') {
          files.push(ev.dataTransfer.items[i].getAsFile());
        }
      }
    }
    this.allFiles=files;
    if (files.length)
      this.checkFileSize();
      if (!this.isMaximum) {
        this.image_error = "";
        this.handlerFileUpload(files);
      }
     
      this.removeDragData(ev)
  }

  removeDragData(ev) {
    if (ev.dataTransfer.items) {
      ev.dataTransfer.items.clear();
    } else {
      ev.dataTransfer.clearData();
    }
  }

  readFile(event: any) {
    this.allFiles=[];
    if (event.target.files && event.target.files.length) {
      let files = _.map(event.target.files);
      if (event.target.files[0].size < 5242880) {
        if (this.checkFileType(files[0]['name'])) {
          this.allFiles.push(event.target.files[0]);
          this.checkFileSize();
          event.target.value = '';
          if (!this.isMaximum) {
            this.handlerFileUpload(files);
            this.image_error = "";
          }
        } else {
          this.image_error = "Please upload attachments in Image or PDF formats";
        }
      } else {
        this.image_error = "Your file size is  more than 5MB";
      }
    }
  }

  handlerFileUpload(files) {
    this.onFileRead.emit(files);
    var formData = new FormData();
    for (var i = 0; i < files.length; i++) {
      let fileName =files[i].name;
      let fileNumber=i+this.fileNumber+1;
      if(this.fileName){
        if(this.fileName=='Document Unknown'){
          fileName='Document Unknown.'+fileName.split('.').pop();
        }else{
          fileName=this.fileName+'_'+fileNumber+'.'+fileName.split('.').pop();
        }
      }else{
        fileName = files[i].name;
      }
      formData.append('files', files[i], fileName);
    }
   this.commonloaderservice.getShow();
   this._documentsService.uploadFiles(formData).subscribe(response => {
      this.onFileUploaded.emit(response.result);
      this.commonloaderservice.getHide();
    },error=>{
      this.commonloaderservice.getHide();
    });
  }



  checkFileSize() {
    this.allFilesize = 0;
    let allFileSize = []
    allFileSize = this.allFiles.map(item => item.size)
    allFileSize.forEach(size => {
      this.allFilesize = this.allFilesize + size
    })
    if (this.allFilesize > this.maxfileSize) {
      this.isMaximum = true;
      this.image_error = "Your all file size is  more than 10MB";
      this.allFiles.pop();
    } else {
      this.image_error = " ";
      this.isMaximum = false;
    }
  }


  checkFileType(fileType) {
    let regx = "[^\\s]+(.*?)\\.(jpg|jpeg|png|JPG|JPEG|PNG|pdf|PDF)$"
    if (fileType.match(regx)) {
      return true
    } else {
      return false
    }

  }
  getFileAccept() {
    let documents = 'application/vnd.ms-excel,.pptx,.ppt,.xls,.xlsx,.rtf,.doc,.docx,.json,.txt,.odt,.csv,application/doc,application/ms-doc,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    let image = 'image/png,image/jpeg,application/pdf,image/jpg'
    let accept = documents + ',' + image
    return accept;
  }


}
