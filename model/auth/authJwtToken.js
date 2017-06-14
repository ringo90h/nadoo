/*jshint esversion: 6 */

const jwt = require('jsonwebtoken');
const passport = require('passport');

const secretKey = 'nadoosecret';

let JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

//Local Strategy에 의해서 인증시에 호출되는 인증 메서드를 정의한다..

module.exports = function (req, res, next){
    console.log('jwt분석시작');
    let token;
    if (req && req.cookies) {
            token = req.cookies.token;
            console.dir(token);
    }
    let opts = {
        //authorization방식
        jwtFromRequest: req.cookies.token,
        secretOrKey: secretKey
    }
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            res.status(404);
            return;
        }console.dir(decoded);
    });

    next();
}
