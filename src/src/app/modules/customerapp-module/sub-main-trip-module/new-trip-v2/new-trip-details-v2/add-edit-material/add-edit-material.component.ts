import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs/operators';
import { CompanyTripGetApiService } from 'src/app/modules/customerapp-module/revenue-module/trip-module/company-vehicle-module/company-trip-class/company-trip-service.service';
import { NewTripV2Service } from '../../../../api-services/trip-module-services/trip-service/new-trip-v2.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { TokenExpireService } from 'src/app/core/services/token-expire.service';
@Component({
  selector: 'app-add-edit-material',
  templateUrl: './add-edit-material.component.html',
  styleUrls: ['./add-edit-material.component.scss']
})
export class AddEditMaterialComponent implements OnInit, OnDestroy {

  constructor(private _companyTripGetApiService: CompanyTripGetApiService, public dialog: Dialog, private _newTripV2Service: NewTripV2Service, private commonloaderservice: CommonLoaderService,) { }
  @Input() selectedMaterial = [];
  @Input() tripId: string = ''
  selectedMaterialList = [];
  materialItem = new FormControl()
  showAddItemPopup = { name: '', status: false };
  material = ''
  materialList = [];
  $Material: Subscription;
  dropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    itemsShowLimit: 2,
    enableCheckAll: true,
    allowSearchFilter: true
  };


  ngOnInit(): void {
    this.commonloaderservice.getHide();
    this.$Material = this.materialItem.valueChanges.pipe(debounceTime(1000), distinctUntilChanged(), skip(1)).subscribe(value => {
      this.addMaterial(value);
      this.arrangeMaterialList();
    })
    this.getmaterialOptionsList();
  }

  ngOnDestroy(): void {
    this.$Material.unsubscribe();
    this.commonloaderservice.getShow();
  }
  getmaterialOptionsList() {
    this._companyTripGetApiService.getMaterials(materialList => {
      this.materialList = materialList
      let selectedMaterial = [];
      if (this.selectedMaterial.length) {
        this.selectedMaterial.forEach(item => {
          this.materialList.forEach(item1 => {
            if (item == item1.id) {
              selectedMaterial.push(item1)
            }
          });
        });
      }
      this.materialItem.setValue(selectedMaterial)
      this.arrangeMaterialList();
    });
  }

  arrangeMaterialList(){
    let filteredA = this.materialList.filter(itemA => !this.materialItem.value.find(itemB => itemB.id === itemA.id));
    let modifiedA = this.materialItem.value.concat(filteredA)
    this.materialList = modifiedA
   }

  addNewMaterial() {
    const dialogRef = this.dialog.open(AddMaterialPopup, {
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false,
      width:"400px",
      maxWidth:'80%'
    });

    let dialogRefSub = dialogRef.closed.subscribe((result) => {
      if (result) {
        this.selectedMaterial.push(result)
        this.getmaterialOptionsList();
      }
      dialogRefSub.unsubscribe()
    });
  }

  addMaterial(value) {
    this.selectedMaterial=value.map(mat => mat.id);
    let payLoad = {
      material: value.map(mat => mat.id)
    }
    this._newTripV2Service.putMaterial(this.tripId, payLoad).subscribe(resp => {
    });
  }

}

@Component({
  selector: 'app-add-material-pop-up',
  template: `

  <div class="add-other-expense-popup">
    <div class="popup-header ">
        <h6 class="d-inline">Add Material &nbsp;</h6>
        
    </div>
    <div class="popup-body">
            <div class="container-fluid">
                <div class="">
                    <div class="custom-box-input-wrap mb-4" >
                        <label for="" class="input--required">Material Name</label>
                        <input [(ngModel)]="materialName" class="input--bd no-style" [ngClass]="{'error':requiredError}"  placeholder="">
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
  styleUrls:["../add-other-expenses/add-other-expenses.component.scss"]

})
export class AddMaterialPopup implements OnInit {

  constructor(private dialogRef: DialogRef<any>, private _newTripV2Service: NewTripV2Service, private _tokenExpireService:TokenExpireService
    ) { }
  materialName = '';
  requiredError = false;
  apiError='';
  ngOnInit(): void {
    this._tokenExpireService.observeTokenExpire.subscribe(isExpired=>{
      if(isExpired){
        this.dialogRef.close(false)
      }
    })
  }
  save() {
    if (!this.materialName.trim()) {
      this.requiredError = true;
    }else{
      this._newTripV2Service.addMaterial({ name:this.materialName,is_material:true
      }).subscribe((response: any) => {
        this.dialogRef.close(response['result'].id)
      }, (err) => {
        if(err.status==400){
          this.apiError =err.error.result.name[0]
        }
      });
      this.requiredError = false;
    }
  }
  cancel() {
    this.dialogRef.close(false)
  }

}
