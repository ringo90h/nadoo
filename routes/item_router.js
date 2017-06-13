/**
 * Created by Hwang Hyeonwoo on 2017-06-13.
 */


const express = require('express');
const Item = require('../model/item');
const multer = require('multer');
const pathUtil = require('path');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './model/image'); // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
    },
    filename: function (req, file, cb) {
        const extname = pathUtil.extname(file.originalname); // 확장자
        const now = new Date(); // 날짜를 이용한 파일 이름 생성
        const randomKey = 'image_' + now.getHours() + now.getMinutes() + now.getSeconds() + Math.floor(Math.random()*1000) + extname;
        console.log('랜덤키 생성 결과'+ randomKey);
        cb(null, randomKey);
        //cb(null, file.originalname); // cb 콜백함수를 통해 전송된 파일 이름 설정
    }
});

const upload = multer({storage : storage});

let item_router = express.Router();

item_router.route('/item').get(itemGet).post(upload.array('image'),itemPost);
item_router.route('/item/:item_id').get(itemGetId).delete(itemDelete).post(itemPut);


function itemGet(req, res, next){
    console.log('itemget 메소드 호출됨');

    let page = req.query.page;
    let paramSearch = req.query.search;

    let paramCategory = req.query.category;
    let parampriceKind = req.query.priceKind;
    let paramMinPrice = parseInt(req.query.minPrice) || 0;
    let paramMaxPrice = parseInt(req.query.maxPrice);
    let paramStatus = req.query.status;
    let paramSort = req.query.sort;

    Item.itemGet(page, paramSearch, paramCategory, parampriceKind, paramMinPrice, paramMaxPrice, paramStatus, paramSort, (err, result)=>{
        if(err){console.log('물품글 조회 중 에러 발생 : '+err);}
        console.log('물품글 조회 완료');
        res.json(result);
    });
}

function itemPost(req, res, next){
    console.log('itemPost 메소드 호출됨');
    let paramUserId = req.body.user_id;
    //세션에서 얻어오기
    let paramTitle = req.body.title;
    let paramCategory = req.body.category;
    let paramArticle = req.body.article;
    let paramPriceKind = req.body.priceKind;
    let paramPrice = req.body.price;
    let paramSchoolLocation = req.body.location;
    let date = new Date();
    let files = req.files || {};

    Item.itemPost(paramUserId, paramTitle, paramCategory, paramArticle, paramPriceKind, paramPrice, paramSchoolLocation, date, files, (err,result)=>{
        if(err){console.log('물품글 작성 중 에러 발생 : '+err);}
        console.log('물품글 작성 완료');
        res.json(result);
    });
}

function itemDelete(req, res, next){
    console.log('itemDelete 메소드 호출됨');
    let paramUserId = req.body.user_id;
    //세션에서 얻어오기
    let paramitemId = req.params.itemId;

    Item.itemDelete(paramUserId, paramitemId, (err, result)=>{
        if(err){console.log('물품글 삭제 중 에러 발생 : '+err);}
        console.log('물품글 삭제 완료');
        res.json(result);
    });
}

function itemPut(req, res, next){
    console.log('itemPut 메소드 호출됨');
    let paramUserId = req.body.user_id;
    //세션에서 얻어오기
    let paramTitle = req.body.title;
    let paramCategory = req.body.category;
    let paramArticle = req.body.article;
    let paramSchoolLocation = req.body.location;
    let paramitemId = req.params.itemId;
    let paramPriceKind = req.body.priceKind;
    let paramPrice = req.body.price;
    let date = new Date();

    Item.itemPut(paramUserId, paramTitle, paramCategory, paramArticle, paramPriceKind, paramPrice, paramitemId, paramSchoolLocation, date, (err,result)=>{
        if(err){console.log('물품글 수정 중 에러 발생 : '+err);}
        console.log('물품글 수정 완료');
        res.json(result);
    });
}
function itemGetId(req, res, next){Index.itemGetId(req,res,next);}

module.exports = item_router;