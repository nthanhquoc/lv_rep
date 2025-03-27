import axios from "axios"

export const getProductData = async()=>{
    try{
        const response = await axios.get("http://10.10.8.75:8080/api/product");
        return response.data;
    }catch(error){
        console.error(error);
    }
}