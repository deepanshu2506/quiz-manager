import React from "react";
// import { useParams } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { apiHost } from "../../config";
import axios from "axios";

import "./style.css";

class QuizPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.generateAnswers = this.generateAnswers.bind(this);
    this.onChangeFile = this.onChangeFile.bind(this);
  }
  async componentDidMount() {
    this.timer = setInterval(async () => {
      let quizData = (
        await axios.get(apiHost + `/quiz/getQuiz/${this.props.match.params.id}`)
      ).data;
      if (!quizData.code) {
        this.setState({ notFound: true });
      }
      quizData = quizData.quizData;
      console.log(quizData);
      this.setState({
        quizName: quizData.quizName,
        numberOfQuestions: quizData.numberOfQuestions,
        answers: quizData.answers,
      });
    }, 10000);
  }

  componentWillUnmount() {
    this.timer = null;
  }
  async onChangeFile(event) {
    const file = event.target.files[0];
    const index = event.target.getAttribute("questionNumber");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("questionNumber", parseInt(index) + 1);
    console.log(index);

    const response = await axios.post(
      apiHost + `/quiz/addAnswer/${this.props.match.params.id}`,
      formData
    );
    let { answers } = this.state;
    if (!answers.index) {
      answers[index] = {};
    }
    answers[index].path = response.data.path;
    this.setState({ answers });
    console.log(response.data);
  }

  generateAnswers() {
    const { answers, numberOfQuestions } = this.state;
    let tablerows = [];
    for (let i = 0; i < numberOfQuestions; i++) {
      //   console.log(answers[i]);
      tablerows.push(
        <tr key={i}>
          <td>{i + 1}</td>
          <td>
            {answers[i] ? (
              <div>
                <img src={answers[i].path} />
                <input
                  questionNumber={i}
                  type="File"
                  ref={(el) => (this[`${i}upload`] = el)}
                  onChange={this.onChangeFile}
                  // hidden
                />
              </div>
            ) : (
              <input
                questionNumber={i}
                type="File"
                ref={(el) => (this[`${i}upload`] = el)}
                onChange={this.onChangeFile}
                // hidden
              />
            )}
          </td>
        </tr>
      );
    }
    return tablerows;
  }
  render() {
    if (this.state.notFound) return <Redirect to="/notFound"></Redirect>;
    return (
      <div>
        <h1>{this.state.quizName}</h1>
        <table>
          <thead>
            <tr>
              <td>S No</td>
              <td>answer</td>
            </tr>
          </thead>
          {this.generateAnswers()}
        </table>
      </div>
    );
  }
}

export default QuizPage;
