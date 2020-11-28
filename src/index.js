import React from "react";
import App from "./components/app.jsx";
import Redirect from "./components/redirect.jsx";
import Edit from "./components/edit.jsx";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { render } from "@testing-library/react";

render(
  <Router>
    <Switch>
      <Route exact path={"/"} component={App} />
      <Route exact path={"/url/:urlEnd?"} component={Redirect} />
      <Route exact path={"/url/:urlEnd?/edit"} component={Edit} />
      <Route render={() => <h1>Not found!</h1>} />
    </Switch>
  </Router>,
  document.getElementById("root")
);
