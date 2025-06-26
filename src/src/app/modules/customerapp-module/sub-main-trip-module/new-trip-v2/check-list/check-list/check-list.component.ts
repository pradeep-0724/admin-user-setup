import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CheckListService } from '../check-list.service';
import { NewTripV2Constants } from '../../new-trip-v2-constants/new-trip-v2-constants';
import { cloneDeep } from 'lodash';
import { ToolTipInfo } from '../../new-trip-v2-utils/new-trip-v2-utils';
import { getBlankOption } from 'src/app/shared-module/utilities/helper-utils';

@Component({
  selector: 'app-check-list',
  templateUrl: './check-list.component.html',
  styleUrls: ['./check-list.component.scss']
})
export class CheckListComponent implements OnInit {
  addCheckList:FormGroup;
  checkListForm:FormGroup;
  @Output() selectedCheckList= new EventEmitter()
  search:string=''
  constantsTripV2 = new NewTripV2Constants()
  contentTypeList=this.constantsTripV2.contentTypeList
  isAddContentList:boolean=false;
  isContentList:boolean=false;
  taskTypesToolTip:ToolTipInfo;
  mandatoryTaskToolTip:ToolTipInfo;
  driverTaskToolTip:ToolTipInfo;
 @Input() selectedList=[];
 @Input() disabled=false;
  checkListData=[];
  selectedId=''
  selectedOption=getBlankOption();
  constructor(private _fb:FormBuilder,private _check_list:CheckListService) { }

  ngOnInit(): void {
    this.initializeToolTip();
    this.addCheckList=this._fb.group({
      field_label:['',[Validators.required]],
      field_type:['',[Validators.required]],
      mandatory:[false],
      employee_app_show:[false]
    });
    this.checkListForm = this._fb.group({
      checkList:this._fb.array([])
    });
    this.getAllCheckList();
  }

  saveAddCheckList(){
   let form = this.addCheckList;
   if(form.valid){
    this._check_list.postCheckList(form.value).subscribe(resp=>{
      this.selectedId = resp['result'];
      this.selectedOption=getBlankOption();
      this.selectedList=this.getSelectedList();
      this.getLatestCheckList();
      this.addCheckList.reset();
      this.addCheckList.patchValue({
        mandatory:false,
        employee_app_show:false
      });
      this.isAddContentList=false;
    });
   }else{
    this.addCheckList.markAllAsTouched()
   }
  }

  cancelAddChecklist(){
    this.isAddContentList=false;
    this.selectedOption=getBlankOption();
    this.addCheckList.reset();
    this.addCheckList.patchValue({
      mandatory:false,
      employee_app_show:false
    });
  }

  cancelCheckList(){
   this.isContentList=false;
   this.checkListData.forEach(item=>{
    item['selected'] =false;
   });
  }

  addCheckListToDestination(){
   this.selectedList=this.getSelectedList();
   this.checkListData.forEach(item=>{
    item['selected'] =false;
   });
   this.selectedCheckList.emit(this.getSelectedList())
   this.isContentList=false;

  }

  buildFormListArray(items=[]){
    let checkList =   this.checkListForm.get('checkList') as FormArray;
    checkList.controls=[];
    items.forEach(item=>{
      let list= this.getDefaultFormList(item);
      checkList.push(list)
    })
  }

  getDefaultFormList(item){
    return this._fb.group({
      selected:[item.selected||false],
      field_label:[item.field_label||''],
      field_type:[item.field_type||''],
      mandatory:[item.mandatory||false],
      employee_app_show:[item.employee_app_show||false],
      value:[item.value||''],
    })
  }

  getSelectedList(){
    let selectedItem=[];
    let checkList =   this.checkListForm.get('checkList') as FormArray;
    checkList.controls.forEach(item=>{
     if(item.value['selected']){
      if (typeof item['value']['field_type'] != 'string')
      item['value']['field_type'] = item['value']['field_type']['data_type']
      selectedItem.push(item.value)
     }
    }); 
    return selectedItem
  }

  getAllCheckList(){
    if(this._check_list.checkList.length){
      this.checkListData =cloneDeep(this._check_list.checkList);
      this.selectedCheckLists()
    }else{
      this.getLatestCheckList();
    }
    
  }

  getLatestCheckList(){
    this._check_list.getCheckList().subscribe(resp=>{
      this.checkListData =cloneDeep(resp.result.fields);
      this._check_list.checkList=cloneDeep(resp.result.fields);
     this.selectedCheckLists();
    })
  }

  selectedCheckLists(){
    if(this.selectedList.length){
      this.selectedList.forEach(selectedItem=>{
      this.checkListData.forEach(item=>{
       if(selectedItem.field_label==item.field_label){
         item['selected'] =true;
         item['employee_app_show']= selectedItem['employee_app_show']
         item['mandatory']=selectedItem['mandatory']
       }
      });
      });
    }
    if(this.selectedId){
      this.checkListData.forEach(item=>{
        if(this.selectedId==item.id){
          item['selected'] =true;
        }
       });
     }

    this.buildFormListArray(this.checkListData);
    this.orderedCheckList();
    this.selectedId ='';
  }

  initializeToolTip(){
    this.taskTypesToolTip={
      content:this.constantsTripV2.toolTipMessages.TRIP_TASK_TYPE.CONTENT
     }
     this.mandatoryTaskToolTip={
      content:this.constantsTripV2.toolTipMessages.MANDATORY_TASK.CONTENT
     }
     this.driverTaskToolTip={
      content:this.constantsTripV2.toolTipMessages.DRIVER_TASK.CONTENT
     }
  }

 


  openCheckList(){
   this.isContentList = true;
   this.selectedCheckLists();
   this.orderedCheckList();
  }

  orderedCheckList(){
    let checkList =   this.checkListForm.get('checkList') as FormArray;
    checkList.controls.sort((a, b) => {
      if (a['value']['selected'] === b['value']['selected']) {
        return 0; 
      }
      if (a['value']['selected']) {
        return -1; 
      }
      return 1;
    });
    checkList.updateValueAndValidity();
  }

}
