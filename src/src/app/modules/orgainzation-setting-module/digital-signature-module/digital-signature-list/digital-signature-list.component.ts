import { Component, OnInit } from '@angular/core';
import { DigitalSignatureService } from '../../../customerapp-module/api-services/orgainzation-setting-module-services/digital-signature-service/digitalsignaturesetting.service';
import { cloneDeep } from 'lodash';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-digital-signature-list',
  templateUrl: './digital-signature-list.component.html',
  styleUrls: ['./digital-signature-list.component.scss'],
  host: {
    '(document:click)': 'outSideClick($event)'
  }
})
export class DigitalSignatureListComponent implements OnInit {
  showDigitalSignature = false;
  sortedData = [];
  apiError = '';
  showAdd: boolean = false;
  allowedUsers: number = 0;
  showOptions: string = '';
  popupInputData = {
    'msg': 'Are you sure, you want to delete?',
    'type': 'warning',
    'show': false
  }
  viewUploadedDocs={
    show: false,
    data:{}
  }
  popupOutputData: any;
  listIndexData = {};
  editData={}
  constructor(private _digitalSignature: DigitalSignatureService,private apiHandler:ApiHandlerService) { }

  ngOnInit() {
    this.getSignatureList();
  }
  viewUploadedDocument(doc){
    this.viewUploadedDocs.data['files']= cloneDeep([doc])    
    this.viewUploadedDocs.show= true;
  }

  confirmButton(event) {
    if (event) {
      let id = this.listIndexData['id'];
      this.deleteSignature(id);
      this.listIndexData = {};
    }
  }

  deleteSignature(id) {
    this.apiHandler.handleRequest(this._digitalSignature.deleteDigitalSignature(id),'Signature Details deleted Successfully!').subscribe({
      next:(resp)=>{
        this.getSignatureList();
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }

  editSignature(data) {
    this.editData= data;
    this.showDigitalSignature = true;
  }

  outSideClick(env) {
    try {
      if ((env.target.className).indexOf('more-icon') == -1) {
        this.showOptions = ''
      }
    } catch (error) {
      console.log(error)
    }
  }

  optionsList(event, list_index) {
    return (this.showOptions = list_index);
  }

  popupFunction(id, index: any = null) {
    this.listIndexData = { 'id': id, 'index': index };
    this.popupInputData['show'] = true;
  }

  digitalSignatureStatus(e) {
    if (e) {
      this.getSignatureList();
    }
    this.showDigitalSignature = false;
    this.editData= {}
  }


  getSignatureList() {
    this._digitalSignature.getDigitalSignature().subscribe(data => {
      this.sortedData = data['result']['data'];
      this.showAdd = data['result']['show_add'];
      this.allowedUsers = data['result']['allowed_users']
    })
  }




}
