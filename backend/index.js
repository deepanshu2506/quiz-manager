const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const User = require("./models/users");

const quizRoutes = require("./routes/quiz");

const _ = require("lodash");

app = express();

app.use(require("cors")());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(
  "mongodb+srv://quiz:quiz123@cluster0-t1t7l.mongodb.net/quiz",
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err, db) {
    if (err) {
      throw err;
    }
    console.log("connected to db");
  }
);
app.use(express.static("uploads"));

app.post("/auth/login", (req, res) => {
  const { userName, password } = req.body;
  const currentUser = User.findOne({ userName });

  if (currentUser) {
    if (currentUser.password == password) {
      res.send({ code: 1, message: "auth success" });
    } else {
      res.send({ code: 0, message: "invalid password" });
    }
  } else {
    res.send({ code: 0, message: "invalid username" });
  }
});

app.use("/quiz", quizRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log("quiz API running");
});
