import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ApiService} from "../api.service";
import Card from "../card";
import {LoginService} from "../login.service";

@Component({
    selector: 'app-students',
    templateUrl: './students.component.html',
    styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit, AfterViewInit {

    constructor(private api: ApiService,
                private loginService: LoginService) {
    }

    public leaving: Card[];
    public arriving: Card[];
    public loadedA = false;
    public loadedL = false;

    ngOnInit() {
        this.loadedA = false;
        this.loadedL = false;
    }

    async ngAfterViewInit() {
        setTimeout(() => { this.doAPICall(); }, 10);
    }

    async doAPICall() {
        let date = new Date();
        let monthNum = date.getMonth();
        let monthString = "";

        if (monthNum + 1 < 10){
            monthString = "0" + (monthNum+1).toString();
        } else {
            monthString = (monthNum+1).toString();
        }

        let dayNum = date.getDate();
        let dayString = "";

        if (dayNum < 10){
            dayString = "0" + (dayNum).toString();
        } else {
            dayString = dayNum.toString();
        }
        this.api.getOutgoingSlipsToday('798932', monthString, dayString).then(val => {
            this.leaving = this.api.bottleCards(JSON.parse(val));
        })
        this.api.getIncomingSlipsToday('798932', monthString, dayString).then(val => {
            this.arriving = this.api.bottleCards(JSON.parse(val));
        })
    }

}
