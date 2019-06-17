import {Component, OnInit} from '@angular/core';
import Card from "../card";
import {ApiService} from "../api.service";

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
        this.leaving = this.api.bottleCards(this.api.getOutgoingSlips('798932', '08', '14'))
        this.arriving = this.api.bottleCards(this.api.getIncomingSlips('798932', '08', '14'))
    }

}
