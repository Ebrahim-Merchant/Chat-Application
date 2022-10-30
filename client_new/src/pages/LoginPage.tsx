import { Button, Col, Form, Input, Row } from "antd";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { authUser } from "../store/actionCreator";
import { IAppState } from "../store/types";
import { useEffect } from "react";

const LoginPage = ({ authUser, isAuthUser }: any) => {
  const history = useHistory();
  const handleSubmit = (form: any) => {
    authUser(form);
  };

  useEffect(() => {
    if (isAuthUser) {
      history.push("/chat");
    }
  }, [history, isAuthUser]);

  return (
    <Row justify="center" align="middle">
      <Col></Col>
      <Form name="basic" onFinish={handleSubmit}>
        <Form.Item
          label="Username"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="pass"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Row>
  );
};

const mapDispatchToProps = (dispatch: any) => ({
  authUser: (userInfo: any) => dispatch(authUser(userInfo)),
});

const mapStateToProps = ({ user }: IAppState) => ({
  isAuthUser: user?.id ? true : false,
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
