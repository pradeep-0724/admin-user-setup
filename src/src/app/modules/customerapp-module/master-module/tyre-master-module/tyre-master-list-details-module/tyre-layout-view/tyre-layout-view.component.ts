import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-tyre-layout-view',
  templateUrl: './tyre-layout-view.component.html',
  styleUrls: ['./tyre-layout-view.component.scss']
})
export class TyreLayoutViewComponent implements OnInit ,AfterViewInit{
  tyreMasterForm: UntypedFormGroup;
  editData=new Subject();
  @Input() tyreLayout={
    open:false,
    data:{}
  }

  constructor( private _fb: UntypedFormBuilder,) { }

  ngOnInit(): void {
    this.tyreMasterForm = this._fb.group({
      tyre_positions: this._fb.array([])
    });
  }

  ngAfterViewInit(): void {
    this.editData.next(this.tyreLayout.data['tyre_placements'])
  }


  close(){
    this.tyreLayout.open=false;
  }

}
