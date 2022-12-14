import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Data } from 'src/app/modules/shared/services/shareDataService';
import { userService } from './../../userModule/services/userService';
import * as moment from 'moment';


@Component({
  templateUrl: './adminPanel.component.html',
  styleUrls: ['./adminPanel.component.scss'],
})
export class adminPanelComponent implements OnInit {


  totalUsers = 0;
 
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: userService,
    private data: Data
  ) { }



  ngOnInit() {
    this.getAllUsers();
   
  }


  //get all users
  getAllUsers() {
    this.userService.getAllUsers().subscribe(res => {
      this.totalUsers = res.filter(data => data.role == 'user').length;
    })
  }




}
