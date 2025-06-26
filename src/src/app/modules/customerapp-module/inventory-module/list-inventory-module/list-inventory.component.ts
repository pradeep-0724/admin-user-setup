import { Component, OnInit } from '@angular/core';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';

@Component({
  selector: 'app-list-inventory',
  templateUrl: './list-inventory.component.html',
  styleUrls: ['./list-inventory.component.scss']
})
export class ListInventoryComponent implements OnInit {

  isAllowedOne: boolean = false;
  prefixUrl: string;
  inventory_adjustment =Permission.inventory_adjustment.toString().split(',');
  constructor(private _prefixUrl:PrefixUrlService) { }

  ngOnInit() {
    this.prefixUrl = this._prefixUrl.getprefixUrl();
  }
}
