import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { TanentService } from '../../customerapp-module/api-services/company-service/tanent.service';
import { AuthService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/auth.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { OnboadingPermission } from 'src/app/core/services/onboading.service';
import { CheckListService } from '../../customerapp-module/sub-main-trip-module/new-trip-v2/check-list/check-list.service';


@Component({
  selector: 'app-tanent-user-component',
  templateUrl: './tanent-user-component.component.html',
  styleUrls: ['./tanent-user-component.component.scss']
})
export class TanentUserComponentComponent implements OnInit {
  companyKey = 'TS_COMPANY_EXISTS';
  userName = 'TS_USER_NAME';
  companyLogoUrl = 'TS_COMPANY_LOGO';
  onboadingUseeDetail = '/onboading/user-details/'
  tsUid = 'TS_UID'
  tenentList=[];
  switchTenent='switchTenent';
  client_id='TS_CLIENT_ID'
  menu = false;

  profileImage='assets/img/dummy_person.jpeg';
  constructor(private _route :Router,private _tanentService:TanentService,  private _permission :NgxPermissionsService,private _onboading :OnboadingPermission,
     private _authService:AuthService, private _router:Router,private _check_list:CheckListService) { }
  ngOnInit() {
    this.clearEveryThing();
    this._tanentService.getTenents().subscribe(data=>{
      this.tenentList =data.result;
      if(this.tenentList.length==1){
        this.goToOverview(this.tenentList[0])
      }else{
       localStorage.setItem(this.switchTenent,'true');
      }
    })
  }

  goToOverview(tenent){
       this._authService.setClientId(tenent.client_id)
       localStorage.setItem(this.companyLogoUrl,tenent.logo_url);
       localStorage.setItem(this.userName,tenent.username);
       localStorage.setItem(this.companyKey,tenent.company_id);
       this._onboading.setIsSuperUserValue(tenent.is_super_user);
       this._onboading.setOnbodadedValue(tenent.is_user_onboarded)
       let tsUid = localStorage.getItem(this.tsUid)
       if(!tenent.is_user_onboarded){
         if(tenent.is_super_user){
             localStorage.setItem(this.client_id,tenent.client_id);
             this._route.navigateByUrl('/client/'+tenent.client_id+'/onboading');
             return;
         }else{
               localStorage.setItem(this.client_id,tenent.client_id);
               this._route.navigateByUrl('/client/'+tenent.client_id+this.onboadingUseeDetail+tsUid);
            return
         }

       }
       if(tenent.is_user_onboarded){
         if(!tenent.company_id){
          localStorage.setItem(this.client_id,tenent.client_id);
          this._route.navigateByUrl('/client/'+tenent.client_id+'/onboading');
          return;
         }
       }
       localStorage.setItem(this.client_id,tenent.client_id);
       this._route.navigateByUrl('/client/'+tenent.client_id);
  }
  changePassword(){
    this._router.navigateByUrl('/' + TSRouterLinks.change_password);
  }

  logMeOut(){
    this._authService.setClientId('');
    this._authService.logout();
    this._permission.loadPermissions([])
  }

  clearEveryThing(){
    localStorage.removeItem(this.switchTenent);
    this._authService.setClientId('');
    localStorage.removeItem(this.userName);
    localStorage.removeItem(this.client_id);
    localStorage.removeItem(this.companyLogoUrl);
    localStorage.removeItem(this.companyKey);
    this._onboading.setIsSuperUserValue(false);
    this._onboading.setOnbodadedValue(false);
    this._permission.loadPermissions([]);
    this._check_list.checkList=[];
  }



}
