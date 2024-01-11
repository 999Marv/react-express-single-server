const bcrypt = require('bcrypt');

const main = async () => {
  //current password
  const password = 'chuchutrain';

  //randomizer
  //not needed
  const salt = await bcrypt.genSalt(10);

  //encrypt my current password with salt
  //not needed
  const saltHash = await bcrypt.hash(password, salt);

  //encrypt with just 10
  const hash = await bcrypt.hash(password, 10);

  //compare if my password = encrypted password
  const match = await bcrypt.compare(password, hash);
  console.log(match);
};

main();
