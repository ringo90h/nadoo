/*jshint esversion: 6 */
/*jshint -W030 */

let pool = require('../database/dbConnect');
let awsImsgeUpload = require('./image/awsImageUpload');
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
                        return cb(null, {page: page, count: results.length, data: results,thumbnailURL: results.thumbnailUrl});
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
                        return cb(null, {page: page, count: results.length, data: results, thumbnailURL: results.thumbnailUrl});
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
                        return cb(null, {page: page, count: results.length, data: results, thumbnailURL: results.imageURL});
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
                        return cb(null, {page: page, count: results.length, data: results, thumbnailURL: results.thumbnailUrl});
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
                return cb(null, {msg: "get_id success", data: results});
            }

        );
    });
}


Item.itemPost = (paramUserId, paramTitle, paramCategory, paramArticle, paramPriceKind, paramPrice, paramSchoolLocation, files, cb)=>{
    console.dir(files);
    if(paramTitle&&paramCategory&&paramArticle&&paramPriceKind&&paramSchoolLocation){
        if(paramUserId){
            let paramImageURL = {};
            awsImsgeUpload.upload(files, (err, results)=>{
                if(err){console.log(err);}
                console.log('URL:'+paramImageURL);
                paramImageURL.push(JSON.stringify(results));

                pool.getConnection(function(err, conn) {
                    if(err){return cb(err);}
                    //Use the connection
                    conn.query("insert into item values('',?,?,?,?,?,?,?,'',?,'3')",
                        [paramUserId, paramTitle, paramCategory, paramArticle, paramPriceKind, paramPrice, paramImageURL, paramSchoolLocation], function (error, results) {
                            console.log('쿼리문 전송 성공');
                            //And done with the connection.
                            if (err) {return cb(err);}
                            conn.release();
                            return cb(null,{msg :'item post 성공'});
                            //todo db입력 실패시 이미지 삭제 or 쿼리 전솧 후 이미지 업로드
                        });
                });
            });
        }else{
            return cb(null,{err:"1", msg:"not login"});
            //todo 이미지 삭제
        }
    }else{
        console.log('필수 입력요소 누락');
        return cb(null, {error:'필수 입력요소 누락'});
    }
}

Item.itemPut = (paramUserId, paramTitle, paramCategory, paramArticle, paramPriceKind, paramPrice, paramitemId, paramSchoolLocation, files, cb)=>{
    if(paramTitle&&paramCategory&&paramArticle&&paramPriceKind&&paramSchoolLocation) {
        pool.getConnection(function (err, conn) {
            if (err) {
                return cb(err);
            }
            conn.query("select user_id from item where item_id=?",
                [paramitemId], function(err, results){
                console.log('쿼리문 전송 성공, ID 매칭 시작');
                if(err){
                    return cb(err)
                }
                let paramImageURL;
                let date = new Date();
                if(results[0].user_id==paramUserId){
                    console.log('사용자 일치');
                    awsImsgeUpload.upload(files, (err, results)=>{
                        if(err){console.log(err);}

                        paramImageURL = JSON.stringify(results);
                        console.log('URL:'+paramImageURL);

                        conn.query("update item set title=?, category=?, article=?, priceKind=?, price=?, imageURL=?, writedate=?, location=? where item_id=?",
                            [paramTitle, paramCategory, paramArticle, paramPriceKind, paramPrice, paramImageURL, date, paramSchoolLocation, paramitemId], function (err, results) {
                                console.log('쿼리문 전송 성공');
                                //And done with the connection.
                                //Handle error after the release.
                                if (err) {
                                    return cb(err);
                                }
                                // Don't use the connection here, it has been returned to the pool
                                conn.release();
                                console.dir(results);
                                return cb(null, {msg: 'put success'});
                            });
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

Item.itemDelete = (paramUserId, paramitemId, cb)=>{
    pool.getConnection(function(err, conn) {
        if(err){return cb(err);}
        //Use the connection
        conn.query("select user_id from item where item_id=?",
            [paramitemId], function(err, results){
                console.log('쿼리문 전송 성공, ID 매칭 시작');
                if(err){
                    return  cb(err);
                }
                if(results[0].user_id==paramUserId) {
                    console.log('사용자 일치');
                    conn.query("delete from item where item_id=?",[paramitemId], function (error, results) {
                        console.log('쿼리문 전송 성공');
                        //And done with the connection.
                        //Handle error after the release.
                        if (err) {return cb(err);}
                        conn.release();
                        return cb(null, {msg : 'delete success', match: results.affectedRows});
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


module.exports = Item;