import { TabIndexService } from '../../../../api-services/auth-and-general-services/tab-index.service';
import { JournalService } from '../../../../reports-module/accountant-module/journal-entry-module/services/journal.service';
import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, AbstractControl, UntypedFormArray, UntypedFormControl } from '@angular/forms';
import { PartyService } from '../../../../api-services/master-module-services/party-service/party.service';
import { PaymentsService } from '../../../../api-services/revenue-module-service/payment-services/payments-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { getObjectFromList, isValidValue, roundOffAmount,getBlankOption } from 'src/app/shared-module/utilities/helper-utils';

import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { bankChargeRequired } from 'src/app/shared-module/utilities/payment-utils';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { BehaviorSubject } from 'rxjs';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { TerminologiesService } from 'src/app/core/services/terminologies.service';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { RevenueService } from '../../../../api-services/revenue-module-service/revenue-service/revenue.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';


@Component({
    selector: 'app-edit-refund-payment',
    templateUrl: './refund.component.html',
    styleUrls: ['./refund.component.scss'],
})
export class RefundPaymentComponent implements OnInit, AfterViewChecked {

    addRefundVoucher: UntypedFormGroup;
    accountsList: any;
    partyList: any = [];
    staticOptions: any = {};
    PlaceOfSupplyStateList: any;
    refund_id: string;
    apiError: string;
    bankingChargesApply: Boolean = false;
    creditNoteObj: any;
    creditNoteList: any;
    paymentMode = getBlankOption();
    initialValues: any = {
        party: {},
        creditnote: {},
        paymentMode : getBlankOption()

    }
    documentPatchData: any=[];
    patchFileUrls=new BehaviorSubject([]);
    showAddPartyPopup: any = {name: '', status: false};
    partyNamePopup: string = '';

    prefixUrl = '';
    gstin:'';
    currency_type;
    data: any;
    analyticsType= OperationConstants;
    analyticsScreen=ScreenConstants;
    screenType=ScreenType;
    terminology:any;
    goThroughDetais = {
      show: false,
      url: "https://demo.arcade.software/yE4ZPSBytUTHZz1s2qUx?embed%22"
    }
    constructor(
        private _fb: UntypedFormBuilder,
        private _partyService: PartyService,
        private _paymentsService: PaymentsService,
        private _activateRoute: ActivatedRoute,
        private _journalService: JournalService,
        private _route: Router,
        private currency:CurrencyService,
        private _terminologiesService:TerminologiesService,
        private _analytics:AnalyticsService,
        private _prefixUrl : PrefixUrlService,
        private _tabIndex: TabIndexService,
        private _scrollToTop:ScrollToTop,
        private _revenueService: RevenueService,private apiHandler: ApiHandlerService

    ) {
      this.terminology = this._terminologiesService.terminologie;
    }

    ngAfterViewChecked() {
      this._tabIndex.negativeTabIndex()
    }

    ngOnInit() {
      this.prefixUrl = this._prefixUrl.getprefixUrl();
         setTimeout(() => {
      this.currency_type = this.currency.getCurrency();
    }, 1000);
        this._activateRoute.params.subscribe((params: any) => {
            this.refund_id = params.refund_id;
            this.buildForm();
            let ClientPramas = '0'; // Client
            this._partyService.getPartyList('',ClientPramas).subscribe((response) => {
                this.partyList = response.result;
            });
            this._journalService.getAccountList().subscribe((response: any) => {
                this.accountsList = response.result;
            });
        });
        this.addRefundVoucher.controls['date'].setValue(new Date(dateWithTimeZone()));
        let params = 'refundvoucher'
        this._paymentsService.getRefundSuggestedIds(params).subscribe((response: any) => {
          this.addRefundVoucher.controls['refund_number'].setValue(response.result['refundvoucher']);
          });
        
    }

    openGothrough(){
      this.goThroughDetais.show=true;
  }

    patchFormValues(data: any) {
        this.partyNamePatch(data);
        this.creditNotePatch(data);

        data.party = isValidValue(data.party) ? data.party.id : null;
        data.refund_against = isValidValue(data.refund_against) ? data.refund_against.id : null;
        this.initialValues.paymentMode['value'] = isValidValue(data.payment_mode) ? data.payment_mode.id : null;
        this.initialValues.paymentMode['label'] = isValidValue(data.payment_mode) ? data.payment_mode.name : '';
        data.payment_mode = isValidValue(data.payment_mode) ? data.payment_mode.id : null;
        this.addRefundVoucher.patchValue(data);
        this.patchDocuments(data)
        this._partyService.getPartyAdressDetails(data.party).subscribe(
          res => {
          this.gstin =res.result.tax_details.gstin;

        });
        this.onPaymentModeSelected()
    }

	patchDocuments(data){
		if(data.documents.length>0){
		let documentsArray = this.addRefundVoucher.get('documents') as UntypedFormControl;
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
        let documents = this.addRefundVoucher.get('documents').value;
        filesUploaded.forEach((element) => {
            documents.push(element.id);
        });
       }

      fileDeleted(deletedFileIndex) {
        let documents = this.addRefundVoucher.get('documents').value;
        documents.splice(deletedFileIndex, 1);
      }

    partyNamePatch(editAdvanceForm) {
        if (editAdvanceForm.party) {
          this.initialValues.party['value'] = editAdvanceForm.party.id;
          this.initialValues.party['label'] = editAdvanceForm.party.display_name;
        } else {
          this.initialValues.party = getBlankOption();
        }


      }


    creditNotePatch(editAdvanceForm) {
        if (editAdvanceForm.party) {
          this.initialValues.creditnote['value'] = editAdvanceForm.refund_against.id;
          this.initialValues.creditnote['label'] = editAdvanceForm.refund_against.credit_note_number;
        } else {
          this.initialValues.creditnote = getBlankOption();
        }
      }


    getFormValues() {
        this._paymentsService.getRefundDetail(this.refund_id).subscribe((data: any) => {
            if (data !== undefined) {
                let partyId = data.result.party? data.result.party.id:null;
                if(partyId){
                    this._partyService.getPartyCreditNotes(partyId, '1,2').subscribe((response) => {
                        this.creditNoteList = response.result;
                      });
                }
                this.patchFormValues(data.result);
            }
        });
    }

    ngAfterViewInit() {
        if(this.refund_id){
          this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.REFUNDCLIENT,this.screenType.EDIT,"Navigated");
        setTimeout(() => {
            this.getFormValues();
        }, 1);
    }else{
      this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.REFUNDCLIENT,this.screenType.ADD,"Navigated");
    }
    }

    buildForm() {
        this.addRefundVoucher = this._fb.group({
            date: ['',  Validators.required],
            refund_number: ['', Validators.required],
            refund_against: ['',Validators.required],
            party: ['',Validators.required],
            place_of_supply: [''],
            description_of_supply: [''],
            credit_balance: [0],
            refund_amount: [0,  Validators.required],
            payment_mode: ['',Validators.required],
            bank_charge: [0],
            remarks: [''],
            documents: [[]],
        });
    }

    onPartySelected(partyId) {
      if (partyId) {
      this._partyService.getPartyAdressDetails(partyId).subscribe(
        res => {
          this.gstin =res.result.tax_details.gstin;
        });
    }
        if (partyId !== '') {
            const selectedParty = getObjectFromList(partyId, this.partyList);

            this.addRefundVoucher.controls['refund_against'].setValue(null);
            this.addRefundVoucher.controls['credit_balance'].setValue(0)
            if(selectedParty){
            this._partyService.getPartyCreditNotes(selectedParty.id, '1').subscribe((response) => {
              this.creditNoteList = response.result;
            });}
        }
        this.getDefaultBank(partyId)
    }
    getDefaultBank(id){
      let params={
        is_account :'True',
        is_tenant :'False'
      }
      this._revenueService.getDefaultBank(id,params).subscribe((data)=>{
        this.initialValues.bank=getBlankOption();
        if(data['result']){
          this.addRefundVoucher.get('payment_mode').setValue(data['result'].id);
          this.initialValues.paymentMode['label']=data['result'].name
          this.initialValues.paymentMode['value']=data['result'].id
          this.populatePaymentMethod();
        }
      })
    }

    populatePaymentMethod(){
        let vendorId =this.addRefundVoucher.get('party').value;
        if(vendorId){
          this.data = this.partyList.filter((ele) => ele.id === vendorId)[0];
          }
        this.onPaymentModeSelected();
      }

    onPaymentModeSelected() {
		let bank = this.addRefundVoucher.controls['payment_mode'].value
    this.bankingChargesApply = bankChargeRequired(bank, this.addRefundVoucher.get('bank_charge'), this.accountsList);    
  }

    oncreditNoteSelected(creditId){
        if (creditId) {
          this.creditNoteObj = getObjectFromList(creditId, this.creditNoteList);
          this.addRefundVoucher.controls['credit_balance'].setValue(this.creditNoteObj? this.creditNoteObj.balance:'')
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
    submitAddRefundForm() {
        this.setCustomValidators()
        const form = this.addRefundVoucher;
        if (form.valid) {
            form.controls['date'].setValue(changeDateToServerFormat(form.controls['date'].value));
            form.controls['bank_charge'].setValue(form.controls['bank_charge'].value ? form.controls['bank_charge'].value:0);
          if (this.refund_id) {
            this.apiHandler.handleRequest(this._paymentsService.editRefund(form.value, this.refund_id), 'Refund Voucher updated successfully!').subscribe(
              {
                next: () => {
                  this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.REFUNDCLIENT)
                  this._route.navigateByUrl(this.prefixUrl + '/income/payments/list/refund');
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
            this.apiHandler.handleRequest(this._paymentsService.addRefundVoucher(form.value), 'Refund Voucher added successfully!').subscribe(
              {
                next: () => {
                  this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.REFUNDCLIENT)
                  this._route.navigateByUrl(this.prefixUrl + '/income/payments/list/refund');
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
        } else {
            this.setAsTouched(form);
            this._scrollToTop.scrollToTop();
        }
    }

    // round off amount
    roundOffAmount(formControl) {
        roundOffAmount(formControl);
        }

    setCustomValidators() {
        const refundAmount = this.addRefundVoucher.get('refund_amount');
        const creditBalance = this.addRefundVoucher.get('credit_balance').value;
        refundAmount.setValidators([TransportValidator.minValueValidator(0.01), TransportValidator.lessThanEqualValidator(creditBalance)]);
        refundAmount.updateValueAndValidity();
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
            this.addRefundVoucher.get('party').setValue($event.id);

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

}
