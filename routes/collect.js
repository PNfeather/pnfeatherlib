var express = require('express');
var router = express.Router();
var handler = require('./dbhandler.js');
var ObjectId = require('mongodb').ObjectId;

//获取收藏分类列表
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
    const { value, key } = req.body;
    let resData = {};
    if (value === '' || key === '') {
        resData.code = -2;
        resData.msg = '分类及其key值不能为空';
        res.end(JSON.stringify(resData));
    } else {
        handler(req, res, "collectionClassifyList", {$or: [{value}, {key}] },function(data){
            if (data.length===0) {
                req.route.path = "/add"; //修改path来设定 对 数据库的操作
                handler(req, res, "collectionClassifyList", { value, key }, function(data){
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
                resData.msg = '已存在同名或同key分类';
                res.end(JSON.stringify(resData));
            }
        });
    }
});

// 删除收藏分类
router.post('/deleteClassify', function(req, res, next) {

    handler(req, res, "collectionClassifyList", {"_id" : ObjectId(req.body.id)},function(data){

        let resData = {};
        if(data.length==0){
            resData.code = -1;
            resData.msg = '抱歉，删除失败';
        }else{
            resData.code = 0;
            resData.msg = '删除分类成功';
        }
        res.end(JSON.stringify(resData));

    });
});

//获取收藏列表
router.get('/collectionList', function(req, res, next) {
    req.route.path = "/show"; //修改path来设定 对 数据库的操作
    const {keyWord} = req.query;
    let searchObj = {};
    if (keyWord) {
        let reg = new RegExp(keyWord, 'gim');
        searchObj = {$or:[{classify: reg}, {desc: reg}, {name: reg}]}
    }
    handler(req, res, "collection", searchObj,function(data){
        let resData = {};
        resData.code = 0;
        resData.msg = '获取列表数据成功';
        resData.data = data;
        res.end(JSON.stringify(resData));
    }, {_id: -1});
});

// 添加收藏
router.post('/addCollection', function(req, res, next) {
    req.route.path = "/show"; //修改path来设定 对 数据库的操作
    const { name, address, classify, classifyType, time, desc } = req.body;
    let resData = {};
    if (name === '' || address === '' || classify === '' || time === '') {
        resData.code = -2;
        time === '' && (resData.msg = '收藏时间不能为空');
        classify === '' && (resData.msg = '收藏分类不能为空');
        address === '' && (resData.msg = '收藏地址不能为空');
        name === '' && (resData.msg = '收藏名称不能为空');
        res.end(JSON.stringify(resData));
    } else {
        handler(req, res, "collection", { address },function(data){
            if (data.length===0) {
                req.route.path = "/add"; //修改path来设定 对 数据库的操作
                handler(req, res, "collection", {name, address, classify, classifyType, time, desc}, function(data){
                    if (data.length===0) {
                        resData.code = -1;
                        resData.msg = '抱歉，添加收藏失败';
                    }  else {
                        resData.code = 0;
                        resData.msg = '添加收藏成功';
                    }
                    res.end(JSON.stringify(resData));
                });
            } else {
                resData.code = -1;
                resData.msg = '已收藏当前地址';
                res.end(JSON.stringify(resData));
            }
        });
    }
});

// 更新收藏
router.post('/editCollection', function(req, res, next) {
    let reqData = {...req.body};
    delete reqData._id;
    let selectors = [
        {_id: ObjectId(req.body._id)},
        {"$set": reqData}
    ];
    handler(req, res, "collection", selectors,function(data){
        let resData = {};
        if (data.length===0) {
            resData.code = -1;
            resData.msg = '抱歉，更新失败';
        }  else {
            resData.code = 0;
            resData.msg = '更新成功';
        }
        res.end(JSON.stringify(resData));
    });
});

module.exports = router;
