import { EmployeeSalaryModuleService } from '../../../api-services/employee-salary-service/employee-salary-module-service.service';
import { Component, OnInit, Input, OnChanges, EventEmitter, Output, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
@Component({
  selector: 'app-add-edit-employee-salary-list',
  templateUrl: './add-edit-employee-salary-list.component.html',
  styleUrls: ['./add-edit-employee-salary-list.component.scss']
})
export class AddEditEmployeeSalaryListComponent implements OnInit ,OnChanges,OnDestroy{
  challanList: any = [];
  showModal: Boolean = false;
  @Output() onSubmit= new EventEmitter<any>();
  @Input() inlineAdd: Boolean = false;
  @Input() challanErrorMessage: string = '';
  @Input() isEdit:any
  @Input() month:any
  search='';
  selectedTab=''
  i;
  selectedDesig=''
  paid='paid';
  unpaid='unpaid';
  markedAS='-1';
  p: number = 1;
  filter_by: number = 5;
  sortedData: any = [];
  othersMarked:any = [];
  paidMarked:any = [];
  unpaidMarked:any = [];
  remainingMarked:any = [];
  paidMarkedCopy:any = [];
  unpaidMarkedCopy:any = [];
  remainingMarkedCopy:any = [];
  designation :any = [];
  dropdownList = [];
  selectedItems = [];
  selectAllEmployee=false;
  selectallUnPiadEmployee=false;
  selectallPaidEmployee=false;

  dropdownSettings:IDropdownSettings= {};
  date=''
  @Input()dataFromParent= new BehaviorSubject({})
  @Output() refreshData=new EventEmitter();
  @Input () allEmployeeList:any=[];
  @Input () selectedEmployee:any=[];
  employeeErrorMessage='';
  selectedEmpList = [];
  selectAllPaidEmployee : boolean = false;
  selectAllUnPaidEmployee : boolean = false;

  constructor(private _salaryEmployeeService :EmployeeSalaryModuleService, private _popupBodyScrollService:popupOverflowService,
    private _commonLoaderService : CommonLoaderService){

  }
  
  ngOnInit() {   
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
    this.getEmployeeAttendenceOndate();
    
  }


  close(){
    this.refreshData.emit(true)
  }
  ngOnChanges(): void {
   this.allEmployeeList=this.allEmployeeList;
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
    this.remainingMarked = this.remainingMarkedCopy;
    this.paidMarked = this.paidMarkedCopy;
    this.unpaidMarked = this.unpaidMarkedCopy;
    if(this.selectedItems.length>0){
      this.selectedItems.forEach(item=>{
         this.sortedData.forEach(element => {
            if(element.designation==item.name){
              data.push(element);
            }
         });
      })
      this.othersMarked=data;
    }
    if(data.length<=0){
      this.othersMarked =this.sortedData;
    }
    if(this.selectedItems.length>0){
      let remaingEmps = [];
      this.selectedItems.forEach(item=>{
        this.remainingMarked.forEach(element => {
           if(element.designation==item.name){
              remaingEmps.push(element);
            }
        });
      })
      this.remainingMarked = remaingEmps;

      let paidEmps = [];
      this.selectedItems.forEach(item=>{
        this.paidMarked.forEach(element => {
           if(element.designation==item.name){
              paidEmps.push(element);
            }
        });
      })
      this.paidMarked = paidEmps;

      let unPaidEmps = [];
      this.selectedItems.forEach(item=>{
        this.unpaidMarked.forEach(element => {
          if(element.designation==item.name){
            unPaidEmps.push(element);
          }
        });
      })
      this.unpaidMarked = unPaidEmps;
    }
    else{
      this.remainingMarked = this.remainingMarkedCopy;
      this.paidMarked = this.paidMarkedCopy;
      this.unpaidMarked = this.unpaidMarkedCopy;
    }
  }

  selectallEmployees(data,event){
    data.forEach(element => {
      element['checked']=event;
      this.itemSelectChange(data,element,event)
    });
  }

  selectedTabs(tab){
   this.selectedTab =tab;
   this.getDefaultValues();
   this.getEmployeeAttendenceOndate();
  }

  getDefaultValues(){
    this.filter_by=5;
    this.selectAllEmployee=false;
    this.selectAllUnPaidEmployee=false;
    this.selectAllEmployee =false;

    this.search='';
    this.markedAS='-1';
    this.selectedItems=[];
    this.isParentBoxChecked();
    this.selectallEmployees(this.unpaidMarked,this.selectAllEmployee);
    this.selectallEmployees(this.paidMarked,this.selectAllPaidEmployee);
    this.selectallEmployees(this.remainingMarked,this.selectAllUnPaidEmployee);

    this.getEmployeeAttendenceOndate();
  }

  getEmployeeAttendenceOndate(){
    this._salaryEmployeeService.getAllEmployee(this.month).subscribe(data=>{      
      let result =data['result'];
      if(result['All'].length==0&& result['Paid'].length==0&&result['Unpaid'].length==0){
        this.employeeErrorMessage='No Employee found. please add employee'
       }else{
        this.employeeErrorMessage=''
       }
       this.othersMarked=[];
       this.remainingMarked=result['All']
       this.paidMarked= result['Paid']
       this.unpaidMarked= result['Unpaid'];
       this.remainingMarked.forEach(element=>{
        element['checked']=false
      })
      this.unpaidMarked.forEach(element=>{
        element['checked']=false
      })
      this.paidMarked.forEach(element=>{
        element['checked']=false
      })        
      if(this.selectedTab==''){
        this.sortedData= this.remainingMarked
        this.othersMarked =  this.sortedData;
        this.getDesignation();
      }
      if(this.selectedTab=='paid'){
        this.sortedData= this.paidMarked
        this.othersMarked =  this.sortedData;
        this.getDesignation();
      }
      if(this.selectedTab=='unpaid'){
        this.sortedData= this.unpaidMarked
        this.othersMarked =  this.sortedData;
        this.getDesignation();
      }
    });        
    if(this.isEdit){
      this.getSelectedValueMarked();
    }else{
     this.getSelectedFromListValueMarked();
    }
    this.remainingMarkedCopy = this.remainingMarked;
    this.paidMarkedCopy = this.paidMarked;
    this.unpaidMarkedCopy = this.unpaidMarked
  }

  itemSelectChange(othersMarked,data, event){    
    data['checked'] = event
    othersMarked.forEach(element => {
      if(element.id===data.id){
        element['checked']= event
        if(data.checked == true){
          this.selectedEmpList.push(element.id)
        }else{
          const index = this.selectedEmpList.indexOf(data.id);
          if (index !== -1) {
              this.selectedEmpList.splice(index, 1);
          }
        }
      }
    });
    this.remainingMarked.forEach(element => {
      if(element.id===data.id){
        element['checked']= event
      }
    });
    this.unpaidMarked.forEach(element => {
      if(element.id===data.id){
        element['checked']= event
      }
    });
    this.paidMarked.forEach(element => {
      if(element.id===data.id){
        element.checked= event
      }
    });
    if(!event){
      const index = this.selectedEmployee.findIndex(emp => emp.id === data.id);
      if (index !== -1) {
        this.selectedEmployee.splice(index, 1);
      }
    }    
    this.isParentBoxChecked();
    // this.remainingMarkedCopy = this.remainingMarked;
    // this.paidMarkedCopy = this.paidMarked;
    // this.unpaidMarkedCopy = this.unpaidMarked
  }

  submit(){    
    this.selectedEmpList = [...new Set(this.selectedEmpList)];
    this.onSubmit.emit(this.selectedEmpList)
    this.showModal = false;
    this._popupBodyScrollService.popupHide()
  }

  getSelectedValueMarked(){    
    setTimeout(() => {      
      this.selectedEmployee.forEach(selected => {
        this.remainingMarked.forEach(element=>{
          if(selected['employee'].id ==element.id){
            element['checked']=true;
            this.selectedEmpList.push(element.id)
          }
        })
        this.paidMarked.forEach(element=>{
          if(selected['employee'].id ==element.id){
            element['checked']=true;
            this.selectedEmpList.push(element.id)
          }
        })
        this.unpaidMarked.forEach(element=>{
          if(selected['employee'].id ==element.id){
            element['checked']=true;
            this.selectedEmpList.push(element.id)
          }
        })        
        this.selectedEmpList = [...new Set(this.selectedEmpList)];
      });
      this.isParentBoxChecked();
      this.remainingMarkedCopy = this.remainingMarked;
      this.paidMarkedCopy = this.paidMarked;
      this.unpaidMarkedCopy = this.unpaidMarked
    }, 1000);
  }

  openModel(){
    this.showModal = !this.showModal;
    this.getDefaultValues();
    this._popupBodyScrollService.popupActive();
  }

  closeModel(){
    this.showModal =false;
    this._popupBodyScrollService.popupHide();
  }

  getSelectedFromListValueMarked(){        
    if(this.allEmployeeList.length>0){
      setTimeout(() => {
        this.allEmployeeList.forEach(selected => {
          this.remainingMarked.forEach(element=>{
           if(selected.id ==element.id){
            element['checked']=true;
            this.selectedEmpList.push(element.id)
           }
          })
          this.paidMarked.forEach(element=>{
            if(selected.id ==element.id){
             element['checked']=true;
             this.selectedEmpList.push(element.id)
            }
           })
           this.unpaidMarked.forEach(element=>{
            if(selected.id ==element.id){
             element['checked']=true;
             this.selectedEmpList.push(element.id)
            }
           })
        });
        this.selectedEmpList = [...new Set(this.selectedEmpList)]
        this.isParentBoxChecked();
      }, 1000);
    }
  }

  isParentBoxChecked(){
    this.selectAllEmployee = this.remainingMarked.every((ele)=>ele.checked==true);
    this.selectAllPaidEmployee = this.paidMarked.every((ele)=>ele.checked==true);
    this.selectAllUnPaidEmployee = this.unpaidMarked.every((ele)=>ele.checked==true);  
  }

  searchEnabled(){
    this.remainingMarked = this.remainingMarkedCopy;
    this.paidMarked = this.paidMarkedCopy;
    this.unpaidMarked = this.unpaidMarkedCopy;
    if(this.search){
      if(this.selectedTab==''){
        let remamingEmps = [];
        remamingEmps = this.remainingMarked;
        this.remainingMarked = [];
         this.remainingMarked = remamingEmps.filter(it=>{
          const name = it.name.toString().toLowerCase().includes(this.search.toLowerCase());
          return (name);
        });
      }
      if(this.selectedTab=='paid'){
        let remamingEmps = [];
        remamingEmps = this.paidMarked;
        this.paidMarked = [];
         this.paidMarked = remamingEmps.filter(it=>{
          const name = it.name.toString().toLowerCase().includes(this.search.toLowerCase());
          return (name);
        });
      }
      if(this.selectedTab === 'unpaid'){
        let remamingEmps = [];
        remamingEmps = this.unpaidMarked;
        this.unpaidMarked = [];
         this.unpaidMarked = remamingEmps.filter(it=>{
          const name = it.name.toString().toLowerCase().includes(this.search.toLowerCase());
          return (name);
        });
      }
    }else{
      this._commonLoaderService.getHide();
      this.remainingMarked = this.remainingMarkedCopy;
      this.paidMarked = this.paidMarkedCopy;
      this.unpaidMarked = this.unpaidMarkedCopy;
    }
    this.isParentBoxChecked();
  }

  ngOnDestroy(): void {
    this._commonLoaderService.getShow();
  }
}
