/*jshint esversion: 6 */

var pool = require('../database/dbConnect');
class User{
}

User.userGet = (req, cb) => {
    console.log('userget 메소드 호출됨');

    var page = req.query.page;
    var paramSearch = req.query.search;

    var row_count = 10;
    var offset = (page - 1)*row_count ;
    var limitSql = ' order by need_id desc limit '+offset+','+row_count;

    console.log('검색어 : '+paramSearch+"페이지"+page);
    if(page){
        var sql = "select nickname, profile_thumbURL from user";
        if(paramSearch&&paramCategory){paramSearch = " where nickname like '%"+paramSearch+"%'"; sql = sql.concat(paramSearch)+limitSql;}
        console.log(sql);

        pool.getConnection(function(err, conn){
            if(err){return cb(err);}

            conn.query(sql, function (err, results) {
                    console.log('쿼리문 전송 성공, 유저 전체 검색');
                    if (err) {return cb(err);}
                    conn.release();
                    return cb(null, {page: page, count: results.length, data: results});
                }

            );
        });
    }else{
        console.log('err : 필수 입력요소 누락');
        return cb(null, {error:'page 정보 필수 입력'});
    }

}

User.userGetId = (req, cb) => {
    console.log('userget 메소드 호출됨');

}

User.userPost = (req, cb)=>{
    console.log('userPost 메소드 호출됨');

}

User.userPut = (req, cb)=>{
    console.log('userPut 메소드 호출됨');

}

User.userDelete = (req, cb)=>{
    console.log('userDelete 메소드 호출됨');

}


module.exports = User;