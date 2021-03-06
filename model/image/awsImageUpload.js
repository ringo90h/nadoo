/*jshint esversion: 6 */
const s3Util = require('./s3uploadModule');
const pathUtil = require('path');
const async = require('async');
// uploadSingle();
class awsImageUpload{
}

awsImageUpload.upload = (files, cb)=>{
    console.log('upload 함수 실행 ');
    console.dir(files);
    if(files.length == 0) {
        return cb(null, {});
    }else{
            awsImageUpload.uploadMulti(files, (err, result)=>{
            if(err){return cb(err,null)}
            console.log('끝이보인다');
            console.dir(result);
            return cb(null, result);
        });
    }
}

awsImageUpload.uploadMulti = (fileInfo, callback)=> {
    console.log('uploadmulti 함수 실행 ');
    console.log('파일 [0] 경로:'+fileInfo[0].filename +'파일 [0] 타입 :' + fileInfo[0].mimetype);
    const files = [];
    for(var i=0;i<fileInfo.length;i++){
        files.push({filePath : fileInfo[i].filename, contentType : fileInfo[i].mimetype});
        var s3Param = {
            itemKey: 'image/' + fileInfo[i].filename,
            thumbnailKey: 'thumbnail/thumb' + fileInfo[i].filename
        };
        s3Util.uploadImage(fileInfo[i], s3Param, (err, result)=>{
            if(err){return err;}
            console.log('성공공');
            console.dir(result);
            callback(null, result);
        });
    }


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
