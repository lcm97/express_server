var express = require('express');
var router = express.Router();
// 引入自定义的controller
const IndexController = require('../controllers/index')
    // 引入multer模块
const multer = require('multer');
// 创建文件上传中间件
const uploadMiddleware = multer();


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

// 定义上传文件路由，POST请求  key = file
router.post('/upload', uploadMiddleware.single('file'), IndexController.upload);


module.exports = router;