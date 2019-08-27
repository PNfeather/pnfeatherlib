var express = require('express');
var router = express.Router();
var handler = require('./dbhandler.js');
var crypto = require('crypto');
var ObjectId = require('mongodb').ObjectId;

/* POST users listing. */
//登录
router.post('/login', function(req, res, next) {

    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');

    handler(req, res, "user", {name: req.body.username},function(data){
        let resData = {};
        if (data.length===0) {
            resData.code = -1;
            resData.msg = '抱歉，系统中并无该用户，如有需要，请向管理员申请';
        } else if(data[0].password !== password){
            resData.code = -2;
            resData.msg = '密码不正确';
        } else if (data.length!==0&&data[0].password===password) {
            req.session.username = req.body.username; //存session
            req.session.password = password;
            resData.code = 0;
            resData.data = {
                level: data[0].level
            };
            resData.msg = '登录成功';
        }
        res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});//设置response编码为utf-8
        res.end(JSON.stringify(resData));

    });

});

//退出
router.post('/logout', (req, res, next) => {
    req.session.username = ""; //清除session
    req.session.password = "";
    let resData = {
      code: 0,
      msg: '登出成功'
    };
    res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});//设置response编码为utf-8
    res.end(JSON.stringify(resData));
});

module.exports = router;
