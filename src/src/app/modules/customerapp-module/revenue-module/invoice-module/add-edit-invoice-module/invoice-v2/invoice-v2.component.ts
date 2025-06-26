import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { cloneDeep } from 'lodash';
import { categoryOptions } from 'src/app/core/constants/constant';
import { CommonService } from 'src/app/core/services/common.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { TerminologiesService } from 'src/app/core/services/terminologies.service';
import { PartyService } from 'src/app/modules/customerapp-module/api-services/master-module-services/party-service/party.service';
import { InvoiceService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/invoice-service/invoice.service';
import { getBlankOption } from 'src/app/shared-module/utilities/helper-utils';

@Component({
  selector: 'app-invoice-v2',
  templateUrl: './invoice-v2.component.html',
  styleUrls: ['./invoice-v2.component.scss']
})
export class InvoiceV2Component implements OnInit {
  selectedCategory=''
  customer=new FormControl('')
  invoiceId=''
  disableCustomer=false
  partyNamePopup={}
  showAddPartyPopup: any = { name: '', status: false };
  initialValues={party:getBlankOption()}
  partyList=[]
  gstin=''
  terminology: any;
  vehicleCategiries=[]
  categoryOptions=categoryOptions
  invoiceDetails: any;
  tripId=''
  customerDetails: any;
  pulloutAndDepositTripId=[]
  creditLimit = {
		open: false,
		msg: ''
	}
  currency_type: any;

  
  constructor(private _terminologiesService: TerminologiesService,private _activatedRoute: ActivatedRoute,private _invoiceService: InvoiceService,
              private _partyService: PartyService,private _commonservice:CommonService , private currency: CurrencyService,
              
  
  ) { }

  ngOnInit(): void {
    this.currency_type = this.currency.getCurrency();
    this.terminology = this._terminologiesService.terminologie;
    this.getPartyDetails();
    this._activatedRoute.params.subscribe((pramas) => {
			if (pramas['invoice_id']) {
        this.invoiceId = pramas['invoice_id'];
        this._commonservice.getVehicleCatagoryType().subscribe(resp => {
          this.vehicleCategiries = resp['result']['categories']})
        this._invoiceService.getInvoiceDetail(this.invoiceId).subscribe((data: any) => {
          this.invoiceDetails =cloneDeep(data.result);
          this.initialValues.party = { value: data.result.party.id, label: data.result.party.display_name };
          this.customer.setValue(data.result.party.id);
          this.disableCustomer=true
          this.gstin = data.result.gstin;
          this.selectedCategory = Object.keys(categoryOptions).find(key => categoryOptions[key] === data.result.category);
        }) 
      }
    })
  }

  ngAfterViewInit(): void {
      this._activatedRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
        if (paramMap.has('customerId') && paramMap.has('tripId')) {
          if (paramMap.has('pulloutDepositTripId')) this.pulloutAndDepositTripId = paramMap.get('pulloutDepositTripId').split(',');
          this.tripId = paramMap.get('tripId');
          let customer = paramMap.get('customerId');
          this.customer.setValue(customer);
          this.disableCustomer=true
          this.selectedCategory = Object.keys(categoryOptions).find(key => categoryOptions[key] ===Number(paramMap.get('categoary')));
          this._commonservice.getVehicleCatagoryType().subscribe(resp => {
            this.vehicleCategiries = resp['result']['categories']})
          this.initialValues.party = { label: paramMap.get('customerName'),value:'' };
        }
      });
    }
  selectedTemplate(category: string) {
    this.selectedCategory = category;
  }
 
  onPartySelected(e){
    this.selectedCategory=''
    this._partyService.getPartyAdressDetails(e).subscribe((response) => {
			this.customerDetails = response['result']
      this.gstin = response.result.tax_details.gstin;   
			if (this.customerDetails.check_credit) {
				if (this.customerDetails.credit_remaining > 0) {
          this.checkVehicleCategory();  
				} else {
					this.creditLimit.msg = 'The customer has reached the credit limit, Remaining Credit Amount: ' + this.currency_type?.symbol + " " + this.customerDetails.credit_remaining + ', Do you still want to continue ?';
					this.creditLimit.open = true;
				}
			} else {
        this.checkVehicleCategory();  
			}
		});
  }
  openAddPartyModal($event) {
		if ($event)
			this.showAddPartyPopup = { name: this.partyNamePopup, status: true };
	}

	addValueToPartyPopup(event) {
		if (event) {
			this.partyNamePopup = event;
		}
	}

  closePartyPopup() {
		this.showAddPartyPopup = { name: '', status: false };
	}

  addPartyToOption($event) {
		if ($event.status) {
      this.selectedCategory=''
			this.getPartyDetails();
			this.initialValues.party = { value: $event.id, label: $event.label };
			this.customer.setValue($event.id);
		}
	}

  getPartyDetails() {
		let ClientPramas = '0';
		this._partyService.getPartyList('', ClientPramas).subscribe((response) => {
			this.partyList = response.result;
		});
	}

  checkVehicleCategory() {
    this._commonservice.getVehicleCatagoryType().subscribe(resp => {
      this.vehicleCategiries = resp['result']['categories']
      if (this.vehicleCategiries.includes(1)) {
        this.selectedCategory='crane'
        return
      }
      if (this.vehicleCategiries.includes(2)) {
        this.selectedCategory='awp'
        return
      }
      if (this.vehicleCategiries.includes(3) || this.vehicleCategiries.includes(0)) {
        this.selectedCategory='cargo'
        return
      }

    })
  }

  onCreditLimit(e) {
		if (e) {
      this.checkVehicleCategory();  
		} else {
			this.customer.setValue(null);
			this.initialValues.party = getBlankOption();
      this.gstin = '';
      this.selectedCategory = '';
		}
	}

}
