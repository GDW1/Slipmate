import {Injectable} from '@angular/core';
import Card from "./card";
import {LoginService} from "./login.service";

@Injectable({
    providedIn: 'root'
})

export class ApiService {

    weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    constructor(private loginService: LoginService) {}

    //Takes request object as input in format {header: value} and makes http request
    async request(func: string, data: any): Promise<any> {
        let req = new XMLHttpRequest;
        req.open('GET', 'https://cors-anywhere.herokuapp.com/https://us-central1-tutorial-pass-automator.cloudfunctions.net/' + func, false);
        for (let i in data) {
            console.log(i, data[i]);
            req.setRequestHeader(i.toString(), data[i]);
        }
        req.send();
        console.log(req.response);
        return req.response;
    }

    private getMonth(): string {
        let date = new Date();
        let monthNum = date.getMonth();

        if (monthNum + 1 < 10){
            return "0" + (monthNum+1).toString();
        } else {
            return (monthNum+1).toString();
        }
    }

    private getDay(): string {
        let date = new Date();
        let dayNum = date.getDate();

        if (dayNum < 10){
            return "0" + (dayNum).toString();
        } else {
            return dayNum.toString();
        }
    }

    private month(m: string): string {
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return months[parseInt(m) - 1];
    }

    private daySuffix(day: string): string {
        let d = parseInt(day) % 10;
        let suffixes = ['th', 'st', 'nd', 'rd'];
        if (d > 3) d = 0;
        return suffixes[d];
    }

    async createPass(isTeacherPass: boolean, teacherToID: string, teacherFromID: string, studentID: string, month: string, day: string, reason: string): Promise<any> {
        let ttName = 'null';
        let ftName = 'null';

        await this.getTeacher(teacherToID).then(val => {
            let tt = JSON.parse(val);
            if (tt.hasOwnProperty('teachName')) ttName = tt.teachName;
        });
        await this.getTeacher(teacherFromID).then(val => {
            let ft = JSON.parse(val);
            if (ft.hasOwnProperty('teachName')) ftName = ft.teachName;
        });

        return this.request('createPass', {
            isTeacherPass: isTeacherPass,
            toTeachID: teacherToID,
            fromTeachID: teacherFromID,
            toTeachName: ttName,
            fromTeachName: ftName,
            studentID: studentID,
            day: (month + ':' + day),
            reason: reason
        })
    }

    async getTeacher(id: string): Promise<any> {
        return this.request('getTeacher', {
            teacherID: id
        });
    }

    async createBlockedDay(id: string, month: string, day: string): Promise<any> {
        return this.request('createBlockedDay', {
            teacherID: id,
            blockedDay: (month + ':' + day)
        });
    }

    getOutgoingSlipsToday(id: string): Promise<any> {
        return this.request('getOutgoingSlipsForTeacherToday', {
            teacherID: id,
            day: (this.getMonth() + ':' + this.getDay())
        });
    }

    getIncomingSlipsToday(id: string): Promise<any> {
        return this.request('getIncomingSlipsForTeacherToday', {
            teacherID: id,
            day: (this.getMonth() + ':' + this.getDay())
        });
    }

    async getIncomingSlipsUnconditional(id: string): Promise<any> {
        return await this.request('getAllIncomingPassesUnconditionalFuture', {
            teacherID: id,
            day: (this.getMonth() + ':' + this.getDay())
        });
    }

    async getOutgoingSlipsUnconditional(id: string): Promise<any> {
        return await this.request('getAllOutgoingPassesUnconditionalFuture', {
            teacherID: id,
            day: (this.getMonth() + ':' + this.getDay())
        });
    }

    async getBlockedDays(id: string): Promise<any> {
        return this.request('getBlockedDays', {
            teacherID: id
        });
    }

    async isBlockedDay(id: string, date: string): Promise<boolean> {
        let r = await this.getBlockedDays(id);
        console.log(r.__zone_symbol__value);
        try {
            let a: [string] = JSON.parse(r);
            for (let i = 0; i < a.length; i++) {
                console.log(a[i]);
                if (a[i] === date) {
                    return true;
                }
            }
            return false;
        } catch {
            return false;
        }
    }

    async deleteBlockedDay(day: string) {
        return this.request('deleteBlockedDays', {
            ids: day
        })
    }

    async approvePass(passID: string) {
        return this.request('teacherApprovePass', {
            passID: passID,
            teacherID: this.loginService.smID
        })
    }

    async denyPass(passID: string) {
        return this.request('teacherDenyPass', {
            passID: passID,
            teacherID: this.loginService.smID
        })
    }

    async deletePass(slipID: string) {
        this.request('deleteSlip', {
            ID: slipID
        })
    }

    bottleCards(dataArr: any): Card[] {
        try {
            let cArr = [];
            for (let c in dataArr) {
                let val = this.bottleCard(dataArr[c]);
                cArr.push(val);
            }
            return cArr;
        } catch {
            return [];
        }
    }

    bottleCard(data: any): Card {
        try {
            //check if input data is valid, then copy some data directly from [input] pass to [output] card
            if (data == null) return;
            let c = new Card;
            c.name = data.studentName;
            c.toTeach = data.toTeachName;
            c.fromTeach = data.fromTeacherName;
            c.toTeachID = data.toTeachID;
            c.slipID = data.id;
            c.isTeacherPass = data.isTeacherPass;
            c.approved = data.approvedPass;
            c.denied = data.denied;
            c.reason = data.reason;


            //determine if current teacher is tutorial teacher or usual teacher
            c.selfIsToTeacher = this.loginService.smID === data.toTeachID;


            //compare current date to date on card to determine whether card date is this calendar year or the next one, then use Date object to get day of week
            let curr = new Date();
            let d = new Date(curr.getFullYear(), parseInt(data.month), parseInt(data.day));
            if (d.getTime() < curr.getTime()) d.setFullYear(d.getFullYear() + 1);
            c.weekday = this.weekdays[d.getDay()];


            //convert input date to month and string
            let day = parseInt(data.day.split(':')[1]);
            c.date = this.month(data.day.split(':')[0]) + ' ' + day.toString() + this.daySuffix(day.toString());


            //determine whether to show buttons and/or card on respective pages
            c.showPending = c.selfIsToTeacher && !c.approved && !c.denied;
            c.showButtonsPending = !c.isTeacherPass && c.showPending;
            c.showConfirmed = c.approved || c.denied;

            return c;
        } catch(err) {
            console.log(err.toString());
            return err.toString();
        }
    }


    getEmailValue(idD: string) {
        return this.request('teacherIsOpted', {
            teachID: idD
        })
    }

    optInOrOut(idD: string, current: string) {
        return this.request('teacherOptIn', {
            docID: idD,
            currentStatus: current
        })
    }
}
