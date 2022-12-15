import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserInfoService } from '../../../shared/auth/userInfoService';
import { alert } from '../../../shared/services/sweetAlert.service';
import { Data } from 'src/app/modules/shared/services/shareDataService';
import { userService } from '../../../userModule/services/userService';
import { costService } from '../../services/videoService';

@Component({
  templateUrl: './appNames.component.html',
  styleUrls: ['./appNames.component.scss'],
})
export class appNamesComponent implements OnInit {
  names;
  namesObj;
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
    this.getNames();
  }

  //get cost
  getNames() {
    this.userService.getAllAppNames().subscribe((res) => {
      this.namesObj = res[0];
      this.names = res[0]?.names || '';
    });
  }

  updateNames() {
    let data = {
      names: this.names,
    };
    this.userService
      .updateAppNames(this.namesObj._id, data)
      .subscribe((res) => {
        this.alert.responseAlert(res.message, 'success');
      });
  }
}
