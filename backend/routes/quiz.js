const router = require("express").Router();
const fileUpload = require("express-fileupload");
const fs = require("fs");

const Quiz = require("../models/quiz");
// const AWS = require("aws-sdk");

router.use(fileUpload());
const { host, staticHost } = require("../config");

router.get("/getQuizes", async (req, res) => {
  res.send({
    code: 1,
    data: await Quiz.find({ deleted: false }),
  });
});

router.post("/addQuiz", async (req, res) => {
  console.log(req.body);
  const { quizName, numberOfQuestions } = req.body;
  const newQuiz = new Quiz({
    quizName,
    numberOfQuestions,
    createdAt: new Date(),
  });

  const quizData = await newQuiz.save();
  res.send({ code: 1, quizData, link: `${staticHost}/${quizData._id}` });
});

router.get("/getQuiz/:id", async (req, res) => {
  const { id } = req.params;
  const quizData = await Quiz.findById(id);
  if (quizData) {
    res.send({ code: 1, quizData });
  } else {
    res.send({ code: 0, message: "quiz Does Not Exist" });
  }
});

router.post("/addAnswer/:id", async (req, res) => {
  console.log(req.body);
  const quizId = req.params.id;
  const questionNumber = req.body.questionNumber;
  const file = req.files.file;
  const currQuiz = await Quiz.findById(quizId);

  if (!fs.existsSync(__dirname + "/../uploads/" + quizId)) {
    fs.mkdirSync(__dirname + "/../uploads/" + quizId);
  }
  const relpath = "uploads/" + quizId + "/" + file.name;
  console.log(file.mv);
  file.mv(relpath, async function (err) {
    console.log("heyy");
    console.log(err);
    if (err) {
      res.send({ code: 0, message: "error in uploading file" });
    }
    const path = `${host}${quizId}/${file.name}`;
    let answers = undefined;
    if (!currQuiz.answers) {
      answers = new Array();
    } else {
      answers = currQuiz.answers;
    }
    console.log(questionNumber);
    answers[questionNumber - 1] = { path };
    console.log(answers);
    const abc = await Quiz.update({ _id: quizId }, { $set: { answers } });
    // console.log(abc);

    res.send({ code: 0, path });
  });
});

module.exports = router;
