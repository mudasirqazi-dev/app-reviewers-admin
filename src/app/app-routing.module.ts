import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { adminGuard } from './modules/shared/auth/adminGuard';

const routes: Routes = [

  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'user',
    loadChildren: () => import('./modules/userModule/user.module').then(m => m.userModule),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./modules/adminModule/admin.module').then(m => m.adminModule),
    canActivate: [adminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {

    scrollPositionRestoration: 'enabled', // Add options right here
  })],
  exports: [RouterModule],
  providers: [adminGuard]
})
export class AppRoutingModule {

}
