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

        this.api.getIncomingSlipsUnconditional(this.loginService.smID, monthString, dayString).then(val => {
            try {
                let temp = this.api.bottleCards(JSON.parse(val));
                this.arriving = temp.filter(function(card) {
                    return card.selfIsToTeacher && (card.showConfirmed);
                });
            } catch(e) {
                console.log(e);
                this.arriving = [];
            }
            this.loadedA = true;
        });

        this.api.getOutgoingSlipsUnconditional(this.loginService.smID, monthString, dayString).then(val => {
            try {
                let temp = this.api.bottleCards(JSON.parse(val));
                this.leaving = temp.filter(function(card) {
                    return !card.selfIsToTeacher && (card.showConfirmed);
                });
            } catch(e) {
                console.log(e);
                this.leaving = [];
            }
            this.loadedL = true;
        });
    }

    async deletePass(slipID: string) {
        if(window.confirm('Are sure you want to delete this tutorial pass?')) {
            this.arriving = this.arriving.filter(function(card) {
                return !(card.slipID === slipID);
            });
            this.leaving = this.leaving.filter(function(card) {
                return !(card.slipID === slipID);
            });

            this.api.deletePass(slipID);
        }
    }

}
