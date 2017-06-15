/*jshint esversion: 6 */

const jwt = require('jsonwebtoken');
const passport = require('passport');

const secretKey = 'nadoosecret';

//Local Strategy에 의해서 인증시에 호출되는 인증 메서드를 정의한다..

module.exports = function (req, res, next){
    console.log('jwt분석시작');
    let token;
    if (req.cookies.token) {
            token = req.cookies.token;
            console.dir(token);
                jwt.verify(token, secretKey, (err, decoded) => {
                if (err) {
                    res.status(401);
                    return;
                }
                req.user = decoded.key;
                console.log(req.user);
                console.log('jwt 분석 완료, id : '+decoded.id+' key '+decoded.key);
                next();
        });
    }else {
        console.log('쿠키정보 없음');
        res.status(401);
        return next();
    }

}
