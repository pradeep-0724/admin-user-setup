import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';
import { Subject } from 'rxjs';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { CommonService } from 'src/app/core/services/common.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { ContainerService } from 'src/app/modules/customerapp-module/api-services/master-module-services/container-service/container-service.service';
import { WorkOrderV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/work-order-service/work-order-v2.service';
import { changeDateTimeToServerFormat, changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { getBlankOption, isValidValue, trimExtraSpaceBtwWords } from 'src/app/shared-module/utilities/helper-utils';
import { WorkOrderV2DataService } from '../../work-order-v2-dataservice.service';
import { ListWidgetData } from '../../../new-trip-v2/list-module-v2/list-module-v2-interface';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';
import { NewTripV2Constants } from '../../../new-trip-v2/new-trip-v2-constants/new-trip-v2-constants';

@Component({
  selector: 'app-work-order-view-container-add-edit',
  templateUrl: './work-order-view-container-add-edit.component.html',
  styleUrls: ['./work-order-view-container-add-edit.component.scss']
})
export class WorkOrderViewContainerAddEditComponent implements OnInit {
  @Input() workOrderId = ''
  salesOrderForm: FormGroup;
  headerList = [];
  structureList = []
  settingsUrl = ''
  isFromToInvalid = new Subject()
  postApiUrl = TSAPIRoutes.static_options;
  sizeParam = {}
  containerParam = {}
  selectedOrder = -1;
  initialValues = {
    containerType: [],
    containerName: [],
    handlingType: [],
    containerSize: [],
    area : []
  }
  sizeOptions = []
  containerTypeList = []
  containerJobType=new NewTripV2Constants().containerJobType


  containerList = [];
  apiError = ''
  isUpdated = false;
  timeoutId;
  isContainerRowEditable = []
  prifixUrl = getPrefix()
  containerListData = []
  terminalDropDown = [];
  filterUrl = ''
  isFilterApplied = false;
  defaultParams = {
    filters: '[]',
  };
  areaApi = TSAPIRoutes.static_options;
  areaParams: any = {};
  areaList = [];


  constructor(private fb: FormBuilder, private _workOrderV2Service: WorkOrderV2Service, private _workOrderV2DataService: WorkOrderV2DataService,
    private _commonService: CommonService, private _containerService: ContainerService,private apiHandler: ApiHandlerService) { }

  ngOnInit(): void {
    this.salesOrderForm = this.fb.group({
      salesOrderContainersDetailsList: this.fb.array([])
    });
    this.getContainerTypes();
    this.settingsUrl = `revenue/workorder/${this.workOrderId}/container/setting/`
    this.filterUrl = `revenue/workorder/${this.workOrderId}/container/filter/`
    this.getWorkOrderContainerSettings();
    this.getContainerDetails();
    this.getTerminal();
    this.getContainerSize();
    this.getAreaList();
  }

  get salesOrderContainersDetailsList(): FormArray {
    return this.salesOrderForm.get('salesOrderContainersDetailsList') as FormArray;
  }

  getWorkOrderContainerSettings() {
    this._workOrderV2Service.getWorkorderContainerTableSettings(this.workOrderId).subscribe(resp => {
      this.headerList = resp.result['header']
      this.structureList = resp.result['table_setting']      
      this.getWorkOrderContainerData();
    })
  }

  getTerminal() {
    this._commonService.getStaticOptions('path-terminal').subscribe((response) => {
      this.terminalDropDown = response['result']['path-terminal']
    });
  }

  listWidgetData(widgetData: ListWidgetData) {
    if (widgetData['filterKeyData'].length) {
      this.isFilterApplied = true
    } else {
      this.isFilterApplied = false
    }
    this.defaultParams.filters = JSON.stringify(widgetData['filterKeyData']);
    this.getWorkOrderContainerData();
  }


  getContainerSize() {
    this._commonService.getStaticOptions('container-size').subscribe((response) => {
      this.sizeOptions = response['result']['container-size']
    });
  }


  getNewContainerSize(event, index) {
    if (event) {
      this.initialValues.containerSize[index] = { label: event.label, value: event.id }
      const containerForm = this.salesOrderContainersDetailsList.at(index) as FormGroup
      containerForm.get('size').setValue(event.label)
      this.editContainerRowData(index)
      this.getContainerSize();
    }
  }
  getNewContainerType(event, index) {
    if (event) {
      this.initialValues.containerType[index] = { label: event.label, value: event.id }
      const containerForm = this.salesOrderContainersDetailsList.at(index) as FormGroup
      containerForm.get('type').setValue(event.id)
      this.editContainerRowData(index)
      this.getContainerTypes();
    }
  }

  addNewContainerType(event) {
    if (event) {
      const val = trimExtraSpaceBtwWords(event);
      this.containerParam = {
        key: 'container-type',
        label: val,
        value: 0
      };
    }
  }

  addNewContainerSize(event) {
    if (event) {
      const val = trimExtraSpaceBtwWords(event);
      this.sizeParam = {
        key: 'container-size',
        label: val,
        value: 0
      };
    }
  }


  getContainerDetails() {
    this._containerService.getContainerListDetails().subscribe(resp => {
      this.containerList = resp['result']
    })
  }
  gotoJob(key, index) {
    let jobId = '';
    if (key == 'pullout_job_no') {
      jobId = this.containerListData[index].pullout
    }
    if (key == 'deposit_job_no') {
      jobId = this.containerListData[index].deposit
    }
    if (jobId) {
      let url = this.prifixUrl + `/trip/new-trip/details/${jobId}`;
      window.open(url, '_blank');
    }

  }
  getWorkOrderContainerData() {
    this.salesOrderContainersDetailsList.controls = [];
    this.containerListData = []
    this._workOrderV2Service.getWorkorderContainerData(this.workOrderId, this.defaultParams).subscribe(response => {
      this.patchContainerDetails(response['result'])
      this.containerListData = response['result']
      this.isContainerRowEditable = []
      this.isContainerRowEditable = response['result'].map(list => list.is_editable)
    });
  }

  patchContainerDetails(data) {
    const containerData = data
    this.initialValues.containerName = [];
    this.initialValues.containerSize = [];
    this.initialValues.containerType = [];
    this.initialValues.handlingType = [];
    this.initialValues.area = [];
    containerData.forEach((containerInfo, index) => {
      this.addFormGroup();
      this.changeDateAndTimeWithTimeZone(containerInfo)
      this.initialValues.containerName.push(getBlankOption())
      this.initialValues.containerSize.push(getBlankOption())
      this.initialValues.containerType.push(getBlankOption())
      this.initialValues.handlingType.push(getBlankOption())
      this.initialValues.area.push(getBlankOption())
      if (containerInfo['container']) {
        this.initialValues.containerName[index] = { label: containerInfo['container']['label'], value: '' }
        containerInfo['container'] = containerInfo['container']['id']
      }
      if (containerInfo['type']) {
        this.initialValues.containerType[index] = { label: containerInfo['type']['label'], value: '' }
        containerInfo['type'] = containerInfo['type']['id']
      }
      if(isValidValue(containerInfo['handling_type'])){
        this.initialValues.handlingType[index] ={label:this.containerJobType.find(item => item.id == containerInfo['handling_type']).label,value:""}  
      }
      this.initialValues.containerSize[index] = { label: containerInfo['size'], value: '' }
      this.salesOrderContainersDetailsList.at(index).patchValue(containerInfo)

    });
  }

  createFormGroup(): FormGroup {
    const group: any = {};

    this.structureList.forEach(item => {
      if (item.field_type === 'duration') {
        group[item.id] = this.createHaltTimeFormGroup();
      }
      else {
        group[item.id] = this.createFormControl(item);
      }
    });

    return this.fb.group(group);
  }

  createFormControl(item: any) {
    switch (item.field_type) {
      case 'string':
        return this.fb.control('');
      case 'handling_type_dropdown':
        return this.fb.control(0);
      case 'container_dropdown':
        return this.fb.control(null);
      case 'terminal_dropdown':
        return this.fb.control('');
      case 'container_type_dropdown':
        return this.fb.control(null);
      case 'container_size_dropdown':
        return this.fb.control('');
      case 'date':
        return this.fb.control(null);
      case 'datetime':
        return this.fb.control(null);
      case 'dropdown':
        return this.fb.control(null);
      case 'location_dropdown':
        return this.fb.control('');
      default:
        return this.fb.control(null);
    }
  }

  createHaltTimeFormGroup(): FormGroup {
    return this.fb.group({
      days: this.fb.control(''),
      hours: this.fb.control(''),
      minutes: this.fb.control(''),
    });
  }

  addFormGroup() {
    this.salesOrderContainersDetailsList.push(this.createFormGroup());
  }

  deleteContainerRow(index: number) {
    this.salesOrderContainersDetailsList.removeAt(index);
    if (this.apiError=='Container number already Exist.' && !hasDuplicateNames(this.salesOrderContainersDetailsList.value, 'name')) {
      this.apiError = ''
    }
  }

  listViewSettingsData(e) {
    if (e) {
      this.getWorkOrderContainerSettings()
    }
  }

  locationSelected(e, i, key) {
    this.editContainerRowData(i)
  }
  dateTimeSelected(e, i) {
    this.editContainerRowData(i)
  }

  deleteContainer() {
    this.updateContainerDetails('delete', this.selectedOrder, '')
  }

  addNewContainerRow() {
    this.updateContainerDetails('add', this.selectedOrder, '')

  }

  removeContainerRowData() {
    this.deleteContainerRow(this.selectedOrder)
    this.salesOrderContainersDetailsList.insert(this.selectedOrder, this.createFormGroup());
    this.updateContainerDetails('edit_remove', this.selectedOrder, '')
    this.initialValues.containerName[this.selectedOrder] = getBlankOption()
    this.initialValues.containerSize[this.selectedOrder] = getBlankOption()
    this.initialValues.containerType[this.selectedOrder] = getBlankOption()
    this.initialValues.handlingType[this.selectedOrder] = getBlankOption()
  }

  editContainerRowData(orderNumber) {
    if (!hasDuplicateNames(this.salesOrderContainersDetailsList.value, 'name')) {
      this.updateContainerDetails('edit_remove', orderNumber, '')
      this.apiError = ''
    } else {
      this.apiError = 'Container number already Exist.'
    }
  }

  cloneRowContainerData() {
    this.updateContainerDetails('clone', this.selectedOrder, '')
  }

  cloumnClone(key, i) {
    this.updateContainerDetails('column_clone', i, key);
    if (key == 'container') {
      const containerForm = this.salesOrderContainersDetailsList.at(i) as FormGroup
      if (containerForm.controls.hasOwnProperty('type')) {
        this.updateContainerDetails('column_clone', i, 'type');
      }
      // if (containerForm.controls.hasOwnProperty('handling_type')) {
      //   this.updateContainerDetails('column_clone', i, 'handling_type');
      // }
      if (containerForm.controls.hasOwnProperty('size')) {
        this.updateContainerDetails('column_clone', i, 'size');
      }
      if (containerForm.controls.hasOwnProperty('gross_weight')) {
        this.updateContainerDetails('column_clone', i, 'gross_weight');
      }
    }
  }

  getContainerTypes() {
    this._commonService.getStaticOptions('container-type').subscribe((response: any) => {
      this.containerTypeList = response.result['container-type'];
    });
  }

  onContainerNameSelection(i) {
    const containerForm = this.salesOrderContainersDetailsList.at(i) as FormGroup
    const containerId = containerForm.value['container']
    if (containerId) {
      const containerDetails = this.containerList.find(container => container.id == containerId)
      this.setControlValueIfExists(containerForm, 'gross_weight', containerDetails['weight']);
      this.setControlValueIfExists(containerForm, 'size', containerDetails['size']);
      this.setControlValueIfExists(containerForm, 'type', containerDetails['type']['id']);
      this.initialValues.containerSize[i] = { label: containerDetails['size'], value: containerDetails['size'] }
      this.initialValues.containerType[i] = { label: containerDetails['type']['label'], value: '' }
    }
    this.editContainerRowData(i)
  }
  setControlValueIfExists(formGroup: FormGroup, controlName: string, value: any): void {
    if (formGroup.controls.hasOwnProperty(controlName)) {
      formGroup.get(controlName)?.setValue(value);
    }
  }
  updateContainerDetails(type, orderNumber, key) {
    let payload = {
      action: type,
      order_no: orderNumber,
      data: {}
    }

    switch (type) {
      case 'clone':
        let cloneData = this.preparePayload(this.salesOrderContainersDetailsList.at(orderNumber).value)
        cloneData['name'] = ''
        payload = {
          action: 'add_clone',
          order_no:this.containerListData[orderNumber]?this.containerListData[orderNumber]['order_no'] + 1:orderNumber+2,
          data: this.preparePayload(cloneData)
        }
        this.apiHandler.handleRequest(this._workOrderV2Service.putContainerDetails(this.workOrderId, payload), 'Continer info table updated!').subscribe(
          {
            next: () => {
              this.isUpdated = true
              this.makeUpdate()
              if (this.timeoutId) {
                clearTimeout(this.timeoutId)
              }
              this.getWorkOrderContainerData();
              this.timeoutId = setTimeout(() => {
                this.isUpdated = false
              }, 2000);
            },
            error: () => {
              this.isUpdated = false
            }
          }
        )
        break;
      case 'add':
        payload = {
          action: 'add_clone',
          order_no:this.containerListData[orderNumber]?this.containerListData[orderNumber]['order_no'] + 1:orderNumber+2,
          data: this.preparePayload(this.createFormGroup().value)
        }
        this.apiHandler.handleRequest(this._workOrderV2Service.putContainerDetails(this.workOrderId, payload), 'Continer info table updated!').subscribe(
          {
            next: () => {
              this.isUpdated = true
              this.makeUpdate()
              if (this.timeoutId) {
                clearTimeout(this.timeoutId)
              }
              this.getWorkOrderContainerData();
              this.timeoutId = setTimeout(() => {
                this.isUpdated = false
              }, 2000);
            },
            error: () => {
              this.isUpdated = false
            }
          }
        )
        break;
      case 'edit_remove':
        payload = {
          action: 'edit_remove',
          order_no: this.containerListData[orderNumber]['order_no'],
          data: this.preparePayload(this.salesOrderContainersDetailsList.at(orderNumber).value)
        }
        this.apiHandler.handleRequest(this._workOrderV2Service.putContainerDetails(this.workOrderId, payload), 'Continer info table updated!').subscribe(
          {
            next: () => {
              this.isUpdated = true
              this.makeUpdate()
              if (this.timeoutId) {
                clearTimeout(this.timeoutId)
              }
              this.timeoutId = setTimeout(() => {
                this.isUpdated = false
              }, 2000);
            },
            error: () => {
              this.isUpdated = false
            }
          }
        )
        break;
      case 'delete':
        payload = {
          action: type,
          order_no: this.containerListData[orderNumber]['order_no'],
          data: {}
        }
        this.apiHandler.handleRequest(this._workOrderV2Service.putContainerDetails(this.workOrderId, payload), 'Continer info table updated!').subscribe(
          {
            next: () => {
              this.isUpdated = true
              this.makeUpdate()
              if (this.timeoutId) {
                clearTimeout(this.timeoutId)
              }
              this.timeoutId = setTimeout(() => {
                this.isUpdated = false
              }, 2000);
              this.deleteContainerRow(orderNumber)
              this.initialValues.containerName.splice(orderNumber, 1)
              this.initialValues.containerSize.splice(orderNumber, 1)
              this.initialValues.containerType.splice(orderNumber, 1)
              this.initialValues.handlingType.splice(orderNumber, 1)
              this.isContainerRowEditable.splice(orderNumber, 1)
            },
            error: () => {
              this.isUpdated = false
            }
          }
        )
        break;
      case 'column_clone':
        const clonedValue = this.salesOrderContainersDetailsList.at(orderNumber).value[key]
        payload = {
          action: type,
          order_no: this.containerListData[orderNumber]['order_no'],
          data: {
            [key]: clonedValue
          }
        }
        this.apiHandler.handleRequest(this._workOrderV2Service.putContainerDetails(this.workOrderId, payload), 'Container info table updated!').subscribe(
          {
            next: () => {
              this.salesOrderContainersDetailsList.controls.forEach((containerForm, index) => {
                if (index > orderNumber) {
                  if (key == 'container') {
                    const containerDetails = this.containerList.find(container => container.id == clonedValue)
                    this.initialValues.containerName[index] = { label: containerDetails['name'], value: '' }
                  }
                  if (key == 'type') {
                    const typeObj = this.containerTypeList.find(containerType => containerType.id == clonedValue)
                    if (typeObj)
                      this.initialValues.containerType[index] = { label: typeObj['label'], value: typeObj['id'] }
                  }
                  if (key == 'size') {
                    this.initialValues.containerSize[index] = { label: clonedValue, value: clonedValue }
                  }
                  if (key == 'handling_type') {
                    if(isValidValue(clonedValue)){
                      this.initialValues.handlingType[index] = {label:this.containerJobType.find(item => item.id == clonedValue).label,value:""} 
                    }
                  }
                  containerForm.get(key).setValue(clonedValue)
                }
              });
              this.isUpdated = true
              if (this.timeoutId) {
                clearTimeout(this.timeoutId)
              }
              this.timeoutId = setTimeout(() => {
                this.isUpdated = false
              }, 2000);

            },
            error: () => {
              this.isUpdated = false
            }
          }
        )
        break;
      default:
        payload = {
          action: type,
          order_no: orderNumber,
          data: {
            [key]: ''
          }
        }
    }


  }

  preparePayload(payloadData) {
    for (const key in payloadData) {
      if (Object.prototype.hasOwnProperty.call(payloadData, key)) {
        const structure = this.structureList.find(keys => keys.id == key)
        if (structure) {
          if (structure['field_type'] == "datetime") {
            payloadData[key] = changeDateTimeToServerFormat(payloadData[key])
          }
          if (structure['field_type'] == "date") {
            payloadData[key] = changeDateToServerFormat(payloadData[key])
          }

        }

      }
    }
    return payloadData
  }

  changeDateAndTimeWithTimeZone(containerData) {
    for (const key in containerData) {
      if (Object.prototype.hasOwnProperty.call(containerData, key)) {
        const structure = this.structureList.find(keys => keys.id == key)
        if (structure) {
          if (structure['field_type'] == "datetime") {
            if (containerData[key]) {
              containerData[key] = moment(moment(new Date(containerData[key])).tz(localStorage.getItem('timezone')))
            }
          }
        }

      }
    }
  }

  makeUpdate() {
    this._workOrderV2DataService.newFreightUpdate(true)
  }

  getAreaList() {
    this._commonService.getStaticOptions('area').subscribe((response) => {
      this.areaList = response.result['area'];
    });
  }

  addNewArea(event) {
    this.areaParams = {
      key: 'area',
      label: event,
      value: 0
    };
  }

  getNewArea(event,formControl: FormControl, formGroup: FormGroup, index: number) {
    if (event) {
      this._commonService.getStaticOptions('area').subscribe((response) => {   
        formControl.setValue(event.label); 
        this.initialValues.area[index].label = event.label;
        this.initialValues.area[index].value = event.id;
        this.areaList = response.result['area'];
        this.editContainerRowData(index);
      });
    }
  }

}

function hasDuplicateNames(arr, key) {
  const keySet = new Set();
  for (const item of arr) {
    if (keySet.has(item[key]?.trim())) {
      return true;
    }
    if (item[key])
      keySet.add(item[key]?.trim());
  }
  return false;
}


