import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[positiveDigitNumber]'
})
export class PositiveDigitNumber {
  private regex: RegExp = new RegExp(/^\d*$/g);
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
  constructor(private ngControl: NgControl) {
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    const input = event.target as HTMLInputElement;
    let current: string = input.value;
    const next: string = current.concat(event.key);
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
}

  @HostListener('focusout', ['$event'])
  onFocusOut(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    let value: string = input.value;
    value = parseInt(value).toFixed(0);
    if (typeof value === "string" && !Number.isNaN(Number(value))) {
      this.ngControl.control.setValue(value);
  } else
      this.ngControl.control.setValue('0');
  }
  }
