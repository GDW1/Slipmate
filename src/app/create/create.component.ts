import {Component, OnInit, NgZone} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from "../api.service";

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    thirdFormGroup: FormGroup;
    fourthFormGroup: FormGroup;
    response: string;
    loading = false;
    gotError = false;

    studentID: string;
    day: string;
    month: string;
    ttID: string;
    ftID: string;
    reason: string;

    constructor(private formBuilder: FormBuilder,
                private api: ApiService,
                private ngZone: NgZone) {
    }

    ngOnInit() {
        this.firstFormGroup = this.formBuilder.group({
            firstCtrl: ['', Validators.required]
        });
        this.secondFormGroup = this.formBuilder.group({
            secondCtrl: ['', Validators.required]
        });
        this.thirdFormGroup = this.formBuilder.group({
            utCtrl: ['', Validators.required],
            ttCtrl: ['', Validators.required]
        });
        this.fourthFormGroup = this.formBuilder.group({
            reasonCtrl: ['', Validators.required]
        });
    }

    loadData() {
        this.studentID = document.forms[0].elements['studentID'].value;

        let date = document.forms[1].elements['date'].value;
        this.month = date.split('/')[0];
        this.day = date.split('/')[1];
        if (parseInt(this.month) < 10) this.month = '0' + this.month;
        if (parseInt(this.day) < 10) this.day = '0' + this.day;

        this.ttID = document.forms[2].elements['toTeachID'].value;
        this.ftID = document.forms[2].elements['fromTeachID'].value;

        this.reason = document.forms[3].elements['reason'].value;
    }

    async submitButton() {
        this.loadData();
        this.loading = true;

        setTimeout(() => { this.doAPICall(); }, 10);
    }

    async doAPICall() {
        console.log(this.studentID, this.month, this.day, this.ttID, this.ftID);

        if (this.studentID.trim() === '' || this.ttID.trim() === '' || this.ftID.trim() === '' || this.day === '' || this.month === '') {
            this.response = 'Error: One or more of the inputs is empty. You may have made a typo somewhere. Try re-entering the information.';
            this.gotError = true;
            this.loading = false;
        } else {
            this.api.createPass(true, this.ttID, this.ftID, this.studentID, this.month, this.day, this.reason).then(res => {
                this.response = res;
                this.loading = false;
            });
        }
    }

}
