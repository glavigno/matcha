// Libraries
import React, { useState } from "react";
import { Drawer, Icon, Modal, Button } from "antd";

// // Import assets and css
import "./Navbar.css";
import Login from "./Login";
import Register from "./Register";
import Forgot from "./Forgot";
import logo from "../../assets/static/identity/Logo.png";
import { Slider } from "react-burgers";

const Navbar = () => {
  const [drawer, setDrawer] = useState(false);
  const [firstModal, setFirstModal] = useState(false);
  const [secondModal, setSecondModal] = useState(false);
  const [thirdModal, setThirdModal] = useState(false);

  return (
    <header className="nav">
      <img className="logo" src={logo} alt=""></img>
      <div className="buttons">
        <Slider onClick={() => setDrawer(!drawer)} />
        <Drawer
          visible={drawer}
          placement="right"
          closable={false}
          onClose={() => setDrawer(!drawer)}
        >
          <Button
            type="link"
            onClick={() => {
              setFirstModal(!firstModal);
              setDrawer(!drawer);
            }}
          >
            <Icon type="login" />
            Log in
          </Button>
          <Modal
            centered={true}
            closable={false}
            visible={firstModal}
            onCancel={() => {
              setFirstModal(!firstModal);
            }}
            footer={[]}
          >
            <Login />
          </Modal>
          <Button
            type="link"
            onClick={() => {
              setSecondModal(!secondModal);
              setDrawer(!drawer);
            }}
          >
            <Icon type="user-add" />
            Register
          </Button>
          <Modal
            centered={true}
            closable={false}
            visible={secondModal}
            onCancel={() => setSecondModal(!secondModal)}
            footer={[]}
          >
            <Register onCancel={() => setSecondModal(!secondModal)} />
          </Modal>
          <Button
            type="link"
            onClick={() => {
              setThirdModal(!thirdModal);
              setDrawer(!drawer);
            }}
          >
            <Icon type="security-scan" />
            Forgot your password ?
          </Button>
          <Modal
            centered={true}
            closable={false}
            visible={thirdModal}
            onCancel={() => setThirdModal(!thirdModal)}
            footer={[]}
          >
            <Forgot />
          </Modal>
        </Drawer>
      </div>
    </header>
  );
};

export default Navbar;
