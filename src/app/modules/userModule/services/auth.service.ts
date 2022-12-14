import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpParams, HttpClient } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { Observable, throwError, observable } from "rxjs";
import { ApiService } from '../../core/services/index';
import { Subject } from "rxjs";
import { environment } from '../../../../environments/environment';
import { UserInfoService } from '../../shared/auth/userInfoService';

@Injectable({ providedIn: 'root' })
export class authService {

    constructor(private _api: ApiService,
        private router: Router,
        private http: HttpClient,
        private userService: UserInfoService) { }


    //login user
    loginUser(data) {
        return this._api.post(`${"users/login"}`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => error)
            );
    }



}

