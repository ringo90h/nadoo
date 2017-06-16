/*jshint esversion: 6 */

let pool = require('../database/dbConnect');
let paramDate = new Date();
class Board{
}

Board.boardGet = (page, paramCategory, cb) => {
    if (page && paramCategory) {
        console.log("카테고리" + paramCategory);
        //query, params, body
    
        let row_count = 10;
        let offset = (page - 1) * row_count;
        let limitSql = ' order by board_id desc limit ' + offset + ',' + row_count;
    
        let sql = 'select board.*,user.nickname,user.profile_thumbURL, (select count(board_id) board from board_like as b where b.board_id=board.board_id) as likeCount,(select count(board_id) board from board_comment as c where c.board_id=board.board_id) as commentCount from board inner join user on board.user_id = user.user_key'+limitSql;
        console.log(sql);
    
        pool.getConnection(function (err, conn) {
            if (err) {
                return cb(err);
            }
            conn.query(sql, function (err, results) {
                console.log('쿼리문 전송 성공, 전체 검색');
                if (err) {
                    return cb(err);
                }
                conn.release();
                return cb(null, {page: page, count: results.length, data: results});
            });
        });
    }else{
        console.log('err : 필수 입력요소 누락');
        return cb(null, {error:'page, category정보 필수 입력'});
    }
}

Board.boardGetId = (paramBoardId, cb)=>{
    //select board.*,user.nickname, (select count(board_id) board from board_like as b where b.board_id=board.board_id) as likeCount,(select count(board_id) board from board_comment as c where c.board_id=board.board_id) as commentCount from board inner join user on board.user_id = user.user_key;
    let boardsql = 'select board.*, (select count(board_id) board from board_like as b where b.board_id=board.board_id) as likeCount,(select count(board_id) board from board_comment as c where c.board_id=board.board_id) as commentCount from board where board_id=?';
    let commentsql = 'select board_comment.*,user.nickname,user.profile_thumbURL from board_comment inner join user on board_comment.user_key = user.user_key where board_id=?'
    console.log(boardsql,commentsql);
    let result_board;

    pool.getConnection(function (err, conn) {
        if (err) {
            return cb(err);
        }
        conn.query(boardsql,[paramBoardId], function (err, results) {
            console.log('쿼리문 전송 성공,'+paramBoardId+'검색');
            if (err) {
                return cb(err);
            }
            conn.release();
            result_board = results;

            pool.getConnection(function (err, conn) {
                if (err) {
                    return cb(err);
                }
                conn.query(commentsql,[paramBoardId], function (err, results) {
                    console.log('쿼리문 전송 성공,'+paramBoardId+'검색');
                    if (err) {
                        return cb(err);
                    }
                    conn.release();
                    return cb(null, {comment_count: results.length, data_comment: results, data_board: result_board});
                });
            });
        });
    });

}

Board.boardPost = (paramUserId, paramTitle, paramCategory, paramArticle, paramAnonymity, cb)=>{
    if(paramTitle&&paramCategory&&paramArticle){
        pool.getConnection(function(err, conn){
                if(err){return cb(err);}
                if(paramUserId){
                        conn.query("insert into board values('',?,?,?,?,?,?)",
                            [paramUserId, paramTitle, paramCategory, paramArticle, paramDate, paramAnonymity], function (error, results) {
                                console.log('쿼리문 전송 성공');
                                //And done with the connection.
                                if (err) {return cb(err);}
                                conn.release();
                                return cb(null,{msg :"post success", insertId: results.insertId, affectedRows: results.affectedRows});
                            });
                }else{
                    return cb(null,{err:"1", msg:"not login"});
                }
            });
    }else{
        console.log('필수 입력요소 누락'+paramUserId+ paramTitle + paramCategory + paramArticle + paramAnonymity);
        return cb(null, {error:'필수 입력요소 누락'});
    }
}

Board.boardPut = (paramUserId, paramTitle, paramCategory, paramArticle, paramAnonymity, paramBoardId, cb)=>{
    console.dir([paramUserId,paramTitle, paramCategory, paramArticle, paramAnonymity, paramBoardId]);
    if(paramTitle&&paramCategory&&paramArticle) {
        pool.getConnection(function (err, conn) {
            if (err) {
                return cb(err);
            }
            conn.query("select user_id from board where board_id=?",
                [paramBoardId], function (err, results) {
                    console.log('쿼리문 전송 성공, ID 매칭 시작');
                    if (err) {
                        return cb(err);
                    }
                    if(results[0].user_id==paramUserId){
                        console.log('사용자 일치');
                        conn.query("update board set title=?, category=?, article=?, writedate=?, anonymity=? where board_id=?",
                            [paramTitle, paramCategory, paramArticle, paramDate, paramAnonymity, paramBoardId], function (error, results) {
                                console.log('쿼리문 전송 성공');
                                //And done with the connection.
                                //Handle error after the release.
                                if (err) {
                                    return cb(err);
                                }
                                // Don't use the connection here, it has been returned to the pool
                                conn.release();
                                return cb(null, {msg: 'put success'});
                            });
                    }else{
                        conn.release();
                        console.log('사용자 불일치');
                        return cb(null, {err: '1', msg: 'user_id is not correct'});
                    }
                });
        });
    }else{
        console.log('필수 입력요소 누락');
        return cb(err);
    }
}

Board.boardDelete = (paramUserId, paramBoardId, cb)=>{
    pool.getConnection(function(err, conn) {
        if(err){return cb(err);}
        //Use the connection
        conn.query("select user_id from board where board_id=?",
            [paramBoardId], function (err, results) {
                console.log('쿼리문 전송 성공, ID 매칭 시작');
                if (err) {
                    return cb(err);
                }
                if(results[0].user_id==paramUserId){
                    console.log('사용자 일치');
                    conn.query("delete from board where board_id=?",[paramBoardId], function (error, results) {
                        console.log('쿼리문 전송 성공');
                        //And done with the connection.
                        //Handle error after the release.
                        if (err) {return cb(err);}
                        conn.release();
                        return cb(null, {msg : 'delete success', affectedRows : results.affectedRows});
                        // Don't use the connection here, it has been returned to the pool
                    });
                }else{
                    conn.release();
                    console.log('사용자 불일치');
                    return cb(null, {err: '1', msg: 'user_id is not correct'});
                }
            });
    });
}


module.exports = Board;