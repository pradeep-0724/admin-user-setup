import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subject, forkJoin } from 'rxjs';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { SettingSeviceService } from 'src/app/modules/customerapp-module/api-services/orgainzation-setting-module-services/setting-service/setting-sevice.service';
import { NewTripV2Constants } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/new-trip-v2-constants/new-trip-v2-constants';
import { ToolTipInfo } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/new-trip-v2-utils/new-trip-v2-utils';
import { setAsTouched } from 'src/app/shared-module/utilities/form-utils';
import { getBlankOption, getNonTaxableOption, isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { TaxModuleServiceService } from 'src/app/tax-module/tax-module-service.service';

@Component({
  selector: 'app-general-configuration',
  templateUrl: './general-configuration.component.html',
  styleUrls: ['./general-configuration.component.scss']
})
export class GeneralConfigurationComponent implements OnInit {
   
  updateAdvancesText: any="Update Advances";
  successAdvancesMsg: boolean = false;
  generalConfigurationForm : UntypedFormGroup;
  @Input() prefixKey = '';
  @Input() tncKey = '';
  @Input() screenName = '';
  invoiceAdvance={
    cash_view: false,
    batta_view: false,
    fuel_view: false
  }
  activate_advance = false;
	defaultTax: any = getNonTaxableOption();
  repeatHeader = getBlankOption();
  repeatFooter = getBlankOption();
  isTax = true
  taxOptions = [];
  trip_challan_tax ='';
  tripToolTipForDefaultTax: ToolTipInfo;
  tripToolTipForPDFHeader: ToolTipInfo;
  tripToolTipForPDFFooter: ToolTipInfo;
  @Input() tripToolTipForBrandingLine: ToolTipInfo;
  headerFooterOptions = [
    {
      label : 'Only On First Page',
      value : 'single'
    },
    {
      label : 'All Pages',
      value : 'all'
    }
  ];
  note = 'This is a computer-generated invoice. No signature is required for validation.';
  constantsTripV2 = new NewTripV2Constants()
  updateText:any= "Update";
  successMsg:boolean = false;
  isFormValid = new Subject<any>();

  constructor(private _fb : FormBuilder,private _scrollToTop : ScrollToTop,
    private _advances:SettingSeviceService,private _taxService : TaxModuleServiceService,private _tax: TaxService,
  ) { 
    this.isTax = this._tax.getTax();
  }
  ngAfterViewInit(): void {
    this._advances.getGeneralConfigurationData(this.tncKey).subscribe((data)=>{
      this.buildForm(data['result']['tc_setting'])
    })
  }
  ngOnInit() {
    this.tripToolTipForDefaultTax = {
      content: this.constantsTripV2.toolTipMessages.INVOICE_SETTINGS_DEFAULT_TAX.CONTENT
    }
    this.tripToolTipForPDFHeader = {
      content: this.constantsTripV2.toolTipMessages.INVOICE_SETTINGS_PDF_HEADER.CONTENT
    }
    this.tripToolTipForPDFFooter = {
      content: this.constantsTripV2.toolTipMessages.INVOICE_SETTINGS_PDF_FOOTER.CONTENT
    };
    this.buildForm({})
    this.getTaxDetails();
  }

  buildForm(item){    
    this.generalConfigurationForm = this._fb.group({
      id :[item.id || ''],
      key : [this.tncKey],
      default_tnc : [item?.default_tnc || null],
      default_tax : [item?.default_tax?.id || null],
      narration:[item.narration || ''],
      show_shipping_address:[item.show_shipping_address || false],
      header_preference : [item.header_preference || 'single'],
      footer_preference : [item.footer_preference || 'single'],
      include_branding : [item.include_branding || false],
      same_page_display: [item.same_page_display || false],
      disclaimer: this._fb.group({
        display: [item?.disclaimer?.display ? item?.disclaimer?.display : false ,[Validators.required]],
        term:  [item?.disclaimer?.term ||'This is a computer-generated invoice. No signature is required for validation.'],
      }),
      signatory: this._fb.group({
        for_company: this._fb.group({
          display:  [item?.signatory?.for_company?.display ? item?.signatory?.for_company?.display : false ],
          term:  [item?.signatory?.for_company?.term || '',[Validators.required]],
        }),
        authorised_signatory: this._fb.group({
          display:  [item?.signatory?.authorised_signatory?.display ? item?.signatory?.authorised_signatory?.display : false],
          term:  [item?.signatory?.authorised_signatory?.term || '',[Validators.required]],
        }),
        prepared_by: this._fb.group({
          display:  [item?.signatory?.prepared_by?.display ? item?.signatory?.prepared_by?.display : false],
          term:  [item?.signatory?.prepared_by?.term || '',[Validators.required]],
        }),
        received_by: this._fb.group({
          display:  [item?.signatory?.received_by?.display ? item?.signatory?.received_by?.display : false],
          term:  [item?.signatory?.received_by?.term || '',[Validators.required]],
        }),
        verifed_by: this._fb.group({
          display:  [item?.signatory?.verifed_by?.display ? item?.signatory?.verifed_by?.display : false],
          term:  [item?.signatory?.verifed_by?.term || '',[Validators.required]],
        }),
        approved_by: this._fb.group({
          display:  [item?.signatory?.approved_by?.display ? item?.signatory?.approved_by?.display : false],
          term:  [item?.signatory?.approved_by?.term || '',[Validators.required]],
        }),
      })
    })    
    this.defaultTax = !isValidValue(item?.default_tax) ? getNonTaxableOption() : { label: item?.default_tax?.label, value: item?.default_tax?.id };
    this.repeatFooter.label = this.headerFooterOptions.find((option)=> option.value === item?.footer_preference)?.label;
    this.repeatHeader.label = this.headerFooterOptions.find((option)=> option.value === item?.header_preference)?.label;
  }

  getTaxDetails() {
		this._taxService.getTaxDetails().subscribe(result => {
			this.taxOptions = result.result['tax'];
   	});
	}

  upadteConfiguration(){
    let form = this.generalConfigurationForm;
    let prefixPayload= {
      "key": this.prefixKey,
      "data": form.value['prefix_form']
    }
    let headingPayload = {
      "key": this.prefixKey,
      "data": form.value['pdf_heading']
    }
    if(form.valid){
      delete form.value['prefix_form']
      delete form.value['pdf_heading'];
      let prefixObs = this._advances.postPrefix(prefixPayload);
      let pdfHeadingObs = this._advances.postPdfHeading(headingPayload)
      let generalConfigObs = this._advances.postGeneralConfigurationData(form.value)
     
      forkJoin([prefixObs,pdfHeadingObs,generalConfigObs]).subscribe((response)=>{
        this._advances.getGeneralConfigurationData(this.tncKey).subscribe((data)=>{
          this.buildForm(data['result']['tc_setting'])
        })
        this.updateText = "Update";
        this.successMsg = true;
        setTimeout(() => {
          this.successMsg = false;
          this.updateText = " Update ";

        }, 5000);
        setTimeout(() => {
          this.successMsg = false;
          this.updateText = " Update ";
        }, 5000);

      })
    }else{
      setAsTouched(form)
      this.isFormValid.next(form.valid);
      this._scrollToTop.scrollToTop()
    }
  }

  displayTNCOnSamPage(tnc){
    this.generalConfigurationForm.patchValue({
        same_page_display: tnc.selectedValue,
        id : tnc.id,
        default_tnc : tnc?.default_tnc
    })    
  }
}
