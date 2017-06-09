/*jshint esversion: 6 */

var pool = require('../database/dbConnect');
class Need{
}

Need.needGet = (req, cb) => {
    console.log('needget 메소드 호출됨');

    var page = req.query.page;
    var paramSearch = req.query.search;
    var paramCategory = req.query.category;

    var row_count = 10;
    var offset = (page - 1)*row_count ;
    var limitSql = ' order by need_id desc limit '+offset+','+row_count;

    console.log('검색어 : '+paramSearch+"카테고리"+paramCategory+"페이지"+page);
    //query, params, body
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
                console.log('쿼리문 전송 성공, 전체 검색');
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

Need.needPost = (req, cb)=>{
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

Need.needPut = (req, cb)=>{
    console.log('needPut 메소드 호출됨');
    var paramUserId = req.body.user_id;
    //로그인한 상태에서 세션에서 얻어오기
    var paramTitle = req.body.title;
    var paramCategory = req.body.category;
    var paramArticle = req.body.article;
    var paramSchoolLocation = req.body.location;
    var paramNeedId = req.params.need_id;
    var date = new Date();

    pool.getConnection(function(err, conn) {
        if(err){return cb(err);}
        //Use the connection
        if(paramUserId == req.body.user_id){
            //임시_세션의 id와 일치여부 확인
            console.dir([paramTitle, paramCategory, paramArticle, date, paramSchoolLocation, paramNeedId]);
            conn.query("update need set title=?, category=?, article=?, writedate=?, location=? where need_id=?",
                [paramTitle, paramCategory, paramArticle, date, paramSchoolLocation, paramNeedId], function (error, results) {
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

Need.needDelete = (req, cb)=>{
    console.log('needDelete 메소드 호출됨');
    var paramUserId = req.body.user_id;
    //세션에서 얻어오기
    var paramNeedId = req.params.need_id;
    pool.getConnection(function(err, conn) {
        if(err){return cb(err);}
        //Use the connection
        if(paramUserId == req.body.user_id){
            //임시_세션의 id와 글의 id 일치여부 확인
            conn.query("delete from need where need_id=?",[paramNeedId], function (error, results) {
                console.log('쿼리문 전송 성공:'+paramUserId+paramNeedId);
                //And done with the connection.
                //Handle error after the release.
                if (err) {return cb(err);}
                conn.release();
                return cb(null, {mag : 'delete success', deletedata: results.affectedRows});
                // Don't use the connection here, it has been returned to the pool
            });
        }else{
            //사용자 불일치
        }
    });
}


module.exports = Need;