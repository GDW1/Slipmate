import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import {LoginService} from '../login.service';
import {ActivatedRoute, Router} from '@angular/router';
import {defer} from 'rxjs';

@Component({
  selector: 'app-today',
  templateUrl: './today.component.html',
  styleUrls: ['./today.component.scss']
})
export class TodayComponent implements OnInit {
  private numberOfIncoming: any;
  private numberOfOutgoing: any;
  private displayedColumns = ["Reason", "NumberOfStudents"];
  private dataSource: Row[];
  private incomingPasses: Pass[];

  constructor(
      private api: ApiService,
      private loginService: LoginService,
  ){}

  async ngOnInit() {
    this.loadNumberOfIncoming().then((val) => this.numberOfIncoming = (val));
    this.loadNumberOfOutgoing().then((val) => this.numberOfOutgoing = (val));
  }

  loadNumberOfIncoming(){
    var promise = new Promise((resolve) => {
      setTimeout(() => {
        let month = ""
        if(((new Date()).getMonth() + 1) < 10){
          month = "0" + ((new Date()).getMonth() + 1).toString()
        }else{
          month = ((new Date()).getMonth() + 1).toString()
        }
        let day = ""
        if(((new Date()).getDate()) < 10){
          day = "0" + ((new Date()).getDate()).toString()
        }else{
          day = ((new Date()).getDate()).toString()
        }
        console.log("Async Work Complete");
        this.api.getIncomingSlipsToday(this.loginService.user.email.split('@')[0], month,
            day).then(val => {
          try{
            let resp = JSON.parse(val.toString())
            console.log("RETURNED: " + val)
            if(resp.length === 1){
              resolve("There is " + resp.length.toString() + " student coming today");
            }else{
              resolve("There are " + resp.length.toString() + " students coming today");
            }
          }catch(error){
            resolve("There are no students coming today");
          }
        })
      });
    });
    return promise;
  }

  loadNumberOfOutgoing(){
    var promise = new Promise((resolve) => {
      setTimeout(() => {
        let month = ""
        if(((new Date()).getMonth() + 1) < 10){
          month = "0" + ((new Date()).getMonth() + 1).toString()
        }else{
          month = ((new Date()).getMonth() + 1).toString()
        }
        let day = ""
        if(((new Date()).getDate()) < 10){
          day = "0" + ((new Date()).getDate()).toString()
        }else{
          day = ((new Date()).getDate()).toString()
        }
        console.log("Async Work Complete");
        this.api.getOutgoingSlipsToday(this.loginService.user.email.split('@')[0], month, day).then(val => {
          try{
            let resp = JSON.parse(val.toString())
            if(resp.length === 1){
              resolve("There is " + resp.length.toString() + " student going today");
            }else{
              resolve("There are " + resp.length.toString() + " students going today");
            }
          }catch(error){
            resolve("There are no students going today");
          }
        })
      });
    });
    return promise;
  }

  fillInTable(){
    var promise1 = new Promise(function(resolve, reject) {
      setTimeout(function() {

        resolve('foo');
      });
    });

  }
}

export interface Row {
  reason: string;
  numberForReason: number;
}

export interface Pass {
  reason: string;
  nameOfStudent: string;
  fromTeacherName: string;
}
