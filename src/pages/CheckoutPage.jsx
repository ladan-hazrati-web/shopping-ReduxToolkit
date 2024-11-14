import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  TimePicker,
  Typography,
} from "antd";
import { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { clearCart } from "../slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
const { Title } = Typography;
function CheckoutPage() {
  const [location, setLocation] = useState(null);
  const [placeName, setPlaceName] = useState("");
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const provider = new OpenStreetMapProvider();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = (values) => {
    if (!placeName) {
      message.error("مکان مورد نظر خود را انتخاب کنید");
    } else {
      console.log({ ...values, location: placeName });
      dispatch(clearCart());
      navigate("/");
    }
  };

  const handleSearch = async (value) => {
    try {
      const results = await provider.search({ query: value });
      if (results && results.length > 0) {
        const { x, y, label } = results[0];
        const newLocation = { lat: y, lng: x };
        setLocation(newLocation);
        setPlaceName(label);

        if (map) {
          map.setView(newLocation, 14); // حرکت نقشه به مکان جدید

          if (marker) {
            marker.setLatLng(newLocation);
          } else {
            const newMarker = L.marker(newLocation, { draggable: true }).addTo(
              map
            );
            setMarker(newMarker);

            newMarker.on("dragend", async () => {
              const { lat, lng } = newMarker.getLatLng();
              const results = await provider.search({
                query: `${lat}, ${lng}`,
              });
              const newPlaceName = results[0]?.label || "نام مکان نامشخص";
              setLocation({ lat, lng });
              setPlaceName(newPlaceName);
            });
          }
        }
      }
    } catch (error) {
      console.error("Failed to search location:", error);
    }
  };

  useEffect(() => {
    const leafletMap = L.map("map").setView([35.6892, 51.389], 13); // موقعیت پیش‌فرض
    setMap(leafletMap);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(leafletMap);

    // حذف نقشه در زمان unmount
    return () => {
      leafletMap.remove();
    };
  }, []); // این useEffect فقط یک بار اجرا می‌شود

  return (
    <Form
      name="checkout"
      onFinish={onFinish}
      style={{ marginTop: "50px", padding: "0px 50px" }}
    >
      <Form.Item
        label="نام و نام خانوادگی"
        rules={[{ required: true, message: "نام خود را وارد کنید" }]}
        name="name"
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="انتخاب موقعیت مکانی"
        rules={[{ required: true, message: "مکان خود را وارد کنید" }]}
        name="location"
      >
        <Input.Search onSearch={handleSearch} />
      </Form.Item>
      <div
        id="map"
        style={{ height: "500px", margin: "20px auto", width: "50%" }}
      ></div>
      <Title level={3} style={{ margin: "50px 0px" }}>
        مکان انتخاب شده: {placeName ? placeName : "هنوز انتخاب نشده"}
      </Title>
      <Form.Item
        name="dateDelivery"
        label="تاریخ انتخابی"
        rules={[{ required: true, message: "تاریخ خود را مشخص کنید!" }]}
      >
        <DatePicker />
      </Form.Item>
      <Form.Item
        name="timeDelivery"
        label="زمان انتخابی"
        rules={[{ required: true, message: "تاریخ خود را مشخص کنید!" }]}
      >
        <TimePicker />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          ثبت سفارش
        </Button>
      </Form.Item>
    </Form>
  );
}

export default CheckoutPage;
