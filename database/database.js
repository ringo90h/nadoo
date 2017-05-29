var mysql      = require('mysql');
var pool = mysql.createPool({
  host     : '13.58.66.195:3306',
  user     : 'root',
  password : 'nadoo1234',
  database : 'my_db'
});

pool.getConnection(function(err, connection) {
  // Use the connection
  connection.query('', function (error, results, fields) {
    // And done with the connection.
    connection.release();

    // Handle error after the release.
    if (error) throw error;

    // Don't use the connection here, it has been returned to the pool.
    
    
    
//    쿼리
//    connection.query('UPDATE users SET foo = ?, bar = ?, baz = ? WHERE id = ?', ['a', 'b', 'c', userId], function (error, results, fields) {
//    	  if (error) throw error;
//    	  // ...
//    });
//    배열
//    var post  = {id: 1, title: 'Hello MySQL'};
//    var query = connection.query('INSERT INTO posts SET ?', post, function (error, results, fields) {
//      if (error) throw error;
//      // Neat!
//    });
//    console.log(query.sql); // INSERT INTO posts SET `id` = 1, `title` = 'Hello MySQL'
    
  });
});

module.exports = database;