import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ContainerService } from 'src/app/modules/customerapp-module/api-services/master-module-services/container-service/container-service.service';
import { NewTripV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/trip-service/new-trip-v2.service';
import { changeDateTimeToServerFormat, changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { getBlankOption, isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { NewTripV2Constants } from '../../new-trip-v2-constants/new-trip-v2-constants';
import { NewTripV2DataService } from '../../new-trip-v2-dataservice';

@Component({
  selector: 'app-trip-container-add-edit',
  templateUrl: './trip-container-add-edit.component.html',
  styleUrls: ['./trip-container-add-edit.component.scss']
}) 
export class TripContainerAddEditComponent implements OnInit {
  @Input() jobId = ''
  @Input() routeUpdated: Observable<boolean>
  @Input() headerDetails:Observable<any>
  optionsDropdownUrl = TSAPIRoutes.static_options;
  pointOfTypeParam: any = {};
  containerSizeParam={}
  containerTypeParam={}
  containerForm: FormGroup;
  headerList = [];
  structureList = []
  isOpenSettings = false;
  settingsUrl = ''
  isFromToInvalid = new Subject()
  selectedOrder = -1;
  initialValues = {
    containerType: [],
    containerName: [],
    handlingType: [],
    containerSize: [],
    area : [],
  }
  sizeOptions = []
  containerTypeList = []
 containerJobType=new NewTripV2Constants().containerJobType

  containerList = [];
  apiError = ''
  isUpdated = false;
  timeoutId;
  isContainerRowEditable = []
  isContainerFromSalseOrder = []
  terminalDropDown=[]
  tripstatus=0
  isFromSalseOrder=false;
  areaApi = TSAPIRoutes.static_options;
  areaParams: any = {};
  areaList = [];


  constructor(private fb: FormBuilder, private _jobV2Service: NewTripV2Service, private _commonService: CommonService, private _containerService: ContainerService,
    private apiHandler: ApiHandlerService,private _tripDataService:NewTripV2DataService) { }

  ngOnInit(): void {
    this.containerForm = this.fb.group({
      containersDetailsList: this.fb.array([])
    });
    this.headerDetails.subscribe(data=>{
      this.isFromSalseOrder=isValidValue(data['work_order_no'])
      if(data['is_invoiced']){
        this.tripstatus=4
      }else{
        this.tripstatus=data['status']
      }
    })
    this.getTerminal()
    this.getContainerTypes();
    this.settingsUrl = `revenue/trip/${this.jobId}/container/setting/`
    this.getJobContainerSettings();
    this.getContainerDetails();
    this.getContainerSize()
    this.routeUpdated.subscribe(updated => {
      if (updated){
        this.getJobContainerSettings();
        this.getTerminal();
      }
    })
    this.getAreaList();
  }

  get containersDetailsList(): FormArray {
    return this.containerForm.get('containersDetailsList') as FormArray;
  }

  getJobContainerSettings() {
    this._jobV2Service.getJobContainerTableSettings(this.jobId).subscribe(resp => {
      this.headerList = resp.result['header']
      this.structureList = resp.result['table_setting']
      this.getWorkOrderContainerData();
    })
  }

  getContainerDetails() {
    this._containerService.getContainerListDetails().subscribe(resp => {
      this.containerList = resp['result']
    })
  }

  getTerminal() {
    this._commonService.getStaticOptions('path-terminal').subscribe((response) => {
      this.terminalDropDown = response['result']['path-terminal']
    });
  }

  getNewTerminal(event, i,key) {
    if (event) {
      this._commonService.getStaticOptions('path-terminal').subscribe((response) => {
        this.terminalDropDown = response['result']['path-terminal']
        const containerForm = this.containersDetailsList.at(i) as FormGroup
        containerForm.get(key).setValue(event.label);
        this.editContainerRowData(i)
      });
    }
  }

  getNewContainerSize(event, i) {
    if (event) {
        const containerForm = this.containersDetailsList.at(i) as FormGroup
        this.initialValues.containerSize[i]={label:event.label,value:event.id}
        containerForm.get('size').setValue(event.label);
        this.editContainerRowData(i);
        this.getContainerSize()
    }
  }

  getNewContainerType(event, i) {
    if (event) {
        const containerForm = this.containersDetailsList.at(i) as FormGroup
        this.initialValues.containerType[i]={label:event.label,value:event.id}
        containerForm.get('type').setValue(event.id);
        this.editContainerRowData(i);
        this.getContainerTypes()
    }
  }

  addNewTerminal(event) {
    if (event) {
      const arrStr = event.toLowerCase().split(' ');
      const titleCaseArr: string[] = [];
      for (const str of arrStr) {
        titleCaseArr.push(str.charAt(0).toUpperCase() + str.slice(1));
      }
      const word_joined = titleCaseArr.join(' ');
      this.pointOfTypeParam = {
        key: 'path-terminal',
        label: word_joined,
        value: 0
      };
    }
  }

  addNewContainerSize(event) {
    if (event) {
      const arrStr = event.toLowerCase().split(' ');
      const titleCaseArr: string[] = [];
      for (const str of arrStr) {
        titleCaseArr.push(str.charAt(0).toUpperCase() + str.slice(1));
      }
      const word_joined = titleCaseArr.join(' ');
      this.containerSizeParam = {
        key: 'container-size',
        label: word_joined,
        value: 0
      };
    }
  }

  addNewContainerType(event) {
    if (event) {
      const arrStr = event.toLowerCase().split(' ');
      const titleCaseArr: string[] = [];
      for (const str of arrStr) {
        titleCaseArr.push(str.charAt(0).toUpperCase() + str.slice(1));
      }
      const word_joined = titleCaseArr.join(' ');
      this.containerTypeParam = {
        key: 'container-type',
        label: word_joined,
        value: 0
      };
    }
  }

  getContainerSize() {
    this._commonService.getStaticOptions('container-size').subscribe((response) => {
      this.sizeOptions = response['result']['container-size']
    });
  }

  getWorkOrderContainerData() {
    this._jobV2Service.getJobContainerData(this.jobId).subscribe(response => {
      this.patchContainerDetails(response['result'])
      this.isContainerRowEditable = []
      this.isContainerRowEditable = response['result'].map(list => list.is_editable)
      this.isContainerFromSalseOrder= response['result'].map(list => list.has_workorder)

    });
  }

  patchContainerDetails(data) {
    const containerData = data
    this.initialValues.containerName = [];
    this.initialValues.containerSize = [];
    this.initialValues.containerType = [];
    this.initialValues.handlingType = [];
    this.initialValues.area = [];
    this.containersDetailsList.controls = [];
    this.containersDetailsList.updateValueAndValidity()
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
        this.initialValues.handlingType[index] = {label:this.containerJobType.find(type=>type.id==containerInfo['handling_type']).label,value:''}
      }
      this.initialValues.containerSize[index] = {label:containerInfo['size'],value:containerInfo['size']}
      this.containersDetailsList.at(index).patchValue(containerInfo)
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
    this.containersDetailsList.push(this.createFormGroup());
  }

  deleteContainerRow(index: number) {
    this.containersDetailsList.removeAt(index);
    if (this.apiError=='Container number already Exist.' && !hasDuplicateNames(this.containersDetailsList.value, 'name')) {
      this.apiError = ''
    }
  }

  listViewSettingsData(e) {
    this.isOpenSettings = false;
    if (e['isSettingApplied']) {
      this.getJobContainerSettings()
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
    this.containersDetailsList.insert(this.selectedOrder, this.createFormGroup());
    this.updateContainerDetails('reset', this.selectedOrder, '')
    this.initialValues.containerName[this.selectedOrder] = getBlankOption()
    this.initialValues.containerSize[this.selectedOrder] = getBlankOption()
    this.initialValues.containerType[this.selectedOrder] = getBlankOption()
    this.initialValues.handlingType[this.selectedOrder] = getBlankOption()
  }

  editContainerRowData(orderNumber) {
    if (!hasDuplicateNames(this.containersDetailsList.value, 'name')) {
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
      const containerForm = this.containersDetailsList.at(i) as FormGroup
      if (containerForm.controls.hasOwnProperty('type')) {
        this.updateContainerDetails('column_clone', i, 'type');
      }
      // if(containerForm.controls.hasOwnProperty('handling_type')){
      //   this.updateContainerDetails('column_clone',i,'handling_type');
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
    const containerForm = this.containersDetailsList.at(i) as FormGroup
    const containerId = containerForm.value['container']
    if (containerId) {
      const containerDetails = this.containerList.find(container => container.id == containerId)
      this.setControlValueIfExists(containerForm, 'gross_weight', containerDetails['weight']);
      this.setControlValueIfExists(containerForm, 'size', containerDetails['size']);
      this.setControlValueIfExists(containerForm, 'type', containerDetails['type']['id']);
      this.initialValues.containerSize[i] = {label:containerDetails['size'],value:containerDetails['size']}
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
        let cloneData = this.preparePayload(this.containersDetailsList.at(orderNumber).value)
        cloneData['name'] = ''
        payload = {
          action: 'add_clone',
          order_no: orderNumber + 2,
          data: this.preparePayload(cloneData)
        }
        this.apiHandler.handleRequest(this._jobV2Service.putContainerDetails(this.jobId, payload), 'Container info table updated!').subscribe(
          {
            next: () => {
              this.isUpdated = true
              if (this.timeoutId) {
                clearTimeout(this.timeoutId)
              }
              this._tripDataService.upDateProfitLoss(true)
              this.getWorkOrderContainerData();
              this.timeoutId = setTimeout(() => {
                this.isUpdated = false
              }, 2000);
            },
            error: () => {
              this.isUpdated = false
            }
          })
        break;
      case 'add':
        payload = {
          action: 'add_clone',
          order_no: orderNumber + 2,
          data: this.preparePayload(this.createFormGroup().value)
        }
        this.apiHandler.handleRequest(this._jobV2Service.putContainerDetails(this.jobId, payload), 'Container info table updated!').subscribe(
          {
            next: () => {
              this.isUpdated = true
              if (this.timeoutId) {
                this._tripDataService.upDateProfitLoss(true)
                clearTimeout(this.timeoutId)
              }
              this.getWorkOrderContainerData();
              this.timeoutId = setTimeout(() => {
                this.isUpdated = false
              }, 2000);
            },
            error: () => {
              this.isUpdated = false;
            }
          }
        )
        break;
      case 'edit_remove':
        payload = {
          action: 'edit_remove',
          order_no: orderNumber + 1,
          data: this.preparePayload(this.containersDetailsList.at(orderNumber).value)
        }
        this.apiHandler.handleRequest(this._jobV2Service.putContainerDetails(this.jobId, payload), 'Container info table updated!').subscribe(
          {
            next: () => {
              this.isUpdated = true
              if (this.timeoutId) {
                clearTimeout(this.timeoutId)
                this._tripDataService.upDateProfitLoss(true)
              }
              this.timeoutId = setTimeout(() => {
                this.isUpdated = false
              }, 3000);
            },
            error: (error) => {
              if (isValidValue(error['error']['result'])) {
                let result = error['error']['result']
                if (typeof result == 'object') {
                  this.apiError = result['message']
                  this.containersDetailsList.at(orderNumber).get('name').setValue(result['container'])
                  if (this.timeoutId) {
                    clearTimeout(this.timeoutId)
                  }
                  this.timeoutId = setTimeout(() => {
                    this.apiError = ''
                  }, 3000);
                }
              }
              this.isUpdated = false
            }
          }
        )
        break;
        case 'reset':
          payload = {
            action: 'edit_remove',
            order_no: orderNumber + 1,
            data: this.preparePayload(this.containersDetailsList.at(orderNumber).value)
          }
          this.apiHandler.handleRequest(this._jobV2Service.putContainerDetails(this.jobId, payload), 'Container info table updated!').subscribe(
            {
              next: () => {
                this.isUpdated = true
                if (this.timeoutId) {
                  this._tripDataService.upDateProfitLoss(true)
                  clearTimeout(this.timeoutId)
                }
                this.getWorkOrderContainerData();
                this.timeoutId = setTimeout(() => {
                  this.isUpdated = false
                }, 3000);
              },
              error: (error) => {
                if (isValidValue(error['error']['result'])) {
                  let result = error['error']['result']
                  if (typeof result == 'object') {
                    this.apiError = result['message']
                    this.containersDetailsList.at(orderNumber).get('name').setValue(result['container'])
                    if (this.timeoutId) {
                      clearTimeout(this.timeoutId)
                    }
                    this.timeoutId = setTimeout(() => {
                      this.apiError = ''
                    }, 3000);
                  }
                }
                this.isUpdated = false
              }
            }
          )
          break;
      case 'delete':
        payload = {
          action: type,
          order_no: orderNumber + 1,
          data: {}
        }
        this.apiHandler.handleRequest(this._jobV2Service.putContainerDetails(this.jobId, payload), 'Container info table updated!').subscribe(
          {
            next: () => {
              this.isUpdated = true
              if (this.timeoutId) {
                this._tripDataService.upDateProfitLoss(true)
                clearTimeout(this.timeoutId)
              }
              this.timeoutId = setTimeout(() => {
                this.isUpdated = false
              }, 3000);
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
        const clonedValue = this.containersDetailsList.at(orderNumber).value[key]
        payload = {
          action: type,
          order_no: orderNumber + 1,
          data: {
            [key]: clonedValue
          }
        }
        this.apiHandler.handleRequest(this._jobV2Service.putContainerDetails(this.jobId, payload), 'Container info table updated!').subscribe(
          {
            next: () => {
              this.containersDetailsList.controls.forEach((containerForm, index) => {
                this._tripDataService.upDateProfitLoss(true)
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
                      this.initialValues.handlingType[index] = {label:this.containerJobType.find(type=>type.id==clonedValue).label,value:''}
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
              this.isUpdated = false;
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

    this.containersDetailsList.updateValueAndValidity()
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
