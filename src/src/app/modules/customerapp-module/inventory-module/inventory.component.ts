import { Component} from '@angular/core';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent{
  constructor(private scrollToTop:ScrollToTop) {}
  onActivate(_event: any): void {
    this.scrollToTop.scrollToTop();
  }

}
