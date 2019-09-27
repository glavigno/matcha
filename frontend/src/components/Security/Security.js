import React, { useContext, useState } from "react";

import ContactUpdate from "./ContactUpdate";
import PasswordUpdate from "./PasswordUpdate";
import IdentifiersUpdate from "./IdentifiersUpdate";

import "./Security.css";
import { Alert } from "antd";

import AuthContext from "../context/authContext";

let message;
let type;

export default () => {
  const context = useContext(AuthContext);
  const [successBanner, setSuccessBanner] = useState(false);
  const [errorBanner, setErrorBanner] = useState(false);
  const [newInfo, setNewInfo] = useState({
    email: "",
    newPassword: "",
    confirmation: "",
    firstname: "",
    lastname: "",
    login: ""
  });

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Origin": "*"
  };

  const handleChange = e => {
    setNewInfo({ ...newInfo, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setSuccessBanner(false);
    setErrorBanner(false);
  };

  const handlePasswordsSubmit = () => {
    if (newInfo.newPassword !== newInfo.confirmation) {
      message = "Passwords are not matching";
      type = "error";
      setErrorBanner(true);
    } else {
      fetch("/security", {
        headers: headers,
        method: "post",
        body: JSON.stringify({
          id: context.user.id,
          password: newInfo.newPassword
        })
      })
        .then(res => {
          if (res.status === 200) {
            message = "Passwords updated !";
            type = "success";
            setSuccessBanner(true);
            setErrorBanner(false);
          } else {
            console.log("Error - Invalid password format and/or confirmation");
          }
        })
        .catch(e => console.log(e));
    }
  };

  const handleInfoSubmit = () => {
    message = "Info updated!";
    type = "success";
    fetch("/security", {
      headers: headers,
      method: "post",
      body: JSON.stringify({
        id: context.user.id,
        firstname: newInfo.firstname,
        lastname: newInfo.lastname,
        login: newInfo.login
      })
    })
      .then(res => {
        if (res.status === 200) {
          context.update({
            ...context.user,
            firstname: newInfo.firstname,
            lastname: newInfo.lastname,
            login: newInfo.login
          });
          setSuccessBanner(true);
        } else {
          console.log("Error - Invalid fields content");
        }
      })
      .catch(e => console.log(e));
  };

  const handleEmailSubmit = () => {
    message = "Email updated!";
    type = "success";
    fetch("/security", {
      headers: headers,
      method: "post",
      body: JSON.stringify({ id: context.user.id, email: newInfo.email })
    })
      .then(res => {
        if (res.status === 200) {
          context.update({
            ...context.user,
            email: newInfo.email
          });
          setSuccessBanner(true);
        } else {
          console.log("Error - Invalid email address format");
        }
      })
      .catch(e => console.log(e));
  };

  return (
    <div className="security__main">
      {(successBanner || errorBanner) && (
        <Alert
          message={message}
          type={type}
          closable
          afterClose={handleClose}
          showIcon
          className="security__banner"
        />
      )}
      <IdentifiersUpdate
        onInfoChange={handleChange}
        onSubmit={handleInfoSubmit}
      />
      <ContactUpdate onMailChange={handleChange} onSubmit={handleEmailSubmit} />
      <PasswordUpdate
        onPasswordChange={handleChange}
        onSubmit={handlePasswordsSubmit}
      />
    </div>
  );
};
