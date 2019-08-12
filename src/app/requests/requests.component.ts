import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-requests',
    templateUrl: './requests.component.html',
    styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {

    approved = false;
    denied = false;

    requests = ['Aidan Sacco',
        'Guy Wilks',
        'Daniel Longo',
        'Alex Krantz',
        'Peter Klopp',
        'Uri Dickman',
        'Connor Spackman',
        'Cameron Snyder',
        'Edward Newell',
        'Dana Leland'];



    constructor() {
    }

    ngOnInit() {
    }

}
