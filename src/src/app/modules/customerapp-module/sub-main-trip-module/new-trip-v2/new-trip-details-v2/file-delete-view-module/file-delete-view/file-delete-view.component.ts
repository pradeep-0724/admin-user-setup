import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { DeleteAlertComponent } from 'src/app/shared-module/delete-alert-module/delete-alert/delete-alert.component';
import { DocumentService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/document.service';
import { getBlankOption } from 'src/app/shared-module/utilities/helper-utils';

@Component({
  selector: 'app-file-delete-view',
  templateUrl: './file-delete-view.component.html',
  styleUrls: ['./file-delete-view.component.scss']
})
export class FileDeleteViewComponent implements OnInit {
  @Input() fileData: any;
  @Input() showDelete = true
  @Input() showInlineEdit = false
  @Input() driverInput = false
  @Output() fileDeleted: EventEmitter<boolean> = new EventEmitter()
  initialFileName = getBlankOption();
  fileNameList = []
  constructor(public dialog: Dialog, private _documentsService: DocumentService) { }

  ngOnInit(): void {
    if (this.fileData) {
      this.initialFileName = this.getInitialFileName(this.fileData)
    }
    this.getFileNameList();
  }

  getFileName(filename) {
    if (!filename) return
    return filename.replace(/\.[^/.]+$/, "")
  }

  getInitialFileName(data) {
    if (!data) return getBlankOption()
    if (data.note)
      return { label: data.note, value: '' }
    return { label:this.getFileName(data.file_name), value: '' }

  }

  getExt(url, filename) {
    if (!filename) return
    var ext = filename.split('.').pop();
    if (ext == filename) {
      return "";
    }
    if (ext == 'pdf') {
      return "assets/img/fileuploadIcons/pdf_img.png";
    }
    else if (this.checkDocument(ext)) {
      return "assets/img/fileuploadIcons/doc_img.jpg";
    }
    else if (this.checkXXls(ext)) {
      return "assets/img/fileuploadIcons/xls_img.jpg";
    }
    else if (ext == 'txt') {
      return "assets/img/fileuploadIcons/txt_img.jpg";
    }
    else if (ext == 'ppt' || ext == 'pptx') {
      return "assets/img/fileuploadIcons/ppt_img.jpg";
    } else {
      return url;
    }
  }

  checkDocument(ext) {
    let document = ["doc", "docx", "odt", "rtf"];
    return document.includes(ext)
  }

  checkXXls(ext) {
    let document = ["xls", "xlsx", "csv", "json"];
    return document.includes(ext)
  }

  deleteDocument(id) {
    const dialogRef = this.dialog.open(DeleteAlertComponent, {
      data: {
        message: 'Are you sure, you want to delete?',
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      if (result) {
        this._documentsService.deleteFile(id).subscribe(response => {
          this.fileDeleted.emit(id)
        }, error => {
          this.fileDeleted.emit(id)
        });
      }
      dialogRefSub.unsubscribe();
    });

  }


  goToLink(url: string) {
    window.open(url, "_blank");
  }

  fileDownload(data) {
    const ext = data.file_name.split('.').pop();
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    if (this.showInlineEdit) {
      this._documentsService.getBlob(encodeURIComponent(data.presigned_url)).subscribe(response => {
        const contentType = response['result'].ct;
        const base64Data =response['result'].image_blob
        const blob = this.base64ToBlob(base64Data, contentType);
        a.href = window.URL.createObjectURL(blob);
        if(data.note){
          a.download =data.note+"."+ext
        }else{
          a.download =data.file_name
        }
        a.click();
        window.URL.revokeObjectURL(a.href);
        a.remove();
      }, error => {
      });
    } else {
      const objectUrl = data.presigned_download_url
      a.href = objectUrl
      a.download = data.file_name
      a.click();
      window.URL.revokeObjectURL(objectUrl);
      a.remove()
    }

  }


  addNewFileName(e){
      if (!this.fileNameList.includes(e)) {
        let payload = {
          note: e
        }
        this._documentsService.updateFileName(payload, this.fileData.id).subscribe(response => {
          this.fileData['note'] = e;
          this.getFileNameList();
          this.initialFileName={ label:e, value: '' }
        }, error => {
        });
      }
    
  }

  base64ToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }

  onContactPersonSelection(e) {
    if (e.trim()) {
      let payload = {
        note: e
      }
      this._documentsService.updateFileName(payload, this.fileData.id).subscribe(response => {
        this.fileData['note'] = e;
        this.getFileNameList();
      }, error => {
      });
    }
  }

  getFileNameList(){
    this._documentsService.getDocumentUniqueList().subscribe(response => {
      this.fileNameList = response['result'].names
    });
  }


}
