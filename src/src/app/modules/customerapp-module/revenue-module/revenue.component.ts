import { BehaviorSubject } from 'rxjs';
import { Component} from '@angular/core';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';


@Component({
  selector: 'app-revenue',
  templateUrl: './revenue.component.html',
})
export class RevenueComponent{
  collapsed: boolean = false;
  isnewNavigation= new BehaviorSubject(true);
  constructor(private scrollToTop:ScrollToTop) {}
  onActivate(_event: any): void {
    this.scrollToTop.scrollToTop();
    this.isnewNavigation.next(true)
  }

}
