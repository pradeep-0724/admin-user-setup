import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ScreenType, OperationConstants, ScreenConstants } from 'src/app/core/constants/data-analytics.constants';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { TaxService } from 'src/app/core/services/tax.service';

@Component({
  selector: 'app-report-base',
  templateUrl: './reports-base.component.html',
  styleUrls: ['./reports-base.component.scss']
})
export class ReportBaseComponent implements OnInit {
  prefixUrl = '';
  isDesktopResolution = true;
  isTax = false;
  isTDS = false;
  screenType = ScreenType;
  analyticsType = OperationConstants;
  analyticsScreen = ScreenConstants;
  //  onboarding Permissions Starts
  vehicle=Permission.vehicle.toString().split(',');
  party=Permission.party.toString().split(',');
  employee=Permission.employee.toString().split(',');
  bank=Permission.bank.toString().split(',');
  tripcode=Permission.trip_code.toString().split(',');
  tyreMaster=Permission.tyre_master.toString().split(',');
  openingBalance=Permission.opening_balance.toString().split(',');
  onboarding=Permission.onboading.toString().split(',');

// trip Permissions Starts
  quotation=Permission.quotations.toString().split(',');
  workOrder=Permission.workorder.toString().split(',');
  newTrips=Permission.trip__new_trip.toString().split(',');
  vehicleProvider=Permission.vehicle_provider.toString().split(',');
  tripExpense=Permission.tripexpense.toString().split(',');
  employeeOthers=Permission.employeeOthers.toString().split(',');
  trip=Permission.trip.toString().split(',');

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
  journalEntry=Permission.journalentry.toString().split(',');
  bankActivity=Permission.bankactivity.toString().split(',');
  employeeAttendence=Permission.employee_attendance.toString().split(',');
  fuelSlip=Permission.fuel.toString().split(',');
  dashboard =Permission.dashboard.toString().split(',');

  constructor(private _prefixUrl: PrefixUrlService, private deviceService: DeviceDetectorService, private _tax: TaxService,private _analytics:AnalyticsService) { }

  ngOnInit() {
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.REPORTS,this.screenType.VIEW,"Navigated");
    this.isTax = this._tax.getTax();
    this.isTDS = this._tax.getVat();
    this.prefixUrl = this._prefixUrl.getprefixUrl();
    this.getDeviceTypeDetails();

  }


  getDeviceTypeDetails() {

    if (this.isDesktop) {
      this.isDesktopResolution = true;
    }
    else {
      this.isDesktopResolution = false;

    }

  }

  get isDesktop(): boolean {
    return this.deviceService.isDesktop();
  }

}
