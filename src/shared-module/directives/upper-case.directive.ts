import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appUpperCase]'
})
export class UpperCaseDirective {

  constructor(
    private readonly control: NgControl
  ) { }

  @HostListener('input', ['$event.target'])
  public onInput(input: HTMLInputElement): void {
    const currentValue = input.selectionStart;
    this.control.control.setValue(input.value.toUpperCase());
    input.setSelectionRange(currentValue, currentValue);
  }
}
