var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index'); //引入index模块路由文件
var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
var linksRouter = require('./routes/links');
var companyRouter = require('./routes/company');
var courseRouter = require('./routes/course')
var groupRouter = require('./routes/group')
var welfareRouter = require('./routes/welfare')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// 允许跨域
app.all('*', function(req, res, next) {
    console.log(req.headers.origin)
        //console.log(req.environ)
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    // res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With,X-Token");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("X-Powered-By", ' 3.2.1')
    if (req.method === "OPTIONS") res.sendStatus(200); /*让options请求快速返回*/
    else next();
});



//路由
app.use('/', indexRouter); //定义指向index.js的路由
app.use('/user', userRouter); //定义指向user.js的路由
app.use('/admin', adminRouter)
app.use('/links', linksRouter)
app.use('/company', companyRouter)
app.use('/course', courseRouter)
app.use('/group', groupRouter)
app.use('/welfare', welfareRouter)

//在此配置路由中间件
//const verifyMiddleware = require('./routes/middleware/verify')
//app.use('/wish', verifyMiddleware.verifyToken, wishRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;