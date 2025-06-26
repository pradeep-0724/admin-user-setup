import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appLowerCase]'
})
export class LowerCaseDirective {

  constructor(
    public ngControl: NgControl,
  ) { }

  @HostListener('ngModelChange', ['$event'])
  onInputChange(value) {
    if (value && value !== '' && value.length > 0) {
      this.ngControl.valueAccessor.writeValue(value.toLowerCase());
    }
  }
}