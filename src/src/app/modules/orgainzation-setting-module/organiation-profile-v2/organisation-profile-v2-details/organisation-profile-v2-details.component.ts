import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { CompanyServices } from 'src/app/modules/customerapp-module/api-services/company-service/company-services.service';

@Component({
  selector: 'app-organisation-profile-v2-details',
  templateUrl: './organisation-profile-v2-details.component.html',
  styleUrls: ['./organisation-profile-v2-details.component.scss']
})
export class OrganisationProfileV2DetailsComponent implements OnInit {

   companyData: Subject<any>=new Subject();
   newobs :Observable<any>=new Observable()

  constructor(
    private _companyService: CompanyServices,private scrolltotp: ScrollToTop
  ) { }

  ngOnInit(): void {
    this.scrolltotp.scrollToTop()
    this.getCompanyData()
  }

  getCompanyData(){
    this._companyService.getCompanyDetail().subscribe((data: any) => {
      this.companyData.next(data.result)     
    });
  }

  isReload(e){
    setTimeout(() => {
      this.getCompanyData()
    }, 600);
  }
  

}
