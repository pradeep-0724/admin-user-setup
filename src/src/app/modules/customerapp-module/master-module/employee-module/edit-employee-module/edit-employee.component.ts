import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditEmployeeService } from './edit-employee-services/edit-employee-service';
import { Subscription } from 'rxjs';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { EmployeeService } from '../../../api-services/master-module-services/employee-service/employee-service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html'
})

export class EditEmployeeComponent implements OnInit, OnDestroy {
  isInformationSaved: Boolean = false;
  isAddressSaved: Boolean = false;
  isDocumentsSaved: Boolean = false;
  detailSubscription: Subscription;
  addressSubscription: Subscription;
  bankSubscription: Subscription;
  documentsSubscription: Subscription;
  dataReceived: Boolean = false;
  employeeData: any = {};
  employee_id: any;
  prefixUrl = '';
  selectedTab = ''
  goThroughDetais = {
    show: false,
    url: "https://demo.arcade.software/B8JsDS1QdpjjX5oUfQQg?embed"
  }
  // videoUrl ="https://ts-pub-directory.s3.ap-south-1.amazonaws.com/Employee.mp4";
  constructor(
    private _router: ActivatedRoute,
    private _editEmployeeService: EditEmployeeService,
    private scrollToTop: ScrollToTop,
    public _employeeService: EmployeeService,
    private _prefixUrl: PrefixUrlService,

  ) { }

  ngOnInit() {
    this.prefixUrl = this._prefixUrl.getprefixUrl();
    this._router.params.subscribe(params => {
      this.employee_id = params.employee_id;
      if (this.employee_id) {
        this.getEmployeeDetails();      }
      if (!this.employee_id) {
        this.initializeTimeline();
      }
    });
  }

  
 openGothrough() {
  this.goThroughDetais.show=true;
}


  onActivate(_event: any): void {
    let url = location.href;
    if (url.includes('information')) {
      this.selectedTab = 'information'
    }
    if (url.includes('address')) {
      this.selectedTab = 'address'
    }
    if (url.includes('document')) {
      this.selectedTab = 'document'
    }
    if (url.includes('bank')) {
      this.selectedTab = 'bank'
    }
    this.scrollToTop.scrollToTop();
  }

  initializeTimeline() {
    this._employeeService.addTimeline.isAddressSaved = false;
    this._employeeService.addTimeline.isDocumentsSaved = false;
    this._employeeService.addTimeline.isInformationSaved = false;
    this._employeeService.addTimeline.isBankSaved = false;
  }

  getEmployeeDetails() {
    this._editEmployeeService.getAllEditDetails(this.employee_id).subscribe((response) => {
      if (response !== undefined) {
        this.dataReceived = true;
        this.employeeData = response;
        if (this.employeeData.hasOwnProperty("detail") && this.employeeData.detail.hasOwnProperty("id")) {
          this._employeeService.addTimeline.isInformationSaved = true;
        } else {
          this.detailSubscription = this._editEmployeeService.editEmployeeDone.subscribe(data => {
            this._employeeService.addTimeline.isInformationSaved = data;
          });
        }
        if (this.employeeData.hasOwnProperty("address") && this.employeeData.address.data.length > 0) {
          const addrCheck = this.isAddressEmpty(this.employeeData.address);
          this._employeeService.addTimeline.isAddressSaved = addrCheck ? true : false;
        } else {
          this.addressSubscription = this._editEmployeeService.editEmployeeAdd.subscribe(data => {
            this._employeeService.addTimeline.isAddressSaved = data;
          });
        }
        if (this.employeeData.hasOwnProperty("documents") && this.employeeData.documents.length > 0) {
          const docCheck = this.isDocumentEmpty(this.employeeData.documents);
          this._employeeService.addTimeline.isDocumentsSaved = docCheck ? true : false;
        } else {
          this.documentsSubscription = this._editEmployeeService.editEmployeeDocument.subscribe(data => {
            this._employeeService.addTimeline.isDocumentsSaved = data;
          });
        }
        if (this.employeeData.hasOwnProperty("bank_details") && isValidValue(this.employeeData.bank_details)) {
          const docCheck = this.employeeData.bank_details['account_holder_name'] ? true : false
          this._employeeService.addTimeline.isBankSaved = docCheck;
        } else {
          this.bankSubscription = this._editEmployeeService.editEmployeeDone.subscribe(data => {
            this._employeeService.addTimeline.isBankSaved = data;
          });
        }
      }
    });
  }

  isDetailEmpty(detail) {
    // For details tab check only mandatory fields
    // First name, Last name and contact
    let first_name = (detail.first_name) ? true : false;
    let last_name = (detail.last_name) ? true : false;
    let contact = (detail.contact) ? true : false;
    return first_name || last_name || contact;
  }

  isDocumentEmpty(doc) {
    let filterDoc = doc.filter(dc => {
      let number = (dc.number) ? true : false;
      let expiry_date = (dc.expiry_date) ? true : false;
      let files = (dc.files.length > 0) ? true : false;

      return  number ||
              expiry_date || files
    });
    return filterDoc.length > 0 ? true : false;
  }

  isAddressEmpty(addr) {
    let filterAddr = addr.data.filter(ad => {
      let address_line_1 = (ad.address_line_1) ? true : false;
      let city = (ad.city) ? true : false;
      let district = (ad.district) ? true : false;
      let pincode = (ad.pincode) ? true : false;
      let state = (ad.state) ? true : false;
      let street = (ad.street) ? true : false;
      return address_line_1 ||
        city ||
        district ||
        pincode ||
        state ||
        street;
    });
    return filterAddr.length > 0 || addr.address_document.length > 0 ? true : false;
  }

  ngOnDestroy() {
    this._editEmployeeService.editEmployeeDone.next(false);
    this._editEmployeeService.editEmployeeAdd.next(false);
    this._editEmployeeService.editEmployeeDocument.next(false);
    this._editEmployeeService.editEmployeeBank.next(false);
    try {
      if (this.detailSubscription)
        this.detailSubscription.unsubscribe();
      if (this.addressSubscription)
        this.addressSubscription.unsubscribe();
      if (this.documentsSubscription)
        this.documentsSubscription.unsubscribe();
      if (this.bankSubscription) {
        this.bankSubscription.unsubscribe();
      }
    } catch (err) {
      console.error(err);
    }
  }
}
