/*jshint esversion: 6 */

// var thumb = require('node-thumbnail').thumb;
//
// thumb({
// source: './iu1.jpg', // could be a filename: dest/path/image.jpg
//     destination: './',
//     concurrency: 4,
//     prefix: '',
//     suffix: '_thumb',
//     digest: false,
//     hashingType: 'sha1', // 'sha1', 'md5', 'sha256', 'sha512'
//     width: 100,
//     heigth: 100,
//     quiet: false, // if set to 'true', console.log status messages will be supressed
//     overwrite: false,
//     basename: undefined, // basename of the thumbnail. If unset, the name of the source file is used as basename.
//     ignore: false, // Ignore unsupported files in "dest"
//     logger: function(message) {
//     console.log(message);
// }
// }, function(files, err, stdout, stderr) {
//     console.log('All done!');
// });

// const Thumbler = require('thumbler');
//
// Thumbler({
//     type: 'image',
//     input: 'image5.jpg',
//     output: 'output.jpeg',
//     size: '400x400' // this optional if null will use the desimention of the video
// }, function(err, path){
//     if (err) return err;
//     return path;
// });

// const fs = require('fs');
// const resizeImg = require('resize-img');
//
// resizeImg(fs.readFileSync('image5.jpg'), {width: 128, height: 128}).then(buf => {
//     fs.writeFileSync('image5-128x128.png', buf);
// });
//
// const sharp = require('sharp');
//
// sharp('image5.jpg')
//     .resize(320, 320)
//     .toFile('output.jpg', (err, info) =>{});
//
// const easyimg = require('easyimage');
//
// easyimg.rescrop({
//     src:'image5.jpg', dst:'./kitten-thumbnail.jpg',
//     width:500, height:500,
//     cropwidth:128, cropheight:128,
//     x:0, y:0
// }).then(
//     function(image) {
//         console.log('Resized and cropped: ' + image.width + ' x ' + image.height);
//     },
//     function (err) {
//         console.log(err);
//     }
// );