import { CompanyServices } from '../../modules/customerapp-module/api-services/company-service/company-services.service';
import { Component, OnInit, DoCheck, HostListener, Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/auth.service';
import { Router } from '@angular/router';
import { isValidValue } from '../../shared-module/utilities/helper-utils';
import { I3MSService } from 'src/app/modules/customerapp-module/api-services/i3ms-service/i3ms.service';
import { ValidationConstants } from 'src/app/core/constants/constant'
import { Permission } from 'src/app/core/constants/permissionConstants';
import { getPrefix, PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { RevenueService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/revenue-service/revenue.service';
import { GeneralService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/general.service';
import { BehaviorSubject, Subscription, interval } from 'rxjs';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { ScreenType, OperationConstants, ScreenConstants } from 'src/app/core/constants/data-analytics.constants';
import { UserOnboardingService } from 'src/app/core/services/super-user-onboarding.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { MobileNavService } from 'src/app/core/services/mobile-nav.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],

})
export class HeaderComponent implements OnInit, DoCheck, OnDestroy {
  @Input() routeChange = new BehaviorSubject(false);
  gps: boolean = false;
  enableLorry: boolean = false;
  enableTrip: boolean = false;
  gpsLink: string = "";
  compamyName;
  mobileSearch: any;
  companyId: string;
  dashboard = false;
  headerActions = true;
  menu: boolean = false;
  addCompany: Boolean = false;
  i3msActivated: boolean = false;
  pageNo = 1;
  notificationsData = []
  notificationsCount: any = 0;
  isLastPage: any;
  dynamicData: any = [];
  constants = new ValidationConstants().routeConstants;
  addActivity = [];
  viewActivity = [];
  inventoryView = [];
  profileImage = '../../../../assets/img/dummy_person.jpeg';
  prefixUrl = '';
  companyLogoUrl = 'TS_COMPANY_LOGO';
  isDesktopResolution = true;
  isDashBoard = false;
  isDemoAccount = false;
  popupInputData = {
    'msg': 'Are you sure, you want to delete?',
    'type': 'warning',
    'show': false
  }
  mobileView = false;
  screenType = ScreenType;
  analyticsType = OperationConstants;
  analyticsScreen = ScreenConstants;
  journalEntry = Permission.journalentry.toString().split(',');
  bankActivity = Permission.bankactivity.toString().split(',');
  employeeAttendence = Permission.employee_attendance.toString().split(',');
  fuelSlip = Permission.fuel.toString().split(',');
  notificationCount$: Subscription;
  prefix = getPrefix();
  detailsscreenlist = ["creditnote", "debitnote", "fuel", "otherexpenseactivity", "inventoryactivity", "fleetowner",
    "tyrerotation", "tyrechangenew", "tyrechangeinventory", "maintenancenew", "maintenanceinventory", "foreman",
    "tripexpense", "billofsupply", "billpayment", "employeesalary", "paymentsettlement", "paymentmadedetail", "employeeotherexpenseactivity",
    "vendoradvance", "pettyexpense"];
  @ViewChild('mobileNav') mobileNav: ElementRef;

  @HostListener('document:click', ['$event.target'])
  onClick(targetElement: any) {
    const clickedInside = this.mobileNav?.nativeElement?.contains(targetElement);
    if (!clickedInside && this.mobileView) {
      if (this.headerActions) {
        this.headerActions = false
      }
    }
  }
  constructor(
    private _authService: AuthService,
    private _companyService: CompanyServices,
    private _i3msService: I3MSService,
    private _router: Router,
    private _prefixUrl: PrefixUrlService,
    private deviceService: DeviceDetectorService,
    private _rService: RevenueService,
    private _gService: GeneralService,
    private analyitcs: AnalyticsService,
    private _uesrOnboarding: UserOnboardingService,
    private _currency: CurrencyService,
    private _mobileNav: MobileNavService,

  ) {
  }

  ngOnInit() {
    if (!this.deviceService.isDesktop()) {
      this.mobileView = true;
    }


    let windowWidth = window.innerWidth;
    if (windowWidth < 1100) {
      this.headerActions = false
    }
    this._mobileNav.$cloceMainMobNav.subscribe(data => {
      this.menu = false
    })

    this.analyitcs.trackerInstallation(this._authService.getClientId())
    this.prefixUrl = this._prefixUrl.getprefixUrl();
    this._uesrOnboarding.$getNewCompanyDetails.subscribe(data => {
      if (data) {
        this._uesrOnboarding.setIsUserOnboarded(true)
        this.getCompanyDetails();
      }
    })
    this._uesrOnboarding.$showResetButton.subscribe(data => {
      this.isDemoAccount = data;
    });
    this.getCompanyDetails();
    this.getI3msactivationStatus();
    this.getNotificationsCount();
    this.enableDisableTripLorry();
    this.getDeviceTypeDetails();
    //this.getGPSActivation();
    this.notificationCount();
  }


  enableDisableTripLorry() {
    this._rService.getUnusedConsignmentExistence().subscribe(res => {
      this.enableLorry = res.result.ld_exists;
      this.enableTrip = res.result.ct_exists;
    })
  }


  getGPSActivation() {
    this._gService.getGPSAccessKey().subscribe(res => {
      if (res.result && res.result.gps_status === true) {
        this.gps = true;
        this.gpsLink = res.result['link'];
      }
    });
  }

  getDeviceTypeDetails() {

    if (this.isDesktop) {
      this.isDesktopResolution = true;
    }
    else {
      this.isDesktopResolution = false;

    }
  }




  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  get isTablet(): boolean {
    return this.deviceService.isTablet();
  }

  get isDesktop(): boolean {
    return this.deviceService.isDesktop();
  }



  getI3msactivationStatus() {
    this._i3msService.getActivationStatus().subscribe(res => {
      if (res.result && res.result.is_activated === true) {
        this.i3msActivated = true;
      }
    });
  }

  getCompanyDetails() {
    this._companyService.getCompanyDetail().subscribe((data: any) => {
      if (data.result && data.result.hasOwnProperty('company_name')) {
        if (data['result'].profile_image_url) {
          this.profileImage = data['result'].profile_image_url
        }
        this.compamyName = this.formatCompanyName(data.result.company_name);
        localStorage.setItem('companyName', this.compamyName);
        this._currency.setCurrency(data['result']['currency'].currency)
      }
    });
  }


  formatCompanyName(companyName) {
    if (companyName.length > 20) {
      let companyNameArray = companyName.trim().split(' ');
      companyNameArray = companyNameArray.filter(ele => ele.length !== 0);
      let formattedName = companyNameArray[0];
      for (let i = 1; i < companyNameArray.length; i++) {
        formattedName = formattedName + ' ' + companyNameArray[i].charAt(0) + '.';
      }
      return formattedName;
    }
    return companyName;
  }

  ngDoCheck() {
    const compExists = localStorage.getItem('TS_COMPANY_EXISTS');

    if (isValidValue(compExists)) {
      this.addCompany = true;
      this.companyId = compExists;
    } else {
      this.addCompany = false;
    }
  }


  getNotificationsCount() {
    this._companyService.getNotificationCount().subscribe((res) => {
      this.notificationsCount = res['result']
    })
  }

  getNotificationsData() {
    let pageSize = 6;
    this.pageNo = 1;
    this._companyService.getNotifications(this.pageNo, pageSize).subscribe((res) => {
      this.notificationsData = res['result'];
      this.notificationsCount = 0;
      this.isLastPage = res['pagination']['page']['next'];
    })
  }

  getNotificationsOnScroll() {
    let pageSize = 6;
    this._companyService.getNotifications(this.pageNo, pageSize).subscribe((res) => {
      this.notificationsData.push(...res['result'])
      this.isLastPage = res['pagination']['page']['next'];
    })
  }


  navigateToEditComponent(data) {
    if (data.viewable_attr.hasOwnProperty('screen')) {
      const routeName = this.findRoute(data.viewable_attr.id, data.viewable_attr.screen, data.viewable_attr.sub_screen);
      if (this.detailsscreenlist.includes(data.viewable_attr.screen)) {
        const viewUrl = this.findRoute('', data.viewable_attr.screen, data.viewable_attr.sub_screen);
        let queryParms = '?pdfViewId=' + data.viewable_attr.id
        let url = this.prefixUrl + viewUrl + queryParms;
        this._router.navigateByUrl(url);
        return
      }

      let parems = { details: Math.floor(1000 + Math.random() * 9000), viewId: data.viewable_attr.id }

      if (data.viewable_attr.screen == "vehicle") {
        if (data.viewable_attr['extras'].is_market_vehicle) {
          this._router.navigate([getPrefix() + '/onboarding/vehicle/market/details/' + data.viewable_attr.id], { queryParams: parems });
        } else {
          this._router.navigate([getPrefix() + '/onboarding/vehicle/own/details/' + data.viewable_attr.id], { queryParams: parems });
        }
        return
      }
      if (data.viewable_attr.screen == "party") {
        if (data.viewable_attr['extras'].is_client) {
          this._router.navigate([getPrefix() + '/onboarding/party/details/client/' + data.viewable_attr.id], { queryParams: parems });
        } else {
          this._router.navigate([getPrefix() + '/onboarding/party/details/vendor/' + data.viewable_attr.id], { queryParams: parems });
        }
        return
      }

      if (data.viewable_attr.screen == "employee") {
        this._router.navigate([getPrefix() + '/' + routeName], { queryParams: parems });
        return
      }

      if (routeName) {
        this._router.navigate([getPrefix() + '/' + routeName], { queryParams: parems });
      }
    }
  }

  employeeAppManageMent() {
    this._router.navigate([getPrefix() + '/organization_setting/driver_app_access_management']);

  }
  employeeTimeLog(){
    this._router.navigate([getPrefix() + '/emp-timelog']);
  }

  createfuelSlip() {
    this._router.navigate([getPrefix() + '/fuel_challan_list']);
  }

  findRoute(id: string, name: string, subname: string = "") {
    for (let index in this.constants) {
      if (this.constants[index].name == name) {
        let route: string = this.constants[index].route + id;
        if (subname && this.constants[index].hasOwnProperty('subname')) {
          const subnames: Array<String> = this.constants[index]['subname'];
          const subrouteIndex = subnames.indexOf(subname);
          if (subrouteIndex == -1) {
            return false
          }
          const subroute: String = this.constants[index]['subroute'][subrouteIndex];
          return route + '/' + subroute;
        }
        return route;
      }
    }
    return false
  }

  notificationCount() {
    let intervalC = interval(5000);
    this.notificationCount$ = intervalC.subscribe(data => {
      this.getNotificationsCount();
    });
  }

  ngOnDestroy(): void {
    this.notificationCount$.unsubscribe();
  }


  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
      if (this.isLastPage) {
        this.pageNo++;
        this.getNotificationsOnScroll();
      }
    }
  }

  getCompanyLogoUrl() {
    return this._authService.getCompanyLogoUrl();
  }




  mobileToggele() {
    this.menu = !this.menu
    this._mobileNav._mobilesidenavActive.next(this.menu);
  }

  reset() {
    this.popupInputData.show = true;

  }

  confirmButton(e) {
    if (e) {
      this._companyService.ressetDemoData().subscribe(resp => {
        this._router.navigateByUrl("/login");
      })

    }
  }

  closeQuickAction() {
    if (this.isMobile) {
      this.headerActions = false;
    }
  }
}

