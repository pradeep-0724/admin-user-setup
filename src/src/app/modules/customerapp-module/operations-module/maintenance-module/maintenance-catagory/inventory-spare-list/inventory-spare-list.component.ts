import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MaintenanceService } from '../../operations-maintenance.service';

@Component({
  selector: 'app-inventory-spare-list',
  templateUrl: './inventory-spare-list.component.html',
  styleUrls: ['./inventory-spare-list.component.scss']
})
export class InventorySpareListComponent implements OnInit {
  @Input() isInventorySpareListOpen:boolean=false
  @Output() inventorySpareDetails= new EventEmitter()
  inventorySpareDetail={
    data:{},
  }
  search=''
  inventorySpareList=[];
  newInventorySpareName='';
  apiError=''
  constructor(private _maintenanceService:MaintenanceService) { }

  ngOnInit(): void {
   this.getInventorySpareList();
  }


  closeAddInventorySpare(){
    this.search ='';
    this.isInventorySpareListOpen=false
    this.inventorySpareDetails.emit(this.inventorySpareDetail);
  }

  closeaddNewInventorySpare(){
    this.apiError='';
    this.newInventorySpareName='';
  }

  // addNewInventorySpareType(){

  //   if(this.newInventorySpareName.trim()){
  //     let payload ={
  //       service_name:this.newInventorySpareName
  //     }
  //     this._maintenanceService.postNewServiceType(payload).subscribe((resp:any)=>{
  //       this.addNewInventorySpare=false;
  //       this.newInventorySpareName='';
  //       this.apiError='';
  //       this.getInventorySpareList();
  //     },err=>{
  //       this.apiError=err.error.message
  //     })
  //   }
  // }

  getInventorySpareList(){
    this._maintenanceService.getInventorySpareList().subscribe((resp:any)=>{
      this.inventorySpareList =resp['result']
    })
  }

  inventorySpareSelected(data){
    this.inventorySpareDetail.data =data;
    this.inventorySpareDetails.emit(this.inventorySpareDetail);
    this.isInventorySpareListOpen=false
  }


}
