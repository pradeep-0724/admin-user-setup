import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appRemoveSpaces]'
})
export class RemoveSpacesDirective {
  constructor(private el: ElementRef) {}

  @HostListener('blur')
  onBlur(): void {
    const input = this.el.nativeElement as HTMLInputElement;
    input.value = input.value.trim();
  }
}
