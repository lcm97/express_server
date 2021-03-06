var express = require('express');
var router = express.Router();

const CompanyController = require('../controllers/company');

router.get('/list', CompanyController.list);
router.post('/add', CompanyController.add);
router.put('/update', CompanyController.update);
router.delete('/remove', CompanyController.remove)

router.get('/findall', CompanyController.findall)

module.exports = router;