import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, UntypedFormArray, UntypedFormBuilder} from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { OwnVehicleService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/own-vehicle-service';
import { AddEditOwnVehicleItemsComponent } from '../add-edit-own-vehicle-items/add-edit-own-vehicle-items.component';
import { Dialog } from '@angular/cdk/dialog';
import { DeleteOwnVehicleItemsComponent } from '../delete-own-vehicle-items/delete-own-vehicle-items.component';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CountryIdService } from 'src/app/core/services/countryid.service';
import { getCountryDetails } from 'src/app/shared-module/utilities/countrycode-utils';

@Component({
  selector: 'app-vehicle-details-v2',
  templateUrl: './vehicle-details-v2.component.html',
  styleUrls: ['./vehicle-details-v2.component.scss']
})
export class VehicleDetailsV2Component implements OnInit , OnDestroy,AfterViewInit {
  documentList: any = [];

  @Input() vehicleDetailsForm: FormGroup;
  @Input() documentEditList?: Observable<[]>;
  @Input() vehicleCatagory: Observable<any>;
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
    private _ownVehicleService: OwnVehicleService,
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
    this.$subscriptionList.push(this.vehicleCatagory.subscribe(resp=>{
      this._ownVehicleService.getDefaultSubDetails(resp).subscribe((response) => {
        this.addVehicleDocumentControls(response['result']);
      });
     }));
     if(this.documentEditList){
      this.$subscriptionList.push(this.documentEditList.subscribe(editList=>{
        this.addVehicleDocumentControls(editList);
        this.activatedRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
          if (paramMap.has('tab')&& paramMap.get('tab')=='Vehicle Details') {
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


  addVehicleDocumentControls(items: any = []) {
    const subdetails = this.vehicleDetailsForm.get('subdetails') as UntypedFormArray;
    subdetails.controls = [];
    this.documentList=[];
    items.forEach((document, index) => {
        subdetails.push(this.addVehicleDocumentControl(document));
        this.documentList.push(document);
    });
  }

  addVehicleDocumentControl(document: any) {
    return this._fb.group({
      id: [
        document.id || null
      ],
      title:[document.title || ''],
      name: [document.name || ''],
      emi_last_date:[document.emi_last_date||null],
      number:[document.number||''],
      narration: [document.narration || ''],
      files: [document.files || []],
    });
  }

 

  changeDocument(index) {
    this.activeDoc = index;
  }

  fileDeleted(id, i) {
    let file = (this.vehicleDetailsForm.get('subdetails') as UntypedFormArray).at(i)
    let subdetails = file.get('files').value;
    file.get('files').setValue(subdetails.filter(doc => doc.id != id))
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }


  deleteDocuments(name,index) {
    const dialogRef = this.dialog.open(DeleteOwnVehicleItemsComponent, {
      data: {
        message:'Are you sure you want to delete this Vehicle Details?',
        name:name,
        type:'Vehicle Details',
        url:'vehicle/subdetail/delete/',
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
        const subdetails = this.vehicleDetailsForm.get('subdetails') as UntypedFormArray;
        this.documentList.splice(index, 1);
        subdetails.controls.splice(index, 1);
        this.changeDocument(index - 1);
        subdetails.updateValueAndValidity()
      }
       dialogRefSub.unsubscribe();  
    });

  }


  fileUploader(e, i) {
    let data = this.vehicleDetailsForm.get('subdetails') as UntypedFormArray
    let subdetails = data.at(i).get('files').value
    e.forEach((element) => {
      element['presigned_url'] = element['url']
      subdetails.push(element);
    });

  }

  editVehicleDetail(documentName,index){
    const dialogRef = this.dialog.open(AddEditOwnVehicleItemsComponent, {
      data: {
        
        heading:'Vehicle Details',
        label:'Vehicle Details',
        documentList:this.vehicleDetailsForm.value['subdetails'].map(subdetail=>subdetail['name']).filter(name=>name!=documentName),
        editData:documentName,
        validationUrl:'vehicle/subdetail/exists/',
        url:'vehicle/subdetail/update/',
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
      const subdetails = (this.vehicleDetailsForm.get('subdetails') as UntypedFormArray).at(index);
      subdetails.get('name').setValue(result)
      subdetails.get('title').setValue(result)
      this.documentList[index].title=result
      this.documentList[index].name=result
      dialogRefSub.unsubscribe();
    }
     
    });
  }

  addVehidleDetail() {
    const dialogRef = this.dialog.open(AddEditOwnVehicleItemsComponent, {
      data: {
        
        heading:'Vehicle Details',
        label:'Vehicle Details',
        documentList:this.vehicleDetailsForm.value['subdetails'].map(subdetail=>subdetail['name']),
        editData:'',
        validationUrl:'vehicle/subdetail/exists/',
        url:'vehicle/subdetail/add/',
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
      const subdetails = this.vehicleDetailsForm.get('subdetails') as UntypedFormArray;
      const item = {
        name: result,
        title:result,
        emi_last_date:null,
        narration: '',
        number:'',
        files: [],
        is_system_created:false,

      };
      subdetails.push(this.addVehicleDocumentControl(item));
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
