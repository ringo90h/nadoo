/**
 * Created by Hwang Hyeonwoo on 2017-06-12.
 */
/*jshint esversion: 6 */

const pool = require('../database/dbConnect');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = '비밀번호';

class Login{
}

Login.userLogin = function (paramUserId, paramPassword, cb){
    let sql = 'select user_id,password,nickname from user where user_id=?'
    console.log('loginIdPassword 메소드 실행');

    // Load hash from your password DB.

    pool.getConnection(function (err, conn) {
        if (err) {
            return cb(err);
        }
        conn.query(sql, [paramUserId], function (err, results) {
            console.log('쿼리문 전송 성공, 중복 ID여부 검색');
            if (err) {
                return cb(err);
            }
            conn.release();
            if(results.length == 0){
                console.log('일치하는 값이 없음');
                return cb({err:'1', msg: 'no match user_id'},null);
            }else{
                console.log('일치하는 값이 있음');
                console.dir(results);

                bcrypt.compare(paramPassword, results[0].password, function(err, res) {
                    if(res) {
                        console.log('일치');
                        console.log(res);
                        console.log('비밀번호 일치, 토큰 생성');
                        return cb(null, {msg: 'match success', user_id:results[0].user_id, nickname:results[0].nickname});
                        // Passwords match
                    } else {
                        console.log('비밀번호 불일치');
                        return cb({err:'1', msg: 'no match password'},null);
                        // Passwords don't match
                    }
                });
            }
        });
    });
}

Login.userJoinUserIdCheck = function(paramUserId, cb){
    sql = "select user_id from user where user_id = ?"
    pool.getConnection(function (err,conn){
        if(err){return cb(err);}
        conn.query(sql,[paramUserId], function(err, results){
            console.log('쿼리문 전송 성공, 중복ID여부 검색');
            if(err){return cb(err);}
            conn.release();
            if(results.length == 0){
                console.log('ID 중복 되지 않음');
                return cb({msg: 'no match user_id'},null);
            }else{
                console.log('ID 중복 됨');
                return cb(null, {err:'1', msg: 'user_id already exist'});
            }
        });
    });
}

Login.userJoinNickCheck = function(paramNickname, cb){
    sql = "select nickname from user where nickname = ?"
    pool.getConnection(function (err,conn){
        if(err){return cb(err);}
        conn.query(sql,[paramNickname], function(err, results){
            console.log('쿼리문 전송 성공, 중복ID여부 검색');
            if(err){return cb(err);}
            conn.release();
            if(results.length == 0){
                console.log('닉네임 중복 되지 않음');
                return cb({msg: 'no match nick'},null);
            }else{
                console.log('닉네임 중복 됨');
                return cb(null, {err:'1', msg: 'nick already exist'});
            }
        });
    });
}

Login.userJoin = function (paramUserId, paramPassword, paramNickname, paramSchool, paramUserstat, paramUserSchoolEmail, cb){
    let bcyptPassword;
    console.log('userJoin 메소드 실행');

    bcrypt.hash(paramPassword, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        console.log('해쉬데이터 생성: '+hash);
        bcyptPassword = hash;
    });
    pool.getConnection(function(err, conn) {
            if(err){return cb(err);}
            //Use the connection
            conn.query("insert into user values('',?,?,'',?,?,?,'','','','',?,'')",
                [paramUserId, bcyptPassword, paramNickname, paramSchool,  paramUserSchoolEmail, paramUserstat], function (err, results) {
                    console.log('쿼리문 전송 성공');
                    //And done with the connection.
                    if (err) {return cb(err);}
                    conn.release();
                    return cb(null,{msg :"post success", insertId: results.insertId, affectedRows: results.affectedRows});
                });
        });
//todo 닉네임, 아이디 중복검사 한번 더 해야함
}




Login.findOneByUserNickname = function (paramNickname){
    pool.getConnection(function (err, conn) {
        let sql = 'select user_key from usertest where nickname=?';
        if (err) {
            return cb(err);
        }
        conn.query(sql, paramNickname, function (err, results) {
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


module.exports = Login;