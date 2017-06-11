/*jshint esversion: 6 */
/*jshint -W030 */

var pool = require('../database/dbConnect');
var awsImageUpload = require('./awsImageUpload');
class Item{
}

Item.itemGet = (req, cb) => {
    console.log('itemget 메소드 호출됨');

    var page = req.query.page;
    var paramSearch = req.query.search;

    var paramCategory = req.query.category;
    var parampriceKind = req.query.priceKind;
    var paramMinPrice = parseInt(req.query.minPrice);
    var paramMaxPrice = parseInt(req.query.maxPrice);
    var paramStatus = req.query.status;
    var paramSort = req.query.sort;

    var sql = "select item.*,user.nickname,user.profile_thumbURL,user.check from item inner join user on item.user_id = user.user_key";

    var row_count = 10;
    var offset = (page - 1)*row_count ;
    var limitSql = ' order by item_id desc limit '+offset+','+row_count;

    console.log('검색어 : '+paramSearch+" 카테고리 : "+paramCategory+" 최소금액 : "+paramMinPrice+" 최대금액 : "+paramMaxPrice+" " +
        "정렬기준 : "+paramSort+" 가격유형 : "+parampriceKind+"상태 : "+paramStatus);
    //query, params, body
    if(page) {
        if (paramSearch && !paramCategory) {
            sql = sql + " where title like '%" + paramSearch + "%'" + limitSql;
            pool.getConnection(function (err, conn) {
                if (err) {
                    return cb(err);
                }

                conn.query(sql, function (err, results) {
                        console.log('쿼리문 전송 성공, 검색어 검색');
                        if (err) {
                            return cb(err);
                        }
                        conn.release();
                        return cb(null, {page: page, count: results.length, data: results});
                    }
                );
            });
        } else if (!paramSearch && paramCategory) {
            limitSql = ' order by ' + paramSort + ' desc limit ' + offset + ',' + row_count;
            sql = sql + " where category=? and priceKind=? and price between ? and ? and status=?" + limitSql;

            pool.getConnection(function (err, conn) {
                if (err) {
                    return cb(err);
                }
                console.log(sql);
                conn.query(sql, [paramCategory, parampriceKind, paramMinPrice, paramMaxPrice, paramStatus], function (err, results) {
                        console.log('쿼리문 전송 성공, 검색어 제외 필터 검색');
                        if (err) {
                            return cb(err);
                        }
                        conn.release();
                        return cb(null, {page: page, count: results.length, data: results});
                    }
                );
            });
        } else if (!paramSearch && !paramCategory){
            sql = sql + limitSql;
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
                    }
                );
            });
        }else{
                limitSql = ' order by '+paramSort+' desc limit '+offset+','+row_count;
                sql = sql+" where title like '%"+paramSearch+"%' and category=? and priceKind=? and price between ? and ? and status=?"+limitSql;

                pool.getConnection(function(err, conn){
                    if(err){return cb(err);}
                    console.log(sql);
                    conn.query(sql,[paramCategory,parampriceKind,paramMinPrice,paramMaxPrice,paramStatus], function (err, results) {
                            console.log('쿼리문 전송 성공, 검색어+필터 검색');
                            if (err) {return cb(err);}
                            conn.release();
                            return cb(null, {page: page, count: results.length, data: results});
                        }

                    );
                });
            }
    }else{
        console.log('err : 필수 입력요소 누락');
        return cb(null, {error:'page 정보 필수 입력'});
    }
}

Item.itemGetId = (req, cb)=>{
    var paramItemId = req.params.item_id;

    var sql = "select item.*,user.nickname,user.profile_thumbURL,user.check from item inner join user on item.user_id = user.user_key where item_id ="+paramItemId;
    pool.getConnection(function(err, conn){
        if(err){return cb(err);}

        conn.query(sql, function (err, results) {
                console.log('쿼리문 전송 성공, 아이템 iD'+paramItemId+'상세 검색');
                if (err) {return cb(err);}
                conn.release();
                return cb(null, {mag: "get_id success", data: results});
            }

        );
    });
}


Item.itemPost = (req, cb)=>{
    console.log('itemPost 메소드 호출됨');
    var paramUserId = req.body.user_id;
    //세션에서 얻어오기
    var paramTitle = req.body.title;
    var paramCategory = req.body.category;
    var paramArticle = req.body.article;
    var paramPriceKind = req.body.priceKind;
    var paramPrice = req.body.price;
    var paramSchoolLocation = req.body.location;
    var date = new Date();

    console.log(req.headers['content-type']);
    console.dir(req.files);

    awsImageUpload.upload(req.files ,pool, (err, results)=>{
        if(err){console.log(err);}
        console.log(results);

        var paramImageURL = 'd';
    });

    pool.getConnection(function(err, conn) {
        if(err){return cb(err);}
        //Use the connection
        conn.query("insert into item values('',?,?,?,?,?,?,'image',?,?,'3')",
            [paramUserId, paramTitle, paramCategory, paramArticle, paramPriceKind, paramPrice, date, paramSchoolLocation], function (error, results) {
                console.log('쿼리문 전송 성공');
                //And done with the connection.
                if (err) {return cb(err);}
                conn.release();
                return cb(null,{mag :'성공'});
            });
    });
}

Item.itemPut = (req, cb)=>{
    console.log('itemPut 메소드 호출됨');
    var paramUserId = req.body.user_id;
    //세션에서 얻어오기
    var paramTitle = req.body.title;
    var paramCategory = req.body.category;
    var paramArticle = req.body.article;
    var paramSchoolLocation = req.body.location;
    var paramitemId = req.params.itemId;
    var date = new Date();

    pool.getConnection(function(err, conn) {
        if(err){return cb(err);}
        //Use the connection
        if(paramUserId == req.body.user_id){
            //임시_세션의 id와 일치여부 확인
            console.dir([paramTitle, paramCategory, paramArticle, date, paramSchoolLocation, paramitemId]);
            conn.query("update item set title=?, category=?, article=?, writedate=?, location=? where item_id=?",
                [paramTitle, paramCategory, paramArticle, date, paramSchoolLocation, paramitemId], function (error, results) {
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

Item.itemDelete = (req, cb)=>{
    console.log('itemDelete 메소드 호출됨');
    var paramUserId = req.body.user_id;
    //세션에서 얻어오기
    var paramitemId = req.params.itemId;
    pool.getConnection(function(err, conn) {
        if(err){return cb(err);}
        //Use the connection
        if(paramUserId == req.body.user_id){
            //임시_세션의 id와 글의 id 일치여부 확인
            conn.query("delete from item where item_id=?",[paramitemId], function (error, results) {
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


module.exports = Item;