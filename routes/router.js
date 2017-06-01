/*jshint esversion: 6 */
/**
 * 라우팅 모듈을 로딩하여 설정
 *
 * 라우팅 모듈 파일에 대한 정보는 config.js의 route_info 배열에 등록함
 *
 * @date 2016-11-10
 * @author Mike
 */

const express = require('express');
const Need = require('../model/need');
const Item = require('../model/Item');

var router = express.Router();

router.route('/item').get(itemGet).post(itemPost);
router.route('/item/:itemId').get(itemGetId).delete(itemDelete).put(itemPut);
router.route('/need').get(needGet).post(needPost);
router.route('/need/:needId').get(needGetId).delete(needDelete).put(needPut);

module.exports = router;

function needGet(req, res, next){
    console.log('needGet 라우팅');
    Need.needGet(req,(err,result)=>{
        if(err){return next(err);}
        res.send(result);
    });
}

function needPost(req, res, next){
    console.log('needPost 라우팅');
    Need.needPost(req,(err,result)=>{
        if(err){return next(err);}
        res.send(result);
    });
}

function needGetId(req, res, next){
    console.log('needGetId 라우팅');
    Need.needGetId(req,(err,result)=>{
        if(err){return next(err);}
        res.send(result);
    });
}

function needPut(req, res, next){
    console.log('needPut 라우팅');
    Need.needPut(req,(err,result)=>{
        if(err){return next(err);}
        res.send(result);
    });
}

function needDelete(req, res, next){
    console.log('needDelete 라우팅');
    Need.needDelete(req,(err,result)=>{
        if(err){return next(err);}
        res.send(result);
    });
}
function itemGet(req, res, next){
    console.log('itemGet 라우팅');
    Item.itemGet(req,(err,result)=>{
        if(err){return next(err);}
        res.send(result);
    });
}

function itemPost(req, res, next){
    console.log('itemPost 라우팅');
    Item.itemPost(req,(err,result)=>{
        if(err){return next(err);}
        res.send(result);
    });
}

function itemGetId(req, res, next){
    console.log('itemGetId 라우팅');
    Item.itemGetId(req,(err,result)=>{
        if(err){return next(err);}
        res.send(result);
    });
}

function itemPut(req, res, next){
    console.log('itemPut 라우팅');
    Item.itemPut(req,(err,result)=>{
        if(err){return next(err);}
        res.send(result);
    });
}

function itemDelete(req, res, next){
    console.log('itemDelete 라우팅');
    Item.itemDelete(req,(err,result)=>{
        if(err){return next(err);}
        res.send(result);
    });
}
