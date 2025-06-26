import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { TyremasterListService } from '../../../../api-services/master-module-services/tyre-master-service/tyremaster-list-service.service';

@Component({
  selector: 'app-vehicle-tyre-master-details',
  templateUrl: './vehicle-tyre-master-details.component.html',
  styleUrls: ['./vehicle-tyre-master-details.component.scss']
})
export class VehicleTyreMasterDetailsComponent implements OnInit {


  @Input() tyreMasterId:BehaviorSubject<String>
  tyreMasterData: any=[];
  prefixUrl = ''
  vehicle=Permission.vehicle.toString().split(',')
  constructor(private _prefixUrl:PrefixUrlService ,private _tyremasterListService :TyremasterListService) { }

  ngOnInit() {
    this.prefixUrl = this._prefixUrl.getprefixUrl();
    this.tyreMasterDetails();
  }

  tyreMasterDetails(){
    this.tyreMasterId.subscribe((id)=>{
      this._tyremasterListService.getTyreMasterDetails(id).subscribe((res)=>{
        this.tyreMasterData= res['result'];
      })

    })
  }

  displayTyreImage(length){
    if(length){
    return "../../../../../../assets/img/tyres/"+length+ ".png"
    }
  }

}
