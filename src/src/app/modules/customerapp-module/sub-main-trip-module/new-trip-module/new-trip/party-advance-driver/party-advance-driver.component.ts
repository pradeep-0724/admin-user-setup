import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { NewTripDataService } from '../new-trip-data.service';

@Component({
  selector: 'app-party-advance-driver',
  templateUrl: './party-advance-driver.component.html',
  styleUrls: ['./party-advance-driver.component.scss']
})
export class PartyAdvanceDriverComponent implements OnInit {

  partyAdvanceDriver  :UntypedFormGroup;
  partyAdvanceDataDeriver ='';
  @Output () dataFromDriverAdvance =new EventEmitter<any>();
  constructor(private _fb:UntypedFormBuilder,private _newTripFuelService:NewTripDataService) { }

  ngOnInit() {
    this.buildForm();
    this.partyAdvanceDataDeriver = this._newTripFuelService.partyAdvanceDataDeriver;
    if(this.partyAdvanceDataDeriver){
    this.partyAdvanceDriver.patchValue({
      customer_driver_allowance:this.partyAdvanceDataDeriver
    })
    }else{
    }
   this.partyAdvanceDriver.valueChanges.subscribe(data=>{
    this._newTripFuelService.partyAdvanceDataDeriver = data['customer_driver_allowance'];
    this.dataFromDriverAdvance.emit({
      isFormValid: this.partyAdvanceDriver.valid,
      allData:[data]
    })
   })
  }

  buildForm(){
    this.partyAdvanceDriver = this._fb.group({
      customer_driver_allowance:[0.00]
    })
  }





}
