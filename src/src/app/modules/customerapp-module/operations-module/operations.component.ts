import { Component} from '@angular/core';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';


@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.scss']
})
export class OperationsComponent{
  collapsed: boolean = false;
  constructor(private scrollToTop:ScrollToTop) {}
  onActivate(_event: any): void {
    this.scrollToTop.scrollToTop();
  }


}
