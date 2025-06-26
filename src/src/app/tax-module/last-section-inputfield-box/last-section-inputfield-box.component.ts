import { BehaviorSubject, Observable } from 'rxjs';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-last-section-inputfield-box',
  templateUrl: './last-section-inputfield-box.component.html',
  styleUrls: ['./last-section-inputfield-box.component.scss']
})
export class LastSectionInputfieldBoxComponent implements OnInit {

  @Input() lastSectionTaxDetails :Observable<any>;

  @Output() lastSectionOutPut = new EventEmitter<any>();


  @Input() lastSectionEditData :Observable<any>;

  tdsDetails = new BehaviorSubject<any>({});
  tdsDetailsPatch = new BehaviorSubject<any>({});


  constructor() { }

  ngOnInit() {
    this.lastSectionTaxDetails.subscribe(data=>{
       this.tdsDetails.next(data);
    })
    this.lastSectionEditData.subscribe(data=>{
      this.tdsDetailsPatch.next(data);
    })
  }

  tdsOutput(data){
    this.lastSectionOutPut.emit(data);
  }

}
