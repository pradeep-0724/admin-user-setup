import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrencyService } from 'src/app/core/services/currency.service';

@Component({
  selector: 'app-trip-details-delivery-note-section',
  templateUrl: './trip-details-delivery-note-section.component.html',
  styleUrls: ['./trip-details-delivery-note-section.component.scss']
})
export class TripDetailsDeliveryNoteSectionComponent implements OnInit {
  @Input() deliveryNoteData:Observable<any>
  currency_type: any
  constructor(private currency: CurrencyService) { }


  ngOnInit(): void {
    this.currency_type = this.currency.getCurrency();

  }

}
