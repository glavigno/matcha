import React from "react";

import { Modal } from "antd";

const { confirm } = Modal;

export default props => {
  const showConfirm = () => {
    confirm({
      title: "Do you want to block this user ?",
      content: "This action is irreversible",
      okText: "Yes, I do",
      okType: "danger",
      centered: true,
      onOk() {
        const headers = {
          "Content-Type": "application/json",
          "Access-Control-Origin": "*"
        };
        fetch("/security/block", {
          method: "post",
          headers: headers,
          body: JSON.stringify({
            blockerUserId: props.blockerUserId,
            blockedUserId: props.blockedUserId
          })
        });
        fetch("/notification/score", {
          method: "post",
          headers: headers,
          body: JSON.stringify({
            type: 5,
            visited: props.blockedUserId,
            score: props.blockedUserScore
          })
        });
        props.onCancel();
      }
    });
  };

  return <i className="far fa-hand-paper fa-3x" onClick={showConfirm}></i>;
};
