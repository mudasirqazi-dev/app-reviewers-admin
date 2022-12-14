import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { allUsersComponent } from './allUsers/allUsers.component';

const routes: Routes = [
  { path: 'all', component: allUsersComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],



  exports: [RouterModule],
})
export class usersRoutingModule { }

export const routedComponents = [
  allUsersComponent,
];
