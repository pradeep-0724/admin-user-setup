import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';

@Component({
  selector: 'app-expiry-documents-popup',
  templateUrl: './expiry-documents-popup.component.html',
  styleUrls: ['./expiry-documents-popup.component.scss']
})
export class ExpiryDocumentsPopupComponent implements OnInit {

  documents:any[]=[];
  selectedTab=0;
  documentsRangeList = [];
  leftBtn : number = 0;
  rightBtn : number = 3;
  showVehicleTyre : boolean = false;
  showNavigation : boolean = true;
  isFromPermits : boolean = false;

  constructor(private dialogRef: DialogRef<boolean>, @Inject(DIALOG_DATA)  private data: any ) { }

  ngOnInit(): void {
    this.documents=this.data.data;  
    this.isFromPermits = this.data.isFromPermits  
  }

  cancel(){
    this.dialogRef.close()
  }

  documentSelected(index){
    this.selectedTab=index;
    let isVehicleTyre = this.documents[index]['isVehicleTyre'];
    if(isValidValue(isVehicleTyre)){
      this.showVehicleTyre = true;
    }else{
      this.showVehicleTyre = false;
    }
  }
  tabClick(event: MatTabChangeEvent){
    const tab = event.tab.textLabel;    
    this.documentSelected(tab)

  }

}
