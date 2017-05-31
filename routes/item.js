var pool = require('../database/database');
/*
 * 사용자 정보 처리 모듈
 * 데이터베이스 관련 객체들을 req.app.get('database')로 참조
 *
 * @date 2016-11-10
 * @author Mike
 */

var itemGet = function(req, res){
	console.log('itemGet 메소드 호출됨');

	var paramSearch = req.query.search;
    var paramCategory = req.query.category;
    var paramMinPrice = req.query.minPrice;
    var paramMaxPrice = req.query.maxPrice;
    var paramSort = req.query.sort;

    pool.getConnection(function(err, connection) {
        if(err) throw err;
        //Use the connection
        connection.query('', function (error, results, fields) {
        console.log('database 연결 성공');
        //And done with the connection.
        connection.release();

        //Handle error after the release.
        if (error) throw error;
        // Don't use the connection here, it has been returned to the pool
   });
    connection.end();
});


    if(paramSearch){
        console.log('검색어'+paramSearch);

    }
    //console.log('쿼리 정보  = search : '+ paramSearch + ', category : ' + paramCategory + ', minprice : ' + paramMinPrice + ', maxprice : ' + paramMaxPrice + ', sort :' + paramSort);
	//res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
	//res.write('<h1>쿼리 정보  = search : '+ paramSearch + ', category : ' + paramCategory + ', minprice : ' + paramMinPrice + ', maxprice : ' + paramMaxPrice + ', sort :' + paramSort + '</h1>');
	//res.end();
}
var itemGet = function(req, res){}
var itemGetId = function(req, res){}
var itemPost = function(req, res){}

module.exports.itemGet = itemGet;
module.exports.itemGetId = itemGetId;
module.exports.itemPost = itemPost;