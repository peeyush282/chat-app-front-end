import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";

import { gql, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      username: $username
      email: $email
      password: $password
      confirmPassword: $confirmPassword
    ) {
      username
      email
      createdAt
      _id
    }
  }
`;

function Register(props) {
  const [variables, setvariables] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [registerUser, { loading, data, error }] = useMutation(REGISTER_USER, {
    update(_, res) {
      console.log(res);
      props.history.push("/login");
    },
    onError(err) {
      // setErrors(err.graphQLErrors[0].extensions.errors);
      console.log(err);
    },
  });
  const submitRegisterForm = (e) => {
    e.preventDefault();
    console.log(variables);
    registerUser({ variables });
  };
  return (
    <Row className="bg-white py-5 justify-content-center">
      <Col sm={8} md={6} lg={4}>
        <h1 className="text-center">Register</h1>

        <Form onSubmit={submitRegisterForm}>
          <Form.Group>
            <Form.Label className={errors.email && "text-danger"}>
              {errors.email && "Email address"}
            </Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              className={errors.email && "is-invalid"}
              value={variables.email}
              onChange={(e) =>
                setvariables({ ...variables, email: e.target.value })
              }
            />
          </Form.Group>
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
          <Form.Group>
            <Form.Label className={errors.confrimPassword && "text-danger"}>
              {errors.confrimPassword && "Confirm Password"}
            </Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              value={variables.confirmPassword}
              onChange={(e) =>
                setvariables({
                  ...variables,
                  confirmPassword: e.target.value,
                })
              }
            />
          </Form.Group>

          <div className="text-center">
            <Button variant="success" type="submit" disabled={loading}>
              {loading ? "loading.." : "Register"}
            </Button>
            <br />
            <small>
              Already have an account <Link to="/login">Login</Link>
            </small>
          </div>
        </Form>
      </Col>
    </Row>
  );
}

export default Register;
