import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { adminGuard } from '../shared/auth/adminGuard';
import { adminPanelComponent } from './adminPanel/adminPanel.component';



const routes: Routes = [
  { path: '', component: adminPanelComponent },
  {
    path: 'users',
    loadChildren: () => import('./manageUsers/users.module').then(m => m.usersModule),
    canActivate: [adminGuard]
  },
  {
    path: 'cost',
    loadChildren: () => import('./manageCost/cost.module').then(m => m.costModule),
    canActivate: [adminGuard]
  },
  {
    path: 'setting',
    loadChildren: () => import('./settings/manageprofile.module').then(m => m.manageProfileModule),
    canActivate: [adminGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],



  exports: [RouterModule],
  providers: [adminGuard]
})
export class adminRoutingModule { }

export const routedComponents = [
  adminPanelComponent,


];
