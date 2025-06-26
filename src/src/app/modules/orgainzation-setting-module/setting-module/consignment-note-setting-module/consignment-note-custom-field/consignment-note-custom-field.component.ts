import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConsignmentNoteCustomfieldServiceService } from './consignment-note-customfield-service.service';

@Component({
  selector: 'app-consignment-note-custom-field',
  templateUrl: './consignment-note-custom-field.component.html',
  styleUrls: ['./consignment-note-custom-field.component.scss'],
  host: {
		'(document:click)': 'outSideClick($event)'
	}
})
export class ConsignmentNoteCustomFieldComponent implements OnInit {
  showOptions: string = '';
  popupOutputData: any;
  listIndexData = {};
  sortedData= [];
  allShowHide= [];
  allShowHideMarketVehicle=[];
  allShowHideRemarkSection=[];
  allShowHideInvoice=[];
  isDisplay=false;
  isOpenDialog=false;
  popupInputData = {
    'msg': 'Are you sure, you want to delete?',
    'type': 'warning',
    'show': false
  }
  url='revenue/formfield/consignmentnote/';
  editData=new BehaviorSubject([]);
  dropDownItems=[{
    label:'Before estimate',
    value:'before_estimate'
  },{
    label:'Bottom',
    value:'bottom'
  },{
    label:'Inside Estimate',
    value:'inside_estimate'
  }];
  defaultItem =this.dropDownItems[0];
  bottomItem =this.dropDownItems[1];
  insideEstimate =this.dropDownItems[2];
  selectedValue=[];
  constructor(private _customFiled:ConsignmentNoteCustomfieldServiceService) { }

  ngOnInit() {
    this.initView();
  }

  initView() {
    this._customFiled.getCompanyTripFields(false).subscribe((result:any)=>{
    this.isDisplay =result['result'].display;
    this.allShowHide=[];
    this.allShowHideMarketVehicle=[];
    this.selectedValue=[];
    this.allShowHideInvoice=[];
    this.sortedData=result['result'].fields;
    if(this.sortedData.length>0){
      this.sortedData.forEach(element => {
        this.allShowHide.push(element['display']);
        this.allShowHideMarketVehicle.push(element['in_market_vehicle']);
        this.allShowHideInvoice.push(element['display_in_invoice'])
        if(element['in_remark_section']){
          this.selectedValue.push(this.bottomItem);
        }else if(element['in_estimate_section']){
          this.selectedValue.push(this.insideEstimate);
        }
        else{
          this.selectedValue.push(this.defaultItem);
        }
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
  showHideMarketVehicle(i,id){
    this.allShowHideMarketVehicle[i]=! this.allShowHideMarketVehicle[i];
    let payload={"in_market_vehicle": this.allShowHideMarketVehicle[i]}
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

  dropdownChange(itemId,i){

   if(this.selectedValue[i].value=='bottom'){
    let payload={"in_remark_section":true,"in_estimate_section":false}
    this._customFiled.singleDisplayToggle(itemId,payload).subscribe((result:any)=>{
    this.initView();
   })
   }else if(this.selectedValue[i].value=='inside_estimate'){
    let payload={"in_estimate_section":true,"in_remark_section":false}
    this._customFiled.singleDisplayToggle(itemId,payload).subscribe((result:any)=>{
    this.initView();
   })
   }
   else{
    let payload={"in_remark_section":false,"in_estimate_section":false}
    this._customFiled.singleDisplayToggle(itemId,payload).subscribe((result:any)=>{
    this.initView();
   })
   }
  }

  showHideInvoice(i,id){
    this.allShowHideInvoice[i]=!this.allShowHideInvoice[i];
    let payload={"display_in_invoice": this.allShowHideInvoice[i]}
      this._customFiled.singleDisplayToggle(id,payload).subscribe((result:any)=>{
      this.initView();
     })
  }

  isMarketVehicleDisable(index){
   return (this.selectedValue[index].value=='bottom' || this.selectedValue[index].value =='inside_estimate');
  }
}
