import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { costComponent } from './cost/cost.component';

const routes: Routes = [
  { path: 'manage', component: costComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],



  exports: [RouterModule],
})
export class costRoutingModule { }

export const routedComponents = [
  costComponent,
];
