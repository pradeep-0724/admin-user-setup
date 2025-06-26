import { DIALOG_DATA, Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { RevenueService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/revenue-service/revenue.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { AddVehicleNewDocumentPopupComponent } from '../add-vehicle-new-document-popup/add-vehicle-new-document-popup.component';
import { getBlankOption, trimExtraSpaceBtwWords } from 'src/app/shared-module/utilities/helper-utils';
import { OverallModuleService } from '../../../../api-services/reports-module-services/over-all-service/overall.service';
import { BehaviorSubject } from 'rxjs';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-add-vehicle-document-popup',
  templateUrl: './add-vehicle-document-popup.component.html',
  styleUrls: ['./add-vehicle-document-popup.component.scss']
})
export class AddVehicleDocumentPopupComponent implements OnInit {
  newDoc: any;
  vehcileId: any;

  constructor(private formBuilder:FormBuilder,private dialogRef: DialogRef<boolean>, @Inject(DIALOG_DATA) private data: any, private _revenueService: RevenueService,public dialog: Dialog,private overalModuleService :OverallModuleService,
  private apiHandler: ApiHandlerService) { }
addVehicleDocForm;
paymentAccountList=[];
partyNamePopup='';
documentData:any=[];
vehicleList:any=[];
patchFileUrls = new BehaviorSubject([]);
initialValues={
  name:getBlankOption()
}
selecteddocumentID='';
  ngOnInit(): void {    
    this.buildForm();
    this.getBank();
    this.getVehicleList();
    console.log(this.data);
    
  }

  buildForm(){
    this.addVehicleDocForm=this.formBuilder.group({
      vehicle_no:[null,[Validators.required]],
      name:[null,[Validators.required]],
      number:[],
      expiry_date:[],
      amount:[0],
      bank:[],
      pass_journal_entry:[false],
      files:[[]]
    })
  }

  getBank(){
    this._revenueService.getAccounts().subscribe((response) => {
      this.paymentAccountList =response.result;
     })
  }
  getVehicleList(){
    this.overalModuleService.getOwnVehicleList().subscribe((data:any) => {
			this.vehicleList = data['result'];
		});
  }

  docNameChanged(event){
    this.selecteddocumentID=event.target.value;
    let certificate=this.documentData.filter((data)=>data.id===this.selecteddocumentID);
    this.addVehicleDocForm.get('number').setValue(certificate[0].number)
    
  }

  vehcileNumberChanged(event){
    this.addVehicleDocForm.get('name').setValue(null);
    this.initialValues.name=getBlankOption()
    this.vehcileId=event.target.value;
    this.getDocuemntData()
    
  }

  getDocuemntData(){
    this.overalModuleService.getVehcileDocuments(this.vehcileId).subscribe((data:any) => {
      this.documentData=data['result']  
		});
  }

  save(){
    let form=this.addVehicleDocForm;
    let date=form.get('expiry_date').value;
    date=changeDateToServerFormat(date);
    form.get('expiry_date').setValue(date);
    if(form.valid){
      let vehicle = this.vehicleList.find(vehicle=>vehicle.id==form.get('vehicle_no').value).reg_number;
      this.apiHandler.handleRequest(this.overalModuleService.postAddVehicleDoc(this.selecteddocumentID,form.value),`Vehicle Document for ${vehicle} added successfully!`).subscribe(
        {
          next: () => {
            this.dialogRef.close(true)
          }
        })
    }else{
      this.setAsTouched(form)

    }


  }

  cancel(){
    this.dialogRef.close()

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
  openAddPartyModal(event) {
		if (event){
      const dialogRef = this.dialog.open(AddVehicleNewDocumentPopupComponent, {
        minWidth: '50%',
        data: { 
          newDoc:this.newDoc,
          vehcileid:this.vehcileId
        },
        closeOnNavigation: true,
        disableClose: true,
        autoFocus: false
      });
      let dialogRefSub = dialogRef.closed.subscribe((result) => {
        this.getDocuemntData();
        this.selecteddocumentID=result['id'];
        this.initialValues.name['label']=result['docname'];
        this.initialValues.name['value']=result['id'];
        this.addVehicleDocForm.get('name').setValue(result['id']);
          dialogRefSub.unsubscribe();
      });
    }
	}
  addValueToPartyPopup(event) {    
		if (event) {
			const val = trimExtraSpaceBtwWords(event);
      this.newDoc=val
		}
	}
  
  documents=[];
  tripDocuments=[]
  fileUploader(e){
    e.forEach(element => {
      this.documents.push(element.id);
      element['presigned_url']=element['url']
      this.tripDocuments.push(element);
      this.addVehicleDocForm.get('files').setValue(this.documents)
    });
  }

  fileDeleted(id){
    this.tripDocuments =  this.tripDocuments.filter(doc=>doc.id !=id);
    this.documents =  this.documents.filter(doc=>doc.document !=id);
    this.addVehicleDocForm.get('files').setValue(this.documents)
  }

  
  
  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }
  passJournalEntryChange(){
    if(this.addVehicleDocForm.get('pass_journal_entry').value ){
      this.addVehicleDocForm.get('amount').setValidators([Validators.required,Validators.min(0.01)])
      this.addVehicleDocForm.get('bank').setValidators([Validators.required])
    }else{
      this.addVehicleDocForm.get('bank').setValue(null)
      this.addVehicleDocForm.get('amount').setValidators([Validators.nullValidator]);
      this.addVehicleDocForm.get('bank').setValidators([Validators.nullValidator]);
    }
    this.addVehicleDocForm.get('amount').updateValueAndValidity();
    this.addVehicleDocForm.get('bank').updateValueAndValidity();
  }

}
