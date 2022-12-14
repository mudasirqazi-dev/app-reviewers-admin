import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import jwt_decode from 'jwt-decode';

@Injectable()

export class adminGuard implements CanActivate {

  constructor(
    private router: Router,
  ) {
  }


  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    }
    catch (Error) {
      return null;
    }
  }
  canActivate() {
    if (localStorage.getItem('_authad@')) {
      let data = this.getDecodedAccessToken(localStorage.getItem('_authad@'));
      if (data._id && data.role == "superAdmin") {
        // let exp = user.exp
        // if (exp && exp <= Date.now() / 1000) {
        //   this.router.navigate(['/user/login']);
        //   return false;
        // } else {
        return true; //True if the token has not the expiration time field
        // }
        // }
        // return true
      } else {
        this.router.navigate(['/user/login']);
        return false;
      }
    } else {
      this.router.navigate(['/user/login']);
      return false;
    }
  }
}






