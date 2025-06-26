import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';

@Component({
  selector: 'app-profile-certificate-history',
  templateUrl: './profile-certificate-history.component.html',
  styleUrls: ['./profile-certificate-history.component.scss']
})
export class ProfileCertificateHistoryComponent implements OnInit {
 
  documents:any=[];
  viewUploadedDocs={
    show: false,
    data:{}
  };
  docName: string ='';
  isSubAsset : boolean = false;
  constructor(private dialogRef: DialogRef<boolean>, @Inject(DIALOG_DATA)  private data: any ) { }

  ngOnInit(): void {
    this.docName = this.data.name
    this.documents=this.data.data
  }

  cancel(){
    this.dialogRef.close()
  }

  
  viewUploadedDocument(doc){
    this.viewUploadedDocs.data= cloneDeep(doc);    
    this.viewUploadedDocs.show= true;
  }
  
  changeDatetoNormalDate(date){
    if(isValidValue(date)){
      return moment(date).format('DD-MM-YYYY')
    }else{
      return '-'
    }
  }

}

