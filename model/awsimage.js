/*jshint esversion: 6 */

const AWS = require('aws-sdk');
const async = require('async');
const fs = require('fs');
const assert = require('assert');
const easyimg = require('easyimage');
var uploadDir = __dirname + '/upload';

if (!fs.existsSync(uploadDir)) {
    console.error('upload, thumbnail 폴더 없음!');
    process.exit();
}

const config = require('../config.js');
AWS.config.region = config.region;
AWS.config.accessKeyId = config.accessKeyId;
AWS.config.secretAccessKey = config.secretAccessKey;
