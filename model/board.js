/*jshint esversion: 6 */

var pool = require('../database/dbConnect');
class Board{
}

Board.boardGet = (req, cb) => {
    console.log('boardget 메소드 호출됨');

    var paramCategory = req.query.category;
    console.log("카테고리"+paramCategory);
    //query, params, body

    var sql = 'select * from board where category="'+paramCategory+'"';
    console.log(sql);

    pool.getConnection(function(err, conn){
        if(err){return cb(err);}
        conn.query(sql, function (err, results) {
            console.log('쿼리문 전송 성공, 전체 검색');
            if (err) {return cb(err);}
            conn.release();
            return cb(null, {count: results.length, data: results});
        });
    });
}

Board.boardGetId = (req, cb)=>{
    console.log('needGetId메소드 호출',req.params.needId);
    return cb(null, 'success');
}

Board.boardPost = (req, cb)=>{
    console.log('needPost 메소드 호출됨');
    var paramUserId = req.body.user_id;
    //세션에서 얻어오기
    var paramTitle = req.body.title;
    var paramCategory = req.body.category;
    var paramArticle = req.body.article;
    var paramSchoolLocation = req.body.location;

    var date = new Date();

    pool.getConnection(function(err, conn) {
        if(err){return cb(err);}
        //Use the connection
        conn.query("insert into need values('',?,?,?,?,?,?)",
            [paramUserId, paramTitle, paramCategory, paramArticle, date, paramSchoolLocation], function (error, results) {
                console.log('쿼리문 전송 성공');
                //And done with the connection.
                if (err) {return cb(err);}
                conn.release();
                return cb(null,{mag :"post success", insertId: results.insertId, affectedRows: results.affectedRows});
            });
    });
}

Board.boardPut = (req, cb)=>{
    console.log('needPut 메소드 호출됨');
    var paramUserId = req.body.user_id;
    //세션에서 얻어오기
    var paramTitle = req.body.title;
    var paramCategory = req.body.category;
    var paramArticle = req.body.article;
    var paramSchoolLocation = req.body.location;
    var paramChecking = req.body.checking;
    var paramNeedId = req.params.needId;
    var date = new Date();

    pool.getConnection(function(err, conn) {
        if(err){return cb(err);}
        //Use the connection
        if(paramUserId == req.body.user_id){
            //임시_세션의 id와 일치여부 확인
            console.dir([paramTitle, paramCategory, paramArticle, date, paramSchoolLocation, paramChecking, paramNeedId]);
            conn.query("update need set title=?, category=?, article=?, writedate=?, location=?, checking=? where need_id=?",
                [paramTitle, paramCategory, paramArticle, date, paramSchoolLocation, paramChecking, paramNeedId], function (error, results) {
                    console.log('쿼리문 전송 성공');
                    //And done with the connection.
                    //Handle error after the release.
                    if (err) {return cb(err);}
                    // Don't use the connection here, it has been returned to the pool
                    conn.release();
                    return cb(null, {mag : 'put success', match: results.message});
                });
        }else{
            //사용자 불일치
        }

    });
}

Board.boardDelete = (req, cb)=>{
    console.log('needPost 메소드 호출됨');
    var paramUserId = req.body.user_id;
    //세션에서 얻어오기
    var paramNeedId = req.params.needId;
    pool.getConnection(function(err, conn) {
        if(err){return cb(err);}
        //Use the connection
        if(paramUserId == req.body.user_id){
            //임시_세션의 id와 글의 id 일치여부 확인
            conn.query("delete from need where need_id=?",[paramNeedId], function (error, results) {
                console.log('쿼리문 전송 성공');
                //And done with the connection.
                //Handle error after the release.
                if (err) {return cb(err);}
                conn.release();
                return cb(null, {mag : 'delete success', data: results});
                // Don't use the connection here, it has been returned to the pool
            });
        }else{
            //사용자 불일치
        }
    });
}


module.exports = Board;