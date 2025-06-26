import { Component, OnInit, Output, EventEmitter, Input, OnDestroy,OnChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormArray } from '@angular/forms';
import { RevenueService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/revenue-service/revenue.service';
import { Subscription } from 'rxjs';
import { checkEmptyDataKey } from '../../../../../shared-module/utilities/helper-utils';
import { TerminologiesService } from 'src/app/core/services/terminologies.service';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import moment from 'moment';


@Component({
  selector: 'add-challan',
  templateUrl: './add-challan.component.html',
  styleUrls: ['./add-challan.component.scss']
})
export class AddChallanComponent implements OnInit, OnDestroy,OnChanges {
  terminology :any;
  search: any;
  challanListForm: UntypedFormGroup;
  challanList: any = [];
  defaultchallanList:any=[];
  showModal: Boolean = false;
  selectedChallans: any = [];
  @Input() fleetVendorId: string = ''
  @Input()  isAdd:boolean;
  @Output() onAddChallanClicked = new EventEmitter<any>();
  @Output() checkChallanExist = new EventEmitter<any>();
  @Output() onAddChallanClickedAdvanceAmount = new EventEmitter<any>();
  @Input() alreadySelectedChallans = [];
  @Input() inlineAdd: Boolean = false;
  @Input() challanErrorMessage: string = '';
  @Input() isFleetExpenseScreen: Boolean = false;
  @Input() isfuelExpenseScreen: Boolean = false;
  copyOFAlreadySelectedChallans=[];
  subscription: Subscription;
  allData: any = [];
  showFilter: boolean = false;
  count :number=0;
  copyOfCount:number=0;
  isTPEmpty: boolean = false;
  options: any = {
    columns: [
      {
        title: 'Consignee',
        key: 'consignee',
        type: 'unique'
      },
      {
        title: 'Consignor',
        key: 'consignor',
        type: 'unique'
      },
      {
        title: 'Vehicle',
        key: 'reg_number',
        type: 'unique'
      },
      {
        title: 'Work Order No.',
        key: 'transporter_permit_no',
        type: 'unique'
      },
      {
        title: 'Challan Date',
        key: 'created_at',
        type: 'dateRange',
        range: [
          { label: 'Less than 15 days', start: 'none', end: 15 },
          { label: '15 to 30 days', start: 15, end: 30 },
          { label: '30 to 45 days', start: 30, end: 45 },
          { label: '45+ days', start: 45, end: 'none' },
        ]
      }
    ]
  };

  constructor(
    private _terminologiesService:TerminologiesService,
    private _fb: UntypedFormBuilder,
    private _revenueServices: RevenueService,
    private _popupBodyScrollService:popupOverflowService
  ) {}

  ngOnInit() {
    this.terminology = this._terminologiesService.terminologie;
    this.buildForm();
    this.subscription = this._revenueServices.getPartyId().subscribe(resp => {
      const partyId = resp["partyId"];
      this._revenueServices.getChallanListByParty(partyId).subscribe((response) => {
        this.checkChallanExist.emit(false)
        this.resetChallans();
        this.buildChallans(response.result);
        this.challanErrorMessage = ''
        if(this.challanList.length > 0) {
          this.checkChallanExist.emit(true)
        }
      });
    });
  }
  ngOnChanges(){
    this.copyOFAlreadySelectedChallans=this.alreadySelectedChallans;
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  buildForm() {
    this.challanListForm = this._fb.group({
      selectedAll: [false],
      challans: this._fb.array([])
    });
  }

  toggleChallanModal() {
    if (this.challanList.length != 0) {
      this.showModal = true;
      this._popupBodyScrollService.popupActive();

    } else {
      this.challanErrorMessage = 'No Description found. please check party'
      this.showModal = false;
    }
  }

  resetChallans() {
    const challans = this.challanListForm.controls['challans'] as UntypedFormArray;
    challans.controls = [];
    challans.setValue([]);
    this.challanList = [];
    this.allData = [];
    this.selectedChallans = [];
  }

  groupChallans(collection: Array<object>, property: any) {
    if(!collection) {
            return null;
        }
        const groupedCollection = collection.reduce((previous, current)=> {
            if(!previous[current[property]]) {
                previous[current[property]] = [current];
            } else {
                previous[current[property]].push(current);
            }

            return previous;
        }, {});
        // this will return an array of objects, each object containing a group of objects
        return Object.keys(groupedCollection).map(trip_id => ({
        trip_id: trip_id,
        challan_no: groupedCollection[trip_id][0]['challan_no'],
        transporter_permit_no: groupedCollection[trip_id][0]['transporter_permit_no'],
        consignee: groupedCollection[trip_id][0]['consignee'] ,
        consignor: groupedCollection[trip_id][0]['consignor'],
        created_at: groupedCollection[trip_id][0]['created_at'],
        reg_number: groupedCollection[trip_id][0]['reg_number'],
        advance_amount: groupedCollection[trip_id][0]['advance_amount'],
        used_status: groupedCollection[trip_id][0]['used_status'] ? groupedCollection[trip_id][0]['used_status'] : false,
        value: groupedCollection[trip_id] }));
    }

  buildChallans(items: any = []) {
    const challans = this.challanListForm.controls['challans'] as UntypedFormArray;
    this.isTPEmpty = checkEmptyDataKey(items, "transporter_permit_no")
    let groupedChallans = this.groupChallans(items, "trip_id")
    let groupedAlreadySelected = this.groupChallans(this.alreadySelectedChallans, "trip_id");
    groupedChallans.forEach((groupedChallan) => {
      challans.push(this.addChallanForm(groupedChallan));
      this.challanList.push(groupedChallan);
      this.allData.push(groupedChallan);
    });
    groupedAlreadySelected.forEach((groupedChallan) => {
      challans.push(this.addChallanForm(groupedChallan));
      this.challanList.push(groupedChallan);
      this.allData.push(groupedChallan);
    });
    this.defaultchallanList =this.challanList;
  }

  addChallanForm(item) {
    return this._fb.group({
      selectedChallan: [false],
      challanNumber: [item.trip_id || '', Validators.required]
    });
  }

  unGroupChallans(challanItem){
    return challanItem.value
  }

  onChallanSelected(ele) {
    if (ele.target.checked) {
      const challanItem = this.getItemById(ele.target.value, this.challanList);
      let unGroupedChallans = this.unGroupChallans(challanItem)
      unGroupedChallans.forEach((challan) => {
        challan.total_amount = challan.net_receiveable_amount;
        this.selectedChallans.push(challan);
      });
     if(this.isAdd){
       this.count++;
       this.allSelected();
     }
    }
    else {
      this.removeFromSelectedChallans(ele.target.value);
      if(this.isAdd){
        this.allSelected();
      }
    }
  }

  removeFromSelectedChallans(challanNumber) {
    if(this.isAdd){
      this.count--;
    }
    this.selectedChallans = this.selectedChallans.filter((challan) => challan.trip_id ? challan.trip_id !== challanNumber : challan.trip_id !== challanNumber);
    this.alreadySelectedChallans = this.alreadySelectedChallans.filter((challan) => challan.trip_id ? challan.trip_id !== challanNumber : challan.trip_id !== challanNumber);
  }

  calculateAdvanceAmount(items: any){
    let advance_amount = 0
    const challans = this.groupChallans(items, "trip_id");
    challans.forEach((challan) => {
        advance_amount += challan.advance_amount;
    });
    return advance_amount
  }

  selectChallans() {
    let advance_amount = this.calculateAdvanceAmount(this.selectedChallans);
    this.onAddChallanClicked.emit(this.selectedChallans);
    this.onAddChallanClickedAdvanceAmount.emit(advance_amount);
    this.showModal = !this.showModal;
    this._popupBodyScrollService.popupHide();
  }

  manageChallan() {
    this._popupBodyScrollService.popupHide();
    let result = [];

    for (let k = 0; k < this.alreadySelectedChallans.length; k++) {
      this.selectedChallans.push(this.alreadySelectedChallans[k]);
    }
    let hash = {};
    for (let i = 0; i < this.selectedChallans.length; i++) {
      if (hash.hasOwnProperty(this.selectedChallans[i].id)) {
        result.push(this.selectedChallans[i]);
      }
      else {
        hash[this.selectedChallans[i].id] = this.selectedChallans[i];
      }
    }
    this.onAddChallanClickedAdvanceAmount.emit(this.calculateAdvanceAmount(Object.values(hash)));
    this.onAddChallanClicked.emit(Object.values(hash));
    this.showModal = !this.showModal;
  }

  getItemById(id: String, list: []): any {
    return list.filter((item: any) => item.trip_id === id)[0];
  }

  mapSelectedChallans() {
    if(this.isAdd){
        this.search='';
        this.challanList=this.defaultchallanList;
        this.allSelected();
        this.reAsignFormValues();
        this.copyOfCount=0;
    }
      this.isTPEmpty = checkEmptyDataKey(this.alreadySelectedChallans, "transporter_permit_no")
      let grouped_challans = this.groupChallans(this.alreadySelectedChallans, "trip_id");
      if(this.isAdd){
        this.count =grouped_challans.length;
      }
      if (this.challanList.length != 0) {
        this.showModal = !this.showModal;
        const challans = this.challanListForm.controls['challans'] as UntypedFormArray;
        challans.controls.forEach((challan) => {
          const existingChallans = grouped_challans.filter((exsitingChallan) => exsitingChallan.trip_id ? exsitingChallan.trip_id === challan.get('challanNumber').value : exsitingChallan.trip_id === challan.get('challanNumber').value);
          if (existingChallans.length > 0) {
            challan.get('selectedChallan').setValue(true);
            this.copyOfCount++;
          }
        });
        if(this.copyOfCount==this.challanList.length){
          this.challanListForm.patchValue({ "selectedAll": true });
        }else{
          this.challanListForm.patchValue({ "selectedAll": false });
        }
      }
    }
    popupOverflowHide(){
      this._popupBodyScrollService.popupHide()
     }
  filterApplied(result) {
    if(this.isAdd){
      this.defaultSelectedAll();
    }
    this.challanList = result.filtedData;
    this.showFilter = !this.showFilter;
  }
  selectAllAndClick(ele) {
    if (ele) {
      const challanItem = this.getItemById(ele, this.challanList);
      let unGroupedChallans = this.unGroupChallans(challanItem)
      unGroupedChallans.forEach((challan) => {
        challan.total_amount = challan.net_receiveable_amount;
        this.selectedChallans.push(challan);
      });
    }
  }

  selectAllChalan() {
    this.selectedChallans = [];
    let isAllSelected = this.challanListForm.controls.selectedAll.value;
    if (isAllSelected) {
      for (const Item of this.challanList) {
        this.selectAllAndClick(Item.trip_id)
      }
      this.count = this.challanList.length;
      this.checkuncheckAll("check");
    } else {
      this.count = 0;
      for (const Item of this.challanList) {
        this.removeFromSelectedChallans(Item.trip_id);
      }
      this.checkuncheckAll("uncheck");

    }
  }
  allSelected() {
    if ((this.count == this.challanList.length)) {
      this.challanListForm.patchValue({ "selectedAll": true });
    } else {
      this.challanListForm.patchValue({ "selectedAll": false });
    }
  }
  defaultSelectedAll() {
    this.count = 0;
    this.challanListForm.patchValue({ "selectedAll": false });
    for (const Item of this.challanList) {
      this.removeFromSelectedChallans(Item.trip_id);
    }
    this.checkuncheckAll("uncheck")

  }
  checkuncheckAll(type) {
    this.count = 0;
    const challans = this.challanListForm.controls['challans'] as UntypedFormArray;
    let array = [];
    this.reAsignFormValues();
    for (let index = 0; index < this.challanList.length; index++) {
      array.push(this.challanList[index].trip_id)
    }
    if (type == "check") {
      for (let index = 0; index < challans.length; index++) {
        if (array.indexOf(challans.controls[index].value.challanNumber) !== -1) {
          challans.controls[index].patchValue({ "selectedChallan": true });
          this.count++;
        } else {
          challans.controls[index].patchValue({ "selectedChallan": false });
        }
      }
    } else {
      challans.controls.forEach((challan) => {
        challan.get('selectedChallan').setValue(false);
        this.alreadySelectedChallans = [];
      })
    }
  }
  searchitem() {
    if (!this.search) {
      this.challanList = this.defaultchallanList;
    } else {
      if(this.isAdd){
        this.defaultSelectedAll();
      }
      this.challanList = this.defaultchallanList.filter(it => {
        const challan_no = it.challan_no.toLowerCase().includes(this.search.toLowerCase());
        const consignee = it.consignee.toLowerCase().includes(this.search.toLowerCase());
        const consigner = it.consignor.toLowerCase().includes(this.search.toLowerCase());
        const vehicle_no = it.reg_number.toLowerCase().includes(this.search.toLowerCase());
        return (challan_no || consignee || consigner || vehicle_no);
      });
    }
  }
  close(){
     this.showModal = this.showModal ?false:true;
     this._popupBodyScrollService.popupHide();
     if(this.isAdd){
       this.alreadySelectedChallans=this.copyOFAlreadySelectedChallans;
       this.challanList =this.defaultchallanList;
     }
  }
  reAsignFormValues(){
    const challans = this.challanListForm.controls['challans'] as UntypedFormArray;
    for (let index = 0; index < this.defaultchallanList.length; index++) {
      challans.controls[index].patchValue({ "challanNumber": this.defaultchallanList[index].trip_id });
    }
  }

  changeDatetoDDMMYYYY(date){  
    return moment(date).format('DD-MM-YYYY')
  }
}
