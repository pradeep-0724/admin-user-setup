import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, UntypedFormArray } from '@angular/forms';
import moment from 'moment';
import { Subject } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { ContainerService } from 'src/app/modules/customerapp-module/api-services/master-module-services/container-service/container-service.service';
import { WorkOrderV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/work-order-service/work-order-v2.service';
import { changeDateTimeToServerFormat, changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { getBlankOption } from 'src/app/shared-module/utilities/helper-utils';

@Component({
  selector: 'app-container-info-popup',
  templateUrl: './container-info-popup.component.html',
  styleUrls: ['./container-info-popup.component.scss']
})
export class ContainerInfoPopupComponent implements OnInit {

  workOrderId = ''
  containerInfoForm: FormGroup;
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
    containerSize: []
  }
  sizeOptions = [
    {
      value: 0,
      label: '20ft'  // size options has been chnaged .. check container info table or add container module
    },
    {
      value: 1,
      label: '40ft'
    },
    {
      value: 2,
      label: ''
    }]
  containerTypeList = []
  containerHandlingOptions = [
    {
      value: 0,
      label: ''
    },
    {
      value: 1,
      label: 'Grounding'
    },
    {
      value: 2,
      label: 'Cutting'
    },
    {
      value: 3,
      label: 'Live Loading'
    },

  ]

  containerList = [];
  apiError=''
  isUpdated=false;
  timeoutId;


  constructor(private fb: FormBuilder, private _workOrderV2Service: WorkOrderV2Service, private _commonService: CommonService, private _containerService: ContainerService,
    private dialogRef: DialogRef<boolean>, @Inject(DIALOG_DATA) private data: any) { }

  ngOnInit(): void {
    this.workOrderId = this.data.workOrderId;    
    this.containerInfoForm = this.fb.group({
      selectedAll : [false],
      salesOrderContainersDetailsList: this.fb.array([])
    });
    this.getContainerTypes();
    this.settingsUrl = `revenue/workorder/${this.workOrderId}/container/setting/`
    this.getWorkOrderContainerSettings();
    this.getContainerDetails();
    // let selectedContainersData = this.data?.selectedContainersData;
    // selectedContainersData.forEach((item)=>{

    // })
  }

  get salesOrderContainersDetailsList(): FormArray {
    return this.containerInfoForm.get('salesOrderContainersDetailsList') as FormArray;
  }

  getWorkOrderContainerSettings() {
    this._workOrderV2Service.getWorkorderContainerTableSettings(this.workOrderId).subscribe(resp => {
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

  getWorkOrderContainerData() {
    this.salesOrderContainersDetailsList.controls = [];
    this._workOrderV2Service.getWorkorderContainerData(this.workOrderId).subscribe(response => {
      this.patchContainerDetails(response['result'])
    });
  }

  patchContainerDetails(data) {
    const containerData = data
    this.initialValues.containerName = [];
    this.initialValues.containerSize = [];
    this.initialValues.containerType = [];
    this.initialValues.handlingType = [];
    containerData.forEach((containerInfo, index) => {
      this.addFormGroup();
      this.changeDateAndTimeWithTimeZone(containerInfo)
      this.initialValues.containerName.push(getBlankOption())
      this.initialValues.containerSize.push(getBlankOption())
      this.initialValues.containerType.push(getBlankOption())
      this.initialValues.handlingType.push(getBlankOption())
      if (containerInfo['container']) {
        this.initialValues.containerName[index] = { label: containerInfo['container']['label'], value: '' }
        containerInfo['container'] = containerInfo['container']['id']
      }
      if (containerInfo['type']) {
        this.initialValues.containerType[index] = { label: containerInfo['type']['label'], value: '' }
        containerInfo['type'] = containerInfo['type']['id']
      }
      this.initialValues.handlingType[index] = this.containerHandlingOptions[containerInfo['handling_type']]
      this.initialValues.containerSize[index] = this.sizeOptions[containerInfo['size']]
      this.salesOrderContainersDetailsList.at(index).patchValue(containerInfo)

    });
  }

  createFormGroup(): FormGroup {
    const group: any = {};

    this.structureList.forEach(item => {
      if (item.field_type === 'location_dropdown') {
        group[item.id] = this.createLocationFormGroup();
      } else if (item.field_type === 'duration') {
        group[item.id] = this.createHaltTimeFormGroup();
      }
      else {
        group['containerSelected'] = this.fb.control(false)
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
      case 'container_type_dropdown':
        return this.fb.control(null);
      case 'container_size_dropdown':
        return this.fb.control(2);
      case 'date':
        return this.fb.control(null);
      case 'datetime':
        return this.fb.control(null);
      case 'dropdown':
        return this.fb.control(null);
      default:
        return this.fb.control(null);
    }
  }

  createLocationFormGroup(): FormGroup {
    return this.fb.group({
      name: this.fb.control(''),
      lng: this.fb.control(''),
      lat: this.fb.control(''),
      alias: this.fb.control('')
    });
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
  }

  listViewSettingsData(e) {
    this.isOpenSettings = false;
    if (e['isSettingApplied']) {
      this.getWorkOrderContainerSettings()
    }
  }

  locationSelected(e, i, key) {
    const locationObj=this.salesOrderContainersDetailsList.at(i).get(key).value
    this.salesOrderContainersDetailsList.at(i).get(key).patchValue(e['value'])
    if (locationObj['name']!=e['value']['name']) {
      this.editContainerRowData(i)
    }
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
   if(!hasDuplicateNames(this.salesOrderContainersDetailsList.value,'name')){
     this.updateContainerDetails('edit_remove', orderNumber, '')
     this.apiError=''
   }else{
    this.apiError='Container number already Exist'
   }
  }

  cloneRowContainerData() {
    this.updateContainerDetails('clone', this.selectedOrder, '')
  }

  cloumnClone(key,i){
    this.updateContainerDetails('column_clone',i,key);
    if(key=='container'){
      const containerForm= this.salesOrderContainersDetailsList.at(i) as FormGroup
      if(containerForm.controls.hasOwnProperty('type')){
        this.updateContainerDetails('column_clone',i,'type');
      }
      if(containerForm.controls.hasOwnProperty('handling_type')){
        this.updateContainerDetails('column_clone',i,'handling_type');
      }
      if(containerForm.controls.hasOwnProperty('size')){
        this.updateContainerDetails('column_clone',i,'size');
      }
      if(containerForm.controls.hasOwnProperty('gross_weight')){
        this.updateContainerDetails('column_clone',i,'gross_weight');
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
      this.initialValues.containerSize[i] = this.sizeOptions[containerDetails['size']]
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
        let cloneData=this.preparePayload(this.salesOrderContainersDetailsList.at(orderNumber).value)
        cloneData['name']=''
        payload = {
          action: 'add_clone',
          order_no: orderNumber + 2,
          data: this.preparePayload(cloneData)
        }
        this._workOrderV2Service.putContainerDetails(this.workOrderId, payload).subscribe(resp => {
          this.isUpdated=true;
          if(this.timeoutId){
            clearTimeout(this.timeoutId)
          }
          this.timeoutId=setTimeout(() => {
            this.isUpdated=false
          }, 2000);
          const rowData = this.salesOrderContainersDetailsList.at(this.selectedOrder).value
          this.salesOrderContainersDetailsList.insert(this.selectedOrder + 1, this.createFormGroup());
          this.salesOrderContainersDetailsList.at(this.selectedOrder + 1).patchValue(rowData)
          const containerForm= this.salesOrderContainersDetailsList.at(this.selectedOrder + 1) as FormGroup
          this.setControlValueIfExists(containerForm, 'name', '');
          if (containerForm.controls.hasOwnProperty('container')) {
            const containerObj=this.containerList.find(container=>container.id==containerForm.value['container'])
            this.initialValues.containerName.splice(orderNumber+1, 0, {label:containerObj['name'],value:containerObj['id']})
            this.initialValues.containerName[orderNumber+1]={label:containerObj['name'],value:containerObj['id']}
          }
          if (containerForm.controls.hasOwnProperty('handling_type')) {
              this.initialValues.handlingType.splice(orderNumber+1, 0,this.containerHandlingOptions[containerForm.value['handling_type']])

          }
          if (containerForm.controls.hasOwnProperty('size')) {
            this.initialValues.containerSize.splice(orderNumber+1, 0,this.sizeOptions[containerForm.value['size']])
          }
          if (containerForm.controls.hasOwnProperty('type')) {
            const typeObj=this.containerTypeList.find(container=>container.id==containerForm.value['type'])
            this.initialValues.containerType.splice(orderNumber+1, 0,{label:typeObj['label'],value:typeObj['id']})
          }
        },error=>{
          this.isUpdated=false
        });
        break;
      case 'add':
        payload = {
          action: 'add_clone',
          order_no: orderNumber + 2,
          data: this.preparePayload(this.createFormGroup().value)
        }
        this._workOrderV2Service.putContainerDetails(this.workOrderId, payload).subscribe(resp => {
          this.isUpdated=true
          if(this.timeoutId){
            clearTimeout(this.timeoutId)
          }
          
          this.timeoutId=setTimeout(() => {
            this.isUpdated=false
          }, 2000);
          this.salesOrderContainersDetailsList.insert(orderNumber + 1, this.createFormGroup());
          this.initialValues.containerName.splice(orderNumber+1, 0,(getBlankOption()))
          this.initialValues.containerSize.splice(orderNumber+1, 0,(getBlankOption()))
          this.initialValues.containerType.splice(orderNumber+1, 0,(getBlankOption()))
          this.initialValues.handlingType.splice(orderNumber+1, 0,(getBlankOption()))
        },error=>{
         this.isUpdated=false
        })
        break;
      case 'edit_remove':
        payload = {
          action: 'edit_remove',
          order_no: orderNumber + 1,
          data: this.preparePayload(this.salesOrderContainersDetailsList.at(orderNumber).value)
        }
        this._workOrderV2Service.putContainerDetails(this.workOrderId, payload).subscribe(resp => {
          this.isUpdated=true
          if(this.timeoutId){
            clearTimeout(this.timeoutId)
          }
          this.timeoutId=setTimeout(() => {
            this.isUpdated=false
          }, 2000);
        },error=>{
          this.isUpdated=false
        })
        break;
      case 'delete':
        payload = {
          action: type,
          order_no: orderNumber + 1,
          data: {}
        }
        this._workOrderV2Service.putContainerDetails(this.workOrderId, payload).subscribe(resp => {
          this.isUpdated=true
          if(this.timeoutId){
            clearTimeout(this.timeoutId)
          }
          this.timeoutId=setTimeout(() => {
            this.isUpdated=false
          }, 2000);
          this.deleteContainerRow(orderNumber)
          this.initialValues.containerName.splice(orderNumber, 1)
          this.initialValues.containerSize.splice(orderNumber, 1)
          this.initialValues.containerType.splice(orderNumber, 1)
          this.initialValues.handlingType.splice(orderNumber, 1)
        },error=>{
          this.isUpdated=false
        })
        break;
      case 'column_clone':
        const clonedValue=this.salesOrderContainersDetailsList.at(orderNumber).value[key]
        payload = {
          action: type,
          order_no: orderNumber+1,
          data: {
            [key]: clonedValue
          }
        }
        this._workOrderV2Service.putContainerDetails(this.workOrderId, payload).subscribe(resp => {
          this.salesOrderContainersDetailsList.controls.forEach((containerForm,index) => {
            if(index>orderNumber){
              if(key=='container'){
                const containerDetails = this.containerList.find(container => container.id == clonedValue)
                this.initialValues.containerName[index]={label:containerDetails['name'],value:''}
              }
              if(key=='type'){
                const typeObj=this.containerTypeList.find(containerType=>containerType.id==clonedValue)
                if(typeObj)
                this.initialValues.containerType[index]={label:typeObj['label'],value:typeObj['id']}
              }
              if(key=='size'){
                this.initialValues.containerSize[index]=this.sizeOptions[clonedValue]
              }
              if(key=='handling_type'){
                this.initialValues.handlingType[index]=this.containerHandlingOptions[clonedValue]
              }
              containerForm.get(key).setValue(clonedValue)
            }
          });
          this.isUpdated=true
          if(this.timeoutId){
            clearTimeout(this.timeoutId)
          }
          this.timeoutId=setTimeout(() => {
            this.isUpdated=false
          }, 2000);
         
        },error=>{
          this.isUpdated=false
        })
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

  cancel(){
    this.dialogRef.close(false);
  }
  save(){
    let selectedContainer=[];
    const charges = this.containerInfoForm.controls['salesOrderContainersDetailsList'] as UntypedFormArray;
    charges.controls.forEach(form=>{
      if(form.get('containerSelected').value){
      selectedContainer.push(form.value)
      }
    });
    let data:any = {
      selectedContainer : selectedContainer ,
    }
   this.dialogRef.close(data)
  }

  selectAllContainers(){
    let isAllSelected = this.containerInfoForm.controls.selectedAll.value;
    const containers = this.containerInfoForm.controls['salesOrderContainersDetailsList'] as UntypedFormArray;
    containers.controls.forEach(form=>{
      form.get('containerSelected').setValue(isAllSelected)
    });
  } 

  containerSelectionChecked(){
    const charges = this.containerInfoForm.controls['salesOrderContainersDetailsList'] as UntypedFormArray;
    const allSelected= charges.value.every(item => item.containerSelected === true)
    this.containerInfoForm.controls.selectedAll.setValue(allSelected)
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


