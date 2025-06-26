import { NgxPermissionsService } from 'ngx-permissions';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { EmailVerificationDialogService } from '../email-verification-dialog.service';
import { OrganisationNotificationService } from '../../../customerapp-module/api-services/orgainzation-setting-module-services/organisation-notifications-service/organisation-notifications-service.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';


@Component({
  selector: 'app-organisation-notifications',
  templateUrl: './organisation-notifications.component.html',
  styleUrls: ['./organisation-notifications.component.scss']
})
export class OrganisationNotificationsComponent implements OnInit {
  regrxEmail = new ValidationConstants().VALIDATION_PATTERN.EMAIL;
  preFixUrl = ''
  constructor(private fb: UntypedFormBuilder, private _preFixUrl: PrefixUrlService, private _notificationService: OrganisationNotificationService, private emailDialogService: EmailVerificationDialogService, private _permission: NgxPermissionsService,private apiHandler:ApiHandlerService) { }

  onboarding = [

    { title: 'All', key: 'onboarding_all_items' },
    { title: 'Company-Certificates', key: 'company_certificates' },
    { title: 'Vehicle - Insurance', key: 'vehicle_insurance' },
    { title: 'Vehicle - Documents - Each Document', key: 'vehicle_documents' },
    { title: 'Employee - Documents - Each Document', key: 'employee_documents' }

  ]

  trip = [
    // { title: 'All', key: 'trip_all_items' },
    { title: 'Vehicle Payment', key: 'vehicle_provider' },
    // { title: 'Trip Expense', key: 'trip_expense' },


  ]


  income = [
    { title: 'All', key: 'income_all_items' },
    { title: 'Invoice', key: 'invoice' },
    { title: 'Debit Note', key: 'debit_note' },
    { title: 'Credit Note', key: 'credit_note' },
  ];

  expense = [
    { title: 'All', key: 'expense_all_items' },
    { title: 'Activity -Fuel', key: 'fuel_expense' },
    { title: 'Activity -Others', key: 'other_expense' },
  ]
  inventory = [
    { title: 'Inventory New', key: 'inventory_new' },
  ]

  payments = [
    { title: 'Pay Later', key: 'bill' },
  ]

  disableAllItems = false;
  notificationsForm: UntypedFormGroup;
  notificationData: any = [];
  emailStatus: any = {
    email: "",
    verificationStatus: false,

  }

  observableToGetpermission = new BehaviorSubject(false)

  allPermission = [];
  popupInputData = {
    'msg': 'Notification preferences are saved',
    'type': 'success',
    'show': false
  }

  vehicle = Permission.vehicle.toString().split(',');
  employee = Permission.employee.toString().split(',');
  vehiclePayment = Permission.vehicle_provider.toString().split(',');
  tripExpense = Permission.tripexpense.toString().split(',');
  invoice = Permission.invoice.toString().split(',');
  debit_note = Permission.debit_note.toString().split(',');
  credit_note = Permission.credit_note.toString().split(',');
  fuel = Permission.fuel.toString().split(',');
  otherExpense = Permission.others.toString().split(',');
  inventory_new = Permission.inventory_new.toString().split(',');
  pay_later = Permission.bill_payment.toString().split(',');






  ngOnInit() {
    let allPerm = this._permission.getPermissions();
    for (const key in allPerm) {
      if (Object.prototype.hasOwnProperty.call(allPerm, key)) {
        this.allPermission.push(key)
      }
    }
    this.preFixUrl = this._preFixUrl.getprefixUrl();
    this.getAllPermissions();
    this.buildform();
    this.getNotificationValues();
  }
  confirmButton(e) { }
  ngAfterViewInit() {
    setTimeout(() => {
      this.subscribeEmailValuesChanges();
    }, 1);
  }

  buildform() {
    this.notificationsForm = this.fb.group({
      notification: this.fb.group({
        company_certificates: [false],
        vehicle_insurance: [false],
        vehicle_documents: [false],
        employee_documents: [false],
        vehicle_provider: [false],
        trip_expense: [false],
        invoice: [false],
        debit_note: [false],
        credit_note: [false],
        fuel_expense: [false],
        other_expense: [false],
        inventory_new: [false],
        bill: [false],
        expense_all_items: [false],
        income_all_items: [false],
        trip_all_items: [false],
        onboarding_all_items: [false],
      }),
      email: this.fb.group({
        email: ['', [Validators.pattern(this.regrxEmail), Validators.required]],
        upcoming_notify: [false],
        email_notify: [false]

      })
    });
  }


  getNotificationValues() {
    this._notificationService.getNotificationDetails().subscribe((res) => {
      this.notificationData = res['result'];
      this.notificationsForm.patchValue(this.notificationData);
      this.disableAllItems = !(this.notificationData['email']['is_email_verified']);
      this.emailStatus.verificationStatus = this.notificationData['email']['is_email_verified']
      this.selectAllItems('');
    })
  }


  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }


  selectAllItems(value) {
    let notificationFormGroup = this.notificationsForm.get('notification') as UntypedFormGroup
    if (value == 'onboarding_all_items') {
      this.checkUncheckCheckBox(this.onboarding, notificationFormGroup.get('onboarding_all_items').value);
    }
    else if (value == 'trip_all_items') {
      this.checkUncheckCheckBox(this.trip, notificationFormGroup.get('trip_all_items').value);
    }
    else if (value == 'income_all_items') {
      this.checkUncheckCheckBox(this.income,notificationFormGroup.get('income_all_items').value);

    }
    else if (value == 'expense_all_items') {
      this.checkUncheckCheckBox(this.expense,notificationFormGroup.get('expense_all_items').value);

    }
    this.observableToGetpermission.subscribe(data => {
      this.checkUncheckAllCheckBox(this.onboarding, 'onboarding_all_items');
      this.checkUncheckAllCheckBox(this.trip, 'trip_all_items');
      this.checkUncheckAllCheckBox(this.income,'income_all_items');
      this.checkUncheckAllCheckBox(this.expense,'expense_all_items');
    });
  }

  checkUncheckCheckBox(formLists: Array<any>, isTrue: boolean = false) {
    let notificationFormGroup = this.notificationsForm.get('notification') as UntypedFormGroup
    formLists.forEach(item => {
      notificationFormGroup.get(item.key).setValue(isTrue)
    })
  }

  checkUncheckAllCheckBox(formLists: Array<any>, allKey) {
    let notificationFormGroup = this.notificationsForm.get('notification') as UntypedFormGroup
    let totalLength = 0
    formLists.forEach((item, index) => {
      if (index !== 0) {
        if (notificationFormGroup.get(item.key).value) {
          totalLength++;
        }
      }
    })
    if (totalLength == formLists.length - 1) {
      notificationFormGroup.get(allKey).setValue(true)
    } else {
      notificationFormGroup.get(allKey).setValue(false)
    }
  }


  submitForm(isUpdate = false) {
    let form = this.notificationsForm;
    if (form.valid) {
      this.apiHandler.handleRequest( this._notificationService.postNotificationDetails(form.value),'Your notification preferences have been saved!').subscribe({
        next:(resp)=>{
          this.getNotificationValues();
        },
        error:(err)=>{
          console.log(err)
        }
      })
    } else {
      this.setAsTouched(form)
    }

  }
  setAsTouched(group: UntypedFormGroup | UntypedFormArray) {
    group.markAsTouched();
    for (let i in group.controls) {
      if (group.controls[i] instanceof UntypedFormControl) {
        group.controls[i].markAsTouched();
      } else {
        this.setAsTouched(group.controls[i]);
      }
    }
  }

  openEnterOTPDialog() {
    this.emailDialogService.enterOTPDialogService({ "email": this.notificationsForm.get('email').get('email').value }).subscribe((response) => {
      if (this.notificationData['email']['is_email_verified'] || response['status'] == 'success') {
        this.getNotificationValues();
        this.notificationsForm.get('email').get('email_notify').setValue(true);
        this.submitForm()
      } else {
        this.disableAllItems = true;
        this.emailStatus.verificationStatus = false;
      }
    });
  }

  subscribeEmailValuesChanges() {
    this.notificationsForm.get('email').get('email').valueChanges.pipe(debounceTime(250), distinctUntilChanged()).subscribe(email => {
      this.emailStatus.email = email;
      if (this.notificationData['email']['email'] == email && this.emailStatus.verificationStatus) {
        this.emailStatus.verificationStatus = true;
      }
      else {
        this.emailStatus.verificationStatus = false;
      }
    });
  }

  getAllPermissions() {
    let vehicle = ['vehicle_documents',  'vehicle_insurance',];
    vehicle.forEach(item => {
      this.checkPermission(this.onboarding,this.vehicle[3],item);
    });
    this.checkPermission(this.onboarding,'company__view','company_certificates');
    this.checkPermission(this.onboarding,this.employee[3],'employee_documents');
    this.checkPermission(this.trip,this.vehiclePayment[3],'vehicle_provider');
    //this.checkPermission(this.trip,this.tripExpense[3],'trip_expense');
    this.checkPermission(this.income,this.invoice[3],'invoice');
    this.checkPermission(this.income,this.debit_note[3],'debit_note');
    this.checkPermission(this.income,this.credit_note[3],'credit_note');
    this.checkPermission(this.expense,this.fuel[3],'fuel_expense');
    this.checkPermission(this.expense,this.otherExpense[3],'other_expense');
    this.checkPermission(this.inventory,this.inventory_new[3],'inventory_new');
    //this.checkPermission(this.inventory,this.pay_later[3],'bill');
  }
  checkPermission(checkPermissionIn=[],permissionKey:string,checkStringKey:string){
    if (!this.allPermission.includes(permissionKey)) {
      let index = checkPermissionIn.findIndex(a => a.key === checkStringKey);
      checkPermissionIn.splice(index, 1);
    }
    if (checkPermissionIn.length === 1) {
      checkPermissionIn= [];
    }

  }

}
