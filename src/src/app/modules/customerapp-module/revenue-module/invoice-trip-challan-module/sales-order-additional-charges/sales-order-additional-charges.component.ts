import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-sales-order-additional-charges',
  templateUrl: './sales-order-additional-charges.component.html',
  styleUrls: ['./sales-order-additional-charges.component.scss']
})
export class SalesOrderAdditionalChargesComponent implements OnInit {
  search: any;
  additionalChargesListForm: UntypedFormGroup;
  additionalChargesList = [];
  defaultAdditionalChargeList: any = [];
  selectedChargeList = [];
  allData: any = [];
  showFilter: boolean = false;
  isFilterApplied = false;
  options: any = {
    columns: [
      {
        title: 'SO NO.',
        key: 'workorder_no',
        type: 'unique'
      },
      {
        title: 'Location',
        key: 'location',
        type: 'unique'
      }
    ]
  };
  typeOfCategory : string = '';

  constructor(
    private dialogRef: DialogRef<any>, @Inject(DIALOG_DATA) private data: any,
    private _fb: UntypedFormBuilder,
  ) { }

  ngOnInit() {
    this.dialogRef
    this.buildForm();
    this.typeOfCategory = this.data?.type
    this.buildAdditionalCharges(this.data.additionalChargesList)
    this.selectedChargeList = this.data.chargesSelectedList
    if (this.selectedChargeList.length) {
      this.markSelectedCharges()
    }
  }

  buildForm() {
    this.additionalChargesListForm = this._fb.group({
      selectedAll: [false],
      additional_charges: this._fb.array([])
    });
  }



  resetChallans() {
    const additional_charges = this.additionalChargesListForm.controls['additional_charges'] as UntypedFormArray;
    additional_charges.controls = [];
    this.additionalChargesList = [];
    this.allData = [];
  }


  buildAdditionalCharges(items: any = []) {
    const additional_charges = this.additionalChargesListForm.controls['additional_charges'] as UntypedFormArray;
    items.forEach((item) => {
      additional_charges.push(this.addAdditionalChargesForm(item));
      this.additionalChargesList.push(item);
      this.allData.push(item);
    });
    this.defaultAdditionalChargeList = this.additionalChargesList;
  }

  addAdditionalChargesForm(item) {
    return this._fb.group({
      selectedAdditionalCharge: [false],
      charge_id: [item.charge_id || '', Validators.required]
    });
  }

  markSelectedCharges() {
    const additional_charges = this.additionalChargesListForm.controls['additional_charges'] as UntypedFormArray;
    additional_charges.controls.forEach(form => {
      if (this.selectedChargeList.find(charge => charge.charge_id == form.get('charge_id').value)) {
        form.get('selectedAdditionalCharge').setValue(true)
      }
    });
    const allSelected = additional_charges.value.every(item => item.selectedAdditionalCharge === true)
    this.additionalChargesListForm.controls.selectedAll.setValue(allSelected)
  }




  onSelectionAdditionalCharge() {
    const additional_charges = this.additionalChargesListForm.controls['additional_charges'] as UntypedFormArray;
    const allSelected = additional_charges.value.every(item => item.selectedAdditionalCharge === true)
    this.additionalChargesListForm.controls.selectedAll.setValue(allSelected)
  }


  filterApplied(result) {
    this.additionalChargesList = result.filtedData;
    this.showFilter = !this.showFilter;
    this.isFilterApplied = result.isFilterApplied;
  }


  selectAllAdditionalCharge() {
    let isAllSelected = this.additionalChargesListForm.controls.selectedAll.value;
    const additional_charges = this.additionalChargesListForm.controls['additional_charges'] as UntypedFormArray;
    additional_charges.controls.forEach(form => {
      form.get('selectedAdditionalCharge').setValue(isAllSelected)
    });
  }

  searchitem() {
    if (!this.search) {
      this.additionalChargesList = this.defaultAdditionalChargeList;
    } else {
      this.additionalChargesList = this.defaultAdditionalChargeList.filter(it => {
        const work_order_no = it.work_order_no.toLowerCase().includes(this.search.toLowerCase());
        const location = it.location.toLowerCase().includes(this.search.toLowerCase());
        const date = it.date.toLowerCase().includes(this.search.toLowerCase());
        return (work_order_no || location || date);
      });
    }
  }

  selectedAdditionalCharge() {
    let selectedAdditionalCharge = [];
    const additional_charges = this.additionalChargesListForm.controls['additional_charges'] as UntypedFormArray;
    additional_charges.controls.forEach(form => {
      if (form.get('selectedAdditionalCharge').value) {
        selectedAdditionalCharge.push(this.additionalChargesList.find(charge => charge.charge_id == form.get('charge_id').value))
      }
    });
    this.dialogRef.close(selectedAdditionalCharge)
  }

  close() {
    this.dialogRef.close('close')
  }
}