import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, merge, Observable, Observer } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserInfoService } from './../../auth/userInfoService';
import { userService } from './../../../userModule/services/userService';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  login: boolean = false;
  role;
  status: boolean = true;
  isConnected = true;

  allNotifications = [];

  user;
  company;
  constructor(
    private router: Router,
    private UserInfoService: UserInfoService,
    private userService: userService
  ) {
    this.role = this.UserInfoService.getUserRole();
    this.getLoginUser();

  }

  //get login user
  getLoginUser() {
    let id = this.UserInfoService.getAuthData();
    this.userService.getUserById(id).subscribe(res => {
      if (res.success) {
        this.user = res.data;
      }
    })
  }

  ngOnInit() {

  }

  public loadScript(url) {
    let node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(node);
  }


  logout() {
    localStorage.removeItem("_authad@1")
    this.router.navigate(['/user/login'])
  }


}
