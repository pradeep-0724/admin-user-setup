import { Dialog } from '@angular/cdk/dialog';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import { CommonService } from 'src/app/core/services/common.service';
import { EmployeeService } from 'src/app/modules/customerapp-module/api-services/master-module-services/employee-service/employee-service';
import { NewTripV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/trip-service/new-trip-v2.service';
import { DeleteAlertComponent } from 'src/app/shared-module/delete-alert-module/delete-alert/delete-alert.component';
import { changeDateTimeToServerFormat, changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { getBlankOption, isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { CancelTokenPupupComponent } from '../cancel-token-pupup/cancel-token-pupup.component';
import { NewTripV2DataService } from '../../new-trip-v2-dataservice';

@Component({
  selector: 'app-job-token-vgm-management',
  templateUrl: './job-token-vgm-management.component.html',
  styleUrls: ['./job-token-vgm-management.component.scss']
})
export class JobTokenVgmManagementComponent implements OnInit {
  @Input() tripId: string = '';
  @Input() scopeOfWork: string = '';
  @Input() tripStartDate= '';
  @Input() typeOfMovement: 'Import' | 'Export';
  showPullout: boolean = false;
  showDeposit: boolean = false;
  showVgm: boolean = false;
  tokenAndVgmForm: FormGroup
  pullOutDetails: any
  depositDetails: any
  vgmDetails: any = []
  pullOutHistory: any = []
  depositHistory: any = []
  constructor(private _fb: FormBuilder, private _commonService: CommonService, private _employeeService: EmployeeService, private _newTripV2Service: NewTripV2Service, private dialog: Dialog,private _tripDataService: NewTripV2DataService) { }
  terminalList: any = [];
  responsibilityList: any = [
    { value: '0', label: 'Customer' },
    { value: '1', label: 'Company' },
  ]
  includeTokenChargeList: any = [
    { value: '0', label: 'Yes' },
    { value: '1', label: 'No' },
  ]
  timeSlots = [
    { value: "00:00 - 02:00", label: "00:00 - 02:00" },
    { value: "02:00 - 04:00", label: "02:00 - 04:00" },
    { value: "04:00 - 06:00", label: "04:00 - 06:00" },
    { value: "06:00 - 08:00", label: "06:00 - 08:00" },
    { value: "08:00 - 10:00", label: "08:00 - 10:00" },
    { value: "10:00 - 12:00", label: "10:00 - 12:00" },
    { value: "12:00 - 14:00", label: "12:00 - 14:00" },
    { value: "14:00 - 16:00", label: "14:00 - 16:00" },
    { value: "16:00 - 18:00", label: "16:00 - 18:00" },
    { value: "18:00 - 20:00", label: "18:00 - 20:00" },
    { value: "20:00 - 22:00", label: "20:00 - 22:00" },
    { value: "22:00 - 00:00", label: "22:00 - 00:00" }
  ];

  bankList: any = [];
  employeeList: any = [];
  initialValues = {
    pullOutSlot: getBlankOption(),
    pullOutTerminal: getBlankOption(),
    pullOutResponsibility: getBlankOption(),
    pullOutPaymentMode: getBlankOption(),
    pullOutIncludeInInvoice: getBlankOption(),
    pullOutEmployee: getBlankOption(),
    depositSlot: getBlankOption(),
    depositTerminal: getBlankOption(),
    depositResponsibility: getBlankOption(),
    depositPaymentMode: getBlankOption(),
    depositIncludeInInvoice: getBlankOption(),
    depositEmployee: getBlankOption(),
    vgmresponsibility: [],
    vgmPaymentMode: [],
    vgmIncludeInInvoice: [],
    vgmEmployee: []

  }
  scheduleTimeSloot:any;
  isVgmEdit: boolean = false;
  vgmErrorMsg=''

  ngOnInit(): void {
    this.scheduleTimeSloot=this.findTimeSlot(new Date(moment(this.tripStartDate).tz(localStorage.getItem('timezone')).format('llll')))
    this.getTerminal();
    this.getBankList();
    this.getEmployeeList();
    this.checkWhichSecitionsAreValid();
    this.tokenAndVgmForm = this._fb.group({
      pullout: false,
      deposit: false,
      vgm: false,
      is_edit_pullout: false,
      is_edit_deposit: false,
      is_edit_vgm: false,
      pulloutform: this._fb.group({
        id: null,
        token_no: '',
        reused_token: false,
        token_date:moment(new Date(this.tripStartDate)).tz(localStorage.getItem('timezone')),
        token_slot: this.scheduleTimeSloot?.value,
        terminal: null,
        token_responsibility: '0',
        payment_mode: null,
        include_in_invoice: '1',
        token_amount: 0.00,
        charge_amount: 0.00,
        employee: null,
        is_employee_paid: false,
        documents: [[]]
      }),
      depositform: this._fb.group({
        id: null,
        token_no: '',
        reused_token: false,
        token_date:moment(new Date(this.tripStartDate)).tz(localStorage.getItem('timezone')),
        token_slot: this.scheduleTimeSloot?.value,
        terminal: null,
        token_responsibility: '0',
        payment_mode: null,
        include_in_invoice: '1',
        token_amount: 0.00,
        charge_amount: 0.00,
        employee: null,
        is_employee_paid: false,
        documents: [[]]
      }),
      vgmForm: this._fb.array([])
    })
  }

  fileDeleted(form: FormGroup, id) {
    let documents = form.get('documents').value;
    form.get('documents').setValue(documents.filter(doc => doc.id != id))
  }
  fileUploader(form, e) {
    let documents = form.get('documents').value
    e.forEach((element) => {
      element['presigned_url'] = element['url']
      documents.push(element);
    });
  }

  removeVgm(i) {
    ((this.tokenAndVgmForm.get('vgmForm')) as FormArray).removeAt(i);
    this.initialValues.vgmresponsibility.splice(i, 1);
    this.initialValues.vgmPaymentMode.splice(i, 1);
    this.initialValues.vgmIncludeInInvoice.splice(i, 1);
    this.initialValues.vgmEmployee.splice(i, 1);
  }
  addVgm() {
    let vgmFormControl = this.tokenAndVgmForm.get('vgmForm') as FormArray;
    this.initialValues.vgmresponsibility.push({label: 'Customer', value: '0' });
    this.initialValues.vgmPaymentMode.push(getBlankOption());
    this.initialValues.vgmIncludeInInvoice.push({label: 'Yes', value: '1' });
    this.initialValues.vgmEmployee.push(getBlankOption());
    const vgmForm = this.getVGMForm({});
    vgmFormControl.push(vgmForm);
  }

  buildVGM(items: any) {
    let vgmFormControl = this.tokenAndVgmForm.get('vgmForm') as FormArray;
    vgmFormControl.controls = [];
    this.initialValues.vgmresponsibility=[];
    this.initialValues.vgmPaymentMode=[];
    this.initialValues.vgmIncludeInInvoice=[];
    this.initialValues.vgmEmployee=[];
    items.forEach(item => {
      const vgmForm = this.getVGMForm(item);
      vgmFormControl.push(vgmForm);
      this.initialValues.vgmresponsibility.push(getBlankOption());
      this.initialValues.vgmPaymentMode.push(getBlankOption());
      this.initialValues.vgmIncludeInInvoice.push(getBlankOption());
      this.initialValues.vgmEmployee.push(getBlankOption());
    });
  }


  getVGMForm(item) {
    return this._fb.group({
      id: item.id ? item.id : null,
      vgm_date: item.vgm_date || null,
      reference_no: item.reference_no || '',
      container_no: item.container_no || '',
      vgm_responsibility: item.vgm_responsibility || '0',
      vgm_amount: item.vgm_amount || 0.00,
      charge_amount: item.charge_amount || 0.00,
      payment_mode: item.payment_mode || null,
      is_employee_paid: item.is_employee_paid || false,
      employee: item.employee || null,
      include_in_invoice: item?.include_in_invoice=='0'?'0':'1',
      documents: [item.documents||[]]
    })
  }

  findTimeSlot(value: string | Date) {
    const selectedTime = moment(new Date(value));
  
    const matchedSlot = this.timeSlots.find(slot => {
      const [start, end] = slot.value.split(" - ");
  
      const startTime = moment(start, "HH:mm").set({
        year: selectedTime.year(),
        month: selectedTime.month(),
        date: selectedTime.date()
      });
  
      let endTime = moment(end, "HH:mm").set({
        year: selectedTime.year(),
        month: selectedTime.month(),
        date: selectedTime.date()
      });
  
      if (endTime.isBefore(startTime)) {
        endTime.add(1, 'day');
      }
  
      return selectedTime.isSameOrAfter(startTime) && selectedTime.isBefore(endTime);
    });
  
    return matchedSlot || null;
  }
  


  getTerminal() {
    this._commonService.getStaticOptions('path-terminal').subscribe((response) => {
      this.terminalList = response['result']['path-terminal']
    });
  }

  getBankList() {
    this._commonService.getBankDropDownList().subscribe((stateData) => {
      if (stateData !== undefined) {
        this.bankList = stateData.result;
      }
    });
  }

  getEmployeeList() {
    this._employeeService.getEmployeesListV2().subscribe((response) => {
      this.employeeList = response['result'];
    }
    );
  }

  pulloutCancel() {
    this.tokenAndVgmForm.get('is_edit_pullout').setValue(false);
    this.resetInitialValues()
    this.getPullOutDetails();

  }
  editPullOut() {
    this.tokenAndVgmForm.get('is_edit_pullout').setValue(true);
    this.resetInitialValues()
    this.editPatchPullOut();
  }
  depositCancel() {
    this.tokenAndVgmForm.get('is_edit_deposit').setValue(false);
    this.resetInitialValues()
    this.getDepositDetails();
  }
  editDeposit() {
    this.resetInitialValues()
    this.tokenAndVgmForm.get('is_edit_deposit').setValue(true);
    this.editPatchDeposit();
  }
  pullOutUpdate() {
    this.resetInitialValues()
    this.updatePullOutDetails();
  }
  depositUpdate() {
    this.resetInitialValues()
    this.updateDepositDetails();
  }
  vgmCancel() {
    this.vgmErrorMsg=''
    this.tokenAndVgmForm.get('is_edit_vgm').setValue(false);
    this.resetInitialValues()
    this.getVgmDetails();
  }
  editVgm() {
    this.resetInitialValues()
    this.tokenAndVgmForm.get('is_edit_vgm').setValue(true);
    this.editPatchVgm();
  }
  vgmUpdate() {
    this.resetInitialValues()
    this.updateVgmDetails();
  }
  cancelTokens(keyFor: string) {
    this.resetInitialValues()
    if (keyFor == 'pullout') {
      this.cancelToken('pullout', this.tokenAndVgmForm.get('pulloutform').get('id').value);
    } else if (keyFor == 'deposit') {
      this.cancelToken('deposit', this.tokenAndVgmForm.get('depositform').get('id').value);
    }

  }

  resetInitialValues(){
    this.initialValues = {
      pullOutSlot: getBlankOption(),
      pullOutTerminal: getBlankOption(),
      pullOutResponsibility: getBlankOption(),
      pullOutPaymentMode: getBlankOption(),
      pullOutIncludeInInvoice: getBlankOption(),
      pullOutEmployee: getBlankOption(),
      depositSlot: getBlankOption(),
      depositTerminal: getBlankOption(),
      depositResponsibility: getBlankOption(),
      depositPaymentMode: getBlankOption(),
      depositIncludeInInvoice: getBlankOption(),
      depositEmployee: getBlankOption(),
      vgmresponsibility: [],
      vgmPaymentMode: [],
      vgmIncludeInInvoice: [],
      vgmEmployee: []
    }
  }

 

  dateTimeSelected(form: FormGroup, keyFor: string, e) {
    let slotValue = this.findTimeSlot(new Date(e.value));
    if (slotValue) {
      form.get('token_slot').setValue(slotValue.value);
      if (keyFor == 'pullout') {
        this.initialValues.pullOutSlot = slotValue;
      }
      if (keyFor == 'deposit') {
        this.initialValues.depositSlot = slotValue;
      }
    }
  }

  onChangeTokenResponsibility(form: FormGroup, keyFor: string) {
    let tokenResponsibility = form.get('token_responsibility').value;
    if (tokenResponsibility == '0') {
      form.patchValue({
        payment_mode: null,
        include_in_invoice:'1',
        token_amount: 0.00,
        charge_amount: 0.00,
        employee: null,
        is_employee_paid: false
      })
    }else{
      form.patchValue({
        payment_mode: null,
        include_in_invoice:'0',
        token_amount: 0.00,
        charge_amount: 0.00,
        employee: null,
        is_employee_paid: false
      })
    }  
    if(keyFor=='pullout'){
      this.initialValues.pullOutIncludeInInvoice = this.includeTokenChargeList.find(chargeobj => chargeobj.value == form.get('include_in_invoice').value);
    }
    if(keyFor=='deposit'){
      this.initialValues.depositIncludeInInvoice = this.includeTokenChargeList.find(chargeobj => chargeobj.value == form.get('include_in_invoice').value);
    }
  }
  onChangeVgmResponsibility(form: FormGroup,index: number) {
    let vgmResponsibility = form.get('vgm_responsibility').value;
    if (vgmResponsibility == '0') {
      form.patchValue({
        payment_mode: null,
        include_in_invoice: '1',
        vgm_amount:0.00,
        charge_amount: 0.00,
        employee:null,
        is_employee_paid: false
      })
    }else{
      form.patchValue({
        payment_mode: null,
        include_in_invoice: '0',
        vgm_amount:0.00,
        charge_amount: 0.00,
        employee:null,
        is_employee_paid: false
      })
    }
    this.initialValues.vgmIncludeInInvoice[index] = this.includeTokenChargeList.find(chargeobj => chargeobj.value == form.get('include_in_invoice').value);

  }
  onChangeVgmPaymentMode(form: FormGroup) {
    let paymentMode = form.get('payment_mode').value;
    if (paymentMode != 'paid_by_employee') {
      form.patchValue({
        employee:null,
        is_employee_paid: false
      })
    }
  }

  noChangePaymentMode(form: FormGroup, keyFor: string) {
    let paymentMode = form.get('payment_mode').value;
    if (paymentMode != 'paid_by_employee') {
      form.patchValue({
        employee:null,
        is_employee_paid: false
      })
    }
  }

  onChangeTokenChargeInvoice(form: FormGroup) {
    let includeInInvoice = form.get('include_in_invoice').value;
    if (includeInInvoice == '0') {
      form.get('charge_amount').setValue(form.get('token_amount').value);
    }else{
      form.get('charge_amount').setValue(0.00);
    }
  }

  onChangeTokenAmount(form: FormGroup) {
    this.onChangeTokenChargeInvoice(form);
  }

  checkWhichSecitionsAreValid() {
    if (this.typeOfMovement == 'Import') {
      if (this.scopeOfWork == 'Pullout') {
        this.showPullout = true;
        this.showDeposit = false;
        this.showVgm = false;
        this.getPullOutDetails();
      } else if (this.scopeOfWork == 'Deposit') {
        this.showPullout = false;
        this.showDeposit = true;
        this.showVgm = false;
        this.getDepositDetails()
      }
      else if (this.scopeOfWork == 'Live Loading') {
        this.showPullout = true;
        this.showDeposit = true;
        this.getPullOutDetails();
        this.getDepositDetails();
        this.showVgm = false;
      }
    }
    if (this.typeOfMovement == 'Export') {
      if (this.scopeOfWork == 'Pullout') {
        this.showPullout = true;
        this.showDeposit = false;
        this.showVgm = false;
        this.getPullOutDetails();
      } else if (this.scopeOfWork == 'Deposit') {
        this.showPullout = false;
        this.showDeposit = true;
        this.showVgm = true;
        this.getVgmDetails();
        this.getDepositDetails();
      }
      else if (this.scopeOfWork == 'Live Loading') {
        this.showPullout = true;
        this.showDeposit = true;
        this.showVgm = true;
        this.getVgmDetails();
        this.getDepositDetails();
        this.getPullOutDetails();
      }
    }

  }

  getPullOutDetails() {
    this.pullOutDetails={}
    this._newTripV2Service.getPullOutToken(this.tripId).subscribe((response) => {
      if (response['result']) {
        this.pullOutDetails = response['result'];
        this.editPatchPullOut();
      }
    })
    this.getHistory('pullout');
  }

  editPatchPullOut() {
    let copyOfPullOutDetails = cloneDeep(this.pullOutDetails);
    copyOfPullOutDetails['token_date']= moment(moment(new Date(copyOfPullOutDetails['token_date'])).tz(localStorage.getItem('timezone')))
    if (copyOfPullOutDetails['is_employee_paid']) {
      copyOfPullOutDetails['payment_mode'] = 'paid_by_employee'
      this.initialValues.pullOutPaymentMode = { label: 'Paid By Employee', value: '' }
    } else {
      if (isValidValue(copyOfPullOutDetails['payment_mode'])) {
        this.initialValues.pullOutPaymentMode = { label: copyOfPullOutDetails['payment_mode']['name'], value: '' }
        copyOfPullOutDetails['payment_mode'] = copyOfPullOutDetails['payment_mode']['id']
      }
    }
    if (isValidValue(copyOfPullOutDetails['employee'])) {
      this.initialValues.pullOutEmployee = { label: copyOfPullOutDetails['employee']['display_name'], value: '' }
      copyOfPullOutDetails['employee'] = copyOfPullOutDetails['employee']['id']
    }
    if (isValidValue(copyOfPullOutDetails['terminal'])) {
      this.initialValues.pullOutTerminal = { label: copyOfPullOutDetails['terminal']['label'], value: '' }
      copyOfPullOutDetails['terminal'] = copyOfPullOutDetails['terminal']['id']
    }
    if (isValidValue(copyOfPullOutDetails['token_responsibility'])) {
      let tokenResponsibility = this.responsibilityList.find(responsibility => responsibility.value == copyOfPullOutDetails['token_responsibility']);
      if (tokenResponsibility) {
        this.initialValues.pullOutResponsibility = { label: tokenResponsibility.label, value: '' }
      }
    }
    if (isValidValue(copyOfPullOutDetails['include_in_invoice'])) {
      let includeInInvoice = this.includeTokenChargeList.find(responsibility => responsibility.value == copyOfPullOutDetails['include_in_invoice']);
      if (includeInInvoice) {
        this.initialValues.pullOutIncludeInInvoice = { label: includeInInvoice.label, value: '' }
      }
    }
    if (isValidValue(copyOfPullOutDetails['token_slot'])) {
      let slotValue = this.timeSlots.find(slot => slot.value == copyOfPullOutDetails['token_slot'])
      if (slotValue) {
        this.initialValues.pullOutSlot = { label: slotValue.label, value: '' }
      }

    }
    this.tokenAndVgmForm.get('pullout').setValue(true);
    this.tokenAndVgmForm.get('pulloutform').patchValue(copyOfPullOutDetails)
  }
  getDepositDetails() {
    this.depositDetails = {};
    this._newTripV2Service.getDepositToken(this.tripId).subscribe((response) => {
      if (response['result']) {
        this.depositDetails = response['result'];
        this.editPatchDeposit();
      }
    })
    this.getHistory('deposit');
  }

  editPatchDeposit() {
    let copyOfDepositDetails = cloneDeep(this.depositDetails);
    copyOfDepositDetails['token_date']= moment(moment(new Date(copyOfDepositDetails['token_date'])).tz(localStorage.getItem('timezone')))
    if (copyOfDepositDetails['is_employee_paid']) {
      copyOfDepositDetails['payment_mode'] = 'paid_by_employee'
      this.initialValues.depositPaymentMode = { label: 'Paid By Employee', value: '' }
    } else {
      if (isValidValue(copyOfDepositDetails['payment_mode'])) {
        this.initialValues.depositPaymentMode = { label: copyOfDepositDetails['payment_mode']['name'], value: '' }
        copyOfDepositDetails['payment_mode'] = copyOfDepositDetails['payment_mode']['id']
      }
    }
    if (isValidValue(copyOfDepositDetails['employee'])) {
      this.initialValues.depositEmployee = { label: copyOfDepositDetails['employee']['display_name'], value: '' }
      copyOfDepositDetails['employee'] = copyOfDepositDetails['employee']['id']
    }
    if (isValidValue(copyOfDepositDetails['terminal'])) {
      this.initialValues.depositTerminal = { label: copyOfDepositDetails['terminal']['label'], value: '' }
      copyOfDepositDetails['terminal'] = copyOfDepositDetails['terminal']['id']
    }
    if (isValidValue(copyOfDepositDetails['token_responsibility'])) {
      let tokenResponsibility = this.responsibilityList.find(responsibility => responsibility.value == copyOfDepositDetails['token_responsibility']);
      if (tokenResponsibility) {
        this.initialValues.depositResponsibility = { label: tokenResponsibility.label, value: '' }
      }
    }
    if (isValidValue(copyOfDepositDetails['include_in_invoice'])) {
      let includeInInvoice = this.includeTokenChargeList.find(responsibility => responsibility.value == copyOfDepositDetails['include_in_invoice']);
      if (includeInInvoice) {
        this.initialValues.depositIncludeInInvoice = { label: includeInInvoice.label, value: '' }
      }
    }
    if (isValidValue(copyOfDepositDetails['token_slot'])) {
      let slotValue = this.timeSlots.find(slot => slot.value == copyOfDepositDetails['token_slot'])
      if (slotValue) {
        this.initialValues.depositSlot = { label: slotValue.label, value: '' }
      }

    }
    this.tokenAndVgmForm.get('deposit').setValue(true);
    this.tokenAndVgmForm.get('depositform').patchValue(copyOfDepositDetails)
  }

  getVgmDetails() {
    this._newTripV2Service.getVGM(this.tripId).subscribe((response) => {
      if (response['result']) {
        this.vgmDetails = cloneDeep(response['result']);
        this.editPatchVgm();
      }
    })
  }

  editPatchVgm(){
    this.isVgmEdit=this.vgmDetails.some(vgm=>vgm.is_editable==false)
    let copyofVgmDetails = cloneDeep(this.vgmDetails);
    copyofVgmDetails.forEach((vgm) => {
      if (vgm['is_employee_paid']) {
        vgm['payment_mode'] = 'paid_by_employee'
      } else {
        if (isValidValue(vgm['payment_mode'])) {
          vgm['payment_mode'] = vgm['payment_mode']['id']
        }
      }
      if (isValidValue(vgm['employee'])) {
        vgm['employee'] = vgm['employee']['id']
      }
    })
    this.buildVGM(copyofVgmDetails);
    this.vgmDetails.forEach((vgm, index) => {
      if (vgm['is_employee_paid']) {
        vgm['payment_mode'] = 'paid_by_employee'
        this.initialValues.vgmPaymentMode[index] = { label: 'Paid By Employee', value: '' }
      } else {
        if (isValidValue(vgm['payment_mode'])) {
          this.initialValues.vgmPaymentMode[index] = { label: vgm['payment_mode']['name'], value: '' }
        }
      }
      if (isValidValue(vgm['vgm_responsibility'])) {
        let tokenResponsibility = this.responsibilityList.find(responsibility => responsibility.value == vgm['vgm_responsibility']);
        if (tokenResponsibility) {
          this.initialValues.vgmresponsibility[index] = { label: tokenResponsibility.label, value: '' }
        }
      }
      if (isValidValue(vgm['include_in_invoice'])) {
        let includeInInvoice = this.includeTokenChargeList.find(responsibility => responsibility.value == vgm['include_in_invoice']);
        if (includeInInvoice) {
          this.initialValues.vgmIncludeInInvoice[index] = { label: includeInInvoice.label, value: '' }
        }
      }
      if (isValidValue(vgm['employee'])) {
        this.initialValues.vgmEmployee[index] = { label: vgm['employee']['display_name'], value: '' }
      }

    })
    this.tokenAndVgmForm.get('vgm').setValue(true);
  }

  onChangePullOut() {
    let pullOut = this.tokenAndVgmForm.get('pullout').value;
    if (pullOut) {
      this.tokenAndVgmForm.get('pulloutform').patchValue({
        id: null,
        token_no: '',
        reused_token: false,
        token_date:moment(new Date(this.tripStartDate)).tz(localStorage.getItem('timezone')),
        token_slot: this.scheduleTimeSloot?.value,
        terminal: null,
        token_responsibility: '0',
        payment_mode: null,
        include_in_invoice: '1',
        token_amount: 0.00,
        charge_amount: 0.00,
        employee: null,
        is_employee_paid: false,
        documents: [[]]
      })
      this.postPullOutDetails()
    } else {
      //changing pullout for removing blink effect on clicking checkbox
      this.tokenAndVgmForm.get('pullout').setValue(true);
      this.clearCheckBox('pullout', this.tokenAndVgmForm.get('pulloutform').get('id').value)
    }
  }

  onDepositChange() {
    let deposit = this.tokenAndVgmForm.get('deposit').value;
    if (deposit) {
      this.tokenAndVgmForm.get('depositform').patchValue({
        id: null,
        token_no: '',
        reused_token: false,
        token_date: moment(new Date(this.tripStartDate)).tz(localStorage.getItem('timezone')),
        token_slot: this.scheduleTimeSloot?.value,
        terminal: null,
        token_responsibility: '0',
        payment_mode: null,
        include_in_invoice: '1',
        token_amount: 0.00,
        charge_amount: 0.00,
        employee: null,
        is_employee_paid: false,
        documents: [[]]
      })
      this.postDepositDetails();
    } else {
      //changing pullout for removing blink effect on clicking checkbox
      this.tokenAndVgmForm.get('deposit').setValue(true)
      this.clearCheckBox('deposit', this.tokenAndVgmForm.get('depositform').get('id').value)
    }

  }

  onVgmChange() {
    let vgm = this.tokenAndVgmForm.get('vgm').value;
    if (vgm) {
      this.buildVGM(['']);
      this.postVgmDetails();
    }else{
      this.tokenAndVgmForm.get('vgm').setValue(true); // for blinking effect
      this.clearVgmCheckBox();
    }
  }

  postVgmDetails() {
    let vgmForm = cloneDeep(this.tokenAndVgmForm.get('vgmForm').value);
    vgmForm.forEach((vgm) => {
      vgm['documents'] = []
    })
    this._newTripV2Service.postVGM(this.tripId, vgmForm).subscribe((response) => {
      this.getVgmDetails();
    })
  }

  postPullOutDetails() {
    let pullOutForm = cloneDeep(this.tokenAndVgmForm.get('pulloutform').value);
    pullOutForm['documents'] = []
    pullOutForm['token_date'] = changeDateTimeToServerFormat(pullOutForm['token_date']);
    this._newTripV2Service.postPullOutToken(this.tripId, pullOutForm).subscribe((response) => {
      this.getPullOutDetails();
    })
  }

  postDepositDetails() {
    let depositForm = cloneDeep(this.tokenAndVgmForm.get('depositform').value);
    depositForm['token_date'] = changeDateTimeToServerFormat(depositForm['token_date']);
    depositForm['documents'] = []
    this._newTripV2Service.postDepositToken(this.tripId, depositForm).subscribe((response) => {
      this.getDepositDetails();
    })
  }

  updatePullOutDetails() {
    let pullOutForm = cloneDeep(this.tokenAndVgmForm.get('pulloutform').value);
    pullOutForm['documents'] = pullOutForm['documents'].length ? pullOutForm['documents'].map(doc => doc.id) : []
    pullOutForm['token_date'] = changeDateTimeToServerFormat(pullOutForm['token_date']);
    if (pullOutForm['payment_mode'] == 'paid_by_employee') {
      pullOutForm['payment_mode'] = null;
      pullOutForm['is_employee_paid'] = true;

    }
    this._newTripV2Service.updatePullOutToken(this.tripId, pullOutForm['id'], pullOutForm).subscribe((response) => {
      this.tokenAndVgmForm.get('is_edit_pullout').setValue(false);
      this._tripDataService.upDateProfitLoss(true)
      this._tripDataService.upDateDocument(true)
      this.getPullOutDetails();
    })
  }

  updateVgmDetails() {
    this.vgmErrorMsg=''
    let vgmform = cloneDeep(this.tokenAndVgmForm.get('vgmForm').value);
    vgmform.forEach((vgm) => {
      vgm['documents'] = vgm['documents']?.length ? vgm['documents'].map(doc => doc.id) : []
      vgm['vgm_date'] = changeDateToServerFormat(vgm['vgm_date']);
      if (vgm['payment_mode'] == 'paid_by_employee') {
        vgm['payment_mode'] = null;
        vgm['is_employee_paid'] = true;
      }
    })
    this._newTripV2Service.updateVGM(this.tripId, vgmform).subscribe((response) => {
      this.tokenAndVgmForm.get('is_edit_vgm').setValue(false);
      this._tripDataService.upDateProfitLoss(true)
      this._tripDataService.upDateDocument(true)
      this.getVgmDetails();
    },error=>{
      this.vgmErrorMsg=error.error.message
    })
  }

  updateDepositDetails() {
    let depositForm = cloneDeep(this.tokenAndVgmForm.get('depositform').value);
    depositForm['documents'] = depositForm['documents'].length ? depositForm['documents'].map(doc => doc.id) : []
    depositForm['token_date'] = changeDateTimeToServerFormat(depositForm['token_date']);
    if (depositForm['payment_mode'] == 'paid_by_employee') {
      depositForm['payment_mode'] = null;
      depositForm['is_employee_paid'] = true;

    }
    this._newTripV2Service.updateDepositToken(this.tripId, depositForm['id'], depositForm).subscribe((response) => {
      this.tokenAndVgmForm.get('is_edit_deposit').setValue(false);
      this._tripDataService.upDateProfitLoss(true)
      this._tripDataService.upDateDocument(true)
      this.getDepositDetails();
    })
  }

  clearCheckBox(type, id) {
    const dialogRef = this.dialog.open(DeleteAlertComponent, {
      data: {
        message: 'Are you sure you want to remove this block? This will delete all associated data.'
      },
      width: '200px',
      maxWidth: '90%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((resp: boolean) => {
      if (resp) {
        this._newTripV2Service.deleteToken(this.tripId, id, type).subscribe((response) => {
          if (type == 'pullout') {
            //changing pullout for removing blink effect on clicking checkbox
            this.tokenAndVgmForm.get('pullout').setValue(false);
            this.getPullOutDetails();
          }
          if (type == 'deposit') {
            this.tokenAndVgmForm.get('deposit').setValue(false);
            this.getDepositDetails();
          }
          this._tripDataService.upDateProfitLoss(true)
          this._tripDataService.upDateDocument(true)
        });
      } else {
        if (type == 'pullout') {
          this.tokenAndVgmForm.get('pullout').setValue(true);
        }

        if (type == 'deposit') {
          this.tokenAndVgmForm.get('deposit').setValue(true);
        }
      }
      dialogRefSub.unsubscribe();
    });
  }

  clearVgmCheckBox() {
    const dialogRef = this.dialog.open(DeleteAlertComponent, {
      data: {
        message: 'Are you sure you want to remove this block? This will delete all associated data.'
      },
      width: '200px',
      maxWidth: '90%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((resp: boolean) => {
      if (resp) {
        this.tokenAndVgmForm.get('vgm').setValue(false)//for blinking effect
        this._newTripV2Service.deleteVGM(this.tripId).subscribe((response) => {
          this.getVgmDetails();
          this._tripDataService.upDateProfitLoss(true)
          this._tripDataService.upDateDocument(true)
        });
      } else {
        this.tokenAndVgmForm.get('vgm').setValue(true);
      }
      dialogRefSub.unsubscribe();
    });
  }

  cancelToken(type, id) {
    const dialogRef = this.dialog.open(CancelTokenPupupComponent, {
      data: {
        message: 'Are you sure you want to cancel token?'
      },
      width: '450px',
      maxWidth: '90%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((resp: boolean) => {
      if (resp) {
        this._newTripV2Service.cancelToken(this.tripId, id, type,resp).subscribe((response) => {
          if (type == 'pullout') {
            this.tokenAndVgmForm.get('is_edit_pullout').setValue(false);
            this.tokenAndVgmForm.get('pullout').setValue(false);
            this.getPullOutDetails()
          }
          if (type == 'deposit') {
            this.tokenAndVgmForm.get('is_edit_deposit').setValue(false);
            this.tokenAndVgmForm.get('deposit').setValue(false);
            this.getDepositDetails();
          }
          this._tripDataService.upDateProfitLoss(true)
          this._tripDataService.upDateDocument(true)
        });
      }
      dialogRefSub.unsubscribe();
    });
  }

  getHistory(key) {
   
   this._newTripV2Service.getTokenHistory(this.tripId, key).subscribe((response) => {
     if (key == 'pullout') {
       this.pullOutHistory=[]
       this.pullOutHistory = response['result'];
     }
     if (key == 'deposit') {    
        this.depositHistory=[]
       this.depositHistory = response['result'];
     }
   })
  }

  onChangeVgmChargeInvoice(form: FormGroup) {
    let includeInInvoice = form.get('include_in_invoice').value;
    if (includeInInvoice == '0') {
      form.get('charge_amount').setValue(form.get('vgm_amount').value);
    }else{
      form.get('charge_amount').setValue(0.00);
    }
  }



   dateChange(date) {
      if(date){
        return moment(date).tz(localStorage.getItem('timezone')).format('llll')
      }
      return '-'
    }

     onTokenChange(form:FormGroup,keyFor:string){
        this._newTripV2Service.getUniqueTokenVerification(form.get('token_no').value).subscribe((res)=>{
          if(isValidValue(res['result'])){
            const tripIds=res['result']['cancelled_trips']
            const tripIdInString=tripIds.join(',')
            const isCancelled=res['result']['is_cancelled']
            let message='This token already exists. Do you still want to reuse the same?'
            if(isCancelled){
              message=`Please Note: This token number has been cancelled for the following job${tripIds.length==1?'':'s'}:${tripIdInString}.
                Do you still want to reuse this token number?`
            }
            const dialogRef = this.dialog.open(DeleteAlertComponent, {
              data: {
                message: message
              },
              width: '200px',
              maxWidth: '90%',
              closeOnNavigation: true,
              disableClose: true,
              autoFocus: false
            });
            let dialogRefSub = dialogRef.closed.subscribe((resp: boolean) => {          
              if (resp) {
                let includeInvoiceLable = this.includeTokenChargeList.find(ele=>Number(ele.value)===Number(res['result']['include_in_invoice']))
                let tokenReponsilityLable = this.responsibilityList.find(ele=>Number(ele.value)===Number(res['result']['token_responsibility']))
                let tokenSlotLabel = this.timeSlots.find(ele=>ele.value===res['result']['token_slot'])
                form.patchValue({
                  reused_token: true,
                  token_no :  res['result']['token_no'],
                  include_in_invoice : res['result']['include_in_invoice'],
                  token_date : moment(new Date(res['result']['token_date'])).tz(localStorage.getItem('timezone')) ,
                  token_responsibility : res['result']['token_responsibility'],
                  token_slot : res['result']['token_slot'],
                  terminal:res['result'].terminal?res['result'].terminal.id:null,

                })
                if(keyFor=='pullout'){
                  this.initialValues.pullOutResponsibility = tokenReponsilityLable
                  this.initialValues.pullOutIncludeInInvoice = includeInvoiceLable
                  this.initialValues.pullOutSlot = tokenSlotLabel
                  if(res['result']?.terminal)
                  this.initialValues.pullOutTerminal = {label:res['result']['terminal']['label'],value:''}
                }
                if(keyFor=='deposit'){  
                  this.initialValues.depositResponsibility = tokenReponsilityLable
                  this.initialValues.depositIncludeInInvoice = includeInvoiceLable
                  this.initialValues.depositSlot = tokenSlotLabel
                  if(res['result']?.terminal)
                  this.initialValues.depositTerminal = {label:res['result']['terminal']['label'],value:''}

                }
              }else{
                form.get('token_no').setValue('')
    
              }
              dialogRefSub.unsubscribe();
            });
          }
        })
      }

}


