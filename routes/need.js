var pool = require('../database/database');
/*
 * 사용자 정보 처리 모듈
 * 데이터베이스 관련 객체들을 req.app.get('database')로 참조
 *
 * @date 2016-11-10
 * @author Mike
 */

var needGet = function(req, res){
	console.log('needget 메소드 호출됨');

var paramSearch = '%'+req.query.search+'%';
var paramCategory = req.query.category;
console.log('검색어 : '+paramSearch+"카테고리"+paramCategory);

pool.getConnection(function(err, connection) {
    if(err) throw err;
    //Use the connection
    connection.query("select * from need where title like ? and category=?",[paramSearch, paramCategory], function (error, results, fields) {
            console.log('database 연결 성공');
            //And done with the connection.
            console.log(results);
            res.json(results);
            //Handle error after the release.
            if (error) throw error;
            // Don't use the connection here, it has been returned to the pool
    });
    connection.release();
});

}

var needGetId = function(req, res){

}


var needPost = function(req, res){
    console.log('needPost 메소드 호출됨');
    var paramUserId = req.body.user_id;
    //세션에서 얻어오기
    var paramTitle = req.body.title;
    var paramCategory = req.body.category;
    var paramArticle = req.body.article;
    var paramSchoolLocation = req.body.location;
    var paramChecking = req.body.checking;
    var date = new Date();

     pool.getConnection(function(err, connection) {
        if(err) throw err;
        //Use the connection
        connection.query("insert into need values('',?,?,?,?,?,?,?)",[paramUserId, paramTitle, paramCategory, paramArticle, date, paramSchoolLocation, paramChecking], function (error, results, fields) {
            console.log('database 연결 성공');
            //And done with the connection.
            results.message = "post success";
            res.json(results);
            //Handle error after the release.
            if (error) throw error;
            // Don't use the connection here, it has been returned to the pool
        });
        connection.release();
    });

}

var needDelete = function(req, res){
    console.log('needPost 메소드 호출됨');
    var paramUserId = req.body.user_id;
    //세션에서 얻어오기
    var paramNeedId = req.body.need_id;
    pool.getConnection(function(err, connection) {
        if(err) throw err;
        //Use the connection
        if(paramUserId == req.body.user_id){
            //임시_세션의 id와 글의 id 일치여부 확인
            connection.query("delte from need where need_id=?",[paramNeedId], function (error, results, fields) {
                console.log('database 연결 성공');
                //And done with the connection.
                results.message = "delete success";
                res.json(results);
                //Handle error after the release.
                if (error) throw error;
                // Don't use the connection here, it has been returned to the pool
            });
            connection.release();
        }else{
            //사용자 불일치
        }
    });
}

var needPut = function(req, res){
    console.log('needPut 메소드 호출됨');
    var paramUserId = req.body.user_id;
    //세션에서 얻어오기
    var paramTitle = req.body.title;
    var paramCategory = req.body.category;
    var paramArticle = req.body.article;
    var paramSchoolLocation = req.body.location;
    var paramChecking = req.body.checking;
    var paramNeedId = req.body.need_id;

    pool.getConnection(function(err, connection) {
        if(err) throw err;
        //Use the connection
        if(paramUserId == req.body.user_id){
            //임시_세션의 id와 일치여부 확인
            connection.query("update need set title=? category=? article=? writedate=? location=? checking=? where need_Id=?",[paramTitle, paramCategory, paramArticle, date, paramSchoolLocation, paramChecking, paramNeedId], function (error, results, fields) {
                console.log('database 연결 성공');
                //And done with the connection.
                results.message = "post success";
                res.json(results);
                //Handle error after the release.
                if (error) throw error;
                // Don't use the connection here, it has been returned to the pool
            });
            connection.release();
        }else{
            //사용자 불일치
        }

    });

}

module.exports.needGet = needGet;
module.exports.needGetId = needGetId;
module.exports.needPost = needPost;
module.exports.needPut = needPut;
module.exports.needDelete = needDelete;