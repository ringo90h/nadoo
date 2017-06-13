/*jshint esversion: 6 */
/*jshint -W030 */

let pool = require('../database/dbConnect');
let awsImageUpload = require('./image/awsImageUpload');
class Item{
}

Item.itemGet = (page, paramSearch, paramCategory, parampriceKind, paramMinPrice, paramMaxPrice, paramStatus, paramSort, cb)=>{

    let sql = "select item.*,user.nickname,user.profile_thumbURL,user.check from item inner join user on item.user_id = user.user_key";

    let row_count = 10;
    let offset = (page - 1) * row_count;
    let limitSql = ' order by item_id desc limit ' + offset + ',' + row_count;

    console.log('검색어 : ' + paramSearch + " 카테고리 : " + paramCategory + " 최소금액 : " + paramMinPrice + " 최대금액 : " + paramMaxPrice + " " +
        "정렬기준 : " + paramSort + " 가격유형 : " + parampriceKind + "상태 : " + paramStatus);
    //query, params, body
    if (page) {
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
        } else if (!paramSearch && !paramCategory) {
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
        } else {
            limitSql = ' order by ' + paramSort + ' desc limit ' + offset + ',' + row_count;
            sql = sql + " where title like '%" + paramSearch + "%' and category=? and priceKind=? and price between ? and ? and status=?" + limitSql;

            pool.getConnection(function (err, conn) {
                if (err) {
                    return cb(err);
                }
                console.log(sql);
                conn.query(sql, [paramCategory, parampriceKind, paramMinPrice, paramMaxPrice, paramStatus], function (err, results) {
                        console.log('쿼리문 전송 성공, 검색어+필터 검색');
                        if (err) {
                            return cb(err);
                        }
                        conn.release();
                        return cb(null, {page: page, count: results.length, data: results});
                    }
                );
            });
        }
    } else {
        console.log('err : 필수 입력요소 누락');
        return cb(null, {error: 'page 정보 필수 입력'});
    }
}

Item.itemGetId = (req, cb)=>{
    let paramItemId = req.params.item_id;

    let sql = "select item.*,user.nickname,user.profile_thumbURL,user.check from item inner join user on item.user_id = user.user_key where item_id ="+paramItemId;
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


Item.itemPost = (paramUserId, paramTitle, paramCategory, paramArticle, paramPriceKind, paramPrice, paramSchoolLocation, date,files, cb)=>{

    console.dir(files);


    awsImageUpload.upload(files ,pool, (err, results)=>{
        if(err){console.log(err);}
        console.log('Qyd');
        console.dir(results);
        let paramImageURL = JSON.stringify(results);
        console.log('URL:'+paramImageURL);

        pool.getConnection(function(err, conn) {
            if(err){return cb(err);}
            //Use the connection
            conn.query("insert into item values('',?,?,?,?,?,?,?,?,?,'3')",
                [paramUserId, paramTitle, paramCategory, paramArticle, paramPriceKind, paramPrice, paramImageURL, date, paramSchoolLocation], function (error, results) {
                    console.log('쿼리문 전송 성공');
                    //And done with the connection.
                    if (err) {return cb(err);}
                    conn.release();
                    return cb(null,{mag :'item post 성공'});
                });
        });
    });
}

Item.itemPut = (paramUserId, paramTitle, paramCategory, paramArticle, paramPriceKind, paramPrice, paramitemId, paramSchoolLocation, date, cb)=>{
    pool.getConnection(function(err, conn) {
        if(err){return cb(err);}
        //Use the connection
        if(paramUserId){
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

Item.itemDelete = (paramUserId, paramitemId, cb)=>{
    pool.getConnection(function(err, conn) {
        if(err){return cb(err);}
        //Use the connection
        if(paramUserId){
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