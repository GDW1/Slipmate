import {Component, OnInit} from '@angular/core';
import {ApiService} from "../api.service";
import Card from "../card";
import {LoginService} from '../login.service';

@Component({
    selector: 'app-students',
    templateUrl: './students.component.html',
    styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {

    constructor(private api: ApiService,
                private loginService: LoginService) {
    }

    public leaving: any = [];
    public arriving: any = [];

    ngOnInit() {
        let date = new Date();
        let monthNum = date.getMonth();
        let monthString = "";
        if(monthNum + 1 < 10){
            monthString = "0" + (monthNum+1).toString();
        }else{
            monthString = (monthNum+1).toString();
        }
        let dayNum = date.getDate();
        let dayString = "";
        if(dayNum < 10){
            dayString = "0" + (dayNum).toString();
        }else{
            dayString = dayNum.toString();
        }
        this.api.getOutgoingSlipsToday(this.loginService.user.email.split('@')[0], monthString, dayString).then(val => {
            try{
                this.leaving = this.api.bottleCards(JSON.parse(val));
            }catch(e){
                throw e
            }
        })
        this.api.getIncomingSlipsToday(this.loginService.user.email.split('@')[0], monthString, dayString).then(val => {
            try {

                this.arriving = this.api.bottleCards(JSON.parse(val));
            }catch (e) {
                throw e
            }
        })
    }

}
