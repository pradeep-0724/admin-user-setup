import { AuthService } from './modules/customerapp-module/api-services/auth-and-general-services/auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { AppRoutingModule } from './app-routing.module';
import { commonReducer } from './stores/common.reducer';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApiCallInterceptor } from './core/interceptors/api-call-interceptor';
import { PageNotFoundComponent } from './404-component/page-not-found.component';
import { ServerErrorPageComponent } from './500-component/500-page.component';
import { NgxUiLoaderModule, NgxUiLoaderHttpModule, NgxUiLoaderConfig, NgxUiLoaderRouterModule } from 'ngx-ui-loader';
import { GlobalErrorHandler } from './log-handler/error-log-handler';
import { RollbarService, rollbarFactory } from './core/services/logging.service';
import { NgxPermissionsModule } from 'ngx-permissions';
import { BASE_API_URL, TSAPIRoutes } from './core/constants/api-urls.constants';
import { ThemeService } from 'ng2-charts';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackbarModule } from './snackbar-module/snackbar-module.module';


 

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  "bgsColor": "#595fab",
  "bgsOpacity": 0.5,
  "bgsPosition": "center-center",
  "bgsSize": 60,
  "bgsType": "ball-spin-clockwise",
  "blur": 10,
  "fgsColor": "#595fab",
  "fgsPosition": "center-center",
  "fgsSize": 60,
  "fgsType": "ball-spin-clockwise",
  "gap": 26,
  "logoPosition": "center-center",
  "logoSize": 120,
  "logoUrl": "",
  "masterLoaderId": "master",
  "overlayBorderRadius": "0",
  "overlayColor": "rgba(255,255,255,0.56)",
  "pbColor": "#595fab",
  "pbDirection": "ltr",
  "pbThickness": 5,
  "hasProgressBar": true,
  "text": "",
  "textColor": "#595fab",
  "textPosition": "center-center",
}


@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    ServerErrorPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatMomentDateModule,
    SnackbarModule,
    MatSnackBarModule,
    StoreModule.forRoot({ store: commonReducer }),
    ModalModule.forRoot(),
    HttpClientModule,
    BrowserAnimationsModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderRouterModule,
    NgxUiLoaderHttpModule.forRoot({
      showForeground:true,
      exclude: [BASE_API_URL + TSAPIRoutes.user_aliveness,BASE_API_URL+ TSAPIRoutes.places,BASE_API_URL+ TSAPIRoutes.place,BASE_API_URL+ TSAPIRoutes.places+TSAPIRoutes.recent,
        BASE_API_URL + TSAPIRoutes.company_add + TSAPIRoutes.notifications+ 'count/',BASE_API_URL+'revenue/formfield/trip/path/']
    }),
    NgxPermissionsModule.forRoot()
  ],
  providers: [
    AuthService,
    ThemeService ,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiCallInterceptor,
      multi: true
    },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    {
      provide: RollbarService,
      useFactory: rollbarFactory
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
