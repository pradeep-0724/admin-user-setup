import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-credit-limit',
  templateUrl: './credit-limit.component.html',
  styleUrls: ['./credit-limit.component.scss']
})
export class CreditLimitComponent implements OnInit {
  
  @Input() creditLimitData = {
    msg: '',
    open: false
  }
  @Output() creditLimit = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  onYes() {
    this.creditLimit.emit(true)
    this.creditLimitData.open = false;
  }

  onCancel() {
    this.creditLimit.emit(false);
    this.creditLimitData.open = false;
  }

}
