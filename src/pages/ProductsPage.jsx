import {
  Button,
  Card,
  Col,
  Input,
  message,
  Row,
  Select,
  Spin,
  Typography,
} from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMeals,
  setSearchTerm,
  setSelectedCategory,
} from "../slices/mealsSlice";
import { addToCart } from "../slices/cartSlice";
const { Text, Title } = Typography;
function ProductsPage() {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const {
    loading,
    error,
    filteredItems: meals,
    searchTerm,
    selectedCategory,
    categories,
  } = useSelector((state) => state.meals);
  useEffect(() => {
    dispatch(fetchMeals());
  }, [fetchMeals]);
  const handleSelectedCategory = (value) => {
    dispatch(setSelectedCategory(value));
  };
  const setSearchHandler = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };
  const addHandler = (meal) => {
    if (!isLoggedIn) {
      message.error("ابتدا وارد اکانت کاربری خود شوید");
    } else {
      dispatch(
        addToCart({ id: meal.idMeal, name: meal.strMeal, price: meal.price })
      );
      message.success(`${meal.strMeal} به سبد خرید اضافه شد`);
    }
  };
  if (loading)
    return (
      <Spin
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "200px",
        }}
        size="large"
      />
    );
  if (error) return <div>failed fetch meals: {error}</div>;
  return (
    <div>
      <Title level={2} style={{ margin: "50px 0px", padding: "0px 50px" }}>
        محصولات ما
      </Title>
      <Row
        style={{
          width: "100%",
        }}
      >
        <Col span={10} style={{ display: "flex", justifyContent: "end" }}>
          <Input
            placeholder="جستجو"
            onChange={setSearchHandler}
            style={{ width: "80%" }}
            defaultValue={searchTerm}
          />
        </Col>
        <Col span={10} style={{ display: "flex", justifyContent: "end" }}>
          <Select
            defaultValue={selectedCategory}
            onChange={handleSelectedCategory}
            style={{ width: "50%" }}
          >
            {categories.map((category) => (
              <Select.Option key={category} value={category}>
                {category}
              </Select.Option>
            ))}
          </Select>
        </Col>
      </Row>
      {meals.length === 0 ? (
        <div
          style={{
            width: "100%",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          no products found
        </div>
      ) : (
        <Row gutter={[16, 16]} style={{ width: "100%", padding: "100px" }}>
          {meals.map((meal) => (
            <Col sm={24} md={12} lg={6} key={meal.idMeal}>
              <Card
                cover={
                  <img
                    src={meal.strMealThumb}
                    alt={meal.strMeal}
                    style={{ width: "100%" }}
                  />
                }
                actions={[
                  <Button
                    disabled={!isLoggedIn}
                    onClick={() => addHandler(meal)}
                  >
                    اضافه کردن به سبد خرید
                  </Button>,
                ]}
              >
                <Card.Meta
                  title={meal.strMeal}
                  description={
                    <>
                      <Text strong>
                        قیمت:{meal.price.toLocaleString()}تومان
                      </Text>{" "}
                      <br />
                      <Text>دسته بندی :{meal.strCategory}</Text>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
export default ProductsPage;
