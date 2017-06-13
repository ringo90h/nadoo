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
const Item = require('../model/item');
const Board = require('../model/board');
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

let router = express.Router();

router.route('/item').get(itemGet).post(upload.array('image'),itemPost);
router.route('/item/:item_id').get(itemGetId).delete(itemDelete).post(itemPut);
router.route('/need').get(needGet).post(needPost);
router.route('/need/:need_id').delete(needDelete).post(needPut);
router.route('/board').get(boardGet).post(boardPost);
router.route('/board/:board_id').get(boardGetId).delete(boardDelete).post(boardPut);
router.route('/user').get(userGet).post(userPost);
router.route('/user/:user_id').get(userGetId).delete(userDelete).post(userPut);
router.route('/login').post(loginPost);

function loginPost(req, res, next){Index.loginPost(req,res,next);}

function needGet(req, res, next){
    console.log('needget 메소드 호출됨');
    let page = req.query.page;
    let paramSearch = req.query.search;
    let paramCategory = req.query.category;

    let row_count = 10;
    let offset = (page - 1)*row_count ;
    let limitSql = ' order by need_id desc limit '+offset+','+row_count;

    console.log('검색어 : '+paramSearch+"카테고리"+paramCategory+"페이지"+page);

    Need.needGet(page, paramSearch, paramCategory, limitSql, (err, result)=>{
        if(err){
            console.log('요청글 검색 중 에러 발생 : '+err);
            return next(err);
        }
        console.log('요청글 검색 완료');
        res.json(result);
    });
}

function needPost(req, res, next){
    console.log('needPost 메소드 호출됨');
    let paramUserId = req.body.user_id;
    //세션에서 얻어오기
    let paramTitle = req.body.title;
    let paramCategory = req.body.category;
    let paramArticle = req.body.article;
    let paramSchoolLocation = req.body.location;
    let date = new Date();

    Need.needPost(paramUserId, paramTitle, paramCategory, paramArticle,paramSchoolLocation, date, (err, result)=>{
        if(err){console.log('요청글 작성 중 에러 발생 : '+err);}
        console.log('요청글 작성 완료');
        res.json(result);
    });
}

function needPut(req, res, next){
    console.log('needPut 메소드 호출됨');
    let paramUserId = req.body.user_id;
    //로그인한 상태에서 세션에서 얻어오기
    let paramTitle = req.body.title;
    let paramCategory = req.body.category;
    let paramArticle = req.body.article;
    let paramSchoolLocation = req.body.location;
    let paramNeedId = req.params.need_id;
    let date = new Date();

    console.log('needPut 메소드 호출됨222222222');
    Need.needPut(paramUserId, paramTitle, paramCategory, paramArticle,paramSchoolLocation, paramNeedId, date, (err, result)=>{
        if(err){console.log('요청글 수정 중 에러 발생 : '+err);}
        console.log('요청글 수정 완료');
        res.json(result);
    });
}

function needDelete(req, res, next){
    console.log('needDelete 메소드 호출됨');
    let paramUserId = req.body.user_id;
    //세션에서 얻어오기
    let paramNeedId = req.params.need_id;

    Need.needDelete(paramUserId, paramNeedId, (err, result)=>{
        if(err){console.log('요청글 수정 중 에러 발생 : '+err);}
        console.log('요청글 삭제 완료');
        res.json(result);
    });
}

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
    let files = req.files;

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


function boardGet(req, res, next){
    console.log('boardget 메소드 호출됨');
    let page = req.query.page;
    let paramCategory = req.query.category;

    Board.boardGet(page,paramCategory, (err,result)=>{
        if(err){console.log('게시판글 조회 중 에러 발생 : '+err);}
        console.log('게시판글 조회 완료');
        res.json(result);
    });
}

function boardPost(req, res, next){
    console.log('boardPost 메소드 호출됨');
    let paramUserId = req.body.user_id;
    //세션에서 얻어오기
    let paramTitle = req.body.title;
    let paramCategory = req.body.category;
    let paramArticle = req.body.article;
    let paramAnonymity = req.body.anonymity;
    let date = new Date();

    Board.boardPost(paramUserId, paramTitle, paramCategory, paramArticle, paramAnonymity, date, (err, result)=>{
        if(err){console.log('게시판글 작성 중 에러 발생 : '+err);}
        console.log('게시판글 작성 완료');
        res.json(result);
    });
}

function boardPut(req, res, next){
    console.log('BoardPost 메소드 호출됨');
    let paramUserId = req.body.user_id;
    //세션에서 얻어오기
    let paramTitle = req.body.title;
    let paramCategory = req.body.category;
    let paramArticle = req.body.article;
    let paramAnonymity = req.body.anonymity;
    let paramBoardId = req.params.board_id;
    let date = new Date();

    Board.boardPut(paramUserId, paramTitle, paramCategory, paramArticle, paramAnonymity, paramBoardId, date, (err,result)=>{
        if(err){console.log('게시판글 수정 중 에러 발생 : '+err);}
        console.log('게시판글 수정 완료');
        res.json(result);
    });
}

function boardDelete(req, res, next){
    console.log('boardDelete 메소드 호출됨');
    let paramUserId = req.body.user_id;
    //세션에서 얻어오기
    let paramBoardId = req.params.board_id;

    Board.boardDelete(paramUserId, paramBoardId, (err, result)=>{
        if(err){console.log('게시판글 삭제 중 에러 발생 : '+err);}
        console.log('게시판글 삭제 완료');
        res.json(result);
    });
}

function boardGetId(req, res, next){Index.boardGetId(req,res,next);}

function userGet(req, res, next){Index.userGet(req,res,next);}
function userPost(req, res, next){Index.userPost(req,res,next);}
function userGetId(req, res, next){Index.userGetId(req,res,next);}
function userDelete(req, res, next){Index.userDelete(req,res,next);}
function userPut(req, res, next){Index.userPut(req,res,next);}


module.exports = router;
