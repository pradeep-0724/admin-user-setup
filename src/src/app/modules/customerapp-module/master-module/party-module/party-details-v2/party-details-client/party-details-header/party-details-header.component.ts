import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PartyService } from '../../../../../api-services/master-module-services/party-service/party.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { getPrefix } from 'src/app/core/services/prefixurl.service';

@Component({
  selector: 'app-party-details-header',
  templateUrl: './party-details-header.component.html',
  styleUrls: ['./party-details-header.component.scss']
})
export class PartyDetailsHeaderComponent implements OnInit {
  @Input() partInfoDetails;
  @Input() partyId = ''
  @Output() updatedParty = new EventEmitter();
  emailId = ''
  isEmailValid = true;
  isEmailIsThere = true;
  partyPortalStatus = '1';
  isFormList = false;


  constructor(private _partyService: PartyService, private _route: ActivatedRoute, private _router: Router) { }

  ngOnInit(): void {

    this._route.queryParamMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('fromlist')) {
        this.isFormList = true;
      }
    });
  }

  historyBack() {
    
    if (this.isFormList) {
      history.back();
    } else {
      this._router.navigate([getPrefix() + '/onboarding/party/view'])
    }
  }

  inviteToPortal() {
    this._partyService.inviteToClientPortal(this.partyId).subscribe((data) => {
      this.updatedParty.emit(true);
    });
  }

  reinviteToPortal() {
    this._partyService.reInviteToClientPortal(this.partyId).subscribe((data) => {
      this.updatedParty.emit(true);
    });
  }

  enableDisableToPortal(isEnabled) {
    this._partyService.enableToClientPortal(this.partyId, isEnabled).subscribe((data) => {
      this.updatedParty.emit(true);
    });
  }


  inviteClient() {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.emailId)) {
      this._partyService.addEmailToClientPortal(this.partyId, this.emailId).subscribe((data) => {
        this.isEmailValid = true;
        this.isEmailIsThere = true;
        this.updatedParty.emit(true);
      });

    } else {
      this.isEmailValid = false
    }
  }







}
