import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PartySettingService } from '../party-setting.service';
import { debounceTime } from 'rxjs/operators';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';

@Component({
  selector: 'app-prefrence',
  templateUrl: './prefrence.component.html',
  styleUrls: ['./prefrence.component.scss']
})
export class PrefrenceComponent implements OnInit,OnDestroy {

  partySetting: FormGroup;
  initialValues = {
    gracePeriod: {}
  }
  constructor(private _fb: FormBuilder, private _partySettingService: PartySettingService,private _loader:CommonLoaderService) { }

  ngOnInit(): void {
    this._loader.getHide();
    this.partySetting = this._fb.group({
      default_kyc: false,
      default_credit_limit: 0,
      default_grace_limit: 0
    })

    this._partySettingService.getPartySettings().subscribe(res => {
      this.partySetting.patchValue(res['result'])
    })

    this.partySetting.valueChanges.pipe(debounceTime(200)).subscribe(val => {
       val['default_grace_limit']= val['default_grace_limit']?val['default_grace_limit']:0
       val['default_credit_limit']= val['default_credit_limit']?val['default_credit_limit']:0
      this._partySettingService.updatePartySettings(val).subscribe(resp => {

      })
    })
  }


  ngOnDestroy(): void {
    this._loader.getShow();
  }

}
