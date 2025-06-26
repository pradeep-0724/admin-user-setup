import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-header-input-field-box',
  templateUrl: './header-input-field-box.component.html',
  styleUrls: ['./header-input-field-box.component.scss']
})
export class HeaderInputFieldBoxComponent implements OnInit {
  @Input() partyDetailsData :Observable<any>;
  @Input() editData :Observable<any>;
  partyDetails= new BehaviorSubject<any>(true);
  @Output () headerTaxDetails = new EventEmitter<any>();
  indianTaxPatch= new BehaviorSubject<any>({});
  indianTaxFormValid= new BehaviorSubject<any>(true);
  @Input() taxFormValid :Observable<any>;
  @Input() showIsInclusive;
  @Input() showTaxFields : boolean = true;
  isInclusive =true;

  constructor() {
   }

  ngOnInit() {
    if(this.showIsInclusive==false){
      this.isInclusive =false
    }
    this.partyDetailsData.subscribe(data=>{
      this.partyDetails.next(data);
    })
    this.editData.subscribe(data=>{
        this.indianTaxPatch.next(data);
    })
    this.taxFormValid.subscribe(data=>{
      this.indianTaxFormValid.next(data);
    })
  }

  indianHeaderTax(data){
    this.headerTaxDetails.emit(data);
  }

}
