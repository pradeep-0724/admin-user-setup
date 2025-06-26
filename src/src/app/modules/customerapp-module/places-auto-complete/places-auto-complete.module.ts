import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlacesAutoComplteComponent } from './places-auto-complte.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';




@NgModule({
  declarations: [
    PlacesAutoComplteComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,

  ],
  exports:[PlacesAutoComplteComponent]
})
export class PlacesAutoCompleteModule { }
