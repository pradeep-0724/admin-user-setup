import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';

@Component({
  selector: 'app-party-notes-attachments',
  templateUrl: './party-notes-attachments.component.html',
  styleUrls: ['./party-notes-attachments.component.scss']
})
export class PartyNotesAttachmentsComponent implements OnInit {
  @Input() others:FormGroup;
  @Input() isOtherDetailsValid = new BehaviorSubject(false);
  @Input() editData : Observable<any>
  isEdit=false;
  apiUrl = 'party/formfield/party/';
  routeToSettings = '/organization_setting/settings/party/custom-field';
  customFieldData = new Subject();
  constructor(private _activeRoute : ActivatedRoute) { }
  ngOnInit(): void {
    this._activeRoute.params.subscribe((params : ParamMap)=>{
      if(params.hasOwnProperty('party_id')){
        this.isEdit=true;
        this.editData.subscribe((res)=>{
          this.customFieldData.next(res['others']['custom_others'])
        })

      }
    })
  }

  addErrorClass(controlName: AbstractControl) {
		return TransportValidator.addErrorClass(controlName);
	}
}
