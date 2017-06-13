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
const pathUtil = require('path');

const upload = multer({storage : storage});

let router = express.Router();

router.route('/user').get(userGet).post(userPost);
router.route('/user/:user_id').get(userGetId).delete(userDelete).post(userPut);
router.route('/login').post(loginPost);

function loginPost(req, res, next){Index.loginPost(req,res,next);}


function userGet(req, res, next){Index.userGet(req,res,next);}
function userPost(req, res, next){Index.userPost(req,res,next);}
function userGetId(req, res, next){Index.userGetId(req,res,next);}
function userDelete(req, res, next){Index.userDelete(req,res,next);}
function userPut(req, res, next){Index.userPut(req,res,next);}


module.exports = router;
