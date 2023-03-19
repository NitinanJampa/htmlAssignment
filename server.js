/*********************************************************************************
* WEB700 – Assignment 05
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: ___Nitinan_Jampa_______ Student ID: __118707223___ Date: ____19/3/2023_____
*
* Online (Cyclic) Link: ________https://jittery-vest-tick.cyclic.app/______________
*
********************************************************************************/
var path = require("path");
const collegeData = require('./modules/collegeData.js');
var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
const exphbs = require('express-handlebars');
app.use(express.static("public"));

app.engine('.hbs', exphbs.engine({
    extname: '.hbs',
    layoutsDir: __dirname + '/views/layouts',
    helpers: {
        navLink: function (url, options) {
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +
                '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }

    }
}));
app.set('view engine', '.hbs');

app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    next();
});

collegeData.initialize().then(function () {

    app.get("/", (req, res) => {
        res.render('home', {
            layout: "main"
        });
    });

    app.get("/about", (req, res) => {
        res.render('about', {
            layout: "main"
        });
    });

    app.get("/htmlDemo", (req, res) => {
        res.render('htmlDemo', {
            layout: "main"
        });
    });

    app.get("/course/:courseID", (req, res) => {
        collegeData.getCourseByID(req.params.courseID).then((returnedData) => {
            res.render('course', {
                course: returnedData,
                layout: "main"
            });
        }).catch(function (err) {
            res.render("course", {
                message: "no results",
                layout: "main"
            });
        });
    });

    app.get("/courses", (req, res) => {
        collegeData.getCourses().then((returnedArray) => {
            res.render('courses', {
                courses: returnedArray,
                layout: "main"
            });
        }).catch(function (err) {
            res.render("courses", {
                message: "no results",
                layout: "main"
            });
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
        res.render('addStudent', {
            layout: "main"
        });
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

    app.post("/student/update", (req, res) => {
        collegeData.updateStudent(req.body).then(() => {
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
            res.render('student', {
                student: returnedArray,
                layout: "main"
            });
        }).catch(function (err) {
            res.render("student", {
                message: "request getStudentByNum error, please check your parameter",
                layout: "main"
            });
        });
    });

    app.get("/students:course?", (req, res) => {
        collegeData.initialize().then(function () {
            if (req.query.course != null) {
                collegeData.getStudentsByCourse(req.query.course).then((returnedArray) => {
                    res.render('students', {
                        students: returnedArray,
                        layout: "main"
                    });
                }).catch(function (err) {
                    res.render("students", {
                        message: "request StudentsByCourse error, please check your parameter",
                        layout: "main"
                    });
                });
            } else if (req.query.course == null) {
                collegeData.getAllStudents().then((returnedArray) => {
                    res.render('students', {
                        students: returnedArray,
                        layout: "main"
                    });
                }).catch(function (err) {
                    res.render("students", {
                        message: "no results",
                        layout: "main"
                    });
                });
            }
        }).catch(function (err) {
            res.send('error at re-initialize, students page');
        });
    });

    app.get('*', function (req, res) {
        res.render('errorpage', {
            layout: "main"
        });
    });

    // setup http server to listen on HTTP_PORT
    app.listen(HTTP_PORT, () => { console.log("server listening on port: " + HTTP_PORT) });

})