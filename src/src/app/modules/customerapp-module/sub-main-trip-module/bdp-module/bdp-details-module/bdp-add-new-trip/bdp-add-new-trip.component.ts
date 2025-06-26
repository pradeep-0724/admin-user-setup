import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { TripsAddEditPopUp } from '../../../new-trip-v2/new-trip-details-v2/trip-details-v2.interface';
import { NewTripV2Constants } from '../../../new-trip-v2/new-trip-v2-constants/new-trip-v2-constants';
import { setAsTouched } from 'src/app/shared-module/utilities/form-utils';
import { trimExtraSpaceBtwWords } from 'src/app/shared-module/utilities/helper-utils';
import { CompanyTripGetApiService } from 'src/app/modules/customerapp-module/revenue-module/trip-module/company-vehicle-module/company-trip-class/company-trip-service.service';
import { NewTripV2Service } from '../../../../api-services/trip-module-services/trip-service/new-trip-v2.service';
import { Router } from '@angular/router';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { TokenExpireService } from 'src/app/core/services/token-expire.service';

@Component({
  selector: 'app-bdp-add-new-trip',
  templateUrl: './bdp-add-new-trip.component.html',
  styleUrls: ['./bdp-add-new-trip.component.scss']
})
export class BdpAddNewTripComponent implements OnInit {
  constructor(private dialogRef: DialogRef<boolean>, @Inject(DIALOG_DATA)  private data: TripsAddEditPopUp,private formBuilder:FormBuilder,private commonloaderservice:CommonLoaderService, 
   private _companyTripGetApiService: CompanyTripGetApiService,    private _newTripService: NewTripV2Service,private router:Router , private _tokenExpireService:TokenExpireService


  ) { }
  bdpAddTrip:FormGroup;
  constantsTripV2 = new NewTripV2Constants()
  showAddPartyPopup: any = { name: '', status: false };
  partyNamePopup: string = '';
  initialDetails={
    customer:{},
    route_code:{}

  }
  partyList=[];
  routeCodeList=[];
  routesPath=[];
  bdpcontainerStatus:any;
  tripUrl='/trip/new-trip/add';

  ngOnInit(): void {
    this.commonloaderservice.getHide();
     this.buildForm();
     this.bdpcontainerStatus = this.data['containerStatus']
    setTimeout(() => {
      this.getPartyTripDetails()
    }, 100);
    this._tokenExpireService.observeTokenExpire.subscribe(isExpired=>{
      if(isExpired){
        this.dialogRef.close(false)
      }
    })
   
  }

  buildForm(){
    this.bdpAddTrip=this.formBuilder.group({
      customer: ['', [Validators.required]],
      route_code: '',
    
    })
  }



 

  cancel(){
    this.dialogRef.close(false)
    this.commonloaderservice.getShow()

  }

  save(){
    let form = this.bdpAddTrip;    
     if(form.valid) {
      this.createNewTrip();
      this.commonloaderservice.getShow();
    }else{
      setAsTouched(form);
    }

  }

  openAddPartyModal($event) {
    if ($event) {
      this.showAddPartyPopup = { name: this.partyNamePopup, status: true };
    }
  }

  addValueToPartyPopup(event) {
    if (event) {
      const val = trimExtraSpaceBtwWords(event);
      const arrStr = val.toLowerCase().split(' ');
      const titleCaseArr: string[] = [];
      for (const str of arrStr) {
        titleCaseArr.push(str.charAt(0).toUpperCase() + str.slice(1));
      }
      const word_joined = titleCaseArr.join(' ');
      this.partyNamePopup = word_joined;
    }
  }

  onvendorSelected(){
    this.getRoutes(this.bdpAddTrip.get('customer').value);
  }


  closePartyPopup() {
    this.showAddPartyPopup = { name: '', status: false };
  }

  addPartyToOption($event) {
    if ($event.status) {
      this.initialDetails.customer = { value: $event.id, label: $event.label };
      this.bdpAddTrip.get('customer').setValue($event.id);
      this.getRoutes($event.id);
      this.getPartyTripDetails();
    }

  }


  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  getPartyTripDetails() {
    this._companyTripGetApiService.getPartyTripDetailsV2(partyList => {
      this.partyList = partyList['clients']
    })
  }

  getRoutes(customer){
    this._newTripService.getAllRoutes(customer).subscribe(resp => {
      this.initialDetails.route_code={};
      this.routesPath=[];
      this.bdpAddTrip.get('route_code').setValue('');
      this.routeCodeList = resp['result']
    });
  }

  routeSelected() {
   this.routesPath= this.routeCodeList.filter(route => route.name == this.bdpAddTrip.get('route_code').value)[0].paths
   
  }

  createNewTrip(){
    let queryParams= new Object({
     bdpCustomerId:this.bdpAddTrip.get('customer').value,
     bdpRouteCode:this.bdpAddTrip.get('route_code').value,
     tenderNumber:this.data['tenderRequestNumber']
    });
    this.router.navigate([getPrefix()+this.tripUrl], { queryParams });
    this.dialogRef.close(true)
  }

 

}
