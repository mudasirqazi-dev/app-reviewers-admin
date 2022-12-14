import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CoreModule } from '../core/core.module';


const sharedComponents = [

];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    CoreModule,

  ],
  declarations: [sharedComponents
  ],
  exports: sharedComponents,
  providers: [],
  entryComponents: [
    sharedComponents
  ]
})
export class sharedPopupsModule { }
