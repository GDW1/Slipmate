const admin = require('firebase-admin');
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
var fs = require('fs');
const cors = require('cors')({origin: true, allowedHeaders: "*"});

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
    if (request.method === `OPTIONS`) {
        response.header('Access-Control-Allow-Origin', "https://student.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
            .header("Access-Control-Allow-Headers", "Content-Type, student, id, t6id, t7id")
            .header("Access-Control-Allow-Credentials", 'true').status(200).send("CORS");
        return;
    }
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
    db.collection("students").where("stuID", "==", id.toString()).get().then((docs) => {
        console.log("Inside the then statement")
        if(!docs.empty){
            response.header('Access-Control-Allow-Origin', "https://student.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
                .header("Access-Control-Allow-Headers", "Content-Type, student, id, t6id, t7id")
                .header("Access-Control-Allow-Credentials", 'true')
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
            mailTransport.sendMail(mailOptions, (error, info) => {
                console.log(mailOptions);
                console.log(info);
                console.log('Message sent: ' + info.response);
            });
            console.log('New welcome email sent to:', (id.toString() + "@seq.org"));
            response.header('Access-Control-Allow-Origin', "https://student.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
                .header("Access-Control-Allow-Headers", "Content-Type, student, id, t6id, t7id")
                .header("Access-Control-Allow-Credentials", 'true')
            response.send((id.toString() +"@seq.org"));
        }
        return null
    }).catch(err => {
        throw err;
    });
});

/**
 * This function is meant to create a student in the firestore database
 * This function should be called with the following headers:
 *  - Teacher name
 *  - Teacher ID
 *  - seats 6th period (nos6)
 *  - seats 7th period (nos7)
 * If the function does not return an error, then it will return the time in which the action finishes */
exports.initializeTeacher = functions.https.onRequest((request, response) => {
    if (request.method === `OPTIONS`) {
        response.header('Access-Control-Allow-Origin', "https://teacher.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
            .header("Access-Control-Allow-Headers", "Content-Type, teacher, id")
            .header("Access-Control-Allow-Credentials", 'true').status(200).send("CORS");
        return;
    }
    let name = request.get("teacher");
    let id = request.get("id");
    let data = {
        teachID: id.toString(),
        teachName: name.toString(),
    }
    db.collection("teacher").where("teachID", "==", id.toString()).get().then((docs) => {
        console.log("Inside the then statement")
        if(!docs.empty){
            response.header('Access-Control-Allow-Origin', "https://teacher.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
                .header("Access-Control-Allow-Headers", "Content-Type, teacher, id")
                .header("Access-Control-Allow-Credentials", 'true')
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
            mailTransport.sendMail(mailOptions, (error, info) => {
                console.log(mailOptions);
                console.log(info);
                console.log('Message sent: ' + info.response);
            });
            console.log('New welcome email sent to:', (id.toString() + "@seq.org"));
            response.header('Access-Control-Allow-Origin', "https://teacher.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
                .header("Access-Control-Allow-Headers", "Content-Type, teacher, id")
                .header("Access-Control-Allow-Credentials", 'true')
            response.send((id.toString() +"@seq.org"));
        }
        return null
    }).catch(err => {
        throw err;
    });
});

/**
 *This function creates a pass and inserts it into the database and sends an email to the appropriate place
 * Its takes the follwoing headers as inputs:
 *  - isTeacherPass: says whether the pass was generated by a student or teacher
 *  - toTeachID: the teacher id that the student is going to
 *  - fromTeachID: the teacher id that the student is going from
 *  - fromTeachName: the teacher name that the student is going from
 *  - toTeachName: the teacher name that the student is going from
 *  - studentID: the id of the student leaving
 *  - day: day that is requested in the following format-->("month:day")
 */
exports.createPass = functions.https.onRequest((request, response) => {
    let origin = "";
    if(request.get("origin") === "https://teacher.slipmate.ml"){
        origin = "https://teacher.slipmate.ml"
    }else{
        origin = "https://student.slipmate.ml"
    }
    if (request.method === `OPTIONS`) {
        response.header('Access-Control-Allow-Origin', origin).header('Access-Control-Allow-Methods', 'GET')
            .header("Access-Control-Allow-Headers", "Content-Type, isTeacherPass, toTeacherID, fromTeachID, fromTeacherID, toTeachName, studentID, day, reason")
            .header("Access-Control-Allow-Credentials", 'true').status(200).send("CORS");
        return;
    }
    let teacherPass = (request.get("isTeacherPass") === 'true');
    let teacherToID = request.get("toTeachID");
    let teacherFromID = request.get("fromTeachID");
    let teacherToName= request.get("toTeachName");
    let teacherFromName = request.get("fromTeachName");
    let stuID = request.get("studentID");
    let dayOfPass = request.get("day");
    let reasonForPass = request.get("reason");
    console.log("is a teacher pass: " + teacherPass);
    let data = {
        id: doc.id,
        toTeachID: teacherToID,
        toTeachName: teacherToName,
        fromTeacherName: teacherFromName,
        fromTeachID: teacherFromID,
        studentID: stuID,
        day: dayOfPass,
        isTeacherPass: teacherPass,
        reason: reasonForPass,
        approvedPass: false,
        denied: false
    };
    if(teacherToID === teacherFromID){
        response.send("the from and to teacher cannot be the same")
    }
    if(teacherPass){
        db.collection("blockedDay").where("teachID", "==", teacherToID).where("blockDay", "==", dayOfPass).get()
            .then(docs => {
                if(docs.empty){
                    let datacreate = db.collection("passes").add(data);
                    const mailOptions = {
                        from: `${APP_NAME} <noreply@firebase.com>`,
                        to: (stuID + "@seq.org").toString(),
                        subject: "You have recieved a Tutorial request from " + teacherToName,
                        text: "This teacher reconmends that you go to tutorial on " + dayOfPass
                    };
                    mailTransport.sendMail(mailOptions, (error, info) => {
                        console.log(mailOptions);
                        console.log(info);
                        console.log('Message sent: ' + info.response);
                    });
                    response.header('Access-Control-Allow-Origin', origin).header('Access-Control-Allow-Methods', 'GET')
                        .header("Access-Control-Allow-Headers", "Content-Type, isTeacherPass, toTeacherID, fromTeachID, fromTeacherID, toTeachName, studentID, day")
                        .header("Access-Control-Allow-Credentials", 'true')
                    response.send("message sent to student ")
                    //var template = fs.readFileSync('./emailFormats/cTeacherInitialEmail.html',{encoding:'utf-8'});
                }else{
                    response.header('Access-Control-Allow-Origin', origin).header('Access-Control-Allow-Methods', 'GET')
                        .header("Access-Control-Allow-Headers", "Content-Type, isTeacherPass, toTeacherID, fromTeachID, fromTeacherID, toTeachName, studentID, day")
                        .header("Access-Control-Allow-Credentials", 'true')
                    response.send("This day is blocked");
                }
                return null;
            }).catch(err => {
            throw err;
        });
    }else{
        db.collection("blockedDays").where("teachID", "==", teacherToID).where("blockDay", "==", dayOfPass).get()
            .then(docs => {
                if(docs.empty){
                    let datacreate = db.collection("passes").add(data);
                    response.header('Access-Control-Allow-Origin', origin).header('Access-Control-Allow-Methods', 'GET')
                        .header("Access-Control-Allow-Headers", "Content-Type, isTeacherPass, toTeacherID, fromTeachID, fromTeacherID, toTeachName, studentID, day")
                        .header("Access-Control-Allow-Credentials", 'true')
                    response.send("a pass has been created can will be sent to the selected teacher at the next email signal")
                }else{
                    response.header('Access-Control-Allow-Origin', origin).header('Access-Control-Allow-Methods', 'GET')
                        .header("Access-Control-Allow-Headers", "Content-Type, isTeacherPass, toTeacherID, fromTeachID, fromTeacherID, toTeachName, studentID, day")
                        .header("Access-Control-Allow-Credentials", 'true')
                    response.send("This day is blocked");
                }
                return;
            }).catch(err => {
            throw err;
        });
    }
});

/**
 * This function is meant to create a "blocked day" where requests do cannot come in
 * This function requires two headers:
 * - teacherID: the id of the teacher that is blocking the days
 * - blockedDay: the day that the teacher watns to block in the format -> ("month:day")
 */
exports.createBlockedDay = functions.https.onRequest((request, response) => {
    if (request.method === `OPTIONS`) {
        response.header('Access-Control-Allow-Origin', "https://teacher.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
            .header("Access-Control-Allow-Headers", "Content-Type, teacherid, blockedday")
            .header("Access-Control-Allow-Credentials", 'true').status(200).send("CORS");
        return;
    }
    let teacherID = request.get("teacherID");
    let blockedDay = request.get("blockedDay");
    let data = {
        teachID: teacherID,
        blockDay: blockedDay
    };
    db.collection("teacher").where("teachID", "==", teacherID).get().then(docs => {
        if(docs.empty){
            response.header('Access-Control-Allow-Origin', "https://teacher.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
                .header("Access-Control-Allow-Headers", "Content-Type, teacherid, blockedday")
                .header("Access-Control-Allow-Credentials", 'true')
            response.send("there is no teacher with id: " + teacherID.toString());
        }else{
            db.collection("blockedDays").add(data);
            response.header('Access-Control-Allow-Origin', "https://teacher.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
                .header("Access-Control-Allow-Headers", "Content-Type, teacherid, blockedday")
                .header("Access-Control-Allow-Credentials", 'true')
            response.send("blocked day inserted into teacher: " + teacherID.toString());
        }
        return null
    }).catch(err => {
        throw err;
    });
});

/**
 * This function is meant to return all the passes that the teacher has outgoing
 * This takes two inputs as headers
 * - TeacherID: the id of the teacher requesting the current passes
 * - today: the current day in the format -> ("month:day")
 */
exports.getOutgoingSlipsForTeacherToday = functions.https.onRequest((request, response) => {
    if (request.method === `OPTIONS`) {
        response.header('Access-Control-Allow-Origin', "https://teacher.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
            .header("Access-Control-Allow-Headers", "Content-Type, teacherid, day")
            .header("Access-Control-Allow-Credentials", 'true').status(200).send("CORS");
        return;
    }
    let teacherID = request.get("teacherID");
    let day = request.get("day");
    db.collection("passes").where("fromTeachID", "==", teacherID).where("day", "==", day).where("approvedPass", "==", true).where("denied", "==", false).get().then(docs => {
        if (docs.empty){
            response.header('Access-Control-Allow-Origin', "https://teacher.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
                .header("Access-Control-Allow-Headers", "Content-Type, teacherid, day")
                .header("Access-Control-Allow-Credentials", 'true')
            response.send("no outgoing passes today")
        }else{
            passes = [];
            docs.forEach(doc => {
                passes.push({
                    id: doc.id,
                    toTeachID: doc.data().toTeachID,
                    toTeachName: doc.data().toTeachName,
                    fromTeacherName: doc.data().fromTeacherName,
                    fromTeachID: doc.data().fromTeachID,
                    studentID: doc.data().studentID,
                    day: doc.data().day,
                    isTeacherPass: doc.data().isTeacherPass,
                    approvedPass: doc.data().approvedPass,
                    reason: doc.data().reason,
                });
            })
            console.log(passes)
            response.header('Access-Control-Allow-Origin', "https://teacher.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
                .header("Access-Control-Allow-Headers", "Content-Type, teacherid, day")
                .header("Access-Control-Allow-Credentials", 'true')
            response.send(passes)
        }
        return;
    }).catch(err => {
        throw err;
    })
});

/**
 * This function is meant to return all the passes that the teacher has incoming
 * This takes two inputs as headers
 * - teacherID: the id of the teacher requesting the current passes
 * - today: the current day in the format -> ("month:day")
 */
exports.getIncomingSlipsForTeacherToday = functions.https.onRequest((request, response) => {
    if (request.method === `OPTIONS`) {
        response.header('Access-Control-Allow-Origin', "https://teacher.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
            .header("Access-Control-Allow-Headers", "Content-Type, teacherid, day")
            .header("Access-Control-Allow-Credentials", 'true').status(200).send("CORS");
        return;
    }
    let teacherID = request.get("teacherID");
    let day = request.get("day");
    db.collection("passes").where("toTeachID", "==", teacherID).where("day", "==", day).where("approvedPass", "==", true).where("denied", "==", false).get().then(docs => {
        if (docs.empty){
            response.header('Access-Control-Allow-Origin', "https://teacher.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
                .header("Access-Control-Allow-Headers", "Content-Type, teacherid, day")
                .header("Access-Control-Allow-Credentials", 'true')
            response.send("no incoming passes today")
        }else{
            passes = [];
            docs.forEach(doc => {
                passes.push({
                    id: doc.id,
                    toTeachID: doc.data().toTeachID,
                    toTeachName: doc.data().toTeachName,
                    fromTeacherName: doc.data().fromTeacherName,
                    fromTeachID: doc.data().fromTeachID,
                    studentID: doc.data().studentID,
                    day: doc.data().day,
                    isTeacherPass: doc.data().isTeacherPass,
                    approvedPass: doc.data().approvedPass,
                    reason: doc.data().reason,
                });
            })
            console.log(passes)
            response.header('Access-Control-Allow-Origin', "https://teacher.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
                .header("Access-Control-Allow-Headers", "Content-Type, teacherid, day")
                .header("Access-Control-Allow-Credentials", 'true')
            response.send(passes)
        }
        return;
    }).catch(err => {
        throw err;
    })
});

/**
 * This function will send an email to each teacher everyday at noon
 */
exports.scheduledFunction = functions.https.onRequest((request, response) => {//functions.pubsub.schedule('* 12 * * *').onRun((context) => {
    db.collection("passes").where("approvedPass", "==", false).where("isTeacherPass", "==", false).get().then(docs => {
        if (docs.empty) {
            response.send("No requests"); //Take out when this becomes scheduled
        } else {
            let teacherNums = [];
            let lastDocID = ""
            docs.forEach(doc => {
                teacherNums.push(doc.data().toTeachID);
            })
            teacherNums = [...new Set(teacherNums)];

            for (i = 0; i < teacherNums.length; i++) {
                const mailOptions = {
                    from: `${APP_NAME} <noreply@firebase.com>`,
                    to: (teacherNums[i] + "@seq.org").toString(),
                    subject: "You have pending requests today",
                    text: "You have pending request from students, to approve or deny them go to slipmate.ml"
                };
                mailTransport.sendMail(mailOptions, (error, info) => {
                    console.log(mailOptions);
                    console.log(info);
                    console.log('Message sent: ' + info.response);
                });
                if (i === teacherNums.length - 1) {
                    response.send(teacherNums)//Take out when this becomes scheduled
                }
            }
        }
        return
    }).catch(err => {
        throw err;
    })
});

/**
 * This function takes in the id of the teacher as a header and outputs an array of blocked days
 */

exports.getBlockedDays = functions.https.onRequest((request, response) => {
    if (request.method === `OPTIONS`) {
        response.header('Access-Control-Allow-Origin', "https://teacher.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
            .header("Access-Control-Allow-Headers", "Content-Type, teacherid, day")
            .header("Access-Control-Allow-Credentials", 'true').status(200).send("CORS");
        return;
    }
    let teacherID = request.get("teacherID");
    db.collection("blockedDays").where("teachID", "==", teacherID).get().then(docs => {
        if(docs.empty){
            response.header('Access-Control-Allow-Origin', "https://teacher.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
                .header("Access-Control-Allow-Headers", "Content-Type, teacherid, day")
                .header("Access-Control-Allow-Credentials", 'true')
            response.send("no blocked days");
        }else{
            let passes = []
            docs.forEach(doc => {
                passes.push(doc.data().blockDay);
            });
            response.header('Access-Control-Allow-Origin', "https://teacher.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
                .header("Access-Control-Allow-Headers", "Content-Type, teacherid, day")
                .header("Access-Control-Allow-Credentials", 'true')
            response.send(passes)
        }
        return;
    }).catch(err => {
        throw err;
    })
});
/**
 * This function takes in the teacher id and returns the pending requests which they have to Approve
 */
exports.getUnapprovedSlips = functions.https.onRequest((request, response) => {
    if (request.method === `OPTIONS`) {
        response.header('Access-Control-Allow-Origin', "https://teacher.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
            .header("Access-Control-Allow-Headers", "Content-Type, teacherid")
            .header("Access-Control-Allow-Credentials", 'true').status(200).send("CORS");
        return;
    }
    let teacherID = request.get("teacherID");
    db.collection("passes").where("toTeachID", "==", teacherID).where("approvedPass", "==", false).where("isTeacherPass", "==", false).where("denied", "==", false).get().then(docs => {
        if(docs.empty){
            response.header('Access-Control-Allow-Origin', "https://teacher.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
                .header("Access-Control-Allow-Headers", "Content-Type, teacherid")
                .header("Access-Control-Allow-Credentials", 'true')
            response.send("no available passes");
        }else{
            let passes = [];
            docs.forEach(doc => {
                passes.push({
                    id: doc.id,
                    toTeachID: doc.data().toTeachID,
                    toTeachName: doc.data().toTeachName,
                    fromTeacherName: doc.data().fromTeacherName,
                    fromTeachID: doc.data().fromTeachID,
                    studentID: doc.data().studentID,
                    day: doc.data().day,
                    isTeacherPass: doc.data().isTeacherPass,
                    approvedPass: doc.data().approvedPass,
                    reason: doc.data().reason,
                });
            });
            console.log(passes);
            response.header('Access-Control-Allow-Origin', "https://teacher.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
                .header("Access-Control-Allow-Headers", "Content-Type, teacherid")
                .header("Access-Control-Allow-Credentials", 'true')
            response.send(passes);
        }
        return;
    }).catch(err => {
        throw err;
    })
});
/**
 * This function takes in one teacher id and returns information about the teacher
 */
exports.getTeacher = functions.https.onRequest((request, response) => {
    let origin = "";
    if(request.get("origin") === "https://teacher.slipmate.ml"){
        origin = "https://teacher.slipmate.ml"
    }else{
        origin = "https://student.slipmate.ml"
    }
    if (request.method === `OPTIONS`) {
        response.header('Access-Control-Allow-Origin', origin).header('Access-Control-Allow-Methods', 'GET')
                .header("Access-Control-Allow-Headers", "Content-Type, teacherid")
                .header("Access-Control-Allow-Credentials", 'true').status(200).send("CORS");
        return;
    }
    let teacherID = request.get("teacherID");
    db.collection("teacher").where("teachID","==", teacherID).get().then(docs => {
        if(docs.empty){
            response.header('Access-Control-Allow-Origin', origin).header('Access-Control-Allow-Methods', 'GET')
                .header("Access-Control-Allow-Headers", "Content-Type, teacherid")
                .header("Access-Control-Allow-Credentials", 'true')
            response.send("no teacher with this ID")
        }else{
            let data = {};
            docs.forEach(doc => {
                data = {
                    teachID: doc.data().teachID,
                    teachName: doc.data().teachName,
                    seatsSeventh: doc.data().seatsSeventh,
                    seatsSixth: doc.data().seatsSixth
                }
            })
            response.header('Access-Control-Allow-Origin', origin).header('Access-Control-Allow-Methods', 'GET')
                .header("Access-Control-Allow-Headers", "Content-Type, teacherid")
                .header("Access-Control-Allow-Credentials", 'true')
            response.send(data);
        }
        return;
    }).catch(err => {
        response.header('Access-Control-Allow-Origin', origin).header('Access-Control-Allow-Methods', 'GET')
            .header("Access-Control-Allow-Headers", "Content-Type, teacherid")
            .header("Access-Control-Allow-Credentials", 'true')
        response.send("no teacher with this ID")
        throw err
    })
});

/**
 * This function returns all teachers with no parameters
 */
exports.getAllTeachers = functions.https.onRequest((request, response) => {
    let origin = "";
    if(request.get("origin") === "https://teacher.slipmate.ml"){
        origin = "https://teacher.slipmate.ml"
    }else{
        origin = "https://student.slipmate.ml"
    }
    if (request.method === `OPTIONS`) {
        response.header('Access-Control-Allow-Origin', origin).header('Access-Control-Allow-Methods', 'GET')
            .header("Access-Control-Allow-Headers", "Content-Type")
            .header("Access-Control-Allow-Credentials", 'true').status(200).send("CORS");
        return;
    }
    db.collection("teacher").get().then(docs => {
        if(docs.empty){
            response.header('Access-Control-Allow-Origin', origin).header('Access-Control-Allow-Methods', 'GET')
                .header("Access-Control-Allow-Headers", "Content-Type")
                .header("Access-Control-Allow-Credentials", 'true')
            response.send("no teachers in the database")
        }else{
            let teachers = [];
            docs.forEach(doc => {
                teachers.push({
                    teachID: doc.data().teachID,
                    teachName: doc.data().teachName,
                    seatsSeventh: doc.data().seatsSeventh,
                    seatsSixth: doc.data().seatsSixth
                })
            });
            response.header('Access-Control-Allow-Origin', origin).header('Access-Control-Allow-Methods', 'GET')
                .header("Access-Control-Allow-Headers", "Content-Type")
                .header("Access-Control-Allow-Credentials", 'true')
            response.send(teachers);
        }
        return;
    }).catch(err => {
        throw err;
    })
});

/**
 * this deletes a slip if the id is passed
 */
exports.deleteSlip = functions.https.onRequest((request, response) => {
    let origin = "";
    if(request.get("origin") === "https://teacher.slipmate.ml"){
        origin = "https://teacher.slipmate.ml"
    }else{
        origin = "https://student.slipmate.ml"
    }
    if (request.method === `OPTIONS`) {
        response.header('Access-Control-Allow-Origin', origin).header('Access-Control-Allow-Methods', 'GET')
            .header("Access-Control-Allow-Headers", "Content-Type, id")
            .header("Access-Control-Allow-Credentials", 'true').status(200).send("CORS");
        return;
    }
    let id = request.get("ID");
    db.collection("passes").doc(id).delete().then(ref => {
        response.header('Access-Control-Allow-Origin', origin).header('Access-Control-Allow-Methods', 'GET')
            .header("Access-Control-Allow-Headers", "Content-Type, id")
            .header("Access-Control-Allow-Credentials", 'true')
        response.send("The pass has been deleted at the reference:" + ref);
        return;
    }).catch(err => {
        response.header('Access-Control-Allow-Origin', origin).header('Access-Control-Allow-Methods', 'GET')
            .header("Access-Control-Allow-Headers", "Content-Type, id")
            .header("Access-Control-Allow-Credentials", 'true')
        response.send("the pass does not exist");
        throw err;
    })
});

/**
 * this function takes in an array of blocked days as an array and adds them to the database.
 * If only one blocked day is being added I reconmend that the other create blocked dayFunction is used
 * the format of the data inputed here should be an array of the following JSON objects:
 * {
 *     teachID: **Value**,
 *     blockDay: **Value**
 * }
 */
exports.setMultipleBlockedDays= functions.https.onRequest((request, response) => {
    if (request.method === `OPTIONS`) {
        response.header('Access-Control-Allow-Origin', "https://teacher.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
            .header("Access-Control-Allow-Headers", "Content-Type, blockedDays")
            .header("Access-Control-Allow-Credentials", 'true').status(200).send("CORS");
        return;
    }
    let blockedDays = JSON.parse(request.get("blockedDays"));
    if(blockedDays.length === 0){
        response.header('Access-Control-Allow-Origin', "https://teacher.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
            .header("Access-Control-Allow-Headers", "Content-Type, blockedDays")
            .header("Access-Control-Allow-Credentials", 'true')
        response.send("invalidData")
    }
    for(let i = 0; i < blockedDays.length; i++){
        if(i === (blockedDays - 1)){
            db.collection("blockedDays").add(blockedDays[i]).then(ref => {
                response.header('Access-Control-Allow-Origin', "https://teacher.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
                    .header("Access-Control-Allow-Headers", "Content-Type, teacherid")
                    .header("Access-Control-Allow-Credentials", 'true')
                response.send("blocked days should have been added");
                return;
            }).catch(err => {
                throw err;
            })
        }else {
            db.collection("blockedDays").add(blockedDays[i]);
        }
    }
});

/**
 * This takes in an array of blocked day IDs and deletes them from the database
 */
exports.deleteBlockedDays = functions.https.onRequest((request, response) => {
    if (request.method === `OPTIONS`) {
        response.header('Access-Control-Allow-Origin', "https://teacher.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
            .header("Access-Control-Allow-Headers", "Content-Type, ids")
            .header("Access-Control-Allow-Credentials", 'true').status(200).send("CORS");
        return;
    }
    let ids = JSON.parse(request.get("ids"))
    if(ids.length === 0){
        response.header('Access-Control-Allow-Origin', "https://teacher.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
            .header("Access-Control-Allow-Headers", "Content-Type, ids")
            .header("Access-Control-Allow-Credentials", 'true')
        response.send("invalidData")
    }
    for(var i = 0; i < ids.length; i++){
        if(i === (ids.length - 1)){
            db.collection("blockedDays").doc(ids[i]).delete().then(ref => {
                response.header('Access-Control-Allow-Origin', "https://teacher.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
                    .header("Access-Control-Allow-Headers", "Content-Type, ids")
                    .header("Access-Control-Allow-Credentials", 'true')
                response.send("Blocked days should be deleted")
                return;
            }).catch(err => {
                throw err;
            })
        }else {
            db.collection("blockedDays").doc(ids[i]).delete()
        }
    }
});
/**
 * This function takes multiple slip ids and deletes them from the database
 */
exports.deleteMultipleSlips = functions.https.onRequest((request, response) => {
    let origin = "";
    if(request.get("origin") === "https://teacher.slipmate.ml"){
        origin = "https://teacher.slipmate.ml"
    }else{
        origin = "https://student.slipmate.ml"
    }
    if (request.method === `OPTIONS`) {
        response.header('Access-Control-Allow-Origin', origin).header('Access-Control-Allow-Methods', 'GET')
            .header("Access-Control-Allow-Headers", "Content-Type, id")
            .header("Access-Control-Allow-Credentials", 'true').status(200).send("CORS");
        return;
    }
    let ids = JSON.parse(request.get("ids"))
    if(ids.length === 0){
        response.header('Access-Control-Allow-Origin', origin).header('Access-Control-Allow-Methods', 'GET')
            .header("Access-Control-Allow-Headers", "Content-Type, id")
            .header("Access-Control-Allow-Credentials", 'true')
        response.send("invalidData")
    }
    let numberOfDeletions = [];
    for(var i = 0; i < ids.length; i++){
        if(i === (ids.length - 1)){
            db.collection("passes").doc(ids[i]).delete().then(ref => {
                response.header('Access-Control-Allow-Origin', origin).header('Access-Control-Allow-Methods', 'GET')
                    .header("Access-Control-Allow-Headers", "Content-Type, id")
                    .header("Access-Control-Allow-Credentials", 'true')
                response.send("Blocked days should be deleted")
                return;
            }).catch(err => {
                throw err;
            })
        }else {
            db.collection("passes").doc(ids[i]).delete()
        }
    }
});
//TODO check with aidan and Daniel if from teacher should be notified of their departing student
// immediatly, at a time, or just in the portal
/**
 * This function is meant to be used for when a teacher sends an a request and the student accepts it
 * This function takes the following headers as inputs:
 * - passID: the id of the pass
 * - studentID: the id of the student for verification
 * - fromTeacherID: the id of the teacher that the student is leaving from
 * //- studentName: name of the student leaving// only if email is sent
 */
exports.studentAcceptPass = functions.https.onRequest((request, response) => {
    if (request.method === `OPTIONS`) {
        response.header('Access-Control-Allow-Origin', "https://student.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
            .header("Access-Control-Allow-Headers", "Content-Type, ID")
            .header("Access-Control-Allow-Credentials", 'true').status(200).send("CORS");
        return;
    }
    let id = request.get("ID");
    let studentID = request.get("studentID");
    let fromTeacher = request.get("fromTeacherID");
    console.log(id);
    db.collection("passes").doc(id).get().then(doc => {
        if(doc.data().studentID !== studentID || doc.data().approvedPass === true || doc.data().isTeacherPass === false || doc.data().denied === true) {
            response.send("Wrong student approving the pass");
        }else{
            db.collection("passes").doc(id).update({
                fromTeachID: fromTeacher,
                approvedPass: true
            });
            /*
            * Leave space here for an email for from teacher
            */
            response.header('Access-Control-Allow-Origin', "https://student.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
                .header("Access-Control-Allow-Headers", "Content-Type, ID")
                .header("Access-Control-Allow-Credentials", 'true')
            response.send("finished")
        }
        return;
    }).catch(err => {
        throw err;
    })
});

/**
 * This returns a list of passes that have been approved for a student
 * It takes the following inputs as headers:
 * - studentID: the id of the student
 */
exports.getCurrentPassesForStudents = functions.https.onRequest((request, response) => {
    if (request.method === `OPTIONS`) {
        response.header('Access-Control-Allow-Origin', "https://student.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
            .header("Access-Control-Allow-Headers", "Content-Type, studentID")
            .header("Access-Control-Allow-Credentials", 'true').status(200).send("CORS");
        return;
    }
    let studentID = request.get("studentID");
    db.collection("passes").where("studentID", "==", studentID).where("approvedPass", "==", true).where("denied", "==", false).get().then(docs => {
        if(docs.empty){
            response.header('Access-Control-Allow-Origin', "https://student.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
                .header("Access-Control-Allow-Headers", "Content-Type, studentID")
                .header("Access-Control-Allow-Credentials", 'true')
            response.send("no approved requests");
        }else{
            let passes = []
            docs.forEach(doc => {
                passes.push({
                    toTeachID: doc.data().toTeachID,
                    toTeachName: doc.data().toTeachName,
                    fromTeacherName: doc.data().fromTeacherName,
                    fromTeachID: doc.data().fromTeachID,
                    studentID: doc.data().studentID,
                    day: doc.data().day,
                    isTeacherPass: doc.data().isTeacherPass,
                    approvedPass: doc.data().approvedPass,
                    reason: doc.data().reason,
                })
            })
            response.header('Access-Control-Allow-Origin', "https://student.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
                .header("Access-Control-Allow-Headers", "Content-Type, studentID")
                .header("Access-Control-Allow-Credentials", 'true')
            response.send(passes);
        }
        return;
    }).catch(err => {
        throw err;
    })
})

/**
 * This function returns the slip from which are pending from teachers
 */
exports.getPendingPassesForStudents = functions.https.onRequest((request, response) => {
    if (request.method === `OPTIONS`) {
        response.header('Access-Control-Allow-Origin', "https://student.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
            .header("Access-Control-Allow-Headers", "Content-Type, studentID")
            .header("Access-Control-Allow-Credentials", 'true').status(200).send("CORS");
        return;
    }
    let studentID = request.get("studentID");
    db.collection("passes").where("studentID", "==", studentID).where("approvedPass", "==", false).where("isTeacherPass", "==", true).where("denied", "==", false).get().then(docs => {
        if(docs.empty){
            response.header('Access-Control-Allow-Origin', "https://student.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
                .header("Access-Control-Allow-Headers", "Content-Type, studentID")
                .header("Access-Control-Allow-Credentials", 'true')
            response.send("no approved requests");
        }else{
            let passes = []
            docs.forEach(doc => {
                passes.push({
                    toTeachID: doc.data().toTeachID,
                    toTeachName: doc.data().toTeachName,
                    fromTeacherName: doc.data().fromTeacherName,
                    fromTeachID: doc.data().fromTeachID,
                    studentID: doc.data().studentID,
                    day: doc.data().day,
                    isTeacherPass: doc.data().isTeacherPass,
                    approvedPass: doc.data().approvedPass,
                    reason: doc.data().reason,
                })
            })
            response.header('Access-Control-Allow-Origin', "https://student.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
                .header("Access-Control-Allow-Headers", "Content-Type, studentID")
                .header("Access-Control-Allow-Credentials", 'true')
            response.send(passes);
        }
        return;
    }).catch(err => {
        throw err;
    })
})

/**
 * This returns a student json object given the id of the student
 */
exports.getStudent = functions.https.onRequest((request, response) => {
    let origin = "";
    if(request.get("origin") === "https://teacher.slipmate.ml"){
        origin = "https://teacher.slipmate.ml"
    }else{
        origin = "https://student.slipmate.ml"
    }
    if (request.method === `OPTIONS`) {
        response.header('Access-Control-Allow-Origin', origin).header('Access-Control-Allow-Methods', 'GET')
            .header("Access-Control-Allow-Headers", "Content-Type, studentID")
            .header("Access-Control-Allow-Credentials", 'true').status(200).send("CORS");
        return;
    }
    let id = request.get("studentID");
    db.collection("students").where("stuID", "==", id).get().then(docs => {
        if(docs.empty){
            response.header('Access-Control-Allow-Origin', origin).header('Access-Control-Allow-Methods', 'GET')
                .header("Access-Control-Allow-Headers", "Content-Type, studentID")
                .header("Access-Control-Allow-Credentials", 'true')
            response.send("there is no student with this id")
        }else{
            let student = [];
            docs.forEach(doc => {
                student.push({
                    stuID: doc.data().stuID,
                    stuName: doc.data().stuName,
                    teachSixth: doc.data().teachSixth,
                    teachSeventh: doc.data().teachSeventh,
                })
            });
            response.header('Access-Control-Allow-Origin', origin).header('Access-Control-Allow-Methods', 'GET')
                .header("Access-Control-Allow-Headers", "Content-Type, studentID")
                .header("Access-Control-Allow-Credentials", 'true')
            response.send(student)
        }
        return;
    }).catch(err => {
        throw err;
    })
});

/*TODO make sure that the function is actually being triggered by a teacher
// ask aidan to do frontside user validation
// maybe try to get the link that the function was caled from?
//TODO Ask aidan how student should be notified about approval or deniel*/
/**
 * This function should be called when a teacher approves a student made pass
 * it takes the following inputs as headers:
 * - passID: the id of the pass being approved
 * - teacherID: the id of the approving teacher
 */
exports.teacherApprovePass = functions.https.onRequest((request, response) => {
    if (request.method === `OPTIONS`) {
        response.header('Access-Control-Allow-Origin', "https://teacher.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
            .header("Access-Control-Allow-Headers", "Content-Type, passID, teacherID")
            .header("Access-Control-Allow-Credentials", 'true').status(200).send("CORS");
        return;
    }
    let passID = request.get("passID");
    let teacherID = request.get("teacherID");
    //let fromTeacher = request.get("fromTeacherID");
    //let studentName = request.get("studentName");
    db.collection("passes").doc(passID).get().then(doc => {
        if(doc.data().toTeachID !== teacherID || doc.data().approvedPass === true || doc.data().isTeacherPass === true || doc.data().denied === true){
            response.header('Access-Control-Allow-Origin', "https://teacher.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
                .header("Access-Control-Allow-Headers", "Content-Type, passID, teacherID")
                .header("Access-Control-Allow-Credentials", 'true')
            response.send("Pass has either been approved already, denied already, is a pass by the teacher, or is not assigned to this teacher");
        }else{
            db.collection("passes").doc(passID).update({
                approvedPass: true
            });
            /*
            * Leave space here for an email for student
            */
            response.header('Access-Control-Allow-Origin', "https://teacher.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
                .header("Access-Control-Allow-Headers", "Content-Type, passID, teacherID")
                .header("Access-Control-Allow-Credentials", 'true')
            response.send("finished")
        }
        return;
    }).catch(err => {
        throw err;
    })
});

/* TODO !!!!Everything from this point on is untested!!!!*/

/**
 * This function is triggered when a teacher denies a pass. It will send an email as well
 * It takes the following inputs as headers:
 * - teacherID: the id of the teacher denying the pass
 * - passID: the id of the pass being denied
 */
exports.teacherDenyPass = functions.https.onRequest((request,response) => {
    if (request.method === `OPTIONS`) {
        response.header('Access-Control-Allow-Origin', "https://teacher.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
            .header("Access-Control-Allow-Headers", "Content-Type, ID, teacherID")
            .header("Access-Control-Allow-Credentials", 'true').status(200).send("CORS");
        return;
    }
    let passID = request.get("ID");
    let teacherID = request.get("teacherID");
    db.collection("passes").doc(passID).get().then(doc => {
        if(doc.data().toTeachID !== teacherID || doc.data().approvedPass === true || doc.data().isTeacherPass === true || doc.data().denied === true){
            response.header('Access-Control-Allow-Origin', "https://teacher.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
                .header("Access-Control-Allow-Headers", "Content-Type, ID, teacherID")
                .header("Access-Control-Allow-Credentials", 'true')
            response.send("Pass has either been approved already, denied already, is a pass by the teacher, or is not assigned to this teacher");
        }else{
            db.collection("passes").doc(passID).update({
                denied: true
            });
            /*
            * Leave space here for an email for student
            */
            response.header('Access-Control-Allow-Origin', "https://teacher.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
                .header("Access-Control-Allow-Headers", "Content-Type, ID, teacherID")
                .header("Access-Control-Allow-Credentials", 'true')
            response.send("finished")
        }
        return;
    }).catch(err => {
        throw err;
    })
});
/**
 * This function denies a pass that the student made
 *
 */
exports.studentDenyPass = functions.https.onRequest((request, response) => {
    if (request.method === `OPTIONS`) {
        response.header('Access-Control-Allow-Origin', "https://student.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
            .header("Access-Control-Allow-Headers", "Content-Type, studentID")
            .header("Access-Control-Allow-Credentials", 'true').status(200).send("CORS");
        return;
    }
    let id = request.get("ID");
    let studentID = request.get("studentID");
    console.log(id);
    db.collection("passes").doc(id).get().then(doc => {
        if(doc.data().studentID !== studentID || doc.data().approvedPass === true || doc.data().isTeacherPass === false || doc.data().denied === true) {
            response.header('Access-Control-Allow-Origin', "https://student.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
                .header("Access-Control-Allow-Headers", "Content-Type, studentID")
                .header("Access-Control-Allow-Credentials", 'true')
            response.send("Wrong student approving the pass");
        }else{
            db.collection("passes").doc(id).update({
                denied: true
            });
            /*
            * Leave space here for an email for from teacher
            */
            response.header('Access-Control-Allow-Origin', "https://student.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
                .header("Access-Control-Allow-Headers", "Content-Type, studentID")
                .header("Access-Control-Allow-Credentials", 'true')
            response.send("finished")
        }
        return;
    }).catch(err => {
        throw err;
    })
});

/**
 * This function takes in the teacherID and returns the slips that were made by teachers and email unapproved
 */
exports.getTeacherSlipsUnapprovedByStudent = functions.https.onRequest((request, response) => {
    let origin = "";
    if(request.get("origin") === "https://teacher.slipmate.ml"){
        origin = "https://teacher.slipmate.ml"
    }else{
        origin = "https://student.slipmate.ml"
    }
    if (request.method === `OPTIONS`) {
        response.header('Access-Control-Allow-Origin', origin).header('Access-Control-Allow-Methods', 'GET')
            .header("Access-Control-Allow-Headers", "Content-Type, studentID")
            .header("Access-Control-Allow-Credentials", 'true').status(200).send("CORS");
        return;
    }
    let teacherID = request.get("teacherID");
    db.collection("passes").where("toTeachID", "==", teacherID).where("isTeacherPass", "==", false)
        .where("denied", "==", false).where("approvedPass", "==", false).get().then(docs => {
            if(docs.empty){
                response.header('Access-Control-Allow-Origin', origin).header('Access-Control-Allow-Methods', 'GET')
                    .header("Access-Control-Allow-Headers", "Content-Type, studentID")
                    .header("Access-Control-Allow-Credentials", 'true')
                response.send("There are no unapproved Slips")
            }else{
                let passes = [];
                docs.forEach(doc => {
                    passes.push({
                        id: doc.id,
                        toTeachID: doc.data().toTeachID,
                        toTeachName: doc.data().toTeachName,
                        fromTeacherName: doc.data().fromTeacherName,
                        fromTeachID: doc.data().fromTeachID,
                        studentID: doc.data().studentID,
                        day: doc.data().day,
                        isTeacherPass: doc.data().isTeacherPass,
                        approvedPass: doc.data().approvedPass,
                        reason: doc.data().reason,
                    })
                });
                response.header('Access-Control-Allow-Origin', origin).header('Access-Control-Allow-Methods', 'GET')
                    .header("Access-Control-Allow-Headers", "Content-Type, studentID")
                    .header("Access-Control-Allow-Credentials", 'true')
                response.send(passes);
            }
            return null;
    }).catch(err => {
        throw err;
    });
});

/**
 * This function take in an array of passIDs and a teacherID
 * and approves all the passes in the array assuming that the IDs exist
 */
exports.TeacherAcceptMultiplePasses = functions.https.onRequest((request, response) => {
    if (request.method === `OPTIONS`) {
        response.header('Access-Control-Allow-Origin', "https://teacher.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
            .header("Access-Control-Allow-Headers", "Content-Type, ID, teacherID")
            .header("Access-Control-Allow-Credentials", 'true').status(200).send("CORS");
        return;
    }
    let passes = JSON.parse(request.get("passIDs"));
    let teacherID = request.get("teacherID");
    for(let i = 0; i < passes.length; i++){
        if(i === (passes.length-1)){
            db.collection("passes").doc(passes[i]).get().then(doc => {
                if(doc.data().toTeachID !== teacherID || doc.data().approvedPass === true || doc.data().isTeacherPass === true || doc.data().denied === true){
                    throw new Error("this passID does not exist")
                }else{
                    db.collection("passes").doc(passes[i]).update({
                        approvedPass: true
                    });
                }
                return;
            }).catch(err => {
                throw err;
            })
        }else{
            db.collection("passes").doc(passes[i]).get().then(doc => {
                if(doc.data().toTeachID !== teacherID || doc.data().approvedPass === true || doc.data().isTeacherPass === true || doc.data().denied === true){
                    response.header('Access-Control-Allow-Origin', "https://teacher.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
                        .header("Access-Control-Allow-Headers", "Content-Type, ID, teacherID")
                        .header("Access-Control-Allow-Credentials", 'true')
                    response.send("Pass has either been approved already, denied already, is a pass by the teacher, or is not assigned to this teacher");
                }else{
                    db.collection("passes").doc(passes[i]).update({
                        approvedPass: true
                    });
                    response.header('Access-Control-Allow-Origin', "https://teacher.slipmate.ml").header('Access-Control-Allow-Methods', 'GET')
                        .header("Access-Control-Allow-Headers", "Content-Type, ID, teacherID")
                        .header("Access-Control-Allow-Credentials", 'true')
                    response.send("finished")
                }
                return;
            }).catch(err => {
                throw err;
            })
        }
    }
});
