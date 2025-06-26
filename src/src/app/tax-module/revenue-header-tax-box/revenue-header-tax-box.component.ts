
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-revenue-header-tax-box',
  templateUrl: './revenue-header-tax-box.component.html',
  styleUrls: ['./revenue-header-tax-box.component.scss']
})
export class RevenueHeaderTaxBoxComponent implements OnInit {

  @Input() partyDetailsData :Observable<any>;
  @Input() taxFormValid :Observable<any>;

  @Input() editData :Observable<any>;
  partyDetails= new BehaviorSubject<any>(true);
  @Output () headerTaxDetails = new EventEmitter<any>();
  dataPatch = new BehaviorSubject<any>({});
  isFormValid= new BehaviorSubject<any>(true);
  constructor() { }

  ngOnInit() {
    this.partyDetailsData.subscribe(data=>{
      this.partyDetails.next(data);
    })

    this.editData.subscribe(data=>{
      this.dataPatch.next(data);
    })
    this.taxFormValid.subscribe(data=>{
      this.isFormValid.next(data);
    })
  }

  indianHeaderTax(data){
    this.headerTaxDetails.emit(data);
  }

}
