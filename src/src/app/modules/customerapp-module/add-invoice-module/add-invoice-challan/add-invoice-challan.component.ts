import { CreditService } from '../../api-services/revenue-module-service/credit-note-service/credit-note.service';
import { RevenueService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/revenue-service/revenue.service';
import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormArray, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { checkEmptyDataKey } from '../../../../shared-module/utilities/helper-utils';
import { TerminologiesService } from 'src/app/core/services/terminologies.service';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';

@Component({
  selector: 'app-add-invoice-challan',
  templateUrl: './add-invoice-challan.component.html',
  styleUrls: ['./add-invoice-challan.component.scss']
})
export class AddInvoiceChallanComponent implements OnInit, OnDestroy {
  terminology :any;
  search: any;
  challanListForm: UntypedFormGroup;
  challanList: any = [];
  showModal: Boolean = false;
  selectedChallans: any = [];
  @Output() onAddChallanClicked = new EventEmitter<any>();
  @Output() onAddChallanClickedAdvanceAmount = new EventEmitter<any>();
  @Output() checkChallanExist = new EventEmitter<any>();
  @Input() alreadySelectedChallans = [];
  @Input() inlineAdd: Boolean = false;
  @Input() challanErrorMessage: string = '';
  subscription: Subscription;
  allData: any = [];
  showFilter: boolean = false;
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
    private _creditService: CreditService, private _popupBodyScrollService:popupOverflowService
  ) {
    this.subscription = this._revenueServices.getInvoiceNumber().subscribe(resp => {
      this.checkChallanExist.emit(false);
      if (resp.invoice_number) {
        const invoice_id = resp['invoice_number'];
        this.resetChallans();
        this._creditService.getInvoiceChallanList(invoice_id).subscribe((response) => {
          this.buildChallans(response.result);
          this.challanErrorMessage = ''
          if (this.challanList.length > 0){
            this.checkChallanExist.emit(true);
          }
        });
      } else {
        this.challanList = [];
      }
    });
  }


  ngOnInit() {
    this.buildForm();
    this.terminology = this._terminologiesService.terminologie;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  buildForm() {
    this.challanListForm = this._fb.group({
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
        value: groupedCollection[trip_id] }));
    }

  buildChallans(items: any = []) {
    const challans = this.challanListForm.controls['challans'] as UntypedFormArray;
    this.isTPEmpty = checkEmptyDataKey(items, "transporter_permit_no")
    let groupedChallans = this.groupChallans(items, "trip_id")
    groupedChallans.forEach((groupedChallan) => {
      challans.push(this.addChallanForm(groupedChallan));
      this.challanList.push(groupedChallan);
      this.allData.push(groupedChallan);
    });
  }

  addChallanForm(item) {
    return this._fb.group({
      selectedChallan: [false],
      challanNumber: [item.challan_no || '', Validators.required]
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
    }
    else {
      this.removeFromSelectedChallans(ele.target.value);
    }
  }

  removeFromSelectedChallans(challanNumber) {
    this.selectedChallans = this.selectedChallans.filter((challan) => challan.challan_no ? challan.challan_no !== challanNumber : challan.challan_no !== challanNumber);
    this.alreadySelectedChallans = this.alreadySelectedChallans.filter((challan) => challan.challan_no ? challan.challan_no !== challanNumber : challan.challan_no !== challanNumber);
  }

  calculateAdvanceAmount(items: any){
    let advance_amount = 0
    const challans = this.groupChallans(items, "trip_d");
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
    return list.filter((item: any) => item.challan_no === id)[0];
  }

  mapSelectedChallans() {
      this.isTPEmpty = checkEmptyDataKey(this.alreadySelectedChallans, "transporter_permit_no")
      let grouped_challans = this.groupChallans(this.alreadySelectedChallans, "trip_id");
      if (this.challanList.length != 0) {
        this.showModal = !this.showModal;
        const challans = this.challanListForm.controls['challans'] as UntypedFormArray;
        challans.controls.forEach((challan) => {
          const existingChallans = grouped_challans.filter((exsitingChallan) =>
          exsitingChallan.challan_no ? exsitingChallan.challan_no === challan.get('challanNumber').value :
          exsitingChallan.challan_no === challan.get('challanNumber').value);
          if (existingChallans.length > 0) {
            challan.get('selectedChallan').setValue(true);
          }
        });
      }
    }

  filterApplied(result) {
    this.challanList = result.filtedData;
    this.showFilter = !this.showFilter;
  }

}
