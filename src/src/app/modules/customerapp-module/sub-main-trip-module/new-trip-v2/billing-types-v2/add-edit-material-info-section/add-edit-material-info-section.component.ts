import { DIALOG_DATA, Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, UntypedFormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { TokenExpireService } from 'src/app/core/services/token-expire.service';
import { QuotationV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/quotation-service/quotation-service-v2';
import { NewTripV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/trip-service/new-trip-v2.service';
import { CompanyTripGetApiService } from 'src/app/modules/customerapp-module/revenue-module/trip-module/company-vehicle-module/company-trip-class/company-trip-service.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { setAsTouched } from 'src/app/shared-module/utilities/form-utils';
import { getBlankOption, isValidValue } from 'src/app/shared-module/utilities/helper-utils';

@Component({
  selector: 'app-add-edit-material-info-section',
  templateUrl: './add-edit-material-info-section.component.html',
  styleUrls: ['./add-edit-material-info-section.component.scss']
})
export class AddEditMaterialInfoSectionComponent implements OnInit {

  
  unitList : any[] = [];
  materialList = [];
  billingForm : FormGroup;
  initialValues = {
    material:[],
    unit : [],
    weightUnit:[],
    volumeUnit:[],
  };
  itemUnits=[];

  @Input() parentForm : FormGroup;
  @Input() isSubFormValid : Observable<boolean>;
  @Input() editDetails? : Observable<any> ;

  constructor(private dialog :Dialog,private _commonService:CommonService, private _fb : FormBuilder,private _quotationV2Service : QuotationV2Service,private _companyTripGetApiService : CompanyTripGetApiService) { }

  ngAfterViewInit(): void {
      this.editDetails?.subscribe((materials)=>{   
        if(materials){
            if(materials.length>0){
              materials.map((material)=>{
                material['unit'] = material['unit']?.['id'];
                material['weight_unit']=material['weight_unit']?.['id']
                material['volume_unit']=material['volume_unit']?.['id']
                material['material']=material['material']?.['id']
              })
              setTimeout(() => {
                this.buildMaterialForm(materials);
                this.patchMaterialsValues(materials);
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
    this._commonService.getStaticOptions('item-unit').subscribe((response) => {
      this.itemUnits=response.result['item-unit']
    });
    this._quotationV2Service.getOptionValuesForMaterailUnits().subscribe((res)=>{      
      this.unitList = res['result']['material-item-unit'];
    })
    this.buildform({});
    this.parentForm.addControl('materials',this.billingForm);
    this.isSubFormValid.subscribe((isvalid)=>{
      setAsTouched(this.billingForm)
    })
  }

  getmaterialOptionsList() {
    this._companyTripGetApiService.getMaterials(materialList => {
      this.materialList = materialList
    });
  }

  buildform(item){
    this.billingForm = this._fb.group({
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
  styleUrls:["./add-edit-material-info-section.component.scss"]

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