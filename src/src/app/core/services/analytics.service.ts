import { Injectable } from '@angular/core';
import { track, reset, init, setSessionId,identify, Identify } from '@amplitude/analytics-browser';
import { CommonService } from './common.service';
import { environment } from 'src/environments/environment';
import { OperationConstants, ScreenConstants, ScreenType } from '../constants/data-analytics.constants';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';

interface UserDetails {
  userId: string,
  userEmailId: string,
  tenantName: string,
  event: string,
}
@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  constructor(private _commonService:CommonService) { }
  userDetails: UserDetails;
  userId: string = ''
  companyName='companyName'
  async trackerInstallation(userId: string) {
    this.userId = userId;
    this._commonService.getUserDetails().subscribe(data=>{
      if(environment.track_event){
        
        if ((<any>window).fcWidget){
          (<any>window).fcWidget.setExternalId(data.result.email+"_"+ data.result.tenant);
          (<any>window).fcWidget.user.setEmail(data.result.email);
          (<any>window).fcWidget.user.setFirstName(data.result.first_name +" "+ data.result.last_name +' ('+localStorage.getItem('companyName')+ ')');
          (<any>window).fcWidget.user.setLastName(' ');
        }
        
        init(environment.ANALYTICS_API_KEY, data.result.email +"_"+ data.result.tenant, {
          trackingOptions: {
            deviceManufacturer: true,
            deviceModel: true,
            ipAddress: true,
            language: true,
            osName: true,
            osVersion: true,
            platform: true,
          },
          plan:{
            branch:'test-v1'
          }
        }).promise;
        this.userDetails = {
          userId: this.userId,
          userEmailId:data.result.email,
          tenantName: data.result.tenant,
          event: '',
        }
         setSessionId(Date.now());
      }


        // const identifyObj = new Identify();
        // identifyObj.setOnce('initial-location', 'SFO');
        // identify(identifyObj);
      //  track('loggedIn').promise.then(() => {
      //   this.userDetails = {
      //     userId: this.userId,
      //     userEmailId:data.result.email,
      //     tenantName: data.result.tenant,
      //     event: 'logged In',
      //   }
      //})
    })

  }

 async addEvent(eventType: OperationConstants, screenName: ScreenConstants,screenType:ScreenType=ScreenType.EMPTY,message:string='') {
  if(environment.track_event){
    if(eventType==OperationConstants.CREATED){
      const identifyObj = new Identify();
      identifyObj.add(screenName, 1);
     await identify(identifyObj).promise;
    }
     let screenEventScreenType=''
      if(screenType){
        screenEventScreenType= screenName +" "+screenType+" "+message+" "+eventType
      }else{
        screenEventScreenType= screenName +" "+eventType
      }
      if(isValidValue( this.userDetails))
      this.userDetails.event = screenEventScreenType,
     await track( screenEventScreenType, this.userDetails).promise
  }

  }

  async analitycsLoggedOut() {
    if(environment.track_event){
      this.userDetails.event = 'logged Out';
      await track('loggedOut', this.userDetails).promise.then(() => {
        reset();
      })
    }

  }


}
