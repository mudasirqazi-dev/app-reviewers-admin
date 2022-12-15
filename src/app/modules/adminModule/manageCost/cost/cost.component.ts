import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { UserInfoService } from '../../../shared/auth/userInfoService';
import { alert } from './../../../shared/services/sweetAlert.service';
import { Data } from 'src/app/modules/shared/services/shareDataService';
import Swal from 'sweetalert2';
import { userService } from './../../../userModule/services/userService';
import { costService } from './../../services/videoService';

@Component({
  templateUrl: './cost.component.html',
  styleUrls: ['./cost.component.scss'],
})
export class costComponent implements OnInit {
  costObj;
  cost;
  initialBalance;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: userService,
    private userInfoService: UserInfoService,
    private costService: costService,
    private alert: alert,
    private data: Data
  ) {}

  ngOnInit() {
    this.getPerClickCost();
  }

  //get cost
  getPerClickCost() {
    this.costService.getPerDetailCost().subscribe((res) => {
      this.costObj = res[0];
      this.cost = this.costObj.cost;
      this.initialBalance = this.costObj.initialBalance;
    });
  }

  updateAccount() {
    if (this.cost < 0) {
      return;
    }
    let data = {
      cost: this.cost,
      initialBalance: this.initialBalance,
    };
    this.costService
      .updatePerDetailCost(this.costObj._id, data)
      .subscribe((res) => {
        this.alert.responseAlert(res.message, 'success');
      });
  }
}
