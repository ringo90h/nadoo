/*jshint esversion: 6 */
const s3Util = require('../module/s3uploadModule');
const pathUtil = require('path');
const async = require('async');
// uploadSingle();
class awsImageUpload{
}

awsImageUpload.uploadMulti = (fileInfo, callback)=> {
    console.log('uploadmulti 함수 실행 ');

    console.log('파일 [0] 경로:'+fileInfo[0].filename +'파일 [0] 타입 :' + fileInfo[0].mimetype);

    const files = [];
    for(var i=0;i<fileInfo.length;i++){
        files.push({filePath : fileInfo[i].filename, contentType : fileInfo[i].mimetype});
    }
    console.log('파일정보 : ');
    console.dir(files);

    async.map(files, (file, callback) => {
        const itemKey = file.filePath;
        const s3param = {
            itemKey : './model/image/' + itemKey,
            thumbnailKey : './model/thumbnail/' + itemKey
        };

        s3Util.uploadImage(file, s3param, (err, result) => {
            if ( err ) {
                return callback(err);
            }
            console.log('이미지 로컬 스토리지 업로드');
            callback(null, result);
        });


    }, (err, results) => {
        if ( err ) {
            console.log('Multifile image error:', err);
        }
        else {
            console.log('Multifile image success :', results);
        }
    });
}

module.exports = awsImageUpload;

/*
 awsImageUpload.createRandomKey = (filePath)=>{
 console.log('랜덤키 생성 메소드 실행');
 console.dir(filePath);
 const extname = pathUtil.extname(filePath); // 확장자
 const now = new Date(); // 날짜를 이용한 파일 이름 생성
 const randomKey = 'image_' + now.getHours() + now.getMinutes() + now.getSeconds() + Math.floor(Math.random()*1000) + extname;
 console.log('랜덤키 생성 결과'+ randomKey);
 return randomKey;
 }*/
