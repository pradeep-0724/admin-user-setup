import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { cloneDeep } from 'lodash';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { popupTripArray } from '../../pop-up-constants';
import { NewTripV2Service } from '../../../../api-services/trip-module-services/trip-service/new-trip-v2.service';
import { CurrencyService } from 'src/app/core/services/currency.service';


export interface outputdata{
  allData:Array<[]>,
  isFormValid:boolean
}


@Component({
  selector: 'app-charges-popup',
  templateUrl: './charges-popup.component.html',
  styleUrls: ['./charges-popup.component.scss']
})
export class ChargesPopupComponent implements OnInit {
  @Output () dataFromEdit = new EventEmitter<boolean>();
  @Input () isAddExpense = true;
  @Input () updateCharges = false;
  selectedId: any;
  deleteParams: any = {selectedTab: "", show: false, params: {}}
  tripDetails ;
  customerId = '';
  selectedTab: any = ""
  incomingChargesPopup = {show: false, type:""}
  showEditPopup ={
    type:'',
    show:false,
    data:{},
    extras: {}
  }
  showAddPopup ={
    type:'',
    show:false,
    data:{}
  }
  showError: boolean = false

  popupAddTripInputData = {
    'msg': '',
    'type': 'warning-proceed',
    'show': false
  }
  selectionType='';
	currency_type;

  constructor( private _popupBodyScrollService:popupOverflowService,private _newTripV2Service:NewTripV2Service ,
    private currency: CurrencyService,) { }

  ngOnInit() {
		this.currency_type = this.currency.getCurrency();
  }

  @Input()
  set showChargesPopup(data: any) {
    this.incomingChargesPopup =cloneDeep(data)
    this.selectedTab = data.type;
    this.tripDetails =cloneDeep(data.data);    
    this.customerId = data.extras['customerId'];
    this.selectedId = data.data.id
    let popup=[];
    popup= popupTripArray.filter(item=>item.value==this.selectedTab);
    if(popup.length){
      this.selectionType =popup[0].label;
    }else{
      this.selectionType=this.selectedTab;
    }
  }

  get showChargesPopup(): any{
    return this.incomingChargesPopup
  }

  onClickCancel(){
    this.dataFromEdit.emit(true);
    this._popupBodyScrollService.popupHide()

  }

  editNewTrip(type, id: string = "", extras: any = {},index){
    extras.id = id
    extras['customerId'] = this.customerId
    this.showEditPopup ={
      type:type,
      show:true,
      data:cloneDeep(this.tripDetails),
      extras: extras,
    }
    this.showEditPopup['index']=index

  }

  getTripDetails(){
    this._newTripV2Service.getTripProfitandLossDetails(this.selectedId).subscribe((res) => {
      res['result']['status'] = -1
      res['result']['fl_status'] = -1
      if(this.selectedTab=='party-charge-bill'|| this.selectedTab=='vp-charge-reduce-bill'){
        this.tripDetails =cloneDeep(res.result['revenue']['charges']);
        this.tripDetails['id'] = this.selectedId
      }
      if(this.selectedTab=='party-charge-reduce-bill' || this.selectedTab=='vp-charge-bill'){
        this.tripDetails =cloneDeep(res.result['expense']['charges']);
        this.tripDetails['id'] = this.selectedId
      }
  })
  }

  editPopUpStatus(isTrue){
    this.showEditPopup ={
      type: '',
      show: false,
      data: {},
      extras: {},
    }
    if(isTrue) {
      this.getTripDetails()
    }
  }

  onDeleteSelection(type, id: string = "") {
    id = id || this.selectedId
    this.deleteParams = {selectedTab: type, show: true, params: {id: id}}
  }

  onDeleteCompletion() {
    this.deleteParams = {selectedTab: "", show: false, params: {}}
    this.getTripDetails()
  }

  nullState(data) {
    if (data) {
      return data;
    }
    return '-';
  }

  selectedToadd(type){
    this.showAddPopup ={
      type:type,
      show:true,
      data: cloneDeep(this.tripDetails)
    }
  }

  addPopUpStatus(isTrue){
    this.showAddPopup ={
      type:'',
      show:false,
      data: {}
    }
    if(isTrue){
      this.getTripDetails()
    }
  }
}
