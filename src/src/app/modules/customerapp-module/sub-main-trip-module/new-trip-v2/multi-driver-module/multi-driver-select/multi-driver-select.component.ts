import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, } from '@angular/core';
import { FormControl } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CompanyTripGetApiService } from 'src/app/modules/customerapp-module/revenue-module/trip-module/company-vehicle-module/company-trip-class/company-trip-service.service';

@Component({
  selector: 'app-multi-driver-select',
  templateUrl: './multi-driver-select.component.html',
  styleUrls: ['./multi-driver-select.component.scss']
})
export class MultiDriverSelectComponent implements OnInit, OnDestroy {
  @Input() driverControl = new FormControl();
  @Output() driverId = new EventEmitter();
  @Output() selectedDriverList = new EventEmitter();
  @Input() driverList = [];
  @Input() isDriverAdd = false;
  $subscriptionList: Subscription[] = []
  isDriverDropopen = false;
  drivers = new Subject()
  formattedDriverNames = ''
  copyofDriverList=[]
  @Input() boxDesign=false


  dropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'emp_name_id',
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    itemsShowLimit: 0,
    enableCheckAll: true,
    allowSearchFilter: true,
    defaultOpen: false,


  };
  constructor(private _companyTripGetApiService: CompanyTripGetApiService,) { }
  ngOnDestroy(): void {
    this.$subscriptionList.forEach(sub => {
      sub.unsubscribe();
    })
  }

  ngOnInit(): void {
    this.getDriverList();
    this.copyofDriverList=cloneDeep(this.driverList)
    if(this.driverControl.value&&this.driverControl.value.length>0){
      this.updateFormattedDriverNames();
    }
    if (!this.isDriverAdd) {
      this.$subscriptionList.push(this.driverControl.valueChanges.pipe(debounceTime(500)).subscribe(data => {
        if (data?.length) {
          this.driverId.emit(data[0].id);
          this.arrangeDriverList()
        }
        this.selectedDriverList.emit(this.driverControl.value)
        this.updateFormattedDriverNames();
      }));
    } else {
      this.$subscriptionList.push(this.drivers.pipe(debounceTime(500)).subscribe(resp => {
        this.arrangeDriverList()
        this.selectedDriverList.emit(this.driverControl.value)
        this.updateFormattedDriverNames();
      }))
    }
  }

  dataSelected(e) {
    this.drivers.next(e)
  }

  allDriversSelected(e) {
    this.selectedDriverList.emit(e)
  }


  addNewDriver() {
    this.isDriverDropopen = false;
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'emp_name_id',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 0,
      enableCheckAll: true,
      allowSearchFilter: true,
      defaultOpen: true
    };
    setTimeout(() => {
      this.isDriverDropopen = true;
    }, 10);
  }

  arrangeDriverList() {
    if (this.driverControl.value) {
      let filteredA = this.driverList.filter(itemA => !this.driverControl.value.find(itemB => itemB.id === itemA.id));
      let modifiedA = this.driverControl.value.concat(filteredA)
      modifiedA.forEach(modifiedDriver => {
        const driverObj=this.driverList.find(driver=>driver['id']==modifiedDriver['id'])
        if(driverObj){
          modifiedDriver['emp_name_id']=driverObj['emp_name_id']
        }
      });
      this.driverList = modifiedA
    }

  }

  getDriverList() {
    this._companyTripGetApiService.getDrivers(employeeList => {
      this.driverList = employeeList;
      this.copyofDriverList=cloneDeep(this.driverList)
      this.arrangeDriverList()
    });
  }

  updateFormattedDriverNames() {
    const drivers = this.driverControl?.value || [];
  this.formattedDriverNames = drivers
    .map(driver => this.getDriverNameById(driver?.id))
    .filter(name => !!name)
    .join(', ');
  }

  getDriverNameById(id: string) {
    const driverObj = this.copyofDriverList.find(driver => driver.id === id);
    return driverObj ? driverObj['first_name'] : '';
  }

}