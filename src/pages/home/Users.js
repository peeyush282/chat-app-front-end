import React from "react";
import { gql, useQuery, useSubscription, useLazyQuery } from "@apollo/client";
import { Row, Button, Col, Image } from "react-bootstrap";
import profileImage from "../../assest/profile.jpg";
import { useMessageDispatch, useMessageState } from "../../context/message";

import classNames from "classnames";
const GET_USERS = gql`
  query getUsers {
    getUsers {
      username
      email
      createdAt
      _id
      latestMessage {
        content
        to
      }
    }
  }
`;
function Users() {
  const dispatch = useMessageDispatch();
  const { users } = useMessageState();

  console.log("users", users);
  const selectedUser = users?.find((u) => u.selected === true)?.username;
  const { loading } = useQuery(GET_USERS, {
    onCompleted: (data) =>
      dispatch({ type: "SET_USERS", payload: data.getUsers }),

    onError: (err) => console.log(err),
  });
  console.log(users);
  let usersMarkup;
  if (users !== null) {
    if (!users && loading) {
      usersMarkup = <p>Loading...</p>;
    } else if (users?.length === 0) {
      usersMarkup = <p>No user have joined</p>;
    } else if (users?.length > 0) {
      usersMarkup = users.map((user) => {
        const selected = selectedUser === user.username;
        console.log("selected", selected);
        return (
          <div
            role="button"
            className={classNames(
              "user-div d-flex  justify-content-center justify-content-md-start  p-3",
              {
                "bg-white": selected,
              }
            )}
            key={user.username}
            onClick={() =>
              dispatch({ type: "SET_SELECTED_USER", payload: user._id })
            }
          >
            <Image src={profileImage} roundedCircle className=" user-image " />
            <div className="d-none d-md-block ml-2">
              <p className="text-success">{user.username}</p>
              <p className="font-weight-light">
                {user.latestMessage
                  ? user.latestMessage.content
                  : "You are now connected"}
              </p>
            </div>
          </div>
        );
      });
    }
  }
  return (
    <Col
      xs={2}
      md={4}
      className="p-0 bg-secondary"
      style={{ cursor: "pointer" }}
    >
      {usersMarkup}
    </Col>
  );
}

export default Users;
