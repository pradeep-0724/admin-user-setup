import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialDropdownComponent } from './material-dropdown/material-dropdown.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { OptionsListFilterPipe } from './add-drop-down-search.pipe';



@NgModule({
  declarations: [MaterialDropdownComponent,OptionsListFilterPipe],
  imports: [
    CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
  ],
  exports:[MaterialDropdownComponent]
})
export class MaterialDropDownModule { }
