import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-company-tax-box',
  templateUrl: './company-tax-box.component.html',
  styleUrls: ['./company-tax-box.component.scss']
})
export class CompanyTaxBoxComponent implements OnInit {
 @Output() companyTaxData= new EventEmitter<any>();
 @Input() isTaxFormValid :BehaviorSubject<any>;
 @Input() taxDetails :BehaviorSubject<any>;
 isTaxFormValidCompany = new BehaviorSubject(true);
 countryId = new BehaviorSubject('');
 patchCompanyTax = new BehaviorSubject({});
  constructor() { }

  ngOnInit() {
    this.isTaxFormValid.subscribe(data=>{
      this.isTaxFormValidCompany.next(data)
    });
    this.taxDetails.subscribe(data=>{
      if(data['id']){
        this.patchCompanyTax.next(data)
      }
    })
  }

  OutPutData(e){
   this.companyTaxData.emit(e)
  }

}
