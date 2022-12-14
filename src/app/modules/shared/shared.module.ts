import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CoreModule } from '../core/core.module';
import { HeaderComponent } from '../shared/components/header/header.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { sharedPopupsModule } from './sharedPopups.module';

import { OrderSearchPipe } from './pipes/orderFilter';




const sharedComponents = [
  HeaderComponent,
  SidebarComponent,
  FooterComponent
];

const customPipes = [
  OrderSearchPipe
]

@NgModule({
  imports: [
    CommonModule,
    NgxPaginationModule,
    RouterModule,
    CoreModule,
    sharedPopupsModule
    
    

  ],
  declarations: [sharedComponents],
  exports: sharedComponents,
  providers: [],
  entryComponents: []
})
export class SharedModule { }
