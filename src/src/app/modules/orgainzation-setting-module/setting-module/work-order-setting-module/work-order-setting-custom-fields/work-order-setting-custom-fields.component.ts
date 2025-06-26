import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { TerminologiesService } from 'src/app/core/services/terminologies.service';
import { WorkOrderCustomFieldService } from '../work-order-custom-field.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-work-order-setting-custom-fields',
  templateUrl: './work-order-setting-custom-fields.component.html',
  styleUrls: ['./work-order-setting-custom-fields.component.scss'],
  host: {
    "(document:click)": "outSideClick($event)",
  },
})
export class WorkOrderSettingCustomFieldsComponent implements OnInit {
  showOptions: string = "";
  popupOutputData: any;
  listIndexData = {};
  sortedData: any = [];
  isDisplay = false;
  isOpenDialog = false;
  workOrderForm: UntypedFormGroup;
  popupInputData = {
    msg: "Are you sure, you want to delete?",
    type: "warning",
    show: false,
  };
  url = TSAPIRoutes.revenue_form_field_workorder;
  editData = new BehaviorSubject([]);
  terminology: any;
  isFieldTypeChange :boolean=true;
  customFieldname = '';

  constructor(
    private _customFiled: WorkOrderCustomFieldService,
    private _fb: UntypedFormBuilder,private apiHandler: ApiHandlerService,
    private _terminologiesService: TerminologiesService
  ) { }

  ngOnInit() {
    this.terminology = this._terminologiesService.terminologie
    this.initView();
    this.buildForm();
  }

  buildForm() {
    this.workOrderForm = this._fb.group({
      display: [false],
      work_order_list: this._fb.array([]),
    });
  }

  getWorkOrderForm(item) {
    return this._fb.group({
      id: [item.id || ""],
      field_label: [item.field_label || ""],
      field_type: [item.field_type || ""],
      mandatory: [item.mandatory || false],
      display: [item.display || false],
      in_invoice_bos: [item.in_invoice_bos || false],
      in_workorder: [item.in_workorder || false],
      option_list: [item.option_list || []]
    });
  }



  initView() {
    this._customFiled.getWorkOrderFields(false).subscribe((result: any) => {
      this.workOrderForm.get("display").patchValue(result["result"].display);
      this.sortedData = result["result"].fields;
      if (result["result"].fields.length > 0) {
        this.addWorkOrderList(result["result"].fields)
      }
    });
  }



  deleteUser(id) {
    this.apiHandler.handleRequest(this._customFiled.deleteCustomFiled(id), `${this.customFieldname} deleted successfully!`).subscribe(
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

  popupFunction(id, index: any = null,fieldName) {
    this.customFieldname = fieldName;
    this.listIndexData = { id: id, index: index };
    this.popupInputData["show"] = true;
  }

  confirmButton(event) {
    if (event) {
      let id = this.listIndexData["id"];
      this.deleteUser(id);
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
    if (!form.value["display"]) {
      payload["in_invoice_bos"] = false;
      payload["in_workorder"] = false;
    }
    this._customFiled.singleDisplayToggle(form.value["id"], payload).subscribe((result: any) => {
        this.initView();
      });
  }

  showWorkOrder(form) {
    this._customFiled.singleDisplayToggle(form.value["id"], this.getFormValues(form.value)).subscribe((result: any) => {
        this.initView();
      });
  }



  showInvoice(form) {
    this._customFiled.singleDisplayToggle(form.value["id"], this.getFormValues(form.value)).subscribe((result: any) => {
        this.initView();
      });
  }


  allDisplay() {
    let payload = {
      display_custom_field: this.workOrderForm.get("display").value,
    };
    this._customFiled.allDisplayToggle(payload).subscribe((result: any) => {
      this.initView();
    });
  }

  addWorkOrderList(items: any = []) {
    let form = this.workOrderForm.get("work_order_list") as UntypedFormArray;
    form.controls = [];
    form.reset();
    items.forEach((item) => {
      let arrayitem = this.getWorkOrderForm(item);
      form.push(arrayitem);
    });
  }









}
