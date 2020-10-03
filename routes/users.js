var express = require('express');
var ObjectID = require('mongodb').ObjectID;
var router = express.Router();

/* GET user details. */
router.get('/:userID', function(req, res, next) {
  var db = req.db;
  var user = db.get('users')
      .find({"_id": ObjectID(req.params.userID)}, {},
      function(e, docs) {
        res.json(docs);
      });
});

module.exports = router;
