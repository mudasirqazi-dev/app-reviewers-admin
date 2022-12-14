import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
// import { AuthenticationService } from '../_services';
import { alert } from './../services/sweetAlert.service';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(
        public alert: alert
    ) { }


    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {

            // console.log('error.interceptor.ts->intercept', err)
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                // this.authService.logout();
            }

            this.alert.responseAlert(err.error.message, 'error')
            const error = err.error.message || err.statusText;
            return throwError(error);
        }))
    }





}