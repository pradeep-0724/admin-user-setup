import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/auth.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {

  constructor(private _auth:AuthService) { }
  @Input() show: boolean = false;
  ngOnInit(): void {
  }

  onOkButtonClick() {
    this._auth.postAcceptAggrement().subscribe(resp=>{
      this.show = false
    })

  }

}
