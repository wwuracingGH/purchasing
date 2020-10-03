var express = require('express');
var ObjectID = require('mongodb').ObjectID;
var router = express.Router();

/* GET a list of systems for a given year. */
router.get('/:yearID/systems', function(req, res) {
  var db = req.db;
  var systems = db.get('systems').find({"yearID": ObjectID(req.params.yearID)},
    {"sort": {"systemName": 1}},
    function(e, docs) {
      res.json(docs);
    });
});

module.exports = router;
