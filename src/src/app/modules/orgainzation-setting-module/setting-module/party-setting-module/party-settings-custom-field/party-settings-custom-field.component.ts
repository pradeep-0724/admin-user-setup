import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { PartySettingService } from '../party-setting.service';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { BehaviorSubject } from 'rxjs';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-party-settings-custom-field',
  templateUrl: './party-settings-custom-field.component.html',
  styleUrls: ['./party-settings-custom-field.component.scss']
})
export class PartySettingsCustomFieldComponent implements OnInit {

  url = TSAPIRoutes.revenue_party_setting;
  editData = new BehaviorSubject([]);
  terminology: any;
  isFieldTypeChange :boolean=true;
  partyCustomFields : any[] = [];
  sortedData =[];
  isOpenDialog = false;
  showOptions: string = "";
  popupOutputData: any;
  listIndexData = {};
  popupInputData = {
    msg: "Are you sure, you want to delete?",
    type: "warning",
    show: false,
  };
  isDisplayInParty : boolean = false;
  fieldName = '';

  constructor(public dialog: Dialog, private _partySettingService : PartySettingService,private _customFiled : PartySettingService,
    private apiHandler: ApiHandlerService) { }

  ngOnInit(): void {
    // this.getPartyCustomFields();
    this.initView()
  };

  initView() {
    this._customFiled.getPartyCustomFields(false).subscribe((res: any) => {
      this.partyCustomFields = res['result']['fields'];
    });
  }

  showInPartyAndMakeMandatory(event, data , key ){
    let form = {
      field_label : data.field_label,
      field_type : data.field_type.data_type,
      mandatory : data.mandatory,
      option : "",
      option_list: data.option_list,
      display : data.display
    };
    form[key] = event;
    this._partySettingService.editPartyCustomField(data.id,form).subscribe((res)=>{
      this.initView();
    })
  }

  showInParty(e){

  }

  edit(id): void {
    let editData = [];
    editData = this.partyCustomFields.filter((item) => item.id == id);
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

  deleteUser(id) {
    this.apiHandler.handleRequest(this._customFiled.deletePartyCustomField(id),`${this.fieldName} deleted successfully!`).subscribe(
       {
        next: () => {
      this.initView();
        }
    });
  }

  outSideClick(env) {
    try {
      if (env.target.className.indexOf("more-icon") == -1) {
        this.showOptions = "";
      }
    } catch (error) {
    }
  }

  popupFunction(id, index: any = null,fieldName) {
    this.fieldName = fieldName;
    this.listIndexData = { id: id, index: index };
    this.popupInputData['show'] = true;
  }

  confirmButton(event) {
    if (event) {
      let id = this.listIndexData['id'];
      this.deleteUser(id);
      this.listIndexData = {};
    }
  }

  trackById(item: any): string {
    return item.id
  }



}
