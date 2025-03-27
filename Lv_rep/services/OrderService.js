import axios from "axios";

export const createOrder = async(orderData)=>{
    try {
        const response = await axios.post('http://10.10.8.75:8080/api/orders', orderData, {
          headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
      } catch (error) {
        console.error("Error creating order:", error);
        throw error;
      }
}