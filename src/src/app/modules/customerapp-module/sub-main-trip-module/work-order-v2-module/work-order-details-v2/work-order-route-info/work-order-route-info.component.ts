import { Component, Input, OnInit } from '@angular/core';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';

@Component({
  selector: 'app-work-order-route-info',
  templateUrl: './work-order-route-info.component.html',
  styleUrls: ['./work-order-route-info.component.scss']
})
export class WorkOrderRouteInfoComponent implements OnInit {
  @Input() workOrderDetail:any
  constructor() { }
  ngOnInit(): void {
  }
  
  convertTYpe(data : string){
    if(isValidValue(data)){
      if(data === 'string'){
        return 'Text'
      }else if (data === 'decimal'){
        return 'Number'
      }else{
        return data.charAt(0).toUpperCase() + data.slice(1)
      }
    }
  }
}
