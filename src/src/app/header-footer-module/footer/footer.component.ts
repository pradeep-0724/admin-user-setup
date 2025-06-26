import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  @Input() routeChange = new BehaviorSubject(false);
  version: string;
  isDashBoard = false;
  constructor() { }

  ngOnInit() {
    this.version = environment.version; 
    this.routeChange.subscribe(data=>{
      if(data){
        this.isDashBoard = location.href.includes('dashboard');
      }
    })
  }

}
