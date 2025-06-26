import { RevenueService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/revenue-service/revenue.service';
import { Component, OnInit, Output, EventEmitter, Input, OnDestroy, OnChanges } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormArray, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { checkEmptyDataKey } from '../../../../../shared-module/utilities/helper-utils';
import moment from 'moment';

@Component({
  selector: 'add-fleetowner-challan',
  templateUrl: './add-fleetowner-challan.component.html',
  styleUrls: ['./add-fleetowner-challan.component.scss']
})
export class AddFleetownerChallanComponent implements OnInit, OnDestroy, OnChanges {
  search: any;
  challanListForm: UntypedFormGroup;
  challanList: any = [];
  showModal: Boolean = false;
  selectedChallans: any = [];
  @Output() onAddChallanClicked = new EventEmitter<any>();
  @Output() onAddChallanClickedAdvanceAmount = new EventEmitter<any>();
  @Input() alreadySelectedChallans = [];
  @Input() inlineAdd: Boolean = false;
  @Input() challanErrorMessage: string = '';
  subscription: Subscription;
  allData: any = [];
  showFilter: boolean = false;
  count: number = 0;
  defaultchallanList: any = [];
  copyOFAlreadySelectedChallans: any = [];
  copyOfCount: number = 0;
  @Input() isAdd: boolean;
  isTPEmpty: boolean = false;

  options: any = {
    columns: [
      {
        title: 'Vehicle',
        key: 'reg_number',
        type: 'unique'
      },
      {
        title: 'Consignor',
        key: 'consignor',
        type: 'unique'
      },
      {
        title: 'Consignee',
        key: 'consignee',
        type: 'unique'
      },
      {
        title: 'Challan Date',
        key: 'tp_date',
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
    private _fb: UntypedFormBuilder,
    private _revenueServices: RevenueService,
  ) { }

  ngOnInit() {
    this.buildForm();
    this.subscription = this._revenueServices.getPartyId().subscribe(resp => {
      const partyId = resp["partyId"];
      this.resetChallans();
      this._revenueServices.getFleetOwnerChallans(partyId).subscribe((response: any) => {
        this.buildChallans(response.result);
        this.challanErrorMessage = ''
      });
    });
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
    if (!collection) {
      return null;
    }
    const groupedCollection = collection.reduce((previous, current) => {
      if (!previous[current[property]]) {
        previous[current[property]] = [current];
      } else {
        previous[current[property]].push(current);
      }

      return previous;
    }, {});
    // this will return an array of objects, each object containing a group of objects
    return Object.keys(groupedCollection).map(vehicle_provider => ({
      vehicle_provider: vehicle_provider,
      tp_number: groupedCollection[vehicle_provider][0]['tp_number'],
      transporter_permit_no: groupedCollection[vehicle_provider][0]['transporter_permit_no'],
      reg_number: groupedCollection[vehicle_provider][0]['reg_number'],
      vendor_advance: groupedCollection[vehicle_provider][0]['vendor_advance'],
      tp_date: groupedCollection[vehicle_provider][0]['tp_date'],
      consignee: groupedCollection[vehicle_provider][0]['consignee'],
      consignor: groupedCollection[vehicle_provider][0]['consignor'],
      value: groupedCollection[vehicle_provider]
    }));
  }

  buildChallans(items: any = []) {
    this.allData = [];
    const challans = this.challanListForm.controls['challans'] as UntypedFormArray;
    this.isTPEmpty = checkEmptyDataKey(items, "transporter_permit_no")
    let groupedChallans = this.groupChallans(items, "vehicle_provider")
    let groupedAlreadySelected = this.groupChallans(this.alreadySelectedChallans, "vehicle_provider");
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
    this.defaultchallanList = this.challanList;
  }

  addChallanForm(item) {
    return this._fb.group({
      selectedChallan: [false],
      challanNumber: [item.vehicle_provider || '', Validators.required]
    });
  }

  unGroupChallans(challanItem) {
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
    this.count--;
    this.selectedChallans = this.selectedChallans.filter((challan) => challan.vehicle_provider ? challan.vehicle_provider !== challanNumber : challan.vehicle_provider !== challanNumber);
    this.alreadySelectedChallans = this.alreadySelectedChallans.filter((challan) => challan.vehicle_provider ? challan.vehicle_provider !== challanNumber : challan.vehicle_provider !== challanNumber);
  }

  calculateAdvanceAmount(items: any) {
    let vendor_advance = 0
    const challans = this.groupChallans(items, "vehicle_provider");
    challans.forEach((challan) => {
      vendor_advance += challan.vendor_advance;
    });
    return vendor_advance
  }

  selectChallans() {
    let advance_amount = this.calculateAdvanceAmount(this.selectedChallans);
    this.onAddChallanClicked.emit(this.selectedChallans);
    this.onAddChallanClickedAdvanceAmount.emit(advance_amount);
    this.showModal = !this.showModal;
  }

  manageChallan() {
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
    return list.filter((item: any) => item.vehicle_provider === id)[0];
  }

  mapSelectedChallans() {
    if (this.isAdd) {
      this.search = '';
      this.challanList = this.defaultchallanList;
      this.allSelected();
      this.reAsignFormValues();
      this.copyOfCount = 0;
    }

    this.isTPEmpty = checkEmptyDataKey(this.alreadySelectedChallans, "transporter_permit_no")
    let grouped_challans = this.groupChallans(this.alreadySelectedChallans, "vehicle_provider");
    if (this.isAdd) {
      this.count = grouped_challans.length;
    }
    if (this.challanList.length != 0) {
      this.showModal = !this.showModal;
      const challans = this.challanListForm.controls['challans'] as UntypedFormArray;
      challans.controls.forEach((challan) => {
        const existingChallans = grouped_challans.filter((exsitingChallan) => exsitingChallan.vehicle_provider ? exsitingChallan.vehicle_provider === challan.get('challanNumber').value : exsitingChallan.vehicle_provider === challan.get('challanNumber').value);
        if (existingChallans.length > 0) {
          challan.get('selectedChallan').setValue(true);
          this.copyOfCount++;
        }
      });
      if (this.isAdd) {
        if (this.copyOfCount == this.challanList.length) {
          this.challanListForm.patchValue({ "selectedAll": true });
        } else {
          this.challanListForm.patchValue({ "selectedAll": false });
        }
      }
    }
  }
  filterApplied(result) {
    if (this.isAdd) {
      this.defaultSelectedAll();
    }
    this.challanList = result.filtedData;
    this.showFilter = !this.showFilter;
  }
  selectAllChalan() {
    this.selectedChallans = [];
    let isAllSelected = this.challanListForm.controls.selectedAll.value;
    if (isAllSelected) {
      for (const Item of this.challanList) {
        this.selectAllAndClick(Item.vehicle_provider)
      }
      this.count = this.challanList.length;
      this.checkuncheckAll("check");
    } else {
      this.count = 0;
      for (const Item of this.challanList) {
        this.removeFromSelectedChallans(Item.vehicle_provider);
      }
      this.checkuncheckAll("uncheck");
    }
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
  checkuncheckAll(type) {
    this.count = 0;
    const challans = this.challanListForm.controls['challans'] as UntypedFormArray;
    let array = [];
    for (let index = 0; index < this.challanList.length; index++) {
      array.push(this.challanList[index].vehicle_provider)
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
      this.removeFromSelectedChallans(Item.vehicle_provider);
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
        const challan_no = it.tp_number.toLowerCase().includes(this.search.toLowerCase());
        const consignee = it.consignee.toLowerCase().includes(this.search.toLowerCase());
        const consigner = it.consignor.toLowerCase().includes(this.search.toLowerCase());
        const vehicle_no = it.reg_number.toLowerCase().includes(this.search.toLowerCase());
        return (challan_no || consignee || consigner || vehicle_no);
      });
    }
  }
  close() {
    this.showModal = this.showModal ? false : true;
    if (this.isAdd) {
      this.alreadySelectedChallans = this.copyOFAlreadySelectedChallans;
      this.challanList = this.defaultchallanList;
    }
  }
  reAsignFormValues() {
    const challans = this.challanListForm.controls['challans'] as UntypedFormArray;
    for (let index = 0; index < this.defaultchallanList.length; index++) {
      challans.controls[index].patchValue({ "challanNumber": this.defaultchallanList[index].vehicle_provider });
    }
  }
  changeDtaetoDDMMYYYY(date){
    return moment(date).format('DD-MM-YYYY')
  }
}
