/**
 * Created by Hwang Hyeonwoo on 2017-06-12.
 */
/*jshint esversion: 6 */

class User{
}

User.handleLogin = function (req, res) {
    if (req.body.id == 'iu' && req.body.pw == '1234') {
        const payload = {
            id: 'iu',
            role: 'user'
        };
        const option = {
            expiresIn: '1 year'
        };
        const token = jwt.sign(payload, secretKey, option);
        res.send({ msg: 'success', token: token });
    }
    else {
        res.status(401);
    }
}


module.exports = JWTAuth;