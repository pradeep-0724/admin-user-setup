import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserModuleRoutingModule } from './user-module-routing.module';
import { UsersComponent } from './users/users.component';
import {MatDialogModule} from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AddUserComponent } from './users/adduser.component';
import {MatChipsModule} from '@angular/material/chips';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';



@NgModule({
    declarations: [UsersComponent, AddUserComponent],
    imports: [
        CommonModule,
        UserModuleRoutingModule,
        MatDialogModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        MatChipsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatAutocompleteModule,
        MatTooltipModule
    ]
})
export class UserModuleModule { }
