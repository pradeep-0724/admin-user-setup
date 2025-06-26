import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-permit-locations-side-bar',
  templateUrl: './permit-locations-side-bar.component.html',
  styleUrls: ['./permit-locations-side-bar.component.scss']
})
export class PermitLocationsSideBarComponent implements OnInit {

  @Input() show=false;
  @Output() closePopup = new EventEmitter<boolean>()
  @Input() locations=[];
  searchControl = new FormControl('');
  filteredItems: string[] = [];

  constructor(   ) { }
  ngOnInit(): void {
    this.filteredItems = this.locations;
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300), 
        distinctUntilChanged() 
      )
      .subscribe((searchText: string) => {
        this.filteredItems = this.locations.filter(item =>
          item.name.toLowerCase().includes(searchText.toLowerCase())
        );
      });

  }

  close(){
    this.closePopup.emit(false);
    this.show = false
    
  }

}
