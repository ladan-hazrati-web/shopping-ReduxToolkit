import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../slices/authSlice";
function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      await dispatch(login(values)).unwrap();
      message.success("کاربر با موفقیت وارد شد");
      navigate("/");
    } catch {
      message.error("نام کاربری یا رمز عبور اشتباه هست");
    }
  };

  return (
    <Form
      initialValues={{
        remember: true,
      }}
      name="login"
      onFinish={onFinish}
      style={{ width: "450px", margin: "100px auto" }}
    >
      <Form.Item
        rules={[
          { required: true, message: "لطفا نام کاربری خود را وارد کنید" },
        ]}
        name="username"
      >
        <Input placeholder="نام کاربری" />
      </Form.Item>
      <Form.Item
        rules={[{ required: true, message: "لطفا رمز عبور خود را وارد کنید" }]}
        name="password"
      >
        <Input.Password placeholder="رمز عبور" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
          ورود
        </Button>
      </Form.Item>
    </Form>
  );
}

export default LoginPage;
