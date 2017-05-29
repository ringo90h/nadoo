/*
 * 사용자 정보 처리 모듈
 * 데이터베이스 관련 객체들을 req.app.get('database')로 참조
 *
 * @date 2016-11-10
 * @author Mike
 */

var itemGet = (req, res) =>{
	console.log('itemGet 메소드 호출됨');
	
	var paramSearch = req.query.search;
    var paramCategory = req.query.category;
    var paramMinPrice = req.query.minPrice;
    var paramMaxPrice = req.query.maxPrice;
    var paramSort = req.query.sort;
    
    console.log('쿼리 정보  = search : '+ paramSearch + ', category : ' + paramCategory + ', minprice : ' + paramMinPrice + ', maxprice : ' + paramMaxPrice + ', sort :' + paramSort);
	res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
	res.write('<h1>쿼리 정보  = search : '+ paramSearch + ', category : ' + paramCategory + ', minprice : ' + paramMinPrice + ', maxprice : ' + paramMaxPrice + ', sort :' + paramSort + '</h1>');
	res.end();
}

module.exports.itemGet = itemGet;
