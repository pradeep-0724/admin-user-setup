import { Component, OnInit } from '@angular/core';
import { TrailPeriodService } from 'src/app/core/services/trail-period.service';
import { AuthService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/auth.service';


@Component({
  selector: 'app-trail-period-warning',
  templateUrl: './trail-period-warning.component.html',
  styleUrls: ['./trail-period-warning.component.scss']
})

export class TrailPeriodWarningComponent implements OnInit {
  show: boolean = false;
  switchTenent = 'switchTenent';
  isContactUsClicked = false;
  isAccessible = false
  trialPeriodEnded = false;

  constructor(private _trailPeriodService: TrailPeriodService, private _authService: AuthService) { }

  ngOnInit(): void {
    this._trailPeriodService.$openTrailPeriodWarning.subscribe(data => {
      this.isAccessible = data['is_accessible'];
      this.trialPeriodEnded = data['trial_period_ended'];
      this.show = !this.isAccessible || this.trialPeriodEnded;
    })

  }
  onOkButtonClick() {

   this._trailPeriodService.contactUs().subscribe(resp => {
    this.isContactUsClicked = true;
    });
  }
  cancel() {
    this.logMeOut();
  }

  logMeOut() {
    localStorage.removeItem(this.switchTenent);
    this._authService.setClientId('');
    this._authService.logout();
  }

}
