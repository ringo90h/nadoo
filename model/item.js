/*jshint esversion: 6 */

var pool = require('../database/dbConnect');
class Item{
}

Item.itemGet = (req, cb) => {
    console.log('itemget 메소드 호출됨');

    var paramSearch = req.query.search;

    var paramCategory = req.query.category;
    var paramMinPrice = req.query.minPrice;
    var paramMaxPrice = req.query.maxPrice;
    var paramSort = req.query.sort;

    var sql = "select * from need where";
    if(paramSearch){paramSearch = " title like '%"+paramSearch+"%'"; sql = sql.concat(paramSearch);}

    if(paramCategory){filter = ' category="'+paramCategory+'" and (price between '+paramMinPrice+ ' and ' + paramMaxPrice+')'; sql = sql.concat(filter);}
    if(paramSort){paramSort = 'and sort ='+paramSort; sql.concat(paramSort);}

    console.log(sql);
    console.log('검색어 : '+paramSearch+"카테고리"+paramCategory+"최소금액"+paramMinPrice+"최대금액"+paramMaxPrice+"정렬기준"+paramSort);
    //query, params, body
    return cb(null, 'end');
    // pool.getConnection(function(err, conn){
    //     if(err){return cb(err);}
    //     if(!req.query.search && !req.query.category) {
    //         conn.query("select * from item", function (err, results) {
    //             console.log('쿼리문 전송 성공, 전체 검색');
    //             if (err) {return cb(err);}
    //             conn.release();
    //             return cb(null, {count: results.length, data: results});
    //         });
    //     }else if(!req.query.search && req.query.category)    {
    //         conn.query("select * from item where category=?",[paramCategory], function (error, results) {
    //             console.log('쿼리문 전송 성공, category 검색');
    //             if (err) {return cb(err);}
    //             conn.release();
    //             return cb(null, {count: results.length, data: results});
    //         });
    //     }else if(req.query.search && !req.query.category){
    //         conn.query("select * from item where title like ?",[paramSearch], function (error, results) {
    //             console.log('쿼리문 전송 성공, title검색');
    //             if (err) {return cb(err);}
    //             conn.release();
    //             return cb(null, {count: results.length, data: results});
    //         });
    //     }else{
    //         conn.query("select * from item where title like ? and category=?",[paramSearch, paramCategory], function (error, results) {
    //             console.log('쿼리문 전송 성공, title&category 검색');
    //             //And done with the connection.
    //             if (err) {return cb(err);}
    //             conn.release();
    //             return cb(null, {count: results.length, data: results});
    //         });
    //     }
    // });
}

Item.itemGetId = (req, cb)=>{
    console.log('itemGetId메소드 호출',req.params.itemId);
    return cb(null, 'success');
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
    var paramChecking = req.body.checking;
    var date = new Date();

    console.log(req.headers['content-type']);
    console.log(req.files);

    pool.getConnection(function(err, conn) {
        if(err){return cb(err);}
        //Use the connection
        conn.query("insert into item values('',?,?,?,?,?,?,'',?,?,?,'3')",
            [paramUserId, paramTitle, paramCategory, paramArticle, paramPriceKind, paramPrice, date, paramSchoolLocation, paramChecking], function (error, results) {
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
    var paramChecking = req.body.checking;
    var paramitemId = req.params.itemId;
    var date = new Date();

    pool.getConnection(function(err, conn) {
        if(err){return cb(err);}
        //Use the connection
        if(paramUserId == req.body.user_id){
            //임시_세션의 id와 일치여부 확인
            console.dir([paramTitle, paramCategory, paramArticle, date, paramSchoolLocation, paramChecking, paramitemId]);
            conn.query("update item set title=?, category=?, article=?, writedate=?, location=?, checking=? where item_id=?",
                [paramTitle, paramCategory, paramArticle, date, paramSchoolLocation, paramChecking, paramitemId], function (error, results) {
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
