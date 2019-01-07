const router = require('express').Router();
const Item = require('../models/item');

// Show all items
router.get('/', async function(req, res, next) {
  const items = await Item.find({}).populate('owner');
  console.log('items = ');
  console.log(items);
  res.render('items/index', { items: items });
});

// New item form
router.get('/new', function(req, res, next) {
  res.render('items/new', { item: new Item() });
});

// Publish a new item
router.post('/', async function(req, res, next) {
  const item = new Item(req.body);
  await item.save();
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
