/*jshint esversion: 6 */
const async = require('async');
const fs = require('fs');
const assert = require('assert');
const easyimg = require('easyimage');
const multer = require('multer');
const pathUtil = require('path');
const express = require('express');
const config = require('../config.js');
// AWS 설정
const AWS = require('aws-sdk');
var uploadDir = __dirname + '/upload';
var thumbnailDir = __dirname + '/thumbnail';
AWS.config.region = config.region;
AWS.config.accessKeyId = config.accessKeyId;
AWS.config.secretAccessKey = config.secretAccessKey;

// AWS S3 서비스
const s3 = new AWS.S3();
var bucketName = config.bucketName;

if (!fs.existsSync(uploadDir)) {
    console.error('upload 폴더 없음!');
    process.exit();
}
if (!fs.existsSync(thumbnailDir)) {
    console.log('thumbnail 폴더 없음!');
    process.exit();
}



class awsimage{}
awsimage.getItemKey = function(originName) {
    // 확장자 얻기
    const extname = pathUtil.extname(originName);

    const now = new Date(); // 날짜를 이용한 파일 이름 생성
    const itemKey = 'file_' + now.getYear() + now.getMonth() + now.getDay() + now.getHours() + now.getMinutes() + now.getSeconds() + Math.floor(Math.random()*1000) + extname;
    return itemKey;
}

awsimage.uploadImage = async function(req, res){
    console.log('uploadImage 함수 호출');
    // 제목(title)과 파일(image) 전송
    const title = req.body.title;
    const fileInfo = req.file;

    console.log(fileInfo);

    if ( !fileInfo ) {
        return res.status(400);
    }

    try {
        // 데이터베이스에 저장될 데이터
        var record = {title:title};

        const fileName = awsimage.getItemKey(fileInfo.originalname);
        // S3에서 사용할 itemKey
        const itemKey = 'image/' + fileName;

        // S3로 이미지 업로드
        const fileUploadResult = await uploadToS3(itemKey, fileInfo.path, fileInfo.mimetype);
        record.url = fileUploadResult.url;

        // 썸네일 만들기
        const thumbnailPath = 'thumbnail/' + fileName
        const thumbnail = await easyimg.rescrop({
            src:fileInfo.path,
            dst:thumbnailPath,
            width:100, height:100
        });

        // 쎔네일 올리기
        const thumbnailKey = 'thumbnail/' + fileName;
        const thumbnailUploadResult = await uploadToS3(thumbnailKey, thumbnailPath, fileInfo
            .mimetype);

        // 썸네일 정보 데이터베이스 저장
        record.thumbnail = thumbnailUploadResult.url;

        // 이미지 경로 데이터베이스 저장(배열로 대신)
        data.push(record);

        // TODO : 파일 삭제 오류가 발생했다고 업로드 요청을 에러로 처리할 필요는 없다. - 일괄 삭제도 고려.
        // 원본 이미지와 썸네일 이미지 삭제
        fs.unlinkSync(fileInfo.path);
        fs.unlinkSync(thumbnailPath);

        res.send({msg:'OK', result:record});
    }
    catch ( error ) {
        console.log(error);
        res.status(400).send('Error');
    }
}

// 이미지를 S3로 업로드
function uploadToS3(itemKey, path, mimetype) {
    return new Promise( (resolve, reject) => {
        const params = {
            Bucket: bucketName,  // 필수
            Key: itemKey,			// 필수
            ACL: 'public-read',
            Body: fs.createReadStream(path),
            ContentType: mimetype
        }

        s3.putObject(params, (err, data) => {
            if ( err ) {
                reject(err);
            }
            else {
                const imageUrl = s3.endpoint.href + bucketName + '/' + itemKey;
                resolve({url:imageUrl});
            }
        });
    });
}

/*
awsimage.uploadImage = (req, res)=>{
    async.waterfall(
        [
            function (callback) {
                var form = new formidable.IncomingForm();
                form.encoding = 'utf-8';
                form.uploadDir = uploadDir;
                form.keepExtensions = true;
                form.parse(req, function (err, fields, files) {
                    if (err) {
                        return callback(err, null);
                    }

                    var title = fields.title;
                    // 임시 폴더로 업로드된 파일
                    var file = files.file;
                    callback(null, title, file);
                });
            },
            function (title, file, callback) {
                // 새로운 이미지 파일 이름 생성
                var randomStr = randomstring.generate(10); // 10자리 랜덤
                var newFileName = 'image_' + randomStr;
                var extname = pathUtil.extname(file.name); // 확장자
                var contentType = file.type;

                var readStream = fs.createReadStream(file.path);

                // 버킷 내 객체 키 생성
                var itemKey = 'poster/' + newFileName + extname;

                var params = {
                    Bucket: bucketName,     // 필수
                    Key: itemKey,				// 필수
                    ACL: 'public-read',
                    Body: readStream,
                    ContentType: contentType
                }

                s3.putObject(params, function (err, data) {
                    if (err) {
                        console.error('S3 PutObject Error', err);
                        callback(err);
                    }
                    else {
                        // 접근 경로 - 2가지 방법
                        var imageUrl = s3.endpoint.href + bucketName + '/' + itemKey;
                        var imageSignedUrl = s3.getSignedUrl('getObject', { Bucket: bucketName, Key: itemKey });
                        callback(null, title, imageUrl);
                    }
                });
            },
            function (title, url, callback) {
                var info = {
                    title: title,
                    image: url
                }
                resources.push(info);
                callback();
            }
        ],
        function (err) {
            if (err) {
                res.sendStatus(500);
            }
            else {
                res.redirect('./');
            }
        });
}

awsimage.showImages = (req, res)=>{
    var body = '<html><body>';

    body += '<h3>File List</h3>';
    body += '<ul>';
    for (var i = 0; i < resources.length; i++) {
        var item = resources[i];
        body += '<li>' + '<img src="' + item.image + '" height="100">' + item.title + '</li>';
    }
    body += '</ul>';
    body += '<form method="post" action="/" enctype="multipart/form-data">';
    body += '<input type="text" name="title"><li>';
    body += '<input type="file" name="file"><li>';
    body += '<input type="submit" value="Uplaod"><li>';
    body += '</form>';

    res.send(body);
}
*/
module.exports = awsimage;