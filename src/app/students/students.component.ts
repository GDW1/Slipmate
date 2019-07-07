import {Component, OnInit} from '@angular/core';
import {ApiService} from "../api.service";
import Card from "../card";

@Component({
    selector: 'app-students',
    templateUrl: './students.component.html',
    styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {

    constructor(private api: ApiService) {
    }

    public leaving: Card[];
    public arriving: Card[];

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
        this.leaving = this.api.getOutgoingSlipsToday('798932', monthString, dayString).then(val => {
            this.leaving = this.api.bottleCards(JSON.parse(val));
        })
        this.arriving = this.api.getIncomingSlipsToday('798932', monthString, dayString).then(val => {
            this.arriving = this.api.bottleCards(JSON.parse(val));
        })
    }

}
