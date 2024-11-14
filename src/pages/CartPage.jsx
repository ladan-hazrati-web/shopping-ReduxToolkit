import {
  Button,
  Empty,
  Flex,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeFromCart, updateQuantity } from "../slices/cartSlice";
const { Title, Paragraph } = Typography;
function CartPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const navigate = useNavigate();
  const handleUpdateQuantity = (quantity, id) => {
    dispatch(updateQuantity({ quantity, id }));
  };
  const handleRemove = (id) => {
    dispatch(removeFromCart({ id }));
  };
  const totalPrice = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const columns = [
    { title: "نام محصول", dataIndex: "name", key: "name" },
    {
      title: "قیمت",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toLocaleString()} تومان`,
    },
    {
      title: "تعداد",
      dataIndex: "quantity",
      key: "qunatity",
      render: (_, record) => (
        <InputNumber
          min={1}
          defaultValue={record.quantity}
          onChange={(value) => handleUpdateQuantity(value, record.id)}
        />
      ),
    },
    {
      title: "جمع",
      dataIndex: "total",
      key: "total",
      render: (_, record) =>
        `${(record.price * record.quantity).toLocaleString()} تومان`,
    },
    {
      title: "عملیات",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          description="آیا میخواهید این محصول را از سبد خرید حذف کنید؟"
          onConfirm={() => handleRemove(record.id)}
          okText="بله"
          cancelText="خیر"
        >
          <Button danger>حذف</Button>
        </Popconfirm>
      ),
    },
  ];
  if (cartItems.length === 0) {
    return (
      <Empty
        style={{ marginTop: "50px" }}
        description={<Paragraph>سبد خرید شما خالی است</Paragraph>}
      >
        <Button type="primary" onClick={() => navigate("/")}>
          رفتن به فروشگاه
        </Button>
      </Empty>
    );
  }
  return (
    <div>
      <Title level={2}>سبد خرید</Title>

      <Table
        dataSource={cartItems}
        columns={columns}
        pagination={false}
        rowKey="id"
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell>
              <Paragraph> جمع کل :</Paragraph>
            </Table.Summary.Cell>
            <Table.Summary.Cell>
              <Paragraph>{totalPrice().toLocaleString()}تومان </Paragraph>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />
      <Flex gap={12} style={{ margin: "25px" }}>
        <Link to="/">
          <Button type="primary">ادامه خرید</Button>
        </Link>
        <Button type="primary" onClick={() => navigate("/checkout")}>
          تکمیل خرید
        </Button>
      </Flex>
    </div>
  );
}

export default CartPage;
