import { CompanyModuleServices } from '../../customerapp-module/api-services/company-service/company-module-service.service';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl, AbstractControl, UntypedFormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';

@Component({
  selector: 'app-add-user-profile',
  templateUrl: './add-user-profile.component.html',
  styleUrls: ['./add-user-profile.component.scss'],
})
export class AddUserProfileComponent implements OnInit {
  userDetails: UntypedFormGroup;
  imagePreview: any;
  imageDocumentAttachment: any = [];
  emailValidate =  new ValidationConstants().VALIDATION_PATTERN.EMAIL;

  id='';
  ii;i;
  countryPhoneCode=[];
  profile_img_url='';
  addId='null';
  editId='null';
  backUrl=[];
  backButtonEnable: boolean = true;
  apiError: string = "";
  preFixUrl = ''

  constructor(
    private _fb: UntypedFormBuilder,
    private _router: Router,
    private _route:ActivatedRoute,
    private _companyModuleService :CompanyModuleServices,
    private _preFixUrl : PrefixUrlService

  ) { }

  ngOnInit() {
    this.preFixUrl = this._preFixUrl.getprefixUrl();
    this.buildForm();
    this.getPhoneCode();
    this._route.params.subscribe((params) => {
      this.addId = params.id;
      this.getUser(this.addId)
    });
    this.subscribeMobileValuesChanges();
    this.subscribeUsernameValuesChanges();
  }

  buildForm() {
    this.userDetails = this._fb.group({
      first_name:['', [Validators.required]],
      last_name:['', [Validators.required]],
      username: ['', [Validators.required]],
      profile_image: [[]],
      alternate_mobile_number_code:[''],
      primary_mobile_number_code:[Validators.required],
      primary_mobile_number: ['', [Validators.required]],
      alternate_mobile_number: ['', []],
    });
  }


  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  onImageUploaded (files: any) { }

  imageUpload (filesUploaded, documentIndex = 0) {
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

  patchFormValues (form: UntypedFormGroup) {
    form.patchValue({
      profile_image: this.imageDocumentAttachment[0],
    });
  }

  submitForm() {
    let form = this.userDetails;
    this.patchFormValues(form);
    if (form.valid) {
      this._companyModuleService.postUser(form.value,this.addId).subscribe((response: any) => {
        if (response) {
          this._router.navigateByUrl(this.preFixUrl+'/onboading/change-password/'+this.addId)
        }
    }, (err: any) => {

      if (typeof err.error.message == 'string') {
        this.apiError = err.message
      }

      if (err.error.message.username) {
        this.userDetails.get('username').setErrors({"usernameAlreadyRegistered": true});
      }

      if (err.error.message.primary_mobile_number) {
        this.userDetails.get('primary_mobile_number').setErrors({"mobileAlreadyRegistered": true});
      }
    });
    } else {
      this.setAsTouched(form);
      console.log(form.errors);
    }

  }

  subscribeMobileValuesChanges(){
    this.userDetails.get('primary_mobile_number').valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe(mobileNo => {

          const phoneCode = this.userDetails.get('primary_mobile_number_code');
          if (this.userDetails.get('primary_mobile_number').valid && phoneCode.value) {
              this._companyModuleService.checkPrimaryMobileNumber(this.addId, phoneCode.value, mobileNo).subscribe((res: any) => {
                const errorValidator = this.userDetails.get('primary_mobile_number').hasError("mobileAlreadyRegistered");
                if (errorValidator)
                    delete this.userDetails.get('primary_mobile_number').errors["mobileAlreadyRegistered"];

              }, (err: any) => {
                this.userDetails.get('primary_mobile_number').markAsTouched();
                this.userDetails.get('primary_mobile_number').setErrors({"mobileAlreadyRegistered": true});
              });

              this.userDetails.get('primary_mobile_number').updateValueAndValidity({onlySelf: true})
          }
    });
  }

  subscribeUsernameValuesChanges(){
    this.userDetails.get('username').valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe(username => {

          if (this.userDetails.get('username').valid) {
              this._companyModuleService.checkUserName(this.addId, username).subscribe((res: any) => {
                const errorValidator = this.userDetails.get('username').hasError("usernameAlreadyRegistered");
                if (errorValidator)
                    delete this.userDetails.get('username').errors["usernameAlreadyRegistered"];

              }, (err: any) => {
                    this.userDetails.get('username').markAsTouched();
                    this.userDetails.get('username').setErrors({"usernameAlreadyRegistered": true});
              });
              this.userDetails.get('username').updateValueAndValidity({onlySelf: true})
          }
    });
  }


  getPhoneCode(){
    this._companyModuleService.getPhoneCode().subscribe(result=>{
      let codes =[];
      codes = result['results'];
      this.countryPhoneCode= codes.map(code=> code.phone_code)
    })
  }

  getUser(id){
    this._companyModuleService.getUser(id).subscribe(result=>{
      this.profile_img_url=result['result'].profile_image_url;
      let form = this.userDetails;
      form.patchValue(result['result'])
    })
  }
}
