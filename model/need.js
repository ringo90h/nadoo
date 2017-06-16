/*jshint esversion: 6 */

var pool = require('../database/dbConnect');
let paramDate = new Date();
class Need{
}

Need.needGet = (page, paramSearch, paramCategory, limitSql, cb) => {
    if(page){
        var sql = "select need.*,user.nickname,user.profile_thumbURL from need inner join user on need.user_id = user.user_key";
        if(paramSearch&&paramCategory){paramSearch = " where title like '%"+paramSearch+"%' and category='"+paramCategory+"'"; sql = sql.concat(paramSearch)+limitSql;}
        if(paramSearch&&!paramCategory){paramSearch = " where title like '%"+paramSearch+"%'"; sql = sql.concat(paramSearch)+limitSql;}
        if(!paramSearch&&paramCategory){paramCategory = ' where category="'+paramCategory+'"'; sql = sql.concat(paramCategory)+limitSql;}
        if(!paramSearch&&!paramCategory){sql = sql+limitSql;}
        console.log(sql);

        pool.getConnection(function(err, conn){
            if(err){return cb(err);}
            conn.query(sql, function (err, results) {
                console.log('쿼리문 전송 성공, 요청글 검색');
                if (err) {return cb(err);}
                conn.release();
                return cb(null, {page: page, count: results.length, data: results});
            });
        });
    }else{
        return cb(null, {error:'page 정보 필수 입력'});
    }
}

Need.needPost = (paramUserId, paramTitle, paramCategory, paramArticle,paramSchoolLocation,  cb)=> {
    if (paramTitle && paramCategory && paramArticle) {
        pool.getConnection(function (err, conn) {
            if (err) {
                return cb(err);
            }
            if(paramUserId){
                console.log(paramDate);
            //Use the connection
            conn.query("insert into need values('',?,?,?,?,?,?)",
                [paramUserId, paramTitle, paramCategory, paramArticle, paramDate, paramSchoolLocation], function (error, results) {
                    console.log('쿼리문 전송 성공');
                    //And done with the connection.
                    if (err) {
                        return cb(err);
                    }
                    conn.release();
                    return cb(null, { msg: "post success",insertId: results.insertId,affectedRows: results.affectedRows});
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

Need.needPut = (paramUserId, paramTitle, paramCategory, paramArticle,paramSchoolLocation, paramNeedId,  cb)=>{
    console.dir([paramUserId,paramTitle,paramCategory,paramArticle,paramSchoolLocation,paramNeedId]);
    if(paramTitle&&paramCategory&&paramArticle&&paramSchoolLocation) {
        pool.getConnection(function (err, conn) {
            if (err) {
                return cb(err);
            }
            conn.query("select user_id from need where need_id=?",
                [paramBoardId], function (err, results) {
                    console.log('쿼리문 전송 성공, ID 매칭 시작');
                    if (err) {
                        return cb(err);
                    }
                    //Use the connection
                    if (results[0].user_id == paramUserId) {
                        console.log('사용자 일치');
                        conn.query("update need set title=?, category=?, article=?, writedate=?, locatio" +
                            "n=? where need_id=?",
                            [paramTitle, paramCategory, paramDate, paramSchoolLocation, paramNeedId], function (error, results) {
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
                    } else {
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

Need.needDelete = (paramUserId, paramNeedId, cb)=>{
    pool.getConnection(function(err, conn) {
        if(err){return cb(err);}
        //Use the connection
        conn.query("select user_id from need where need_id=?",
            [paramNeedId], function (err, results) {
                console.log('쿼리문 전송 성공, ID 매칭 시작');
                if (err) {
                    return cb(err);
                }
                if(results[0].user_id==paramUserId){
                    console.log('사용자 일치');
                    //임시_세션의 id와 글의 id 일치여부 확인
                    conn.query("delete from need where need_id=?",[paramNeedId], function (error, results) {
                        console.log('쿼리문 전송 성공:');
                        //And done with the connection.
                        //Handle error after the release.
                        if (err) {return cb(err);}
                        conn.release();
                        return cb(null, {msg : 'delete success', deletedata: results.affectedRows});
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

module.exports = Need;