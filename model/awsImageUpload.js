/*jshint esversion: 6 */
const s3Util = require('../module/s3uploadModule');
const pathUtil = require('path');
const async = require('async');
// uploadSingle();
class awsImageUpload{
}


awsImageUpload.upload = async (files ,pool, cb)=>{
    try {
        let r1 = await awsImageUpload.uploadMulti(files, (err, resuslt)=>{
            if(err){return cb(err,null)}
            console.log(result);
            return cb(null, result);
        });
        //result로 이미지 URL전달해줘야함
    } catch (error) {
        console.log('Task Failure', error);
        throw error;
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
            thumbnailKey: 'thumbnail/' + fileInfo[i].filename
        };
        s3Util.uploadImage(fileInfo[i], s3Param, (err, result)=>{
            if(err){return err;}
            console.log('성공');
            console.dir(result);
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
