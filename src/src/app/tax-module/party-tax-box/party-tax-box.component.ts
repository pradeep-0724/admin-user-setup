import { Component, OnInit, Output ,EventEmitter, Input} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-party-tax-box',
  templateUrl: './party-tax-box.component.html',
  styleUrls: ['./party-tax-box.component.scss']
})
export class PartyTaxBoxComponent implements OnInit {
  @Output() partyTax = new EventEmitter<any>();
  @Input()isTaxValid :Observable<any>;
  @Input()isEdit :boolean;
  @Input() taxEditData :Observable<any>
  @Input() isLarge=true;
  taxEdit =false;
  indianPartyPatchData=new BehaviorSubject({})

  makeFormDirty =new BehaviorSubject(true)
  constructor() { }

  ngOnInit() {
    this.isTaxValid.subscribe(data=>{
      this.makeFormDirty.next(data)
    })
      this.taxEdit =this.isEdit
      if(this.isEdit){
        this.taxEditData.subscribe(data=>{
          this.indianPartyPatchData.next(data)
        })
      }

  }

  outputData(data){
    this.partyTax.emit(data);
  }

}
