// Libraries
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Import components and css
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Misc/Home";
import ErrorPage from "./components/Misc/ErrorPage";
import Forgot from "./components/Security/Forgot";
import Reset from "./components/Security/Reset";
import Authentication from "./components/Authentication/Authentication";

export default () => {
  return (
    <Router>
      <Navbar />
      <main>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/authentication/:key" component={Authentication} />
          <Route path="/security/forgot" component={Forgot} />
          <Route path="/security/reset/:key" component={Reset} />
          <Route component={ErrorPage} />
        </Switch>
      </main>
    </Router>
  );
};
