// PaymentService.js
import axios from "axios";

const VNPAY_API_URL = 'http://10.10.8.75:8080/api/vnpay';
const PAYPAL_API_URL = 'http://10.10.8.75:8080/api/payments';

export const createPayment = async (orderId, paymentMethod) => {
  try {
    let response;
    if (paymentMethod === "VNPAY") {
      response = await axios.post(VNPAY_API_URL, { orderId });
    } else if (paymentMethod === "PAYPAL") {
      response = await axios.post(`${PAYPAL_API_URL}/create?orderId=${orderId}`);
    }
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo thanh toán: ", error);
    throw error;
  }
};

export const handlePaymentReturn = async (responseCode) => {
  try {
    // Gọi endpoint GET /api/vnpay/return?vnp_ResponseCode=...
    const response = await axios.get(`${VNPAY_API_URL}/return?vnp_ResponseCode=${responseCode}`);
    // Giả sử backend trả về dữ liệu dạng { success: true, ... }
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xử lý thanh toán:", error);
    throw error;
  }
};