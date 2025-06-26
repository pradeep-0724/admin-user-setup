import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, UntypedFormArray, UntypedFormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { OwnVehicleService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/own-vehicle-service';
import { Dialog } from '@angular/cdk/dialog';
import { AddEditOwnVehicleItemsComponent } from '../add-edit-own-vehicle-items/add-edit-own-vehicle-items.component';
import { DeleteOwnVehicleItemsComponent } from '../delete-own-vehicle-items/delete-own-vehicle-items.component';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { setAsTouched, setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';

@Component({
  selector: 'app-sub-assets-own-vehicle',
  templateUrl: './sub-assets-own-vehicle.component.html',
  styleUrls: ['./sub-assets-own-vehicle.component.scss']
})
export class SubAssetsOwnVehicleComponent implements OnInit , OnDestroy,AfterViewInit {
  documentList: any = [];

  @Input() vehicleDetailsForm: FormGroup;
  @Input() documentEditList?: Observable<[]>;
  @Input() isFormSubmitted:Boolean=false;
  activeDoc = 0;
  $subscriptionList:Subscription[]=[];
  @Input() vehicleCatagory: Observable<any>;
  @Input() isFormValid: Observable<boolean>;
  constructor(
    private _fb: UntypedFormBuilder,
    private _commonloaderservice: CommonLoaderService,
    private _ownVehicleService: OwnVehicleService,
    public dialog: Dialog,
    private activatedRoute:ActivatedRoute


  ) {

  }

  ngOnDestroy(): void { 
    this._commonloaderservice.getShow();
    this.$subscriptionList.forEach(sub=>{
    sub.unsubscribe();
    })
  }

  ngOnInit() {
    this._commonloaderservice.getHide();  
  }

  ngAfterViewInit(): void {
    this.$subscriptionList.push(this.vehicleCatagory.subscribe(resp=>{
      this._ownVehicleService.getDefaultSubAssets(resp).subscribe((response) => {
        if (response['result']) {
          this.addVehicleDocumentControls(response['result']);
        }
      });
     }));
     
     if(this.documentEditList){
      this.$subscriptionList.push(this.documentEditList.subscribe(docs=>{
        this.addVehicleDocumentControls(docs);
        this.activatedRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
          if (paramMap.has('tab') && paramMap.get('tab')=='Attachments') {
            this.documentList.forEach((doc, index) => {
              if (paramMap.get('name') == doc.name){
                this.activeDoc = index
                setTimeout(() => {
                  const target = document.getElementById('sub-asset-id'+doc.name);
                  target?.scrollIntoView({ behavior: 'smooth' });
                 }, 500);
              }
                
            });
          }
        });
       }));
     }
     this.$subscriptionList.push(this.isFormValid.subscribe(isValid=>{
      if(!isValid)
       setAsTouched(this.vehicleDetailsForm)
    }))
    
  }


  addVehicleDocumentControls(items: any = []) {
    const subassets = this.vehicleDetailsForm.get('subassets') as UntypedFormArray;
    subassets.controls = [];
    this.documentList=[];
    items.forEach((document, index) => {
        subassets.push(this.addVehicleDocumentControl(document));
        this.documentList.push(document);
    });
  }

  addVehicleDocumentControl(document: any) {
    return this._fb.group({
      id: [
        document.id || null
      ],
      name: [document.name || ''],
      number:[document.number||''],
      narration: [document.narration || ''],
      expiry_date: [document.expiry_date || null],
      files: [document.files || []],
      is_expiry_mandatory:[document.is_expiry_mandatory],
    });
  }


  changeDocument(index) {
    this.activeDoc = index;
  }

  onChangeNumber(form:FormGroup){
   const number = form.value['number']
   const isExpiryMandatory=form.value['is_expiry_mandatory']
   if(number.trim() && isExpiryMandatory){
    setUnsetValidators(form,'expiry_date',[Validators.required])
   }else{
    setUnsetValidators(form,'expiry_date',[Validators.nullValidator])
   }
  }

  fileDeleted(id, i) {
    let file = (this.vehicleDetailsForm.get('subassets') as UntypedFormArray).at(i)
    let subassets = file.get('files').value;
    file.get('files').setValue(subassets.filter(doc => doc.id != id))
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }



  deleteDocuments(name,index) {
   const dialogRef = this.dialog.open(DeleteOwnVehicleItemsComponent, {
      data: {
        message:'Are you sure you want to delete this Attachment?',
        name:name,
        type:'Attachment',
        url:'vehicle/subasset/delete/',
        vehicle_type:this.vehicleDetailsForm.get('vehicle_category').value
      },
      width:'650px',
      maxWidth:'90%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      if(result){
        const subassets = this.vehicleDetailsForm.get('subassets') as UntypedFormArray;
        this.documentList.splice(index, 1);
        subassets.controls.splice(index, 1);
        this.changeDocument(index - 1);
        subassets.updateValueAndValidity()
      }
       dialogRefSub.unsubscribe();  
    });

  }
  

  fileUploader(e, i) {
    let data = this.vehicleDetailsForm.get('subassets') as UntypedFormArray
    let subassets = data.at(i).get('files').value
    e.forEach((element) => {
      element['presigned_url'] = element['url']
      subassets.push(element);
    });

  }

  editSubAsset(documentName,index){
    const dialogRef = this.dialog.open(AddEditOwnVehicleItemsComponent, {
      data: {
        heading:'Attachment',
        label:'Attachment',
        documentList:this.vehicleDetailsForm.value['subassets'].map(subassets=>subassets['name']).filter(name=>name!=documentName),
        editData:documentName,
        validationUrl:'vehicle/subasset/exists/',
        url:'vehicle/subasset/update/',
        vehicle_type:this.vehicleDetailsForm.get('vehicle_category').value
      },
      width:'650px',
      maxWidth:'90%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
    if(result){
      const subassets = (this.vehicleDetailsForm.get('subassets') as UntypedFormArray).at(index);
      subassets.get('name').setValue(result)
      this.documentList[index].name=result
      dialogRefSub.unsubscribe();
    }
    });
  }

  addSubAsset() {
    const dialogRef = this.dialog.open(AddEditOwnVehicleItemsComponent, {
      data: {
        heading:'Attachment',
        label:'Attachment',
        documentList:this.vehicleDetailsForm.value['subassets'].map(subassets=>subassets['name']),
        editData:'',
        validationUrl:'vehicle/subasset/exists/',
        url:'vehicle/subasset/add/',
        expiryLabel:'Make Attachment Expiry Date Mandatory',
        isExpiry:true,
        vehicle_type:this.vehicleDetailsForm.get('vehicle_category').value
      },
      width:'650px',
      maxWidth:'90%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
    if(result){
      const subassets = this.vehicleDetailsForm.get('subassets') as UntypedFormArray;
      const item = {
        name: result['name'],
        narration: '',
        number:'',
        expiry_date: null,
        files: [],
        is_expiry_mandatory:result['is_expiry_mandatory']
      };
      subassets.push(this.addVehicleDocumentControl(item));
      this.documentList.push(item);
      this.activeDoc = subassets.length-1;
      dialogRefSub.unsubscribe();
    }
     
    });

  }






}

