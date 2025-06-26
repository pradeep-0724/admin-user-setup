import { Component, Input, OnInit } from '@angular/core';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { EmployeeDetailsService } from '../employee-details.service';
import { Dialog } from '@angular/cdk/dialog';
import { EmployeeCertificateHistoryComponent } from '../employee-details-v2/employee-certificate-history/employee-certificate-history/employee-certificate-history.component';
import { NgxPermissionsService } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';

@Component({
  selector: 'app-employee-info-v2',
  templateUrl: './employee-info-v2.component.html',
  styleUrls: ['./employee-info-v2.component.scss'],
  host: {
    "(document:click)": "outSideClick($event)",
  },
})
export class EmployeeInfoV2Component implements OnInit {
  preFixUrl = getPrefix();
  @Input() employeeId=''
  employeeDetails;
  employeeBankDetails;
  isTax=false;
  isTDS=false;
  currency_type;
  documentList=[];
  showOptions="";
  popUpRenewDocuments={
    data:{},
    show:false
  };
  viewUploadedDocs={
    show: false,
    data:{}
  }
  isAssignedVehEmpty:boolean=true;
  listQueryParams ={
    search : '',
    filters : '[]'
  }
  isEmployeeEditPermission=false;
  constructor( private _tax:TaxService,private currency: CurrencyService,private _employeeDetails:EmployeeDetailsService,private _route:Router,public dialog: Dialog,private _permissions:NgxPermissionsService) { }

  ngOnInit(): void {

    this._permissions.hasPermission(Permission.employee.toString().split(',')[1]).then(val=>{
      this.isEmployeeEditPermission=val
    })
    this.currency_type = this.currency.getCurrency();
    this.isTax = this._tax.getTax();
    this.isTDS = this._tax.getVat();
  
    this._employeeDetails.getEmployeeInfo(this.employeeId).subscribe(resp=>{
      this.employeeDetails=resp['result'];
      this.employeeDetails?.specifications.forEach(item => {
        if (!this.employeeDetails?.specifications[0]?.specification?.length && !this.employeeDetails?.specifications[1]?.specification?.length && !this.employeeDetails?.specifications[2]?.specification?.length && !this.employeeDetails?.specifications[3]?.specification?.length){
          this.isAssignedVehEmpty=true
        }else if (!this.employeeDetails?.specifications.length) {

          this.isAssignedVehEmpty=true

        }else{
          this.isAssignedVehEmpty=false
        }

        
      });
          
    }) 
    this._employeeDetails.getEmployeeBank(this.employeeId).subscribe(resp=>{
      this.employeeBankDetails=resp['result']
    })
    this.getEmployeeDocument();
  }

  getEmployeeDocument(){
    this._employeeDetails.getEmployeeDocument(this.employeeId,this.listQueryParams).subscribe(resp=>{
      this.documentList=resp['result'];
      
    })
  }
  getVehicleIcon(type){

    if (type ==1 ){
      return '../../../../../../../../assets/img/crane-truck.png';
    }else if(type ==2 ){
      return '../../../../../../../assets/img/icons/awp.svg';
    }else if(type ==3 ){
      return ' ../../../../../../../../assets/img/icons/trailer-head.svg';
    }else{
      return '../../../../../../../assets/img/icons/truck-vehicle.svg';
    }

  }

  documentEdit(e){
    if(e)this._route.navigate([this.preFixUrl+'/onboarding/employee/edit/'+this.employeeId+'/document'],{queryParams:{veh_assign:'open'}})
  }

  getStyle(color){
    if(color =="red")
    return {color :'red'};
     
    if(color=='yellow')
     return { color: 'rgb(255, 185, 0)' }
    if(color=='green')
      return { color: '#07c060' }

  }


  dataFromRenewalDoc(e){
    this.popUpRenewDocuments.data={};
    if(e){
      this.popUpRenewDocuments.show= false;
      setTimeout(() => {
        this.getEmployeeDocument();
      }, 400);
    }
  }

  renewDoc(doc){ 
    this.popUpRenewDocuments.data= cloneDeep(doc);    
    this.popUpRenewDocuments.show= true;
  }
  viewUploadedDocument(doc){
    this.viewUploadedDocs.data= cloneDeep(doc);    
    this.viewUploadedDocs.show= true;
  }
  
  searchCertificateDetails(e){
    this.listQueryParams.search = e;
    this.getEmployeeDocument()
  
  }

  openDocumentsHistory(data,apiText) {
    let apiTxt = data.id +'/'+apiText
    this._employeeDetails.getEmployeeHistoryCertificates(apiTxt).subscribe((res)=>{
      const dialogRef = this.dialog.open(EmployeeCertificateHistoryComponent, {
        minWidth: '55%',
        data: {
          data: res['result'],
          name : data.name,
        
        },
        closeOnNavigation: true,
        disableClose: true,
        autoFocus: false
      });
  
  
      let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
        dialogRefSub.unsubscribe()
  
      });
    })
 }
 optionsList(event, list_index) {
  return (this.showOptions = list_index);
}


outSideClick(env) {
  try {
    if (env.target.className.indexOf("more-icon") == -1) {
      this.showOptions = "";
    }
  } catch (error) {
    console.log(error);
  }
}

filterDataCertificates(e){
  this.listQueryParams.filters = JSON.stringify(e);
  this.getEmployeeDocument()
}
  

}
