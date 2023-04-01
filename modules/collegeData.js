const Sequelize = require('sequelize');
var sequelize = new Sequelize('wnsgwods', 'wnsgwods', '0r2BKBZE5jnazybviIsaKXXmMXUj2a7N', {
    host: 'chunee.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

var Student = sequelize.define('Student', {
    studentNum: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING
});

var Course = sequelize.define('Course', {
    courseId: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING
});

Course.hasMany(Student, { foreignKey: 'course' });

function initialize() {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(() => {
            resolve();
        }).catch(err => {
            reject(err);
        })
    });
}

function getAllStudents() {
    return new Promise((resolve, reject) => {
        Student.findAll(
        ).then((data) => {
            resolve(data)
        }).catch(err => {
            reject(err)
        })
    });
}

function getTAs() {
    return new Promise((resolve, reject) => {
        Student.findAll({
            where: { TA: true }
        }).then(data => {
            resolve(data)
        }).catch(err => {
            reject(err);
        })
    });
}

function getCourses() {
    return new Promise((resolve, reject) => {
        Course.findAll().then((data) => {
            resolve(data)
        }).catch(err => {
            reject(err)
        })
    });
}

function getCourseByID(courseID) {
    return new Promise((resolve, reject) => {
        Course.findAll({
            where: { courseId: courseID }
        }).then((data) => {
            resolve(data)
        }).catch(err => {
            reject(err)
        })
    });
}

function getStudentsByCourse(courseid) {
    return new Promise((resolve, reject) => {
        Student.findAll({
            where: { course: courseid }
        }).then(data => {
            resolve(data)
        }).catch(err => {
            reject(err);
        })
    });
}

function getStudentByNum(num) {
    return new Promise((resolve, reject) => {
        Student.findAll({
            where: { studentNum: num }
        }).then(data => {
            resolve(data)
        }).catch(err => {
            reject(err);
        })
    });
}

function addStudent(studentData) {
    return new Promise((resolve, reject) => {
        studentData.firstName = (studentData.firstName != null) ? studentData.firstName : '';
        studentData.lastName = (studentData.lastName != null) ? studentData.lastName : '';
        studentData.email = (studentData.email != null) ? studentData.email : '';
        studentData.addressStreet = (studentData.addressStreet != null) ? studentData.addressStreet : '';
        studentData.addressCity = (studentData.addressCity != null) ? studentData.addressCity : '';
        studentData.addressProvince = (studentData.addressProvince != null) ? studentData.addressProvince : '';
        studentData.TA = (studentData.TA) ? true : false;
        studentData.status = (studentData.status != null) ? studentData.status : '';
        studentData.course = (studentData.course != null) ? studentData.course : 0;
        Student.create(studentData).then(() => {
            resolve();
        }).catch(err => {
            reject(err);
        })
    });
}

function updateStudent(studentData) {
    return new Promise((resolve, reject) => {
        studentData.TA = (studentData.TA) ? true : false;
        Student.update(studentData, {
            where: {
                studentNum: studentData.studentNum
            }
        }).then(() => {
            resolve();
        }).catch(err => {
            reject(err);
        });
    });
}

function deleteStudentByNum(Num) {
    return new Promise((resolve, reject) => {
        Student.destroy({
            where: {
                studentNum: Num
            }
        }).then(() => {
            resolve();
        }).catch(err => {
            reject(err);
        });
    });
}

function addCourse(courseData) {
    return new Promise((resolve, reject) => {
        courseData.courseCode = (courseData.courseCode != null) ? courseData.courseCode : '';
        courseData.courseDescription = (courseData.courseDescription != null) ? courseData.courseDescription : '';
        Course.create(courseData).then(() => {
            resolve();
        }).catch(err => {
            reject(err);
        })
    });
}

function updateCourse(courseData) {
    return new Promise((resolve, reject) => {
        Course.update(courseData, {
            where: {
                courseId: courseData.courseId
            }
        }).then(() => {
            resolve();
        }).catch(err => {
            reject(err);
        });
    });
}

function deleteCourseByID(courseId) {
    return new Promise((resolve, reject) => {
        Course.destroy({
            where: {
                courseId: courseId
            }
        }).then(() => {
            resolve();
        }).catch(err => {
            reject(err);
        });
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
    updateStudent,
    deleteStudentByNum,
    addCourse,
    updateCourse,
    deleteCourseByID
};