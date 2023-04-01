/*********************************************************************************
* WEB700 – Assignment 06
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
            if (returnedData != null) {
                console.log(returnedData);
                res.render('course', {
                    course: returnedData,
                    layout: "main"
                });
            } else {
                res.status(404).send("Course Not Found");
            }
        }).catch(function (err) {
            res.render("course", {
                message: "no results",
                layout: "main"
            });
        });
    });

    app.get("/courses", (req, res) => {
        collegeData.getCourses().then((returnedArray) => {
            if (returnedArray.length > 0) {
                res.render('courses', {
                    courses: returnedArray,
                    layout: "main"
                });
            } else {
                res.render("courses", { message: "no results" });

            }
        }).catch(function (err) {
            res.render("courses", {
                message: "no results",
                layout: "main"
            });
        });
    });

    app.get("/courses/add", (req, res) => {
        res.render('addCourse', {
            layout: "main"
        });
    });

    app.post("/courses/add", (req, res) => {
        //re read to update student list
        collegeData.addCourse(req.body).then(() => {
            collegeData.initialize().then(function () {
                res.redirect("/courses");
            }).catch(function (err) {
                res.send('error at re-initialize');
            });
        }).catch(function (err) {
            res.send('add course error');
        });
    });

    app.post("/course/update", (req, res) => {
        collegeData.updateCourse(req.body).then(() => {
            collegeData.initialize().then(function () {
                res.redirect("/courses");
            }).catch(function (err) {
                res.send('error at re-initialize');
            });
        }).catch(function (err) {
            res.send('update course error');
        });
    });

    app.post("/course/delete/:courseID", (req, res) => {
        collegeData.deleteCourseByID(req.params.courseID).then(() => {
            collegeData.initialize().then(function () {
                res.redirect("/courses");
            }).catch(function (err) {
                res.send('error at re-initialize');
            });
        }).catch(function (err) {
            res.send('delete course error');
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
        collegeData.getCourses(req.body).then((data) => {
            res.render('addStudent', {
                courses: data,
                layout: "main"
            });
        }).catch(function (err) {
            res.render("addStudent", { courses: [] });
            //res.send('add student error');
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
            res.redirect("/students");
        }).catch(function (err) {
            res.send('add student error' + err.message);
        });
    });

    app.post("/student/delete/:num", (req, res) => {
        collegeData.deleteCourseByID(req.params.courseID).then(() => {
            collegeData.initialize().then(function () {
                res.redirect("/courses");
            }).catch(function (err) {
                res.send('error at re-initialize');
            });
        }).catch(function (err) {
            res.status(500).send("Unable to Remove Student / Student not found");
        });
    });

    // app.get("/student/:num", (req, res) => {
    //     collegeData.getStudentByNum(req.params.num).then((returnedArray) => {
    //         //console.log(returnedArray);
    //         res.render('student', {
    //             student: returnedArray,
    //             layout: "main"
    //         });
    //     }).catch(function (err) {
    //         res.render("student", {
    //             message: "request getStudentByNum error, please check your parameter",
    //             layout: "main"
    //         });
    //     });
    // });

    app.get("/student/:studentNum", (req, res) => {
        // initialize an empty object to store the values
        let viewData = {};
        collegeData.getStudentByNum(req.params.studentNum).then((data) => {
            if (data) {
                viewData.student = data; //store student data in the "viewData" object as "student"
            } else {
                viewData.student = null; // set student to null if none were returned
            }
        }).catch(() => {
            viewData.student = null; // set student to null if there was an error
        }).then(collegeData.getCourses)
            .then((data) => {
                viewData.courses = data; // store course data in the "viewData" object as "courses"
                // loop through viewData.courses and once we have found the courseId that matches
                // the student's "course" value, add a "selected" property to the matching
                // viewData.courses object
                for (let i = 0; i < viewData.courses.length; i++) {
                    if (viewData.courses[i].courseId == viewData.student[0].course) {
                        viewData.courses[i].selected = true;
                    }
                }
            }).catch(() => {
                viewData.courses = []; // set courses to empty if there was an error
            }).then(() => {
                if (viewData.student == null) { // if no student - return an error
                    res.status(404).send("Student Not Found");
                } else {
                    res.render("student", { viewData: viewData }); // render the "student" view
                }
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
                    if (returnedArray.length > 0) {
                        res.render('students', {
                            students: returnedArray,
                            layout: "main"
                        });
                    } else {
                        res.render("students", { message: "no results" });

                    }
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