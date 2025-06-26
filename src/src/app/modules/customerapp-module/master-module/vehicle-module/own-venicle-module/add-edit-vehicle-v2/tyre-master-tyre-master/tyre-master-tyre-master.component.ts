import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tyre-master-tyre-master',
  templateUrl: './tyre-master-tyre-master.component.html',
  styleUrls: ['./tyre-master-tyre-master.component.scss']
})
export class TyreMasterTyreMasterComponent implements OnInit {
  @Input()vehicleDetailsForm:FormGroup
  @Input()editTyreDetails?: Observable<any>;
  constructor() { }

  ngOnInit(): void {
  }

}
