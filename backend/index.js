const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const User = require("./models/users");

const quizRoutes = require("./routes/quiz");

const _ = require("lodash");

app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});
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

app.get("/", (req, res) => {
  res.send("heyyy");
});

app.post("/auth/login", async (req, res) => {
  const { userName, password } = req.body;
  console.log(userName);
  const currentUser = await User.findOne({ userName: userName });

  console.log(currentUser);
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
