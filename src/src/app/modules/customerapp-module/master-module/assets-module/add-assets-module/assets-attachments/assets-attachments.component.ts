import { Dialog } from '@angular/cdk/dialog';
import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormArray, AbstractControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { setAsTouched, setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { AddEditOwnAssetsItemComponent } from '../add-edit-own-assets-item/add-edit-own-assets-item.component';
import { DeleteOwnAssetsItemComponent } from '../delete-own-assets-item/delete-own-assets-item.component';
import { OwnAssetsService } from 'src/app/modules/customerapp-module/api-services/master-module-services/assets-service/assets-service.service';

@Component({
  selector: 'app-assets-attachments',
  templateUrl: './assets-attachments.component.html',
  styleUrls: ['./assets-attachments.component.scss']
})
export class AssetsAttachmentsComponent  implements OnInit , OnDestroy,AfterViewInit {
  documentList: any = [];

  @Input() assetsDetailsForm: FormGroup;
  @Input() documentEditList?: Observable<[]>;
  activeDoc = 0;
  $subscriptionList:Subscription[]=[];
  @Input() catagory: Observable<any>;
  @Input() isFormValid: Observable<boolean>;
  constructor(
    private _fb: UntypedFormBuilder,
    private _commonloaderservice: CommonLoaderService,
    private _ownAssetService: OwnAssetsService,
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
    this.$subscriptionList.push(this.catagory.subscribe(resp=>{
      this._ownAssetService.getDefaultSubAssets(resp).subscribe((response) => {
        if (response['result']) {
          this.addAssetDocumentControls(response['result']);
        }
      });
     }));
     
     if(this.documentEditList){
      this.$subscriptionList.push(this.documentEditList.subscribe(docs=>{
        this.addAssetDocumentControls(docs);
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
       setAsTouched(this.assetsDetailsForm)
    }))
    
  }


  addAssetDocumentControls(items: any = []) {
    const attachments = this.assetsDetailsForm.get('attachments') as UntypedFormArray;
    attachments.controls = [];
    this.documentList=[];
    items.forEach((document, index) => {
        attachments.push(this.addAssetDocumentControl(document));
        this.documentList.push(document);
    });
  }

  addAssetDocumentControl(document: any) {
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
    let file = (this.assetsDetailsForm.get('attachments') as UntypedFormArray).at(i)
    let attachments = file.get('files').value;
    file.get('files').setValue(attachments.filter(doc => doc.id != id))
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }



  deleteDocuments(name,index) {
   const dialogRef = this.dialog.open(DeleteOwnAssetsItemComponent, {
      data: {
        message:'Are you sure you want to delete this Attachment?',
        name:name,
        type:'Attachment',
        url:'asset/subasset/delete/',
        asset_type:this.assetsDetailsForm.get('category').value
      },
      width:'650px',
      maxWidth:'90%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      if(result){
        const attachments = this.assetsDetailsForm.get('attachments') as UntypedFormArray;
        this.documentList.splice(index, 1);
        attachments.controls.splice(index, 1);
        this.changeDocument(index - 1);
        attachments.updateValueAndValidity()
      }
       dialogRefSub.unsubscribe();  
    });

  }
  

  fileUploader(e, i) {
    let data = this.assetsDetailsForm.get('attachments') as UntypedFormArray
    let attachments = data.at(i).get('files').value
    e.forEach((element) => {
      element['presigned_url'] = element['url']
      attachments.push(element);
    });

  }

  editSubAsset(documentName,index){
    const dialogRef = this.dialog.open(AddEditOwnAssetsItemComponent, {
      data: {
        heading:'Attachment',
        label:'Attachment',
        documentList:this.assetsDetailsForm.value['attachments'].map(attachments=>attachments['name']).filter(name=>name!=documentName),
        editData:documentName,
        validationUrl:'asset/subasset/exists/',
        url:'asset/subasset/update/',
        asset_type:this.assetsDetailsForm.get('category').value
      },
      width:'650px',
      maxWidth:'90%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
    if(result){
      const attachments = (this.assetsDetailsForm.get('attachments') as UntypedFormArray).at(index);
      attachments.get('name').setValue(result)
      this.documentList[index].name=result
      dialogRefSub.unsubscribe();
    }
    });
  }

  addSubAsset() {
    const dialogRef = this.dialog.open(AddEditOwnAssetsItemComponent, {
      data: {
        heading:'Attachment',
        label:'Attachment',
        documentList:this.assetsDetailsForm.value['attachments'].map(attachments=>attachments['name']),
        editData:'',
        validationUrl:'asset/subasset/exists/',
        url:'asset/subasset/add/',
        expiryLabel:'Make Attachment Expiry Date Mandatory',
        isExpiry:true,
        asset_type:this.assetsDetailsForm.get('category').value
      },
      width:'650px',
      maxWidth:'90%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
    if(result){
      const attachments = this.assetsDetailsForm.get('attachments') as UntypedFormArray;
      const item = {
        name: result['name'],
        narration: '',
        number:'',
        expiry_date: null,
        files: [],
        is_expiry_mandatory:result['is_expiry_mandatory']
      };
      attachments.push(this.addAssetDocumentControl(item));
      this.documentList.push(item);
      this.activeDoc = attachments.length-1;
      dialogRefSub.unsubscribe();
    }
     
    });

  }






}