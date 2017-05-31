/*
 * 설정 파일
 *
 * @date 2016-11-10
 * @author Mike
 */

module.exports = {
    port : '3306',
    host     : 'nadoodatabase.cahz3zhr1zdj.us-east-2.rds.amazonaws.com',
    user     : 'nadooroot',
    password : '1234nadoo1234',
    database : 'nadoodata',
	server_port: 3000,
	// db_url: 'mongodb://localhost:27017/local',
	// db_schemas: [
	//     {file:'./user_schema', collection:'users3', schemaName:'UserSchema', modelName:'UserModel'}
	// ],
	route_info: [
	    //===== User =====//
	    {file:'./item', path:'/process/item', method:'itemGet', type:'get'},
	    {file:'./item', path:'/process/item', method:'itemPost', type:'post'},
	    {file:'./need', path:'/process/need', method:'needGet', type:'get'},
	    {file:'./need', path:'/process/need', method:'needPost', type:'post'},
	    // {file:'./user', path:'/process/board', method:'boardGet', type:'get'},
	    // {file:'./user', path:'/process/board', method:'boardPost', type:'post'},
	    // {file:'./user', path:'/process/chat', method:'chatGet', type:'get'},
	    // {file:'./user', path:'/process/chat', method:'chatPost', type:'post'},
	    // {file:'./user', path:'/process/event', method:'eventGet', type:'get'},
	    // {file:'./user', path:'/process/event', method:'eventPost', type:'post'},
	    // {file:'./user', path:'/process/user', method:'userGet', type:'get'},
	    // {file:'./user', path:'/process/user', method:'userPost', type:'post'}
	]
}