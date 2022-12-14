import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserInfoService } from '../auth/userInfoService';
import { Location } from '@angular/common';
import { environment } from './../../../../environments/environment';
@Injectable({ providedIn: 'root' })
export class Data {

  imagePath = environment.imagePath;
  companyLogo = 'assets/images/companies/company-placeholder.png';
  packageImg = 'assets/images/placeholders/package.png';

  public constructor(
    public router: Router,
    private userInfoService: UserInfoService,
    private location: Location,
  ) { }



  //referesh page
  refresh() {
    setTimeout(() => {
      this.router.routeReuseStrategy.shouldReuseRoute = function () { return false; };
      let currentUrl = this.router.url + '?';
      this.router.navigateByUrl(currentUrl)
        .then(() => {
          this.router.navigated = false;
          this.router.navigate([this.router.url]);
        });
    }, 3000);
  }

  reset() {
    this.router.routeReuseStrategy.shouldReuseRoute = function () { return false; };
    let currentUrl = this.router.url + '?';
    this.router.navigateByUrl(currentUrl)
      .then(() => {
        this.router.navigated = false;
        this.router.navigate([this.router.url]);
      });
  }

  //referesh page
  pageReaload() {
    this.router.routeReuseStrategy.shouldReuseRoute = function () { return false; };
    let currentUrl = this.router.url + '?';
    this.router.navigateByUrl(currentUrl)
      .then(() => {
        this.router.navigated = false;
        this.router.navigate([this.router.url]);
      });
  }

  //get random number 
  getRandomNumber() {
    let billNo = 0;
    let num = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    return num

  }


  goBack() {
    this.location.back();
  }





  getAllMonths() {
    let months = [
      {
        name: 'January',
        value: 0
      },
      {
        name: 'February',
        value: 1
      },
      {
        name: 'March',
        value: 2
      },
      {
        name: 'April',
        value: 3
      },
      {
        name: 'May',
        value: 4
      },
      {
        name: 'June',
        value: 5
      },
      {
        name: 'July',
        value: 6
      },
      {
        name: 'August',
        value: 7
      },
      {
        name: 'September',
        value: 8
      },
      {
        name: 'October',
        value: 9
      },
      {
        name: 'November',
        value: 10
      },
      {
        name: 'December',
        value: 11
      },


    ]
    return months;
  }


  dateFromDay(day, year) {
    var date = new Date(year, 0); // initialize a date in `year-01-01`
    return new Date(date.setDate(day)); // add the number of days
  }


  generateRandomString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  year;
  month;
  date;
  withoutTime(eventDate) {
    let date = new Date(eventDate);
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
    this.date = date.getDate();
    if (this.date < 10) {
      this.date = '0' + this.date;
    }
    if (this.month < 10) {
      this.month = '0' + this.month;
    }
    let datee = this.year + '-' + this.month + '-' + this.date
    return datee
  }


  //check leadTime
  checkLeadTime(leadDays, nextDelivery) {
    let deliveryDate = new Date(nextDelivery);
    let date = new Date();
    let minDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + Number(leadDays)
    );
    if (deliveryDate > minDate) {
      return true
    } else {
      return false;
    }
  }

}
