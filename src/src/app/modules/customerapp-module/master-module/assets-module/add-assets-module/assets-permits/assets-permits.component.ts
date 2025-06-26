import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormArray, AbstractControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { VendorType, PartyType } from 'src/app/core/constants/constant';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { OwnAssetsService } from 'src/app/modules/customerapp-module/api-services/master-module-services/assets-service/assets-service.service';
import { PartyService } from 'src/app/modules/customerapp-module/api-services/master-module-services/party-service/party.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { setAsTouched, setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';

@Component({
  selector: 'app-assets-permits',
  templateUrl: './assets-permits.component.html',
  styleUrls: ['./assets-permits.component.scss']
})
export class AssetsPermitsComponent implements OnInit,AfterViewInit,OnDestroy {

  assetsPermitList: any = [];
  @Input() assetsDetailsForm: FormGroup;
  @Input() permitEditList: Observable<[]>;
  @Input() isEdit:boolean=false;
  @Input() catagory: Observable<any>;
  @Input() newPartyDetails: Observable<any>;
  @Input() isFormValid: Observable<boolean>;
  @Output() addNewParty=new EventEmitter()
  vendorList = []
  activeDoc = 0;
  $subscriptionList: Subscription[] = [];
  showAddPartyPopup: any = { name: '', status: false,from:''};
  partyNamePopup: string = '';
  constructor(
    private _fb: UntypedFormBuilder,
    private _commonloaderservice: CommonLoaderService,
    private _ownAssetService: OwnAssetsService,
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
    if(this.isEdit){
      if (this.permitEditList) {
        this.$subscriptionList.push(this.permitEditList.subscribe(docs => {
          this.addAssetPermitControls(docs);
          this.activatedRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('tab')&& paramMap.get('tab')=='Permits') {
              this.assetsPermitList.forEach((doc, index) => {
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
    }else{
      this.$subscriptionList.push(this.catagory.subscribe(resp => {
        this._ownAssetService.getAssetPermits().subscribe((response) => {
         if (response['result']) {
           this.addAssetPermitControls(response['result'].vp);
         }
       });
     }));
    }
  

    this.$subscriptionList.push(this.isFormValid.subscribe(isValid=>{
     if(!isValid)
      setAsTouched(this.assetsDetailsForm)
    }))
    this.$subscriptionList.push(this.newPartyDetails.subscribe(val=>{
     if(val)
     this.addPartyToOption(val)
    }))


  }

  addAssetPermitControls(items: any = []) {
    const permit = this.assetsDetailsForm.get('permits') as UntypedFormArray;
    permit.controls = [];
    this.assetsPermitList = [];
    items.forEach((document, index) => {
      permit.push(this.addAssetPermitControl(document,index));
      this.assetsPermitList.push(document);      
    });
  }

  addAssetPermitControl(document: any,index) {    
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

  onChangePermitId(form:FormGroup){
    const permitId = form.value['permit_id']
    const isExpiryMandatory=form.value['expiry_date_mandatory']
    if(permitId.trim() && isExpiryMandatory){
     setUnsetValidators(form,'date',[Validators.required])
    }else{
     setUnsetValidators(form,'date',[Validators.nullValidator])
    }
   }

  fileDeleted(id, i) {
    let file = (this.assetsDetailsForm.get('permits') as UntypedFormArray).at(i)
    let permit = file.get('documents').value;
    file.get('documents').setValue(permit.filter(doc => doc.id != id))
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }


  

  fileUploader(e, i) {
    let data = this.assetsDetailsForm.get('permits') as UntypedFormArray
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

  

  openAddPartyModal($event) {
    if ($event)
     this.addNewParty.emit({ name: this.partyNamePopup, status: true ,from:'permit'})
  }

  addValueToPartyPopup(event) {
    if (event) {
      this.partyNamePopup = event;
    }
  }

  /* For Displaying the party name in the subfield  */
  addPartyToOption($event) {
    if ($event.status) {
      this.getVendorDetails();
      const permit = this.assetsDetailsForm.get('permits') as UntypedFormArray;
      permit.at(this.activeDoc).get('permit_issuer').setValue($event.id);
      permit.at(this.activeDoc).get('permit_issuer_label').setValue($event.label);
    }
  }

}
