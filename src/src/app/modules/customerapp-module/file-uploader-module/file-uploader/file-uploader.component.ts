import { DocumentService } from '../../api-services/auth-and-general-services/document.service';
import { Component, OnInit, Output, EventEmitter, Input, ViewChild} from "@angular/core";
import * as _ from "lodash";
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'file-uploader',
  templateUrl: 'file-uploader.component.html',
  styleUrls: ['file-uploader.component.scss']
})
export class FileUploaderComponent implements OnInit{

  showName: boolean = false;
  files = [];
  filesResult: any = [];
  fileDelete: any;
  delete: boolean = false;
  patchFileValuesInEdit: any = [];
  @Output() onFileRead = new EventEmitter<any>();
  @Output() onFileUploaded = new EventEmitter<any>();
  @Output() onFileDeleted = new EventEmitter<any>();
  @Input() accept: string;
  @Input() showDelBtn: boolean;
  @Input() uploadFile: boolean = true;
  @Input() multiple: boolean = true;
  @Input() showFileName: boolean = true;
  @Input() uploaderId: string = 'browse';
  @Input() patchFileUrls= new BehaviorSubject([]);
  @Input() emailFiles = new BehaviorSubject([]);
  allFiles=[];
  maxfileSize=10000000;
  allFilesize=0;
  isMaximum=false;

  @ViewChild('fileInput',{static: true}) fileInput;
  image_error: string;
  editPatchData: any = []

  constructor(
    private _documentsService: DocumentService
  ) { }

  ngOnInit() {
    this.accept = this.getFileAccept()
    this.patchFileUrls.subscribe(data=>{
      if(data.length>0){
        this.editPatchData=[]
        this.editPatchData = data;
        this.extractUrlInEdit()
      }else{
        this.files=[];
        this.filesResult=[];
      }
    })

  let unsubscribe= this.emailFiles.subscribe(data=>{
    let files=[];
    files=data;
    if(files.length>0){
      setTimeout(() => {
        files.forEach(file => {
          this.emailFileUpload(file)
        });

      }, 1000);
    }
    })
    unsubscribe.unsubscribe();
  }

  extractUrlInEdit() {
    if (this.editPatchData) {
      this.files=[];
      this.filesResult=[];
      for (let i = 0; i < this.editPatchData.length; i++) {
        let fileObj = new Object();
        let url = this.editPatchData[i]['url'] ? this.editPatchData[i]['url']:''
        fileObj = {
          name: this.editPatchData[i].file_name?this.editPatchData[i].file_name:'',
          url: this.editPatchData[i].presigned_url?this.editPatchData[i].presigned_url:url,
          id: this.editPatchData[i].id?this.editPatchData[i].id:'',
        };
        if(this.editPatchData[i].file_name){
          this.files.push(fileObj);
          this.filesResult.push(fileObj);
        }
      }
    }
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
    if (files.length)
      this.handlerFileUpload(files);
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
    if (event.target.files && event.target.files.length) {
      let files = _.map(event.target.files);
    if(event.target.files[0].size < 2111775){
       if(this.checkFileType(files[0]['name'])){
         this.allFiles.push(event.target.files[0]);
         this.checkFileSize();
         event.target.value = '';
         if(!this.isMaximum){
        this.handlerFileUpload(files);
         this.image_error = "";
       }
      }else{
        this.image_error = "Invalid file format";
      }
    }else{
      this.image_error = "Your file size is  more than 2MB";
    }
    }
  }

  handlerFileUpload(files) {
    this.onFileRead.emit(files);
    var formData = new FormData();
    for (var i = 0; i < files.length; i++) {
      let fileName =files[i].name;
      this.files.push({
        name: fileName,
        url: '../../../../assets/img/done.svg'
      });
      formData.append('files', files[i], fileName);
    }
    if (this.uploadFile) {
      // this.files.forEach((file,index) => {
      //   file.url = '../../../../assets/img/done.svg';
      // });
      this._documentsService.uploadFiles(formData).subscribe(response => {
        this.onFileUploaded.emit(response.result);
        response.result.forEach((fileResponse) => {
          let index = this.files.findIndex(x => x.name === fileResponse.file_name);
          this.filesResult.push(fileResponse);
          this.files[index].url = fileResponse.url;
        });
      });
    }
  }


  removeFile(index: number) {
    if (this.uploadFile) {
      this._documentsService.deleteFile(this.filesResult[index].id).subscribe(response => {
        this.files.splice(index, 1);
        this.filesResult.splice(index, 1);
        this.allFiles.splice(index, 1);
        this.onFileRead.emit(this.files);
        this.onFileDeleted.emit(index);
        this.fileInput.nativeElement.value = "";
        this.delete = true;
        this.checkFileSize();
      });
    }

  }

  goToLink(url: string) {
    window.open(url, "_blank");
  }

  getExt(url, filename) {
    var ext = filename.split('.').pop();
    if (ext == filename) {
      return "";
    }
    if (ext == 'pdf') {
      return "../assets/img/fileuploadIcons/pdf_img.png";
    }
    else if (this.checkDocument(ext)) {
      return "../assets/img/fileuploadIcons/doc_img.jpg";
    }
    else if (this.checkXXls(ext)) {
      return "../assets/img/fileuploadIcons/xls_img.jpg";
    }
    else if (ext =='txt') {
      return "../assets/img/fileuploadIcons/txt_img.jpg";
    }
    else if (ext == 'ppt'||ext == 'pptx') {
      return "../assets/img/fileuploadIcons/ppt_img.jpg";
    }else {
      return url;
    }
  }


  emailFileUpload(files) {
    if(files){
      this.allFiles.push(files);
      this.onFileRead.emit(files);
      var formData = new FormData();
        let fileName =files.name;
        this.files.push({
          name: fileName,
          url: '../../../../assets/img/done.svg'
        });
        formData.append('files', files, fileName);
      if (this.uploadFile) {
        this.files.forEach((file,index) => {
          file.url = '../../../../assets/img/done.svg';
        });
        this._documentsService.uploadFiles(formData).subscribe(response => {
          this.onFileUploaded.emit(response.result);
          response.result.forEach((fileResponse) => {
            let index = this.files.findIndex(x => x.name === fileResponse.file_name);
            this.filesResult.push(fileResponse);
            this.files[index].url = fileResponse.url;
          });
        });
      }
      this.checkFileSize();
    }
  }


  checkFileSize(){
    this.allFilesize=0;
    let allFileSize =[]
    allFileSize=this.allFiles.map(item => item.size)
    allFileSize.forEach(size=>{
    this.allFilesize=this.allFilesize + size
    })
    if(this.allFilesize >this.maxfileSize){
      this.isMaximum=true;
      this.image_error = "Your all file size is  more than 10mb";
      this.allFiles.pop();
    }else{
      this.image_error = " ";
      this.isMaximum=false;
    }
  }


  checkFileType(fileType){
    let regx="[^\\s]+(.*?)\\.(jpg|jpeg|png|JPG|JPEG|PNG|csv|CSV|doc|DOC|pdf|PDF|docx|DOCX|ppt|pptx|xls|xlsx|txt|json|odt|rtf)$"
    if(fileType.match(regx)){
      return  true
    }else{
      return false
    }

  }
  getFileAccept(){
    let documents= 'application/vnd.ms-excel,.pptx,.ppt,.xls,.xlsx,.rtf,.doc,.docx,.json,.txt,.odt,.csv,application/doc,application/ms-doc,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    let image ='image/png,image/jpeg,application/pdf,image/jpg'
    let accept = documents+','+image
  return accept;
  }

  checkDocument(ext){
    let document=["doc","docx","odt","rtf"];
     return document.includes(ext)
  }

  checkXXls(ext){
    let document=["xls","xlsx","csv","json"];
     return document.includes(ext)
  }
  ngOnChanges(){
    this.uploaderId=this.uploaderId;
  }

}
