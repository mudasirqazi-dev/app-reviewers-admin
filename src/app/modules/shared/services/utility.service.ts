import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserInfoService } from '../auth/userInfoService';
import { Location } from '@angular/common';
@Injectable({ providedIn: 'root' })
export class utilityService {



    public constructor(
        public router: Router,
        private userInfoService: UserInfoService,
        private location: Location,
    ) { }



    convertStringToArray(value: string) {
        return value.split(',');
    }
}
