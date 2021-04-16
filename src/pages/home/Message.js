import React from "react";
import { useAuthState } from "../../context/auth";
import className from "classnames";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import moment from "moment";
function Message({ message }) {
  const { user } = useAuthState();
  console.log(user.id);
  console.log(message.from);
  const sent = message.from === user.id;
  console.log("sent", sent);
  const recevied = !sent;
  return (
    <OverlayTrigger
      placement={sent ? "right" : "left"}
      overlay={
        <Tooltip>
          {moment(message.createdAt).format("MMMM DD , YYYY @ h:mm :a")}
        </Tooltip>
      }
    >
      <div
        className={className("d-flex my-3", {
          "ml-auto": sent,
          "mr-auto": recevied,
        })}
      >
        <div
          className={className("py-2 px-3 rounded-pill bg-primary", {
            "bg-primary": sent,
            "bg-secondary": recevied,
          })}
        >
          <p className={className({ "text-white": sent })}>{message.content}</p>
        </div>
      </div>
    </OverlayTrigger>
  );
}

export default Message;
