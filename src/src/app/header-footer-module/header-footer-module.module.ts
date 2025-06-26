import { AlertPopupModuleModule } from './../alert-popup-module/alert-popup-module.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { NgxPermissionsModule } from 'ngx-permissions';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [HeaderComponent,FooterComponent],
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    MatBadgeModule,
    RouterModule,
    NgxPermissionsModule.forChild(),
    AlertPopupModuleModule,
  ],
  exports:[HeaderComponent,FooterComponent],
})
export class HeaderFooterModuleModule { }
