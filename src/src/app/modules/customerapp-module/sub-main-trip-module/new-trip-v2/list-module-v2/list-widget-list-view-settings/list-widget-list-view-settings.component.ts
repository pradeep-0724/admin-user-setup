import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash';
import { EmitSettingData, ViewSettings } from '../list-module-v2-interface';
import { WidgetSettingService } from './widget-settings.service';

@Component({
  selector: 'app-list-widget-list-view-settings',
  templateUrl: './list-widget-list-view-settings.component.html',
  styleUrls: ['./list-widget-list-view-settings.component.scss']
})
export class ListWidgetListViewSettingsComponent implements OnInit {
  @Input() visible = false;
  @Input() settingsUrl:string='';
  @Output() listViewSettingsData: EventEmitter<EmitSettingData> = new EventEmitter();
  viewSettingsListCopy: Array<ViewSettings> = [];
  viewSettingsList: Array<ViewSettings> = [];
  constructor(private _widgetSettingService:WidgetSettingService) { }
  ngOnInit(): void {
    if(this.settingsUrl)
    this.getWidgetSetting();
  }
 
  drop(event: CdkDragDrop<unknown>) {
    moveItemInArray(this.viewSettingsList, event.previousIndex, event.currentIndex);
  }

  cancel() {
    this.listViewSettingsData.emit({
      isSettingApplied: false
    });
    this.viewSettingsList = cloneDeep(this.viewSettingsListCopy);
  }
  applySettings() {
    this.postWidgetSetting();
  }

  getWidgetSetting(){
    this._widgetSettingService.getSettings(this.settingsUrl).subscribe(resp=>{
      this.viewSettingsList = resp.result.list_fields
      this.viewSettingsListCopy = cloneDeep(this.viewSettingsList);
    });
  }

  postWidgetSetting(){
    let payLoad={
      list_fields:this.viewSettingsList
    }
    this._widgetSettingService.postSettings(this.settingsUrl,payLoad).subscribe(resp=>{
      this.getWidgetSetting();
      this.listViewSettingsData.emit({
        isSettingApplied: true
      });
    },error=>{
      this.viewSettingsList = cloneDeep(this.viewSettingsListCopy);
    });
  }
  

}
