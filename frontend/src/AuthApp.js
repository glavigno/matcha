// Libraries
import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Import components and css
import "./App.css";
import AuthNav from "./components/Navbar/AuthNav";
import Home from "./components/Misc/Home";
import Profiles from "./components/Profiles/Profiles";
import ProfilePage from "./components/Profiles/ProfilePage";
import ErrorPage from "./components/Misc/ErrorPage";
import Forgot from "./components/Security/Forgot";
import Reset from "./components/Security/Reset";
import Settings from "./components/Settings/Settings";
import Matcher from "./components/Matcher/Matcher";
import ChatMain from "./components/Chat/ChatMain";
import Notifications from "./components/Notifications/Notifications";
import Security from "./components/Security/Security";
import Authentication from "./components/Authentication/Authentication";
import Footer from "./components/Misc/Footer";
import AuthContext from "./components/context/authContext";

export default () => {
  const context = useContext(AuthContext);
  return (
    <Router>
      <AuthNav />
      <main>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/authentication/:key" component={Authentication} />
          <Route exact path="/chat" component={ChatMain} />
          <Route exact path="/security" component={Security} />
          <Route path="/security/forgot" component={Forgot} />
          <Route path="/security/reset/:key" component={Reset} />
          <Route exact path="/notifications" component={Notifications} />
          <Route exact path="/profiles" component={Profiles} />
          <Route exact path="/profiles/matcher" component={Matcher} />
          <Route path="/profiles/:id" component={ProfilePage} />
          <Route exact path="/settings" component={Settings} />
          <Route component={ErrorPage} />
        </Switch>
      </main>
      {context.user && <Footer />}
    </Router>
  );
};
