import React from "react";
import logo from "./logo.svg";
import "./App.css";

import { Switch, Route } from "react-router-dom";
import Login from "./components/Login/login";
import QuizPage from "./components/QuizPage/QuizPage";
function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/quiz/:id" component={QuizPage} />
        <Route exact path="/notFound">
          <h1>Quiz not found</h1>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
