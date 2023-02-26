/*********************************************************************************
* WEB700 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: ___Nitinan_Jampa_______ Student ID: __118707223___ Date: ____14/2/2023_____
*
********************************************************************************/var path = require("path");
const collegeData = require('./modules/collegeData.js');
var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();

app.use(express.static("public"));
// setup a 'route' to listen on the default url path
// app.get("/", (req, res) => {
//     res.send("sfghjfssssssgjgfjfgj");
// });

// app.get("/about",(req,res)=>{
//     res.send("About")
//   });

app.use(express.urlencoded({ extended: true }));

collegeData.initialize().then(function () {
    app.get("/", (req, res) => {
        res.sendFile(__dirname + '/views/home.html');
    });

    app.get("/about", (req, res) => {
        res.sendFile(__dirname + '/views/about.html');
    });

    app.get("/htmlDemo", (req, res) => {
        res.sendFile(__dirname + '/views/htmlDemo.html');
    });

    app.get("/courses", (req, res) => {
        collegeData.getCourses().then((returnedArray) => {
            res.send(returnedArray);
        }).catch(function (err) {
            res.send({ message: "no results" });
        });
    });

    app.get("/tas", (req, res) => {
        collegeData.getTAs().then((returnedArray) => {
            res.send(returnedArray);
        }).catch(function (err) {
            res.send({ message: "no results" });
        });
    });

    app.get("/students/add", (req, res) => {
        res.sendFile(__dirname + '/views/addStudent.html');
    });

    app.post("/students/add", (req, res) => {
        //re read to update student list
        collegeData.addStudent(req.body).then(() => {
            collegeData.initialize().then(function () {
                res.redirect("/students");
            }).catch(function (err) {
                res.send('error at re-initialize');
            });
        }).catch(function (err) {
            res.send('add student error');
        });
    });

    app.get("/student/:num", (req, res) => {
        collegeData.getStudentByNum(req.params.num).then((returnedArray) => {
            res.send(returnedArray);
        }).catch(function (err) {
            res.send('request student error, please check your parameter');
        });
    });

    app.get("/students:course?", (req, res) => {
        if (req.query.course != null) {
            collegeData.getStudentsByCourse(req.query.course).then((returnedArray) => {
                res.send(returnedArray);
            }).catch(function (err) {
                res.send('request StudentsByCourse error, please check your parameter');
            });
        } else if (req.query.course == null) {
            collegeData.getAllStudents().then((returnedArray) => {
                res.send(returnedArray);
            }).catch(function (err) {
                res.send("no data found");
            });
        }
    });

    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/views/errorpage.html');
    });

    // setup http server to listen on HTTP_PORT
    app.listen(HTTP_PORT, () => { console.log("server listening on port: " + HTTP_PORT) });

})