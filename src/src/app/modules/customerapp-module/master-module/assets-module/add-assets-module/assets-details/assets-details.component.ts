import { Dialog } from '@angular/cdk/dialog';
import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormArray, AbstractControl } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { CountryIdService } from 'src/app/core/services/countryid.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { getCountryDetails } from 'src/app/shared-module/utilities/countrycode-utils';
import { OwnAssetsService } from 'src/app/modules/customerapp-module/api-services/master-module-services/assets-service/assets-service.service';
import { AddEditOwnAssetsItemComponent } from '../add-edit-own-assets-item/add-edit-own-assets-item.component';
import { DeleteOwnAssetsItemComponent } from '../delete-own-assets-item/delete-own-assets-item.component';

@Component({
  selector: 'app-assets-details',
  templateUrl: './assets-details.component.html',
  styleUrls: ['./assets-details.component.scss']
})
export class AssetsDetailsComponent implements OnInit , OnDestroy,AfterViewInit {
  documentList: any = [];

  @Input() assetsDetailsForm: FormGroup;
  @Input() documentEditList?: Observable<[]>;
  @Input() catagory: Observable<any>;
  activeDoc = 0;
  $subscriptionList:Subscription[]=[];
  emiOptions=[
    {
      label:'Active',
      value:'Active'
    },
    {
      label:'Inactive',
      value:'Inactive'
    },
    {
      label:'Completed',
      value:'Completed'
    }
  ]

  constructor(
    private _fb: UntypedFormBuilder,
    private _commonloaderservice: CommonLoaderService,
    private _ownAssetService: OwnAssetsService,
    public dialog: Dialog,
    private activatedRoute:ActivatedRoute,
    private _countryId:CountryIdService
  ) {
  }

  ngOnDestroy(): void { 
    this._commonloaderservice.getShow();
    this.$subscriptionList.forEach(sub=>{
      sub.unsubscribe();
      })
  }

  ngOnInit() {
   
  }

  ngAfterViewInit(): void {
    this.$subscriptionList.push(this.catagory.subscribe(resp=>{
      this._ownAssetService.getDefaultSubDetails(resp).subscribe((response) => {
        this.addAssetDocumentControls(response['result']);
      });
     }));
     if(this.documentEditList){
      this.$subscriptionList.push(this.documentEditList.subscribe(editList=>{
        this.addAssetDocumentControls(editList);
        this.activatedRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
          if (paramMap.has('tab')&& paramMap.get('tab')=='Asset Details') {
            this.documentList.forEach((doc, index) => {
              if (paramMap.get('name') == doc.name){
                this.activeDoc = index
                 setTimeout(() => {
                  const target = document.getElementById('doc-id'+doc.name);
                  target?.scrollIntoView({ behavior: 'smooth' });
                 }, 500);
              }
                
               
            });
          }
        });
       }))
     }
    
  }

  addAssetDocumentControls(items: any = []) {
    const subdetails = this.assetsDetailsForm.get('subdetails') as UntypedFormArray;
    subdetails.controls = [];
    this.documentList=[];
    items.forEach((document, index) => {
        subdetails.push(this.addAssetDocumentControl(document));
        this.documentList.push(document);
    });
  }

  addAssetDocumentControl(document: any) {
    return this._fb.group({
      id: [
        document.id || null
      ],
      title:[document.title || ''],
      name: [document.name || ''],
      number:[document.number||''],
      narration: [document.narration || ''],
      files: [document.files || []],
    });
  }

 

  changeDocument(index) {
    this.activeDoc = index;
  }

  fileDeleted(id, i) {
    let file = (this.assetsDetailsForm.get('subdetails') as UntypedFormArray).at(i)
    let subdetails = file.get('files').value;
    file.get('files').setValue(subdetails.filter(doc => doc.id != id))
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }


  deleteDocuments(name,index) {
    const dialogRef = this.dialog.open(DeleteOwnAssetsItemComponent, {
      data: {
        message:'Are you sure you want to delete this Asset Details?',
        name:name,
        type:'Asset Details',
        url:'asset/subdetail/delete/',
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
        const subdetails = this.assetsDetailsForm.get('subdetails') as UntypedFormArray;
        this.documentList.splice(index, 1);
        subdetails.controls.splice(index, 1);
        this.changeDocument(index - 1);
        subdetails.updateValueAndValidity()
      }
       dialogRefSub.unsubscribe();  
    });

  }


  fileUploader(e, i) {
    let data = this.assetsDetailsForm.get('subdetails') as UntypedFormArray
    let subdetails = data.at(i).get('files').value
    e.forEach((element) => {
      element['presigned_url'] = element['url']
      subdetails.push(element);
    });

  }

  editVehicleDetail(documentName,index){
    const dialogRef = this.dialog.open(AddEditOwnAssetsItemComponent, {
      data: {
        
        heading:'Asset Details',
        label:'Asset Details',
        documentList:this.assetsDetailsForm.value['subdetails'].map(subdetail=>subdetail['name']).filter(name=>name!=documentName),
        editData:documentName,
        validationUrl:'asset/subdetail/exists/',
        url:'asset/subdetail/update/',
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
      const subdetails = (this.assetsDetailsForm.get('subdetails') as UntypedFormArray).at(index);
      subdetails.get('name').setValue(result)
      subdetails.get('title').setValue(result)
      this.documentList[index].name=result
      this.documentList[index].title=result
      dialogRefSub.unsubscribe();
    }
     
    });
  }

  addVehidleDetail() {
    const dialogRef = this.dialog.open(AddEditOwnAssetsItemComponent, {
      data: {
        
        heading:'Asset Details',
        label:'Asset Details',
        documentList:this.assetsDetailsForm.value['subdetails'].map(subdetail=>subdetail['name']),
        editData:'',
        validationUrl:'asset/subdetail/exists/',
        url:'asset/subdetail/add/',
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
      const subdetails = this.assetsDetailsForm.get('subdetails') as UntypedFormArray;
      const item = {
        name: result,
        title:result,
        narration: '',
        number:'',
        files: [],
        is_system_created:false,

      };
      subdetails.push(this.addAssetDocumentControl(item));
      this.documentList.push(item);
      dialogRefSub.unsubscribe();
      this.activeDoc = subdetails.length-1
    }
     
    });

  }

  getCountry(){
   return getCountryDetails(this._countryId.getCountryId()).country
  }

}