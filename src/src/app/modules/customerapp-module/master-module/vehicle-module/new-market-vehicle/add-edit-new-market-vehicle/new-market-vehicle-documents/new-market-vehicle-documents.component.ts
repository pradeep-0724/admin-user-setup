import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, UntypedFormArray, Validators } from '@angular/forms';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { Dialog } from '@angular/cdk/dialog';
import { AddEditDocumntPopupComponent } from '../../add-edit-documnt-popup/add-edit-documnt-popup.component';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { NewMarketVehicleService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/new-market-vehicle-service/new-market-vehicle.service';
import { setAsTouched, setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';

@Component({
  selector: 'app-new-market-vehicle-documents',
  templateUrl: './new-market-vehicle-documents.component.html',
  styleUrls: ['./new-market-vehicle-documents.component.scss']
})
export class NewMarketVehicleDocumentsComponent implements OnInit {

  @Input() marketVehicleForm: FormGroup;
  @Input() isFormSubmitted:Boolean
  documentList = []
  initialValues = {
    bank: []
  };
  showValidationMsg = true
  activeDoc = 0;
  popupInputData = {
    'msg': ' Are you sure you want to delete this document?',
    'type': 'warning',
    'show': false
  }
  documentIndex = -1;
  @Input() editData: Observable<any>;

  @Input() isEdit: boolean;
  @Input() inValid: Observable<boolean>;
  vehicle_type: string;
  @Input() vehicle_category: Observable<any>;
  documentNames = [];

  constructor(private _fb: FormBuilder, private _popupBodyScrollService: popupOverflowService,
    private newMarketVehicleService: NewMarketVehicleService, private activatedRoute: ActivatedRoute,
    public dialog: Dialog) { }

  ngOnInit(): void {
    if (!this.isEdit) {
      this.vehicle_category.subscribe((res) => {
        this.vehicle_type = res;
        this.newMarketVehicleService.getDefaultVehicleDocuments(res).subscribe((response) => {
          if (response['result']) {
            this.addVehicleDocumentControls(response['result']);
          }
        });
      })
    }
    this.activatedRoute.params.subscribe((params: ParamMap) => {
      if (params.hasOwnProperty('vehicle_id')) {
        this.editData.subscribe((data) => {
          this.vehicle_type = data['vehicle_category'];
          this.addVehicleDocumentControls(data['documents']);
          this.activatedRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('tab') && paramMap.get('tab') == '0') {
              this.documentList.forEach((doc, index) => {
                if (paramMap.get('name') == doc.name) {
                  this.activeDoc = index
                  setTimeout(() => {
                    const target = document.getElementById('market-certificate-id' + doc.name);
                    target?.scrollIntoView({ behavior: 'smooth' });
                  }, 500);
                }

              });
            }
          });
        })
      }
    })
    this.inValid.subscribe(isValid => {
      if (!isValid){
        setAsTouched(this.marketVehicleForm)
      }
    })
  }

  addVehicleDocumentControls(items: any = []) {
    const documents = this.marketVehicleForm.get('documents') as UntypedFormArray;
    documents.controls = [];
    this.documentList = [];
    this.initialValues.bank = [];
    items.forEach((document, index) => {
      documents.push(this.addVehicleDocumentControl(document));
      this.documentList.push(document);
    });

  }

  addVehicleDocumentControl(document: any) {
    return this._fb.group({
      name: [document['name']],
      number: [document.number || ''],
      expiry_date: [document.expiry_date || null],
      issue_date: [document.issue_date || null],
      files: [document.files || []],
      all_vehicle: [document.all_vehicle || false],
      type_vehicle: [document.type_vehicle || true],
      vehicle_type: [this.vehicle_type],
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

  fileUploader(e, i) {
    let data = this.marketVehicleForm.get('documents') as UntypedFormArray
    let documents = data.at(i).get('files').value
    e.forEach((element) => {
      element['presigned_url'] = element['url']
      documents.push(element);
    });

  }

  fileDeleted(id, i) {
    let file = (this.marketVehicleForm.get('documents') as UntypedFormArray).at(i)
    let documents = file.get('files').value;
    file.get('files').setValue(documents.filter(doc => doc.id != id))
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  confirmButton(e) {
    const documents = this.marketVehicleForm.get('documents') as UntypedFormArray;
    if (e) {
      this.documentList.splice(this.documentIndex, 1);
      documents.controls.splice(this.documentIndex, 1);
      if (this.documentIndex == documents.length) {
        this.activeDoc = this.documentIndex - 1
      } else if (this.documentIndex == 0) {
        this.activeDoc = 0
      } else {
        this.activeDoc = this.documentIndex - 1
      }
      documents.updateValueAndValidity()
    }
  }

  deleteDocuments(index) {
    this.documentIndex = index;
    this.popupInputData.show = true;
    const dialogRef = this.dialog.open(AddEditDocumntPopupComponent, {
      width: '500px',
      maxWidth: '90%',
      data: {
        data: this.marketVehicleForm.get('documents').value[index],
        isEdit: false,
        isDelete: true,
        isAdd: false
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false,
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      dialogRefSub.unsubscribe();
      this.confirmButton(result)

    });
    this._popupBodyScrollService.popupActive()
  }


  popupOverflowActive() {
    const dialogRef = this.dialog.open(AddEditDocumntPopupComponent, {
      width: '650px',
      maxWidth: '90%',
      data: {
        data: {
          vehicle_type: this.vehicle_type,
        },
        isEdit: false,
        isDelete: false,
        isAdd: true,
        allDocNames: this.marketVehicleForm.value['documents'].map(documents => documents['name'])
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false,
    });
    let dialogRefSub = dialogRef.closed.subscribe((result) => {
      const documents =this.marketVehicleForm.get('documents') as UntypedFormArray
      const item = {
        name: result['name'],
        is_expiry_mandatory:result['is_expiry_mandatory']
      };
      documents.push(this.addVehicleDocumentControl(item));
      this.documentList.push(item);
      dialogRefSub.unsubscribe()
      this.activeDoc=documents.length-1
    });
    this._popupBodyScrollService.popupActive()
  }

  openEditDocumentPopup(documentName, index) {
    const dialogRef = this.dialog.open(AddEditDocumntPopupComponent, {
      width: '650px',
      maxWidth: '90%',
      data: {
        data: this.marketVehicleForm.get('documents').value[index],
        isEdit: true,
        isDelete: false,
        isAdd: false,
        allDocNames: this.marketVehicleForm.value['documents'].map(documents => documents['name']).filter(name => name != documentName)
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });

    let dialogRefSub = dialogRef.closed.subscribe((result) => {
      const documents = (this.marketVehicleForm.get('documents') as UntypedFormArray).at(index);
      documents.get('name').setValue(result['name'])
      this.documentList[index].name=result['name']
      dialogRefSub.unsubscribe()
    });
  }

}
