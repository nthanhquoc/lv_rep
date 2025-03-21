import axios from "axios"

export const getDataCart = async()=>{
    try{
        const response = await axios.get("http://10.10.8.75:8080/cart");
        return response.data;
    }catch(error){
        console.log(error);
    }
}

export const addToCart = async(product)=>{
    try{
        const response = await axios.post("http://10.10.8.75:8080/cart",product);
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const updateCartItem = async(id,updateData)=>{
    try{
        const response = await axios.put(`http://10.10.8.75:8080/cart/${id}`,updateData);
        return response.data;
    }catch(error){
        console.log(error)
    }
}