import axios from "axios"

export const getNews= async()=>{
    try{
        const response= await axios.get("http://10.10.8.75:8080/news");
        return response.data;
    }catch(error){
        console.log(error);
    }
}