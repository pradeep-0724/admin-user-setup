import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, UntypedFormArray, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { NewTripV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/trip-service/new-trip-v2.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { setAsTouched } from 'src/app/shared-module/utilities/form-utils';

@Component({
  selector: 'app-trip-details-make-delivery-note-popup',
  templateUrl: './trip-details-make-delivery-note-popup.component.html',
  styleUrls: ['./trip-details-make-delivery-note-popup.component.scss']
})
export class TripDetailsMakeDeliveryNotePopupComponent implements OnInit {

  makeInvoiceForm: FormGroup
  timeSheetList=[]
  chargeList=[];
  deductionsList=[]
  selectedIndex=1;
  isVehiclePayment : boolean = false;
  billingBasdedOn=''

  constructor(private formBuillder: FormBuilder, private dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) private dialogData: any, private _newTripV2Service: NewTripV2Service,private _commonservice:CommonService) { }

  ngOnInit(): void {
    this.isVehiclePayment = this.dialogData?.isVehiclePayment;
    this.billingBasdedOn = this.dialogData?.billingBasdedOn;
    this.buildForm();
    this.getAllData();
    if(!this.isVehiclePayment) this.getDeliveryNoteNumber();
  }

  buildForm() {
    this.makeInvoiceForm = this.formBuillder.group({
      trip_id: this.dialogData.tripId,
      date: [new Date(dateWithTimeZone())],
      number: ['',[Validators.required]],
      all_timesheet_select:false,
      all_charges_select:false,
      all_deductions_select:false,
      timesheets: this.formBuillder.array([]),
      charges:this.formBuillder.array([]),
      deductions:this.formBuillder.array([])

    })
  }

  cancel() {
    this.dialogRef.close('close')
  }

  getAllData() {
    if(this.isVehiclePayment){
      this._newTripV2Service.getApprovedTimeSheetsFrVP(this.dialogData.tripId).subscribe(resp => {
        this.timeSheetList=resp['result']
        this.buildTimeSheets(resp['result'])
      })
      this._newTripV2Service.getJobChargesFrVP(this.dialogData.tripId).subscribe(resp => {
        this.chargeList=resp['result']
        this.buildChargesDeduction(resp['result'],'charges')
      })
      this._newTripV2Service.getJobDeductionsFrVp(this.dialogData.tripId).subscribe(resp => {
        this.deductionsList=resp['result']
        this.buildChargesDeduction(resp['result'],'deductions')
      })
    }else{
      this._newTripV2Service.getApprovedTimeSheets(this.dialogData.tripId).subscribe(resp => {
        this.timeSheetList=resp['result']
        this.buildTimeSheets(resp['result'])
      })
      this._newTripV2Service.getJobCharges(this.dialogData.tripId).subscribe(resp => {
        this.chargeList=resp['result']
        this.buildChargesDeduction(resp['result'],'charges')
      })
      this._newTripV2Service.getJobDeductions(this.dialogData.tripId).subscribe(resp => {
        this.deductionsList=resp['result']
        this.buildChargesDeduction(resp['result'],'deductions')
      })
    }
  }

  buildTimeSheets(items = []) {
    let timeSheet = this.makeInvoiceForm.get('timesheets') as FormArray
    timeSheet.controls = [];
    items.forEach(item => {
      const form = this.getDefaultTimeSheet(item)
      timeSheet.push(form)
    })
  }

  getDefaultTimeSheet(item) {
    return this.formBuillder.group({
      timesheet_id:[item.timesheet_id],
      is_selected: false
    })
  }


  save(){
    let form = this.makeInvoiceForm
    let selectedChargeList=[];
    let selectedDeductionList=[];
    let selectedTimeSheetList=[];
    if(form.valid){
      form.value['charges'].forEach(item=>{
        if(item['selectedCharge']){
          selectedChargeList.push(this.chargeList.find(charge=>charge.charge_id==item['charge_id']) )
        }
      });
      form.value['deductions'].forEach(item=>{
        if(item['selectedCharge']){
          selectedDeductionList.push(this.deductionsList.find(deduction=>deduction.charge_id==item['charge_id']) )
        }
      });
      form.value['timesheets'].forEach(item=>{
        if(item['is_selected']){
          selectedTimeSheetList.push(this.timeSheetList.find(sheet=>sheet.timesheet_id==item['timesheet_id']) )
        }
      });
      let makeInvoiceData={
        selectedChargeList,
        selectedDeductionList,
        selectedTimeSheetList,
        invoiceNumber:form.value['number'],
        invoiceDate:changeDateToServerFormat(form.value['date'])
      } 
      this.dialogRef.close(makeInvoiceData)
     
    }else{
      setAsTouched(form)
    }
  
  }

  getDeliveryNoteNumber() {
    this._commonservice.getSuggestedIds('invoice').subscribe(resp => {
      this.makeInvoiceForm.get('number').setValue(resp.result['invoice'])
    })
  }

  onSelectionTimeSheet(){
    let timeSheet = this.makeInvoiceForm.get('timesheets') as FormArray
    const allSelected= timeSheet.value.every(item => item.is_selected === true)
    this.makeInvoiceForm.controls.all_timesheet_select.setValue(allSelected)
  }

  selectAllTimeSheet() {
    let isAllSelected = this.makeInvoiceForm.controls.all_timesheet_select.value;
    let timeSheet = this.makeInvoiceForm.get('timesheets') as FormArray
    timeSheet.controls.forEach(form=>{
      form.get('is_selected').setValue(isAllSelected)
    });
  }

  buildChargesDeduction(items: any = [],type) {
    const charges = this.makeInvoiceForm.controls[type] as UntypedFormArray;
    items.forEach((item) => {
      charges.push(this.addChargesDeductionForm(item));
    });
  }

  addChargesDeductionForm(item) {
    return this.formBuillder.group({
      selectedCharge: false,
      charge_id: [item.charge_id]
    });
  }




  onSelectionChargeOrDeduction(type){
    const charges = this.makeInvoiceForm.controls[type] as UntypedFormArray;
    const allSelected= charges.value.every(item => item.selectedCharge === true)
    if(type=='charges'){
      this.makeInvoiceForm.controls.all_charges_select.setValue(allSelected)
    }
    if(type=='deductions'){
      this.makeInvoiceForm.controls.all_deductions_select.setValue(allSelected)
    }

  }

  selectAllChargesDeductions(type) {
    let isAllSelected =false;
    if(type=='charges'){
      isAllSelected=this.makeInvoiceForm.controls.all_charges_select.value
    }
    if(type=='deductions'){
      isAllSelected=this.makeInvoiceForm.controls.all_deductions_select.value
    }
    let chargesDeduction = this.makeInvoiceForm.get(type) as FormArray
    chargesDeduction.controls.forEach(form=>{
      form.get('selectedCharge').setValue(isAllSelected)
    });
  }
  
  addErrorClass(controlName: AbstractControl) {
		return TransportValidator.addErrorClass(controlName);
	}
}


