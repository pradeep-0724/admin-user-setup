import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-driver-expiry',
  templateUrl: './driver-expiry.component.html',
  styleUrls: ['./driver-expiry.component.scss']
})
export class DriverExpiryComponent implements OnInit {
  @Input()driversNotEligible=[];
  driverList=''
  constructor() { }

  ngOnInit(): void {
    this.driverList = this.driversNotEligible.join(', ')
  }

}
