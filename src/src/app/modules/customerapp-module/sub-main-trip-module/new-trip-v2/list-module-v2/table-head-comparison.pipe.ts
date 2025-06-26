import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isItemHeaderValidPipe',
  pure: true
})
export class IsItemHeaderValidPipe implements PipeTransform {
  transform(head: string, headsToCompare: Set<string>, shouldHave: boolean = true): boolean {
    return shouldHave ? headsToCompare.has(head) : !headsToCompare.has(head);
  }
}