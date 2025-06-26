import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tyre-details-view',
  templateUrl: './tyre-details-view.component.html',
  styleUrls: ['./tyre-details-view.component.scss']
})
export class TyreDetailsViewComponent implements OnInit {
  @Input() tyreDetails:any;
  @Input() selectedPosition:string=''
  @Output() onTyreSelect = new EventEmitter<string>();
  @Input() isView:boolean=false;
  @Input () selectedTyres:Set<string>=new Set<string>();
  @Input() formIndex:number;
 
  constructor() { }

  ngOnInit(): void {
  }
  onTyreClick(position){
    this.onTyreSelect.emit(position)

  }

}
