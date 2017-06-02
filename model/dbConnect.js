var config = require('../config');
var mysql = require('mysql');

var dbPool = mysql.createPool({
    //socket: 'var/run/mysqld/mysqld.sock',
    port : config.port,
    host     : config.host,
    user     : config.user,
    password : config.password,
    database :config.database,
    multipleStatements : true
});

module.exports = dbPool;