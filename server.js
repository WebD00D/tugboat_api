var express = require("express");
var bodyParser = require("body-parser");
var braintree = require("braintree");
var app = express();


//Force https in production
// if (process.env.NODE_ENV === "production") {
//   app.use(function(req, res, next) {
//     if (req.headers["x-forwarded-proto"] !== "https") {
//       return res.redirect(["https://", req.get("Host"), req.url].join(""));
//     }
//     return next();
//   });
// }

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS Middleware
app.use(function(req, res, next) {
  // Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST, PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization"
  );
  next();
});


// EMAIL 

app.get("/send-welcome-email", function(request, res) {
  var email = request.query.email;
  var postmark = require("postmark");
  var client = new postmark.Client("1532bacc-1b9b-4ad8-afd3-d3e0c47808de");

  client.sendEmailWithTemplate({
    From: "christian@rollingyouth.com",
    TemplateId: 4734761,
    To: email,
    TemplateModel: {
      Property1: 1
    }
  });
  res.end("sent!");
});

app.get("/payment", function(request, res) {
  
  var token = request.query.token;
  var amount = request.query.amount;

  var stripe = require("stripe")("sk_test_4MuZIolX5qj3NvpbYhCkWzfC");

  console.log("TOKEN", token, "AMOUNT", amount)

  stripe.charges
      .create({
        amount: amount,
        currency: "usd",
        description: "Tugboat Top-up",
        source: token
      })
      .then(function(charge) {
        console.log(charge);
        res.json(charge);
      })
      .catch(function(err) {
        console.log("caught an error", err);
        res.json("payment error");
      });
    
});


app.listen(process.env.PORT || 8091, function() {
  console.log("Listening on port 8091!");
});
