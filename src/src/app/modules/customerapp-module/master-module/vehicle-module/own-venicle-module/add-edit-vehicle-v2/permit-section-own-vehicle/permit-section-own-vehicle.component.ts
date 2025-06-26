import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup, UntypedFormArray, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { PartyType, VendorType } from 'src/app/core/constants/constant';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { PartyService } from 'src/app/modules/customerapp-module/api-services/master-module-services/party-service/party.service';
import { OwnVehicleService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/own-vehicle-service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { setAsTouched, setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';

@Component({
  selector: 'app-permit-section-own-vehicle',
  templateUrl: './permit-section-own-vehicle.component.html',
  styleUrls: ['./permit-section-own-vehicle.component.scss']
})
export class PermitSectionOwnVehicleComponent implements OnInit {

  vehiclePermitList: any = [];
  @Input() vehicleDetailsForm: FormGroup;
  @Input() isFormSubmitted:Boolean=false;
  @Input() permitEditList: Observable<[]>;
  @Input() vehicleCatagory: Observable<any>;
  @Input() newPartyDetails: Observable<any>;
  @Input() isFormValid: Observable<boolean>;
  @Output() addNewParty=new EventEmitter()
  vendorList = []
  activeDoc = 0; 
  $subscriptionList: Subscription[] = [];
  showAddPartyPopup: any = { name: '', status: false };
  partyNamePopup: string = '';
  prefixUrl=getPrefix();
  constructor(
    private _fb: UntypedFormBuilder,
    private _commonloaderservice: CommonLoaderService,
    private _ownVehicleService: OwnVehicleService,
    private _partyService: PartyService,
    private activatedRoute: ActivatedRoute

  ) {
  }

  ngOnDestroy(): void {
    this._commonloaderservice.getShow();
    this.$subscriptionList.forEach(sub => {
      sub.unsubscribe();
    })
  }

  ngOnInit() {
    this._commonloaderservice.getHide();
    this.getVendorDetails();
  }

  ngAfterViewInit(): void {
    this.$subscriptionList.push(this.vehicleCatagory.subscribe(resp => {
       this._ownVehicleService.getVehiclePermits().subscribe((response) => {
        if (response['result']) {
          this.addVehiclePermitControls(response['result'].vp);
        }
      });
    }));

    if (this.permitEditList) {
      this.$subscriptionList.push(this.permitEditList.subscribe(docs => {
        this.addVehiclePermitControls(docs);
        this.activatedRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
          if (paramMap.has('tab')&& paramMap.get('tab')=='Permit') {
            this.vehiclePermitList.forEach((doc, index) => {
              if (paramMap.get('name') == doc.name){
                this.activeDoc = index
                setTimeout(() => {
                  const target = document.getElementById('permit-id'+doc.name);
                  target?.scrollIntoView({ behavior: 'smooth' });
                 }, 500);
              }
                
            });
          }
        });
      }));
    
    }
    this.$subscriptionList.push( this.isFormValid.subscribe(isValid=>{
     if(!isValid)
      setAsTouched(this.vehicleDetailsForm)
    }))
    this.$subscriptionList.push(this.newPartyDetails.subscribe(val=>{
     if(val)
     this.addPartyToOption(val)
    }))


  }

  addVehiclePermitControls(items: any = []) {
    const permit = this.vehicleDetailsForm.get('permits') as UntypedFormArray;
    permit.controls = [];
    this.vehiclePermitList = [];
    items.forEach((document, index) => {
      permit.push(this.addVehiclePermitControl(document,index));
      this.vehiclePermitList.push(document);      
    });
  }

  addVehiclePermitControl(document: any,index : number) {    
    return this._fb.group({
      id: [document.id || null],
      name: [document.name || ''],
      permit_id: [document.permit_id || ''],
      permit_issuer: [document.permit_issuer ? document.permit_issuer.id : ''],
      permit_issuer_label: [document.permit_issuer ? document.permit_issuer.label : ''],
      date: [document.date || null],
      expiry_date_mandatory : [document.expiry_date_mandatory],
      documents: [document.documents || []],
      order_no : [document.order_no || index]
    });
  }


  changeDocument(index) {
    this.activeDoc = index;
  }


  fileDeleted(id, i) {
    let file = (this.vehicleDetailsForm.get('permits') as UntypedFormArray).at(i)
    let permit = file.get('documents').value;
    file.get('documents').setValue(permit.filter(doc => doc.id != id))
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }


  

  fileUploader(e, i) {
    let data = this.vehicleDetailsForm.get('permits') as UntypedFormArray
    let permit = data.at(i).get('documents').value
    e.forEach((element) => {
      element['presigned_url'] = element['url']
      permit.push(element);
    });

  }

  getVendorDetails() {
    this._partyService.getPartyList(VendorType.Othres, PartyType.Vendor).subscribe((response) => {
      this.vendorList = response.result;
    });
  }

  onChangeNumber(form:FormGroup){
    const permitId = form.value['permit_id']
    const isExpiryMandatory=form.value['expiry_date_mandatory']
    if(permitId.trim() && isExpiryMandatory){
     setUnsetValidators(form,'date',[Validators.required])
    }else{
     setUnsetValidators(form,'date',[Validators.nullValidator])
    }
   }


  /* For  Opening the Party Modal */
  openAddPartyModal($event) {
    if ($event)
     this.addNewParty.emit({ name: this.partyNamePopup, status: true ,isFrom : 'permit'})
  }

  /* Adding the entered value to the list */
  addValueToPartyPopup(event) {
    if (event) {
      this.partyNamePopup = event;
    }
  }

  /* For Displaying the party name in the subfield  */
  addPartyToOption($event) {
    if ($event.status) {
      this.getVendorDetails();
      const permit = this.vehicleDetailsForm.get('permits') as UntypedFormArray;
      permit.at(this.activeDoc).get('permit_issuer').setValue($event.id);
      permit.at(this.activeDoc).get('permit_issuer_label').setValue($event.label);
    }
  }

}
