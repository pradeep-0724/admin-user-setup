import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RevenueService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/revenue-service/revenue.service';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';

@Component({
  selector: 'app-add-vehicle-fuel-challan',
  templateUrl: './add-vehicle-fuel-challan.component.html',
  styleUrls: ['./add-vehicle-fuel-challan.component.scss']
})
export class AddVehicleFuelChallanComponent implements OnInit {
  search: any;
  challanListForm: UntypedFormGroup;
  challanList: any = [];
  showModal: Boolean = false;
  selectedChallans: any = [];
  @Output() onAddChallanClicked = new EventEmitter<any>();
  @Output() checkChallanExist = new EventEmitter<any>();
  @Input() alreadySelectedChallans = [];
  @Input() inlineAdd: Boolean = false;
  @Input() challanErrorMessage: string = '';
  @Input() isAdd: boolean;
  subscription: Subscription;
  allData: any = [];
  showFilter: boolean = false;
  count: number = 0;
  isFilterApplied = false;
  defaultchallanList: any = [];
  copyOFAlreadySelectedChallans: any = [];
  copyOfCount: number = 0;
  options: any = {
    columns: [
      {
        title: 'Vehicle',
        key: 'vehicle.reg_number', 
        type: 'unique'
      },
      {
        title: 'Document No.',
        key: 'document_no',
        type: 'unique'
      },
    ]
  };
  currency_type:any;
  challanParams:any={
    start_date:null,
    end_date:null
  }
  partyId:String

  constructor(
    private _fb: UntypedFormBuilder,
    private _revenueServices: RevenueService,
    private _popupBodyScrollService:popupOverflowService,
    private currency: CurrencyService
  ) { }


  ngOnInit() {
    this.buildForm();
    this.currency_type = this.currency.getCurrency();
    this.subscription = this._revenueServices.getPartyId().subscribe(resp => {
      this.checkChallanExist.emit(false);
      const partyId = resp["partyId"];
      this.partyId=resp["partyId"]
      this.resetChallans();
      this._revenueServices.getUnpaidChallans(partyId,this.challanParams).subscribe((response: any) => {
        this.buildChallans(response.result);
        this.challanErrorMessage = ''
        if (this.challanList.length > 0){
          this.checkChallanExist.emit(true);
        }
      });
    });
  }
  dateSelectedEmitter(event){
    if(event){      
      this.challanParams.start_date=changeDateToServerFormat(event.startDate) ;
      this.challanParams.end_date=changeDateToServerFormat(event.endDate);
      this._revenueServices.getUnpaidChallans(this.partyId,this.challanParams).subscribe((response: any) => {
        this.resetChallans()
        this.buildChallans(response.result);
        this.challanErrorMessage = ''
        if (this.challanList.length > 0){
          this.checkChallanExist.emit(true);
        }
      });
    }
  }
  ngOnChanges() {
    this.copyOFAlreadySelectedChallans = this.alreadySelectedChallans;
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
      this._popupBodyScrollService.popupActive()
    } else {
      this.challanErrorMessage = 'No challan found. please check party'
      this.showModal = false;
    }
  }

  resetChallans() {
    const challans = this.challanListForm.controls['challans'] as UntypedFormArray;
    challans.controls = [];
    this.challanList = [];
    this.allData = [];
    this.selectedChallans = [];
  }


   popupOverflowHide(){
    this._popupBodyScrollService.popupHide()
   }


  buildChallans(items: any = []) {
    this.allData = [];
    const challans = this.challanListForm.controls['challans'] as UntypedFormArray;
    items.forEach((challan) => {
      challans.push(this.addChallanForm(challan));
      this.challanList.push(challan);
      this.allData.push(challan);
    });
    if (this.alreadySelectedChallans.length > 0)
      this.alreadySelectedChallans.forEach((challan) => {
        challans.push(this.addChallanForm(challan));
        this.challanList.push(challan);
        this.allData.push(challan);
      });
    this.defaultchallanList = this.challanList;
  }

  addChallanForm(item) {
    return this._fb.group({
      selectedChallan: [false],
      challanNumber: [item.id || '', Validators.required]
    });
  }


  onChallanSelected(ele) {
    if (ele.target.checked) {
      const challanItem = this.getItemById(ele.target.value, this.challanList);
      challanItem.total_amount = challanItem.amount;
      this.selectedChallans.push(challanItem);
      if (this.isAdd) {
        this.count++;
        this.allSelected();
      }
    }
    else {
      this.removeFromSelectedChallans(ele.target.value);
      if (this.isAdd) {
        this.allSelected();
      }
    }
  }

  // removeFromSelectedChallans(challanNumber) {
  //   this.selectedChallans = this.selectedChallans.filter((challan) => challan.challan? challan.challan !== challanNumber :challan.id !== challanNumber);
  //   this.alreadySelectedChallans = this.alreadySelectedChallans.filter((challan) => challan.challan? challan.challan !== challanNumber :challan.id !== challanNumber);
  // }

  removeFromSelectedChallans(challanNumber) {
    if (this.isAdd) {
      this.count--;
    }
    this.selectedChallans = this.selectedChallans.filter((challan) => challan.id ? challan.id !== challanNumber : challan.id !== challanNumber);
    this.alreadySelectedChallans = this.alreadySelectedChallans.filter((challan) => challan.id ? challan.id !== challanNumber : challan.id !== challanNumber);
  }


  selectChallans() {
    this.onAddChallanClicked.emit(this.selectedChallans);
    this.showModal = !this.showModal;
    this._popupBodyScrollService.popupHide();
  }

  manageChallan() {
    let result = [];
    this._popupBodyScrollService.popupHide()

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
    this.onAddChallanClicked.emit(Object.values(hash));
    this.showModal = !this.showModal;
  }

  getItemById(id: String, list: []): any {
    return list.filter((item: any) => item.id === id)[0];
  }

  mapSelectedChallans() {
    this._popupBodyScrollService.popupActive();
    if (this.isAdd) {
      this.search = '';
      this.challanList = this.defaultchallanList;
      this.allSelected();
      this.reAsignFormValues();
      this.copyOfCount = 0;
    }
    if (this.challanList.length != 0) {
      this.showModal = !this.showModal;
      const challans = this.challanListForm.controls['challans'] as UntypedFormArray;
      challans.controls.forEach((challan) => {
        const existingChallans = this.alreadySelectedChallans.filter((exsitingChallan) => exsitingChallan.id ? exsitingChallan.id === challan.get('challanNumber').value : exsitingChallan.unpaid_fuel_challan ===challan.get('challanNumber').value);
        if (existingChallans.length > 0) {
          challan.get('selectedChallan').setValue(true);
          this.copyOfCount++;
          this.count = this.copyOfCount;
        }
      });
      if (this.copyOfCount == this.challanList.length) {
        this.challanListForm.patchValue({ "selectedAll": true });
      } else {
        this.challanListForm.patchValue({ "selectedAll": false });
      }
    }
  }

  filterApplied(result) {
    if (this.isAdd) {
      this.defaultSelectedAll();
    }
    this.challanList = result.filtedData;
    this.showFilter = !this.showFilter;
    this.isFilterApplied=result.isFilterApplied;
  }
  selectAllChalan() {
    this.selectedChallans = [];
    let isAllSelected = this.challanListForm.controls.selectedAll.value;
    if (isAllSelected) {
      for (const Item of this.challanList) {
        this.selectAllAndClick(Item.id)
      }
      this.count = this.challanList.length;
      this.checkuncheckAll("check");
    } else {
      this.count = 0;
      for (const Item of this.challanList) {
        this.removeFromSelectedChallans(Item.id);
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
  checkuncheckAll(type) {
    this.count = 0;
    const challans = this.challanListForm.controls['challans'] as UntypedFormArray;
    let array = [];
    this.reAsignFormValues();
    for (let index = 0; index < this.challanList.length; index++) {
      array.push(this.challanList[index].id)
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
  selectAllAndClick(ele) {
    if (ele) {
      const challanItem = this.getItemById(ele, this.challanList);
      challanItem.total_amount = challanItem.amount;
      this.selectedChallans.push(challanItem);
    }
  }
  reAsignFormValues() {
    const challans = this.challanListForm.controls['challans'] as UntypedFormArray;
    for (let index = 0; index < this.defaultchallanList.length; index++) {
      challans.controls[index].patchValue({ "challanNumber": this.defaultchallanList[index].id });
    }
  }
  defaultSelectedAll() {
    this.count = 0;
    this.challanListForm.patchValue({ "selectedAll": false });
    for (const Item of this.challanList) {
      this.removeFromSelectedChallans(Item.id);
    }
    this.checkuncheckAll("uncheck")

  }
  searchitem() {
    if (!this.search) {
      this.challanList = this.defaultchallanList;
    } else {
      if (this.isAdd) {
        this.defaultSelectedAll();
      }
      this.challanList = this.defaultchallanList.filter(it => {
        const date = it.date.toLowerCase().includes(this.search.toLowerCase());
        const vehicle_no = it.vehicle.reg_number.toLowerCase().includes(this.search.toLowerCase());
        const document_no = it.document_no? it.document_no.toString().toLowerCase().includes(this.search.toLowerCase()):false;
        return (date || vehicle_no|| document_no);
      });
    }
  }
  close() {
    this.showModal = this.showModal ? false : true;
    this._popupBodyScrollService.popupHide();
    if (this.isAdd) {
      this.alreadySelectedChallans = this.copyOFAlreadySelectedChallans;
      this.challanList = this.defaultchallanList;
    }
  }

}
