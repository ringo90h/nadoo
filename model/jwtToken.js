/**
 * Created by Hwang Hyeonwoo on 2017-06-13.
 */


const secretKey = 'nadoosecret';

function handleLogin(req, res, next) {
    let user_id = req.body.user_id;
    let password = req.body.password;
    //todo 입력된 비밀번호를 bcrypt화
    Login.authIdPassword(user_id, password, (err, result)=>{
        if(err){
            return next(err);
        }
        console.dir(result);
    });

    if (req.body.id == 'iu' && req.body.pw == '1234') {
        const payload = {
            id: 'iu',
            role: 'user'
        };
        const option = {
            expiresIn: '1 year'
        };
        const token = jwt.sign(payload, secretKey, option);
        //토큰 만들기
        res.send({ msg: 'success', token: token });
    }
    else {
        res.status(401);
    }
}