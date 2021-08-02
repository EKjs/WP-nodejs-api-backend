import pkg from 'bcryptjs';
const {bcrypt} = pkg;

const salt = await bcrypt.genSalt(10);
console.log(salt);