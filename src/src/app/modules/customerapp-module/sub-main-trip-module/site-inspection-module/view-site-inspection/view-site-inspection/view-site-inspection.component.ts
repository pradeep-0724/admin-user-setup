import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { SiteInspectionServiceService } from '../../../../api-services/trip-module-services/site-inspection-service/site-inspection-service.service';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-view-site-inspection',
  templateUrl: './view-site-inspection.component.html',
  styleUrls: ['./view-site-inspection.component.scss']
})
export class ViewSiteInspectionComponent implements OnInit {
  isFormList = false;
  siteInspectionId=''
  siDetails;
  activeDoc=0;
  prefixUrl=getPrefix();
  vehicleCategiriesObj={
    hasMultipleCategories:false,
    categories:[]
  }
  siteInspection=Permission.siteInspection.toString().split(',')
  constructor(private _route:ActivatedRoute,private router:Router,private _commonservice:CommonService,
    private _siteInspectionServiceService: SiteInspectionServiceService,private scrollToTop : ScrollToTop) { }

  ngOnInit(): void {
    this.scrollToTop.scrollToTop();
    this._commonservice.getVehicleCatagoryType().subscribe(resp => {
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
     this.router.navigate([getPrefix()+'/trip/site-inspection/list'])
    }

  }

  getSiteInspectionView(){
    this._siteInspectionServiceService.getSiteInspectionDetails( this.siteInspectionId).subscribe(resp=>{
      this.siDetails=resp['result']
     

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


}
