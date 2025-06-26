import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilePicComponent } from './profile-pic/profile-pic.component';



@NgModule({
  declarations: [ProfilePicComponent],
  imports: [
    CommonModule
  ],
  exports:[ProfilePicComponent]
})
export class ProfilePicModule{ }
