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
const Login = require('../model/login');

const jwt = require('jsonwebtoken');
const passport = require('passport');

const secretKey = 'nadoosecret';

let login_router = express.Router();

function loginPost(req, res, next){
    Login.findOneByUserId(req.body.user_id);
}

let JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

//Local Strategy에 의해서 인증시에 호출되는 인증 메서드를 정의한다..
var opts = {
    //authorization방식
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: secretKey
}

passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    // 인증시에 호출되는 인증 함수
    console.log('JWT 해독 성공 : ', jwt_payload);
    // 토큰에서 유효한 사용자인지 검사
    if (jwt_payload.id == 'iu') {
        return done(null, { id: 'iu', name: '아이유' });
    }
    done(null, false);
}));

module.exports = login_router;
//로그인
login_router.route('/login').post(userLogin);
//중복ID, 닉네임 체크
login_router.route('/joinidcheck').post(userJoinUserIdCheck);
login_router.route('/joinnickcheck').post(userJoinNickCheck);
//회원가입
login_router.route('/join').post(userJoin);

//login_router.route('/login/:need_id').delete(needDelete).post(needPut);

function userLogin(req, res, next) {
    let paramUserId = req.body.user_id;
    let paramPassword = req.body.password;

    Login.userLogin(paramUserId, paramPassword, (err, result)=>{
        if(err){
            console.log(err);
            res.send(err);
            return next(err);
        }
        const payload = {
            id: result.user_id,
            nickname:result.nickname
        };
        const option = {
            expiresIn: '1 year'
        };
        const token = jwt.sign(payload, secretKey, option);
        //토큰 만들기
        res.cookie('token',token);
        res.send(result);
        res.end();
    });
}

function userJoinUserIdCheck(req, res, next){
    let paramUserId = req.body.user_id;

    Login.userJoinUserIdCheck(paramUserId, (err, result)=>{
        if(err){
            res.send(err);
            return;
        }
        if(result){
            res.send(result);
        }
    });
}
function userJoinNickCheck(req, res, next){
    let paramNickname = req.body.nickname;

    Login.userJoinNickCheck(paramNickname, (err, result)=>{
        if(err){
            res.send(err);
            return;
        }
        if(result){
            res.send(result);
        }
    });
}

function userJoin(req, res, next) {
    let paramUserId = req.body.user_id;
    //이메일
    let paramPassword = req.body.password;
    let paramNickname = req.body.nickname;
    let paramSchool = req.body.school;
    let paramUserstat = req.body.user_stat;
    let paramUserSchoolEmail = req.body.school_email || '';

    Login.userJoin(paramUserId, paramPassword, paramNickname, paramSchool, paramUserstat, paramUserSchoolEmail, (err, result)=>{
        if(err){
            res.end(err);
        }
        if(result){
            res.send(result);
        }
    });
}

// 로그인이 필요한 API 접근하기. header에 authorization 필드로 토큰을 입력한다.
login_router.route('/private').get(
    (req, res, next) => {
        console.log('JWT: ', req.headers.authorization);
        next();
    },
    // 세션 사용 안하는 설정. true가 되면 serialize/deserialize를 작성해야 한다.
    passport.authenticate('jwt', { session: false }), (req, res) => {
        // 인증 통과! - Strategy의 콜백으로 전달된 user는 req.user로 사용
        res.send({msg:'success', data: 'private data.', username:req.user.name});
    }
);

//토큰 해독
login_router.route('/decode').get((req, res) => {
    const token = req.headers.authorization;
    console.log('token :', token);
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            res.status(404);
            return;
        }
        res.send(decoded);
    });
});
