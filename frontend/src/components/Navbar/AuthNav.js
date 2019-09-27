// Libraries
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";

// // Import assets and css
import logo from "../../assets/static/identity/Logo.png";
import "./Navbar.css";

import AuthContext from "../context/authContext";
import SocketContext from "../context/socketContext";
import Security from "../Security/Security";

import { Icon, Modal, notification } from "antd";

const Navbar = () => {
  const context = useContext(AuthContext);
  const socketContext = useContext(SocketContext);
  const [modal, setModal] = useState(false);

  if (Object.keys(socketContext).length > 0) {
    socketContext.on("profileVisit", data => {
      notification.open({
        message: `${data} just visited your profile`,
        description: `Love has never been so close`
      });
    });
  }

  const handleLogout = () => {
    context.logout();
    fetch("/log/out", { headers: { userid: context.user.id } });
  };

  return (
    <header className="nav">
      <img className="logo" src={logo} alt="logo" />
      <div className="buttons">
        <Icon
          onClick={() => setModal(!modal)}
          type="lock"
          style={{ fontSize: "32px" }}
        />
        <Modal
          centered={true}
          closable={false}
          visible={modal}
          onCancel={() => setModal(!modal)}
          footer={[]}
        >
          <Security />
        </Modal>
        <Link to="" className="link">
          <Icon
            onClick={handleLogout}
            type="logout"
            style={{ fontSize: "32px" }}
          />
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
