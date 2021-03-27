var express = require('express');
var router = express.Router();
const UserController = require('../controllers/user');

router.get('/list', UserController.list);
router.put('/update', UserController.update)
router.delete('/remove', UserController.remove)

router.get('/findorcreate', UserController.findorcreate)
router.get('/count', UserController.count)


module.exports = router;