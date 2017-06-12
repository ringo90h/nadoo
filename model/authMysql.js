/**
 * Created by Hwang Hyeonwoo on 2017-06-12.
 */
/*jshint esversion: 6 */

var pool = require('../database/dbConnect');
class authMysql{
}

authMysql.findOneByUserId = function (user_id){

    let sql = 'select user_id from usertest where user_id=?'
    pool.getConnection(function (err, conn) {
        if (err) {
           console.log(err);
        }
        conn.query(sql, [user_id], function (err, results) {
            console.log('쿼리문 전송 성공, 중복 ID여부 검색');
            if (err) {
                console.log(err);
            }
            conn.release();
            if(results){
                console.dir(results);
            }
        });
    });

}

authMysql.findOneByUserNickname = function (nickname){
    let sql = 'select user_key from usertest where nickname=?'
    pool.getConnection(function (err, conn) {
        if (err) {
            return cb(err);
        }
        conn.query(sql, nickname, function (err, results) {
            console.log('쿼리문 전송 성공, 중복 닉네임 여부 검색');
            if (err) {
                return cb(err);
            }
            conn.release();
            if(results){
                return cb(null, {});
            }
        });
    });
}

authMysql.create = function(user_id, password){
    let sql = 'insert into usertest value(?,?)';
    pool.getConnection(function (err, conn) {
        if (err) {
            return cb(err);
        }
        conn.query(sql, [user_id,password], function (err, results) {
            console.log('쿼리문 전송 성공, 아이디, 비밀번호 입력');
            if (err) {
                return cb(err);
            }
            conn.release();
            if(results){
                return cb(null, {});
            }
        });
    });
}

module.exports = authMysql;