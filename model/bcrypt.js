let bcrypt = require('bcrypt');

const saltRounds = 10;
const myPlaintextPassword = '비밀번호';

bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    console.log('해쉬 : ')
    console.dir(hashdata);
});