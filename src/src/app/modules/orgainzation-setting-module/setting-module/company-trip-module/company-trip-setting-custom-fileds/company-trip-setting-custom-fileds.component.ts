import { CompanyTripCustomFieldService } from './company-trip-custom-field-service.service';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-company-trip-setting-custom-fileds',
  templateUrl: './company-trip-setting-custom-fileds.component.html',
  styleUrls: ['./company-trip-setting-custom-fileds.component.scss'],
  host: {
    '(document:click)': 'outSideClick($event)'
  }
})
export class CompanyTripSettingCustomFiledsComponent implements OnInit {
  showOptions: string = '';
  popupOutputData: any;
  listIndexData = {};
  sortedData: any = [];
  allShowHide= [];
  isDisplay=false;
  isOpenDialog=false;
  popupInputData = {
    'msg': 'Are you sure, you want to delete?',
    'type': 'warning',
    'show': false
  }
  url='revenue/formfield/trip/company/';
  editData=new BehaviorSubject([])
  constructor(private _customFiled:CompanyTripCustomFieldService) { }

  ngOnInit() {
    this.initView();
  }

  initView() {
    this._customFiled.getCompanyTripFields(false).subscribe((result:any)=>{
    this.isDisplay =result['result'].display;
    this.allShowHide=[];
    this.sortedData=result['result'].fields;
    if(this.sortedData.length>0){
      this.sortedData.forEach(element => {
        this.allShowHide.push(element['display'])
      });
    }
    })
  }

  deleteUser(id) {
    this._customFiled.deleteCustomFiled(id).subscribe((result:any)=>{
      this.initView();
     })
  }


  outSideClick(env) {
    try {
      if ((env.target.className).indexOf('more-icon') == -1){
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

  confirmButton(event) {
    if (event) {
      let id = this.listIndexData['id'];
      this.deleteUser(id);
      this.listIndexData = {};
    }
  }

  edit(id): void {
    let editData=[]
    editData =  this.sortedData.filter(item => item.id==id);
    this.isOpenDialog=true;
    this.editData.next(editData);
  }

  addNewField(){
     this.isOpenDialog=true;
  }

  modelClose(e){
    this.isOpenDialog=false;
    if(!e){
      this.initView();
    }
  }

  showHide(i,id){
    this.allShowHide[i]=!this.allShowHide[i];
    let payload={"display":this.allShowHide[i]}
      this._customFiled.singleDisplayToggle(id,payload).subscribe((result:any)=>{
      this.initView();
     })
  }

  allDisplay(){
  this.isDisplay =!this.isDisplay;
  let payload={"display":this.isDisplay}
   this._customFiled.allDisplayToggle(payload).subscribe((result:any)=>{
    this.initView();
  })
  }
}
