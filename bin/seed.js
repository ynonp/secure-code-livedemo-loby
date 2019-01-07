const mongoose = require('mongoose');
const User = require('../models/user.js');
const Item = require('../models/item.js');

async function main() {
  await mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true });

  await User.deleteMany({});
  await Item.deleteMany({});

  const u = await User.create({ email: 'ynonperek@gmail.com', password: '102030', credits: 10 });
  await Item.create({
    name: 'stuff',
    description: 'cool stuff',
    image_file_name: null,
    owner: u,
    price: 8,
  });

  mongoose.disconnect();
}


main();

