import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BehaviorSubject } from 'rxjs';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { CreateVehicleService } from 'src/app/core/services/create-vehicle.service';
import { MobileNavService } from 'src/app/core/services/mobile-nav.service';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { UserOnboardingService } from 'src/app/core/services/super-user-onboarding.service';

@Component({
  selector: 'app-side-nav-bar',
  templateUrl: './side-nav-bar.component.html',
  styleUrls: ['./side-nav-bar.component.scss']
})
export class SideNavBarComponent implements OnInit {

  @Output() isCollapsed = new EventEmitter();
  @Input () isnewNavigation= new BehaviorSubject(true)
  sideBar: any = {
    consign:false,
    challan:false,
    trip: false,
    trip_transporter: false,
    vehicle_trip: false,
    invoice: false,
    debit: false,
    credit: false,
    payments: false,
    billofsupply:false,
  };
  collapse: boolean = false;
  enableLorry: boolean = false;
  enableTrip: boolean = false;
  vehicleInspection=Permission.vehicleInspection.toString().split(',')
  
  //  onboarding Permissions Starts
  vehicle=Permission.vehicle.toString().split(',');
  assets=Permission.assets.toString().split(',');
  party=Permission.party.toString().split(',');
  employee=Permission.employee.toString().split(',');
  bank=Permission.bank.toString().split(',');
  tripcode=Permission.trip_code.toString().split(',');
  tyreMaster=Permission.tyre_master.toString().split(',');
  openingBalance=Permission.opening_balance.toString().split(',');
  zone =Permission.zone.toString().split(',');
  ratecard =Permission.rate_card.toString().split(',');
  container =Permission.container.toString().split(',');
  marketVehicle=Permission.market_vehicle.toString().split(',');
  onboarding=Permission.onboading.toString().split(',');
  item=Permission.item.toString().split(',');

// trip Permissions Starts
  quotation=Permission.quotations.toString().split(',');
  workOrder=Permission.workorder.toString().split(',');
  newTrips=Permission.trip__new_trip.toString().split(',');
  vehicleProvider=Permission.vehicle_provider.toString().split(',');
  tripExpense=Permission.tripexpense.toString().split(',');
  employeeOthers=Permission.employeeOthers.toString().split(',');
  trip=Permission.trip.toString().split(',');
  siteInspection=Permission.siteInspection.toString().split(',')
  localPurchaseOrder=Permission.localPurchaseOrder.toString().split(',')


  //  Income Permissions Starts
  invoice=Permission.invoice.toString().split(',');
  paymentReceived=Permission.payments__settlement.toString().split(',');
  debitNote=Permission.debit_note.toString().split(',');
  creditNote=Permission.credit_note.toString().split(',');
  bos=Permission.bos.toString().split(',');
  advance=Permission.payments__advance.toString().split(',');
  refund=Permission.payments__refund.toString().split(',');
  chequePayment=Permission.payments__settlement.toString().split(',');
  income=Permission.income.toString().split(',');

  // Expenses Permission Starts
  maintenance=Permission.maintenance.toString().split(',');
  fuel=Permission.fuel.toString().split(',');
  salaries=Permission.employee_salary.toString().split(',');
  otherBills=Permission.others.toString().split(',');
  pettyExpense=Permission.petty_expense.toString().split(',');
  expenses=Permission.expense.toString().split(',');

  // Paymenst Permissions Starts
  vendorAdvance=Permission.vendor_advance.toString().split(',');
  vendorCredits=Permission.vendor_credit.toString().split(',');
  payLater=Permission.bill_payment.toString().split(',');
  payments=Permission.payments.toString().split(',');

  //  Inventory Permissions Starts
  purchaseOrder=Permission.purchase_order.toString().split(',');
  inventoryNew=Permission.inventory_new.toString().split(',');
  inventoryAdjustment=Permission.inventory_adjustment.toString().split(',');
  inventory=Permission.inventory.toString().split(',');

  dashboard =Permission.dashboard.toString().split(',');


  isOpenMobileSideNav:boolean=false;
  isMobile:boolean=false;
  isDemoAccount=false;
  pathSplit:any;
  canCreateVehicle:boolean =false;
  canCreateAsset: boolean = true;

  constructor(private _mobileNav:MobileNavService,private _isMobile:DeviceDetectorService,private _uesrOnboarding: UserOnboardingService,private _moveToTop:ScrollToTop,
    private _createVehicle:CreateVehicleService)  {
     }

  ngOnInit() {
    this.canCreateVehicle =this._createVehicle.createVehicle;
    this._createVehicle.$createVehicleObj.subscribe(resp=>{
      this.canCreateVehicle =this._createVehicle.createVehicle;
    });
    this.canCreateAsset =this._createVehicle.createAsset;
    this._createVehicle.$createAssetObj.subscribe(resp=>{
      this.canCreateAsset =this._createVehicle.createAsset;
    });
    this.onboarding.toString().split(',');
    this.trip.toString().split(',');
    this.income.toString().split(',');
    this.expenses.toString().split(',');
    this.payments.toString().split(',');
    this.inventory.toString().split(',');
    this._mobileNav.$showMobileNab.subscribe(result=>{
      if(!this._isMobile.isDesktop()){
        this.isOpenMobileSideNav=result;

      }else{
        this.isOpenMobileSideNav=true;

      }
    })
    this.isnewNavigation.subscribe(data=>{
    });
    this._uesrOnboarding.$showResetButton.subscribe(data=>{
      this.isDemoAccount=data;
    });


    this.activeToggleFunction()
  }



  reSetSidebar() {
    this.sideBar = {
      consign:false,
      challan:false,
      trip: false,
      trip_transporter: false,
      vehicle_trip: false,
      invoice: false,
      debit: false,
      credit: false,
      payments: false,
      billofsupply:false,
    };
  }

  activeToggleFunction(){
  let path = window.location.pathname;
  if(path.includes('onboarding')){    
    this.sideBar.vehicle_trip=true;
  }

  if(path.includes('trip')){
    this.sideBar.trip=true;
  }

  if(path.includes('income')){
    this.sideBar.income=true;
  }

  if(path.includes('expense')){
    this.sideBar.billofsupply=true;
  }

  if(path.includes('payments')){
    this.sideBar.debit=true;
  }

  if(path.includes('inventory')){
    this.sideBar.challan=true;
  }





  }
 
  stopLoaderClasstoBody(){
		let body = document.getElementsByTagName('body')[0];
        body.classList.add('removeLoader');
	}

  ngOnDestroy() {}

  toggleCollapse() {
    this.collapse = !this.collapse;
    this.isCollapsed.emit(this.collapse);
  }
  closeSideNav(){
    this.moveToTop();
    if(!this._isMobile.isDesktop()){
      this._mobileNav._newNav.next(true);
      this.isOpenMobileSideNav=false;
    }

  }

  moveToTop(){
    this._moveToTop.scrollToTop();
  }

  

}
