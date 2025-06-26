import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { PartyAdvanceDriverComponent } from './party-advance-driver.component';



@NgModule({
  declarations: [PartyAdvanceDriverComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    SharedModule,
  ],
  exports:[PartyAdvanceDriverComponent]
})
export class PartyAdvanceDriverModule{ }
