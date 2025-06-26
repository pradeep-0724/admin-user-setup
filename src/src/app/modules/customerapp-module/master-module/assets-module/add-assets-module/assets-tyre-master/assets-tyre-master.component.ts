import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-assets-tyre-master',
  templateUrl: './assets-tyre-master.component.html',
  styleUrls: ['./assets-tyre-master.component.scss']
})
export class AssetsTyreMasterComponent implements OnInit {

  @Input()assetsDetailsForm:FormGroup
  @Input()editTyreDetails?: Observable<any>;

  constructor() { }

  ngOnInit(): void {
  }

}
