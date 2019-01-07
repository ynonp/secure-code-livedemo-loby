const router = require('express').Router();
const Item = require('../models/item');
const multer  = require('multer')
const mime = require('mime');
const crypto = require('crypto');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/')
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));    
    });
  }
});

const upload = multer({ storage });

// Show all items
router.get('/', async function(req, res, next) {
  const items = await Item.find({}).populate('owner');
  res.render('items/index', { items: items });
});

// New item form
router.get('/new', function(req, res, next) {
  res.render('items/new', { item: new Item() });
});

// Publish a new item
router.post('/', upload.single('image'), async function(req, res, next) {
  const params = Object.assign(
    {},
    req.body,
    { owner: req.user },
    req.file ? { image_file_name: req.file.filename } : { }
  );

  const item = new Item(params);
  try {
    await item.save();
  } catch (err) {
    console.log(err);
    return res.render('items/new', { item: item });
  }
  
  res.redirect("/items");
});

// Buy an item
router.post('/:id', async function(req, res, next) {
  const buyer = req.user;
  if (!buyer) {
    return next('Error - only signed in users can buy items');
  }

  const item = await Item.findById(req.params.id).populate('owner');
  buyer.purchase(item);
  res.redirect('/items');
});

module.exports = router;
