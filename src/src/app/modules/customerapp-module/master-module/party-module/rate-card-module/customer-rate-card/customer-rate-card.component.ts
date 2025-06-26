import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { DeleteAlertComponent } from 'src/app/shared-module/delete-alert-module/delete-alert/delete-alert.component';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { setAsTouched } from 'src/app/shared-module/utilities/form-utils';
import { getBlankOption } from 'src/app/shared-module/utilities/helper-utils';
import { RateCardServiceService } from '../../../rate-card-module/rate-card-service.service';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { Dialog } from '@angular/cdk/dialog';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { RateCardService } from 'src/app/modules/customerapp-module/api-services/master-module-services/rate-card-service/rate-card.service';

@Component({
  selector: 'app-customer-rate-card',
  templateUrl: './customer-rate-card.component.html',
  styleUrls: ['./customer-rate-card.component.scss']
})
export class CustomerRateCardComponent implements OnInit {

  rateCardId = '';
  rateCardDetails;
  rateCardForm: FormGroup;
  preFixUrl = getPrefix();
  initialValues = {
    pullOut: [],
    deposit: [],
    customer: [],
  }
  currency_type;
  zonesList = []
  analyticsType = OperationConstants;
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  apiError = ''
  nameError = ''
  partyId = '';

  constructor(private _fb: FormBuilder, private currency: CurrencyService, private commonloaderservice: CommonLoaderService, private _scrollToTop: ScrollToTop,
    private _rateCard: RateCardServiceService, private _route: Router,public dialog: Dialog,private _customerRateCard : RateCardService,
    private _analytics: AnalyticsService, private apiHandler: ApiHandlerService,private activatedRoute : ActivatedRoute) { }

  ngOnInit(): void {
    this.commonloaderservice.getHide();
    this.buildForm();
    this.currency_type = this.currency.getCurrency();
    this.getZonesList();
    this.buildRateCard([{}]);
    this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.RATECARD, this.screenType.ADD, "Navigated");
    this.activatedRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('partyId')) {
        this.partyId = paramMap.get('partyId');
        this.rateCardForm.get('party').setValue(this.partyId);
      }
      if (paramMap.has('rateCardId')) {
        this.rateCardId = paramMap.get('rateCardId');
          this.getCustomerRatecardEditDetils();
      }else{
        this.getCommonRateCardDetails();
      }
    });

  }

  getCustomerRatecardEditDetils(){
    this._customerRateCard.getCustomerRateCardDetails(this.partyId).subscribe(resp => {
      this.rateCardDetails = resp['result'];
      this.patchRateCard();
    })
  }

  getCommonRateCardDetails() {
    this._customerRateCard.getCommonRateCardDetails().subscribe((res)=>{
      this.rateCardDetails = res['result'];
      this.patchRateCard()
    })
  }

  getZonesList() {
    this._rateCard.getZonesList().subscribe((res) => {
      this.zonesList = res['result'].zone
    })
  }

  buildForm() {
    this.rateCardForm = this._fb.group({
      date: [new Date(dateWithTimeZone())],
      vehicle_category: [4],
      is_pullout: true,
      is_deposit: true,
      is_pullout_and_deposit: true,
      is_liveLoading: true,
      party : [this.partyId],
      ratecardmeta: this._fb.array([])
    })
  }

  ngOnDestroy(): void {
    this.commonloaderservice.getShow();
  }




  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  buildRateCard(items: any) {
    this.initialValues.customer = [];
    this.initialValues.deposit = [];
    this.initialValues.pullOut = [];
    let rateCard = this.rateCardForm.get('ratecardmeta') as FormArray;
    rateCard.controls = [];
    items.forEach(item => {
      const rateCardForm = this.getRateCard(item);
      rateCard.push(rateCardForm);
    this.initialValues.customer.push(getBlankOption());
    this.initialValues.deposit.push(getBlankOption());
    this.initialValues.pullOut.push(getBlankOption());
    });
  }


  getRateCard(item) {
    return this._fb.group({
      pull_out_port:[item?.pull_out_port||null,[Validators.required]],
      customer_location:[item?.customer_location||null,[Validators.required]],
      deposit_port: [item?.deposit_port||null,[Validators.required]],
      pullout: this._fb.group({
        regular:item?.pullout?.regular||0.00,
        couple: item?.pullout?.couple||0.00,
        boggy:item?.pullout?.boggy||0.00,
        sideLoader:item?.pullout?.sideLoader||0.00,
        lowBed:item?.pullout?.lowBed||0.00,
      }),
      deposit: this._fb.group({
        regular:item?.deposit?.regular||0.00,
        couple: item?.deposit?.couple||0.00,
        boggy:item?.deposit?.boggy||0.00,
        sideLoader:item?.deposit?.sideLoader||0.00,
        lowBed:item?.deposit?.lowBed||0.00,
      }),
      pullout_deposit: this._fb.group({
        regular:item?.pullout_deposit?.regular||0.00,
        couple: item?.pullout_deposit?.couple||0.00,
        boggy:item?.pullout_deposit?.boggy||0.00,
        sideLoader:item?.pullout_deposit?.sideLoader||0.00,
        lowBed:item?.pullout_deposit?.lowBed||0.00,
      }),
      live_loading: this._fb.group({
        regular:item?.live_loading?.regular||0.00,
        couple: item?.live_loading?.couple||0.00,
        boggy:item?.live_loading?.boggy||0.00,
        sideLoader:item?.live_loading?.sideLoader||0.00,
        lowBed:item?.live_loading?.lowBed||0.00,
      }),
    })
  }

  onChangeScopeOfWork(key){
    const SoOptions:Record<string,string>={
      'pullout':'is_pullout',
      'deposit':'is_deposit',
      'pullout_deposit':'is_pullout_and_deposit',
      'live_loading':'is_liveLoading'

    }
   let isTrue= this.rateCardForm.get(SoOptions[key]).value
   if(!isTrue){
    const dialogRef = this.dialog.open(DeleteAlertComponent, {
      data : {
        message:'Are you sure you want to remove this block? This will delete all associated data."'
      },
      width: '200px',
      maxWidth: '90%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((resp: boolean) => {   
      if(resp){
        let rateCard = this.rateCardForm.get('ratecardmeta') as FormArray;
        rateCard.controls.forEach(form=>{
          form.get(key).patchValue({
            regular:0.00,
            couple:0.00,
            boggy:0.00,
            sideLoader:0.00,
            lowBed:0.00,
          })
        })
      }else{
        this.rateCardForm.get(SoOptions[key]).setValue(true)
      }
      dialogRefSub.unsubscribe();
    });
   }
   
  }

  addRateCard() {
    let rateCard = this.rateCardForm.get('ratecardmeta') as FormArray;
    const rateCardForm = this.getRateCard({});
    rateCard.push(rateCardForm)
    this.initialValues.customer.push(getBlankOption());
    this.initialValues.deposit.push(getBlankOption());
    this.initialValues.pullOut.push(getBlankOption());
    
  }

  removeRateCard(index) {
    let rateCard = this.rateCardForm.get('ratecardmeta') as FormArray;
    rateCard.removeAt(index)
    this.initialValues.customer.splice(index,1);
    this.initialValues.deposit.splice(index,1);
    this.initialValues.pullOut.splice(index,1);
  }
  pullOutChange(form,index){
    let pulloutPortId=form.get('pull_out_port').value
    let zoneObj=this.zonesList.find(zone=>zone.id==pulloutPortId)
    if(zoneObj){
      form.get('deposit_port').setValue(pulloutPortId)
      this.initialValues.deposit[index]={label:zoneObj['name'],value:''}
    }
  }


  navigateToList() {
    let queryParams = {
      openClientTab: 4,
      chargesTab: 3
    }
    this._route.navigate([getPrefix() + '/onboarding/party/details/client/' + this.partyId], { queryParams })
  }



  patchRateCard() {
    this.rateCardForm.patchValue({
      date: this.rateCardDetails.date ? this.rateCardDetails.date : new Date(dateWithTimeZone()),
      vehicle_category: 4,
      is_pullout: this.rateCardDetails['container_handling']['pullout'],
      is_deposit: this.rateCardDetails['container_handling']['deposit'],
      is_pullout_and_deposit:this.rateCardDetails['container_handling']['pullout_deposit'],
      is_liveLoading:this.rateCardDetails['container_handling']['live_loading'],
    })
    this.rateCardDetails.ratecardmeta.forEach((meta, index) => {
      meta['customer_location']= meta['zone']['id']
      meta['deposit_port']= meta['deposit_zone']['id']
      meta['pull_out_port']= meta['pullout_zone']['id']
    });
    this.buildRateCard(this.rateCardDetails.ratecardmeta);
    this.rateCardDetails.ratecardmeta.forEach((meta, index) => {
      this.initialValues.customer[index]={label:meta['zone']['name'],value:''} 
      this.initialValues.deposit[index]={label: meta['deposit_zone']['name'],value:''}
      this.initialValues.pullOut[index]={label:meta['pullout_zone']['name'],value:''} 
    });
 
  }


  saveRateCard() {
    let form = this.rateCardForm;
    let formValue=cloneDeep(form.value)
    formValue['date'] = changeDateToServerFormat(formValue['date'])
    if (form.valid) {
      formValue['ratecardmeta'].forEach((ratecard, index) => {
        ratecard['order_no'] = index;
        ratecard['pullout_zone']=ratecard['pull_out_port']
        ratecard['deposit_zone']=ratecard['deposit_port']
        ratecard['zone']=ratecard['customer_location']
        delete ratecard['pull_out_port']
        delete ratecard['deposit_port']
        delete ratecard['customer_location']

      });
      formValue['container_handling']={
        'live_loading':formValue['is_liveLoading'], 
        'pullout': formValue['is_pullout'],
        'deposit': formValue['is_deposit'],
        'pullout_deposit': formValue['is_pullout_and_deposit'],
      }
      delete formValue['is_liveLoading']
      delete formValue['is_pullout']
      delete  formValue['is_deposit']
      delete  formValue['is_pullout_and_deposit']

      if (this.rateCardId) {
        this.apiHandler.handleRequest(this._customerRateCard.putCustomerRateCard(this.rateCardId, formValue), 'Ratecard details updated successfully!').subscribe(
          {
            next: () => {
              this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.RATECARD)
              this.navigateToList();
            },
            error: (error) => {
              if (error?.error?.message) {
                this.apiError = error?.error?.message
                if (this.apiError.includes('Rate card name already exists. Please enter a unique name')) {
                  this.nameError = "Rate card name already exists."
                }
                this._scrollToTop.scrollToTop()
                setTimeout(() => {
                  this.apiError = ''
                }, 3000)
              }
            }
          }
        )
      } else {
        this.apiHandler.handleRequest(this._customerRateCard.postCustomerRateCard(formValue), 'Ratecard details added successfully!').subscribe(
          {
            next: (response) => {
              this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.RATECARD);
              this.navigateToList();
            },
            error: (error) => {
              if (error?.error?.message) {
                this.apiError = error?.error?.message
                this._scrollToTop.scrollToTop()
                setTimeout(() => {
                  this.apiError = ''
                }, 3000)
              }
            }
          }
        )
      }
    } else {
      setAsTouched(form);
    }
  }

  syncCommonRateCardValues(event) {
    const dialogRef = this.dialog.open(DeleteAlertComponent, {
      data: {
        message: 'All values will be updated to latest Common Rate Card. Are you sure you want to update Customer’s rate card?'
      },
      width: '200px',
      maxWidth: '90%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((resp: boolean) => {
      if (resp) {
        this.getCommonRateCardDetails();
      }
      dialogRefSub.unsubscribe();
    });
  }

 

}
