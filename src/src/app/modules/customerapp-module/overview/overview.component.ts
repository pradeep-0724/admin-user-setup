import { NgxPermissionsService } from 'ngx-permissions';
import { Component, OnInit } from '@angular/core';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { ScreenType, OperationConstants, ScreenConstants } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { LiveDemoLink } from 'src/app/core/constants/constant';
import { CreateVehicleService } from 'src/app/core/services/create-vehicle.service';
import { DomSanitizer } from '@angular/platform-browser'; 

interface SingleStep{
  title:String,
  steps:String,
  data:String,
  link:any
}

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: [
    './overview.component.scss'
  ]
})
export class OverviewComponent implements OnInit {

  guideData:SingleStep[]=[
    {
      title:"Vehicle",
      steps:"Add Vehicle - Onboarding > Vehicle > Add Vehicle",
      data:"",
      link:this.getUrl("https://demo.arcade.software/Ffvs4vSl5Aq2EoSYPw2m?embed")
    },
    {
      title:"Party",
      steps:"Add Party - Onboarding > Party > Add Party",
      data:"",
      link:this.getUrl("https://demo.arcade.software/La6OqQ5AHBg01Sj3jtbw?embed%22")
    },
    {
      title:"Employee",
      steps:"	Add Employee - Onboarding > Employee > Add Employee",
      data:"",
      link:this.getUrl("https://demo.arcade.software/B8JsDS1QdpjjX5oUfQQg?embed%22")
    },
    {
      title:"Bank",
      steps:"Add bank - Onboarding > Bank > Add Bank",
      data:"",
      link:this.getUrl("https://demo.arcade.software/lsS6oKXpKBJhCkdRruWW?embed")
    },
    {
      title:"Maintenance",
      steps:"Add Maintenance - Expense > Maintenance > Add Maintenance",
      data:"",
      link:this.getUrl("https://demo.arcade.software/0GqDWfSAmqvkuk7H92Bs?embed%22")
    },
    {
      title:"Fueling",
      steps:"Add Fueling - Expense > Fueling > Add Fueling",
      data:"",
      link:this.getUrl("https://demo.arcade.software/oQEi6SRW8DvJj8ZAOKaf?embed%22")
    },{
      title:"Salary",
      steps:"Add Salary - Expense > Salary > Add Salary",
      data:"",
      link:this.getUrl("https://demo.arcade.software/JeuDeZTbyrJNEN0Da6fp?embed%22")
    },{
      title:"Other Bills",
      steps:"Add Other Bills - Expense > Other Bills > Add Other Bills",
      data:"",
      link:this.getUrl("https://demo.arcade.software/SIoQhrEnNXg1aiCjLwwE?embed%22")
    },{
      title:"Petty Expense",
      steps:"Add Petty Expense - Expense > Petty Expense > Add Petty Expense",
      data:"",
      link:this.getUrl("https://demo.arcade.software/FSMV1KXZFcXw4uHxjgI3?embed%22")
    },{
      title:"Pay later",
      steps:"Add Pay Later - Payments > Pay Later > Add Pay Later",
      data:"",
      link:this.getUrl("https://demo.arcade.software/yHgEG86oyq4uNRMAUly2?embed%22")
    },{
      title:"Vendor Advance",
      steps:"Add Vendor Advance - Payments > Vendor Advance > Add Vendor Advance",
      data:"",
      link:this.getUrl("https://demo.arcade.software/t8G3DmKDjNa3qOAsL5ka?embed%22")
    },
    {
      title:"Vendor Credit",
      steps:"Add Vendor Credit - Payments > Vendor Credit > Add Vendor Credit",
      data:"",
      link:this.getUrl("https://demo.arcade.software/NvTpA6F3RwLmMXCTz944?embed%22")
    },{
      title:"Quotation",
      steps:"Add Quotation - Job > Quotation > Add Quotation",
      data:"",
      link:this.getUrl("https://demo.arcade.software/lYimjVv1eM1D2myZMl8P?embed%22")
    },{
      title:"Work Order",
      steps:"Add Work Order - Job > Work Order > Add Work Order",
      data:"",
      link:this.getUrl("https://demo.arcade.software/jtCKag5YglEuHVFcLmd5?embed%22")
    },{
      title:"Job Add",
      steps:"Add Job - Job > Job > Add Job",
      data:"",
      link:this.getUrl("https://demo.arcade.software/ljKsSnQjmBBz2cJWMFjO?embed%22")
    },{
      title:"Job List",
      steps:"Job List - Job > Job > Job List",
      data:"",
      link:this.getUrl("https://demo.arcade.software/KT9cpxAmrxUoi1Kas5IL?embed%22")
    },{
      title:"Vehicle Payment",
      steps:"Add Vehicle Payment - Job > Vehicle Payment > Add Vehicle Payment ",
      data:"",
      link:this.getUrl("https://demo.arcade.software/hjCYjPtLfY7LntvUna3s?embed%22")
    },{
      title:"Job Expense",
      steps:"Add Vehicle Payment - Job > Vehicle Payment > Add Vehicle Payment ",
      data:"",
      link:this.getUrl("https://demo.arcade.software/OsBPoLcKaxHgknPd13ht?embed%22")
    },{
      title:"Employee Others",
      steps:"Add Employee Others - Job > Employee Others > Add Employee Others",
      data:"",
      link:this.getUrl("https://demo.arcade.software/2LBh6yAcdJu1HkQhPhIS?embed%22")
    },{
      title:"Invoice",
      steps:"Add Invoice - Income >Invoice > Add Invoice ",
      data:"",
      link:this.getUrl("https://demo.arcade.software/bVgXIdtWl5pGxp8vtSkf?embed%22")
    },{
      title:"Payment Received",
      steps:"Add Payment Received - Income >Payment Received > Add Payment Received ",
      data:"",
      link:this.getUrl("https://demo.arcade.software/Q0fYCSUiptrvqiAR9dTl?embed%22")
    },{
      title:"Debit Note",
      steps:"Add Debit Note - Income >Debit Note > Add Debit Note ",
      data:"",
      link:this.getUrl("https://demo.arcade.software/CxynQegrHRRf2FTJcvOL?embed%22")
    },{
      title:"Credit Note",
      steps:"Add Credit Note - Income >Credit Note > Add Credit Note",
      data:"",
      link:this.getUrl("https://demo.arcade.software/wWZOqOd9TcPnZDEOarlz?embed%22")
    },{
      title:"Advance",
      steps:"Add Advance - Income >Advance > Add Advance",
      data:"",
      link:this.getUrl("https://demo.arcade.software/DuXS47Npqb5AElbxDJn2?embed%22")
    },
    {
      title:"Refund",
      steps:"Add Refund - Income >Refund > Add Refund",
      data:"",
      link:this.getUrl("https://demo.arcade.software/yE4ZPSBytUTHZz1s2qUx?embed%22,")
    },
  ]

  currGuideItem:number=0;
  currGuideItemLink=this.guideData[this.currGuideItem].link;



  vehicle = Permission.vehicle.toString().split(',');
  employee = Permission.employee.toString().split(',');
  party = Permission.party.toString().split(',');
  bank = Permission.bank.toString().split(',');
  openingBalance = Permission.opening_balance.toString().split(',');
  trips = Permission.trip__new_trip.toString().split(',');
  workOrder = Permission.workorder.toString().split(',');
  quotation = Permission.quotations.toString().split(',');
  paymentReceived = Permission.payments__settlement.toString().split(',');
  invoice = Permission.invoice.toString().split(',');
  advance = Permission.payments__advance.toString().split(',');
  maintenance = Permission.maintenance.toString().split(',');
  fuel = Permission.fuel.toString().split(',');
  salaries = Permission.employee_salary.toString().split(',');
  vendorAdvance = Permission.vendor_advance.toString().split(',');
  vendorCredits = Permission.vendor_credit.toString().split(',');
  payLater = Permission.bill_payment.toString().split(',');
  permissionList = [];
  prefixUrl = ''
  screenType = ScreenType;
  analyticsType = OperationConstants;
  analyticsScreen = ScreenConstants;
  gothroughUrls = LiveDemoLink
  goThroughDetais = {
    show: false,
    url: ''
  };
  maintence={
    show:false
  };
  maintenancePerm=Permission.maintenance.toString().split(',');

  getStarted = []
  canCreateVehicle:boolean =false;
  constructor(
    
    private sanitizer: DomSanitizer,
    private _analytics: AnalyticsService,
    private _ngxPermissionService: NgxPermissionsService,
    private _createVehicle:CreateVehicleService

  ) {
  }

  ngOnInit() {
    this.canCreateVehicle =this._createVehicle.createVehicle;
    let permissionObj = this._ngxPermissionService.getPermissions();
    for (const key in permissionObj) {
      if (Object.prototype.hasOwnProperty.call(permissionObj, key)) {
        this.permissionList.push(key)
      }
    }
    this.getStarted = this.getStartedList();
    this.prefixUrl = getPrefix();
    if(!this.canCreateVehicle){
      this.getStarted[0].links[0].permission=false;
    }
    this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.OVERVIEW, this.screenType.VIEW, "Navigated");
  }


  openGothrough(linkUrl) {
    if (linkUrl) {
      this.goThroughDetais = {
        show: true,
        url: linkUrl
      }
    }
  }

  openAddMaintenance(value){
    if(value===''){
      this.maintence.show=true;
    }
  }


  getStartedList() {
    return [

      {
        title: 'Onboarding',
        data: "Add own/market vehicles, employees, banks, parties, and company's opening balances.",
        imgSrc: './assets/img/party-icon.png',
        links: [
          { linkTitle: 'Vehicle', url: 'onboarding/vehicle/add/details', permission: this.permissionList.includes(this.vehicle[0]) },
          { linkTitle: 'Parties', url: 'onboarding/party/add', permission: this.permissionList.includes(this.party[0]) },
          { linkTitle: 'Employee', url: 'onboarding/employee/add/information', permission: this.permissionList.includes(this.employee[0]) },

        ],
        videoURL: this.gothroughUrls.Onboarding

      },

      {
        title: 'Trip',
        data: "Create quotations, work order, and individual vehicle jobs to see trip-wise profitability.",
        imgSrc: './assets/img/vehicle-icon.png',
        links: [
          { linkTitle: 'Quotation', url: 'trip/quotation/add', permission: this.permissionList.includes(this.quotation[0]) },
          { linkTitle: 'Work order', url: 'trip/work-order/add', permission: this.permissionList.includes(this.workOrder[0]) },
          { linkTitle: 'Trips', url: 'trip/new-trip/add', permission: this.permissionList.includes(this.trips[0]) }
        ],
        videoURL: this.gothroughUrls.Trips


      },

      {
        title: 'Income',
        data: "Create invoices within seconds and receive payments.",
        imgSrc: './assets/img/income-icon.png',
        links: [
          { linkTitle: 'Payment Received', url: 'income/payments/invoice/add', permission: this.permissionList.includes(this.paymentReceived[0]) },
          { linkTitle: 'Invoice', url: 'income/invoice/add', permission: this.permissionList.includes(this.invoice[0]) },
          { linkTitle: 'Advance', url: 'income/payments/advance/add', permission: this.permissionList.includes(this.advance[0]) }
        ],
        videoURL: this.gothroughUrls.Income

      },

      {
        title: 'Expenses',
        data: "Record vehicle maintenance bills, petty expenses and other office expenses.",

        imgSrc: './assets/img/expenses-icon.png',
        links: [
          { linkTitle: 'Salaries', url: 'expense/salary_expense/add', permission: this.permissionList.includes(this.salaries[0]) },
          { linkTitle: 'Maintenance', url: '', permission: this.permissionList.includes(this.maintenance[0]) },
          { linkTitle: 'Fueling', url: 'expense/fuel_expense/add', permission: this.permissionList.includes(this.fuel[0]) }
        ],
        videoURL: this.gothroughUrls.Expense

      },

      {
        title: 'Payments',
        data: "Clear vendor outstanding payments, book advances and vendor credits.",
        imgSrc: './assets/img/employees-icon.png',
        links: [
          { linkTitle: 'Pay Later', url: 'payments/bill', permission: this.permissionList.includes(this.payLater[0]) },
          { linkTitle: 'Vendor Advance', url: 'payments/advance', permission: this.permissionList.includes(this.vendorAdvance[0]) },
          { linkTitle: 'Vendor Credits', url: 'payments/vendor_credit/add', permission: this.permissionList.includes(this.vendorCredits[0]) }
        ],
        videoURL: this.gothroughUrls.Payments
      },

      {
        title: 'Reporting',
        data: "Every report you need to increase business visibility, vehicle performance and track growth.",
        imgSrc: './assets/img/company-icon.png',
        links: [
          { linkTitle: 'Vehicle', url: 'onboarding/vehicle/vehicle-list', permission: this.permissionList.includes(this.vehicle[3]) },
          { linkTitle: 'Parties', url: 'onboarding/party/view', permission: this.permissionList.includes(this.party[3]) },
          { linkTitle: 'Employee', url: 'onboarding/employee/view', permission: this.permissionList.includes(this.employee[3]) }
        ],
        videoURL: this.gothroughUrls.Reports

      },
    ]
  }
  getUrl(url){
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
