import axios from "axios";

const API = axios.create({
 baseURL:"https://project-management-backend-production-fd3e.up.railway.app"
});

API.interceptors.request.use((req)=>{

 const token = localStorage.getItem("token");

 if(token){
  req.headers.Authorization = `Bearer ${token}`;
 }

 return req;

});

API.interceptors.response.use(
 res=>res,
 err=>{
  alert(err.response?.data?.message || "Something went wrong");
  return Promise.reject(err);
 }
);

export default API;