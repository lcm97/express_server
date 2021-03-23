var express = require('express');
var router = express.Router();

const WelfareController = require('../controllers/welfare');

router.get('/list', WelfareController.list);
router.post('/add', WelfareController.add);
router.put('/update', WelfareController.update);
router.delete('/remove', WelfareController.remove)

router.get('/findall', WelfareController.findall)

module.exports = router;