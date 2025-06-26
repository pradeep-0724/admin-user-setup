import { UntypedFormGroup, UntypedFormBuilder} from '@angular/forms';
import { Component, Input, OnInit, Output, SimpleChanges, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-trip-fuel-expenses',
  templateUrl: './trip-fuel-expenses.component.html',
  styleUrls: ['./trip-fuel-expenses.component.scss']
})
export class TripFuelExpensesComponent implements OnInit {
  tripFuelExpenseForm :UntypedFormGroup;
  @Input() fuelPurchesed=0;
  @Input() partyAdvance=0;
  @Input() onStock =0;
  @Output() tripFuelOutPutData = new EventEmitter()
  ischangeInstockPositive =true;
  constructor(private _fb:UntypedFormBuilder) { }

  ngOnInit() {
    this.tripFuelExpenseForm=this._fb.group({
      fuel_purchesed:0.00,
      party_advance:0.00,
      total:0.00,
      trip_fuel:0.0,
      change_on_stock:0.00
    });
  }

  calculation(){
   const form = this.tripFuelExpenseForm;
   const partyAdvance = form.get('party_advance').value;
   const fuelPurchesed = form.get('fuel_purchesed').value;
   form.get('total').setValue((Number(partyAdvance)+Number(fuelPurchesed)).toFixed(3));
   const total = form.get('total').value;
   const fuelTrip = form.get('trip_fuel').value;

   form.get('change_on_stock').setValue(((Number(total)-Number(fuelTrip))+Number(this.onStock)).toFixed(3));
   if(Number(fuelTrip)>0 && Number(form.get('change_on_stock').value)<0 ){
    this.ischangeInstockPositive=false;
   }else{
    this.ischangeInstockPositive=true;
   }
  this.tripFuelOutPutData.emit(form.value)
  }

  ngOnChanges(changes: SimpleChanges): void {
      setTimeout(() => {
        this.tripFuelExpenseForm.get('fuel_purchesed').setValue(this.fuelPurchesed);
        this.tripFuelExpenseForm.get('party_advance').setValue(this.partyAdvance);
        this.onStock = this.onStock;
        this.calculation();
      }, 100);
  }

}
