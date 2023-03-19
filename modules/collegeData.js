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

function getCourseByID(courseID) {
    return new Promise(function (resolve, reject) {
        let courseByID = dataCollection.courses[dataCollection.courses.findIndex(course => course.courseId == courseID)];
        if (courseByID != null) {
            return resolve(courseByID);
        } else {
            console.log("empty courseData");
            return reject();
        }
    }).catch(function (err) {
        console.log("there was an error in collegeData.js: at getCourseByID()");
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
        let matchStudent = dataCollection.students[dataCollection.students.findIndex(student => student.studentNum == num)];
        if (matchStudent != null) {
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
                    TA: studentData.TA == "on" ? true : false,
                    status: studentData.status,
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

function updateStudent(studentData) {
    const fs = require('fs');
    const fsPromises = require('fs').promises;
    return new Promise(function (resolve, reject) {
        fs.readFile('./data/students.json', 'utf8', function readFileCallback(err, data) {
            if (err) {
                reject(err);
            } else {
                let readData = JSON.parse(data);
                let target = readStudentData.findIndex(student => student.studentNum == studentData.studentNum);
                if(target != null){
                    readData[target].firstName = studentData.firstName;
                    readData[target].lastName = studentData.lastName;
                    readData[target].email = studentData.email;
                    readData[target].addressStreet = studentData.addressStreet;
                    readData[target].addressCity = studentData.addressCity;
                    readData[target].addressProvince = studentData.addressProvince;
                    readData[target].TA = (studentData.TA != null ? true : false);
                    console.log(studentData.TA);
                    readData[target].status = studentData.status;
                    readData[target].course = studentData.course;
                }else{
                    console.log("studentData not found at updateStudent");
                    reject();
                }
                readData = JSON.stringify(readData);

                (async function wrtie() {
                    try {
                        await fsPromises.writeFile("./data/students.json", readData)
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
    getCourseByID,
    getStudentsByCourse,
    getStudentByNum,
    addStudent,
    updateStudent
};