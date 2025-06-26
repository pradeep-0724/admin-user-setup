import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddZoneComponent } from './add-zone/add-zone.component';
import { ZoneListComponent } from './zone-list/zone-list.component';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { NgxPermissionsGuard } from 'ngx-permissions';

const routes: Routes = [
  {
    path: 'add',
    component : AddZoneComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:Permission.zone.toString().split(',')[0],
      }
    }
  },
  {
    path: 'edit/:id',
    component : AddZoneComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:Permission.zone.toString().split(',')[1],
      }
    }
  },
  {
    path : 'list',
    component : ZoneListComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:Permission.zone.toString().split(',')[3],
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ZoneRoutingModule { }
