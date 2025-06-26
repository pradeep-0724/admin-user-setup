import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormArray, Validators } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { RateCardBillingBasedOn } from 'src/app/core/constants/constant';

@Component({
  selector: 'app-crane-trip-challan',
  templateUrl: './crane-trip-challan.component.html',
  styleUrls: ['./crane-trip-challan.component.scss']
})
export class CraneTripChallanComponent implements OnInit {
  search: any;
  timeSheetListForm: UntypedFormGroup;
  timeSheetList = [];
  defaultTimeSheetList:any=[];
  allData: any = [];
  showFilter: boolean = false;
  isTPEmpty: boolean = false;
  isFilterApplied =false;
  timeSheetSelectedList=[];
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
      },
      {
        title: 'Vehicle',
        key: 'vehicle_no',
        type: 'unique'
      },
    ]
  };
 rateCardBilling = new RateCardBillingBasedOn();
 rateCardBillingList = this.rateCardBilling.RateCardbillingUnitsList
 isSameBillingType = true;
  constructor(
   private dialogRef: DialogRef<any>, @Inject(DIALOG_DATA)  private data: any,
    private _fb: UntypedFormBuilder,
  ) {}

  ngOnInit() {
    this.dialogRef
    this.buildForm();
    this.buildTimeSheets(this.data.timeSheetList  )
    this.timeSheetSelectedList = this.data.timeSheetSelectedList
    if (this.timeSheetSelectedList.length) {
      this.markSelectedTimeSheet()
    }
  
  }

  buildForm() {
    this.timeSheetListForm = this._fb.group({
      selectedAll: [false],
      time_sheets: this._fb.array([])
    });
  }

  

  resetChallans() {
    const time_sheets = this.timeSheetListForm.controls['time_sheets'] as UntypedFormArray;
    time_sheets.controls = [];
    this.timeSheetList = [];
    this.allData = [];
  }


  buildTimeSheets(items: any = []) {
    const time_sheets = this.timeSheetListForm.controls['time_sheets'] as UntypedFormArray;
    items.forEach((item) => {
      time_sheets.push(this.addChallanForm(item));
        this.timeSheetList.push(item);
        this.allData.push(item);
    });
    this.defaultTimeSheetList =this.timeSheetList;
  }

  addChallanForm(item) {
    return this._fb.group({
      selectedTimeSheet: [false],
      timesheet_id: [item.timesheet_id || '', Validators.required]
    });
  }




  onTimeSheetSelection(){
    const time_sheets = this.timeSheetListForm.controls['time_sheets'] as UntypedFormArray;
    const allSelected= time_sheets.value.every(item => item.selectedTimeSheet === true)
    this.timeSheetListForm.controls.selectedAll.setValue(allSelected)
    this.isSameBillingType=true;
  }

  markSelectedTimeSheet(){
    const time_sheets = this.timeSheetListForm.controls['time_sheets'] as UntypedFormArray;
    time_sheets.controls.forEach(form => {
      if (this.timeSheetSelectedList.find(sheet => sheet.timesheet_id == form.get('timesheet_id').value)) {
        form.get('selectedTimeSheet').setValue(true)
      }
    });
    const allSelected = time_sheets.value.every(item => item.selectedTimeSheet === true)
    this.timeSheetListForm.controls.selectedAll.setValue(allSelected)
  }


  filterApplied(result) {
    this.timeSheetList = result.filtedData;
    this.showFilter = !this.showFilter;
    this.isFilterApplied=result.isFilterApplied;
  }


  selectAllTimeSheet() {
    let isAllSelected = this.timeSheetListForm.controls.selectedAll.value;
    const time_sheets = this.timeSheetListForm.controls['time_sheets'] as UntypedFormArray;
    time_sheets.controls.forEach(form=>{
      form.get('selectedTimeSheet').setValue(isAllSelected)
    });
    this.isSameBillingType=true;
  }

  searchitem() {
    if (!this.search) {
      this.timeSheetList = this.defaultTimeSheetList;
    } else {
      this.timeSheetList = this.defaultTimeSheetList.filter(it => {
        const work_order_no =it.work_order_no? it.work_order_no.toLowerCase().includes(this.search.toLowerCase()):false;
        const location =it.location? it.location.toLowerCase().includes(this.search.toLowerCase()):false;
        const trip_id =it.trip_id? it.trip_id.toLowerCase().includes(this.search.toLowerCase()):false;
        const date =it.date? it.date.toLowerCase().includes(this.search.toLowerCase()):false;
        const vehicle_no =it.vehicle_no?it.vehicle_no.toLowerCase().includes(this.search.toLowerCase()):false;
        return (work_order_no || location || trip_id || vehicle_no||date);
      });
    }
  }

  selectedTimeSheets(){
    let selectedTimeSheet=[];
    const time_sheets = this.timeSheetListForm.controls['time_sheets'] as UntypedFormArray;
    time_sheets.controls.forEach(form=>{
      if(form.get('selectedTimeSheet').value){
      selectedTimeSheet.push(this.timeSheetList.find(timeSheet=>timeSheet.timesheet_id==form.get('timesheet_id').value) )
      }
    });
  if(selectedTimeSheet.length==0){
    return  this.dialogRef.close(selectedTimeSheet)
  }
   this.isSameBillingType = selectedTimeSheet.every((val, i, arr) => val.billing_unit === arr[0].billing_unit);
   if(this.isSameBillingType){
     this.dialogRef.close(selectedTimeSheet)
   }
  }

  getBillingType(type){
    if(!type) return '-'
   return this.rateCardBillingList.find(billType=>billType.value==type).label
  }

  close(){
    this.dialogRef.close('close')
  }
}
