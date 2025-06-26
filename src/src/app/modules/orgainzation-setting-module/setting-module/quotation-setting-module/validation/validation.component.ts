import { Dialog } from '@angular/cdk/dialog';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { AddEditValidationComponent } from 'src/app/modules/customerapp-module/add-edit-validation-module/add-edit-validation/add-edit-validation.component';
import { QuotationSettingsService } from '../quotation-settings.service';
import { ValidationService } from 'src/app/modules/customerapp-module/add-edit-validation-module/validation-service.service';
import { DeleteAlertComponent } from 'src/app/shared-module/delete-alert-module/delete-alert/delete-alert.component';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.scss']
})
export class ValidationComponent implements OnInit,OnDestroy {

validationList = []
validationDetailsList=[];
quotation_Validation_URL='screen/validation/quotation/'

  constructor(public dialog: Dialog, private apiHandler: ApiHandlerService,
    private _commonloaderservice: CommonLoaderService, private _quotationSettingsService:QuotationSettingsService ,private _validationService:ValidationService) { }

  ngOnInit(): void {
    this._commonloaderservice.getHide();
    this._quotationSettingsService.getValidations().subscribe(resp=>{
      this.validationList = resp['result']
    })
    this.getValidationList();
  }

  ngOnDestroy(): void {
    this._commonloaderservice.getShow();  
  }

  addValidation() {
    const dialogRef = this.dialog.open(AddEditValidationComponent, {
      width: '1000px',
      maxWidth:'90%',
      data: {
        type: 'Add',
        validationList:this.validationList,
        editData:{},
        url:this.quotation_Validation_URL
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      if(result){
        this.getValidationList()
      }
      dialogRefSub.unsubscribe()

    });
  }

  editValidation(id) {
    const dialogRef = this.dialog.open(AddEditValidationComponent, {
      width: '1000px',
      maxWidth:'90%',
      data: {
        type: 'Edit',
        validationList:this.validationList,
        editData:id,
        url:this.quotation_Validation_URL
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      if(result){
        this.getValidationList()
      }
      dialogRefSub.unsubscribe()

    });
  }

  getValidationList(){
    this._validationService.getValidationsList(this.quotation_Validation_URL).subscribe(resp=>{
    this.validationDetailsList = resp['result']
    })
  }

  deleteValidation(data) {
    const dialogRef = this.dialog.open(DeleteAlertComponent, {
      width: '200px',
      maxWidth:'90%',
      data: {
        message:'Are you sure, you want to delete?'
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      if(result){
        this.apiHandler.handleRequest(this._validationService.deleteValidation(this.quotation_Validation_URL,data.id),`${data.validation} deleted successfully!`).subscribe(
          {
            next: () => {
              this.getValidationList()
            }
        })
      }
      dialogRefSub.unsubscribe()

    });
  }



  
}
