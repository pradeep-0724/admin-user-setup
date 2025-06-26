import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, UntypedFormArray, UntypedFormGroup, UntypedFormControl, AbstractControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { OwnAssetPermitService } from '../own-assets-permit-service.service';
import { getCountryDetails } from 'src/app/shared-module/utilities/countrycode-utils';
import { CountryIdService } from 'src/app/core/services/countryid.service';
import { CompanyModuleServices } from 'src/app/modules/customerapp-module/api-services/company-service/company-module-service.service';

@Component({
  selector: 'app-asset-permit-add-edit',
  templateUrl: './asset-permit-add-edit.component.html',
  styleUrls: ['./asset-permit-add-edit.component.scss']
})
export class AssetPermitAddEditComponent implements OnInit {
  permitForm: FormGroup;
  isUnique: boolean;
  constructor(private _fb: FormBuilder, private _activateRoute: ActivatedRoute, private _commonloaderservice: CommonLoaderService,
    private permitService: OwnAssetPermitService, private router: Router,private _countryId: CountryIdService,private _companyModuleService: CompanyModuleServices) { }
  showRecentData: boolean = true;
  uniquePermitErr = '';
  permitId = '';
  permitEditData;
  addedPermitsList = [];
  countryId=''; 
  countriesList = [];
  statesList=[];


  ngOnInit(): void {
    this._commonloaderservice.getHide();
    this.countryId = this._countryId.getCountryId();
    this.getCountry();
    this.permitForm = this._fb.group({
      name: [null, Validators.required],
      expiry_date_mandatory: [false],
      country: [
        getCountryDetails(this.countryId).country,[Validators.required]
      ],
      state: [
        '',[Validators.required]
      ],
    });


    this._activateRoute.params.subscribe(prams => {
      if (prams['permitId']) {
        this.permitId = prams['permitId'];
        this.permitService.getPermit(prams['permitId']).subscribe((response) => {
          this.permitForm.patchValue(response['result'])
          this.permitEditData = response['result']
          this.isUnique = true;
          this.getStates();
        })
      }else{
        this._companyModuleService.getStates(getCountryDetails(this.countryId).id).subscribe(result => {
          this.statesList = result['results'];
        })
      }
    })
    this.permitForm.controls.name.valueChanges.pipe(debounceTime(600)).subscribe((value) => {
      this.uniquePermitErr = '';
      this.checkUniquePermit(value)
    })
    this.getAvailablePermitsList();
  }

  getAvailablePermitsList() {
    this.permitService.getPermitList().subscribe((response) => {
      this.addedPermitsList = response['result'].vp;
    })
  }

  getCountry() {
		this._companyModuleService.getCountry().subscribe(result => {
			this.countriesList = result['results'];
		})
	}

  getStates() {
		let countryName = this.permitForm.get('country').value;
		let val = this.countriesList.filter(country => country.name === countryName);
    if(val.length)
		this._companyModuleService.getStates(val[0].id).subscribe(result => {
			this.statesList = result['results'];
		})
	}

  countryChange(){
    this.getStates();
    this.permitForm.get('state').setValue('');
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

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  checkUniquePermit(name) {
    if (name.trim()) {
      let isPermitExits = this.addedPermitsList.some((ele) => ele.name.toLowerCase() === name.toLowerCase());
      if (isValidValue(this.permitId)) {
        if (this.permitEditData['name'].toLowerCase() !== name.toLowerCase() && isPermitExits) {
          this.uniquePermitErr = 'Permit already exists';
          this.isUnique = false
        } else {
          this.isUnique = true
          this.uniquePermitErr = '';
        }
      } else {
        if (isPermitExits) {
          this.uniquePermitErr = 'Permit already exists';
          this.isUnique = false
        } else {
          this.isUnique = true
          this.uniquePermitErr = '';
        }
      }

    }

  }

  submitForm() {
    if (this.permitForm.valid && this.isUnique) {
      this._commonloaderservice.getShow();
      if (!this.permitId) {
        this.permitService.addPermit(this.permitForm.value).subscribe((response) => {
          this.router.navigate([getPrefix() + '/organization_setting/settings/asset/permit/list']);
        })
      }else{
        this.permitService.updatePermit(this.permitId, this.permitForm.value).subscribe((resp) => {
          this.router.navigate([getPrefix() + '/organization_setting/settings/asset/permit/list'])
        })
      }
    }
    else {
      this.setAsTouched(this.permitForm)

    }
  }

  cancel() {
    this.router.navigate([getPrefix() + '/organization_setting/settings/asset/permit/list'])
  }


}