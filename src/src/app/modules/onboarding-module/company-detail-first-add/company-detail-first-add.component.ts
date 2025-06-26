import { CompanyServices } from '../../customerapp-module/api-services/company-service/company-services.service';
import { CompanyModuleServices } from '../../customerapp-module/api-services/company-service/company-module-service.service';
import { CommonService } from '../../../core/services/common.service';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl, AbstractControl, UntypedFormArray } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { BehaviorSubject, Subject } from 'rxjs';
import { Subscription } from 'rxjs';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { UserOnboardingService } from 'src/app/core/services/super-user-onboarding.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { cloneDeep } from 'lodash';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-company-detail-first-add',
  templateUrl: './company-detail-first-add.component.html',
  styleUrls: ['./company-detail-first-add.component.scss'],

})
export class CompanyDetailFirstAddComponent implements OnInit {
  details: UntypedFormGroup;
  staticOption: any = {};
  dropdownValues: any = {};
  imageDocumentAttachment: any = [];
  documents = [];
  profile_img_url = '';
  emailid = '';
  currency = [];
  country = [];
  timeZone = [];
  showIban = false;
  countryPhoneCode: any;
  initialValues = {
    typeOfBusiness: {},
    currency: {},
    country: {},
    primaryMobileNo: '',
    timeZone: {},
    fromfinancial: {},
    tofinancial: {},
    primary_mobile_number_code: {},


  };
  verificationMessage: string = ''
  isVerificationMessage: boolean = true;
  isVerificationApplicable: boolean = true;
  emailAddressSub: Subscription;
  emailVerificationStatus = '';
  month = [];
  companyId = ''
  patchFileUrls = new BehaviorSubject([]);
  taxDataCompany = {
    isFormValid: false,
    taxData: {}
  };
  isTaxFormValid = new BehaviorSubject(true);
  taxDetails = new BehaviorSubject({});
  editDocsData: Subject<any> = new Subject();
  showTaxForm:boolean=true
  preFixUrl = '';
  editValues:Subject<any>=new Subject();
  isEdit=false;
  isTax=false;
  isVat=false;

  constructor(
    private _fb: UntypedFormBuilder,
    private _router: Router,
    private _commonService: CommonService,
    private _companyService: CompanyServices,
    private _companyModuleService: CompanyModuleServices,
    private _preFixUrl: PrefixUrlService,
    private _uesrOnboarding: UserOnboardingService,
    private _tax: TaxService,
    private activatedRouter : ActivatedRoute,
    private scrollToTop : ScrollToTop,
    private apiHandler:ApiHandlerService

  ) { }

  ngOnInit() {
    this.preFixUrl = this._preFixUrl.getprefixUrl();
    this.isTax=this._tax.getTax();
    this.isVat=this._tax.getVat();
    this.buildForm();
    this.showIban = this._tax.getIban();
    this.getInitialDetails();
    this.activatedRouter.paramMap.subscribe((paramMap:ParamMap)=>{
      if(paramMap.has('edit_id')){
        this.isEdit=true;
        this.companyId=paramMap.get('edit_id');
        this.getCompanyDetais();
      }
      if(paramMap.has('add_id')){
        this.companyId=paramMap.get('add_id');
        this.getCompanyDetais();
      }
    })

    this._commonService.getTypeOfBusiness().subscribe((response) => {
      this.dropdownValues.typeOfBussiness = response.result;
    });

    this.subscribeMobileValuesChanges();
  }

  getCompanyDetais() {
    this._companyService.getCompanyDetail().subscribe((response: any) => {
      if (response['result']) {
        this.editValues.next(response['result'])
        this.profile_img_url = response.result.profile_image_url;
        this.patchForm(response.result);
        this.taxDetails.next(response.result['tax_details'])
        this.getEmailVerificationStatus();
        this.initializeEmailOberservable();
        this.editDocsData.next(response.result?.documents)
      }
    });
  }
  

  buildForm() {
    this.details = this._fb.group({
      company_name: ['', [Validators.required]],
      company_native_name:[''],
      country: [null, [Validators.required]],
      currency: [null, [Validators.required]],
      timezone: [null, [Validators.required]],
      company_display_name: ['', [Validators.required]],
      primary_mobile_number_code: ['', [Validators.required]],
      type_of_business: [null],
      profile_image: [[]],
      primary_mobile_number: ['', [Validators.required]],
      email_address: ['', [Validators.required, TransportValidator.emailValidator, Validators.maxLength(42)]],
      books_begin: [null, [Validators.required]],
      from_financial_month: ['', [Validators.required]],
      to_financial_month: ['', [Validators.required]],
      generaldocuments: [],
      iba_registration_no: [''],
      transporter_license_no: [''],
      activate_advance: [true],
      tax_details: {}, 
      documents : this._fb.array([]),
      address: this._fb.group({
        address:[]
      })
    });
  }

  addreesDetails(e){
    let address=[];
    let add=cloneDeep(e)
    if(!add.billing_address['address_line_1'] && !add.billing_address['pincode']&&! add.billing_address['state']&& !add.billing_address['street']){
      add.billing_address['country']=''
    }
    if(!add.shipping_address['address_line_1'] && !add.shipping_address['pincode']&&! add.shipping_address['state']&& !add.shipping_address['street']){
      add.shipping_address['country']=''
    }
    address.push(add.billing_address,add.shipping_address)
    this.details.get('address').get('address').setValue(address);
  }


  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  imageUpload(filesUploaded, documentIndex = 0) {
    if (this.imageDocumentAttachment[documentIndex] === undefined) {
      this.imageDocumentAttachment[0] = [];
    }
    this.imageDocumentAttachment[documentIndex].push(filesUploaded[0].id)
  }

  setAsTouched(group: UntypedFormGroup | UntypedFormArray) {
    group.markAsTouched()
    for (let i in group.controls) {
      if (group.controls[i] instanceof UntypedFormControl) {
        group.controls[i].markAsTouched();
      } else {
        this.setAsTouched(group.controls[i]);
      }
    }
  }

 

  submitForm() {
    let form = this.details;
    let taxFormValid = true;
    if (this.isTax) {
      taxFormValid = this.taxDataCompany.isFormValid
    } else {
      this.taxDataCompany.taxData = {};
    }
    if (form.valid && taxFormValid) {
     let extractedIds=[]
      form.value.documents.forEach(element => {
        element.files.forEach(file => {
          extractedIds.push(file.id);
        });
        element.files = extractedIds;
        extractedIds=[];
      });
      
      form.patchValue({
        books_begin: changeDateToServerFormat(form.get('books_begin').value),
        profile_image: this.imageDocumentAttachment[0],
        generaldocuments: this.documents,
        tax_details: this.taxDataCompany['taxData']

      })
      this.apiHandler.handleRequest(this._companyService.editCompanyDetail(this.companyId, form.value),'Company Details updated Successfully!').subscribe({
            next:(resp)=>{
              if (resp) {
                this._uesrOnboarding._companyDetailsChanged.next(true);
                this._router.navigate([this.preFixUrl + '/organization_setting/profile']);
              }
            },
            error:(err)=>{
              console.log(err)
            }
          })
    } else {
      this.isTaxFormValid.next(this.taxDataCompany.isFormValid)
      this.setAsTouched(form);
      this.scrollToTop.scrollToTop()
    }

  }

  nameAutoPopulate($event) {
    this.details.controls['company_display_name'].setValue(this.details.controls['company_name'].value);
  }

  subscribeMobileValuesChanges() {
    this.details.get('primary_mobile_number').valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe(mobileNo => {

      if (this.details.get('primary_mobile_number').valid) {
        this._companyService.checkMobileUniqueness({ "mobile_no": mobileNo }).subscribe((res: any) => {
          const errorValidator = this.details.get('primary_mobile_number').hasError("mobileAlreadyRegistered");
          if (errorValidator)
            delete this.details.get('primary_mobile_number').errors["mobileAlreadyRegistered"];

        }, (err: any) => {
          this.details.get('primary_mobile_number').markAsTouched();

          if (err.error.message == 'error-1000') {
            this.details.get('primary_mobile_number').setErrors({ "mobileAlreadyRegistered": true });
          }

          if (err.error.message == 'error-1001') {
            this.details.get('primary_mobile_number').setErrors({ "required": true });
          }

          if (err.error.message == 'error-1002') {
            this.details.get('primary_mobile_number').setErrors({ "phoneNotMatch": true });
          }
        });

        this.details.get('primary_mobile_number').updateValueAndValidity({ onlySelf: true })
      }
    });
  }

  getInitialDetails() {
    this._companyModuleService.getCountry().subscribe(result => {
      this.country = result['results'];
    })
    this._companyModuleService.getCurrency().subscribe(result => {
      this.currency = result['results'];
    })
    this._companyModuleService.getTimezone().subscribe(result => {
      this.timeZone = result['results'];
    })
    this._companyModuleService.getPhoneCode().subscribe(result => {
      let codes = [];
      codes = result['results'];
      this.countryPhoneCode = codes.map(code => code.phone_code);
    })
    this.month = this.getMonth();

  }
  patchForm(data) {
    let form = this.details;
    form.patchValue(data)
      if (isValidValue(data)) {
        if (isValidValue(data.type_of_business)) {
          this.initialValues.typeOfBusiness['label'] = data.type_of_business.label;
          this.initialValues.typeOfBusiness['value'] = data.type_of_business.id;
          form.patchValue({
            type_of_business: data.type_of_business.id,
          })
        }

        if (isValidValue(data.country)) {
          this.initialValues.country['label'] = data.country.name;
          this.initialValues.country['value'] = data.country.id;
          form.patchValue({
            country: data.country.id
          })
        }

        if (isValidValue(data.primary_mobile_number_code)) {
          this.initialValues.primary_mobile_number_code['label'] = data.primary_mobile_number_code
          this.initialValues.primary_mobile_number_code['value'] = data.primary_mobile_number_code
          form.patchValue({
            primary_mobile_number_code: data.primary_mobile_number_code
          })
        }


        if (isValidValue(data.timezone)) {
          this.initialValues.timeZone['label'] = data.timezone.name;
          this.initialValues.timeZone['value'] = data.timezone.id;
          form.patchValue({
            timezone: data.timezone.id,
          })
        }

        if (isValidValue(data.currency)) {
          this.initialValues.currency['label'] = data.currency.name;
          this.initialValues.currency['value'] = data.currency.id;
          form.patchValue({
            currency: data.currency.id,
          })
        }

        this.initialValues.currency['label'] = data.currency.currency;
        this.initialValues.currency['value'] = data.currency.id;
        let tofinancial = []
        tofinancial = this.getMonthObj(data.to_financial_month)
        this.initialValues.tofinancial['label'] = tofinancial[0]['name'];
        this.initialValues.tofinancial['value'] = tofinancial[0]['id'];
        let fromfinancial = []
        fromfinancial = this.getMonthObj(data.from_financial_month)
        this.initialValues.fromfinancial['label'] = fromfinancial[0]['name']
        this.initialValues.fromfinancial['value'] = fromfinancial[0]['id']
        this.initialValues.primaryMobileNo = data.primary_mobile_number_code;
        form.patchValue({
          to_financial_month: data.to_financial_month,
          from_financial_month: data.from_financial_month
        })

        if (data.generaldocuments && data.generaldocuments && data.generaldocuments.length > 0) {
          let patchUrl = []
          data.generaldocuments.forEach(element => {
            patchUrl.push(element);
          });
          this.patchFileUrls.next(patchUrl);
        }
      }

  }

  getMonth() {
    let month = [{
      id: '1',
      name: 'Jan'
    },
    {
      id: '2',
      name: 'Feb'
    },
    {
      id: '3',
      name: 'Mar'
    },
    {
      id: '4',
      name: 'Apr'
    },
    {
      id: '5',
      name: 'May'
    }, {
      id: '6',
      name: 'Jun'
    }, {
      id: '7',
      name: 'July'
    },
    {
      id: '8',
      name: 'Aug'
    },
    {
      id: '9',
      name: 'Sept'
    }, {
      id: '10',
      name: 'Oct'
    }, {
      id: '11',
      name: 'Nov'
    }, {
      id: '12',
      name: 'Dec'
    }];
    return month;
  }

  getMonthObj(id) {
    return this.month.filter(item => item.id == id)
  }

  fileUploader(filesUploaded) {
    filesUploaded.forEach((element) => {
      this.documents.push(element.id);
    });
  }

  fileDeleted(deletedFileIndex) {
    this.documents.splice(deletedFileIndex, 1);
  }

  initializeEmailOberservable() {
    let emailAddress = this.details.get('email_address') as UntypedFormControl;
    this.emailAddressSub = emailAddress.valueChanges.pipe(debounceTime(500)).subscribe((value) => {
      let emailAddressFc = this.details.get('email_address') as UntypedFormControl;
      this.isVerificationMessage = false;
      this.verificationMessage = "";

      if (emailAddressFc.valid) {
        if (this.emailid.toLowerCase() == value.toLowerCase()) {
          this.getEmailVerificationStatus();
          return
        }

        this._companyModuleService.isUniqueEmailObservable(value).subscribe(() => {
          this.isVerificationApplicable = true;
        }, (error) => {
          this.isVerificationMessage = true;
          this.verificationMessage = error.error.message;
          this.isVerificationApplicable = false;
          this.emailVerificationStatus = "";
        });
      } else {
        this.isVerificationApplicable = false;
        this.emailVerificationStatus = "";
      }
    });
  }

  verifyEmail() {
    if (this.isVerificationApplicable) {
      this.isVerificationApplicable = false;
      let email_address = { email_address: this.details.controls['email_address'].value }
      this._companyModuleService.verifyEmail(email_address).subscribe((response: any) => {
        this.emailVerificationStatus = response.result.verification_status;
        this.isVerificationMessage = true;
        this.verificationMessage = "Verifictaion email has been sent. Kindly check your email."
      }, (error) => {
        this.isVerificationMessage = true;
        this.verificationMessage = error.error.message;
        this.emailVerificationStatus = "Failed";
      });
    }
  }

  getEmailVerificationStatus() {
    this._companyModuleService.getEmailVeriFicationStatus().subscribe((response: any) => {
      this.emailVerificationStatus = response.result.verification_status;
      if (this.emailVerificationStatus === "Not Verified") {
        this.isVerificationApplicable = true;
      } else
        if (this.emailVerificationStatus === "Failed") {
          this.isVerificationApplicable = false;
          this.isVerificationMessage = true;
          this.verificationMessage = "Verification email could not be sent due to wrong email id."
        } else {
          this.isVerificationApplicable = false;
          this.isVerificationMessage = false;
        }

    });
  }

  taxData(data) {
    this.taxDataCompany = data;
  }
 


}


