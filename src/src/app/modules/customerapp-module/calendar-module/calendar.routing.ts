import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalenderV2Component } from './calender-v2/calender-v2.component';

const routes: Routes = [
    {
        path: '',
        component: CalenderV2Component,

    },

    { path: '',
    redirectTo: 'calendar',
    pathMatch: 'full',
   }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CalendarRoutingModule { }
