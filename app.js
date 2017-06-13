/*jshint esversion: 6 */
/**
 * 모듈화된 Default 프로젝트
 * 
 * 데이터베이스와 라우팅 함수들을 모듈로 분리한 기본 프로젝트
 * 뷰 템플릿이나 패스포트를 사용하지 않는 경우 디폴트로 사용하는 프로젝트임
 *
 * @date 2016-11-10
 * @author Mike
 */
 

// Express 기본 모듈 불러오기
const express = require('express')
  , http = require('http')
  , path = require('path');

// Express의 미들웨어 불러오기
const bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , static = require('serve-static')
  , errorHandler = require('errorhandler');
const passport = require('passport');
// 에러 핸들러 모듈 사용
const expressErrorHandler = require('express-error-handler');

//mongoose 모듈 사용
const mongoose = require('mongoose');

// Session 미들웨어 불러오기
const expressSession = require('express-session');

const config = require('./config');
const database = require('./database/database');
const item_router = require('./routes/item_router');
const need_router = require('./routes/need_router');
const board_router = require('./routes/board_router');

const app = express();

//===== 서버 변수 설정 및 static으로 public 폴더 설정  =====//
console.log('config.server_port : %d', config.server_port);
app.set('port', process.env.PORT || 3000);
 

// body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }));

// body-parser를 이용해 application/json 파싱
app.use(bodyParser.json());

// public 폴더를 static으로 오픈
app.use('/public', static(path.join(__dirname, 'public')));
 
// cookie-parser 설정
app.use(cookieParser());
// 세션 설정
app.use(expressSession({
	key:'sid',
	secret:'secret',
	resave:true,
	saveUninitialized:true,
	cookie:{
		maxAge: 1000*60*60
	}
}));


app.set('jwt-secret', config.secret);

app.use(item_router);
app.use(need_router);
app.use(board_router);

app.use( expressErrorHandler.httpError(404) );
app.use( errorHandler );


//===== 서버 시작 =====//

//확인되지 않은 예외 처리 - 서버 프로세스 종료하지 않고 유지함
process.on('uncaughtException', function (err) {
	console.log('uncaughtException 발생함 : ' + err);
	console.log('서버 프로세스 종료하지 않고 유지함.');
	console.log(err.stack);
});

app.on('close', function () {
	console.log("Express 서버 객체가 종료됩니다.");
	//if (database.db) {
	//	database.db.close();
	//}
});


//여기까지 오면 -에러
app.use(function(req, res, next){
	res.sendStatus(404);
});

app.use(function(err, req, res, next){
	res.status(500).send({mag: err.message});
});

// 시작된 서버 객체를 리턴받도록 합니다. // Express 서버 시작
const server = http.createServer(app).listen(app.get('port'), function(){
	console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));

    // 데이터베이스 초기화
    //database.init(app, config);
});
