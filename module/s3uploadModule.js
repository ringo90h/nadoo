/*jshint esversion: 6 */
const AWS = require('aws-sdk');
const async = require('async');
const fs = require('fs');
const assert = require('assert');
const thumb = require('node-thumbnail').thumb;

const config = require('../config.js');
AWS.config.region = config.region;
AWS.config.accessKeyId = config.accessKeyId;
AWS.config.secretAccessKey = config.secretAccessKey;

const s3 = new AWS.S3();

// 버킷 이름
const bucketName = config.bucketName;
const thumbnailPath = './thumbnail/';

function createThumbnail(imagePath, thumbnailPath, callback) {
    thumb({
        source: imagePath, // could be a filename: dest/path/image.jpg
        destination: thumbnailPath,
        concurrency: 4,
        prefix: '',
        suffix: '_thumb',
        digest: false,
        hashingType: 'sha1', // 'sha1', 'md5', 'sha256', 'sha512'
        width: 100,
        quiet: false, // if set to 'true', console.log status messages will be supressed
        overwrite: false,
        basename: undefined, // basename of the thumbnail. If unset, the name of the source file is used as basename.
        ignore: false, // Ignore unsupported files in "dest"
        logger: function(message) {
            console.log(message);
        }
    }, function(files, err, stdout, stderr) {
        if(err){callback(err);}
        console.log('All done!');
    });
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
    console.dir(params);

    this.putObject(params, function (err, data) {
        if (err) {
            console.error('S3 PutObject Error', err);
            return callback(err);
        }
        // 접근 경로 - 2가지 방법
        var imageUrl = s3.endpoint.href + bucketName + '/' + itemKey; // http, https
        console.log(data);
        callback(null, imageUrl);
    });
}


AWS.S3.prototype.uploadImage = function (fileInfo, uploadInfo, callback) {
    console.log('uploadImage 메소드 실행');
    // filePath, contentType, itemKey
    if (!fileInfo.filePath || !uploadInfo || !callback) {
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
    console.log('fileinfo.filePath : '+filePathOriginal);
    async.waterfall([
        // 원본 이미지 업로드
        (taskDone) => {
            //업로드할 파일패스, 콘텐츠, 업로드할이름
            this.uploadFile(filePathOriginal, fileInfo.contentType, uploadInfo.itemKey, (err, result) => {
                if (err) {
                    console.error('S3 image fail :', err);
                    return taskDone(err);
                }
                // 삭제할 이미지 경로 저장
                pathForDelete.push(filePathOriginal);
                console.log('이미지 업로드 성공 :', result);
                // 결과용 객체에 이미지 경로 저장
                uploadResult.imageUrl = result;
                //todo: DB result에 저장하기
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
            createThumbnail(filePathOriginal, thumbnailPath, (err, result) => {
                // 썸네일 생성 실패 - 원본 이미지 사용
                if (err) {
                    console.log('thumbnail 생성 실패 :', err);
                    // 썸네일 생성 실패 - 이미지 업로드 전체를 멈추지 않는다.
                    return taskDone(null, false);
                }

                // 썸네일 업로드
                this.uploadFile(thumbnailPath, fileInfo.contentType, uploadInfo.thumbnailKey, (err, result) => {
                    if (err) {
                        console.log('thumbanil 업로드 실패', err);
                        // 썸네일 업로드 실패하더라도 이미지 업로드를 중단하지 않는다. 원본 이미지를 썸네일로 사용.
                        return taskDone(null);
                    }
                    console.log('thumbnail 업로드 성공 :', result);

                    // 파일 삭제 태스크를 위한 경로 저장
                    pathForDelete.push(thumbnailPath);

                    // 결과용 객체에 이미지 경로 저장
                    uploadResult.thumbnailUrl = result;

                    taskDone(null);
                });
            });
        }/*,
        // 파일 삭제
        (taskDone) => {
            try {
                for(var i = 0 ; i < pathForDelete.length ; i++) {
                    const path = pathForDelete[i];
                    fs.unlinkSync(path);
                }
                console.log('파일 삭제 성공');
            }
            catch ( error ) {
                console.log('파일 삭제 에러 :', error);
            }

            taskDone(null);
        }*/
    ], (err) => {
        if (err) {
            return callback(err);
        }
        callback(null, uploadResult);
    });
}


module.exports = s3;