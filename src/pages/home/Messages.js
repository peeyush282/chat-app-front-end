import React, { Fragment, useEffect, useState } from "react";
import { Col, Form } from "react-bootstrap";
import {
  gql,
  useQuery,
  useSubscription,
  useLazyQuery,
  useMutation,
} from "@apollo/client";
import { useMessageDispatch, useMessageState } from "../../context/message";
import Message from "./Message";
const GET_MESSAGES = gql`
  query getMessages($from: String!) {
    getMessages(from: $from) {
      content
      from
      to
      createdAt
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation sendMessage($to: String!, $content: String!) {
    sendMessage(to: $to, content: $content) {
      from
      to
      content
      createdAt
    }
  }
`;

function Messages() {
  // console.log(selectedUser);
  const dispatch = useMessageDispatch();
  const { users } = useMessageState();
  // console.log("users", users);
  // const selectedUser = users?.find((u) => u.selected === true)?._id;
  const selectedUser = users?.find((u) => u.selected === true);
  console.log("selectedUser", selectedUser);
  let messages = selectedUser?.messages;
  console.log("messages", messages);
  const [
    getMessages,
    { loading: messageLoading, data: messageData },
  ] = useLazyQuery(GET_MESSAGES);

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onError: (err) => console.log(err),
  });

  // console.log(messageData);
  const [content, setContent] = useState("");
  useEffect(() => {
    if (selectedUser && !selectedUser.messages) {
      getMessages({ variables: { from: selectedUser._id } });
    }
  }, [selectedUser]);

  useEffect(() => {
    if (messageData) {
      console.log("444444444444444444444444444444444");
      dispatch({
        type: "SET_USER_MESSAGES",
        payload: {
          username: selectedUser,
          messages: messageData.getMessages,
        },
      });
    }
  }, [messageData]);

  let selectedChatMarkup;
  if (!messages && !messageLoading) {
    selectedChatMarkup = <p className="info-text">Select a friend</p>;
  } else if (messageLoading) {
    selectedChatMarkup = <p className="info-text">Loading..</p>;
  } else if (messages.length > 0) {
    selectedChatMarkup = messages.map((message, index) => {
      return (
        <Fragment key={index}>
          <Message message={message} />
          {index === message.length - 1 && (
            <div className="invisble">
              <hr className="m-0" />
            </div>
          )}
        </Fragment>
      );
    });
  } else if (messages.length === 0) {
    selectedChatMarkup = <p>You are now connected ! send your first message</p>;
  }
  const submitMessage = (e) => {
    e.preventDefault();

    if (content.trim() === "" || !selectedUser) return;
    setContent("");
    sendMessage({ variables: { to: selectedUser._id, content } });
  };

  return (
    <Col xs={10} md={8}>
      <div className="messages-box d-flex flex-column-reverse">
        {selectedChatMarkup}
      </div>
      <Form onSubmit={submitMessage}>
        <Form.Group className="d-flex align-items-center">
          <Form.Control
            type="text"
            className=" message-input rounded-pill bg-secondary border-0"
            placeholder="Type a Message..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <i
            className="fas fa-paper-plane fa-2x text-primary ml-2"
            role="button"
            onClick={submitMessage}
          ></i>
        </Form.Group>
      </Form>
    </Col>
  );
}

export default Messages;
