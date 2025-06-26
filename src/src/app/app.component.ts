import { Subscription, interval } from 'rxjs';
import { Component } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AuthService } from './modules/customerapp-module/api-services/auth-and-general-services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
}) 
export class AppComponent {
  title = 'client';
  status = '';
  TS_LOGIN_TOKEN = 'TS_LOGIN_TOKEN';
  clientId = 'TS_CLIENT_ID';
  tokenSub$: Subscription;
  counterObserbable: Subscription;
  constructor(private ngxService: NgxUiLoaderService,
    private _tsAuth: AuthService,
    private router: Router,
  ) {

  }

  ngOnInit() {
    this.ngxService.start();
    this.tokenSearchInt();
    if(localStorage.getItem(this.clientId) &&!location.href.includes('signup') ){
      if(!location.href.includes(localStorage.getItem(this.clientId))){
        localStorage.removeItem(this.clientId);
        this.router.navigate(['/login']);
      }
    }


  }
  ngAfterViewInit() {
    this.ngxService.stop();

  }



  tokenSearchInt() {
    let intervalc = interval(4000);
    this.tokenSub$ = intervalc.subscribe(data => {

      if (this._tsAuth.loginToken == '' && localStorage.getItem(this.TS_LOGIN_TOKEN)) {
        this._tsAuth.loginToken = localStorage.getItem(this.TS_LOGIN_TOKEN);
      }
      let token = localStorage.getItem(this.TS_LOGIN_TOKEN);
      if (token) {
        if (token != this._tsAuth.loginToken) {
          location.reload();
        }
      }

    });
  }


  ngOnDestroy(): void {
    this.tokenSub$.unsubscribe();
  }



}

