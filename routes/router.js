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
const Index = require('../model/index');
const multer = require('multer');
const pathUtil = require('path');

var storage = multer.diskStorage({
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

var router = express.Router();

router.route('/item').get(itemGet).post(upload.array('image'),itemPost);
router.route('/item/:item_id').get(itemGetId).delete(itemDelete).post(itemPut);
router.route('/need').get(needGet).post(needPost);
router.route('/need/:need_id').delete(needDelete).post(needPut);
router.route('/board').get(boardGet).post(boardPost);
router.route('/board/:board_id').get(boardGetId).delete(boardDelete).post(boardPut);
router.route('/user').get(userGet).post(userPost);
router.route('/user/:user_id').get(userGetId).delete(userDelete).post(userPut);

function needGet(req, res, next){Index.needGet(req,res,next);}
function needPost(req, res, next){Index.needPost(req,res,next);}
function needDelete(req, res, next){Index.needDelete(req,res,next);}
function needPut(req, res, next){Index.needPut(req,res,next);}

function itemGet(req, res, next){Index.itemGet(req,res,next);}
function itemPost(req, res, next){Index.itemPost(req,res,next);}
function itemGetId(req, res, next){Index.itemGetId(req,res,next);}
function itemDelete(req, res, next){Index.itemDelete(req,res,next);}
function itemPut(req, res, next){Index.itemPut(req,res,next);}

function boardGet(req, res, next){Index.boardGet(req,res,next);}
function boardPost(req, res, next){Index.boardPost(req,res,next);}
function boardGetId(req, res, next){Index.boardGetId(req,res,next);}
function boardDelete(req, res, next){Index.boardDelete(req,res,next);}
function boardPut(req, res, next){Index.boardPut(req,res,next);}

function userGet(req, res, next){Index.userGet(req,res,next);}
function userPost(req, res, next){Index.userPost(req,res,next);}
function userGetId(req, res, next){Index.userGetId(req,res,next);}
function userDelete(req, res, next){Index.userDelete(req,res,next);}
function userPut(req, res, next){Index.userPut(req,res,next);}


module.exports = router;
