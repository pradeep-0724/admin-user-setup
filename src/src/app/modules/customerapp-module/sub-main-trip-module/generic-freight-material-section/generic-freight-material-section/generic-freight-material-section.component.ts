import { AfterViewInit, Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, UntypedFormArray, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { TaxService } from 'src/app/core/services/tax.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { setAsTouched, setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { getBlankOption, getNonTaxableOption, isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { QuotationV2Service } from '../../../api-services/trip-module-services/quotation-service/quotation-service-v2';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { CommonService } from 'src/app/core/services/common.service';
import { CompanyTripGetApiService } from '../../../revenue-module/trip-module/company-vehicle-module/company-trip-class/company-trip-service.service';
import { Dialog, DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { NewTripV2Service } from '../../../api-services/trip-module-services/trip-service/new-trip-v2.service';
import { TokenExpireService } from 'src/app/core/services/token-expire.service';
type workOrderFrightDataType = {
  total: number | string,
  billing: number | string,
  rate: number | string,
  quantity: number | string,
}
@Component({
  selector: 'app-generic-freight-material-section',
  templateUrl: './generic-freight-material-section.component.html',
  styleUrls: ['./generic-freight-material-section.component.scss']
})

export class GenericFreightMaterialSectionComponent implements OnInit ,AfterViewInit{

  unitList : any[] = [];
  materialList = [];
  billingTypeList : any[] = [
    {
      label : 'Quantity',
      value : 14
    },
    {
      label : 'Jobs',
      value : 10
    }
  ]
  billingForm : FormGroup;
  workOrderClientFrightData: Subject<workOrderFrightDataType> = new Subject();
  isDisableBillingTypes : boolean = false;
  isFormValidclientFright = new Subject();
  initialValues = {
    material:[],
    unit : [],
    weightUnit:[],
    volumeUnit:[],
    billingType : getBlankOption(),
    tax : getBlankOption()
  };
  taxOption = getNonTaxableOption();
  defaultTax = new ValidationConstants().defaultTax;
  isTax = false;
  taxOptions = [];
  totalSumErr = '';
  itemUnits=[]
  @Input() parentForm : FormGroup;
  @Input() isSubFormValid : Observable<boolean>;
  @Output() materailsFormValue = new EventEmitter();
  @Output() billingTypeChanged = new EventEmitter();

  @Input() editDetails? : Observable<any> ;
  @Input() showTax : boolean = false;
  @Input() disableBilling : boolean = false;
  @Input() showRateAndUnitsFields : boolean = false;
  @Input() areAllFieldsMandatory : boolean = false;
  selectedMaterial = [];
  currency_type
  constructor(private dialog :Dialog,private _commonService:CommonService, private _fb : FormBuilder,private _isTax: TaxService,private _quotationV2Service : QuotationV2Service,
    private currency: CurrencyService,private _companyTripGetApiService : CompanyTripGetApiService) { }

  ngAfterViewInit(): void {
      this.editDetails?.subscribe((ele)=>{
        if(isValidValue(ele)){
          if(isValidValue(ele['loose_cargo']['freights']['freights'][0])){
            this.initialValues.billingType = { label : ele['loose_cargo']['freights']['freights'][0]['billing']?.['label'] , value : ele['loose_cargo']['freights']['freights'][0]['billing']?.['index']};
              ele['loose_cargo']['freights']['freights'][0]['billing'] = ele['loose_cargo']['freights']['freights'][0]['billing']?.['index'];
            }
            this.billingForm.patchValue(ele['loose_cargo']['freights']['freights'][0]);
            this.billingForm.get('tax').setValue(ele['loose_cargo']['freights']?.['tax']?.['id']);
            this.initialValues.tax = ele['loose_cargo']['freights']?.['tax'];
            if(ele['loose_cargo']['materials'].length>0){
              ele['loose_cargo']['materials'].map((ele)=>{
                ele['unit'] = ele['unit']?.['id'];
                ele['weight_unit']=ele['weight_unit']?.['id']
                ele['volume_unit']=ele['volume_unit']?.['id']
                ele['material']=ele['material']?.['id']
              })
              setTimeout(() => {
                this.buildMaterialForm(ele['loose_cargo']['materials']);
                this.patchMaterialsValues(ele['loose_cargo']['materials']);
                this.calcuateQuantityMatch();
              }, 1200);  
            }else{
              this.buildMaterialForm([{}]);
            }
        }else{
          this.buildMaterialForm([{}]);
        }
      })
    
  }
  ngOnInit(): void {  
    this.getmaterialOptionsList();
    this._commonService
        .getStaticOptions(
          'item-unit'
        )
        .subscribe((response) => {
          this.itemUnits=response.result['item-unit']
        });

    this.currency_type = this.currency.getCurrency();
    this._quotationV2Service.getOptionValuesForMaterailUnits().subscribe((res)=>{      
      this.unitList = res['result']['material-item-unit'];
    })
    this.isTax = this._isTax.getTax();
    this.initialValues.tax = this.taxOption
    this.getTaxDetails();
    this.buildform({});
    this.parentForm.addControl('materials',this.billingForm);
    this.isSubFormValid.subscribe((isvalid)=>{
      setAsTouched(this.billingForm)
    })
    this.billingForm.valueChanges.subscribe((form)=>{
      let emitValue = {
        value : this.billingForm.value,
        isValid : this.billingForm.valid && this.billingForm.touched
      }
      this.materailsFormValue.emit(emitValue)
    })
  }
  getmaterialOptionsList() {
    this._companyTripGetApiService.getMaterials(materialList => {
      this.materialList = materialList
    });
  }

  getTaxDetails() {
    this._quotationV2Service.getTaxDetails().subscribe(result => {
      this.taxOptions = result.result['tax'];
    })
  }

  buildform(item){
    this.billingForm = this._fb.group({
      billing : [item.billing || null ,this.areAllFieldsMandatory ? [Validators.required] : []],
      rate : [item.rate || 0, this.areAllFieldsMandatory ?  [Validators.min(0.01)] : []],
      quantity : [item.quantity || 0,this.areAllFieldsMandatory ?  [Validators.min(0.01)] : []],
      total : [item.total || 0,this.areAllFieldsMandatory ?  [Validators.min(0.01)] : []],
      tax : [this.defaultTax || null],
      materials : this._fb.array([])
    })
  }

  buildMaterialForm(items : any[]){
    let materialMeta = this.billingForm.get('materials') as FormArray;
    materialMeta.controls = [];
    this.initialValues.unit = [];
    this.initialValues.material = [];
    this.initialValues.weightUnit = [];
    this.initialValues.volumeUnit = [];
    if(items.length>0){
      items.forEach((ele,i)=>{
        this.initialValues.unit.push(getBlankOption())
        this.initialValues.material.push(getBlankOption())
        this.initialValues.weightUnit.push(getBlankOption())
        this.initialValues.volumeUnit.push(getBlankOption())
        materialMeta.push(this.buildmaterialGroup(ele))
      })
    }else{
      this.buildmaterialGroup({})
    }
  }

  buildmaterialGroup(item){
    return this._fb.group({
      material : [item.material || null],
      unit : [item.unit || null],
      no_of_items : [item.no_of_items || null],
      weight_per_item : [item.weight_per_item || null],
      weight_unit:[item.weight_unit || null],
      volume_unit:[item.volume_unit || null],
      length : [item.length || null],
      breadth : [item.breadth || null],
      height : [item.height || null],
      total_quantity : [item.total_quantity || null]
    })    
  }

  addMoreMaterialItem() {
    const materialMeta = (this.billingForm.controls['materials']) as FormArray
    this.initialValues.unit.push(getBlankOption());
    this.initialValues.volumeUnit.push(getBlankOption());
    this.initialValues.weightUnit.push(getBlankOption());
    this.initialValues.material.push(getBlankOption());
    materialMeta.push(this.buildmaterialGroup({}));
  }
  removeMaterialItem(index) {
    const materialMeta = (this.billingForm.controls['materials']) as FormArray
    this.initialValues.unit.splice(index, 1);
    this.initialValues.volumeUnit.splice(index, 1);
    this.initialValues.weightUnit.splice(index, 1);
    this.initialValues.material.splice(index, 1);
    materialMeta.removeAt(index);
    this.onCalculationChange();
  }

  cloneMaterialItem(form: FormGroup, index) {
    this.addMoreMaterialItem();
    const materialMeta = (this.billingForm.controls['materials'] as FormArray).at(index + 1);
    materialMeta.patchValue(form.value);        
    if (form.value['unit']) {
      let unit 
      unit = this.unitList.find(item => item.id == form.value['unit'])   
      if (unit) this.initialValues.unit[index + 1] = { label: unit.label, value: unit.id }
    };
    if (form.value['weight_unit']) {
      let unit 
      unit = this.itemUnits.find(item => item.id == form.value['weight_unit'])   
      if (unit) this.initialValues.weightUnit[index + 1] = { label: unit.label, value: unit.id }
    };
    if (form.value['volume_unit']) {
      let unit 
      unit = this.itemUnits.find(item => item.id == form.value['volume_unit'])   
      if (unit) this.initialValues.volumeUnit[index + 1] = { label: unit.label, value: unit.id }
    };
    if (form.value['material']) {
      let mat 
      mat = this.materialList.find(item => item.id == form.value['material'])   
      if (mat) this.initialValues.material[index + 1] = { label: mat.name, value: mat.id }
    };
    this.onCalculationChange();
  }

  onCalculationChange(){
    let freight = this.billingForm.value
    let rate = Number(freight.rate);
    let totalUnits = Number(freight.quantity);
    let amountbeforeTax = rate * totalUnits;
    if(this.billingForm.get('billing').value != 10 || this.showRateAndUnitsFields){
      this.billingForm.get('total').setValue(amountbeforeTax);
    }
    this.calcuateQuantityMatch();
    this.makeFreightmandatory();
    this.makeMaterialRowMandatory();
  }

  calcuateQuantityMatch(){    
    let freight = this.billingForm.value
    const materialMeta = (this.billingForm.controls['materials']) as FormArray;
    let totalMaterialQuanity :number = 0;
    materialMeta.controls.forEach(element => {
      totalMaterialQuanity =totalMaterialQuanity+ Number(element.get('total_quantity').value);
    });
    let freightAmount = freight.quantity;
    let freightType = freight.billing;    
    if(freightType != null && Number(freightType)== 14 && Number(totalMaterialQuanity)>0 && Number(freightAmount)>0 && Number(freightAmount) != Number(totalMaterialQuanity)){      
      this.totalSumErr = 'Total Quantity of the Material is not matching the Total Quantity of Freight';
    }else{
      this.totalSumErr = '';
    };

  }

  makeFreightmandatory(){
    let form = this.billingForm.value;
    if(Number(form.billing) >0 || Number(form.rate)>0 || Number(form.quantity) > 0 || Number(form.total)>0){
      setUnsetValidators(this.billingForm,'billing',[Validators.required]);
      setUnsetValidators(this.billingForm,'rate',[Validators.min(0.01)]);
      setUnsetValidators(this.billingForm,'quantity',[Validators.min(0.01)]);
      setUnsetValidators(this.billingForm,'total',[Validators.min(0.01)]);
      if((Number(form.billing)==10 && !this.showRateAndUnitsFields)){
        setUnsetValidators(this.billingForm,'rate',[Validators.nullValidator]);
        setUnsetValidators(this.billingForm,'quantity',[Validators.nullValidator]);
      }
    }else{
      setUnsetValidators(this.billingForm,'billing',[Validators.nullValidator]);
      setUnsetValidators(this.billingForm,'rate',[Validators.nullValidator]);
      setUnsetValidators(this.billingForm,'quantity',[Validators.nullValidator]);
      setUnsetValidators(this.billingForm,'total',[Validators.nullValidator]);
    }
  }
  
  materialAdded(e){
    this.makeMaterialRowMandatory();
  }

  makeMaterialRowMandatory(){
  
  }
  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  patchMaterialsValues(data){
    data.forEach((element,index) => {
      if(isValidValue(element['unit'])){
        let unit 
          unit = this.unitList.find(item => item.id == element['unit'])   
          if (unit) this.initialValues.unit[index] = { label: unit.label, value: unit.id }
      }
      if(isValidValue(element['volume_unit'])){
        let unit 
          unit = this.itemUnits.find(item => item.id == element['volume_unit'])   
          if (unit) this.initialValues.volumeUnit[index] = { label: unit.label, value: unit.id }
      }
      if(isValidValue(element['weight_unit'])){
        let unit 
          unit = this.itemUnits.find(item => item.id == element['weight_unit'])   
          if (unit) this.initialValues.weightUnit[index] = { label: unit.label, value: unit.id }
      }
      if(isValidValue(element['material'])){
        let unit 
          unit = this.materialList.find(item => item.id == element['material'])   
          if (unit) this.initialValues.material[index] = { label: unit.name, value: unit.id }
      }
    });
  }

  billingTypeSelected(){
    let billing = this.billingForm.get('billing').value;
    this.billingTypeChanged.emit(billing);
  }
  addNewMaterial(event,i) {
    const dialogRef = this.dialog.open(AddMaterialPopup, {
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false,
      width:"400px",
      maxWidth:'80%',
      data:{
        materialName:event
      }
    });

    let dialogRefSub = dialogRef.closed.subscribe((result:any) => {
      if (result) {
        this.getmaterialOptionsList();
        (this.billingForm.get('materials') as UntypedFormArray).controls[i].get('material').setValue(result?.id);
        this.initialValues.material[i]={value:result?.id,label:result?.name}

        
      }
      dialogRefSub.unsubscribe()
    });
  }

}

@Component({
  selector: 'app-add-material-pop-up',
  template: `

  <div class="add-other-expense-popup">
    <div class="popup-header ">
        <h6 class="d-inline">Add Material &nbsp;</h6>
        
    </div>
    <div class="popup-body">
            <div class="container-fluid">
                <div class="">
                    <div class="custom-box-input-wrap mb-4" >
                        <label for="" class="input--required">Material Name</label>
                        <input [(ngModel)]="materialName" class="input--bd no-style" [ngClass]="{'error':requiredError}"  placeholder="">
                        <p *ngIf="requiredError" class="warn-text mt-2">This field is required</p>
                        <p *ngIf="apiError" class="warn-text mt-2">{{apiError}}</p>
                    </div>
                    <div class="d-flex justify-content-space-between  ">
                        <button class="btn w-auto " (click)="cancel()">Cancel</button>
                        <button class="btn btn--primary w-auto" (click)="save()">Save</button>
                    </div>

                </div>

            </div>

        
    </div>
</div>
  `,
  styleUrls:["./generic-freight-material-section.component.scss"]

})
export class AddMaterialPopup implements OnInit {

  constructor(@Inject(DIALOG_DATA) private dialogData: any,private dialogRef: DialogRef<any>, private _newTripV2Service: NewTripV2Service, private _tokenExpireService:TokenExpireService
    ) { }
  materialName = '';
  requiredError = false;
  apiError='';
  ngOnInit(): void {
    this.materialName=this.dialogData.materialName;
    this._tokenExpireService.observeTokenExpire.subscribe(isExpired=>{
      if(isExpired){
        this.dialogRef.close(false)
      }
    })
  }
  save() {
    if (!this.materialName.trim()) {
      this.requiredError = true;
    }else{
      this._newTripV2Service.addMaterial({ name:this.materialName,is_material:true
      }).subscribe((response: any) => {
        this.dialogRef.close(response['result'])
      }, (err) => {
        if(err.status==400){
          this.apiError =err.error.result.name[0]
        }
      });
      this.requiredError = false;
    }
  }
  cancel() {
    this.dialogRef.close(false)
  }

}