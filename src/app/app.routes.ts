import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
    {path : '' ,
    loadChildren: ()=> import('../modules/sign-up-module/sign-up-module.module').then(m=>m.SignUpModuleModule)
    },

    //     {
    //     path : '',
    //     component: AppComponent
    // }

];

@NgModule({
    imports : [RouterModule.forChild(routes)],
    exports : [RouterModule]
})
export class AppRoutingModule{}