var express = require('express');
var ObjectID = require('mongodb').ObjectID;
var router = express.Router();

// GET purchase order information
router.get('/:poID', function(req, res, next) {
  var db = req.db;
  db.get('purchaseOrders').find({"_id": ObjectID(req.params.poID)}, {},
    function (e, docs) {
      res.json(docs);
    });
});

router.get('/:poID/author', function(req, res, next) {
  var db = req.db;
  db.get('purchaseOrders').find({'_id': ObjectID(req.params.poID)}, {},
    function (e, docs) {
      var authorID = docs[0].authorID;
      //res.json(docs.authorID);
      db.get('users').find({"_id": ObjectID(authorID)}, {},
        function (e, docs) {
          res.json(docs);
        });
    });
})

// GET list of items for a given PO
router.get('/:poID/items', function(req, res, next) {
  var db = req.db;
  db.get('items').find({'poID': ObjectID(req.params.poID)},
    {'sort': {'_id': 1}},
    function (e, docs) {
      res.json(docs);
    });
});

// Update the "lastModified" field of a given PO to the current time
function updateLastModified(db, poID) {
  db.update({"_id": ObjectID(poID)},
    {"lastModified": Math.floor(Date.now() / 1000)});
}

module.exports = router;
