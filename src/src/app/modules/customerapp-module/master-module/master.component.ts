import { Component} from '@angular/core';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html'
})

export class MasterComponent {
  collapsed: boolean = false;
  constructor(private scrollToTop:ScrollToTop) {}
  onActivate(_event: any): void {
    this.scrollToTop.scrollToTop();
  }

}
