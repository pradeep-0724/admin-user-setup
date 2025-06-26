import { DIALOG_DATA, DialogRef } from "@angular/cdk/dialog";
import { Component, Inject, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { TripsAddEditPopUp } from "../trip-details-v2.interface";
import { cloneDeep } from "lodash";
import { changeDateToServerFormat } from "src/app/shared-module/utilities/date-utilis";
import { NewTripV2Service } from "../../../../api-services/trip-module-services/trip-service/new-trip-v2.service";
import { NewTripV2Constants } from "../../new-trip-v2-constants/new-trip-v2-constants";
import { ToolTipInfo } from "../../new-trip-v2-utils/new-trip-v2-utils";
import { ApiHandlerService } from "src/app/core/services/api-handler.service";
type TabDataType = {
  isValid: boolean
  value: {
    amount: number
  }
}
@Component({
  selector: "app-charge-deduction",
  templateUrl: "./charge-deduction.component.html",
  styleUrls: ["./charge-deduction.component.scss"],
})
export class ChargeDeductionComponent implements OnInit {
  constructor(
    private dialogRef: DialogRef<boolean>,
    @Inject(DIALOG_DATA) private dialogData: TripsAddEditPopUp, private _newTripV2Service: NewTripV2Service,private apiHandler: ApiHandlerService
  ) { }
  isChargeAddValid = true;
  isChargeReduceValid = true;
  isChargeAddValidError = false;
  isChargeReduceValidError = false;
  chargeAddValidSubject: Subject<any> = new Subject();
  chargeReduceValidSubject: Subject<any> = new Subject();
  tripId = "";
  tripStratDate:string=''
  isAddExpenseInAddCharge = true;
  isAddExpenseInReduceCharge = true;
  isShowAddCharges:boolean=true;
  isShowReduceCharges:boolean=true;
  invoiceOrBill:string='';
  chargeAddData = {
    amount: 0
  }
  chargeReduceData = {
    amount: 0
  }

  chargesType = new NewTripV2Constants().chargesType;

  chargeAndDeductionType: string = '';
  editData:any={};
  isShowError= false;
  tripToolTip: ToolTipInfo;
  constantsTripV2 = new NewTripV2Constants()
  is_Driver_Added:boolean;
  is_Transporter:boolean;
  vehicleCategory ;
  customerId = '';
  snackBarMessageStr = '';
  ngOnInit(): void {
    this.tripId = this.dialogData.tripId;
    this.tripStratDate= this.dialogData.tripStartDate;
    this.is_Driver_Added=this.dialogData['is_Driver_Added'];
    this.is_Transporter=this.dialogData['is_Transporter'];
    this.vehicleCategory = this.dialogData['vehicle_category'];
    this.customerId = this.dialogData['customerId'];
    this.chargeAndDeductionType = this.dialogData.charge_deduction_type;
    if (this.chargeAndDeductionType == 'Client') {
      this.isAddExpenseInAddCharge = true;
      this.isAddExpenseInReduceCharge = false;
      this.invoiceOrBill="Invoice"
    }else{
      this.isAddExpenseInAddCharge = false;
      this.isAddExpenseInReduceCharge = true;
      this.invoiceOrBill="Bill"

    }
    if(this.dialogData.editdata){      
      this.editData = this.dialogData.editdata;      
    }else{
    
        this.editData['is_charge_editable_deletable']=true,
        this.editData['is_expense_editable_deletable']=true
      
    }
    if(this.dialogData.type=='Edit'){
      this.isShowAddCharges=false;
      this.isShowReduceCharges=false;
      this.snackBarMessageStr = '';      
      if(this.dialogData.bill_type== this.chargesType.party_add_bill_charges || this.dialogData.bill_type== this.chargesType.vp_add_bill_charges ){
        this.isShowAddCharges = true;
      }else{
        this.isShowReduceCharges=true;
        this.dialogData.bill_type == this.chargesType.party_reduce_bill_charges ? this.snackBarMessageStr = 'Deductions':this.snackBarMessageStr =  'Charges'
      }
      this.dialogData.bill_type == this.chargesType.vp_add_bill_charges || this.chargesType.party_add_bill_charges ? this.snackBarMessageStr = 'Charges': this.snackBarMessageStr = 'Deductions';
      this.dialogData.bill_type == this.chargesType.party_reduce_bill_charges || this.chargesType.vp_reduce_bill_charges ? this.snackBarMessageStr = 'Charges': this.snackBarMessageStr = 'Deductions';      
      
    }
    this.tripToolTip = {
      content: this.constantsTripV2.toolTipMessages.CHARGE_DEDUCTION.CONTENT
    }
  }

  cancel() {
    this.dialogRef.close(false);
  }

  save() {
    this.isChargeAddValidError =!this.isChargeAddValid;
    this.isChargeReduceValidError =!this.isChargeReduceValid;
    if (this.isChargeAddValid && this.isChargeReduceValid) {
      if (this.chargeAndDeductionType == 'Client') {
        this.clientRequest();
      } else {
        this.vehicleProviderRequest();
      }
    } else {
      this.chargeAddValidSubject.next(false);
      this.chargeReduceValidSubject.next(false);
    }

  }
  addChargeFormData(chargeAddForm: TabDataType) {    
    this.isChargeAddValid = chargeAddForm.isValid
    if(chargeAddForm.value['expense_payment_mode']==='paid_By_Driver'){
      chargeAddForm.value['expense_payment_mode']=null
    }
    this.chargeAddData = cloneDeep(chargeAddForm.value);
  }

  reduceChargeFormData(chargeReduceForm: TabDataType) {
    this.isChargeReduceValid = chargeReduceForm.isValid;
    if(chargeReduceForm.value['expense_payment_mode']==='paid_By_Driver'){
      chargeReduceForm.value['expense_payment_mode']=null
    }
    this.chargeReduceData = cloneDeep(chargeReduceForm.value);
  }

  clientRequest() {
    let payload = new Object();
    if (Number(this.chargeAddData.amount) > 0) {
      payload[this.chargesType.party_add_bill_charges] = this.changePlayLoadDateFormat(this.chargeAddData)
    }
    if (Number(this.chargeReduceData.amount) > 0) {
      payload[this.chargesType.party_reduce_bill_charges] = this.changePlayLoadDateFormat(this.chargeReduceData)
    }
    this.putAddReduceCharges(payload);
  }

  vehicleProviderRequest() {
    let payload = new Object();
    if (Number(this.chargeAddData.amount) > 0) {
      payload[this.chargesType.vp_add_bill_charges] = this.changePlayLoadDateFormat(this.chargeAddData)
    }
    if (Number(this.chargeReduceData.amount) > 0) {
      payload[this.chargesType.vp_reduce_bill_charges] = this.changePlayLoadDateFormat(this.chargeReduceData)
    }
    this.putAddReduceCharges(payload);
  }

  changePlayLoadDateFormat(chargeData) {
    chargeData['containers']=chargeData['containers'].map((container) => container?.id)
    chargeData['date'] = changeDateToServerFormat(chargeData['date']);
    chargeData['expense_bill_date'] = changeDateToServerFormat(chargeData['expense_bill_date'])
    return chargeData
  }

  putAddReduceCharges(payload) {
    if (Number(this.chargeAddData.amount) > 0 || Number(this.chargeReduceData.amount) > 0){
      let snackBarNotificationMessage = '';
      if(this.dialogData.type=='Add'){
        snackBarNotificationMessage = 'Charges and Deductions saved successfully!';
      }
      else{
        snackBarNotificationMessage = 'Charges and Deductions updated successfully!';
      }
      this.apiHandler.handleRequest(this._newTripV2Service.putAddandReduceInvoiceData(this.tripId, payload),snackBarNotificationMessage).subscribe(
        {
          next: () => {
            this.dialogRef.close(true);
          }
        }
      );
    }else{
      this.isShowError=true;
    }
   
  }

}
