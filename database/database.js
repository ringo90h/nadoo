var config = require('../config');
var mysql = require('mysql');

var pool = mysql.createPool({
    //socket: 'var/run/mysqld/mysqld.sock',
    port : config.port,
    host     : config.host,
    user     : config.user,
    password : config.password,
    database :config.database,
    multipleStatements : true
});

pool.getConnection(function(err, conn) {
    if (err) {
        throw err
        if(conn) {
            console.dir(conn);
            conn.release();  // 반드시 해제해야 함
        }
        return;
    }
    console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);

    conn.on('error', function(err) {
        console.log('데이터베이스 연결 시 에러 발생함.');
        console.dir(err);

    });
});

//connection.connect();
//connection.query('select * from item', function(err,rows,fields){
//   if(err) console.log(err);
//     console.log('데이터베이스 연결 성공');
//   console.log('The solution is: ', rows);
//   connection.end();
// });


// pool.getConnection(function(err, connection) {
//   if(err) throw err;
//   // Use the connection
//   // connection.query('', function (error, results, fields) {
//      console.log('database 연결 성공');
//   //   // And done with the connection.
//      connection.release();
//   //
//   //   // Handle error after the release.
//   //   if (error) throw error;
//   //
//   //   // Don't use the connection here, it has been returned to the pool
//   // });
//     connection.end();
// });

module.exports = pool;