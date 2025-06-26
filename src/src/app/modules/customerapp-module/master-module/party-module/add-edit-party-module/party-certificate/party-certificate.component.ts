import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, UntypedFormArray, UntypedFormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { PartyAddEditItemsComponent } from '../party-add-edit-items/party-add-edit-items.component';
import { Dialog } from '@angular/cdk/dialog';
import { PartyService } from 'src/app/modules/customerapp-module/api-services/master-module-services/party-service/party.service';
import { PartyDeleteItemComponent } from '../party-delete-item/party-delete-item.component';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { setAsTouched, setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';

@Component({
  selector: 'app-party-certificate',
  templateUrl: './party-certificate.component.html',
  styleUrls: ['./party-certificate.component.scss']
})
export class PartyCertificateComponent implements OnInit , OnDestroy,AfterViewInit {
  documentList: any = [];

  @Input() partyForm: FormGroup;
  @Input() documentEditList?: Observable<[]>;
  @Input() isValid:Observable<boolean>;
  activeDoc = 0;
  $subscriptionList:Subscription[]=[];
  constructor(
    private _fb: UntypedFormBuilder,
    private _commonloaderservice: CommonLoaderService,
    public dialog: Dialog,
    private _partyService:PartyService,
    private activatedRoute:ActivatedRoute
  ) {

  }

  ngOnDestroy(): void { 
    this._commonloaderservice.getShow();
    this.$subscriptionList.forEach(sub=>{
    sub.unsubscribe();
    })
  }

  ngOnInit() {
    this._commonloaderservice.getHide();  
  }

  ngAfterViewInit(): void {
    this.$subscriptionList.push(this._partyService.getDefaultPartyCertificate().subscribe((response) => {
      if (response['result'].length) {
        this.addVehicleDocumentControls(response['result']);
      }
    }));
     if(this.documentEditList){
      this.$subscriptionList.push(this.documentEditList.subscribe(docs=>{
        this.addVehicleDocumentControls(docs);
        this.activatedRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
          if (paramMap.has('tab') && paramMap.get('tab')=='1') {
            this.documentList.forEach((doc, index) => {
              if (paramMap.get('name') == doc.name){
                this.activeDoc = index
                setTimeout(() => {
                  const target = document.getElementById('party-certificate-id'+doc.name);
                  target?.scrollIntoView({ behavior: 'smooth' });
                 }, 200);
              }
            });
          }
        });
       }));
     }

     this.$subscriptionList.push(
      this.isValid.subscribe(isValid=>{
        if(!isValid)
        setAsTouched(this.partyForm)
      })
     )
    
  }


  addVehicleDocumentControls(items: any = []) {
    const certificate = this.partyForm.get('certificates') as UntypedFormArray;
    certificate.controls = [];
    this.documentList=[];
    items.forEach((document, index) => {
        certificate.push(this.addVehicleDocumentControl(document));
        this.documentList.push(document);
    });
  }

  addVehicleDocumentControl(document: any) {
    return this._fb.group({
      id: [
        document.id || null
      ],
      name: [document.name || ''],
      number:[document.number||''],
      issue_date: [document.issue_date || null],
      expiry_date: [document.expiry_date || null],
      files: [document.files || []],
      is_expiry_mandatory: [document.is_expiry_mandatory],
    });
  }


  changeDocument(index) {
    this.activeDoc = index;
  }

  onChangeNumber(form:FormGroup){
    const number = form.value['number']
    const isExpiryMandatory=form.value['is_expiry_mandatory']
    if(number.trim() && isExpiryMandatory){
     setUnsetValidators(form,'expiry_date',[Validators.required])
    }else{
     setUnsetValidators(form,'expiry_date',[Validators.nullValidator])
    }
   }

  fileDeleted(id, i) {
    let file = (this.partyForm.get('certificates') as UntypedFormArray).at(i)
    let certificate = file.get('files').value;
    file.get('files').setValue(certificate.filter(doc => doc.id != id))
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }


  fileUploader(e, i) {
    let data = this.partyForm.get('certificates') as UntypedFormArray
    let certificate = data.at(i).get('files').value
    e.forEach((element) => {
      element['presigned_url'] = element['url']
      certificate.push(element);
    });

  }

  AddCertificate() {
    const dialogRef = this.dialog.open(PartyAddEditItemsComponent, {
      data: {
        heading:'Add Party Certificate',
        label:'Party Certificate',
        documentList:this.partyForm.value['certificates'].map(certificate=>certificate['name']),
        editData:'',
      },
      width:'650px',
      maxWidth:'90%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
    if(result){
      const certificate = this.partyForm.get('certificates') as UntypedFormArray;
      const item = {
        name: result['name'],
        narration: '',
        issue_date:null,
        expiry_date: null,
        files: [],
        is_expiry_mandatory:result['is_expiry_mandatory']
      };
      certificate.push(this.addVehicleDocumentControl(item));
      this.documentList.push(item);
      dialogRefSub.unsubscribe();
      this.activeDoc =certificate.length-1
    }
     
    });

  }

  editCertificate(name,index) {
    const dialogRef = this.dialog.open(PartyAddEditItemsComponent, {
      data: {
        heading:'Edit Party Certificate',
        label:'Party Certificate',
        documentList:this.partyForm.value['certificates'].map(certificate=>certificate['name']).filter(item => item !== name),
        editData:name,
      },
      width:'650px',
      maxWidth:'90%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
    if(result){
      const certificate = (this.partyForm.get('certificates') as UntypedFormArray).at(index);
      certificate.get('name').setValue(result)
      this.documentList[index].name=result
      dialogRefSub.unsubscribe();
    }
    });

  }

  deleteDocuments(name,index) {
    const dialogRef = this.dialog.open(PartyDeleteItemComponent, {
       data: {
         message:'Are you sure you want to delete this Certificate?',
         name:name,
         url:'party/certificate/delete/',
       },
       width:'500px',
       maxWidth:'60%',
       closeOnNavigation: true,
       disableClose: true,
       autoFocus: false
     });
     let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
       if(result){
         const certificate = this.partyForm.get('certificates') as UntypedFormArray;
         this.documentList.splice(index, 1);
         certificate.controls.splice(index, 1);
         this.changeDocument(index - 1);
         certificate.updateValueAndValidity()
       }
        dialogRefSub.unsubscribe();  
     });
 
   }






}