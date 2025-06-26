import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TerminologiesService } from 'src/app/core/services/terminologies.service';
import { RevenueService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/revenue-service/revenue.service';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { TabIndexService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/tab-index.service';
import { getObjectFromListByKey } from '../../../../../shared-module/utilities/helper-utils';

@Component({
  selector: 'app-invoice-trip-challan',
  templateUrl: './invoice-trip-challan.component.html',
  styleUrls: ['./invoice-trip-challan.component.scss']
})
export class InvoiceTripChallanComponent implements OnInit {

  search: any;
  challanListForm: UntypedFormGroup;
  challanList: any = [];
  defaultchallanList:any=[];
  showModal: Boolean = false;
  selectedChallans: any = [];
  @Input()  isAdd:boolean;
  @Output() onAddChallanClicked = new EventEmitter<any>();
  @Output() onAddChallanClickedAdvanceAmount = new EventEmitter<any>();
  @Output() checkChallanExist = new EventEmitter<any>();
  @Input() alreadySelectedTripChallans = [];
  @Input() inlineAdd: Boolean = false;
  @Input() challanErrorMessage: string = '';
  @Input() isFleetExpenseScreen: Boolean = false;
  @Input() isfuelExpenseScreen: Boolean = false;
  terminology:any;
  copyOFAlreadySelectedChallans=[];
  subscription: Subscription;
  allData: any = [];
  showFilter: boolean = false;
  count :number=0;
  copyOfCount:number=0;
  isTPEmpty: boolean = false;
  isFilterApplied =false;

  options: any = {
    columns: [
      {
        title: 'Work Order No.',
        key: 'work_order_no',
        type: 'unique'
      },
      {
        title: 'From',
        key: 'from_loc',
        type: 'unique'
      },
      {
        title: 'Vehicle',
        key: 'vehicle',
        type: 'unique'
      },
      {
        title: 'To',
        key: 'to_loc',
        type: 'unique'
      },
    ]
  };

  constructor(
    private _terminologiesService:TerminologiesService,
    private _fb: UntypedFormBuilder,
    private _revenueServices: RevenueService, private _popupBodyScrollService:popupOverflowService, private _tabIndex:TabIndexService
  ) {}

  ngOnInit() {
    this.terminology = this._terminologiesService.terminologie;
    this.buildForm();
    this.subscription = this._revenueServices.getInvoiceNumber().subscribe(resp => {
      this.checkChallanExist.emit(false);
      this.resetChallans();
      const invoiceId = resp["invoice_number"];
      if (!invoiceId) return

      this._revenueServices.getChallanListByInvoice(invoiceId).subscribe((response) => {

        this.buildChallans(response.result);
        this.challanErrorMessage = ''
        if (this.challanList.length > 0){
          this.checkChallanExist.emit(true);
        }
      });
    });
  }

  ngOnChanges(){
    this.copyOFAlreadySelectedChallans=this.alreadySelectedTripChallans;
    this._tabIndex.negativeTabIndex();

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
  popupOverflowHide(){
    this._popupBodyScrollService.popupHide()
   }
  resetChallans() {
    const challans = this.challanListForm.controls['challans'] as UntypedFormArray;
    challans.controls = [];
    challans.setValue([]);
    this.challanList = [];
    this.allData = [];
    this.selectedChallans = [];
  }


  buildChallans(items: any = []) {
    const challans = this.challanListForm.controls['challans'] as UntypedFormArray;

    this.alreadySelectedTripChallans.forEach((groupedChallan) => {
        challans.push(this.addChallanForm(groupedChallan));
        this.challanList.push(groupedChallan);
        this.allData.push(groupedChallan);
    });
    items.forEach((groupedChallan) => {
      if (!getObjectFromListByKey('trip', groupedChallan['trip'], this.challanList)){
        challans.push(this.addChallanForm(groupedChallan));
        this.challanList.push(groupedChallan);
        this.allData.push(groupedChallan);
      }
    });
    this.defaultchallanList =this.challanList;
  }

  addChallanForm(item) {
    return this._fb.group({
      selectedChallan: [false],
      challanNumber: [item.trip || '', Validators.required]
    });
  }


  onChallanSelected(ele) {
    if (ele.target.checked) {
      let challanItem = this.getItemById(ele.target.value, this.challanList);
      challanItem.total_amount = challanItem.freights + challanItem.charges - challanItem.deduction;
      this.selectedChallans.push(challanItem);

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
    this.selectedChallans = this.selectedChallans.filter((challan) => challan.trip ? challan.trip !== challanNumber : challan.trip !== challanNumber);
    this.alreadySelectedTripChallans = this.alreadySelectedTripChallans.filter((challan) => challan.trip ? challan.trip !== challanNumber : challan.trip !== challanNumber);
  }

  calculateAdvanceAmount(items: any){
    let advance_amount = 0
    items.forEach((challan) => {
        advance_amount += challan.advance_amount;
    });
    return advance_amount
  }

  selectChallans() {
    let advance_amount = this.calculateAdvanceAmount(this.selectedChallans);
    this.onAddChallanClicked.emit(this.selectedChallans);
    this.onAddChallanClickedAdvanceAmount.emit(advance_amount);
    this.showModal = !this.showModal;
    this._popupBodyScrollService.popupHide()
  }

  manageChallan() {
    let result = [];
    this._popupBodyScrollService.popupHide()

    for (let k = 0; k < this.alreadySelectedTripChallans.length; k++) {
      this.selectedChallans.push(this.alreadySelectedTripChallans[k]);
    }
    let hash = {};
    for (let i = 0; i < this.selectedChallans.length; i++) {
      if (hash.hasOwnProperty(this.selectedChallans[i].trip)) {
        result.push(this.selectedChallans[i]);
      }
      else {
        hash[this.selectedChallans[i].trip] = this.selectedChallans[i];
      }
    }
    this.onAddChallanClickedAdvanceAmount.emit(this.calculateAdvanceAmount(Object.values(hash)));
    this.onAddChallanClicked.emit(Object.values(hash));
    this.showModal = !this.showModal;
  }

  getItemById(id: String, list: []): any {
    return list.filter((item: any) => item.trip === id)[0];
  }

  mapSelectedChallans() {
    if(this.isAdd){
        this.search='';
        this.challanList=this.defaultchallanList;
        this.allSelected();
        this.reAsignFormValues();
        this.copyOfCount=0;
    }


      if(this.isAdd){
        this.count = this.alreadySelectedTripChallans.length;
      }
      if (this.challanList.length != 0) {
        this.showModal = !this.showModal;
        const challans = this.challanListForm.controls['challans'] as UntypedFormArray;
        challans.controls.forEach((challan) => {
          const existingChallans = this.alreadySelectedTripChallans.filter((exsitingChallan) =>
                    exsitingChallan.trip ? exsitingChallan.trip === challan.get('challanNumber').value :
                    exsitingChallan.trip === challan.get('challanNumber').value);
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

  filterApplied(result) {
    if(this.isAdd){
      this.defaultSelectedAll();
    }
    this.challanList = result.filtedData;
    this.showFilter = !this.showFilter;
    this.isFilterApplied=result.isFilterApplied;
  }

  selectAllAndClick() {
    this.challanList.forEach((challan) => {
        challan.total_amount = challan.freights + challan.charges - challan.deductions;
        this.selectedChallans.push(challan);
      });
  }

  selectAllChalan() {
    this.selectedChallans = [];
    let isAllSelected = this.challanListForm.controls.selectedAll.value;
    if (isAllSelected) {
      this.selectAllAndClick()
      this.count = this.challanList.length;
      this.checkuncheckAll("check");
    } else {
      this.count = 0;
      for (const Item of this.challanList) {
        this.removeFromSelectedChallans(Item.trip);
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
      this.removeFromSelectedChallans(Item.trip);
    }
    this.checkuncheckAll("uncheck")

  }

  checkuncheckAll(type) {
    this.count = 0;
    const challans = this.challanListForm.controls['challans'] as UntypedFormArray;

    this.reAsignFormValues();

    if (type == "check") {
      for (let index = 0; index < challans.length; index++) {
          challans.controls[index].patchValue({ "selectedChallan": true });
          this.count++;
      }
    } else {
      challans.controls.forEach((challan) => {
        challan.get('selectedChallan').setValue(false);
        this.alreadySelectedTripChallans = [];
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
        const lr_no = it.lr_no.toLowerCase().includes(this.search.toLowerCase());
        const from_loc = it.from_loc.toLowerCase().includes(this.search.toLowerCase());
        const to_loc = it.to_loc.toLowerCase().includes(this.search.toLowerCase());
        const vehicle_no = it.vehicle.toLowerCase().includes(this.search.toLowerCase());
        return (lr_no || from_loc || to_loc || vehicle_no);
      });
    }
  }
  close(){
     this.showModal = this.showModal ?false:true;
     this._popupBodyScrollService.popupHide()
     if(this.isAdd){
       this.alreadySelectedTripChallans=this.copyOFAlreadySelectedChallans;
       this.challanList =this.defaultchallanList;
     }
  }
  reAsignFormValues(){
    const challans = this.challanListForm.controls['challans'] as UntypedFormArray;
    for (let index = 0; index < this.defaultchallanList.length; index++) {
      challans.controls[index].patchValue({ "challanNumber": this.defaultchallanList[index].trip });
    }
  }
}
