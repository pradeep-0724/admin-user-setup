import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { NgxPermissionsGuard } from 'ngx-permissions';


const routes: Routes = [
      {
        path: 'add',
        canActivate: [NgxPermissionsGuard],
        loadChildren:() => import('./add-journal-entry-component/add-journal-entry.module').then(m=>m.AddJournalEntryModule),
        data: {
					permissions: {
						only: 'journal_entry__create',
					}
				},
      },
      {
        path: 'list',
        canActivate: [NgxPermissionsGuard],
        loadChildren:() =>import('./list-journal-entry-component/list-journal-entry.module').then(m=>m.ListJournalEntryModule),
        data: {
					permissions: {
						only: 'journal_entry__view',
					}
				},
      },
      {
        path: TSRouterLinks.edit + '/:journal_id',
        loadChildren:() => import('./edit-journal-enrty-component/edit-journal-entry.module').then(m=>m.EditJournalEntryModule),
        canActivate: [NgxPermissionsGuard],
        data: {
					permissions: {
						only: 'journal_entry__edit',
					}
				},
      },
      {
        path: '',
        redirectTo: 'add',
        pathMatch: 'full',
        data: {
					permissions: {
						only: 'journal_entry__create',
					}
				},
      }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JournalEntryRoutingModule { }
