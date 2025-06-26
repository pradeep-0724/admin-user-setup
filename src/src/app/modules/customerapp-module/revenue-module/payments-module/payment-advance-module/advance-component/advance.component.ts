import { JournalService } from '../../../../reports-module/accountant-module/journal-entry-module/services/journal.service';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, AbstractControl, UntypedFormArray, UntypedFormControl } from '@angular/forms';
import { PartyService } from '../../../../api-services/master-module-services/party-service/party.service';
import { CommonService } from 'src/app/core/services/common.service';
import { Router, ActivatedRoute } from '@angular/router';

import {  isValidValue,  roundOffAmount, getBlankOption } from 'src/app/shared-module/utilities/helper-utils';
import { PaymentsService } from '../../../../api-services/revenue-module-service/payment-services/payments-service.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { isBankChargeRequired, bankChargeRequired } from 'src/app/shared-module/utilities/payment-utils';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { BehaviorSubject } from 'rxjs';
import { TaxService } from 'src/app/core/services/tax.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { TerminologiesService } from 'src/app/core/services/terminologies.service';
import { TabIndexService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/tab-index.service';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { RevenueService } from '../../../../api-services/revenue-module-service/revenue-service/revenue.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';


@Component({
  selector: 'app-edit-advance-payment',
  templateUrl: './advance.component.html',
  styleUrls: ['./advance.component.scss'],
})
export class AdvancePaymentComponent implements OnInit, AfterViewInit, OnDestroy {

  addAdvanceForm: UntypedFormGroup;
  partyList: any = [];
  accountsList: any = [];
  staticOptions: any = {};
  PlaceOfSupplyStateList: any;
  advanceId: string;
  apiError: string;
  advanceAmount: any;
  bankingChargesApply: Boolean = false;
  IsreverseCharge: boolean = false;

  partyId: any;
  selectedParty: any = {};
  advanceDetails: any;
  banksData=[];
  initialValues = {
    party: getBlankOption(),
    paymentMode: {},
    paymentTerm: {},
    termsAndCondition : getBlankOption()

  };
  companyRegistered: boolean = true;
  currency_type;
  documentPatchData: any=[];
  patchFileUrls=new BehaviorSubject([]);
  showAddPartyPopup: any = {name: '', status: false};
  partyNamePopup: string = '';
  data: any;
  isFormValid :boolean = true;
  isTax :boolean = false;
  taxFormValid =new BehaviorSubject<any>(true);
  editData = new BehaviorSubject<any>({
    place_of_supply:''
  });
   prefixUrl = '';
   gstin='';
   analyticsType= OperationConstants;
   analyticsScreen=ScreenConstants;
   screenType=ScreenType;
   terminology:any;
   tersmAndConditions = [];
   goThroughDetais = {
    show: false,
    url: "https://demo.arcade.software/DuXS47Npqb5AElbxDJn2?embed%22"
  }



  constructor(
    private _fb: UntypedFormBuilder,
    private _partyService: PartyService,
    private _commonService: CommonService,
    private _paymentsService: PaymentsService,
    private _route: Router,
    private _journalService: JournalService,
    private _activatedRoute: ActivatedRoute,
    private currency:CurrencyService,
    private _tax:TaxService,
    private _prefixUrl: PrefixUrlService,
    private _analytics:AnalyticsService,
    private _terminologiesService:TerminologiesService,
    private _tabIndex:TabIndexService,
    private _scrollToTop:ScrollToTop,
    private _revenueService: RevenueService,private apiHandler: ApiHandlerService,

  ) {
    this.isTax = this._tax.getTax();
    this.terminology = this._terminologiesService.terminologie;
   }
   ngAfterViewChecked(): void {

    this._tabIndex.negativeTabIndex();

  }
   ngOnDestroy(){

      let body = document.getElementsByTagName('body')[0];
          body.classList.remove('removeLoader');

   }
  ngOnInit() {
    this.prefixUrl = this._prefixUrl.getprefixUrl();
     setTimeout(() => {
      this.currency_type = this.currency.getCurrency();
    }, 1000);
    this.getTersmAndConditionList();
    this._activatedRoute.params.subscribe(data => {

      this._journalService.getAccountList().subscribe((response: any) => {
        this.accountsList = response.result;
             var accountsData=this.accountsList;
      accountsData.forEach(element => {
        if(element.account_type === "Bank" ){
         this.banksData.push(element)
        }
        });
      });

      this.buildForm();


      this.advanceId = data.advance_id;
      let ClientPramas = '0'; // Client
      this._partyService.getPartyList('',ClientPramas).subscribe((response) => {
        this.partyList = response.result;
      });

      this._commonService.getSuggestedIds('advance_received').subscribe((response) => {
        this.addAdvanceForm.controls['advance_number'].setValue(response.result['advance_received']);
      });

      this.addAdvanceForm.controls['received_date'].setValue(new Date(dateWithTimeZone()));


    });
  }

  getTersmAndConditionList() {
		this._paymentsService.getTersmAndConditionList().subscribe((response: any) => {
		  this.tersmAndConditions = response.result['tc_content'];
		});
	}

  openGothrough(){
    this.goThroughDetais.show=true;
  }

  patchFormValues(data: any) {
    data.party = isValidValue(data.party) ? data.party.id : '';
    data.payment_mode = isValidValue(data.payment_mode) ? data.payment_mode.id : '';
    if (data.terms_and_condition) {
      this.initialValues.termsAndCondition['value'] = data.terms_and_condition.id;
      this.initialValues.termsAndCondition['label'] =  data.terms_and_condition.name;
      data.terms_and_condition = data.terms_and_condition.id;
    } else {
      this.initialValues.party = getBlankOption();
    }
    this.addAdvanceForm.patchValue(data);
    if (data.payment_mode && this.accountsList){
      this.bankingChargesApply = !isBankChargeRequired(data.payment_mode, this.accountsList);
    }
    this.bankingChargesApply = data.bank_charge
    this.onPaymentModeSelected()
  }

  getFormValues() {
    this._paymentsService.getCoutomerAdvance(this.advanceId).subscribe((data: any) => {
      if (data !== undefined) {
        this.advanceDetails = data.result;
        this.partyId = this.advanceDetails.party ? this.advanceDetails.party.id : null;
        this.paymentModePatch(data.result);
        this.partyNamePatch(data.result);
        this.patchFormValues(data.result);
        this.patchDocuments(data.result);
        if(this.isTax){
          this.editData.next(data.result);
        }

      }
    });
  }

	patchDocuments(data){
		if(data.documents.length>0){
		let documentsArray = this.addAdvanceForm.get('documents') as UntypedFormControl;
		documentsArray.setValue([]);
		const documents = data.documents;
		let pathUrl=[];
		documents.forEach(element => {
		  documentsArray.value.push(element.id);
		  pathUrl.push(element);
		});
		this.patchFileUrls.next(pathUrl);
		}
		}

  fileUploader(filesUploaded) {
    let documents = this.addAdvanceForm.get('documents').value;
    filesUploaded.forEach((element) => {
        documents.push(element.id);
    });
   }

  fileDeleted(deletedFileIndex) {
    let documents = this.addAdvanceForm.get('documents').value;
    documents.splice(deletedFileIndex, 1);
  }

  ngAfterViewInit() {
    if(this.advanceId){
      this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.ADVANCECLIENT,this.screenType.EDIT,"Navigated");
    setTimeout(() => {
      this.getFormValues();
    }, 1);
    }else{
      this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.ADVANCECLIENT,this.screenType.ADD,"Navigated");
    }
  }

  buildForm() {
    this.addAdvanceForm = this._fb.group({
      received_date: ['', Validators.required],
      party: ['', Validators.required],
      description_of_supply: [''],
      place_of_supply:[''],
      amount: [0, [Validators.required,Validators.min(0.01)]],
      advance_number: ['', Validators.required],
      final_amount: [0, Validators.required],
      payment_mode: ['', Validators.required],
      bank_charge: [0],
      optional_comments: [''],
      terms_and_condition: [''],
      documents: [[]]
    });
  }

  onPartySelected(partyId) {
    this.partyId = partyId;
    if (partyId === '') {
      this.selectedParty = null;
      this.partyId = null;
			return;
    }
    if (partyId !== '') {
      this._partyService.getPartyAdressDetails(partyId).subscribe(
        res=> {
          let placeofSupply={}
          this.selectedParty = res.result;
          if(this.selectedParty.tax_details['place_of_supply']){
            placeofSupply={
              place_of_supply:this.selectedParty.tax_details['place_of_supply']
            }
          }
          this.gstin =res.result.tax_details.gstin;
          if(this.isTax){
            this.editData.next(placeofSupply)
          }
          this.getDefaultBank(partyId)

        });
      }
  }
  getDefaultBank(id){
    let params={
      is_account :'True',
      is_tenant :'False'
    }
    this._revenueService.getDefaultBank(id,params).subscribe((data)=>{      
      this.initialValues.paymentMode=getBlankOption();
      if(data['result']){
        this.addAdvanceForm.get('payment_mode').setValue(data['result'].id);
        this.initialValues.paymentMode['label']=data['result'].name
        this.initialValues.paymentMode['value']=data['result'].id
        this.populatePaymentMethod()
      }
     
    })
  }



  populatePaymentMethod(){

    let vendorId =this.addAdvanceForm.get('party').value;
    if(vendorId){
      this.data = this.partyList.filter((ele) => ele.id === vendorId)[0];
    }
    this.onPaymentModeSelected()
  }


  finalCalculation() {
    this.addAdvanceForm.controls['final_amount'].setValue(this.addAdvanceForm.controls['amount'].value);

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


  submitAdvancePayment() {
    const form = this.addAdvanceForm;
    if (form.valid) {
      this.addAdvanceForm.controls['bank_charge'].setValue(this.addAdvanceForm.controls['bank_charge'].value ? this.addAdvanceForm.controls['bank_charge'].value : 0);
      form.controls['received_date'].setValue(changeDateToServerFormat(form.controls['received_date'].value));
      if (this.advanceId) {
        this.apiHandler.handleRequest(this._paymentsService.editCoutomerAdvance(form.value, this.advanceId), 'Advance updated successfully!').subscribe(
          {
            next: (response) => {
              this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.ADVANCECLIENT)
              this._route.navigate([this.prefixUrl + '/income/payments/list/advance'], { queryParams: { pdfViewId: this.advanceId } });
            },
            error: (err) => {
              this.apiError = '';
              if (err.error.status == 'error') {
                this.apiError = err.error.message;
                this._scrollToTop.scrollToTop();
                window.scrollTo(0, 0);
              }
            }
          }
        );
      }
      else{
        this.apiHandler.handleRequest(this._paymentsService.addCustomerAdvance(form.value), 'Advance added successfully!').subscribe(
          {
            next: (response) => {
              this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.ADVANCECLIENT)
              this._route.navigateByUrl(this.prefixUrl + '/income/payments/list/advance');
            }
          });
      }
    } else {
      this.setAsTouched(form);
      this._scrollToTop.scrollToTop();
      this.taxFormValid.next(false);
    }
  }

  onPaymentModeSelected() {    
		let bank = this.addAdvanceForm.controls['payment_mode'].value    
    this.bankingChargesApply = bankChargeRequired(bank, this.addAdvanceForm.get('bank_charge'), this.accountsList);
  }


  partyNamePatch(editAdvanceForm) {
    if (editAdvanceForm.party) {
      this.initialValues.party['value'] = editAdvanceForm.party.id;
      this.initialValues.party['label'] = editAdvanceForm.party.display_name;
    } else {
      this.initialValues.party = getBlankOption();
    }
    this._partyService.getPartyAdressDetails(this.initialValues.party['value']).subscribe((response) => {
			this.gstin =response.result.tax_details.gstin;
		});
  }



  paymentModePatch(editAdvanceForm) {
    if (editAdvanceForm.payment_mode) {
      this.initialValues.paymentMode['value'] = editAdvanceForm.payment_mode.id;
      this.initialValues.paymentMode['label'] = editAdvanceForm.payment_mode.name;
    } else {
      this.initialValues.paymentMode = getBlankOption();
    }
  }

  stopLoaderClasstoBody(){
		let body = document.getElementsByTagName('body')[0];
        body.classList.add('removeLoader');
	}

    // round off amount
    roundOffAmount(formControl) {
      roundOffAmount(formControl);
    }

    /* For  Opening the Party Modal */
    openAddPartyModal($event ) {
      if ($event)
        this.showAddPartyPopup = {name: this.partyNamePopup, status: true};
    }

    /* Adding the entered value to the list */
    addValueToPartyPopup(event){
      if (event) {
        this.partyNamePopup = event;
        }
    }

    /* For Displaying the party name in the subfield  */
    addPartyToOption($event) {
      if ($event.status) {
        this.getPartyDetails();
          this.initialValues.party = {value: $event.id, label: $event.label};
          this.addAdvanceForm.get('party').setValue($event.id);

      }
    }

    /* For fecthing all the party details */
    getPartyDetails() {
      let ClientPramas = '0'; // Client
      this._partyService.getPartyList('',ClientPramas).subscribe((response) => {
        this.partyList = response.result;
      });

    }

    /* After closing the party modal to clear all the values */
    closePartyPopup(){
      this.showAddPartyPopup = {name: '', status: false};
    }

    paymentTax(data){
      if(this.isTax){
        this.isFormValid = data['headerTaxDetails'].isFormValid
        this.addAdvanceForm.get('place_of_supply').setValue(data['headerTaxDetails'].place_of_supply)
      }
   }

}
