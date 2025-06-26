import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray, AbstractControl, UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { ErrorList } from 'src/app/core/constants/error-list';
import { UserManagementService } from '../../../../customerapp-module/api-services/orgainzation-setting-module-services/user-management-service/user-management-service.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';


@Component({
  selector: 'app-roles-responsibilities',
  templateUrl: './roles-responsibilities.component.html',
  styleUrls: ['./roles-responsibilities.component.scss']
})
export class RolesResponsibilitiesComponent implements OnInit {
  apiError: string = "";
  userRolesAndResponsibilities: UntypedFormGroup;
  roleId = 'null';
  cloneId = 'null'
  typeOfSecreen = "Add Role";
  roleDetails;
  errorHeaderMessage = new ErrorList().headerMessage;
  globalFormErrorList: any = [];
  possibleErrors = new ErrorList().possibleErrors;
  dashBoard = [];
  onBoarding = []
  trip = [];
  income = [];
  expenses = [];
  payments = [];
  inventory = [];
  reportItems = []
  othersItem = []
  preFixUrl = '';
  parentAccess = {
    dashboard : false,
    onboarding : false,
    trip : false,
    income : false,
    expenses : false,
    payments : false,
    others : false,
    reports : false,
  };


  constructor(
    private _fb: UntypedFormBuilder,
    private _route: Router,
    private parm: ActivatedRoute,
    private _userManagementService: UserManagementService,
    private _preFixUrl: PrefixUrlService,
    private _scrollToTop: ScrollToTop,
    private apiHandler:ApiHandlerService
  ) { }

  ngOnInit() {
    this.buildForm();
    this.preFixUrl = this._preFixUrl.getprefixUrl();
    this.parm.params.subscribe(id => {
      if (id['id'] !== undefined) {
        this.roleId = id['id'];
        this.typeOfSecreen = "Edit Role"
        this.getRoleDetails(this.roleId)
      } {
        this.cloneId = this._userManagementService.getCloneID();
        if (this.cloneId !== 'null') {
          this.getRoleDetails(this.cloneId)
          this._userManagementService.setCloneID('null');
        }
      }
      if (this.roleId == 'null' && this.cloneId == 'null') {
        this.getData();
      }
    })

  }

  buildForm() {
    this.userRolesAndResponsibilities = this._fb.group({
      role: ['', Validators.required],
      description: [''],
    });

  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
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



  setFormGlobalErrors() {
    this.globalFormErrorList = [];
    let errorIds = Object.keys(this.possibleErrors);
    console.log(errorIds);
    for (let prop of errorIds) {
      const error = this.possibleErrors[prop];
      if (error.status == true) {
        this.globalFormErrorList.push(error.message);
      }
    }
  }

  save() {
    let form = this.userRolesAndResponsibilities
    let name=''
    name = form.get('role').value ?form.get('role').value:''
    let payLoad = {
      name: name.trim(),
      description: form.get('description').value,
      permissions: {
        income: this.income,
        onboarding: this.onBoarding,
        master: this.onBoarding,
        reports: this.reportItems,
        others: this.othersItem,
        trip:this.trip,
        expenses:this.expenses,
        payments:this.payments,
        dashboard:this.dashBoard,
        inventory:this.inventory,

      }
    }

    if (form.valid) {
      if (this.roleId !== 'null') {
        this.apiHandler.handleRequest(this._userManagementService.putRoles(payLoad, this.roleId),'Role details updated successfully!').subscribe({
          next:(resp)=>{
            this._route.navigateByUrl(this.preFixUrl + "/organization_setting/user_management/user-roles-responsibilities");
          },
          error:(err)=>{
            this._scrollToTop.scrollToTop();
          if (err.error.message) {
            this.apiError = err.error.message
          }
          }
        })
      } else {
        this.apiHandler.handleRequest( this._userManagementService.postRoles(payLoad),'Role details added successfully!').subscribe({
          next:(resp)=>{
            this._route.navigateByUrl(this.preFixUrl + "/organization_setting/user_management/user-roles-responsibilities");
          },
          error:(err)=>{
            this._scrollToTop.scrollToTop();
          if (err.error.message) {
            this.apiError = err.error.message
          }
          }
        })
      }
    } else {
      this._scrollToTop.scrollToTop();
      this.setAsTouched(form);
    }

  }



  patchForm(dataFormat) {
    let form = this.userRolesAndResponsibilities;
    if (this.cloneId == 'null') {
      form.patchValue({
        role: dataFormat['name'],
        description: dataFormat['description']
      })
    }
  }



  getRoleDetails(id) {
    this._userManagementService.getRolesDetails(id).subscribe(result => {
      this.roleDetails = result.result['permissions'];
      this.income = this.roleDetails['income'];
      this.onBoarding = this.roleDetails['onboarding'];
      this.reportItems = this.roleDetails['reports'];
      this.othersItem = this.roleDetails['others'];
      this.trip = this.roleDetails['trip'];
      this.expenses = this.roleDetails['expenses'];
      this.payments = this.roleDetails['payments'];
      this.dashBoard = this.roleDetails['dashboard'];
      this.inventory = this.roleDetails['inventory'];
      this.checkIsAllSelected({},this.othersItem,'others');
      this.checkIsAllSelected({},this.onBoarding,'onboarding');
      this.checkIsAllSelected({},this.trip,'trip');
      this.checkIsAllSelected({},this.income,'income');
      this.checkIsAllSelected({},this.expenses,'expenses');
      this.checkIsAllSelected({},this.payments,'payments');
      this.checkIsAllSelected({},this.reportItems,'reports');
      this.patchForm(result.result)
    })
  }

  getData() {
    this._userManagementService.getRolesDetailsStructure(true).subscribe(result => {
      this.roleDetails = result.result;
      this.income = this.roleDetails['income'];
      this.onBoarding = this.roleDetails['onboarding'];
      this.reportItems = this.roleDetails['reports'];
      this.othersItem = this.roleDetails['others'];
      this.trip = this.roleDetails['trip'];
      this.expenses = this.roleDetails['expenses'];
      this.payments = this.roleDetails['payments'];
      // this.dashBoard = this.roleDetails['dashboard'];
      this.inventory = this.roleDetails['inventory'];
    })
  }


  clearAll(itemsArray) {
    itemsArray.forEach(item => {
      if (item['item'].length > 0) {
        item['item'].forEach(arrayItem => {
          arrayItem['add'] = false;
          arrayItem['allAccess'] = false;
          arrayItem['edit'] = false;
          arrayItem['delete'] = false;
          arrayItem['view'] = false;
        })
      } else {
        item['add'] = false;
        item['allAccess'] = false;
        item['edit'] = false;
        item['view'] = false;
        item['delete'] = false;
      }
    });
  }

  parentBoxesChecked(data: any[],event,key:string){
    data.forEach(element => {
      if(element.item.length>0){
        element.item.forEach(sub => {
          if(event.target.checked){
            sub['view'] = true;
            this.parentAccess[key] = true;
          }else{
            sub.view = false;
            this.parentAccess[key] = false;
          }
          this.selectAll(sub,event);
        });
      }else{
        if(event.target.checked){
          element['allAccess'] = true;
          this.parentAccess[key] = true;
        }else{
          element['allAccess'] = false;
          this.parentAccess[key] = false;
        }
        this.selectAll(element,event);
      }
    });    
  }

  selectAll(item, e) {
    if (e.target.checked) {
      item['add'] = true;
      item['edit'] = true;
      item['view'] = true;
      item['delete'] = true;
      item['allAccess'] = true;
    } else {
      item['add'] = false;
      item['edit'] = false;
      item['view'] = false;
      item['delete'] = false;
      item['allAccess'] = false;
    }
  }

  checkIsAllSelected(event,data:any[],key:string){    
    let isAllSelected : boolean = false;
    if(key == 'reports' || key== 'dashboard'){
      let allViewSelected : boolean[] = [];
      data.forEach((element,index)=>{ 
        if (element.item && element.item.length > 0) {   
          element.item.forEach((sub)=>{            
            allViewSelected.push(sub.view)
          })
        }
        else{
          allViewSelected.push(element.view)
        }                       
        isAllSelected = allViewSelected.every((ele)=>ele==true);        
      });
    }else{      
      isAllSelected = data.every((ele)=>ele.allAccess)
    }
    this.parentAccess[key] = isAllSelected;    
  }

  selectCheckboxItem(item, event, type) {


    /**
     * type = add , edit , delete ,view
     * event to check, it is checked or not
     * item  =  object  in array
    */


    if (event.target.checked) {
      item[type] = true;
      let check = item['add'] || item['edit'] || item['delete'] || item['view']; // check any of these is true
      if (check) {
        item['view'] = true; // make view true
      } else {
        item['view'] = false; // else false
      }
      let isAllAccess = item['add'] && item['edit'] && item['delete'] && item['view']// for all asccess if all true make it true else false
      if (isAllAccess) {
        item['allAccess'] = true;
      }
    } else {
      item[type] = false;
      item['allAccess'] = false;
    }
    // if view is false malke all false
    if (!item['view']) {
      item['add'] = false;
      item['edit'] = false;
      item['view'] = false;
      item['delete'] = false;
      item['allAccess'] = false;
    }

  }

}
