var express = require("express");
var bodyParser = require("body-parser");
require("es6-promise").polyfill();
require("isomorphic-fetch");
var port = 3001;

// Configure app to use bodyParser to parse json data
var app = express();
var server = require("http").createServer(app);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

// Test server is working (GET http://localhost:3001/api)
app.get("/api/", function(req, res) {
  res.json({ message: "Hi, welcome to the server api!" });
});

// Following is an example to proxy client request to DarkSky forecast API
var DARKSKY_SECRET_KEY = "00c8495a0621035fda85687bf130fd92";
var url_prefix =
  "https://api.darksky.net/forecast/" +
  DARKSKY_SECRET_KEY +
  "/1.3521,103.8198,";
app.get("/api/darksky", function(req, res) {
  try {
    // Retrieves location coordinates (latitude and longitude) from client request query
    var time = req.query.time;
    var url = url_prefix + time + "?units=si";
    console.log("Fetching " + url);

    fetch(url)
      .then(function(response) {
        if (response.status != 200) {
          res
            .status(response.status)
            .json({ message: "Bad response from Dark Sky server" });
        }
        return response.json();
      })
      .then(function(payload) {
        res.status(200).json(payload);
      });
  } catch (err) {
    console.log("Errors occurs requesting Dark Sky API", err);
    res
      .status(500)
      .json({ message: "Errors occurs requesting Dark Sky API", details: err });
  }
});

// Start the server
server.listen(port);
console.log("Server is listening on port " + port);
