import {Injectable} from '@angular/core';
import Card from "./card";
import {LoginService} from "./login.service";

@Injectable({
    providedIn: 'root'
})

export class ApiService {

    constructor(private loginService: LoginService) {}

    private async request(func: string, data: any): Promise<any> {
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

    createPass(isTeacherPass: boolean, teacherToID: string, teacherFromID: string, studentID: string, month: string, day: string, reason: string): any {
        let tt = this.getTeacher(teacherToID);
        let ft = this.getTeacher(teacherFromID);
        let ttName = '';
        let ftName = '';
        if (!tt.hasOwnProperty('name')) ttName = 'null';
        if (!ft.hasOwnProperty('name')) ftName = 'null';
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

    initTeacher(teacherID: string, name: string): any {
        return this.request('initializeTeacher', {
            id: teacherID,
            teacher: name
        });
    }

    getAllTeachers(): any {
        return this.request('getAllTeachers', {});
    }

    getTeacher(id: string): any {
        return this.request('getTeacher', {
            teacherID: id
        });
    }

    createBlockedDay(id: string, month: string, day: string): any {
        return this.request('createBlockedDay', {
            teacherID: id,
            blockedDay: (month + ':' + day)
        });
    }

    getOutgoingSlipsToday(id: string, month: string, day: string): any {
        return this.request('getOutgoingSlipsForTeacherToday', {
            teacherID: id,
            day: (month + ':' + day)
        });
    }

    getIncomingSlipsToday(id: string, month: string, day: string): any {
        return this.request('getIncomingSlipsForTeacherToday', {
            teacherID: id,
            day: (month + ':' + day)
        });
    }

    getBlockedDays(id: string): any {
        return this.request('getBlockedDays', {
            teacherID: id
        });
    }

    getUnapprovedSlips(id: string): any {
        return this.request('getUnapprovedSlips', {
            teacherID: id
        });
    }

    deleteSlip(slipID: string): any {
        return this.request('deleteSlip', {
            ID: slipID
        });
    }

    getSlip(slipID: string): any {
        return this.request('getSlip', {
            ID: slipID
        });
    }

    getStudent(stuID: string): any {
        return this.request('getStudent', {
            studentID: stuID
        });
    }

    teacherApprovePass(passID: string, teacherID: string) {
        return this.request('teacherApprovePass', {
            passID: passID,
            teacherID: teacherID
        })
    }

    teacherDenyPass(passID: string, teacherID: string) {
        return this.request('teacherDenyPass', {
            passID: passID,
            teacherID: teacherID
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
            if (data == null) return;
            let c = new Card;
            c.name = data.studentName;
            c.toTeach = data.toTeachName;
            c.fromTeach = data.fromTeach;
            c.slipID = data.id;
            c.isTeacherPass = data.isTeacherPass;
            c.approvedPass = data.approvedPass;
            c.denied = data.denied;

            let day = data.day.split(':')[1];
            c.date = this.month(data.day.split(':')[0]) + day + this.daySuffix(day);

            c.showButtons = !((data.denied || data.approvedPass || data.isTeacherPass) && (this.loginService.user.email.split('@')[0]) === data.toTeachID);
            return c;
        } catch(err) {
            console.log(err.toString());
            return err.toString();
        }
    }

}
