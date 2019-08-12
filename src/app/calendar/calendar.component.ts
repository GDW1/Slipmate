import {Component, NgZone, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../api.service';
import { LoginService } from '../login.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatTableDataSource} from '@angular/material';

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
  private blockedDays: day[] = [];
  private dataSource = new MatTableDataSource(this.blockedDays);
  private months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  private displayedColumns = ["day", "id"]
  constructor(private formBuilder: FormBuilder,
              private api: ApiService,
              private ngZone: NgZone,
              private loginService: LoginService,
              private route : ActivatedRoute,
              private r : Router) {
  }

  ngOnInit() {
    this.FirstFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.InhabitBlockedDays();
  }

  async InhabitBlockedDays(){
    this.api.getBlockedDays(this.loginService.user.email.split('@')[0]).then(val => {
      this.blockedDays = []
      try {
        let data = (JSON.parse(val));
        console.log(data[0][0])
        for (let i = 0; i < data.length; i++) {
          let piece = {day: data[i][0].toString(), id: data[i][1].toString()}
          console.log(piece)
          this.blockedDays.push(piece)
        }
        console.log(this.blockedDays)
        this.dataSource = new MatTableDataSource(this.blockedDays);
      }catch(error){
        this.blockedDays = []
        this.dataSource = new MatTableDataSource(this.blockedDays);
      }
    })
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
    this.InhabitBlockedDays()
  }

  convertDate(date: string){
    let month = this.months[parseInt(date.split(":")[0])-1]
    let day = parseInt(date.split(":")[1])
    return month + " " + day
  }

  remove(id: string) {
    console.log(id)
    try{
      let arr = "[\"" + id + "\"]"
      this.api.deleteBlockedDay(arr)
      this.InhabitBlockedDays()
    }catch(error){
      throw error
    }
  }
}
export interface day {
  day: string;
  id: string;
}
