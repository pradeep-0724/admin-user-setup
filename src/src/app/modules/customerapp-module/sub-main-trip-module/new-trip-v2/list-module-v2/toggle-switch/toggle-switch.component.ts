import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-toggle-switch',
  templateUrl: './toggle-switch.component.html',
  styleUrls: ['./toggle-switch.component.scss']
})
export class ToggleSwitchComponent implements OnInit {
  checked:boolean=true;
  @Output() checkedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
      if(!paramMap.has('selectedTab')){
        this.checked = true;
      }
      if(paramMap.has('list_type')){
        if(paramMap.get('list_type') === 'overall'){
          this.checked = true;
        }else{
          this.checked = false;
        }
      }
    });
  }
  
  onToggle() {
    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
  }

}
