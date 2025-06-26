import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { CommonService } from 'src/app/core/services/common.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { setAsTouched } from 'src/app/shared-module/utilities/form-utils';
import { getBlankOption, trimExtraSpaceBtwWords } from 'src/app/shared-module/utilities/helper-utils';
import { ContainerService } from '../../../api-services/master-module-services/container-service/container-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';

@Component({
  selector: 'app-container-add-edit-popup',
  templateUrl: './container-add-edit-popup.component.html',
  styleUrls: ['./container-add-edit-popup.component.scss']
})
export class ContainerAddEditPopupComponent implements OnInit {
  containerId=''
  containerForm:FormGroup;
  postApiUrl= TSAPIRoutes.static_options;
  containerParam: any = {};
  sizeParam={}
  containerTypeList=[]
  initialValues={
    containerType:getBlankOption(),
    size:getBlankOption()
  }
  sizeOptions=[]
  prefixUrl=getPrefix();
  apiError='';
  analyticsType = OperationConstants;
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;

  constructor(private _fb: FormBuilder,private _commonService:CommonService,private _containerService:ContainerService,private _route:Router,private _routeParam:ActivatedRoute,
    private apiHandler: ApiHandlerService, private _analytics: AnalyticsService,) { }

  ngOnInit(): void {
    this.getContainerTypes();
    this.containerForm = this._fb.group({
      name:['',Validators.required],
      weight:[0,Validators.min(0.1)],
      type:['',Validators.required],
      size:['',Validators.required],
    })


    this._routeParam.params.subscribe((params: any) => {
      if (params.container_id) {
        this.containerId = params.container_id;
        this.getContainerDetails();
      }  
      });
      this.getContainerSize();
  }

  save(){
    this.apiError=''
    if(this.containerForm.valid){
      if(this.containerId){
        this.apiHandler.handleRequest(this._containerService.updateContainer(this.containerId, this.containerForm.value), 'Container details updated successfully!').subscribe(
          {
            next: () => {
              this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.CONTAINER)
              this._route.navigate([this.prefixUrl + '/onboarding/container/list'])
            },
            error: (error) => {
              this.apiError = error.error.message
            }
          })
      }else{
        this.apiHandler.handleRequest(this._containerService.addContainer(this.containerForm.value),'Container details added successfully!').subscribe(
          {
            next: () => {
              this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.CONTAINER)
              this._route.navigate([this.prefixUrl + '/onboarding/container/list'])
            },
            error: (error) => {
              this.apiError = error.error.message
            }
          })
      }
   
    }else{
      setAsTouched(this.containerForm)
    }

  }

  getContainerSize() {
    this._commonService.getStaticOptions('container-size').subscribe((response) => {
      this.sizeOptions = response['result']['container-size']
    });
  }

  cancel(){
    this._route.navigate([this.prefixUrl+'/onboarding/container/list'])
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  getNewContainerType(event) {
    if (event) {
      this.initialValues.containerType={label:event.label,value:event.id}
      this.containerForm.get('type').setValue(event.id)
      this.getContainerTypes();
    }
  }

  getNewContainerSize(event) {
    if (event) {
      this.initialValues.size={label:event.label,value:event.id}
      this.containerForm.get('size').setValue(event.label)
      this.getContainerSize();
    }
  }

  addNewContainerType(event) {
    if (event) {
      const val = trimExtraSpaceBtwWords(event);
      this.containerParam = {
        key: 'container-type',
        label: val,
        value: 0
      };
    }
  }

  addNewContainerSize(event) {
    if (event) {
      const val = trimExtraSpaceBtwWords(event);
      this.sizeParam = {
        key: 'container-size',
        label: val,
        value: 0
      };
    }
  }

  getContainerTypes() {
    this._commonService.getStaticOptions('container-type').subscribe((response: any) => {
      this.containerTypeList = response.result['container-type'];
    });

  }

  getContainerDetails(){
    this._containerService.getContainer(this.containerId).subscribe(resp=>{
      let containerDetails=resp['result'];
      if(containerDetails.type){
        this.initialValues.containerType={label:containerDetails.type.label,value:''}
        containerDetails.type=containerDetails.type.id
      }
      this.initialValues.size={label:containerDetails.size,value:containerDetails.size}
      this.containerForm.patchValue(containerDetails)
    })
  }

}
