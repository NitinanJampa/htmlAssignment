class Data {
    students;
    courses;
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection;
let readStudentData;
let readCourseData;

function initialize() {
    return new Promise(function (resolve, reject) {
        console.log("start read Student");
        readStudent().then(function () {
            console.log("start read Course");
            readCourse().then(function () {
                console.log("assign dataCollection");
                dataCollection = new Data(readStudentData, readCourseData);
                console.log("successfully initialized dataCollection");
                return resolve();
            }).catch(function (err) {
                console.log("there was an error at initialize function: readcourse section " +err);
                return reject();
            })
        }).catch(function (err) {
            console.log("there was an error at initialize function: readStudent section "+err);
            return reject();
        })
    })
}

function readStudent() {
    return new Promise(function (resolve, reject) {

        const fs = require('fs');
        let readCourseData;
        fs.readFile('./data/students.json', 'utf8', function (err, studentData) {
            if (err) {
                console.log("there was an error at readStudent function: readFile ");
                return reject();
            }
            try {
                readStudentData = JSON.parse(studentData);
                return resolve();
            } catch (err) {
                console.log("error at readStudent function: parsing JSON ");
                return reject();
            }
        });
    })
}

function readCourse() {
    return new Promise(function (resolve, reject) {

        const fs = require('fs');
        fs.readFile('./data/courses.json', 'utf8', function (err, courseData) {
            if (err) {
                console.log("there was an error at readCourse function: readFile ");
                return reject();
            }
            try {
                readCourseData = JSON.parse(courseData);
                return resolve();
            } catch (err) {
                console.log("error at readCourse function: parsing JSON ");
                return reject();
            }
        });
    })
}

function getAllStudents() {
    return new Promise(function (resolve, reject) {
        let studenyArray = dataCollection.students
        if (studenyArray.length > 0) {
            return resolve(studenyArray);
        } else {
            console.log("empty studenyArray data");
            return reject();
        }
    }).catch(function (err) {
        console.log("there was an error in collegeData.js: at getAllStudents()");
        return reject();
    });
}

function getTAs() {
    return new Promise(function (resolve, reject) {
        let TAArray = dataCollection.students.filter(function (TAArray) {
            return TAArray.TA == true;
        });
        if (TAArray.length > 0) {
            return resolve(TAArray);
        } else {
            console.log("empty TAArray data");
            return reject();
        }
    }).catch(function (err) {
        console.log("there was an error in collegeData.js: at getTAs()");
        return reject();
    });
}

function getCourses() {
    return new Promise(function (resolve, reject) {
        let courseArray = dataCollection.courses;
        if (courseArray.length > 0) {
            return resolve(courseArray);
        } else {
            console.log("empty courseArray data");
            return reject();
        }
    }).catch(function (err) {
        console.log("there was an error in collegeData.js: at getCourses()");
        return reject();
    });
}

function getStudentsByCourse(course) {
    return new Promise(function (resolve, reject) {
        let studentInCourse = dataCollection.students.filter(function (studentInCourse) {
            return studentInCourse.course == course;
        });
        if (studentInCourse.length > 0) {
            return resolve(studentInCourse);
        } else {
            console.log("empty getStudentsByCourse data");
            return reject();
        }
    }).catch(function (err) {
        console.log("there was an error in collegeData.js: at getStudentsByCourse()");
        return reject();
    });
}

function getStudentByNum(num) {
    return new Promise(function (resolve, reject) {
        let matchStudent = dataCollection.students.filter(function (matchStudent) {
            return matchStudent.studentNum == num;
        });
        if (matchStudent.length > 0) {
            return resolve(matchStudent);
        } else {
            console.log("empty matchStudent data");
            return reject();
        }
    }).catch(function (err) {
        console.log("there was an error in collegeData.js: at getStudentByNum()");
        return reject();
    });
}

function addStudent(studentData) {
    const fs = require('fs');
    const fsPromises = require('fs').promises;
    return new Promise(function (resolve, reject) {
        fs.readFile('./data/students.json', 'utf8', function readFileCallback(err, data) {
            if (err) {
                reject(err);
            } else {
                let readData = JSON.parse(data);
                readData.push({
                    studentNum: readData.length+1,
                    firstName: studentData.firstName,
                    lastName: studentData.lastName,
                    email: studentData.email,
                    addressStreet: studentData.street,
                    addressCity: studentData.city,
                    addressProvince: studentData.province,
                    TA: studentData.ta == "on" ? true : false,
                    status: studentData.enrollment,
                    course: studentData.course
                });
                addedData = JSON.stringify(readData);

                (async function wrtie() {
                    try {
                        await fsPromises.writeFile("./data/students.json", addedData)
                    } catch (err) {
                        console.error(err);
                    }
                })().then(resolve());
            }
        });
    }).catch(function (err) {
        reject(err);
    });
}

module.exports = {
    initialize,
    getAllStudents,
    getTAs,
    getCourses,
    getStudentsByCourse,
    getStudentByNum,
    addStudent
};