;
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { VehicleService } from '../../../../api-services/master-module-services/vehicle-services/vehicle.service';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { trimExtraSpaceBtwWords, getBlankOption } from 'src/app/shared-module/utilities/helper-utils';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { TyreMasterAddEditService } from '../../../../api-services/master-module-services/tyre-master-service/tyre-master-add-edit-service.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { Subject } from 'rxjs';
import { setAsTouched } from 'src/app/shared-module/utilities/form-utils';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';
import { AnalyticsService } from 'src/app/core/services/analytics.service';

@Component({
  selector: 'app-edit-vehicle-tyre-master',
  templateUrl: './vehicle-tyre-master.component.html',
  styleUrls: ['./vehicle-tyre-master.component.scss']
})
export class VehicleTyreMasterComponent implements OnInit, AfterViewInit, OnDestroy {

  tyreMasterForm: UntypedFormGroup;
  vehicleMake = [];
  makeSelectedId: any;
  vehicleMakeUrl = TSAPIRoutes.vehicle_make;
  vehicleMakeParam: any = {};
  vehicleModel: any = [];

  vehicleModelUrl = TSAPIRoutes.vehicle_model;
  vehicleModelParam: any = {};
  tyreNumbers = new ValidationConstants().tyreNumbers;
  initialValues = {
    model: getBlankOption(),
    make: getBlankOption()
  }
  prefixUrl = '';
  tyreMasterID: any = '';
  analyticsType = OperationConstants;
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  addNewAxel = new Subject()
  removeAxels = new Subject()
  editData = new Subject();
  totalTyre = 0
  totalSpareTyre = 0;
  
  constructor(
    private _fb: UntypedFormBuilder,
    private _vehicleService: VehicleService,
    private _tyreMaster: TyreMasterAddEditService,
    private _prefixUrl: PrefixUrlService,
    private _route: Router,
    private _activatedroute: ActivatedRoute,
    private _commonloaderservice: CommonLoaderService,
    private apiHandler: ApiHandlerService,
    private _analytics: AnalyticsService
  ) { }

  ngOnInit() {
    this._commonloaderservice.getHide();
    this.prefixUrl = this._prefixUrl.getprefixUrl();
    this.buildForm();
    this._vehicleService.getVehicleMake().subscribe((response) => {
      this.vehicleMake = response.result;
    });

  }

  ngAfterViewInit(): void {
    this._activatedroute.params.subscribe((params) => {
      this.tyreMasterID = params.tyremaster_id;
      if (this.tyreMasterID) {
        this._tyreMaster.getTyreMasterDetails(this.tyreMasterID).subscribe(resp => {
          this.patchDetails(resp['result'])
        })
      }
    })
    this._activatedroute.queryParamMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('make') && paramMap.has('model')) {
        if (paramMap.get('make')!='null') {
          this._vehicleService.getVehicleMake().subscribe((response) => {
            this.vehicleMake = response.result;
            this.initialValues.make = { label: this.vehicleMake.find(make => make.id == paramMap.get('make')).make_name, value: '' }
              this._vehicleService.getVehicleModel(paramMap.get('make'), true).subscribe((response) => {
                this.vehicleModel = response.result;
                if(paramMap.get('model')!='null'){
                  this.initialValues.model = { label: this.vehicleModel.find(model => model.id == paramMap.get('model')).model_name, value: '' };
                }
              });
          
            this.tyreMasterForm.patchValue({
              vehicle_make:paramMap.get('make')!='null'?paramMap.get('make'):null,
              vehicle_model:paramMap.get('model')!='null'?paramMap.get('model'):null,
            })
          });
        }
      }
    });
  }

  ngOnDestroy(): void {
    this._commonloaderservice.getShow()
  }


  populateVehicleModel(data) {
    this.makeSelectedId = data.vehicle_make.id;
    this._vehicleService.getVehicleModel(this.makeSelectedId).subscribe((response) => {
      // this.model = {};
      this.vehicleModel = response.result;
    });

    this.tyreMasterForm.get('vehicle_model').setValue(data['vehicle_model']['id']);
    this.initialValues.model['value'] = data.vehicle_model.id;
    this.initialValues.model['label'] = data.vehicle_model.model_name;
  }

  buildForm() {
    this.tyreMasterForm = this._fb.group({
      vehicle_make: [
        null,
        Validators.required
      ],
      tyre_count: 0,
      axle_count: 0,
      spare_count: 0,
      vehicle_model: [null, Validators.required],
      tyre_positions: this._fb.array([])
    });
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
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

  getNewVehicleMake(event) {
    if (event) {
      this.vehicleMake = [];
      this._vehicleService.getVehicleMake().subscribe((response) => {
        this.tyreMasterForm.controls['vehicle_make'].setValue(event.id);
        this.makeSelectedId = event.id;
        this.vehicleMake = response.result;
        this.vehicleModel = [];
      });
    }
  }

  addNewVehicleMake(event) {
    if (event) {
      const arrStr = event.toLowerCase().split(' ');
      const titleCaseArr: string[] = [];
      for (const str of arrStr) {
        titleCaseArr.push(str.charAt(0).toUpperCase() + str.slice(1));
      }
      const word_joined = titleCaseArr.join(' ');
      this.vehicleMakeParam = {
        make_name: word_joined
      };
    }
  }

  patchDetails(data) {
    this.tyreMasterForm.patchValue({
      vehicle_make: data.vehicle_make['id'],
      tyre_count: data.tyre_count,
      axle_count: data.axle_count,
      spare_count: data.spare_count,
      vehicle_model: data.vehicle_model['id'],
    });
    this.totalTyre = data.tyre_count
    this.totalSpareTyre = data.spare_count
    this.initialValues.make = { label: data.vehicle_make['name'], value: '' }
    this.initialValues.model = { label: data.vehicle_model['name'], value: '' }
    this.editData.next(data.tyre_placements)
    this._vehicleService.getVehicleModel(data.vehicle_make['id'], true).subscribe((response) => {
      this.vehicleModel = response.result;
    });
  }

  onMakeSelected(ele) {
    if (ele.target.value != '') {
      this.makeSelectedId = ele.target.value;
      this._vehicleService.getVehicleModel(ele.target.value, true).subscribe((response) => {
        this.initialValues.model = getBlankOption();
        this.vehicleModel = response.result;
      });
    }
  }


  getNewVehicleModel(event) {
    if (event) {
      this.vehicleModel = [];
      this._vehicleService.getVehicleModel(this.makeSelectedId, true).subscribe((response) => {
        this.tyreMasterForm.get('vehicle_model').setValue(event.id);
        this.vehicleModel = response.result;
      });
    }
  }



  addNewVehicleModel(event) {
    if (event) {
      const val = trimExtraSpaceBtwWords(event);
      const arrStr = val.toLowerCase().split(' ');
      const titleCaseArr: string[] = [];
      for (const str of arrStr) {
        titleCaseArr.push(str.charAt(0).toUpperCase() + str.slice(1));
      }
      const word_joined = titleCaseArr.join(' ');

      this.vehicleModelParam = {
        vehicle_make: this.makeSelectedId ? this.makeSelectedId : "",
        model_name: word_joined
      };
    }
  }

  finishForm() {
    let form = this.tyreMasterForm
    if (form.valid) {
      form.value['axle_count'] = this.tyreMasterForm.controls.tyre_positions['controls'].length;
      form.value['spare_count'] = this.totalSpareTyre;
      form.value['tyre_count'] = this.totalTyre;
      form.value['tyre_placements'] = form.value['tyre_positions']
      if (this.tyreMasterID) {
        this.apiHandler.handleRequest(this._tyreMaster.updateTyreMasters(this.tyreMasterID, form.value), 'Tyre master updated successfully!').subscribe(
          {
            next: () => {
              this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.TYREMASTER)
              this._route.navigate([this.prefixUrl + '/onboarding/vehicle/tyremaster/view'])
            }
          })
      } else {
        this.apiHandler.handleRequest(this._tyreMaster.postTyreMasters(form.value), 'Tyre master added successfully!').subscribe(
          {
            next: () => {
              this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.TYREMASTER)
              this._route.navigate([this.prefixUrl + '/onboarding/vehicle/tyremaster/view'])
            }
          })
      }

    } else {
      setAsTouched(this.tyreMasterForm)
    }
  }

  emitTotalTyre(e) {
    this.totalTyre = e;
  }

  addAxel() {
    this.addNewAxel.next(true)
  }

  removeAxel() {
    this.removeAxels.next(true)
  }

  addSpareTyre() {
    this.totalSpareTyre++;
  }

  removeSpareTyre() {
    this.totalSpareTyre--;
  }









}
