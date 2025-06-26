import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { VehicleInspectionServiceService } from '../../../api-services/vehicle-inspection/vehicle-inspection-service.service';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-vehicle-inspection-view',
  templateUrl: './vehicle-inspection-view.component.html',
  styleUrls: ['./vehicle-inspection-view.component.scss']
})
export class VehicleInspectionViewComponent implements OnInit {

  isFormList = false;
  siteInspectionId=''
  vehicleInspectionDetails;
  activeDoc=0;
  prefixUrl=getPrefix();
  vehicleInspection = Permission.vehicleInspection.toString().split(',')[1]
  vehicleCategiriesObj={
    hasMultipleCategories:false,
    categories:[]
  }
  constructor(private _route:ActivatedRoute,private router:Router,private scrollToTop : ScrollToTop,
    private _vehicleInspectionService : VehicleInspectionServiceService, private _commonService: CommonService,) { }

  ngOnInit(): void {
    this.scrollToTop.scrollToTop();
    this._commonService.getVehicleCatagoryType().subscribe(resp => {
      this.vehicleCategiriesObj.categories = resp['result']['categories']
    })
    this._route.queryParamMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('fromlist')) {
        this.isFormList = true;
      }
    });
    this._route.params.subscribe(parms => {
      if (parms['inspectionId']) {
        this.siteInspectionId = parms['inspectionId'];
        this.getSiteInspectionView()
      }
    });
  }
  historyBack() {
    if(this.isFormList){
      history.back();
    }else{
     this.router.navigate([getPrefix()+'/vehicle-inspection/list'])
    }

  }

  getSiteInspectionView(){
    this._vehicleInspectionService.getVehicleInspectionDetails( this.siteInspectionId).subscribe(resp=>{
      this.vehicleInspectionDetails=resp['result']
    })
  }

  getVehicleCategory(category){
    if(category==0) return 'others'
    if(category==1) return 'crane'
    if(category==2) return 'awp'
   }

   changeDocument(i) {
    this.activeDoc = i
  }
  haveUploadField(arr){
   return  arr.some((field)=>field.field_type=='upload'  )
  }
  haveOtherField(arr){
    return  arr.some((field)=>field.field_type!='upload'  )
  }
  getMaintenaceValue(value){
    let obj = {
      '-1' : '-',
      0: 'No',
      1 : 'Minor',
      2: 'Major',
    }
    return obj[Number(value)]
  }


}
