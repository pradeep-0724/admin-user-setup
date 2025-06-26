import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { I3MSComponent } from './i3ms.component';

const routes: Routes = [
    {
        path: '',
        component: I3MSComponent,
    }, 
    {
        path: '',
        redirectTo: 'i3ms',
        pathMatch: 'full'
    }
];

@NgModule({
	imports: [
		RouterModule.forChild(routes)
	],
	exports: [
		RouterModule
	]
})
export class I3MSRoutingModule { 

}
