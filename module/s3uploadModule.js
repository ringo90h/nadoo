/*jshint esversion: 6 */
const AWS = require('aws-sdk');
const async = require('async');
const fs = require('fs');
const assert = require('assert');
const easyimg = require('easyimage');

const config = require('../config.js');
AWS.config.region = config.region;
AWS.config.accessKeyId = config.accessKeyId;
AWS.config.secretAccessKey = config.secretAccessKey;

const s3 = new AWS.S3();

// 버킷 이름
const bucketName = config.bucketName;
const thumbnailPath = './thumbnail/';

function createThumbnail(imagePath, thumbnailPath, cb) {
    easyimg.rescrop({
        src:imagePath, dst:thumbnailPath,
        width:500, height:500,
        cropwidth:128, cropheight:128,
        x:0, y:0
    }).then(
        function(image) {
            console.log('Resized and cropped: ' + image.width + ' x ' + image.height);
            return cb(null, 'success');
        },
        function (err) {
            console.log(err);
        }
    );
}

// 파일 업로드
AWS.S3.prototype.uploadFile = function (filePath, contentType, itemKey, callback) {
    var params = {
        Bucket: bucketName,  // 필수
        Key: itemKey,			// 필수
        ACL: 'public-read',
        Body: fs.createReadStream(filePath),
        ContentType: contentType
    }
    this.putObject(params, function(err, data){
        if (err) {
            console.error('S3 PutObject Error', err);
            return callback(err);
        }
        // 접근 경로 - 2가지 방법
        var imageUrl = s3.endpoint.href + bucketName + '/' + itemKey; // http, https
        console.log(data);
        return callback(null, imageUrl);
    });
}


AWS.S3.prototype.uploadImage = function (fileInfo, uploadInfo, callback) {
    console.log('S3 uploadImage 메소드 실행');
    console.dir(uploadInfo);
    // filePath, contentType, itemKey
    if (!fileInfo.path || !uploadInfo || !callback) {
        assert(false, 'check parameter!');
    }

    if (!fileInfo.contentType) {
        fileInfo.contentType = 'image/jpg';
    }


    // 최종 결과용
    var uploadResult = {};

    // 삭제할 파일 경로 저장
    var pathForDelete = [];
    var filePathOriginal = './model/image/'
    var thumbnailPath = './model/'+uploadInfo.thumbnailKey;
    var thumbnailUploadPath = 'model/'+uploadInfo.thumbnailKey;
    console.log('fileinfo.filePath : '+filePathOriginal);

    async.waterfall([
        // 원본 이미지 업로드
        (taskDone) => {
            //업로드할 파일패스, 콘텐츠, 업로드할이름
            console.dir(fileInfo);
            this.uploadFile(fileInfo.path, fileInfo.mimetype, uploadInfo.itemKey, (err, result) => {
                if (err) {
                    console.error('S3 image fail :', err);
                    return taskDone(err);
                }
                // 삭제할 이미지 경로 저장
                pathForDelete.push(fileInfo.path);
                console.log('이미지 업로드 성공:', result);
                // 결과용 객체에 이미지 경로 저장
                uploadResult.imageUrl = result;
                taskDone(null);
            });
        },
        // 썸네일 생성/업로드
        (taskDone) => {
            // thumbnailKey 정보가 없으면 썸네일 생성/업로드 안함
            if (!uploadInfo.thumbnailKey) {
                taskDone(null);
            }

            // 썸네일 경로
            //변경할이미지, 올릴이미지
            console.log(thumbnailPath);
            createThumbnail(fileInfo.path, thumbnailPath, (err, result) => {
                // 썸네일 생성 실패 - 원본 이미지 사용
                if (err) {
                    console.log('thumbnail 생성 실패 :', err);
                    // 썸네일 생성 실패 - 이미지 업로드 전체를 멈추지 않는다.
                    return taskDone(null, false);
                }

                console.log('thumbnail 생성 성공 :', result);
                // 썸네일 업로드
                    taskDone(null);
                });

        },
        (taskDone) => {
            // thumbnailKey 정보가 없으면 썸네일 생성/업로드 안함
                this.uploadFile(thumbnailUploadPath, fileInfo.mimetype, uploadInfo.thumbnailKey, (err, result) => {
                    if (err) {
                        console.log('thumbanil 업로드 실패', err);
                        // 썸네일 업로드 실패하더라도 이미지 업로드를 중단하지 않는다. 원본 이미지를 썸네일로 사용.
                        return taskDone(null);
                    }
                    console.log('thumbnail 업로드 성공 :', result);

                    // 파일 삭제 태스크를 위한 경로 저장
                    pathForDelete.push(thumbnailUploadPath);

                    // 결과용 객체에 이미지 경로 저장
                    uploadResult.thumbnailUrl = result;

                    taskDone(null);
                });
        },
        (taskDone) => {
            try {
                console.log('삭제목록');
                console.dir(pathForDelete);
                for(var i = 0 ; i < pathForDelete.length ; i++) {
                    const path = pathForDelete[i];
                    console.log('삭제요청패스:')
                    console.dir(path);
                    fs.unlinkSync(path);
                }
                console.log('파일 삭제 성공');
            }
            catch ( error ) {
                console.log('파일 삭제 에러 :', error);
            }

            taskDone(null);
        }
    ], (err) => {
        if (err) {
            return callback(err);
        }
        console.log('uploadResult:')
        console.dir(uploadResult);
        callback(null, uploadResult);
    });
}


module.exports = s3;