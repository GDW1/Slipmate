import {AfterViewInit, Component, OnInit} from '@angular/core';
import Card from "../card";
import {ApiService} from "../api.service";
import {LoginService} from "../login.service";

@Component({
    selector: 'app-requests',
    templateUrl: './requests.component.html',
    styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit, AfterViewInit {

    public pending: Card[];
    public waiting: Card[];
    public loadedP = false;
    public loadedW = false;

    constructor(private api: ApiService,
                private loginService: LoginService) {}


    ngOnInit() {
        this.loadedP = false;
        this.loadedW = false;
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
                this.pending = temp.filter(function(card) {
                    return card.selfIsToTeacher && card.showButtonsPending;
                });
            } catch(e) {
                console.log(e);
                this.pending = [];
            }
            this.loadedP = true;
        });

        this.api.getOutgoingSlipsUnconditional(this.loginService.smID, monthString, dayString).then(val => {
            try {
                let temp = this.api.bottleCards(JSON.parse(val));
                this.waiting = temp.filter(function(card) {
                    return card.selfIsToTeacher && card.showPending && !card.showButtonsPending;
                });
            } catch(e) {
                console.log(e);
                this.waiting = [];
            }
            this.loadedW = true;
        });
    }

    async deny(slipID: string) {
        if(window.confirm('Are sure you want to deny this tutorial pass? You will not be able to get it back!')) {
            this.pending = this.pending.filter(function(card) {
                return !(card.slipID === slipID);
            });

            this.api.denyPass(slipID);
        }
    }

    async allow(slipID: string) {
        this.pending = this.pending.filter(function(card) {
            return !(card.slipID === slipID);
        });

        this.api.approvePass(slipID);
    }

}
