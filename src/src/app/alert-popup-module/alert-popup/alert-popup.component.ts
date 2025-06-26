import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {  popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';

@Component({
  selector: 'alert-popup',
  templateUrl: './alert-popup.component.html',
  styleUrls: ['./alert-popup.component.scss']
})
export class AlertPopupComponent implements OnInit {
  @Input() inputData: any;
  @Output() outputData  = new EventEmitter<any>();
  @Output() logInOutputData  = new EventEmitter<any>();
  @Input() documetType =''
  isdeleteDocument = false;
  logOutData={
    logoutOfOtherDevices:false,
    loginUsingOtherCredentials:false
  }


  constructor(private _popupBodyScrollService: popupOverflowService) { }

  ngOnInit() {
  }

  onOkButtonClick() {
    if(this.inputData.type=="document-warning"){
      this.outputData.emit({
        isTrue:true,
        to_all:this.isdeleteDocument
      });
    }else{
      this.outputData.emit(true)
    }
    this.inputData.show = false;
    this._popupBodyScrollService.popupHide()
  }

  cancelButtonClick() {
    if(this.inputData.type=="document-warning"){
      this.outputData.emit({
        isTrue:false,
        to_all:this.isdeleteDocument
      });
    }else{
      this.outputData.emit(false)
    }
    this.inputData.show = false;
    this._popupBodyScrollService.popupHide()

  }

  logOutDevices(type){
    if(type=='logOutOthers'){
      this.logOutData={
        logoutOfOtherDevices:true,
        loginUsingOtherCredentials:false
      }
    }else{
      this.logOutData={
        logoutOfOtherDevices:false,
        loginUsingOtherCredentials:true
      }
    }
    this.logInOutputData.emit(this.logOutData);
    this.inputData.show = false;
  }

  workOrderYes(){
    this.outputData.emit(true);
    this.inputData.show = false;
  }

  workOrderCancel(){
    this.outputData.emit(false);
    this.inputData.show = false;
  }

}
