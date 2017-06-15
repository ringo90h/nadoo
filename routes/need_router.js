/**
 * Created by Hwang Hyeonwoo on 2017-06-13.
 */

const express = require('express');
const Need = require('../model/need');
const authJwt = require('../model/auth/authJwtToken');

let need_router = express.Router();

need_router.route('/need').get(needGet).post(authJwt, needPost);
need_router.route('/need/:need_id').delete(needDelete).post(needPut);

function needGet(req, res, next){
    console.log('needget 메소드 호출됨');
    let page = parseInt(req.query.page);
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
    let paramUserId = req.user||null;
    //세션에서 얻어오기
    let paramTitle = req.body.title;
    let paramCategory = req.body.category;
    let paramArticle = req.body.article;
    let paramSchoolLocation = req.body.location;

    Need.needPost(paramUserId, paramTitle, paramCategory, paramArticle,paramSchoolLocation,  (err, result)=>{
        if(err){
            console.log('요청글 작성 중 에러 발생 : '+err);
            return next(err);
        }
        console.log('요청글 작성 완료');
        res.json(result);
    });
}

function needPut(req, res, next){
    console.log('needPut 메소드 호출됨');
    let paramUserId = req.user||null;
    //로그인한 상태에서 세션에서 얻어오기
    let paramTitle = req.body.title;
    let paramCategory = req.body.category;
    let paramArticle = req.body.article;
    let paramSchoolLocation = req.body.location;
    let paramNeedId = parseInt(req.params.need_id);

    Need.needPut(paramUserId, paramTitle, paramCategory, paramArticle,paramSchoolLocation, paramNeedId,  (err, result)=>{
        if(err){
            console.log('요청글 수정 중 에러 발생 : '+err);
            return next(err);
        }
        res.json(result);
    });
}

function needDelete(req, res, next){
    console.log('needDelete 메소드 호출됨');
    let paramUserId = req.user||null;
    //세션에서 얻어오기
    let paramNeedId = parseInt(req.params.need_id);

    Need.needDelete(paramUserId, paramNeedId, (err, result)=>{
        if(err){
            console.log('요청글 수정 중 에러 발생 : '+err);
            return next(err);
        }
        console.log('요청글 삭제 완료');
        res.json(result);
    });
}

module.exports = need_router;
