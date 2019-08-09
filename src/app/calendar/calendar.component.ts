import {Component, NgZone, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../api.service';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  private FirstFormGroup: FormGroup;
  private month: any;
  private day: any;
  private response: any;
  private blockedDays: object[];
  private months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  constructor(private formBuilder: FormBuilder,
              private api: ApiService,
              private ngZone: NgZone,
              private loginService: LoginService) {
  }

  ngOnInit() {
    this.FirstFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.InhabitBlockedDays();
  }

  InhabitBlockedDays(){
    this.api.getBlockedDays(this.loginService.user.email.split('@')[0]).then(val =>
      this.blockedDays = (JSON.parse(val))
    )
  }

  submitCalendarDate() {
    let date = document.forms[0].elements['date'].value;
    this.month = date.split('/')[0];
    this.day = date.split('/')[1];
    if (parseInt(this.month) < 10) {
      this.month = '0' + this.month;
    }
    if (parseInt(this.day) < 10) {
      this.day = '0' + this.day;
    }
    console.log(this.month + ":" + this.day);
    if (this.day === '' || this.month === '') {
      // tslint:disable-next-line:max-line-length
      console.log(this.month, this.day);
    } else {
      this.response = this.api.createBlockedDay(this.loginService.user.email.split('@')[0], this.month, this.day);
    }

  }
  convertDate(date: string){
    let month = this.months[parseInt(date.split(":")[0])]
    let day = parseInt(date.split(":")[1])
    return month + " " + day
  }

  remove(day: string) {
    
  }
}
