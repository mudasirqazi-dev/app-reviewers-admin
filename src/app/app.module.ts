import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { CoreModule } from './modules/core/core.module';
import { SharedModule } from './modules/shared/shared.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_BASE_HREF, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { ApiService } from './modules/core';
import { ErrorInterceptor } from './modules/shared/interceptors/error.interceptor';
import * as $ from "jquery";
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CoreModule,
    SharedModule,
    BrowserModule,
    NgxDaterangepickerMd.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: resourceProviderFactory,
    //   deps: [resourceService],
    //   multi: true
    // },
    ApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
// export function resourceProviderFactory(provider: resourceService) {
//   return () => provider.loadData();
// }