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
//router.route('/item/:itemId').get(itemGetId).delete(itemDelete).put(itemPut);
router.route('/need').get(needGet).post(needPost);
router.route('/need/:needId').get(needGetId).delete(needDelete).put(needPut);

function needGet(req, res, next){Index.needGet(req,res,next);}
function needPost(req, res, next){Index.needPost(req,res,next);}
function needGetId(req, res, next){Index.needGetId(req,res,next);}
function needDelete(req, res, next){Index.needDelete(req,res,next);}
function needPut(req, res, next){Index.needPut(req,res,next);}
function itemGet(req, res, next){Index.itemGet(req,res,next);}
function itemPost(req, res, next){Index.itemPost(req,res,next);}

module.exports = router;
