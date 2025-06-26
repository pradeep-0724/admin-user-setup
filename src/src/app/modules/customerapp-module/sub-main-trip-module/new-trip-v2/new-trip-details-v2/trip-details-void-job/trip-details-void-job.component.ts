import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { CurrencyService } from 'src/app/core/services/currency.service';

@Component({
  selector: 'app-trip-details-void-job',
  templateUrl: './trip-details-void-job.component.html',
  styleUrls: ['./trip-details-void-job.component.scss']
})
export class TripDetailsVoidJobComponent implements OnInit {

  currency_type ;
  constructor( private dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) private dialogData: any,private currency: CurrencyService,) { }

  ngOnInit(): void {
    this.currency_type = this.currency.getCurrency();
    console.log(this.dialogData);
  } 

  close(flag){
    this.dialogRef.close(flag);
  }
}