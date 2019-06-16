import {Injectable} from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';

@Injectable({
    providedIn: 'root'
})

export class ApiService {

    constructor(private fire: AngularFireFunctions) {
    }

    private request(func: string, data: any): any {
        let req = new XMLHttpRequest;
        req.open('GET', 'https://cors-anywhere.herokuapp.com/https://us-central1-tutorial-pass-automator.cloudfunctions.net/' + func, false);
        for (let i in data) {
            req.setRequestHeader(i, data[i]);
        }
        req.send();
        return req.response;
    }

    initTeacher(teacherID: string, name: string): any {
        return this.request('initializeTeacher', {
            id: teacherID,
            teacher: name
        });
    }

    createPass(isTeacherPass: boolean, teacherToID: string, teacherFromID: string, studentID: string, month: string, day: string): any {
        let tt = this.getTeacher(teacherToID);
        let ft = this.getTeacher(teacherFromID);
        return this.request('createPass', {
            isTeacherPass: isTeacherPass,
            toTeachID: teacherToID,
            fromTeachID: teacherFromID,
            toTeachName: tt.name,
            fromTeachName: ft.name,
            studentID: studentID,
            day: (month + ':' + day)
        });
    }

    getAllTeachers(): any {
        return this.request('getAllTeachers', {});
    }

    getTeacher(id: string): any {
        return this.request('getTeacher', { teacherID: id });
    }

    createBlockedDay(id: string, month: string, day: string): any {
        return this.request('createBlockedDay', { teacherID: id, blockedDay: (month + ':' + day)});
    }

    getOutgoingSlips(id: string, month: string, day: string): any {
        return this.request('getOutgoingSlipsForTeacherToday', { teacherID: id, day: (month + ':' + day)});
    }

    getIncomingSlipsForTeacherToday(id: string, month: string, day: string): any {
        return this.request('getIncomingSlipsForTeacherToday', { teacherID: id, day: (month + ':' + day)});
    }

    getBlockedDays(id: string): any {
        return this.request('getBlockedDays', { teacherID: id });
    }

    getUnapprovedSlips(id: string): any {
        return this.request('getUnapprovedSlips', { teacherID: id });
    }

    deleteSlip(slipID: string): any {
        return this.request('deleteSlip', { ID: slipID });
    }

    getSlip(slipID: string): any {
        return this.request('getSlip', { ID: slipID });
    }

    getCurrentSlip() {

    }

    deleteBlockedDay() {

    }

    isBlockedDay() {

    }

    acceptSlip() {

    }

    getStudent(stuID: string): any {
        return this.request('getStudent', { studentID: stuID });
    }

}
