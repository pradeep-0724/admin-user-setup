import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NewTripService } from '../../../../api-services/trip-module-services/trip-service/new-trip-service';

@Component({
  selector: 'app-advances-popup',
  templateUrl: './advances-popup.component.html',
  styleUrls: ['./advances-popup.component.scss']
})
export class AdvancesPopupComponent implements OnInit {

  @Input() advancesData: any;
  @Output() dataFromAdvancePopUp = new EventEmitter();

  fuelAdvances = [];
  partyAdvance = [];
  showError = false;
  totalFuelAdvance = '0';
  totalPartyAdvance = '0';
  customerDriverAllowance = '0';
  addAdvances =false;
  showEditPopup ={
    type:'',
    show:false,
    data:{},
    extras: {}
  }
  showAddPopup ={
    type:'',
    show:false,
    data:{},
    extras: {}
  }
  deleteParams: any = {selectedTab: "", show: false, params: {}}
  constructor(	private _tripService: NewTripService) { }

  ngOnInit() {
    this.getTripDetails()
  }

  onClickCancel() {

    this.dataFromAdvancePopUp.emit({
      totalFuelAdvance:this.totalFuelAdvance,
      totalPartyAdvance:this.totalPartyAdvance,
      customerDriverAllowance:this.customerDriverAllowance,
      totalAdvances: (Number(this.totalFuelAdvance)+Number(this.totalPartyAdvance) + Number(this.customerDriverAllowance)).toFixed(3)
    });
    this.advancesData.show = false;
  }



  getTotal(itemList: Array<any>): number {

    let total = 0;
    if (itemList.length > 0) {
      itemList.forEach(item => {
        total = total + Number(item.amount)
      })
    }

    return total
  }

  editPopUpStatus(data){
    if(data){
      this.getTripDetails()
    }
  }

  editNewTrip(type){
    this.showEditPopup ={
      type:type,
      show:true,
      data:JSON.parse(JSON.stringify(this.advancesData.data)),
      extras: {id: -1}
    }
  }


  getTripDetails(){
    if (this.advancesData.data.id) {
			this._tripService.getTripsDetails(this.advancesData.data.id).subscribe((res: any) => {
        this.advancesData.data =res['result'];
        this.fuelAdvances = JSON.parse(JSON.stringify(res['result'])).fuel_advances;
        this.partyAdvance = JSON.parse(JSON.stringify(res['result'])).party_advances;
        this.customerDriverAllowance = JSON.parse(JSON.stringify(res['result'])).customer_driver_allowance;
        this.totalFuelAdvance = (this.getTotal(this.fuelAdvances)).toFixed(3);
        this.totalPartyAdvance = this.getTotal(this.partyAdvance).toFixed(3);
        this.advancesAccountID();
			})
		}
  }

  onDeleteCompletion() {
    this.deleteParams = {selectedTab: "", show: false, params: {}}
    this.getTripDetails()
  }

  onDeleteSelection(type, id: string = "") {
    id = id || this.advancesData.data.id
    this.deleteParams = {selectedTab: type, show: true, params: {id: id}}
  }

  invoiceAdvance(type){
    let data =JSON.parse(JSON.stringify(this.advancesData.data))
    data.fuel_advances=[];
    data.party_advances =[];
    data.customer_driver_allowance =0;
    this.showAddPopup ={
      type:type,
      show:true,
      data:data,
      extras: {id: -1}
    }
  }

  addPopUpStatus(data){
    if (data.hasOwnProperty('fuel_advances')) {
      data.fuel_advances.forEach(element => {
        this.totalFuelAdvance += Number(element.amount)
        this.fuelAdvances.push(element)
    })
    let payload ={
      fuel_advances :this.fuelAdvances,
     }
     this.addNewAdvances('advance_fuels',payload)
  }
    if (data.hasOwnProperty('party_advances')) {
      data.party_advances.forEach(element => {
        this.totalPartyAdvance += Number(element.amount)
        this.partyAdvance.push(element)
    })
    let payload ={
      party_advances :this.partyAdvance,
     }
     this.addNewAdvances('party_advances',payload)
  }
    if (data.hasOwnProperty('customer_driver_allowance')) {
      this.customerDriverAllowance =   this.customerDriverAllowance+ Number( data.customer_driver_allowance);
      let payload ={
        customer_driver_allowance :  this.customerDriverAllowance,
       }
       this.addNewAdvances('allowances',payload)
    }
  }

  addNewAdvances(type,payload){
    this._tripService.putNewTripAdd(this.advancesData.data.id,payload,type).subscribe(response=>{
     this.getTripDetails();
    })
  }

  advancesAccountID(){
    if(this.partyAdvance.length>0)
    this.partyAdvance.forEach(item=>{
      item.account= item.account.id
    });
  }


}
