//server.js
"use strict";
// Tutorial: https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4
//first we import our dependencies…
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var User = require("./src/model/User");
var Keys = require("./src/config/keys");
//and create our instances
var app = express();
var router = express.Router();
//set our port to either a predetermined port number if you have set
//it up, or 3001
var PORT = process.env.API_PORT || 5000;
//DB config
mongoose.connect(Keys.mongoURI);

//now we should configure the API to use bodyParser and look for
//JSON data in the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//To prevent errors from Cross Origin Resource Sharing, we will set
//our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  //and remove cacheing so we get the most recent comments
  res.setHeader("Cache-Control", "no-cache");
  next();
});
//now we can set the route path & initialize the API
router.get("/", function(req, res) {
  res.json({ message: "API Initialized!" });
});

router
  .route("/user")
  .get(function(req, res) {
    User.find(function(err, data) {
      if (err) res.send(err);
      //responds with a json object of our database comments.
      res.json(data);
    });
  })
  .post(function(req, res) {
    var user = new User();
    //body parser lets us use the req.body
    user.title = req.body.title;
    user.description = req.body.description;
    user.date = req.body.date;
    user.save(function(err) {
      if (err) res.send(err);
      res.json({ message: "Successfully added!" });
    });
  });
router
  .route("/user/:user_id")
  .get(function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
      if (err) res.send(err);
      res.json(user);
    });
  })
  .delete(function(req, res) {
    User.findOneAndRemove({ _id: req.params.user_id }, function(err, doc) {
      if (err) console.log(err);
      res.json(doc);
    });
  })
  .put(function(req, res) {
    // use our bear model to find the bear we want
    User.findById(req.params.user_id, function(err, user) {
      if (err) res.send(err);

      user.title = req.body.title;
      user.description = req.body.description;
      user.date = req.body.date;

      // save the bear
      user.save(function(err) {
        if (err) res.send(err);
        res.json({ message: "Data updated!" });
      });
    });
  });
//Use our router configuration when we call /api
app.use("/api", router);
//starts the server and listens for requests
app.listen(PORT, function() {
  console.log(`api running on port ${PORT}`);
});
