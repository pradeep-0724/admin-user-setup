import { Component, OnInit, Input,EventEmitter, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { EmployeeAttendenceService } from '../../api-services/employee-attendence-service/employeeAttendence.service';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';




@Component({
  selector: 'app-list-attendance',
  templateUrl: './list-attendance.component.html',
  styleUrls: ['./list-attendance.component.scss']
})
export class ListAttendanceComponent implements OnInit {
  @Input()dataFromParent= new BehaviorSubject({})
 isOpen=false;
  constructor(private _attendenceService:EmployeeAttendenceService ,private _popupBodyScrollService:popupOverflowService,private _analytics:AnalyticsService) { }
  search='';
  selectedTab=''
  i;
  selectedDesig=''
  present='present';
  absent='absent';
  markedAS='-1';
  isMarkedother=false;
  p: number = 1;
  filter_by: number = 5;
  filter = new ValidationConstants().filter;
  sortedData: any = [];
  othersMarked:any = [];
  presentMarked:any = [];
  absentMarked:any = [];
  remailningMarked:any = [];
  designation :any = [];
  dropdownList = [];
  selectedItems = [];
  selectallEmployee=false
  dropdownSettings:IDropdownSettings= {};
  date=''
  showDate=''
  othersAreSelectedAs='';
  screenType=ScreenType;
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;
  @Output() refreshData=new EventEmitter();
  ngOnInit() {
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.EMPLOYEEATTENDANCE,this.screenType.LIST,"Navigated");
     this.dropdownSettings= {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 3,
      enableCheckAll: true,
      allowSearchFilter: true
    };

    this.dataFromParent.subscribe(data=>{
      this.isOpen=data['isOpen'];
      this.date = data['selectedDate'];
      this.getEmployeeAttendenceOndate();
    })

  }


  close(){
    this.refreshData.emit(true);
    this.getDefaultValues()
    this.isOpen=false;
    this._popupBodyScrollService.popupHide();
  }

  getDesignation(){
    this.designation= this.sortedData.map(item => item.designation);
    let array = this.designation.filter( function( item, index, inputArray ) {
      return inputArray.indexOf(item) == index;
       });
    this.designation=[];
      array.forEach((element,index )=> {
        this.designation.push({
          name:element,
          id:index+1
        })
      });

   this.dropdownList =this.designation
  }

  onItemSelect(item: any) {
     this.getDataAccordingToDeg()
  }
  onSelectAll(items: any) {
    this.selectedItems=items;
     this.getDataAccordingToDeg()
  }
  onItemDeSelect(item: any){
     this.getDataAccordingToDeg()
  }

  onDeSelectAll(item: any){
    this.selectedItems=item;
     this.getDataAccordingToDeg()
  }


  getDataAccordingToDeg(){
    let data=[];
    if(this.selectedItems.length>0){
      this.selectedItems.forEach(item=>{
         this.sortedData.forEach(element => {
            if(element.designation==item.name){
              data.push(element);
            }
         });
      })
      this.othersMarked=data;
      this.selectallEmployees();
    }
    if(data.length<=0){
      this.othersMarked =this.sortedData;
      this.selectallEmployees();
    }
  }

  selectallEmployees(){
      this.othersMarked.forEach(element => {
        element['checked']=this.selectallEmployee
      });
  }

  selectedTabs(tab){
   this.selectedTab =tab;
   this.getDefaultValues();
   this.getEmployeeAttendenceOndate();
  }

  getDefaultValues(){
    this.filter_by=5;
    this.selectallEmployee=false;
    this.search='';
    this.markedAS='-1';
    this.selectedItems=[];
    this.selectallEmployees()
    this.getEmployeeAttendenceOndate();
    this.othersAreSelectedAs="";
    this.isMarkedother=false;
  }

  getEmployeeAttendenceOndate(){

       if(this.date){
         this._attendenceService.getEmployeeAttendence(this.date).subscribe(data=>{
               let result =data['result'];
               this.othersMarked=[]
               this.remailningMarked=result['Remaining']
               this.presentMarked= result['Present']
               this.absentMarked= result['Absent'];
               this.remailningMarked.forEach(element=>{
                 element['checked']=false
               })
               this.absentMarked.forEach(element=>{
                 element['checked']=false
               })
               this.presentMarked.forEach(element=>{
                 element['checked']=false
               })
               if(this.selectedTab==''){
                 this.sortedData= this.remailningMarked
                 this.othersMarked =  this.sortedData;
                 this.getDesignation();
               }
               if(this.selectedTab=='present'){
                 this.sortedData= this.presentMarked
                 this.othersMarked =  this.sortedData;
                 this.getDesignation();
               }
               if(this.selectedTab=='absent'){
                 this.sortedData= this.absentMarked
                 this.othersMarked =  this.sortedData;
                 this.getDesignation();
               }
             });
       }
  }

  itemSelectChange(othersMarked){
    let isTrueAll= []
    isTrueAll= othersMarked.map( item => item.checked ==true )
    if(!isTrueAll.includes(false)){
      this.selectallEmployee=true
    }else{
      this.selectallEmployee=false
    }
  }

  submit(){
    if(this.markedAS !='-1'){
      let selectedData =[],
          ids=[],
          unselectedData=[],
          unselectedIds=[];
      selectedData = this.othersMarked.filter(item => item.checked==true);
       ids =selectedData.map(item => item.id);
       unselectedData = this.othersMarked.filter(item => item.checked==false);
       unselectedIds = unselectedData.map(item => item.id);
       if(this.isMarkedother){
        if(ids.length>0){
          let payload1 ={
            "date": this.date,
            "action":this.markedAS,
            "employees": ids}
            this._attendenceService.postEmployeeAttendence(payload1).subscribe(data=>{
              if(unselectedIds.length>0){
                let payload2 ={
                  "date": this.date,
                  "action":this.othersAreSelectedAs.toLocaleLowerCase(),
                  "employees": unselectedIds}
                  this._attendenceService.postEmployeeAttendence(payload2).subscribe(data=>{
                    if(this.markedAS=="Absent"){
                      this.selectedTabs('absent')
                    }else if(this.markedAS=="Present"){
                      this.selectedTabs('present')
                    }else{
                      this.selectedTabs('')
                    }
                })
              }
              if(unselectedIds.length<0){
                if(this.markedAS=="Absent"){
                  this.selectedTabs('absent')
                }else if(this.markedAS=="Present"){
                  this.selectedTabs('present')
                }else{
                  this.selectedTabs('')
                }
              }
          })
        }



       }else{
        if(ids.length>0){
          let payload ={
            "date": this.date,
            "action":this.markedAS,
            "employees": ids}
            this._attendenceService.postEmployeeAttendence(payload).subscribe(data=>{
              if(this.markedAS=="Absent"){
                this.selectedTabs('absent')
              }else if(this.markedAS=="Present"){
                this.selectedTabs('present')
              }else{
                this.selectedTabs('')
              }
          })
         }
       }

    }
  }

  onOtherMarkedChange(){
    if(this.markedAS=="Absent"){
      this.othersAreSelectedAs="Present";
    }else if(this.markedAS=="Present"){
      this.othersAreSelectedAs="Absent";
    }else{
      this.selectedTabs('')
    }
  }
}
