import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ApiService} from '../api.service';
import {LoginService} from '../login.service';
import {MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-today',
  templateUrl: './today.component.html',
  styleUrls: ['./today.component.scss']
})
export class TodayComponent implements OnInit {
  private numberOfIncoming: any;
  private numberOfOutgoing: any;
  private displayedColumns = ["Reason", "StudentName"];
  private stus: Row[] = [];
  private incomingPasses: any;
  private outgoingPasses: any;
  private dataSource = new MatTableDataSource(this.stus);
  private isBlocked = false;
  private styleTag: string = "visible";
  private redStyle: string = "hidden";
  private once: boolean;
  private twice: boolean;
  constructor(
      private api: ApiService,
      private loginService: LoginService,
  ){}

  ngOnInit() {
    this.once = false;
    this.twice = false;
    // @ts-ignore
    this.checkBlocked().then((val)=>{
      console.log("ISBLOCKED?: " + this.isBlocked)
      // @ts-ignore
      this.isBlocked = val
      // @ts-ignore
      if(!val) {
        console.log("NOTBLOCKED")
        this.loadNumberOfIncoming().then(val=>{
          this.incomingPasses = val;
          this.loadData()
        })
        this.loadNumberOfOutgoing().then(val=> {
          this.outgoingPasses = val;
          this.loadData()
        })
      }else{
        this.styleTag = 'hidden';
        this.redStyle = "visible"
      }
      console.log(this.isBlocked)
    })
  }


  async checkBlocked(){
        let month = "";
        if(((new Date()).getMonth() + 1) < 10){
          month = "0" + ((new Date()).getMonth() + 1).toString()
        }else{
          month = ((new Date()).getMonth() + 1).toString()
        }
        let day = "";
        if(((new Date()).getDate()) < 10){
          day = "0" + ((new Date()).getDate()).toString()
        }else{
          day = ((new Date()).getDate()).toString()
        }
        let dateStamp = month + ":" + day;
        console.log("DATE: " + dateStamp);
        await this.api.getBlockedDays(this.loginService.smID).then(val => {
          try{
            let jsonD = JSON.parse(val.toString());
            for(let i = 0; i < jsonD.length; i++){
              if(jsonD[i][0] === dateStamp){
                console.log("FOUND");
                this.styleTag = 'hidden';
                this.redStyle = "visible"
                return (true);
              }
            }
          }catch{
            return (false);
          }
        })
  }

  loadNumberOfIncoming(){
    return new Promise((resolve) => {
      setTimeout(() => {
      console.log("EMAILTOBACKEND" + this.loginService.user.email)
      this.api.getIncomingSlipsToday(this.loginService.smID).then(val => {
          console.log("loadNumberOfIncoming: " + val)
          resolve (val.toString())
        })
      });
    });
  }

  loadNumberOfOutgoing(){
    return new Promise((resolve) => {
      setTimeout(() => {

        this.api.getOutgoingSlipsToday(this.loginService.smID).then(val => {
          console.log("loadNumberOfOutgoing: " + val)
          resolve (val.toString())
      })})})
  }

  fillInTable(){
    if(this.numberOfOutgoing !== "" ||this.numberOfIncoming !== "" ){
      try{
        JSON.parse(this.incomingPasses)
        this.stus = [];
        for(let i = 0; i < this.incomingPasses.length; i++){
          this.stus.push({reason: this.incomingPasses[i].reason, studentName: this.incomingPasses[i].studentName});
          console.log(this.stus[i])
        }
        console.log("DATA:" + this.stus);
        this.dataSource = new MatTableDataSource(this.stus);

      }catch(err) {
      }
    }
  }
  
  loadData(){
    try{
      console.log("INCOMINGPASSESLENGTH" + this.incomingPasses.length)
      if(!this.once){
        this.incomingPasses = JSON.parse(this.incomingPasses)
      }
      console.log(this.incomingPasses.length);
      if(this.incomingPasses.length === 1){
        this.numberOfIncoming = ("There is " + this.incomingPasses.length.toString() + " student coming today");
      }else{
        this.numberOfIncoming = ("There is " + this.incomingPasses.length.toString() + " student coming today");
      }
      this.once = true;
    }catch(error){
      console.log("CATCH");
      this.numberOfIncoming = ("There are no students coming today");
    }
    try{
      if(!this.twice){
        this.outgoingPasses = JSON.parse(this.outgoingPasses)
      }
      if(this.outgoingPasses.length === 1){
        this.numberOfOutgoing = ("There is " + this.outgoingPasses.length.toString() + " student going today");
      }else{
        this.numberOfOutgoing = ("There are " + this.outgoingPasses.length.toString() + " students going today");
      }
      this.twice = true
    }catch(error){
      console.log("CATCH");
      this.numberOfOutgoing = ("There are no students coming today");
    }
    console.log(this.stus);
    this.fillInTable();
  }
}



export interface Row {
  reason: string;
  studentName: number;
}
