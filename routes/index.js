var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/api/login', function(req, res, next) {
  if (req.body.username === "admin" && req.body.password == "adminpassword") {
    var user = {
      user: "admin",
      email: 'admin@example.com',
      role: 1
    };

    var token = jwt.sign(user, req.app.get('secret'));

    res.json({
      token:token,
      success: true
    });
  }
  else {
    res.json({
      success: false
    });
  }
});

router.use(function (req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, req.app.get('secret'), function(err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: 'Failed to authenticate token'
        });
      }
      else {
          req.decoded = decoded;
          next();
      }
    });
  }
  else {
    res.status(403).json({
      success: false,
      message: 'No token provided'
    });
  }
});

router.get('/api/users', function (req, res, next) {
  res.json({
    users : [
        {username: "admin", email: "admin@example.com"},
        {username: "Joe", email: "Joe@example.com"}
    ]
  });
});

module.exports = router;
