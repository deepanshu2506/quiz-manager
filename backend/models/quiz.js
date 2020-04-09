const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const quizSchema = new Schema({
  quizName: String,
  numberOfQuestions: Number,
  createdAt: Date,
  answers: [Object],
  deleted: { type: Boolean, default: false },
});

const quiz = mongoose.model("quiz", quizSchema);

module.exports = quiz;
