var express = require('express');
var router = express.Router();

const SubjectController = require('../controllers/subject.controller');
const UserController = require('../controllers/user.controller');

router.post("/subject", SubjectController.create);
router.get("/subject", SubjectController.get);
router.put("/subject", SubjectController.update);
router.get("/subject/list", SubjectController.list);

router.post('/users', UserController.create);
router.get('/users/activation', UserController.userActivation);
router.put('/users/updatepassword', UserController.updatePassword);
router.post('/users/login', UserController.login);

module.exports = router;
