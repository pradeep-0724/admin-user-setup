import { Component, Input, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-trip-v2-status',
  templateUrl: './trip-v2-status.component.html',
  styleUrls: ['./trip-v2-status.component.scss']
})
export class TripV2StatusComponent implements OnInit {
  @Input() statusDetails=[]
  @Input() statusType:string='';
  statusId= Math.floor(Math.random() * (100 - 1 + 1)) + 1;
  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    center:false,
    autoWidth:true, 
    navSpeed: 450,
    autoHeight:false,
    navText: ['&#11013;','&#x27A1;'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 3
      },
      1000: {
        items: 3
      },
      2000: {
        items: 3
      }
    },
    nav: true
  }
  constructor() { }

  ngOnInit(): void {
    
  }

}
