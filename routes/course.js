var express = require('express');
var router = express.Router();

const CourseController = require('../controllers/course');

router.get('/list', CourseController.list);
router.post('/add', CourseController.add);
router.put('/update', CourseController.update);
router.delete('/remove', CourseController.remove)

router.get('/findall', CourseController.findall)
router.get('/info', CourseController.info)
router.put('/draft', CourseController.draft)
router.put('/publish', CourseController.publish)

router.get('/listbyid', CourseController.listbyid)

module.exports = router;