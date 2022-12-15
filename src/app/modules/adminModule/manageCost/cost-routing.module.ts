import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { costComponent } from './cost/cost.component';
import { appNamesComponent } from './appNames/appNames.component';

const routes: Routes = [
  { path: 'manage', component: costComponent },
  { path: 'app-names', component: appNamesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],

  exports: [RouterModule],
})
export class costRoutingModule {}

export const routedComponents = [costComponent, appNamesComponent];
