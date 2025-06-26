import { Component, Input, OnInit ,Output,EventEmitter} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-advance-payment-box',
  templateUrl: './advance-payment-box.component.html',
  styleUrls: ['./advance-payment-box.component.scss']
})
export class AdvancePaymentBoxComponent implements OnInit {
  @Input() editData :Observable <any>
  paymentPatch = new BehaviorSubject<any>({});
  @Input() taxFormValid :Observable <any>;
  @Input() gstin ;
  isPlaceOfSupplyRequired = new BehaviorSubject<any>(false);
  @Output () paymentTax = new EventEmitter<any>();
  isFormValid  = new BehaviorSubject<any>(true);

  constructor() { }

  ngOnInit() {
    this.editData.subscribe(data=>{
      this.paymentPatch.next(data)
    })
    this.taxFormValid.subscribe(data=>{
      this.isFormValid.next(data);
    })
  }

  indianHeaderTax(data){
   this.paymentTax.emit(data)
  }

  ngOnChanges(): void {
    this.gstin = this.gstin;
    if(this.gstin){
      if(this.gstin=='Unregistered'){
        this.isPlaceOfSupplyRequired.next(false)
      }else{
        this.isPlaceOfSupplyRequired.next(true)
      }
    }else{
      this.isPlaceOfSupplyRequired.next(false)
    }
    
  }

}
