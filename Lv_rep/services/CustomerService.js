import axios from "axios"

export const getCustomerService = async()=>{
    try{
        const response = await axios.get("http://10.10.8.75:8080/api/service");
        return response.data;
    }catch(error){
        console.log(error.mesage);
    }
}