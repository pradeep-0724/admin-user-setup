import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyModuleServices } from '../customerapp-module/api-services/company-service/company-module-service.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';


@Component({
  selector: 'app-new-add-company',
  templateUrl: './new-add-company.component.html',
  styleUrls: ['./new-add-company.component.scss']
})
export class NewAddCompanyComponent implements OnInit {
  preFixUrl = getPrefix()
  popDetail
  constructor( private observingModel:CompanyModuleServices,private route:Router) { }

  ngOnInit() {
    this.observingModel.isOpen.subscribe(data=>{
      if( data ){
       this.popDetail=data
       this.route.navigateByUrl(this.preFixUrl+'/overview')
      }
    })
  }

}
