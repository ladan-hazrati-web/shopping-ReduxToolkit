import { Button, Form, Input, message } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register } from "../slices/authSlice";
function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      await dispatch(register(values)).unwrap();
      message.success("کاربر با موفقیت وارد شد");
      navigate("/");
    } catch {
      message.error("لطفا با نام کاربری دیگری ثبت نام کنید");
    }
  };
  return (
    <Form
      name="register"
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
      <Form.Item
        rules={[
          { required: true, message: "لطفا تایید رمز عبور را وارد کنید" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("رمز های عبور مطابقت ندارند"));
            },
          }),
        ]}
        name="confrim"
        dependencies={["password"]}
      >
        <Input.Password placeholder="تایید رمزعبور" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
          ورود
        </Button>
      </Form.Item>
    </Form>
  );
}

export default RegisterPage;
