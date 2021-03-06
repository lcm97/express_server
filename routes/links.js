var express = require('express');
var router = express.Router();

const LinksController = require('../controllers/links');

router.get('/list', LinksController.list);
router.post('/add', LinksController.add);
router.put('/update', LinksController.update);
router.delete('/remove', LinksController.remove)

router.get('/findall', LinksController.findall)
router.get('/updateviews', LinksController.updateviews)
router.get('/updateshares', LinksController.updateshares)
module.exports = router;