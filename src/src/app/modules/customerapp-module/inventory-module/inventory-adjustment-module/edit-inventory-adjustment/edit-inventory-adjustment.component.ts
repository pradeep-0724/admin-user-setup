import { InventoryServicesService } from '../../../api-services/inventory-adjustment-service/inventory-services-adjustment.service';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray, AbstractControl, UntypedFormControl } from '@angular/forms';
import { getBlankOption} from 'src/app/shared-module/utilities/helper-utils';
import { ErrorList } from 'src/app/core/constants/error-list';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { EmployeeService } from 'src/app/modules/customerapp-module/api-services/master-module-services/employee-service/employee-service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { OperationConstants, ScreenConstants } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
@Component({
  selector: 'app-edit-inventory',
  templateUrl: './edit-inventory-adjustment.component.html',
  styleUrls: ['./edit-inventory-adjustment.component.scss'],
})
export class EditInventoryAdjustmentComponent implements OnInit {
  editInventoryForm: UntypedFormGroup;
  errorHeaderMessage = new ErrorList().headerMessage;
  possibleErrors = new ErrorList().possibleErrors;
  globalFormErrorList: any = [];
  spareData=new BehaviorSubject([]);
  tyreData= new BehaviorSubject([]);
  isFormValid=new BehaviorSubject({});
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
  inventoryId;
  inventoryData = new BehaviorSubject({});
  prefixUrl: string;
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;
  constructor(
    private _fb: UntypedFormBuilder,
    private _employeeService: EmployeeService,
    private _masterInventory:InventoryServicesService,
    private _route:Router,
    private _analytics:AnalyticsService,
    private _activatedroute: ActivatedRoute,
    private _prefixUrl:PrefixUrlService
  ) { }

  onDateSelection(){
    this.inventoryData.next({stockDate: this.editInventoryForm.get('stockDate').value});
  }

  ngOnInit() {
    this.prefixUrl = this._prefixUrl.getprefixUrl();
    this._activatedroute.params.subscribe((params)=>{
      this.inventoryId=params.id;
      this.buildAllForm();
      this.getEmployee();
      this.getMasterInventoryDetails();
    })
  }

  buildAllForm(){
    this.editInventoryForm = this._fb.group({
      stockDate: [
        null,
        Validators.required
      ],
      comments: [
        ''
      ],
      reason:[''],
      employee:[
        ''
      ],
      documents: [[]],
      employee_options:getBlankOption(),
      selectedOptionType:['new_spares']
    });
  }

  getMasterInventoryDetails(){
    this._masterInventory.getMasterInventoryDetails(this.inventoryId).subscribe((data:any)=>{
    this.patchForm(data.result);
    });
  }

  patchForm(data){
    let tyreData=data
    let spareDta=data.items
    this.tyreData.next(tyreData);
    this.spareData.next(spareDta);
    let form = this.editInventoryForm;
    form.patchValue({
      stockDate:data.stock_date,
      comments:data.comments,
      reason:data.reason,
      employee: data.employee ? data.employee.id : null,
      employee_options:this.getEmployeeOptions(data.employee),
      selectedOptionType:data.is_new_spare ? 'new_spares':'new_tyres'
    })
    this.inventoryData.next({stockDate: this.editInventoryForm.get('stockDate').value});
  }

  getEmployeeOptions(employee){
    if (employee) {
        return {label:employee.name, value:employee.id}
      }
    return getBlankOption();
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

  ItemsDataForm(dataForm){
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

  saveSpare(){
    let form = this.editInventoryForm;
    if(this.itemDataForm.valid){
        if(form.valid){
         this._masterInventory.putMasterInventory(this.getPayLoad(form),this.inventoryId).subscribe(data=>{
          this._analytics.addEvent(this.analyticsType.UPDATED,this.analyticsScreen.INVENTORYADJUSTMENTBILL)
          if(form.value['selectedOptionType'] === "new_spares"){
            this._route.navigate([this.prefixUrl+'/inventory/list/inventory-adjustment-spare']);
          }else{
           this._route.navigate([this.prefixUrl+'/inventory/list/inventory-adjustment-tyre']);
          }
         })
        }else{
           this.setAsTouched(form);
        }
    }else{
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
      is_new_tyre: form.value['selectedOptionType'] ==="new_tyres" ?true:false,
      tyre_hsn_code:'',
      documents: form.value['documents'],
      comments: form.value['comments'],
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
        })
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
              id: item.id,
              manufacturer:item.manufacturer,
              tyre_model: item.model,
              tyre: item.tyre,
              thread_type:item.thread_type,
              unique_no: item.unique_number,
              total:item.total,
              note:item.note,
              is_add:item.action=='add'?true:false
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

  onButtonChange(){
    this.isFormValid.next(true);
  }
}
