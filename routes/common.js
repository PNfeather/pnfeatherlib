var express = require('express');
var router = express.Router();
var handler = require('./dbhandler.js');

// 获取服务器时间
router.get('/time', function(req, res, next) {
    let resData = {};
    const time = new Date();
    resData.code = 0;
    resData.data = time;
    resData.msg = '获取服务器时间成功';
    res.end(JSON.stringify(resData));
});

module.exports = router;
