import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, UntypedFormArray, Validators, } from '@angular/forms';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { RateCardService } from '../../../../api-services/master-module-services/rate-card-service/rate-card.service';
import { setAsTouched } from 'src/app/shared-module/utilities/form-utils';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { CommonService } from 'src/app/core/services/common.service';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { Dialog } from '@angular/cdk/dialog';
import { AddAdditionalChargePopupComponent } from '../add-additional-charge-popup/add-additional-charge-popup.component';
import { getBlankOption, isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { TaxModuleServiceService } from 'src/app/tax-module/tax-module-service.service';
@Component({
  selector: 'app-additional-charge-rate-card',
  templateUrl: './additional-charge-rate-card.component.html',
  styleUrls: ['./additional-charge-rate-card.component.scss'],
  host: {
		'(document:click)': 'outSideClick($event)',
	}
})
export class AdditionalChargeRateCardComponent implements OnInit {
  rateCardForm: FormGroup;
  preFixUrl = getPrefix();
  initialValues = {
    unit_of_measurement: [],
    tax : []
  }
  currency_type;
  vechileTypeList = []
  partyId = '';
  rateCardId = '';
  rateCardDetails;
  selectedIDs = [];
  originalCharges = []
  addVehicle: any = {};
  vehicleApi = TSAPIRoutes.static_options;
  staticOptions: any = {};
  chargesList: any[] = [];
  display_err = ''
  @ViewChild('pageBottom') pageBottom!: ElementRef;
	showOptions: string = '';
  deleteCradId = '';
  popupInputData = {
		'msg': 'Are you sure, you want to delete?',
		'type': 'warning',
		'show': false
	};
  isEdit : boolean = false;
  isTax=false;
  taxOptions=[]
  constructor(private _fb: FormBuilder, private currency: CurrencyService, private commonloaderservice: CommonLoaderService,private _tax:TaxService,
    private _rateCard: RateCardService, private activatedRoute: ActivatedRoute, private _route: Router,private _taxService:TaxModuleServiceService,
    private _commonService: CommonService, private dialog: Dialog, private _ScrollTo_Top: ScrollToTop) { }

  ngOnInit(): void {
    this.commonloaderservice.getHide();
    this.isTax= this._tax.getTax();
    this.buildForm();
    this.getTaxDetails();
    this.currency_type = this.currency.getCurrency();
    this._commonService.getStaticOptions('gst-treatment,tax,item-unit,payment-term')
      .subscribe((response) => {
        this.staticOptions.itemUnits = response.result['item-unit'];
      });
    this.activatedRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('partyId')) {
        this.partyId = paramMap.get('partyId')
      }
      if (paramMap.has('rateCardId')) {
        this.rateCardId = paramMap.get('rateCardId');
        this.isEdit = true;        
        setTimeout(() => {
          this.getRateCardDetails();
        }, 500);
      } else {
        this.isEdit = false;        
        setTimeout(() => {
          this.getAdditionalChargesList()
        }, 500);
      }
    });

  }

  getAdditionalChargesList() {
    this._rateCard.getAdditionalCharges().subscribe((data) => {
      this.chargesList = data.result.ac
      this.buildRateCard(this.chargesList);

    })
  }

  buildForm() {
    this.rateCardForm = this._fb.group({
      party: this.partyId,
      date: [new Date(dateWithTimeZone())],
      additionalcardmeta: this._fb.array([])
    })
  }

  buildRateCard(items = []) {    
    this.initialValues.unit_of_measurement = [];
    this.initialValues.tax = [];
    let rateCard = this.rateCardForm.get('additionalcardmeta') as FormArray;
    rateCard.controls = [];
    items.forEach((item, ind) => {
      this.initialValues.unit_of_measurement.push(getBlankOption());
      this.initialValues.tax.push(getBlankOption());      
      let tax = this.taxOptions.filter((tax) => tax.id == this.chargesList[ind]?.tax.id);  
      let measurement = this.staticOptions.itemUnits.filter((item) => item.id == this.chargesList[ind]?.unit_of_measurement);
      if (measurement.length > 0) {
        this.initialValues.unit_of_measurement[ind].label = measurement[0].label;
      } else {
        this.initialValues.unit_of_measurement[ind] = getBlankOption()
      }
      if (tax.length > 0) {
        this.initialValues.tax[ind].label = tax[0].label;
      } else {
        this.initialValues.tax[ind] = getBlankOption()
      }
      const rateCardForm = this.getRateCard(item);
      rateCard.push(rateCardForm);
    });
  }

  getRateCard(item) {
    return this._fb.group({
      id: [item.id],
      name: [item.name || ''],
      sku:[item.sku||''],
      rate: [ item.rate || 0],
      vehicle_category: [item.vehicle_category],
      selected_vehicle_category: [this.assignVehiclecategory(item.vehicle_category)],
      unit_of_measurement: [item.unit_of_measurement],
      tax:[item.tax.id],
      is_checked: [item.is_checked]
    })
  }

  assignVehiclecategory(types) {
    let cartegories:Record<number,string> = {
      0:'Loose Cargo',
      1:'Crane',
      2:'Awp',
      4:'Container'
  };
  let vechCategories=[]
    types.forEach((item, index) => {
      vechCategories.push(cartegories[item])
    });
    return vechCategories.length==0?'':vechCategories.join(', ')
  }

  getRateCardDetails() {
    this._rateCard.getAdditionalChargesRateCard(this.partyId, this.rateCardId).subscribe(resp => {
      this.chargesList = resp['result'].ac;
      this.buildRateCard(this.chargesList);
      setTimeout(() => {
        this.rateCardForm.get('date').setValue(resp['result'].date)
      }, 400);
    })
  }

  ngOnDestroy(): void {
    this.commonloaderservice.getShow();
  }

  chargeSelected(event, ind) {
    let form = this.rateCardForm.get('additionalcardmeta') as UntypedFormArray;

    if (event.checked) {
      form.at(ind).get('rate').setValidators([Validators.min(0.01), Validators.required]);
      form.at(ind).get('unit_of_measurement').setValidators([Validators.required]);
    } else {
      form.at(ind).get('rate').clearValidators();
      form.at(ind).get('unit_of_measurement').clearValidators();
    }
    form.at(ind).get('rate').updateValueAndValidity();
    form.at(ind).get('unit_of_measurement').updateValueAndValidity();
  }

  rateChanged(event, ind) {
    let form = this.rateCardForm.get('additionalcardmeta') as UntypedFormArray;
    form.at(ind).get('rate').setValidators([Validators.min(0.01), Validators.required]);
    form.at(ind).get('unit_of_measurement').setValidators([Validators.required]);
  }

  saveRateCard() {
    let form = this.rateCardForm;
    form.value['date'] = changeDateToServerFormat(form.value['date'])
    form.value['party'] = this.partyId;
    let charges: any[] = form.get('additionalcardmeta').value;
    let chargeSelected = charges.some((item) => item.is_checked);
    if (form.valid) {
      if (chargeSelected) {
        this.display_err = '';
        form.value['additionalcardmeta'].forEach(charges => {
        });
        if (this.rateCardId) {
          this._rateCard.putAdditionalChargesRateCard(this.rateCardId, form.value).subscribe(resp => {
            this.navigateToDetails()
          })
        } else {
          this._rateCard.postAdditionalChargesRateCard(form.value).subscribe(resp => {
            this.navigateToDetails()
          })
        }
      } else {
        this.display_err = 'Select atleast one Charge'
      }
    } else {
      this._ScrollTo_Top.scrollToTop();
      setAsTouched(form);
    }

  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  navigateToDetails() {
    let queryParams = {
      openClientTab: 4,
      chargesTab: 2
    }
    this._route.navigate([getPrefix() + '/onboarding/party/details/client/' + this.partyId], { queryParams })

  }

  addAdditionalCharge() {
    let rateCard = this.rateCardForm.get('additionalcardmeta') as FormArray;
    const dialogRef = this.dialog.open(AddAdditionalChargePopupComponent, {
      data : {
        isEdit : false,
        sales:false,
        purchase:false,
        vehicleCategory:true,
      },
      width: '1000px',
      maxWidth: '90%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let index = rateCard.controls.length
    let dialogRefSub = dialogRef.closed.subscribe((item: any) => {
      if (isValidValue(item)) {
        let newGroup = this._fb.group({
          id: [item.name.id],
          name: [item.name.name],
          rate: [item.rate, [Validators.required, Validators.min(0.01)]],
          vehicle_category: [item.vehicle_category],
          selected_vehicle_category: [this.assignVehiclecategory(item.vehicle_category)],
          unit_of_measurement: [item.unit_of_measurement?.id],
          tax:[item.tax?.id],
          sku:[item.sku],
          is_checked: [true]
        })
        rateCard.push(newGroup)
        this.initialValues.unit_of_measurement.push(getBlankOption());
        this.initialValues.tax.push(getBlankOption());
        let measurement = this.staticOptions.itemUnits.filter((ele) => ele.id == item?.unit_of_measurement['id']);
        this.initialValues.unit_of_measurement[index].label = measurement[0].label;
        this.initialValues.tax[index].label = item.tax.label;
        setTimeout(() => {
          if (this.pageBottom) {
            this.pageBottom.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
          }
        }, 600);
        dialogRefSub.unsubscribe();
      }
    });
  }

  optionsList( list_index) {
		return this.showOptions = list_index;
	}

  outSideClick(env) {
		if ((env.target.className).indexOf('more-icon') == -1)
			this.showOptions = ''
	}
  

  editParty(data,index) {   
    let rateCard = this.rateCardForm.get('additionalcardmeta') as FormArray;
    let measurement = this.staticOptions.itemUnits.find((item) => item.id == data.unit_of_measurement);
    if (measurement) {
      data['selectedOption']  = measurement.label;
    }
    let tax = this.taxOptions.find((item) => item.id == data.tax);    
    data['tax'] = tax;
    const dialogRef = this.dialog.open(AddAdditionalChargePopupComponent, {
      data : {
        data : data,
        isEdit : true,
        index : index
      },
      width: '1000px',
      maxWidth: '90%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((item:any) => {      
      if(isValidValue(item)){
        rateCard.at(item.index).get('name').setValue(item.data.name);
        rateCard.at(item.index).get('selected_vehicle_category').setValue(this.assignVehiclecategory(item.data.vehicle_category));
        rateCard.at(item.index).get('vehicle_category').setValue(item.data.vehicle_category);
        rateCard.at(item.index).get('tax').setValue( item.data['tax']);
        rateCard.at(item.index).get('sku').setValue( item.data['sku']);
        rateCard.at(item.index).get('unit_of_measurement').setValue(item.data.unit_of_measurement);
        rateCard.at(item.index).get('is_checked').setValue(item.editData.is_checked);
        rateCard.at(item.index).updateValueAndValidity()
        this.initialValues.unit_of_measurement[item.index] = getBlankOption();
        this.initialValues.tax[item.index] = getBlankOption();
        let measurement = this.staticOptions.itemUnits.filter((ele) => ele.id == item?.data.unit_of_measurement);
        this.initialValues.unit_of_measurement[item.index].label = measurement[0].label;    
        let tax = this.taxOptions.find((ele) => ele.id == item.data['tax']);
        this.initialValues.tax[item.index] = tax;     
      }
      dialogRefSub.unsubscribe();
    });
  }

  deleteCard(data){
    this.deleteCradId = data.id;    
    this.popupInputData['show']= true;
  }

  confirmButton(e){
    if(e){
      this._rateCard.deleteAdditionalChargePopUpDate(this.deleteCradId).subscribe((res)=>{
        if(this.isEdit){
          this.getRateCardDetails()
        }else{
          this.getAdditionalChargesList();
        }
        this.popupInputData['show']= false;
      })
    }
  }

  getTaxDetails() {
    this._taxService.getTaxDetails().subscribe(result => {
      this.taxOptions = result.result['tax'];
    })
  }

 
}

