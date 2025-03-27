import axios from "axios"

export const getDataCart = async()=>{
    try{
        const response = await axios.get("http://10.10.8.75:8080/api/cart");
        return response.data;
    }catch(error){
        console.log(error);
    }
}

export const addToCart = async(product) => {
    try {
      // Nếu 'product' là đối tượng đã có id, hãy tạo đối tượng mới chỉ với các thuộc tính cần thiết
      const newCartItem = {
        quantity: 1, // hoặc số lượng mặc định
        product: product, // hoặc chỉ truyền thông tin sản phẩm cần thiết
      };
      const response = await axios.post("http://10.10.8.75:8080/api/cart", newCartItem);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

export const updateCartItem = async(id,updateData)=>{
    try{
        const response = await axios.put(`http://10.10.8.75:8080/api/cart/${id}`,updateData);
        return response.data;
    }catch(error){
        console.log(error)
    }
}

export const deleteItemCart = async(id)=>{
    try {
        const response = await axios.delete(`http://10.10.8.75:8080/api/cart/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
export const clearCart = async () => {
    try {
      const response = await axios.delete("http://10.10.8.75:8080/api/cart/clear");
      return response.data;
    } catch (error) {
      console.error(error);
    }
}