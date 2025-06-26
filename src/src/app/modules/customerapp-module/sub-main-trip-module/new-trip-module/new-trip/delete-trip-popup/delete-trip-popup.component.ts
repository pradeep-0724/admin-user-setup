import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NewTripService } from '../../../../api-services/trip-module-services/trip-service/new-trip-service';

@Component({
  selector: 'app-delete-trip-popup',
  templateUrl: './delete-trip-popup.component.html',
  styleUrls: ['./delete-trip-popup.component.scss']
})
export class DeleteTripPopupComponent implements OnInit {
  incomingDeleteParams: any = {selectedTab: "", params: {}, show: false}
  @Output() onDeleteCompletion = new EventEmitter<boolean>()

  @Input()
  set deleteParams(data: any) {
    this.incomingDeleteParams = data
    this.popupInputData.show = this.incomingDeleteParams.show;
  }

  get deleteParams() {
    return this.incomingDeleteParams
  }

  popupInputData = {
		'msg': 'Are you sure, you want to delete?',
		'type': 'warning',
		'show': false
	}

  constructor(private _tripService: NewTripService) { }

  ngOnInit() {
  }


  confirmButton(event) {
		if (event) {
			this.deleteSelectedType()

		}
	}

  onDeleteComplete() {
    this.popupInputData.show = false;
    this.incomingDeleteParams = {selectedTab: "", params: {}}
    this.onDeleteCompletion.emit()
  }

  deleteSelectedType(){
    const type = this.incomingDeleteParams.selectedTab;
    const params = this.incomingDeleteParams.params;
    switch (type) {

      case 'other-expenses':
        this._tripService.deleteTripType(params.id , 'expenses').subscribe(response=>{
          this.onDeleteComplete()
        })
        break;

      case 'party-charge-bill':
        this._tripService.deleteTripType(params.id , 'charges').subscribe(response=>{this.onDeleteComplete()})
        break;

      case 'vp-charge-bill':
        this._tripService.deleteTripType(params.id , 'charges').subscribe(response=>{this.onDeleteComplete()})
        break;

      case 'vp-charge-reduce-bill':
        this._tripService.deleteTripType(params.id , 'charges').subscribe(response=>{this.onDeleteComplete()})
        break;

      case 'party-charge-reduce-bill':
        this._tripService.deleteTripType(params.id , 'charges').subscribe(response=>{this.onDeleteComplete()})
        break;

      case 'driver-advance':
        this._tripService.putNewTripAdd(params.id, {customer_driver_allowance: 0}, 'allowances').subscribe(response => {this.onDeleteComplete()})
        break;

      case 'fuel-advance':
        this._tripService.deleteTripType(params.id , 'advance_fuels').subscribe(response=>{this.onDeleteComplete()})
        break;

      case 'fuel-bill':
        this._tripService.deleteTripType(params.id , 'self_fuels').subscribe(response=>{this.onDeleteComplete()})
        break;

      case 'party-advance':
        this._tripService.deleteTripType(params.id , 'party_advances').subscribe(response=>{this.onDeleteComplete()})
        break;

      case 'vp-advance':
        this._tripService.deleteTripType(params.id , 'vp_advances').subscribe(response=>{this.onDeleteComplete()})
        break;

      case 'driver-allowance':
        this._tripService.deleteTripType(params.id , 'allowances').subscribe(response=>{this.onDeleteComplete()})
        break;

      default:
        break;
    }

    }

}
