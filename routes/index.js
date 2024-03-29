var express = require('express');
var router = express.Router();

const AssignmentController = require('../controllers/assignment.controller');
const ExamController = require('../controllers/exams.controller')
const NoteController = require('../controllers/notes.controller');
const UserController = require('../controllers/user.controller');
const ForgotPasswordController = require('../controllers/forgotpassword.controller');
const authService = require('../services/auth.service');
const SubjectController = require('../controllers/subject.controller');
const SemesterController = require('../controllers/semester.controller');
const UploadController = require('../controllers/upload.controller');
const DoubtController = require('../controllers/doubt.controller');
const multerUpload = require('../lib/multer/index');
const passport = require('passport');
require('./../middleware/passport')(passport)

var requireAuth = passport.authenticate('jwt', { session: false });

router.post('/users', UserController.create); //create   
router.get('/users', requireAuth, authService.roleAuthorization(["user"]), UserController.get);  //read
router.put('/users', requireAuth, authService.roleAuthorization(["user"]), UserController.update); //update  
router.get('/users/list', requireAuth, authService.roleAuthorization(["admin"]), UserController.userList); //update  
router.put('/users/others', requireAuth, authService.roleAuthorization(["admin"]), UserController.updateOtherUser); //update  
router.get('/users/getUser', requireAuth, authService.roleAuthorization(["admin"]), UserController.getUser); //update  
router.post('/users/login', UserController.login);
router.get('/users/activation', UserController.userActivation);
router.get('/users/profile', requireAuth, UserController.profile);


router.post("/forgot", ForgotPasswordController.forgotPassword);
router.post("/reset/verify", ForgotPasswordController.resetTokenVerify);
router.post("/reset/password", ForgotPasswordController.resetPassword);

router.post("/assignment", requireAuth, authService.roleAuthorization(["user"]), AssignmentController.create);
router.get("/assignment", requireAuth, authService.roleAuthorization(["user"]), AssignmentController.get);
router.put('/assignment', requireAuth, authService.roleAuthorization(["user"]), AssignmentController.update); //update  
router.delete('/assignment', requireAuth, authService.roleAuthorization(["user"]), AssignmentController.remove); //update  
router.get("/assignment/myAssignments", requireAuth, authService.roleAuthorization(["user"]), AssignmentController.myAssignments);
router.get("/assignment/getListByMonth", requireAuth, authService.roleAuthorization(["user"]), AssignmentController.assignmentListByMonth);

router.post("/note", requireAuth, authService.roleAuthorization(["user"]), NoteController.create);
router.get("/note/mynotes", requireAuth, authService.roleAuthorization(["user"]), NoteController.list);
router.get("/note", requireAuth, authService.roleAuthorization(["user"]), NoteController.get);
router.put("/note", requireAuth, authService.roleAuthorization(["user"]), NoteController.update);
router.delete("/note", requireAuth, authService.roleAuthorization(["user"]), NoteController.remove);
router.get('/note/public', NoteController.publiclist);
router.get('/note/view', NoteController.getPublic);

router.post("/subject", requireAuth, authService.roleAuthorization(["admin"]), SubjectController.create);
router.get("/subject", SubjectController.get);
router.put("/subject", requireAuth, authService.roleAuthorization(["admin"]), SubjectController.update);
router.get("/subject/list", SubjectController.list);
router.post("/subject/listbysem", requireAuth, authService.roleAuthorization(["user"]), SubjectController.getBySem);

router.post("/semester", requireAuth, authService.roleAuthorization(["user"]), SemesterController.create);
router.get("/semester", requireAuth, authService.roleAuthorization(["user"]), SemesterController.get);
router.put("/semester", requireAuth, authService.roleAuthorization(["user"]), SemesterController.update);
router.delete("/semester", requireAuth, authService.roleAuthorization(["user"]), SemesterController.remove);
router.get("/semester/list", requireAuth, authService.roleAuthorization(["admin"]), SemesterController.list);
router.post("/semester/grade", requireAuth, authService.roleAuthorization(["user"]), SemesterController.findgrade);
router.get("/semester/mySemesters", requireAuth, authService.roleAuthorization(["user"]), SemesterController.mySemesters);

router.post('/upload/file', requireAuth, authService.roleAuthorization(["user"]), multerUpload.single('file'), UploadController.uploadFile);

router.post("/exam/create", requireAuth, authService.roleAuthorization(["user"]), ExamController.create);
router.get("/exam", requireAuth, authService.roleAuthorization(["user"]), ExamController.get);
router.get("/exam/list", requireAuth, authService.roleAuthorization(["user"]), ExamController.list);
router.get("/exam/getListByMonth", requireAuth, authService.roleAuthorization(["user"]), ExamController.examListByMonth);

router.post("/doubt/create", requireAuth, authService.roleAuthorization(["user"]), DoubtController.create);
router.get("/doubt/listUserDoubts", requireAuth, authService.roleAuthorization(["user"]), DoubtController.listUserDoubts);
router.delete("/doubt/solve", requireAuth, authService.roleAuthorization(["user"]), DoubtController.solveDoubt);

router.get("/doubt/listAcademicDoubts", requireAuth, authService.roleAuthorization(["academic-support"]), DoubtController.listAcademicDoubts);
router.get("/doubt/listCustomerDoubts", requireAuth, authService.roleAuthorization(["customer-support"]), DoubtController.listCustomerDoubts);
router.post("/doubt/acceptDoubt", requireAuth, authService.roleAuthorization(["academic-support", "customer-support"]), DoubtController.acceptDoubt);

module.exports = router;
