/**
 * Created by Hwang Hyeonwoo on 2017-06-13.
 */


const express = require('express');
const Board = require('../model/board');
const authJwt = require('../model/auth/authJwtToken');

let board_router = express.Router();

board_router.route('/board').get(boardGet).post(authJwt,boardPost);
board_router.route('/board/:board_id').get(boardGetId).delete(authJwt,boardDelete).post(authJwt,boardPut);

function boardGet(req, res, next){
    console.log('boardget 메소드 호출됨');
    let page = parseInt(req.query.page);
    let paramCategory = req.query.category;

    Board.boardGet(page,paramCategory, (err,result)=>{
        if(err){
            console.log('게시판글 조회 중 에러 발생 : '+err);
            return next(err);
        }
        console.log('게시판글 조회 완료');
        res.json(result);
    });
}

function boardGetId(req, res, next){
    console.log('boardGetId 메소드 호출됨');
    let paramBoardId = parseInt(req.params.board_id);

    Board.boardGetId(paramBoardId, (err, result)=>{
        if(err){
            console.log('게시판글 상세 조회 중 에러 발생 : '+err);
            return next(err);
        }
        console.log('게시판글 상세 조회 완료');
        res.json(result);
    });
}

function boardPost(req, res, next){
    console.log('boardPost 메소드 호출됨');
    let paramUserId = req.user||null;
    //세션에서 얻어오기
    let paramTitle = req.body.title;
    let paramCategory = req.body.category;
    let paramArticle = req.body.article;
    let paramAnonymity = parseInt(req.body.anonymity);

    Board.boardPost(paramUserId, paramTitle, paramCategory, paramArticle, paramAnonymity, (err, result)=>{
        if(err){
            console.log('게시판글 작성 중 에러 발생 : '+err);
            return next(err);
        }
        res.json(result);
    });
}

function boardPut(req, res, next){
    console.log('BoardPost 메소드 호출됨');
    let paramUserId = req.user||null;
    //세션에서 얻어오기
    let paramTitle = req.body.title;
    let paramCategory = req.body.category;
    let paramArticle = req.body.article;
    let paramAnonymity = parseInt(req.body.anonymity);
    let paramBoardId = parseInt(req.params.board_id);

    Board.boardPut(paramUserId, paramTitle, paramCategory, paramArticle, paramAnonymity, paramBoardId, (err,result)=>{
        if(err){
            console.log('게시판글 수정 중 에러 발생 : '+err);
            return next(err);
        }
        res.json(result);
    });
}

function boardDelete(req, res, next){
    console.log('boardDelete 메소드 호출됨');
    let paramUserId = req.user;
    //세션에서 얻어오기
    let paramBoardId = parseInt(req.params.board_id);

    Board.boardDelete(paramUserId, paramBoardId, (err, result)=>{
        if(err){
            console.log('게시판글 삭제 중 에러 발생 : '+err);
            return next(err);
        }
        console.log('게시판글 삭제 완료');
        res.json(result);
    });
}


module.exports = board_router;
