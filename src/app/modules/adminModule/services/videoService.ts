import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpParams, HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError, observable } from 'rxjs';
import { ApiService } from '../../core/services/index';
import { Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UserInfoService } from '../../shared/auth/userInfoService';

@Injectable({ providedIn: 'root' })
export class costService {
  constructor(
    private _api: ApiService,
    private router: Router,
    private http: HttpClient,
    private userService: UserInfoService
  ) {}

  getPerDetailCost() {
    return this._api.get(`${'cost/all'}`).pipe(
      map((res: any) => res),
      catchError((error: any) => error)
    );
  }

  updatePerDetailCost(id, data) {
    return this._api.patch(`${'cost/update/' + id}`, data).pipe(
      map((res: any) => res),
      catchError((error: any) => error)
    );
  }
}
