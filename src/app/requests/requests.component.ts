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
        this.api.getIncomingSlipsUnconditional(this.loginService.smID).then(val => {
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

        this.api.getIncomingSlipsUnconditional(this.loginService.smID).then(val => {
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

    async deletePass(slipID: string) {
        if(window.confirm('Are sure you want to cancel this request?')) {
            this.waiting = this.waiting.filter(function(card) {
                return !(card.slipID === slipID);
            });

            this.api.deletePass(slipID);
        }
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
