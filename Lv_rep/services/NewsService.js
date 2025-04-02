import axios from "axios"

export const getNews= async()=>{
    try{
        const response= await axios.get("http://10.10.8.75:8080/api/news");
        return response.data;
    }catch(error){
        console.log(error);
    }
}

export const getNewsById = async(id)=>{
    try{
        const response = await axios.get(`http://10.10.8.75:8080/api/news/${id}`);
        return response.data
    }catch(error){
        console.log("Lỗi getNewsById",error);
    }
}