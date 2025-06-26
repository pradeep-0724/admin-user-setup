import {  getBlankOption } from 'src/app/shared-module/utilities/helper-utils';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';

export class Inventory{
   private formObject = {
    date_of_purchase: "bill_date",
    bill_number: "bill_number",
    due_date: "due_date",
    reminder: "reminder",
    payment_status: ["payment_status","index"],
    amount_paid: "amount_paid",
    transaction_date: "transaction_date",
    bank_charges: "bank_charges",
    comments: "comments"
  };
 private  inventoryVariables={
  vendorList:[],
  paymentAccountList:[],
  staticOptions:{},
  gstin:{},
  vendorId: '',
  paymentStatusDisable:false,
  paymentModeRequired:false,
  bankingChargeRequired:true,
  addInventoryTotals:{
    balance:0,
  },
  unPaidOption: new ValidationConstants().unPaidOption,
  paidOption: new ValidationConstants().paidOption,
	partiallyPaidOption: new ValidationConstants().partiallyPaidOption,
  minDate: Date,
  companyRegistered:true,
  showAddPartyPopup: {name: '', status: false},
  initialValues: {
		paymentTerm: getBlankOption(),
		paymentMode: getBlankOption(),
		tax: [],
		paymentStatus: new ValidationConstants().unPaidOption,
		adjustmentAccount: getBlankOption(),
    vendor:{},
    partyNamePopup:'',
    vendorSelected:{},
    selectedPaymentTerm:{},
    BillDate:'',
    employee:getBlankOption(),
    po : getBlankOption()
  }

 }
 public getVariables(){
  return  this.inventoryVariables;
 }
 public getpatchForm(){
   return  this.formObject
 }

private subPaylaod={
  "adjustment":{
    type:"number",
    formcontrolName:"adjustment",
    payloadName:"adjustment",

  },
  "adjustment_account":{
    type:"string",
    formcontrolName:"adjustment_account",
    payloadName:"adjustment_account",

  },
  "adjustment_choice":{
    type:"number",
    formcontrolName:"adjustment_choice",
    payloadName:"adjustment_choice",

  },
  "discount":{
    type:"number",
    formcontrolName:"discount",
    payloadName:"discount",

  },
  "discount_after_tax":{
    type:"number",
    formcontrolName:"discount_after_tax",
    payloadName:"discount_after_tax",

  },
  "discount_after_tax_type":{
    type:"number",
    formcontrolName:"discount_after_tax_type",
    payloadName:"discount_after_tax_type",

  },

  "discount_type":{
    type:"number",
    formcontrolName:"discount_type",
    payloadName:"discount_type",

  },
"tds":{
  type:"number",
  formcontrolName:"tds",
  payloadName:"tds",

},
"tds_amount":{
  type:"number",
  formcontrolName:"tds_amount",
  payloadName:"tds_amount",

},
"tds_type":{
  type:"string",
  formcontrolName:"tds_type",
  payloadName:"tds_type",

},
"tyres":{
  formcontrolName: "tyres",
  payloadName: "tyres",
  type: "array"
},

"spares":{
  formcontrolName: "spares",
  payloadName: "spares",
  type: "array"
  }
}
private palylaodFormat=
  {"bill_date":{
  type:"date",
  formcontrolName:"date_of_purchase",
  payloadName:"bill_date",

},
"documents":{
  formcontrolName: "documents",
  payloadName: "documents",
  type: "array"
  },
"bill_number":{
  type:"string",
  formcontrolName:"bill_number",
  payloadName:"bill_number",

},
"vendor":{
  type:"string",
  formcontrolName:"vendor_name",
  payloadName:"vendor",

},
"employee":{
  type:"string",
  formcontrolName:"employee",
  payloadName:"employee",

},
"gst_treatment":{
  type:"string",
  formcontrolName:"gst_treatment",
  payloadName:"gst_treatment",

},
"place_of_supply":{
  type:"string",
  formcontrolName:"destination_of_supply",
  payloadName:"place_of_supply",

},
"payment_term":{
  type:"string",
  formcontrolName:"payment_term",
  payloadName:"payment_term",

},
"due_date":{
  type:"date",
  formcontrolName:"due_date",
  payloadName:"due_date",

},
"is_transaction_tax_inclusive":{
  type:"boolean",
  formcontrolName:"is_transaction_includes_tax",
  payloadName:"is_transaction_includes_tax",

},
"is_transaction_reverse_mechanism":{
  type:"boolean",
  formcontrolName:"is_transaction_under_reverse",
  payloadName:"is_transaction_under_reverse",

},
    "payment_status":{
      type:"number",
      formcontrolName:"payment_status",
      payloadName:"payment_status",

    },
    "amount_paid":{
      type:"number",
      formcontrolName:"amount_paid",
      payloadName:"amount_paid",

    },
    "payment_mode":{
      type:"string",
      formcontrolName:"payment_mode",
      payloadName:"payment_mode",

    },
    "transaction_date":{
      type:"date",
      formcontrolName:"transaction_date",
      payloadName:"transaction_date",

    },
    "bank_charges":{
      type:"number",
      formcontrolName:"bank_charges",
      payloadName:"bank_charges",

    },
    "reminder":{
      type:"date",
      formcontrolName:"reminder",
      payloadName:"reminder",

    },
    "comments":{
      type:"string",
      formcontrolName:"comments",
      payloadName:"comments",

    }}

  public  getPayload(form,subForm,is_draft,is_tyres,is_spares,sub_total_without_tax,gstn) {
      let payload={}
      let new_spare=[];
      let new_tyre=[];
      for (const key in this.palylaodFormat) {
        if (Object.prototype.hasOwnProperty.call(this.palylaodFormat, key)) {
          const item = this.palylaodFormat[key];
          let itemObject = item;
          for (const keyvalue in itemObject) {
            if (itemObject[keyvalue] === "string") {
               payload[itemObject['payloadName']]=form.value[itemObject['formcontrolName']] ? form.value[itemObject['formcontrolName']]:''
            }
            if (itemObject[keyvalue] === "number") {
              payload[itemObject['payloadName']]=Number(form.value[itemObject['formcontrolName']]) ?Number(form.value[itemObject['formcontrolName']]) :0
            }
            if (itemObject[keyvalue] === "date") {
                payload[itemObject['payloadName']]=changeDateToServerFormat(form.value[itemObject['formcontrolName']]) ?changeDateToServerFormat(form.value[itemObject['formcontrolName']]):null
            }
            if (itemObject[keyvalue] === "boolean") {
              payload[itemObject['payloadName']]=form.value[itemObject['formcontrolName']]?form.value[itemObject['formcontrolName']]:false
             }
             if (itemObject[keyvalue] === "array") {
              payload[itemObject['payloadName']]=form.value[itemObject['formcontrolName']] ? form.value[itemObject['formcontrolName']]:[]
             }
          }
        }
      }
      for (const key in this.subPaylaod) {
        if (Object.prototype.hasOwnProperty.call(this.subPaylaod, key)) {
          const item = this.subPaylaod[key];
          let itemObject = item;
          for (const keyvalue in itemObject) {
            if (itemObject[keyvalue] === "string") {
               payload[itemObject['payloadName']]=subForm.value[itemObject['formcontrolName']] ? subForm.value[itemObject['formcontrolName']]:''
            }
            if (itemObject[keyvalue] === "number") {
              payload[itemObject['payloadName']]=Number(subForm.value[itemObject['formcontrolName']]) ?Number(subForm.value[itemObject['formcontrolName']]) :0
            }

            if (itemObject[keyvalue] === "date") {
                payload[itemObject['payloadName']]=changeDateToServerFormat(subForm.value[itemObject['formcontrolName']]) ?changeDateToServerFormat(subForm.value[itemObject['formcontrolName']]):null
            }
            if (itemObject[keyvalue] === "boolean") {
              payload[itemObject['payloadName']]=subForm.value[itemObject['formcontrolName']]?subForm.value[itemObject['formcontrolName']]:false
             }
          }
        }
      }
        if(is_tyres){
          new_tyre=[];
          subForm.controls['new_tyre'].controls.forEach(item=>{
          new_tyre.push({
            "id": item.value['id'],
            "unique_no":item.value['unique_number'],
            "manufacturer":item.value['manufacturer'],
            "tyre_model":item.value['model'],
            "amount":Number(item.value['rate']),
            "total":Number(item.value['total']),
            "note":item.value['note'] ?item.value['note']:'',
            "thread_type":item.value['thread_type'],
            "tyre":item.value['tyre']?item.value['tyre']:null
           })
         })
          payload['hsn_code']=subForm.value["hsn_code"];
          payload['tax']=subForm.value["tax"];
          payload['tyres']=new_tyre;

      }else{
        payload['tyres']=new_tyre;
      }

      if(is_spares){
        new_spare=[];
        subForm.controls['new_spares'].controls.forEach(item=>{
          new_spare.push({
          "item":item.value['item_name'],
          "unit":item.value['quantity_type'],
          "quantity":Number(item.value['quantity']),
          "unit_cost":Number(item.value['unit_cost']),
          "total_before_tax":Number(item.value['amount']),
          "note":item.value['note'] ?item.value['note']:'',
          "tax": item.value['tax'],
          "hsn_code":item.value['hsn_code'] ? item.value['hsn_code']:0
      })
    })
    payload['spares']=new_spare;
    }else{
      payload['spares']=new_spare;
    }

      payload['is_draft']=is_draft;
      payload['is_tyres']=is_tyres;
      payload['is_spares']=is_spares;
      payload['gstn']=gstn;
      payload['sub_total_without_tax']=sub_total_without_tax;

     return payload;
    }

}




