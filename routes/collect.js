var express = require('express');
var router = express.Router();
var handler = require('./dbhandler.js');
var crypto = require('crypto');
var ObjectId = require('mongodb').ObjectId;

//获取收藏列表
router.get('/classifyList', function(req, res, next) {
    req.route.path = "/show"; //修改path来设定 对 数据库的操作
    handler(req, res, "collectionClassifyList", {},function(data){
        let resData = {};
        resData.code = 0;
        resData.msg = '获取列表数据成功';
        resData.data = data;
        res.end(JSON.stringify(resData));
    }, {_id: -1});
});

//添加收藏分类
router.post('/addClassify', function(req, res, next) {
    req.route.path = "/show"; //修改path来设定 对 数据库的操作
    console.log(req.body);
    handler(req, res, "collectionClassifyList", {value: req.body.value},function(data){
        let resData = {};
        if (data.length===0) {
            req.route.path = "/add"; //修改path来设定 对 数据库的操作
            handler(req, res, "collectionClassifyList", req.body,function(data){
                let resData = {};
                if (data.length===0) {
                    resData.code = -1;
                    resData.msg = '抱歉，添加失败';
                }  else {
                    resData.code = 0;
                    resData.msg = '添加分类成功';
                }
                res.end(JSON.stringify(resData));
            });
        } else {
            resData.code = -1;
            resData.msg = '列表存在当前分类';
            res.end(JSON.stringify(resData));
        }
    });
});

module.exports = router;
