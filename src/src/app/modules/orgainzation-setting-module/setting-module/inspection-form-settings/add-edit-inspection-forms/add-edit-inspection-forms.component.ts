import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { combineLatest } from 'rxjs';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';
import { CommonService } from 'src/app/core/services/common.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { GenericChecklistServiceService } from 'src/app/modules/customerapp-module/api-services/generic-checklist-service/generic-checklist-service.service';
import { VehicleInspectionServiceService } from 'src/app/modules/customerapp-module/api-services/vehicle-inspection/vehicle-inspection-service.service';
import { AddInspectionPopupComponent } from 'src/app/modules/customerapp-module/generic-inspection-add-view-module/add-inspection-popup/add-inspection-popup.component';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { DeleteAlertComponent } from 'src/app/shared-module/delete-alert-module/delete-alert/delete-alert.component';
import { setAsTouched } from 'src/app/shared-module/utilities/form-utils';
import { getBlankOption, isValidValue } from 'src/app/shared-module/utilities/helper-utils';

@Component({
  selector: 'app-add-edit-inspection-forms',
  templateUrl: './add-edit-inspection-forms.component.html',
  styleUrls: ['./add-edit-inspection-forms.component.scss']
})
export class AddEditInspectionFormsComponent implements OnInit {

  inspectionDetails = [];
  viewUploadedDocs = {
    show: false,
    data: {}
  };
  initialValues = {
    formName: getBlankOption(),
  };
  formNameParam: any = {};
  inspectionForm: FormGroup;
  prefixUrl = getPrefix();
  inspectionId = '';
  formNames = [];
  formNameApi = '';
  postApiUrl = '';
  newFormaNameOptionApiUrl = '';
  inspectionType = '';
  typeConfig = {
    vehicle: {
      postApiUrl: 'revenue/vehicle_detail/setting/form/',
      formNameApi: 'vehicle-inspection-form-name',
      optionUrl: 'optionvalues/?key=vehicle-inspection-form-name'
    },
    site: {
      postApiUrl: 'revenue/site_detail/setting/form/',
      formNameApi: 'site-inspection-form-name',
      optionUrl: 'optionvalues/?key=site-inspection-form-name'
    }
  };
  
  constructor(private dialog: Dialog, private _commonLoader: CommonLoaderService, private apiHandler: ApiHandlerService, private _formBuilder: FormBuilder, private _genericCheckListService: GenericChecklistServiceService,
    private _vehicleInspectionService: VehicleInspectionServiceService, private _route: ActivatedRoute, private _commonService: CommonService, private _router: Router
  ) { }

  ngOnInit(): void {
    this._commonLoader.getHide();
    this.inspectionForm = this._formBuilder.group({
      form_name: ['', [Validators.required]],
      description: '',
      inspections: this._formBuilder.array([]),
    })

    combineLatest([
      this._route.paramMap,
      this._route.queryParamMap
    ]).subscribe(([paramMap, queryParamMap]) => {
      const inspectionId = paramMap.get('inspectionId');
      this.inspectionId = inspectionId;
      this.inspectionType = queryParamMap.get('inspectionType');
      const config = this.typeConfig[this.inspectionType];
      if (config) {
        this.postApiUrl = config.postApiUrl;
        this.formNameApi = config.formNameApi;
        this.newFormaNameOptionApiUrl = config.optionUrl;
      }

      this.getInspectionFormNamesList();

      if (inspectionId) {
        this._vehicleInspectionService.getInspectionDetailsForEdit(inspectionId,this.inspectionType)
          .subscribe((res) => {
            const result = res['result'];
            if(queryParamMap.get('canClone') != 'true'){
              this.inspectionForm.patchValue({
                form_name: result['form_name']['id'],
                description: result['description'],
              });
              this.initialValues.formName = {
                label: result['form_name']['label'],
                value: result['form_name']['id']
              };
            }else{
              this.inspectionId = '';
            }
            this.inspectionDetails = result['inspections'];
          });
      }
    });
  }

  getInspectionFormNamesList() {
    this._commonService.getStaticOptions(this.formNameApi).subscribe((response) => {
      this.formNames = response.result[this.formNameApi];
    });
  }

  ngOnDestroy(): void {
    this._commonLoader.getShow()
  }

  addVehicleInspection() {
    const dialogRef = this.dialog.open(AddInspectionPopupComponent, {
      width: '1000px',
      maxWidth: '90%',
      data: {
        isAdd: true,
        editId: '',
        apiUrl: 'revenue/vehicle_detail_setting/'
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false,
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: any) => {
      dialogRefSub.unsubscribe();
      if (result.isSave) {
        this.inspectionDetails.push(result.data)
      }
    });
  }

  editVehicleInspection(data, index) {
    const dialogRef = this.dialog.open(AddInspectionPopupComponent, {
      width: '1000px',
      maxWidth: '90%',
      data: {
        inspectionData: data,
        isAdd: false,
        apiUrl: 'revenue/vehicle_detail_setting/',
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false,
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: any) => {
      dialogRefSub.unsubscribe();
      if (result.isSave) {
        this.inspectionDetails[index] = result.data
      }
    });
  }

  viewUploadedDocument(doc) {
    this.viewUploadedDocs.data['files'] = cloneDeep(doc);
    this.viewUploadedDocs.show = true;

  }

  deleteVehicleInspection(id) {
    const dialogRef = this.dialog.open(DeleteAlertComponent, {
      width: '200px',
      maxWidth: '90%',
      data: {
        message: 'Are you sure, you want to delete?'
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      if (result) {
        this.inspectionDetails.splice(id, 1)
      }
      dialogRefSub.unsubscribe()

    });
  }

  makeMandatory(e, viData, id) {
    viData.mandatory = e
  }

  convertTYpe(data: string) {
    if (isValidValue(data)) {
      if (data === 'string') {
        return 'Text'
      } else if (data === 'decimal') {
        return 'Number'
      } else {
        return data.charAt(0).toUpperCase() + data.slice(1)
      }
    }
  }

  addNewFormNameOption(event) {
    this.formNameParam = {
      key: this.formNameApi,
      label: event
    };
  }

  getAddedFormName(event) {
    if (event) {
      this.formNames = [];
      this.inspectionForm.get('form_name').setValue(null);
      this.initialValues.formName = getBlankOption();
      this._commonService.getStaticOptions(this.formNameApi).subscribe((response) => {
        this.inspectionForm.get('form_name').setValue(event.id);
        this.initialValues.formName = { label: event.label, value: event.id };
        this.formNames = response.result['vehicle-inspection-form-name'];
      });
    }
  }

  submitForm() {
    let form = this.inspectionForm;
    if (form.valid) {
      if (form.valid) {
        this.inspectionDetails.forEach((inspection) => {
          if (!this.inspectionId) {
            delete inspection['id']
          }
          inspection.documents = inspection.documents.map(document => {
            return document.id
          });
        })
        form.value.inspections = cloneDeep(this.inspectionDetails);
        if (this.inspectionId) {
          this.apiHandler.handleRequest(this._genericCheckListService.editInspection(this.postApiUrl, this.inspectionId, form.value), `${'this.addInspectionForm.value.name'} added successfully!`).subscribe((res) => {
            this._router.navigate([this.prefixUrl + '/organization_setting/settings/' + this.inspectionType + '-inspection/custom-field'])
          })
        } else {
          delete form.value['id']
          this.apiHandler.handleRequest(this._genericCheckListService.addInspection(this.postApiUrl, form.value), `${'this.addInspectionForm.value.name'} updated successfully!`).subscribe((res) => {
            this._router.navigate([this.prefixUrl + '/organization_setting/settings/' + this.inspectionType + '-inspection/custom-field'])

          })
        }
      } else {
        setAsTouched(form)
      }
    } else {
      setAsTouched(form)
    }
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }
}
