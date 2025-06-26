import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DocumentService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/document.service';

@Component({
  selector: 'app-view-uploaded-document',
  templateUrl: './view-uploaded-document.component.html',
  styleUrls: ['./view-uploaded-document.component.scss']
})
export class ViewUploadedDocumentComponent implements OnInit {

  documents: any = [];
  @Input() viewUploadedDocs: any = {}
  @Input() showDocumentName: boolean = false;
  currentDoc = 0
  constructor(private domsanitiser: DomSanitizer,private _documentsService:DocumentService) { }


  ngOnInit(): void {
    this.documents = this.viewUploadedDocs.data;
    this.documents.files.map((file) => {
      file['isValidExtension'] = this.checkFileType(file.file_name)
      file['file_type'] = file.file_name.split('.').pop()
      file['default_url']=file.presigned_url
      file['presigned_url'] = this.domsanitiser.bypassSecurityTrustResourceUrl(file.presigned_url + '#toolbar=0');
    })
  }

  checkFileType(fileType) {
    let regx = "[^\\s]+(.*?)\\.(jpg|jpeg|png|JPG|JPEG|PNG|pdf|PDF)$"
    if (fileType.match(regx)) {
      return true
    } else {
      return false
    }
  }

  close() {
    this.viewUploadedDocs.show = false
    this.viewUploadedDocs.data = {}

  }
  previous() {
    if (this.currentDoc > 0) {
      this.currentDoc = this.currentDoc - 1
    }
  }

  next() {
    if (this.currentDoc < this.documents.files.length - 1) {
      this.currentDoc = this.currentDoc + 1
    }
  }


  downLoad() {
    const ext = this.documents.files[this.currentDoc].file_name.split('.').pop();
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    this._documentsService.getBlob(encodeURIComponent(this.documents.files[this.currentDoc]['default_url'])).subscribe(response => {
      const contentType = response['result'].ct;
      const base64Data =response['result'].image_blob
      const blob = this.base64ToBlob(base64Data, contentType);
      a.href = window.URL.createObjectURL(blob);
      if (this.documents.files[this.currentDoc].note) {
        if (this.documents.files[this.currentDoc].note == "Document Unknown") {
          a.download = this.documents.files[this.currentDoc].file_name;
        } else {
          a.download =this.documents.files[this.currentDoc].note+"."+ext
        }
      } else {
        a.download =this.documents.files[this.currentDoc].file_name
      }
      a.click();
      window.URL.revokeObjectURL(a.href);
      a.remove();
    }, error => {
    });
   
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
}




