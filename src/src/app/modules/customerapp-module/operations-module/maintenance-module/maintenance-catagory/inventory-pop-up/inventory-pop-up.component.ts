import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl,  UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { OperationConstants, ScreenConstants } from 'src/app/core/constants/data-analytics.constants';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { CommonService } from 'src/app/core/services/common.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { TerminologiesService } from 'src/app/core/services/terminologies.service';
import { VehicleService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/vehicle.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { getObjectFromList, isValidValue, trimExtraSpaceBtwWords } from 'src/app/shared-module/utilities/helper-utils';
import { MaintenanceService } from '../../operations-maintenance.service';

@Component({
  selector: 'app-inventory-pop-up',
  templateUrl: './inventory-pop-up.component.html',
  styleUrls: ['./inventory-pop-up.component.scss']
})
export class InventoryPopUpComponent implements OnInit {
  @Input()addInventory;
  @Input()jobCardDetails;
  @Input()isInventoryEdit=false;
  @Input()inventoryEditId='';
  @Output() dataFormAddInventory=new EventEmitter(false)
  addInventoryForm:UntypedFormGroup;
  tyreManufacturer=[];
  staticOptions={
      threadType:[],
      tyreManufacturer:[],
      tyreSentFor:[],
  }
  modelParams = {
    name: ''
  };
  modelApi=[];
  modelList=[];
  showAddPartyPopup: any = {name: '', status: false};
  partyNamePopup: string = '';
  initialValues={
    vendor:{},
    item:[],
    vehicleTyrePositions:[],
    make:[],
    position:[],
    model:[],
    errorMessage:{
      position_no:false,
      position:false,
      unique_no:false,
      },
  }
  currency_type:any;
  vehicleMakeParam: any = {};
  vehicleMakeUrl = TSAPIRoutes.vehicle_make;
  terminology :any;
  isInventorySpareListOpen:boolean=false
  isInventoryTyreListOpen:boolean=false
  positionError='';
  inventoryEditDetails:any;
  maintenancePermission= Permission.maintenance.toString().split(',');
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;


  constructor(private _fb:UntypedFormBuilder,private _vehicleService: VehicleService,
    private _commonService: CommonService,private currency: CurrencyService,private _analytics:AnalyticsService,
    private _maintenanceService:MaintenanceService,private _terminologiesService:TerminologiesService) {
      this.currency_type = this.currency.getCurrency();
      this.terminology = this._terminologiesService.terminologie;
    }

  ngOnInit(): void {
    this.buildForm();
    if(this.isInventoryEdit){
      this._maintenanceService.getJobCardNewInventory(this.inventoryEditId).subscribe(resp=>{
        this.inventoryEditDetails =resp.result
        this.patchInventory();
      })
    }
  }
  onClickCancel(){
    this.addInventory.show = false
  }
  saveMaintenance(){
    let form =this.addInventoryForm
    if(form.valid && (form.value['tyre_change_inventory'].length ||form.value['spare_inventory'].length)){
      form.value['jobcard']=this.jobCardDetails.id
      if(this.isInventoryEdit){
        this._maintenanceService.putJobCardNewInventory(this.inventoryEditId,form.value).subscribe(data=>{
          this._analytics.addEvent(this.analyticsType.UPDATED,this.analyticsScreen.JOBCARD);
          this._analytics.addEvent(this.analyticsType.UPDATED,this.analyticsScreen.JOBCARDINVENTORY);
          this.dataFormAddInventory.next(true);
          this.addInventory.show = false
         },err=>{
          console.log(err.error)
         });
      }else{
         this._maintenanceService.postJobCardNewInventory(form.value).subscribe(data=>{
          this._analytics.addEvent(this.analyticsType.UPDATED,this.analyticsScreen.JOBCARD);
          this._analytics.addEvent(this.analyticsType.CREATED,this.analyticsScreen.JOBCARDINVENTORY);
          this.dataFormAddInventory.next(true);
          this.addInventory.show = false
         },err=>{
          console.log(err.error)
         });
      }

    }else{
      this.setAsTouched(form)
      console.log(form)
    }

  }

  openAddSpare(){
    this.isInventorySpareListOpen = true
  }

  openAddTyre(){
    this.isInventoryTyreListOpen = true
  }

  inventorySpareDetails(e){
    if('id' in e.data){
      this.initialValues.item.push({label:e.data.item_name})
      let spareDetials={
        item:e.data.id,
        quantity: e.data.in_stock,
      }
      this.addInventorySpareItem([spareDetials]);
    }
    this.isInventorySpareListOpen = false
  }

  inventoryTyreDetails(e){
    if('id' in e.data && e.data.manufacturer ){
     this.initialValues.make.push({label:e.data.manufacturer.label});
     this.initialValues.model.push({label:e.data.model.name});
     this.initialValues.position.push({});
      let tyreDetails={
       tyre_model:e.data.model.id,
       position:'',
       changed_tyre:e.data.id,
       manufacturer:e.data.manufacturer.id,
       changed_unique_no:e.data.unique_no

      }
      this.addInventoryTyreItem([tyreDetails]);
      const tyreChangearray = this.addInventoryForm.controls['tyre_change_inventory'] as UntypedFormArray;
      let lastTyreChangeForm=tyreChangearray.controls[tyreChangearray.controls.length-1];
      this.onMakeChange(lastTyreChangeForm,tyreChangearray.controls.length-1)

    }
   this.isInventoryTyreListOpen = false
  }

  buildForm(){
    this.addInventoryForm = this._fb.group({
      tyre_change_inventory:this._fb.array([]),
      spare_inventory:this._fb.array([]),
      jobcard:'',
      id:null,
    })
  }


  removeTyreChange(i){
    const tyreChangearray = this.addInventoryForm.controls['tyre_change_inventory'] as UntypedFormArray;
    tyreChangearray.removeAt(i);
    if(tyreChangearray.controls.length){
      this.changeOldUniqueNo(tyreChangearray.controls[tyreChangearray.controls.length-1]);
    }
    this.modelList.splice(i,1);
    this.modelApi.splice(i,1);
    this.initialValues.position.splice(i,1);
    this.initialValues.make.splice(i,1);
    this.initialValues.model.splice(i,1);
  }

  addInventoryTyreItem(tyre:Array<any>){
    if (tyre.length == 0) {
      this.modelList.push([]);
      this.modelApi.push('');
      this.addInventoryTyreItem([{}])
    }
    const tyreChangearray = this.addInventoryForm.controls['tyre_change_inventory'] as UntypedFormArray;
    tyre.forEach((item) => {
      const arrayItem = this.buildTyreChange(item);
      tyreChangearray.push(arrayItem);
      this.modelList.push([]);
      this.modelApi.push('');
    });
  }

  removeInventorySpare(i) {
    const array = this.addInventoryForm.controls['spare_inventory'] as UntypedFormArray;
    array.removeAt(i);
    this.initialValues.item.splice(i,1);
  }


  addInventorySpareItem(service:Array<any>) {
    if (service.length == 0) {
      this.addInventorySpareItem([{}])
    }
    const servicearray = this.addInventoryForm.controls['spare_inventory'] as UntypedFormArray;
    service.forEach((item) => {
      const arrayItem = this.buildInventorySpare(item);
      servicearray.push(arrayItem);
    });
  }

  buildInventorySpare(item) {
    return this._fb.group({
      id:[item.id||null],
      item:[item.item||null],
      quantity:[item.quantity||0.00,[Validators.min(0.9999)]],
    });
  }

  buildTyreChange(item){
    return this._fb.group({
      id: [
        item.id || null
      ],
      tyre_model: [
        item.tyre_model || null,[Validators.required]
      ],
      position: [
        item.position || null,
        [Validators.required]
      ],
      manufacturer: [
        item.manufacturer || null,[Validators.required]
      ],
      changed_tyre: [
        item.changed_tyre || null, [Validators.required]
      ],
      changed_unique_no: [item.changed_unique_no || "", Validators.required],
      position_used: [false],
      present_unique_no: [ item.present_unique_no || '', [RxwebValidators.unique(), Validators.required, Validators.pattern('^[a-zA-Z0-9_]*$')]],
      present_unique_no_edit:false,
      present_unique_no_status:false
    });
  }

		openAddPartyModal($event ) {
			if ($event)
				this.showAddPartyPopup = {name: this.partyNamePopup, status: true};
		}

		addValueToPartyPopup(event){
		if (event) {
				const val = trimExtraSpaceBtwWords(event);
				const arrStr = val.toLowerCase().split(' ');
				const titleCaseArr:string[] = [];
				for (const str of arrStr) {
					titleCaseArr.push(str.charAt(0).toUpperCase() + str.slice(1));
				}
				const word_joined = titleCaseArr.join(' ');
			   this.partyNamePopup = word_joined;
				}
		}



    addErrorClass(controlName: AbstractControl) {
      return TransportValidator.addErrorClass(controlName);
    }

    setAsTouched(group: UntypedFormGroup | UntypedFormArray) {
      group.markAsTouched();
      for (let i in group.controls) {
        if (group.controls[i] instanceof UntypedFormControl) {
          group.controls[i].markAsTouched();
        } else {
          this.setAsTouched(group.controls[i]);
        }
      }
    }

    addTyreChange(){
      if(this.jobCardDetails.vehicle){
        this.getTyrePositions(this.jobCardDetails.vehicle.id)
      }

    }

    getTyrePositions(vehicleId) {
      this._vehicleService.getVehicleTyres(vehicleId).subscribe((response) => {
        this.initialValues.vehicleTyrePositions= response.result;
        this.initialValues.errorMessage.position = false;
        if (response.result.length == 0) {
          this.initialValues.errorMessage.position = true;
          setTimeout(() => {
            this.initialValues.errorMessage.position = false;
          }, 4000);
        }else{
          this.getTyreChangeDetails();
          this.isInventoryTyreListOpen = true;
        }
      });
    }


    getTyreChangeDetails(){
      this._commonService.getStaticOptions('tyre-manufacturer').subscribe((response) => {
          this.tyreManufacturer = response.result['tyre-manufacturer'];
        });
    }

    onMakeChange(form,index) {
      this._vehicleService.getModel(form.get("manufacturer").value).subscribe(data => {
        this.modelApi[index] = 'vehicle/tyre/manufacturer/' + form.get("manufacturer").value + '/model/'
        this.modelList[index] = data.result;
      });
    }




    getNewModel(data,index,tyreChange: UntypedFormGroup) {
      if (isValidValue(data)) {
        tyreChange.get('tyre_model').setValue(data.id);
        this.onMakeChange(tyreChange,index)
      }
    }

    addNewModel($event) {
      this.modelParams = { name: $event };
    }

  onTyreSelect(tyreChange,i) {
    let date = changeDateToServerFormat(this.jobCardDetails.start_date)
      let vehicle = this.jobCardDetails.vehicle.id;
      let position =  tyreChange.get('position').value;
     this._maintenanceService.validatePosition(date,vehicle,position).subscribe(data=>{
      for (let i = 0; i < this.initialValues.vehicleTyrePositions.length; i++) {
        this.initialValues.vehicleTyrePositions.filter((data) => {
          if (tyreChange.get('position').value === data.id) {
            tyreChange.get('present_unique_no').setValue(data.unique_no);
            this.changeOldUniqueNo(tyreChange);
          }
        });
      }
       if (!this.checkPositionUniqeueness()) {
          tyreChange.get('position_used').setValue(true)
          this.initialValues.errorMessage.position_no = true;

        } else {
          tyreChange.get('position_used').setValue(false)
          this.initialValues.errorMessage.position_no = false;
        }
      },err=>{
        if( err.error.message.includes("Cannot select this position")){
          this.initialValues.vehicleTyrePositions.filter((data) => {
            if (tyreChange.get('position').value === data.id) {
              let tyre_position=data.tyre_position.label
              tyreChange.get('position').setValue(null);
              tyreChange.get('present_unique_no').setValue(null);
              this.initialValues.position[i]={};
              this.positionError = tyre_position;
              setTimeout(() => {
                this.positionError ='';
              }, 4000);
            }
          });
        }
      })


    }

    checkPositionUniqeueness() {
      let positionList = []
      let unique = true;
      const tyre_change_inventory = this.addInventoryForm.get('tyre_change_inventory') as UntypedFormArray;
      for (const items of tyre_change_inventory['controls']) {
        if (items['controls'].position.value != ' ' && items['controls'].position.value != null) {
          let value = items['controls'].position.value.trim()
          positionList.push(value)
        }
      }
      for (let i = 0; i < positionList.length; i++) {
        for (let j = i + 1; j < positionList.length; j++) {
          if (JSON.stringify(positionList[i]) == JSON.stringify(positionList[j])) {
            unique = false;
          }
        }
      }

      if (unique) {
        return true
      } else {
        return false
      }
    }

    changeOldUniqueNo(tyreChange) {
      const tyreId = this.getTyreIdFromPosition(tyreChange);
      let uniqueNumber = tyreChange.get('present_unique_no').value;
      let position = tyreChange.get('position').value
      if (uniqueNumber != '') {
        if (this.checkUnqueNumberUnique()) {
          if (position) {
            this._maintenanceService.getUniqueNumber(uniqueNumber, tyreId).subscribe(data => {
              if (data.result.exists) {
                tyreChange.get('present_unique_no_status').setValue(true);
                this.initialValues.errorMessage.unique_no = true;
              } else {
                tyreChange.get('present_unique_no_status').setValue(false);
                this.initialValues.errorMessage.unique_no = false;
              }
            })
          }
        } else {
          tyreChange.get('present_unique_no_status').setValue(true);
          this.initialValues.errorMessage.unique_no = true;
        }
      } else {
        tyreChange.get('present_unique_no_status').setValue(false);
        this.initialValues.errorMessage.unique_no = false;
      }
    }
    getTyreIdFromPosition(tyreChange){
      let position = {tyre_id: ""}
      const positionId = tyreChange.get('position').value;
      position = getObjectFromList(positionId, this.initialValues.vehicleTyrePositions);
      if(isValidValue(position)){
        return position.tyre_id;
      }else{
        return ' '
      }
    }

    checkUnqueNumberUnique() {
      let vehicleTyres = [];
      let unique = true;
      const tyre_change = this.addInventoryForm.get('tyre_change_inventory')as UntypedFormArray;
        for (const items of tyre_change['controls']) {
          if (items['controls'].changed_unique_no.value != '' && items['controls'].changed_unique_no.value != null) {
            vehicleTyres.push(items['controls'].changed_unique_no.value)
          }
          if (items['controls'].present_unique_no.value != '' && items['controls'].present_unique_no.value != null) {
            vehicleTyres.push(items['controls'].present_unique_no.value)
          }
        }
        let valuesAlreadySeen = [];
        for (let i = 0; i < vehicleTyres.length; i++) {
          let value = vehicleTyres[i]
          if (valuesAlreadySeen.indexOf(value) !== -1) {
            unique = false
          }
          valuesAlreadySeen.push(value)
        }

        if (unique) {
          return true
        } else {
          return false
        }
    }

    getNewVehicleMake(event,index,tyreChange) {
      if (event) {
        this._commonService.getStaticOptions('tyre-manufacturer').subscribe((response) => {
          this.tyreManufacturer = response.result['tyre-manufacturer'];
          tyreChange.get('manufacturer').setValue(event.id);
          this.tyreManufacturer = response.result;
          this.modelList[index]= [];
        });
      }
    }



    addNewVehicleMake(event) {
      if (event) {
        const arrStr = event.toLowerCase().split(' ');
        const titleCaseArr:string[] = [];
        for (const str of arrStr) {
          titleCaseArr.push(str.charAt(0).toUpperCase() + str.slice(1));
        }
        const word_joined = titleCaseArr.join(' ');
        this.vehicleMakeParam = {
          make_name: word_joined
        };
      }
    }

    patchInventory(){
      let form = this.addInventoryForm;
      form.patchValue(this.inventoryEditDetails);
      if(this.inventoryEditDetails.spare_inventory.length){
        this.patchSpares(this.inventoryEditDetails.spare_inventory)
      }
      if(this.inventoryEditDetails.tyre_change_inventory.length){
        this.patchTyreChange(this.inventoryEditDetails.tyre_change_inventory)
      }
    }

    patchSpares(spareData:Array<any>){
      this.initialValues.item=[];
      spareData.forEach(spareItems=>{
        this.initialValues.item.push({label:spareItems.item.name})
        let spareDetials={
        item:spareItems.item.id,
          id:spareItems.id,
        quantity:spareItems.quantity,
      }
         this.addInventorySpareItem([spareDetials]);
      });
    }

    patchTyreChange(tyreChangeData:Array<any>){
      this.getTyreChangeDetails();
      this.initialValues.make=[];
      this.initialValues.model=[];
      this.initialValues.position=[];
      tyreChangeData.forEach(tyreChangeItems=>{
      this.initialValues.make.push({label:tyreChangeItems.manufacturer.label});
      this.initialValues.model.push({label:tyreChangeItems.tyre_model.name});
      this.initialValues.position.push({label:tyreChangeItems.position.label});
       let tyreDetails={
        tyre_model:tyreChangeItems.tyre_model.id,
        position:tyreChangeItems.position.id,
        changed_tyre:tyreChangeItems.changed_tyre.id,
        manufacturer:tyreChangeItems.manufacturer.id,
        changed_unique_no:tyreChangeItems.changed_unique_no,
        present_unique_no:tyreChangeItems.present_unique_no,
        id:tyreChangeItems.id

       }
       this.addInventoryTyreItem([tyreDetails]);
       const tyreChangearray = this.addInventoryForm.controls['tyre_change_inventory'] as UntypedFormArray;
       let lastTyreChangeForm=tyreChangearray.controls[tyreChangearray.controls.length-1];
       this.onMakeChange(lastTyreChangeForm,tyreChangearray.controls.length-1)
      });
    }


}
