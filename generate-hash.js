const bcrypt = require('bcryptjs');

const password = 'ADMIN_12345';
const salt = bcrypt.genSaltSync();
const hash = bcrypt.hashSync(password, salt);

console.log('Password:', password);
console.log('Hash:', hash);
