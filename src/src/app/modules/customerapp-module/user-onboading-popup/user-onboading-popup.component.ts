import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { UserOnboardingService } from 'src/app/core/services/super-user-onboarding.service';
import { CompanyServices } from '../api-services/company-service/company-services.service';

@Component({
  selector: 'app-user-onboading-popup',
  templateUrl: './user-onboading-popup.component.html',
  styleUrls: ['./user-onboading-popup.component.scss']
})
export class UserOnboadingPopupComponent implements OnInit {
  show = false;
  openOnboardingDetails: boolean = false;
  userName = '';
  userID: '';
  getPrefixUrl = getPrefix()
  constructor(private _userOnBoard: UserOnboardingService,
    private _companyService: CompanyServices,
    private router: Router) { }

  ngOnInit(): void {
   
    this.userName = localStorage.getItem('TS_USER_NAME');
    this._userOnBoard.$isOpenUserOnboardingPopUp.subscribe(isopen => {
      this.show = isopen;
      this.openOnboardingDetails = false;
      if(location.href.includes('organization_setting/profile/') && isopen){
        this.show=false;
        this._userOnBoard._superUserOnboarding.next(false)
      }
    })
    this._companyService.getCompanyDetail().subscribe((data) => {
      if(data['result']){
        this.userID = data['result'].id
      }
    })
  }

  isUserAgreed() {
    this.router.navigate([this.getPrefixUrl + '/organization_setting/profile/add/' + this.userID])
    this.show = false;
  }

  cancel() {
    this._userOnBoard._superUserOnboarding.next(false)
  }

}
