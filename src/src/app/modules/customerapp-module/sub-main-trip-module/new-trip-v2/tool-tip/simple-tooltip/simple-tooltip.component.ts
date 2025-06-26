import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-simple-tooltip',
  templateUrl: './simple-tooltip.component.html',
  styleUrls: ['./simple-tooltip.component.scss']
})
export class SimpleTooltipComponent implements OnInit {
@Input()fs:Number=16;
@Input()ml:Number=7;
@Input()infoText:string=""
  constructor() { }

  ngOnInit(): void {
  }

}
