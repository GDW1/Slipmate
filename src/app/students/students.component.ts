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

    public leaving: Card[]; //= [{name: 'Aidan'}, { name: 'Ben' }];
    public arriving: Card[]; //= [{name: 'Aidan'}, { name: 'Ben' }];

    ngOnInit() {
        this.leaving = this.api.bottleCards(this.api.getOutgoingSlipsToday('798932', '08', '14'))
        this.arriving = this.api.bottleCards(this.api.getIncomingSlipsToday('798932', '08', '14'))
    }

}
