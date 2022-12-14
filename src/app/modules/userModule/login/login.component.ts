import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Data } from '../../shared/services/shareDataService';
import { userModel } from '../models/user';
import { userService } from '../services/userService';
import { UserInfoService } from '../../shared/auth/userInfoService';
import { alert } from './../../shared/services/sweetAlert.service';
import { authService } from './../services/auth.service';
declare var $: any;


@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class loginComponent implements OnInit {
  user = new userModel();
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private data: Data,
    private alert: alert,
    private userService: userService,
    private userInfoService: UserInfoService,
    private authService: authService

  ) {
  }
  ngOnInit() {

  }
  //check login
  checkLogin() {
    let role = this.userInfoService.getUserRole();
    if (role === 'superAdmin') {
      this.router.navigate(['/dashboard']);
    }

  }

  onLogin() {
    this.authService.loginUser(this.user).subscribe(res => {
      localStorage.setItem("_authad@", res.data);
      let role = this.userInfoService.getUserRole();
      if (role === 'superAdmin') {
        this.router.navigate(['/dashboard']);
      }
    })



  }

  emailChange() {
    this.user.email = this.user.email.trim().toLowerCase();

  }

}