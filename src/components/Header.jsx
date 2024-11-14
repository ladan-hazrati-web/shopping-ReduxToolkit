import { Menu } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../slices/authSlice";

function Header() {
  const [selectedKey, setSelectedKey] = useState("/home");
  const location = useLocation();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const handleLogout = () => {
    dispatch(logout());
  };
  useEffect(() => {
    setSelectedKey(location.pathname);
  }, [location.pathname]);

  const menuItems = [
    { label: <Link to="/">محصولات</Link>, key: "/" },
    { label: <Link to="/cart">سبد خرید</Link>, key: "/cart" },
    ...(isLoggedIn
      ? [
          { label: <Link to="/dashboard">داشبورد</Link>, key: "/dashboard" },
          {
            label: (
              <Link to="/logout" onClick={() => handleLogout()}>
                خروج
              </Link>
            ),
            key: "/logout",
          },
        ]
      : [
          { label: <Link to="/login">ورود</Link>, key: "/login" },
          { label: <Link to="/register">ثبت نام</Link>, key: "/register" },
        ]),
  ];

  return (
    <Menu
      selectedKeys={[selectedKey]}
      theme="dark"
      mode="horizontal"
      items={menuItems}
    />
  );
}

export default Header;
