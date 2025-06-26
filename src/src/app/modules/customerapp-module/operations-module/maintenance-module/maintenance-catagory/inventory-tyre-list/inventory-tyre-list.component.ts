import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MaintenanceService } from '../../operations-maintenance.service';

@Component({
  selector: 'app-inventory-tyre-list',
  templateUrl: './inventory-tyre-list.component.html',
  styleUrls: ['./inventory-tyre-list.component.scss']
})
export class InventoryTyreListComponent implements OnInit {
  @Input() isInventoryTyreListOpen:boolean=false
  @Output() inventoryTyreDetails= new EventEmitter()
  inventoryTyreDetail={
    data:{},
  }
  search=''
  inventoryTyreList=[];
  newInventoryTyreName='';
  apiError=''
  constructor(private _maintenanceService:MaintenanceService) { }

  ngOnInit(): void {
   this.getInventorySpareList();
  }


  closeAddInventoryTyre(){
    this.search ='';
    this.isInventoryTyreListOpen=false
    this.inventoryTyreDetails.emit(this.inventoryTyreDetail);
  }

  closeaddNewInventorySpare(){
    this.apiError='';
    this.newInventoryTyreName='';
  }

  getInventorySpareList(){
    this._maintenanceService.getInventoryTyreList().subscribe((resp:any)=>{
      this.inventoryTyreList =resp['result']
    })
  }

  inventoryTyreSelected(data){
    this.inventoryTyreDetail.data =data;
    this.inventoryTyreDetails.emit(this.inventoryTyreDetail);
    this.isInventoryTyreListOpen=false
  }


}
