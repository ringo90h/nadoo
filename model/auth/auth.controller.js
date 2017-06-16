/**
 * Created by Hwang Hyeonwoo on 2017-06-12.
 */
/*jshint esversion: 6 */
const authMysql = require('./authMysql');

class authController{
}

authController.register = function(req, res){
    const { user_id, password, } = req.body;
    let newUser = null;

    // create a new user if does not exist
    const create = (user) => {
        if(user) {
            throw new Error('username exists')
        } else {
            //유저 생성 함수
            return authMysql.create(user_id, password)
        }
    }

    // // count the number of the user
    // const count = (user) => {
    //     newUser = user
    //     return User.count({}).exec()
    // }

    // assign admin if count is 1
    // const assign = (count) => {
    //     if(count === 1) {
    //         return newUser.assignAdmin()
    //     } else {
    //         // if not, return a promise that returns false
    //         return Promise.resolve(false)
    //     }
    // }
    //
    // // respond to the client
    // const respond = (isAdmin) => {
    //     res.json({
    //         message: 'registered successfully',
    //         admin: isAdmin ? true : false
    //     })
    // }

    // run when there is an error (username exists)
    const onError = (error) => {
        res.status(409).json({
            message: error.message
        })
    }

    // check username duplication
    authMysql.findOneByUserId(user_id)
        .then(create)
        .catch(onError)
}

module.exports = authController;