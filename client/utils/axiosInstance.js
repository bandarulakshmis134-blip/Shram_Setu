import axios from "../utils/axiosInstance";

const axiosInstance = axios.create({

 baseURL: import.meta.env.VITE_API_URL

});

/*
========================
AUTO TOKEN HANDLER
========================
*/
axiosInstance.interceptors.response.use(

 (response)=>response,

 (error)=>{

  /*
  TOKEN EXPIRED
  */
  if(

   error.response?.status === 401 ||

   error.response?.data?.message
    ?.toLowerCase()
    .includes("token")

  ){

   /*
   CLEAR SESSION
   */
   sessionStorage.clear();

   /*
   REDIRECT LOGIN
   */
   window.location.href = "/login";

  }

  return Promise.reject(error);

 }

);

export default axiosInstance;