/**
 * Created by Hwang Hyeonwoo on 2017-06-02.
 */
/*jshint esversion: 6 */

const Need = require('./need');
const Item = require('./item');
const awsimage = require('./awsimage');
class Index{
}

Index.needGet = (req, res, next)=>{
    console.log('needGet 라우팅');
    Need.needGet(req,(err,result)=>{
        if(err){return next(err);}
        res.send(result);
    });
}

Index.needPost = (req, res, next)=>{
    console.log('needPost 라우팅');
    Need.needPost(req,(err,result)=>{
        if(err){return next(err);}
        res.send(result);
    });
}

Index.needGetId = (req, res, next)=>{
    console.log('needGetId 라우팅');
    Need.needGetId(req,(err,result)=>{
        if(err){return next(err);}
        res.send(result);
    });
}

Index.needPut = (req, res, next)=>{
    console.log('needPut 라우팅');
    Need.needPut(req,(err,result)=>{
        if(err){return next(err);}
        res.send(result);
    });
}

Index.needDelete = (req, res, next)=>{
    console.log('needDelete 라우팅');
    Need.needDelete(req,(err,result)=>{
        if(err){return next(err);}
        res.send(result);
    });
}
Index.itemGet = (req, res, next)=>{
    console.log('itemGet 라우팅');
    Item.itemGet(req,(err,result)=>{
        if(err){return next(err);}
        res.send(result);
    });
}

Index.itemPost = (req, res, next)=>{
    console.log('itemPost 라우팅');
    Item.itemPost(req,(err,result)=>{
        if(err){return next(err);}
        res.send(result);
    });
}

Index.itemGetId = (req, res, next)=>{
    console.log('itemGetId 라우팅');
    Item.itemGetId(req,(err,result)=>{
        if(err){return next(err);}
        res.send(result);
    });
}

Index.itemPut = (req, res, next)=>{
    console.log('itemPut 라우팅');
    Item.itemPut(req,(err,result)=>{
        if(err){return next(err);}
        res.send(result);
    });
}

Index.itemDelete = (req, res, next)=>{
    console.log('itemDelete 라우팅');
    Item.itemDelete(req,(err,result)=>{
        if(err){return next(err);}
        res.send(result);
    });
}

Index.uploadImage = (req, res, next)=>{
    console.log('uploadImage 라우팅');
    awsimage.uploadImage(req,(err,result)=>{
        if(err){return next(err);}
        res.send(result);
    });
}

module.exports = Index;