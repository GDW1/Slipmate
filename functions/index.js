const admin = require('firebase-admin');
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var fs = require('fs');


/**Firebase Firestore initialization*/
admin.initializeApp(functions.config().firebase);
let db = admin.firestore();

/** Node Mailer setup with gmail*/
const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
        user: "slipmatewhs@gmail.com",
        pass: "WHSTut0r14l",
    },
});
/** Name that will be sent with the email*/
const APP_NAME = 'Slipmate';

/**
 * This function is meant to create a student in the firestore database
 * This function should be called with the following headers:
 *  - Student name
 *  - Student ID
 *  - 6th period ID (t6id)
 *  - 7th period ID (t7id)
 * If the function does not return an error, then it will return the time in which the action finishes */
exports.initializeStudent = functions.https.onRequest((request, response) => {
    let name = request.get("student");
    let id = request.get("id");
    let teacher6th = request.get("t6id");
    let teacher7th = request.get("t7id");
    let data = {
        stuID: id.toString(),
        stuName: name.toString(),
        teachSixth: teacher6th.toString(),
        teachSeventh: teacher7th.toString()
    }
    console.log(id.toString() + "@seq.org");
    db.collection("students").where("stuID", "==", id.toString()).get().then(function(docs){
        console.log("Inside the then statement")
        if(!docs.empty){
            response.send("Account was already created")
            throw new Error("done")
        }else{
            let dataset = db.collection("students").add(data)
            console.log(data)
            var today = new Date();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            /** Send email to newly created user */
            const mailOptions = {
                from: `${APP_NAME} <noreply@firebase.com>`,
                to: ((id.toString() + "@seq.org").toString()),
            };
            mailOptions.subject = `Welcome to ${APP_NAME}!`;
            var template = fs.readFileSync('./emailFormats/studentInitialEmail.html',{encoding:'utf-8'});
            mailOptions.html = template;
            mailTransport.sendMail(mailOptions, function(error, info){
                console.log(mailOptions);
                console.log(info);
                console.log('Message sent: ' + info.response);
            });
            console.log('New welcome email sent to:', (id.toString() + "@seq.org"));
            response.send((id.toString() +"@seq.org"));
        }
        return null
    }).catch(err => {
        throw err;
    });
})

/**
 * This function is meant to create a student in the firestore database
 * This function should be called with the following headers:
 *  - Teacher name
 *  - Teacher ID
 *  - seats 6th period (nos6)
 *  - seats 7th period (nos7)
 * If the function does not return an error, then it will return the time in which the action finishes */
exports.initializeTeacher = functions.https.onRequest((request, response) => {
    let name = request.get("teacher");
    let id = request.get("id");
    let number_of_seats_sixth = request.get("nos6");
    let number_of_seats_seventh = request.get("nos7");
    let data = {
        teachID: id.toString(),
        teachName: name.toString(),
        seatsSeventh: (number_of_seats_sixth).toString(),
        seatsSixth: (number_of_seats_seventh).toString()
    }
    db.collection("teacher").where("stuID", "==", id.toString()).get().then(function(docs){
        console.log("Inside the then statement")
        if(!docs.empty){
            response.send("Account was already created")
            throw new Error("done")
        }else{
            let dataset = db.collection("teacher").add(data)
            console.log(data)
            var today = new Date();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            /** Send email to newly created user */
            const mailOptions = {
                from: `${APP_NAME} <noreply@firebase.com>`,
                to: ((id.toString() + "@seq.org").toString()),
            };
            mailOptions.subject = `Welcome to ${APP_NAME}!`;
            var template = fs.readFileSync('./emailFormats/TeacherInitialEmail.html',{encoding:'utf-8'});
            mailOptions.html = template;
            mailTransport.sendMail(mailOptions, function(error, info){
                console.log(mailOptions);
                console.log(info);
                console.log('Message sent: ' + info.response);
            });
            console.log('New welcome email sent to:', (id.toString() + "@seq.org"));
            response.send((id.toString() +"@seq.org"));
        }
        return null
    }).catch(err => {
        throw err;
});
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    response.send(time.toString());
});


/**
 *This function creates a pass and inserts it into the database and sends an email tot eh appropriate place
 * Its takes the follwoing headers as inputs:
 *  - isTeacherPass: says whether the pass was generated by a student or teacher
 *  - toTeachID: the teacher id that the student is going to
 *  - fromTeachID: the teacher id that the student is going from
 *  - studentID: the id of the student leaving
 *  - day: day that is requested in the following format-->("month:day")
 */
exports.createPass = functions.https.onRequest((request, response) => {
    let teacherPass = (request.get("isTeacherPass") === 'true');
    let teacherToID = request.get("toTeachID");
    let teacherFromID = request.get("fromTeachID");
    let stuID = request.get("studentID");
    let dayOfPass = request.get("day")
    console.log("is a teacher pass: " + teacherPass);
    var data = {
        toTeachID: teacherToID,
        fromTeachID: teacherFromID,
        studentID: stuID,
        day: dayOfPass,
        isTeacherPass: teacherPass
    };
    let datapass = db.collection().add(data).then(ref => {
        if(teacherPass){
            return null
        }else{
            return null
        }
    });
});

function parseDayOfPass(day){

}

