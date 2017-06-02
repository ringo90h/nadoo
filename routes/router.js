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
const multer = require('multer');
const Index = require('../model/index');
const upload = multer({dest:'uploads/'});

var router = express.Router();

//router.route('/item').get(itemGet).post(itemPost);
//router.route('/item/:itemId').get(itemGetId).delete(itemDelete).put(itemPut);
router.route('/need').get(needGet).post(needPost);
router.route('/need/:needId').get(needGetId).delete(needDelete).put(needPut);
router.route('/imagetest').post(uploadImage);

function needGet(req, res, next){Index.needGet(req,res,next);}
function needPost(req, res, next){Index.needPost(req,res,next);}
function needGetId(req, res, next){Index.needGetId(req,res,next);}
function needDelete(req, res, next){Index.needDelete(req,res,next);}
function needPut(req, res, next){Index.needPut(req,res,next);}
function uploadImage(req, res, next){Index.uploadImage(req,res,next);}

module.exports = router;
