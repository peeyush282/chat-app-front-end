import React, { Fragment, useEffect, useState } from "react";
import { Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { gql, useSubscription } from "@apollo/client";
import { useAuthDispatch, useAuthState } from "../../context/auth";
import { useMessageDispatch } from "../../context/message";
import Users from "./Users";
import Messages from "./Messages";
const NEW_MESSAGE = gql`
  subscription newMessage {
    newMessage {
      from
      to
      content
      createdAt
    }
  }
`;

export default function Home({ history }) {
  const authDispatch = useAuthDispatch();
  const { data: messageData, error: messageError } = useSubscription(
    NEW_MESSAGE
  );
  const [selectedUser, setSelectedUser] = useState(null);
  const { user } = useAuthState();
  const messageDispatch = useMessageDispatch();
  console.log("messageData222222222", messageData);
  console.log("selectedUser11111111111", selectedUser);
  console.log(user);

  const logout = () => {
    authDispatch({ type: "LOGOUT" });
    window.location.href = "/login";
  };
  // const setSelectedUser = () => {};

  useEffect(() => {
    if (messageError) console.log(messageError);
    const message = messageData?.newMessage;
    const otherUser = user.id === message?.to ? message?.from : message?.to;
    console.log("otehruser", otherUser);
    console.log("testing message", message);
    if (messageData) {
      messageDispatch({
        type: "ADD_MESSAGE",
        payload: {
          username: otherUser,
          message: message,
        },
      });
    }
  }, [messageError, messageData]);
  return (
    <Fragment>
      <Row className="bg-white justify-content-around mb-1">
        <Link to="/login">
          <Button variant="link">Login</Button>
        </Link>
        <Link to="/register">
          <Button variant="link">Register</Button>
        </Link>
        <Button variant="link" onClick={logout}>
          Logout
        </Button>
      </Row>
      <Row className="bg-white">
        <Users setSelectedUser={setSelectedUser} selectedUser={selectedUser} />
        <Messages
          setSelectedUser={setSelectedUser}
          selectedUser={selectedUser}
        />
      </Row>
    </Fragment>
  );
}
