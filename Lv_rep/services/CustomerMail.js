import axios from "axios"

export const getDataCustomerMail= async()=>{
    try{
        const response = await axios.get("http://10.10.8.75:8080/customer");
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const addCustomer = async(customer)=>{
    try{
        const response = await axios.post("http://10.10.8.75:8080/customer",customer);
        return response.data;
    }catch(error){
        console.error(error);
    }
}