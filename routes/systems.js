var express = require('express');
var ObjectID = require('mongodb').ObjectID;
var router = express.Router();

/* GET users listing. */
router.get('/:systemID/to-be-signed', function(req, res, next) {
  var db = req.db;
  var purchaseOrders = db.get('purchaseOrders')
      .find({"systemID": ObjectID(req.params.systemID), "signerID": ""}, {},
      function (e, docs) {
        res.json(docs);
      });
});

module.exports = router;
