import axios from "axios"

export const getBackgroundData = async()=>{
    try{
        const response = await axios.get("http://10.10.8.75:8080/background");
        return response.data;
    }catch(error){
        console.log(error.message);
    }
}