import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';


@Directive({
  selector: '[twoDigitDecimalNumber]'
})
export class TwoDigitDecimalNumber {
  private regex: RegExp = new RegExp(/^-?\d*\.?\d{0,3}$/g);
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
  constructor(private ngControl: NgControl) {
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    const input = event.target as HTMLInputElement;
    let current: string = input.value;
    const position = input.selectionStart;
    const next: string = [current.slice(0, position), event.key == 'Decimal' ? '.' : event.key, current.slice(position)].join('');
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
}

@HostListener('focusout', ['$event'])
onFocusOut(event: KeyboardEvent) {
  const input = event.target as HTMLInputElement;
  let value: string = input.value;

  value = parseFloat(value).toFixed(3);
  if (typeof value === "string" && !Number.isNaN(Number(value))) {
    this.ngControl.control.setValue(value);
} else
    this.ngControl.control.setValue('0');
}
}
