import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TokenExpireService } from 'src/app/core/services/token-expire.service';
import { CommonService } from 'src/app/core/services/common.service';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-inspection-type',
  templateUrl: './inspection-type.component.html',
  styleUrls: ['./inspection-type.component.scss']
})
export class InspectionTypeComponent implements OnInit, OnDestroy {

  constructor(public dialog: Dialog, private _commonService: CommonService) { }
  addInspectionApi = 'optionvalues/?key=inspection-type';
  @Input() inspectionTypeControl = new FormControl()
  formattedNames = ''
  showAddItemPopup = { name: '', status: false };
  dropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'label',
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    itemsShowLimit: 0,
    enableCheckAll: true,
    allowSearchFilter: true
  };
  inspectionType = []
  $subscriptionList: Subscription[] = []
  copyofinspectionType=[]
  isItemAdded=true;

  ngOnInit(): void {
    this.getInspectionTypesList();
    this.$subscriptionList.push(this.inspectionTypeControl.valueChanges.pipe(debounceTime(500)).subscribe(data => {
      this.updateFormattedNames();
    }));
  }

  ngOnDestroy(): void {
    this.$subscriptionList.forEach(sub => {
      sub.unsubscribe();
    })
  }
  getInspectionTypesList() {
    this._commonService.getUpdatedDropDownValues(this.addInspectionApi).subscribe((ele) => {
      this.inspectionType = ele['result']['inspection-type'].map(item => ({ 
        id: item.id, 
        label: item.label 
      }));
      this.copyofinspectionType=cloneDeep(this.inspectionType)
      this.arrangeMaterialList();
      this.updateFormattedNames();
    })
  }

  arrangeMaterialList() {
    let filteredA = this.inspectionType.filter(itemA => !this.inspectionTypeControl.value.find(itemB => itemB.id === itemA.id));
    let modifiedA = this.inspectionTypeControl.value.concat(filteredA)
    this.inspectionType = modifiedA
  }

  updateFormattedNames() {
    const inspections = this.inspectionTypeControl?.value || [];
    this.formattedNames = inspections
      .map(inspection => this.getInspectionNameById(inspection?.id))
      .filter(label => !!label)
      .join(', ');
  }

  getInspectionNameById(id: string) {
    const inspectionTypeObj = this.copyofinspectionType.find(inspection => inspection.id === id);
    return inspectionTypeObj ? inspectionTypeObj['label'] : '';
  }

  addNewInspectionType() {
    const dialogRef = this.dialog.open(AddInspectionTypePopup, {
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false,
      width: "400px",
      maxWidth: '80%'
    });

    let dialogRefSub = dialogRef.closed.subscribe((result) => {
      if (result) {
        this._commonService.getUpdatedDropDownValues(this.addInspectionApi).subscribe((ele) => {
          this.inspectionType = ele['result']['inspection-type'].map(item => ({ 
            id: item.id, 
            label: item.label 
          }))
          this.copyofinspectionType=cloneDeep(this.inspectionType);
          this.isItemAdded=false;
          setTimeout(() => {
            this.inspectionTypeControl.value.push({id:result['id'],label:result['label']})
            this.inspectionTypeControl.updateValueAndValidity()
            this.isItemAdded=true;
            this.arrangeMaterialList();
          }, 10);
        })
        }
      dialogRefSub.unsubscribe()
    });
  }


}

@Component({
  selector: 'app-add-inspection-type-pop-up',
  template: `

  <div class="add-other-expense-popup">
    <div class="popup-header ">
        <h6 class="d-inline">Add Inspection Type &nbsp;</h6>
        
    </div>
    <div class="popup-body">
            <div class="container-fluid">
                <div class="">
                    <div class="custom-box-input-wrap mb-4" >
                        <label for="" class="input--required">Inspection  Name</label>
                        <input [(ngModel)]="inspectionName" (keyup)="apiError=''" class="input--bd no-style" [ngClass]="{'error':requiredError}"  placeholder="">
                        <p *ngIf="requiredError" class="warn-text mt-2">This field is required</p>
                        <p *ngIf="apiError" class="warn-text mt-2">{{apiError}}</p>
                    </div>
                    <div class="d-flex justify-content-space-between  ">
                        <button class="btn w-auto " (click)="cancel()">Cancel</button>
                        <button class="btn btn--primary w-auto" (click)="save()">Save</button>
                    </div>

                </div>

            </div>

        
    </div>
</div>
  `,
  styleUrls: ["./inspection-type.component.scss"]

})
export class AddInspectionTypePopup implements OnInit {

  constructor(private dialogRef: DialogRef<any>, private _tokenExpireService: TokenExpireService, private _commonService: CommonService
  ) { }
  inspectionName = '';
  requiredError = false;
  apiError = '';
  addInspectionApi = 'optionvalues/?key=inspection-type';
  ngOnInit(): void {
    this._tokenExpireService.observeTokenExpire.subscribe(isExpired => {
      if (isExpired) {
        this.dialogRef.close(false)
      }
    })
  }
  save() {
    if (!this.inspectionName.trim()) {
      this.requiredError = true;
    } else {
      let addInspecParams = {
        label: this.inspectionName.trim(),
        key: 'inspection-type'
      }
      this._commonService.postDropDownValues(this.addInspectionApi,addInspecParams).subscribe((response: any) => {
        this.dialogRef.close(response['result'])
      }, (err) => {
        if(err.status==400){
          if(err.error.result.label[0].includes('Label already existsfor a given key')){
            this.apiError ="Inspection type already exists"
          }
        }
      });
      this.requiredError = false;
    }
  }
  cancel() {
    this.dialogRef.close(false)
  }

}