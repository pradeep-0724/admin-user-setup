import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { InvoiceCustomFieldService } from '../invoice-custom-field.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';
import { CommonService } from 'src/app/core/services/common.service';
import { getBlankOption, isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { categoryOptions } from 'src/app/core/constants/constant';

@Component({
  selector: 'app-invoice-custom-field',
  templateUrl: './invoice-custom-field.component.html',
  styleUrls: ['./invoice-custom-field.component.scss'],
  host: {
    "(document:click)": "outSideClick($event)",
  },
})
export class InvoiceCustomFieldComponent implements OnInit {
  showOptions: string = "";
  popupOutputData: any;
  listIndexData = {};
  sortedData: any = [];
  isDisplay = false;
  isOpenDialog = false;
  InvoiceForm: UntypedFormGroup;
  popupInputData = {
    msg: "Are you sure, you want to delete?",
    type: "warning",
    show: false,
  };
  url = 'revenue/invoice/formfield/';
  editData = new BehaviorSubject([]);
  terminology: any;
  isFieldTypeChange :boolean=true;
  customFieldName = '';
  selectedCategory=''
  digitalSignature=[];
  categoryOptions=categoryOptions
  singantureLabel=getBlankOption();
  vehicleCategiriesObj = {
    hasMultipleCategories: false,
    categories: []
  };

  constructor(
    private _customField: InvoiceCustomFieldService,
    private _fb: UntypedFormBuilder,private apiHandler: ApiHandlerService,
    private _commonService:CommonService
  ) { }


  ngOnInit() {
    this.buildForm();
    this.getDigitalSignatureList();
    this._commonService.getVehicleCatagoryType().subscribe(resp => {
      this.vehicleCategiriesObj.hasMultipleCategories = resp['result']['has_multiple_categories']
      this.vehicleCategiriesObj.categories = resp['result']['categories']
      if (this.vehicleCategiriesObj.categories.includes(1)) {
        this.selectedCategory = 'crane'
        this.selectedTemplate(this.selectedCategory)
        return
      }
      if (this.vehicleCategiriesObj.categories.includes(2)) {
        this.selectedCategory = 'awp'
        this.selectedTemplate(this.selectedCategory)
        return
      }
      if (this.vehicleCategiriesObj.categories.includes(3) || this.vehicleCategiriesObj.categories.includes(0)) {
        this.selectedTemplate(this.selectedCategory)
        this.selectedCategory = 'cargo'
        return
      }
    })
  }

  buildForm() {
    this.InvoiceForm = this._fb.group({
      display: [false],
      signature:null,
      default_freight_term:'',
      default_additional_hour_term:'',
      invoice_list: this._fb.array([]),
    });
  }
  getDigitalSignatureList() {
		this._commonService.getDigitalSignatureList().subscribe(data => {
			this.digitalSignature = data['result']['data']
		})
	}

  getInvoiceForm(item) {
    return this._fb.group({
      id: [item.id || ""],
      field_label: [item.field_label || ""],
      field_type: [item.field_type || ""],
      mandatory: [item.mandatory || false],
      display: [item.display || false],     
      option_list: [item.option_list || []]
    });
  }

  selectedTemplate(type){
   this.selectedCategory=type
   this.initView();
   this.getInvoiceSettings();
  }

  postInvoiceSettings(key){
    let payload = {};
    payload["category"] = this.categoryOptions[this.selectedCategory];
    payload[key] = this.InvoiceForm.get(key).value;
    this.apiHandler.handleRequest(this._customField.postInvoiceSettings(payload), `Updated successfully!`).subscribe(
      {
        next: () => {
          this.initView();
        }
      }
    );
  }

  getInvoiceSettings(){
    this._customField.getInvoiceSettings(this.categoryOptions[this.selectedCategory]).subscribe((result: any) => {
      this.InvoiceForm.get("default_freight_term").patchValue(result["result"].default_freight_term);
      this.InvoiceForm.get("default_additional_hour_term").patchValue(result["result"].default_additional_hour_term);
      this.InvoiceForm.get("signature").patchValue(null);
      this.singantureLabel=getBlankOption();
      if(isValidValue(result["result"].signature)){
        this.singantureLabel={
          label: result["result"].signature.name,
          value: result["result"].signature.id,
        };
        this.InvoiceForm.get("signature").patchValue(result["result"].signature['id']);
      }
    } 
  )
  }

  initView() {
    this._customField.getInvoiceFields(false,this.categoryOptions[this.selectedCategory]).subscribe((result: any) => {
      this.InvoiceForm.get("display").patchValue(result["result"].display);
      this.sortedData = result["result"].fields;
      if (result["result"].fields.length > 0) {
        this.addWorkOrderList(result["result"].fields)
      }
    });
  }



  deleteCustomField(id) {
    this.apiHandler.handleRequest(this._customField.deleteCustomFiled(id), `${this.customFieldName} deleted successfully!`).subscribe(
      {
        next: () => {
          this.initView();
        }
      }
    );
  }

  outSideClick(env) {
    try {
      if (env.target.className.indexOf("more-icon") == -1) {
        this.showOptions = "";
      }
    } catch (error) {
      console.log(error);
    }
  }

  optionsList(event, list_index) {
    return (this.showOptions = list_index);
  }

  popupFunction(id, index: any = null,customFieldName) {
    this.customFieldName = customFieldName;
    this.listIndexData = { id: id, index: index };
    this.popupInputData["show"] = true;
  }

  confirmButton(event) {
    if (event) {
      let id = this.listIndexData["id"];
      this.deleteCustomField(id);
      this.listIndexData = {};
    }
  }

  edit(id): void {
    let editData = [];
    editData = this.sortedData.filter((item) => item.id == id);
    this.isOpenDialog = true;
    this.isFieldTypeChange=false;
    this.editData.next(editData);
  }

  addNewField() {
    this.isFieldTypeChange=true;
    this.isOpenDialog = true;
  }

  modelClose(e) {
    this.isOpenDialog = false;
    if (!e) {
      this.initView();
    }
  }

  getFormValues(form_value) {
    let payload = JSON.parse(JSON.stringify(form_value));
    payload["field_type"] = payload["field_type"]["data_type"];
    return payload;
  }

  showHide(form) {
    let payload = form.value;
    payload["field_type"] = payload["field_type"]["data_type"];
    this.apiHandler.handleRequest(this._customField.singleDisplayToggle(form.value["id"], payload), `Updated successfully!`).subscribe(
      {
        next: () => {
          this.initView();
        }
      }
    );
  }
  showInvoice(form) {
    this.apiHandler.handleRequest(this._customField.singleDisplayToggle(form.value["id"], this.getFormValues(form.value)), `Updated successfully!`).subscribe(
      {
        next: () => {
          this.initView();
        }
      }
    );
  }


  allDisplay() {
    let payload = {
      category:this.categoryOptions[this.selectedCategory],
      display_custom_field: this.InvoiceForm.get("display").value,
    };
    this.apiHandler.handleRequest( this._customField.allDisplayToggle(payload), `Updated successfully!`).subscribe(
      {
        next: () => {
          this.initView();
        }
      }
    );
  }

  addWorkOrderList(items: any = []) {
    let form = this.InvoiceForm.get("invoice_list") as UntypedFormArray;
    form.controls = [];
    form.reset();
    items.forEach((item) => {
      let arrayitem = this.getInvoiceForm(item);
      form.push(arrayitem);
    });
  }









}
