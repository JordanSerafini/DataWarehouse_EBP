const bcrypt = require('bcrypt');

async function hashPassword() {
  const password = 'pass123';
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  console.log(`Password: ${password}`);
  console.log(`Hash: ${hash}`);
}

hashPassword();
