import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { gql, useLazyQuery } from "@apollo/client";
import { useAuthDispatch } from "../context/auth";
const LOGIN_USER = gql`
  query login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      username
      email
      token
    }
  }
`;

function Login(props) {
  const [variables, setvariables] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const dispatch = useAuthDispatch();
  const [loginUser, { loading, data, error }] = useLazyQuery(LOGIN_USER, {
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    onCompleted(data) {
      dispatch({ type: "LOGIN", payload: data.login });
      window.location.href = "/";
    },
  });
  const submitLoginForm = (e) => {
    e.preventDefault();
    console.log(variables);
    loginUser({ variables });
  };
  return (
    <Row className="bg-white py-5 justify-content-center">
      <Col sm={8} md={6} lg={4}>
        <h1 className="text-center">Login</h1>

        <Form onSubmit={submitLoginForm}>
          <Form.Group>
            <Form.Label className={errors.username && "text-danger"}>
              {errors.username && "Username address"}
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Username"
              value={variables.username}
              onChange={(e) =>
                setvariables({ ...variables, username: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group>
            <Form.Label className={errors.password && "text-danger"}>
              {errors.password && "Password "}
            </Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={variables.password}
              onChange={(e) =>
                setvariables({ ...variables, password: e.target.value })
              }
            />
          </Form.Group>

          <div className="text-center">
            <Button variant="success" type="submit" disabled={loading}>
              {loading ? "loading.." : "Login"}
            </Button>
            <br />
            <small>
              Don't have an account <Link to="/register">Register</Link>
            </small>
          </div>
        </Form>
      </Col>
    </Row>
  );
}

export default Login;
