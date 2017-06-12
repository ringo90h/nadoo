/**
 * Created by Hwang Hyeonwoo on 2017-06-02.
 */
/*jshint esversion: 6 */

const Need = require('./need');
const Item = require('./item');
const Board = require('./board');
const User = require('./user');
const Auth = require('./auth.controller');

class Index{
}
Index.loginPost = (req, res, next)=>{
    console.log('loginPost 라우팅');
    Auth.register(req,(err,result)=>{
        if(err){return next(err);}
        res.send(result);
    });
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
Index.boardGet = (req, res, next)=>{
    console.log('boardGet 라우팅');
    Board.boardGet(req,(err,result)=>{
        if(err){return next(err);}
        res.send(result);
    });
}

Index.boardPost = (req, res, next)=>{
    console.log('boardPost 라우팅');
    Board.boardPost(req,(err,result)=>{
        if(err){return next(err);}
        res.send(result);
    });
}

Index.boardGetId = (req, res, next)=>{
    console.log('boardGetId 라우팅');
    Board.boardGetId(req,(err,result)=>{
        if(err){return next(err);}
        res.send(result);
    });
}

Index.boardPut = (req, res, next)=>{
    console.log('boardPut 라우팅');
    Board.boardPut(req,(err,result)=>{
        if(err){return next(err);}
        res.send(result);
    });
}

Index.boardDelete = (req, res, next)=>{
    console.log('boardDelete 라우팅');
    Board.boardDelete(req,(err,result)=>{
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
    Item.itemPut(req.file,(err,result)=>{
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


Index.userGet = (req, res, next)=>{
    console.log('userGet 라우팅');
    User.userGet(req,(err,result)=>{
        if(err){return next(err);}
        res.send(result);
    });
}

Index.userPost = (req, res, next)=>{
    console.log('userPost 라우팅');
    User.userGet(req,(err,result)=>{
        if(err){return next(err);}
        res.send(result);
    });
}

Index.userGetId = (req, res, next)=>{
    console.log('userGetId 라우팅');
    User.userGetId(req,(err,result)=>{
        if(err){return next(err);}
        res.send(result);
    });
}

Index.userPut = (req, res, next)=>{
    console.log('userPut 라우팅');
    User.userPut(req.file,(err,result)=>{
        if(err){return next(err);}
        res.send(result);
    });
}

Index.userDelete = (req, res, next)=>{
    console.log('userDelete 라우팅');
    User.userDelete(req,(err,result)=>{
        if(err){return next(err);}
        res.send(result);
    });
}

module.exports = Index;