import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { TerminologiesService } from 'src/app/core/services/terminologies.service';
import { RevenueService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/revenue-service/revenue.service';

@Component({
  selector: 'app-trip-expense-challan',
  templateUrl: './trip-expense-challan.component.html',
  styleUrls: ['./trip-expense-challan.component.scss']
})
export class TripExpenseChallanComponent implements OnInit {
  terminology :any;
  search: any;
  challanListForm: UntypedFormGroup;
  challanList: any = [];
  defaultchallanList:any=[];
  showModal: Boolean = false; 
  selectedChallans: any = [];
  isFilterApplied =false;

  @Input()  isAdd:boolean;
  @Output() onAddChallanClicked = new EventEmitter<any>();
  @Output() onAddChallanClickedAdvanceAmount = new EventEmitter<any>();
  @Output() checkChallanExist = new EventEmitter<any>();
  @Input() alreadySelectedTripChallans = [];
  @Input() inlineAdd: Boolean = false;
  @Input() challanErrorMessage: string = '';
  @Input() tripId :string = '';
  copyOFAlreadySelectedChallans=[];
  subscription: Subscription;
  allData: any = [];
  showFilter: boolean = false;
  count :number=0;
  copyOfCount:number=0;
  options: any = {
    columns: [
      {
        title: 'Work Order No.',
        key: 'work_order_no',
        type: 'unique'
      },
      {
        title: 'Bilty Number',
        key: 'builty_no',
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
      {
        title: 'Expense type',
        key: 'expense_type',
        type: 'unique'
      },
      
    ]
  };
  currency_type:any;

  constructor(
    private _terminologiesService:TerminologiesService,
    private _fb: UntypedFormBuilder,
    private _revenueServices: RevenueService,
    private currency: CurrencyService
  ) {}

  ngOnInit() {
    this.currency_type = this.currency.getCurrency();
    this.terminology = this._terminologiesService.terminologie;
    this.buildForm();
    this.subscription = this._revenueServices.getPartyId().subscribe(resp => {
      this.checkChallanExist.emit(false);
      const partyId = resp["partyId"];
      this._revenueServices.getTripExpenseListByParty(partyId).subscribe((response) => {
        this.resetChallans();
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


  buildChallans(items: any = []) {
    const challans = this.challanListForm.controls['challans'] as UntypedFormArray;
    items.forEach((groupedChallan) => {
      if(this.tripId !==groupedChallan.trip){
        challans.push(this.addChallanForm(groupedChallan));
        this.challanList.push(groupedChallan);
        this.allData.push(groupedChallan);
      }
    });
    this.alreadySelectedTripChallans.forEach((groupedChallan) => {
      challans.push(this.addChallanForm(groupedChallan));
      this.challanList.push(groupedChallan);
      this.allData.push(groupedChallan);
    });
    this.defaultchallanList =this.challanList;
  }


  addChallanForm(item) {
    return this._fb.group({
      selectedChallan: [false],
      challanNumber: [item.tripcharge || '', Validators.required]
    });
  }


  onChallanSelected(ele) {
    if (ele.target.checked) {
      let challanItem = this.getItemById(ele.target.value, this.challanList);
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
    this.selectedChallans = this.selectedChallans.filter((challan) => challan.tripcharge ? challan.tripcharge !== challanNumber : challan.tripcharge !== challanNumber);
    this.alreadySelectedTripChallans = this.alreadySelectedTripChallans.filter((challan) => challan.tripcharge ? challan.tripcharge !== challanNumber : challan.tripcharge !== challanNumber);
  }

 

  selectChallans() {
    this.onAddChallanClicked.emit(this.selectedChallans);
    this.showModal = !this.showModal;
  }

  manageChallan() {
    let result = [];

    for (let k = 0; k < this.alreadySelectedTripChallans.length; k++) {
      this.selectedChallans.push(this.alreadySelectedTripChallans[k]);
    }
    let hash = {};
    for (let i = 0; i < this.selectedChallans.length; i++) {
      if (hash.hasOwnProperty(this.selectedChallans[i].tripcharge)) {
        result.push(this.selectedChallans[i]);
      }
      else {
        hash[this.selectedChallans[i].tripcharge] = this.selectedChallans[i];
      }
    }
    this.onAddChallanClicked.emit(Object.values(hash));
    this.showModal = !this.showModal;
  }

  getItemById(id: String, list: []): any {
    return list.filter((item: any) => item.tripcharge === id)[0];
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
                    exsitingChallan.tripcharge ? exsitingChallan.tripcharge === challan.get('challanNumber').value :
                    exsitingChallan.tripcharge === challan.get('challanNumber').value);
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
        this.removeFromSelectedChallans(Item.tripcharge);
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
      this.removeFromSelectedChallans(Item.tripcharge);
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
        const work_order_no = it.work_order_no.toLowerCase().includes(this.search.toLowerCase());
        const builty_no = it.builty_no.toLowerCase().includes(this.search.toLowerCase());
        const from_loc = it.from_loc.toLowerCase().includes(this.search.toLowerCase());
        const to_loc = it.to_loc.toLowerCase().includes(this.search.toLowerCase());
        const vehicle = it.vehicle.toLowerCase().includes(this.search.toLowerCase());
        const expense_type = it.expense_type.toLowerCase().includes(this.search.toLowerCase());
        return ( work_order_no || to_loc || vehicle||from_loc||builty_no || expense_type);
      });
    }
  }
  close(){
     this.showModal = this.showModal ?false:true;
     if(this.isAdd){
       this.alreadySelectedTripChallans=this.copyOFAlreadySelectedChallans;
       this.challanList =this.defaultchallanList;
     }
  }
  reAsignFormValues(){
    const challans = this.challanListForm.controls['challans'] as UntypedFormArray;
    for (let index = 0; index < this.defaultchallanList.length; index++) {
      challans.controls[index].patchValue({ "challanNumber": this.defaultchallanList[index].tripcharge });
    }
  }

}
