/*jshint esversion: 6 */

var pool = require('./dbConnect');
class board{
}

board.boardGet = (req, cb) => {
    console.log('boardget 메소드 호출됨');

    var paramSearch = '%'+req.query.search+'%';
    var paramCategory = req.query.category;
    console.log('검색어 : '+paramSearch+"카테고리"+paramCategory);
    //query, params, body

    pool.getConnection(function(err, conn){
        if(err){return cb(err);}
        if(!req.query.search && !req.query.category) {
            conn.query("select * from board", function (err, results) {
                console.log('쿼리문 전송 성공, 전체 검색');
                if (err) {return cb(err);}
                conn.release();
                return cb(null, {count: results.length, data: results});
            });
        }else if(!req.query.search && req.query.category)    {
            conn.query("select * from board where category=?",[paramCategory], function (error, results) {
                console.log('쿼리문 전송 성공, category 검색');
                if (err) {return cb(err);}
                conn.release();
                return cb(null, {count: results.length, data: results});
            });
        }else if(req.query.search && !req.query.category){
            conn.query("select * from board where title like ?",[paramSearch], function (error, results) {
                console.log('쿼리문 전송 성공, title검색');
                if (err) {return cb(err);}
                conn.release();
                return cb(null, {count: results.length, data: results});
            });
        }else{
            conn.query("select * from board where title like ? and category=?",[paramSearch, paramCategory], function (error, results) {
                console.log('쿼리문 전송 성공, title&category 검색');
                //And done with the connection.
                if (err) {return cb(err);}
                conn.release();
                return cb(null, {count: results.length, data: results});
            });
        }
    });
}

board.boardGetId = (req, cb)=>{
    console.log('boardGetId메소드 호출',req.params.boardId);
    return cb(null, 'success');
}

board.boardPost = (req, cb)=>{
    console.log('boardPost 메소드 호출됨');
    var paramUserId = req.body.user_id;
    //세션에서 얻어오기
    var paramTitle = req.body.title;
    var paramCategory = req.body.category;
    var paramArticle = req.body.article;
    var paramSchoolLocation = req.body.location;
    var paramChecking = req.body.checking;
    var date = new Date();

    pool.getConnection(function(err, conn) {
        if(err){return cb(err);}
        //Use the connection
        conn.query("insert into board values('',?,?,?,?,?,?,?)",
            [paramUserId, paramTitle, paramCategory, paramArticle, date, paramSchoolLocation, paramChecking], function (error, results) {
            console.log('쿼리문 전송 성공');
            //And done with the connection.
            if (err) {return cb(err);}
            results.message = "post success";
            conn.release();
            return cb(null,{mag :results.message, insertId: results.insertId, affectedRows: results.affectedRows});
        });
    });
}

board.boardPut = (req, cb)=>{
    console.log('boardPut 메소드 호출됨');
    var paramUserId = req.body.user_id;
    //세션에서 얻어오기
    var paramTitle = req.body.title;
    var paramCategory = req.body.category;
    var paramArticle = req.body.article;
    var paramSchoolLocation = req.body.location;
    var paramChecking = req.body.checking;
    var paramboardId = req.params.boardId;
    var date = new Date();

    pool.getConnection(function(err, conn) {
        if(err){return cb(err);}
        //Use the connection
        if(paramUserId == req.body.user_id){
            //임시_세션의 id와 일치여부 확인
            console.dir([paramTitle, paramCategory, paramArticle, date, paramSchoolLocation, paramChecking, paramboardId]);
            conn.query("update board set title=?, category=?, article=?, writedate=?, location=?, checking=? where board_id=?",
                [paramTitle, paramCategory, paramArticle, date, paramSchoolLocation, paramChecking, paramboardId], function (error, results) {
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

board.boardDelete = (req, cb)=>{
    console.log('boardPost 메소드 호출됨');
    var paramUserId = req.body.user_id;
    //세션에서 얻어오기
    var paramboardId = req.params.boardId;
    pool.getConnection(function(err, conn) {
        if(err){return cb(err);}
        //Use the connection
        if(paramUserId == req.body.user_id){
            //임시_세션의 id와 글의 id 일치여부 확인
            conn.query("delete from board where board_id=?",[paramboardId], function (error, results) {
                console.log('쿼리문 전송 성공');
                //And done with the connection.
                //Handle error after the release.
                if (err) {return cb(err);}
                conn.release();
                return cb(null, {mag : 'delete success', match: results.affectedRows});
                // Don't use the connection here, it has been returned to the pool
            });
        }else{
            //사용자 불일치
        }
    });
}


module.exports = board;