import {Injectable} from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';

@Injectable({
    providedIn: 'root'
})

export class ApiService {

    constructor(private fire: AngularFireFunctions) {
    }

    initTeacher(teacherID: string, name: string) {
        let fn = this.fire.functions.httpsCallable('initializeTeacher');
        fn({
            id: teacherID,
            teacher: name
        }).then(function(result) {
            //TODO: check for error
        })
    }

    createPass(isTeacherPass: boolean, teacherToID: string, teacherFromID: string, studentID: string, month: string, day: string) {
        let fn = this.fire.functions.httpsCallable('createPass');
        // let tt = this.getTeacher(teacherToID);
        // let ft = this.getTeacher(teacherFromID);
        fn({
            isTeacherPass: isTeacherPass,
            toTeachID: teacherToID,
            fromTeachID: teacherFromID,
            // toTeachName: tt.name,
            // fromTeachName: ft.name,
            toTeachName: 'Alyssa Lu',
            fromTeachName: 'Brianna Lee',
            studentID: studentID,
            day: (month.toString() + ':' + day.toString())
        }).then(function(result) {
            //TODO: check for error
            console.log(result.data)
        })
    }

    getAllTeachers() {

    }

    getTeacher(id: string): any {
        // let fn = this.fire.functions.httpsCallable('getTeacher');
        // fn({
        //     id: id
        // }).then(function(result) {
        //     return result.data
        // })
        let req = new XMLHttpRequest;
        req.open("GET", "https://us-central1-tutorial-pass-automator.cloudfunctions.net/getTeacher", false);
        req.setRequestHeader("teacherID", id);
        req.send();
        console.log("done");
        console.log(req.response)
    }

    deleteSlip() {

    }

    getSlip() {

    }

    getCurrentSlip() {

    }

    createBlockedDay() {

    }

    deleteBlockedDay() {

    }

    isBlockedDay() {

    }

    getBlockedDays() {

    }

    acceptSlip() {

    }

    getStudent() {

    }

}
