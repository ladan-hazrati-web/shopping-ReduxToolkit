import { useSelector } from "react-redux";
import { Empty, List, Typography } from "antd";
const { Title, Text, Paragraph } = Typography;
function DashboardPage() {
  const cartItems = useSelector((state) => state.cart.items);
  const username = useSelector((state) => state.auth.user.username);
  if (cartItems.length === 0) {
    return (
      <Empty
        style={{ marginTop: "50px" }}
        description={<Text>محصولی انتخاب نشده است</Text>}
      />
    );
  }
  return (
    <div>
      <Title level={2} style={{ textAlign: "center", margin: "50px 0px" }}>
        داشبورد: {username}
      </Title>
      <List
        dataSource={cartItems}
        header={
          <Title level={4} style={{ padding: "0px 50px" }}>
            خرید های من
          </Title>
        }
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={item.strMeal}
              style={{ padding: "0px 50px" }}
              description={
                <>
                  <Paragraph strong>{item.name}</Paragraph>
                  <Text>قیمت:{item.price}</Text>
                  <br />
                  <Text>تعداد:{item.quantity}</Text>
                  <br />
                  <Text>
                    جمع: {(item.price * item.quantity).toLocaleString()} تومان
                  </Text>
                </>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
}

export default DashboardPage;
