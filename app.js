var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var session=require('express-session');

//跨域  后期删
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin); //为了跨域保持session，所以指定地址，不能用*
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Authorization , Access-Control-Request-Headers');
    res.header('Access-Control-Allow-Credentials', true);
    if(req.method === 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});

app.use(session({
    secret:'PNfeather1314',               //设置 session 签名
    name:'PNfeather',
    cookie:{maxAge:60*1000*60*24}, // 储存的时间 24小时
    resave:false,             // 每次请求都重新设置session
    saveUninitialized:true
}));

// 验证用户登录
app.use(function(req, res, next){

    //后台请求
    if(req.session.username && req.url.indexOf("logout") < 0 && req.url.indexOf("login") < 0){ //表示已经登录后台
        res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});//设置response编码为utf-8
        next();
    }else if( req.url.indexOf("login") >=0 || req.url.indexOf("logout") >= 0){
        //登入，登出不需要登录
        next();
    }else {
        //next(); //TODO:这里是调试的时候打开的，以后需要删掉
        res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});//设置response编码为utf-8
        let obj = {
            code: '401',
            msg: '未登录或登录已过期，请从新登录'
        }
        res.end(JSON.stringify(obj));

    };

});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
