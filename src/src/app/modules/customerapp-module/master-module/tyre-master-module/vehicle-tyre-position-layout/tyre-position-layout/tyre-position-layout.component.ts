import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { TyreMasterAddEditService } from 'src/app/modules/customerapp-module/api-services/master-module-services/tyre-master-service/tyre-master-add-edit-service.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { trimExtraSpaceBtwWords } from 'src/app/shared-module/utilities/helper-utils';

@Component({
  selector: 'app-tyre-position-layout',
  templateUrl: './tyre-position-layout.component.html',
  styleUrls: ['./tyre-position-layout.component.scss']
})
export class TyrePositionLayoutComponent implements OnInit, AfterViewInit {
  @Input() tyreMasterForm: FormGroup;
  @Input() addNewAxel?: Observable<any>
  @Input() editTyreDetails?: Observable<any>
  @Input() editData?: Observable<any>
  @Input() removeAxels?: Observable<any>
  @Input() isView = false;
  @Input() isAdd = false;
  @Input() isTyrePositionAddInfo = false;
  @Input() isTyrePositionViewInfo = false;
  tyreBrandUrl = TSAPIRoutes.tyre_brand;
  totalTyre = 0;
  tyreBrandParam: any = {};
  tyreModelParam: any = {};
  tyreBrand = []
  tyreModel = [];
  makeSelectedId = ''
  tyrePlacementDetails = {}
  prefixUrl = getPrefix();
  isRedirect = false;
  $subscriptionList:Subscription[]=[];
  @Output() emitTotalTyre = new EventEmitter();
  constructor(private _fb: FormBuilder, private _tyreMaster: TyreMasterAddEditService,) { }

  ngOnInit(): void {
    this.buildVehicleTyrePositions([{}, {}])
    this.namingAxel();
    this.builtVehicleTyres();
    this.namingTyres();

    if (this.addNewAxel) {
     this.$subscriptionList.push(this.addNewAxel.subscribe((isAdd) => {
        this.addAxel();
      }))
    }

    if (this.removeAxels) {
      this.$subscriptionList.push(this.removeAxels.subscribe((isRemove) => {
        this.removeAxel();
      }))
    }

    if (this.editData) {
      this.$subscriptionList.push(this.editData.subscribe(data => {
        this.patchAxls(data)
      }))

    }

    if (this.isTyrePositionAddInfo) {
      this.getAllBrands();
      this.buildVehicleTyrePositions([])
      this.$subscriptionList.push(this.tyreMasterForm.get('brand').valueChanges.pipe(debounceTime(200)).subscribe(data => {
        this.getTyrePlacementOnMakeAndModel(data)
      }))
    }
  }

  ngAfterViewInit(): void {
    if (this.editTyreDetails) {
      this.$subscriptionList.push(this.editTyreDetails.subscribe(editData => {
        this.patchTyrePlacementOnMakeAndModel(editData)
      }))
    }

  }

  ngOnDestroy(): void { 
    this.$subscriptionList.forEach(sub=>{
    sub.unsubscribe();
    })
  }



  buildVehicleTyrePositions(axls = []) {
    const axlsArray = this.tyreMasterForm.controls.tyre_positions as FormArray
    axlsArray.controls = [];
    axls.forEach(axl => {
      const newxal = this.getDefaultAxl(axl)
      axlsArray.push(newxal)
    })
  }

  builtVehicleTyres() {
    const axlsArray = this.tyreMasterForm.controls.tyre_positions as FormArray
    axlsArray.controls.forEach((axl) => {
      const left_tyers = axl.get('left_tyers') as FormArray
      const right_tyers = axl.get('right_tyers') as FormArray
      left_tyers.push(this.getDefaultTyre())
      right_tyers.push(this.getDefaultTyre())
    })
  }

  addAxel() {
    const axlsArray = this.tyreMasterForm.controls.tyre_positions as FormArray
    const newxal = this.getDefaultAxl({})
    axlsArray.push(newxal)
    this.namingAxel();
    this.addTyre(axlsArray.controls.length - 1)
  }

  removeAxel() {
    const axlsArray = this.tyreMasterForm.controls.tyre_positions as FormArray
    axlsArray.removeAt(axlsArray.controls.length - 1);
    this.namingAxel();
    this.tyreCount();
  }

  removeTyre(axlIndex) {
    const axls = (this.tyreMasterForm.controls.tyre_positions as FormArray).at(axlIndex)
    const left_tyers = axls.get('left_tyers') as FormArray
    const right_tyers = axls.get('right_tyers') as FormArray
    left_tyers.removeAt(left_tyers.controls.length - 1)
    right_tyers.removeAt(right_tyers.controls.length - 1)
    this.tyreCount()
  }

  addTyre(index) {
    const axls = (this.tyreMasterForm.controls.tyre_positions as FormArray).at(index)
    const left_tyers = axls.get('left_tyers') as FormArray
    const right_tyers = axls.get('right_tyers') as FormArray
    left_tyers.push(this.getDefaultTyre())
    right_tyers.push(this.getDefaultTyre())
    this.namingTyres();
  }



  namingAxel() {
    const axlsArray = this.tyreMasterForm.controls.tyre_positions as FormArray
    axlsArray.controls.forEach((axl, index) => {
      axl.get('name').setValue((index + 1) + ' Axle')
    })
  }

  namingTyres() {
    const axlsArray = this.tyreMasterForm.controls.tyre_positions as FormArray
    axlsArray.controls.forEach((axl, axlsIndex) => {
      const left_tyers = axl.get('left_tyers') as FormArray
      const right_tyers = axl.get('right_tyers') as FormArray
      left_tyers.controls.forEach((tyre, tyreIndex) => {
        tyre.get('name').setValue((axlsIndex + 1) + 'L' + (tyreIndex + 1))
      })
      right_tyers.controls.forEach((tyre, tyreIndex) => {
        tyre.get('name').setValue((axlsIndex + 1) + 'R' + (tyreIndex + 1))
      })
    })
    this.tyreCount();
  }

  getDefaultAxl(axl) {
    return this._fb.group({
      name: '',
      left_tyers: this._fb.array([]),
      right_tyers: this._fb.array([]),
    })
  }

  getDefaultTyre(name = '') {
    return this._fb.group({
      name: name,
      tyre_number: '',
      brand: '',
      model: '',
      model_list: [],
      installation_date: null,
      permitted_date: null,
      thread_depth: ''
    })
  }

  patchAxls(axls = []) {
    const axlsArray = this.tyreMasterForm.controls.tyre_positions as FormArray
    axlsArray.controls = [];
    axls.forEach(axl => {
      const newxal = this.getDefaultAxl(axl)
      axlsArray.push(newxal)
    })
    axls.forEach((axl, index) => {
      axl.left_tyers.forEach(tyre => {
        const axls = (this.tyreMasterForm.controls.tyre_positions as FormArray).at(index)
        const left_tyers = axls.get('left_tyers') as FormArray
        const right_tyers = axls.get('right_tyers') as FormArray
        left_tyers.push(this.getDefaultTyre())
        right_tyers.push(this.getDefaultTyre())
      })
    })
    this.namingAxel();
    this.namingTyres();
  }

  tyreCount() {
    this.totalTyre = 0;
    const axlsArray = this.tyreMasterForm.controls.tyre_positions as FormArray
    axlsArray.controls.forEach((axl, axlsIndex) => {
      const left_tyers = axl.get('left_tyers') as FormArray
      const right_tyers = axl.get('right_tyers') as FormArray
      left_tyers.controls.forEach((tyre, tyreIndex) => {
        this.totalTyre++;
      })
      right_tyers.controls.forEach((tyre, tyreIndex) => {
        this.totalTyre++
      })
    })
    this.emitTotalTyre.emit(this.totalTyre)
  }

  addNewTyreBrand(event) {
    if (event) {
      this.tyreBrandParam = {
        name:trimExtraSpaceBtwWords(event)
      };
    }
  }

  getNewTyreBrand(event, form: FormGroup) {
    if (event) {
      form.get('brand').setValue(event.label)
      form.get('model').setValue('')
      form.get('model_list').setValue([])
      setUnsetValidators(form, 'model', [Validators.required])
      this._tyreMaster.getTyreBrand().subscribe((response) => {
        this.tyreBrand = response['result']
      });
    }
  }

  getAllBrands() {
    this._tyreMaster.getTyreBrand().subscribe((response) => {
      this.tyreBrand = response['result']
    });
  }


  onBrandSelected(form: FormGroup) {
    this._tyreMaster.getTyreModel(form.get('brand').value).subscribe((response) => {
      form.get('model').setValue('');
      setUnsetValidators(form, 'model', [Validators.required])
      form.get('model_list').setValue(response.result)
    });
  }

  getNewTyreModel(event, form: FormGroup) {
    if (event) {
      this._tyreMaster.getTyreModel(form.get('brand').value).subscribe((response) => {
        form.get('model').setValue(event.label);
        form.get('model_list').setValue(response.result)
      });
    }
  }

  addNewTyreModel(event) {
    if (event) {
      const val = trimExtraSpaceBtwWords(event);
      this.tyreModelParam = {
        name: val
      };
    }
  }

  getTyrePlacementOnMakeAndModel(data) {
    this.buildVehicleTyrePositions([])
    const spare_tyre = this.tyreMasterForm.controls.spare_tyres_info as FormArray
    spare_tyre.controls = [];
    if (data['make'] && data['model']) {
      this.$subscriptionList.push(this._tyreMaster.getTyrePlacementOnMakeAndModel(data['make'], data['model']).subscribe(resp => {
        if(this.hasControl('tyres')){
          this.tyreMasterForm.get('tyres').setValue(resp['result'])
        }else{
          this.tyreMasterForm.addControl('tyres', this._fb.control(resp['result']))
        }
        this.tyrePlacementDetails = resp['result'];
        for (let index = 0; index < resp['result'].spare_count; index++) {
          this.builtSpareTyres('Spare ' + (index + 1))
        }
        this.patchAxls(resp['result'].tyre_placements)
      }))
    }
  }

  hasControl(controlName: string): boolean {
    return this.tyreMasterForm.get(controlName) != null;
  }

  patchTyrePlacementOnMakeAndModel(data) {
    this.buildVehicleTyrePositions([])
    const spare_tyre = this.tyreMasterForm.controls.spare_tyres_info as FormArray
    spare_tyre.controls = [];
    this.tyreMasterForm.addControl('tyres', this._fb.control(data.tyres))
    this.tyrePlacementDetails = data.tyres;
    for (let index = 0; index < data.tyres.spare_count; index++) {
      this.builtSpareTyres('Spare ' + (index + 1))
    }
    this.patchAxls(data.tyres.tyre_placements);
    setTimeout(() => {
      this.patchSpareInfo(data.spares_info)
      this.patchTyreInfo(data.tyres_info)
    }, 100);

  }

  patchSpareInfo(data = []) {
    data.forEach((spare, index) => {
      const spareForm = (this.tyreMasterForm.controls.spare_tyres_info as FormArray).at(index);
      spare['name'] = spare['position_name']
      spareForm.patchValue(spare)
      if (spare['brand']) {
        this.$subscriptionList.push(this._tyreMaster.getTyreModel(spare['brand']).subscribe((response) => {
          spareForm.get('model_list').setValue(response.result)
        }));
      }
    })
  }

  patchTyreInfo(data = []) {
    let tyreNameWithIndex = {}
    data.forEach(((tyre, index) => {
      tyre['name'] = tyre['position_name'];
      tyreNameWithIndex[tyre['name']] = index
    }))

    const axlsArray = this.tyreMasterForm.controls.tyre_positions as FormArray
    axlsArray.controls.forEach((axl) => {
      const left_tyers = axl.get('left_tyers') as FormArray
      const right_tyers = axl.get('right_tyers') as FormArray
      left_tyers.controls.forEach((tyre) => {
        tyre.patchValue(data[tyreNameWithIndex[tyre.value['name']]])
        if (tyre.value['brand']) {
          this.$subscriptionList.push(this._tyreMaster.getTyreModel(tyre.value['brand']).subscribe((response) => {
            tyre.get('model_list').setValue(response.result)
          }));
        }
      })
      right_tyers.controls.forEach((tyre) => {
        tyre.patchValue(data[tyreNameWithIndex[tyre.value['name']]])
        if (tyre.value['brand']) {
          this.$subscriptionList.push(this._tyreMaster.getTyreModel(tyre.value['brand']).subscribe((response) => {
            tyre.get('model_list').setValue(response.result)
          }));
        }
      })
    })
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  builtSpareTyres(name) {
    const spare_tyre = this.tyreMasterForm.controls.spare_tyres_info as FormArray
    spare_tyre.push(this.getDefaultTyre(name))
  }

  addTyreMaster(url) {
    this.isRedirect = true;
    const brand=this.tyreMasterForm.get('brand').value
    url=url+"?make="+brand['make']+"&model="+brand['model']
    window.open(url, '_blank')
  }


}


