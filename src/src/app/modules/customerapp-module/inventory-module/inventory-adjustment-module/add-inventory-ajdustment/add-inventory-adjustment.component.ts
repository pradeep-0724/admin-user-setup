import { InventoryServicesService } from '../../../api-services/inventory-adjustment-service/inventory-services-adjustment.service';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray, AbstractControl, UntypedFormControl } from '@angular/forms';
import { getBlankOption} from 'src/app/shared-module/utilities/helper-utils';
import { ErrorList } from 'src/app/core/constants/error-list';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { EmployeeService } from 'src/app/modules/customerapp-module/api-services/master-module-services/employee-service/employee-service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';


@Component({
  selector: 'app-add-inventory',
  templateUrl: './add-inventory-adjustment.component.html',
  styleUrls: ['./add-inventory-adjustment.component.scss'],
})
export class AddInventoryAdjustmentComponent implements OnInit {
  inventoryForm: UntypedFormGroup;
  errorHeaderMessage = new ErrorList().headerMessage;
  possibleErrors = new ErrorList().possibleErrors;
  isFormValid=new BehaviorSubject({});
  globalFormErrorList: any = [];
  inventoryData = new BehaviorSubject({})
  radioOptions=[{
    name:"Spares Adjustment",
    value:'new_spares'
  },
  {
    name:"Tyres Adjustment",
    value:'new_tyres'
  }]
  employeeList: any = [];
  itemDataForm;
  prefixUrl: any;
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;
  screenType=ScreenType;

  constructor(
    private _fb: UntypedFormBuilder,
    private _employeeService:EmployeeService,
    private _postMasterInventory:InventoryServicesService,
    private _route:Router,
    private _analytics:AnalyticsService,
    private _prefixUrl:PrefixUrlService
  ) { }

  ngOnInit() {
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.INVENTORYADJUSTMENTBILL,this.screenType.ADD,"Navigated");
    this.prefixUrl = this._prefixUrl.getprefixUrl();
    this.buildAllForm();
    this.getEmployee();

    this.inventoryForm.controls['stockDate'].setValue(new Date(dateWithTimeZone()));

  }

  buildAllForm(){
    this.inventoryForm = this._fb.group({
      stockDate: [
        null,
        Validators.required
      ],
      comments: [
        ''
      ],
      employee:[
        ''
      ],
      documents: [[]],
      reason:[''],
      employee_options:getBlankOption(),
      selectedOptionType:['new_spares']
    });
  }

  setFormGlobalErrors() {
    this.globalFormErrorList = [];
    let errorIds = Object.keys(this.possibleErrors);
    console.log(errorIds);
    for (let prop of errorIds) {
        const error = this.possibleErrors[prop];
        if (error.status == true) {
          this.globalFormErrorList.push(error.message);
        }
    }
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  getEmployee() {
		this._employeeService.getEmployeeList().subscribe((employeeList) => {
			this.employeeList = employeeList;
		});
  }

  ItemsDataForm(dataForm) {
    this.itemDataForm=dataForm;
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

  onDateSelection(){
    this.inventoryData.next({stockDate: this.inventoryForm.get('stockDate').value});
  }

  saveSpare(){
    let form = this.inventoryForm;
    if(this.itemDataForm.valid){
        if(form.valid){
         this._postMasterInventory.postMasterInventory(this.getPayLoad(form)).subscribe(data=>{
          this._analytics.addEvent(this.analyticsType.CREATED,this.analyticsScreen.INVENTORYADJUSTMENTBILL)
           if(form.value['selectedOptionType'] === "new_spares"){
             this._route.navigate([this.prefixUrl+'/inventory/list/inventory-adjustment-spare']);
           }else{
            this._route.navigate([this.prefixUrl+'/inventory/list/inventory-adjustment-tyre']);
           }
         })
        }else{
           this.setAsTouched(form);
        }
    } else {
      this.setFormGlobalErrors();
      this.setAsTouched(form);
      this.isFormValid.next(false);
    }
  }

  getPayLoad(form){
    let dataForm=this.itemDataForm;
    let paylaod={
      stock_date:changeDateToServerFormat(form.value['stockDate']),
      employee:form.value['employee'],
      is_new_spare:form.value['selectedOptionType'] === "new_spares" ?true:false,
      is_new_tyre: form.value['selectedOptionType'] === "new_tyres" ?true:false,
      tyre_hsn_code:'',
      comments: form.value['comments'],
      reason:form.value['reason'],
      documents: form.value['documents'],
      items:getSparItem(dataForm),
      tyres:getTyreItem(dataForm),
    }

    function getSparItem(dataForm){
      let spareItems=[];
      if(form.value['selectedOptionType'] === "new_spares")
      {
      dataForm.value['new_spares'].forEach(item => {
        spareItems.push({
          item: item.item_name,
          rate:Number(item.rate),
          quantity_available:Number(item.quantity),
          new_quantity:Number(item.newquantity),
          adjustment:Number(item.adjustment),
          total: Number(item.total),
          hsn_code:item.hsn_code,
          note:item.note,
        });
      });
      return spareItems;
      }else{
        return spareItems;
      }
    }

    function getTyreItem(dataForm){
      let tyreItems=[];
      if(form.value['selectedOptionType'] === "new_tyres")
      {
        dataForm.value['new_tyre'].forEach(item => {
          tyreItems.push(
            {
              manufacturer:item.manufacturer,
              tyre_model: item.model,
              thread_type:item.thread_type,
              unique_no: item.unique_number,
              tyre: item.tyre,
              total:item.total,
              note:item.note,
              is_add:item.action == 'add' ? true:false
           })
        });
        return tyreItems;
      }else{
        return tyreItems;
      }
    }
    if(form.value['selectedOptionType'] === "new_tyres"){
      paylaod['tyre_hsn_code']= dataForm.value['hsn_code']
    }
    return  paylaod
  }

  onRadioButtonChange(){
    this.isFormValid.next(true);
  }
}
