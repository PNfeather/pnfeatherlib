var express = require('express');
var router = express.Router();
var handler = require('./dbhandler.js');
var ObjectId = require('mongodb').ObjectId;


// 获取经历列表
router.get('/experienceList', function(req, res, next) {
    req.route.path = "/show"; //修改path来设定 对 数据库的操作
    handler(req, res, "experience", {},function(data){
        let resData = {};
        resData.code = 0;
        resData.msg = '获取列表数据成功';
        resData.data = data;
        res.end(JSON.stringify(resData));
    }, {_id: -1});
});

// 添加经历
router.post('/addExperience', function(req, res, next) {
    const {startTime, endTime, company, companyContent, companyPersons, companyNature, department, position, desc } = req.body;
    let resData = {};
    const { level } = req.session;
    if (level !== '1') {
        resData.code = -101;
        resData.msg = '当前账号无此操作权限';
        return res.end(JSON.stringify(resData));
    }
    if (startTime === '' || endTime === '' || company === '' || companyContent === '' || companyPersons === '' || companyNature === '' || department === '' || position === '' || desc === '') {
        resData.code = -2;
        startTime === '' && (resData.msg = '开始时间不能为空');
        endTime === '' && (resData.msg = '结束时间不能为空');
        company === '' && (resData.msg = '单位名称不能为空');
        companyContent === '' && (resData.msg = '单位涉及不能为空');
        companyPersons === '' && (resData.msg = '人员配置不能为空');
        companyNature === '' && (resData.msg = '单位性质不能为空');
        department === '' && (resData.msg = '所属部门不能为空');
        position === '' && (resData.msg = '职位不能为空');
        desc === '' && (resData.msg = '工作描述不能为空');
        res.end(JSON.stringify(resData));
    } else {
        req.route.path = "/add"; //修改path来设定 对 数据库的操作
        handler(req, res, "experience", {startTime, endTime, company, companyContent, companyPersons, companyNature, department, position, desc}, function(data){
            if (data.length===0) {
                resData.code = -1;
                resData.msg = '抱歉，添加收藏失败';
            }  else {
                resData.code = 0;
                resData.msg = '添加收藏成功';
            }
            res.end(JSON.stringify(resData));
        });
    }
});

// 更新经历
router.post('/editExperience', function(req, res, next) {
    let resData = {};
    const { level } = req.session;
    if (level !== '1') {
        resData.code = -101;
        resData.msg = '当前账号无此操作权限';
        return res.end(JSON.stringify(resData));
    }
    let reqData = {...req.body};
    delete reqData._id;
    let selectors = [
        {_id: ObjectId(req.body._id)},
        {"$set": reqData}
    ];
    handler(req, res, "experience", selectors,function(data){
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

// 删除经历
router.post('/deleteExperience', function(req, res, next) {
    let resData = {};
    const { level } = req.session;
    if (level !== '1') {
        resData.code = -101;
        resData.msg = '当前账号无此操作权限';
        return res.end(JSON.stringify(resData));
    }

    handler(req, res, "experience", {"_id" : ObjectId(req.body.id)},function(data){

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

module.exports = router;
