import React from "react";

import { Modal } from "antd";

const { confirm } = Modal;

export default props => {
  const showConfirm = () => {
    confirm({
      title: "Do you want to report this account ?",
      content: "This action is irreversible",
      okText: "Yes, I do",
      okType: "danger",
      centered: true,
      onOk() {
        const headers = {
          "Content-Type": "application/json",
          "Access-Control-Origin": "*"
        };
        fetch("/security/report", {
          method: "post",
          headers: headers,
          body: JSON.stringify({
            reporterUserId: props.reporterUserId,
            reportedUserId: props.reportedUserId
          })
        });
        fetch("/notification/score", {
          method: "post",
          headers: headers,
          body: JSON.stringify({
            type: 6,
            visited: props.reportedUserId,
            score: props.reportedUserScore
          })
        });
        props.onCancel();
      }
    });
  };

  return <i className="far fa-flag fa-3x" onClick={showConfirm} />;
};
