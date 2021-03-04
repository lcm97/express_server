var express = require('express');
var router = express.Router();
// 引入自定义的controller
const IndexController = require('../controllers/index')

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

/*定义登录路由，POST请求*/
router.post('/login', IndexController.login);


module.exports = router;