var express = require('express');
var router = express.Router();

const GroupController = require('../controllers/group');

router.get('/list', GroupController.list);
router.post('/add', GroupController.add);
router.put('/update', GroupController.update);
router.delete('/remove', GroupController.remove)
router.get('/info', GroupController.info)

router.get('/iscap', GroupController.iscap)
router.get('/listbyid', GroupController.listbyid)

module.exports = router;