var express = require('express');
var ObjectID = require('mongodb').ObjectID;
var router = express.Router();

// GET list of all companies
router.get('/', function (req, res, next) {
  var db = req.db;
  db.get('companies').find({}, {'sort': {'companyName': 1}},
    function (e, docs) {
      res.json(docs);
    })
});

/* GET company details. */
router.get('/:companyID', function(req, res, next) {
  var db = req.db;
  var user = db.get('companies').find({"_id": ObjectID(req.params.companyID)}, {},
    function (e, docs) {
      res.json(docs);
    });
});

module.exports = router;
