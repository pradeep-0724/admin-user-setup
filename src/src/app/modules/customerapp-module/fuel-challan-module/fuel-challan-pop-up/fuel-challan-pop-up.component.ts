import { Validators } from '@angular/forms';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { getBlankOption, isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { ErrorList } from 'src/app/core/constants/error-list';
import { FuelChallanService } from '../../api-services/fuel-challan-service/fuel-challan.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { CompanyTripGetApiService } from '../../revenue-module/trip-module/company-vehicle-module/company-trip-class/company-trip-service.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { popupOverflowService } from '../../api-services/auth-and-general-services/popup-overflow.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-fuel-challan-pop-up',
  templateUrl: './fuel-challan-pop-up.component.html',
  styleUrls: ['./fuel-challan-pop-up.component.scss']
})
export class FuelChallanPopUpComponent implements OnInit {
  @Input() inputData;
  @Output() dataFromPopUp = new EventEmitter();
  initialValues = {
    vehicle: [],
    vendor_name: getBlankOption()
  }
  fuelChallanForm: UntypedFormGroup;
  apiError = ''
  currency_type;
  errorHeaderMessage = new ErrorList().headerMessage;
  globalFormErrorList = [];
  vehicleList = [];
  possibleErrors = new ErrorList().possibleErrors;
  partyListVendor = [];
  isBilledAny = false;
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;
  screenType=ScreenType;

  constructor(private _fb: UntypedFormBuilder,private _analytics:AnalyticsService, private currency: CurrencyService, private _companyTripGetApiService: CompanyTripGetApiService, private fuelChallanService: FuelChallanService, private _popupBodyScrollService:popupOverflowService,
    private apiHandler: ApiHandlerService) { }

  ngOnInit() {
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.FUELCHALLAN,this.screenType.ADD,"Navigated");
    this.currency_type = this.currency.getCurrency();
    this.buildForm();
    let date = new Date(dateWithTimeZone());
    this.fuelChallanForm.get('date').setValue(date)
    this._companyTripGetApiService.getVehicleActiveList(vehicleList => { this.vehicleList = vehicleList });
    this._companyTripGetApiService.getPartyTripDetails('0,1', '1', partyList => { this.partyListVendor = partyList });
    if (this.inputData.isEdit) {
      this.patchData(this.inputData.data);
    } else {
      this.addMoreFuelDetails([]);
    }
  }

  onOkButtonClick() {

    let form = this.fuelChallanForm;
    if (form.valid) {
      this._popupBodyScrollService.popupHide();
      this.preparRequest(form.value);
      if (!this.inputData.isEdit) {
        this.apiHandler.handleRequest(this.fuelChallanService.postFuelChallans(form.value),'Fuel Challan added successfully!').subscribe(
          {
            next: () => {
          this._analytics.addEvent(this.analyticsType.CREATED,this.analyticsScreen.FUELCHALLAN)
          this.dataFromPopUp.emit(true);
          this.inputData.show = false;
          },
          error: () => {
            this.apiError = 'Failed to add fuel challan!';
            setTimeout(() => (this.apiError = ''), 3000);
          },
        }
        )
      } else {
        this.apiHandler.handleRequest(this.fuelChallanService.putFuelChallans(form.value, this.inputData.data.id), 'Fuel Challan updated successfully!').subscribe(
          {
            next: () => {
              this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.FUELCHALLAN)
              this.dataFromPopUp.emit(true);
              this.inputData.show = false;
            },
            error: () => {
              this.apiError = 'Failed to update fuel challan!';
              setTimeout(() => (this.apiError = ''), 3000);
            },
          }
        )
      }

    } else {
      this.setAsTouched(form);
      this.setFormGlobalErrors();
    }

  }
  cancelButtonClick() {
    this.dataFromPopUp.emit(false);
    this.inputData.show = false;
    this._popupBodyScrollService.popupHide();
  }

  buildForm() {
    this.fuelChallanForm = this._fb.group({
      vendor: ['', Validators.required],
      date: ['', Validators.required],
      fuel_challans_meta: this._fb.array([]),
      has_trip: false
    })
  }

  getFuelArray(item) {
    const form = this._fb.group({
      vehicle: [
        item.vehicle || null, [Validators.required]
      ],
      id: [item.id || null],
      fuel_quntity: [
        item.fuel_quntity || 0.00, [Validators.required, Validators.min(0.01)]
      ],
      fuel_cost: [item.fuel_cost || 0.00, [Validators.required, Validators.min(0.01)]
      ],
      total: [
        item.total || 0.00
      ],
      document: [
        item.document || ""
      ],
      status: [item.status ? item.status.index :2],
      date: [
        item.date || new Date(dateWithTimeZone())
      ]
    });
    return form;
  }

  addMoreFuelDetails(items: []) {
    const vehicleDetails = this.fuelChallanForm.controls['fuel_challans_meta'] as UntypedFormArray;
    if (items.length == 0) {
      this.initialValues.vehicle.push(getBlankOption());
      vehicleDetails.push(this.getFuelArray({}));
    }
    else {
      items.forEach(fuel => {
        vehicleDetails.push(this.getFuelArray(fuel));
      })
    }

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

  setFormGlobalErrors() {
    this.globalFormErrorList = [];
    let errorIds = Object.keys(this.possibleErrors);
    for (let prop of errorIds) {
      const error = this.possibleErrors[prop];
      if (error.status == true) {
        this.globalFormErrorList.push(error.message);
      }
    }
  }

  removeVehicleDetail(index) {
    const vehicleDetails = this.fuelChallanForm.controls['fuel_challans_meta'] as UntypedFormArray;
    this.initialValues.vehicle.splice(index, 1);
    vehicleDetails.removeAt(index);
  }

  calculateTotal(form) {

    let fuelQuantity = Number(form.get('fuel_quntity').value)
    let fuelCost = Number(form.get('fuel_cost').value)
    let total = (Number(fuelCost * fuelQuantity)).toFixed(3)
    form.get('total').setValue(total)

  }
  populateFuelRate(form) {
    
    let fuelDate = this.fuelChallanForm.get('date').value;
    
    
    if (fuelDate) {
      let params = {
        date: changeDateToServerFormat(fuelDate)
      }

      this.fuelChallanService.getFuelPrice(params).subscribe((res) => {
        form.controls['fuel_cost'].setValue(res.result.fuel_rate);
        this.calculateTotal(form);
      })
    }
  }


  preparRequest(formData) {
    formData['date'] = changeDateToServerFormat(formData['date'])
    if (formData['fuel_challans_meta'].length > 0) {
      let unbilledData =[];
      if(this.inputData.isEdit){
        formData['fuel_challans_meta'].forEach(element => {
          element['date'] = changeDateToServerFormat(element['date']);
          if(element['status']){
            if(element['status']!= 1){
              unbilledData.push(element)
              delete element['status']
            }
          }
        });
        formData['fuel_challans_meta'] =unbilledData;
      }else{
        formData['fuel_challans_meta'].forEach(element => {
          element['date'] = changeDateToServerFormat(element['date']);
        });
      }

    }
  }

  patchData(data) {
    this.initialValues.vehicle = [];
    this.fuelChallanForm.get('date').setValue(data.date);
    this.fuelChallanForm.get('vendor').setValue(data.vendor.id);
    this.fuelChallanForm.get('has_trip').setValue(data.has_trip);
    this.initialValues.vendor_name = { label: data.vendor.name, value: '' };
    let dataValues = JSON.parse(JSON.stringify(data.unpaidfuelchallan))
    dataValues.forEach(element => {
      if (isValidValue(element['vehicle'])) {
        this.initialValues.vehicle.push({ label: element['vehicle'].reg_number, value: '' })
        element['vehicle'] = element['vehicle'].id
      } else {
        this.initialValues.vehicle.push(getBlankOption())
      }

    });
    this.addMoreFuelDetails(dataValues);
    this.isBilledAny = this.isBilled();
  }


  isBilled() {
    const vehicleDetails = this.fuelChallanForm.controls['fuel_challans_meta'] as UntypedFormArray;
    let billed = false;
    vehicleDetails.controls.forEach(item => {
      if (item.get('status').value == 1) {
        billed = true
        return
      }
    });
    return billed

  }

}
