import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UserInfoService } from '../../../shared/auth/userInfoService';
import { alert } from './../../../shared/services/sweetAlert.service';
import { Data } from 'src/app/modules/shared/services/shareDataService';
import Swal from 'sweetalert2';
import { userService } from './../../../userModule/services/userService';



@Component({
  templateUrl: './allUsers.component.html',
  styleUrls: ['./allUsers.component.scss'],
})
export class allUsersComponent implements OnInit {

  globalSearch;
  page = 1;
  entries = 10;
  itemPerPage = 10
  users = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: userService,
    private userInfoService: UserInfoService,
    private alert: alert,
    private data: Data

  ) {


  }


  ngOnInit() {
    this.getAllUsers();
  }


  //get all users
  getAllUsers() {
    this.userService.getAllUsers().subscribe(res => {
      this.users = res.filter(data => data.role != 'superAdmin');
    })
  }


  manageAccess(id: string, status: boolean) {
    let data = {
      id: id,
      status: status
    }
    this.userService.manageAccess(data).subscribe(res => {
      this.alert.responseAlert(res.message,'success');
      this.data.refresh();
    })
  }

}
