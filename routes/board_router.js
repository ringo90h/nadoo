/**
 * Created by Hwang Hyeonwoo on 2017-06-13.
 */


const express = require('express');
const Board = require('../model/board');

let board_router = express.Router();

board_router.route('/board').get(boardGet).post(boardPost);
board_router.route('/board/:board_id').get(boardGetId).delete(boardDelete).post(boardPut);

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

function boardGetId(req, res, next){}

module.exports = board_router;
