import { UntypedFormBuilder, UntypedFormGroup, UntypedFormArray } from "@angular/forms";
import { VehicleTripCustomFieldService } from "./vehicle-trip-custom-field-service.service";
import { Component, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { TerminologiesService } from "src/app/core/services/terminologies.service";
import { ApiHandlerService } from "src/app/core/services/api-handler.service";

@Component({
  selector: "app-vehicle-trip-setting-custom-fileds",
  templateUrl: "./vehicle-trip-setting-custom-fileds.component.html",
  styleUrls: ["./vehicle-trip-setting-custom-fileds.component.scss"],
  host: {
    "(document:click)": "outSideClick($event)",
  },
})
export class VehicleTripSettingCustomFiledsComponent implements OnInit {
  showOptions: string = "";
  popupOutputData: any;
  listIndexData = {};
  sortedData: any = [];
  allShowHide = [];
  isDisplay = false;
  isOpenDialog = false;
  isFieldTypeChange :boolean=true;

  vehicleTripForm: UntypedFormGroup;

  marketVehicleIndex = -1;
  popupInputData = {
    msg: "Are you sure, you want to delete?",
    type: "warning",
    show: false,
  };
  url = "revenue/formfield/trip/vehicle/";
  editData = new BehaviorSubject([]);
  terminology :any;
  customFieldName = '';

  constructor(
    private _customFiled: VehicleTripCustomFieldService,
    private _fb: UntypedFormBuilder,private apiHandler: ApiHandlerService,
    private _terminologiesService:TerminologiesService
  ) { }

  ngOnInit() {
    this.terminology = this._terminologiesService.terminologie
    this.initView();
    this.buildForm();
  }

  buildForm() {
    this.vehicleTripForm = this._fb.group({
      display: [false],
      vehicle_trip_list: this._fb.array([]),
    });
  }

  getVehileTripForm(item) {
    return this._fb.group({
      id: [item.id || ""],
      field_label: [item.field_label || ""],
      field_type: [item.field_type || ""],
      mandatory: [item.mandatory || false],
      in_invoice_bos: [item.in_invoice_bos || false],
      in_vehicle_bill: [item.in_vehicle_bill || false],
      in_trip: [item.in_trip || false],
      in_gate_pass: [item.in_gate_pass || false],
      in_driver_app: [item.in_driver_app || false],
      show_error: [false],
      option_list: [item.option_list || []]
    });
  }

  addVehicleList(items: any = []) {
    let form = this.vehicleTripForm.get("vehicle_trip_list") as UntypedFormArray;
    form.controls = [];
    form.reset();
    items.forEach((item) => {
      let arrayitem = this.getVehileTripForm(item);
      form.push(arrayitem);
    });
  }

  initView() {
    this._customFiled.getCompanyTripFields(false).subscribe((result: any) => {
      this.vehicleTripForm.get("display").patchValue(result["result"].display);
      this.sortedData = result["result"].fields;
      this.addVehicleList(this.sortedData);
    });
  }


  deleteUser(id) {
    this.apiHandler.handleRequest(this._customFiled.deleteCustomFiled(id), `${this.customFieldName} deleted successfully!`).subscribe(
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

  popupFunction(id, index: any = null,customFiledName) {
    this.customFieldName = customFiledName;
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
    if(!payload['in_trip']){
    }
    payload["field_type"] = payload["field_type"]["data_type"];
    return payload;
  }


  showtrips(form) {
    this._customFiled
      .singleDisplayToggle(form.value["id"], this.getFormValues(form.value))
      .subscribe((result: any) => {
        this.initView();
      });
  }

  showDriverapp(form) {
    this._customFiled
      .singleDisplayToggle(form.value["id"], this.getFormValues(form.value))
      .subscribe((result: any) => {
        this.initView();
      });
  }


  showInvoice(form) {
    this._customFiled
      .singleDisplayToggle(form.value["id"], this.getFormValues(form.value))
      .subscribe((result: any) => {
        this.initView();
      });
  }

  showVehicleBill(form) {
    this._customFiled
      .singleDisplayToggle(form.value["id"], this.getFormValues(form.value))
      .subscribe((result: any) => {
        this.initView();
      });
  }

  allDisplay() {
    let payload = {
      display_custom_field: this.vehicleTripForm.get("display").value,
    };
    this._customFiled.allDisplayToggle(payload).subscribe((result: any) => {
      this.initView();
    });
  }
}
