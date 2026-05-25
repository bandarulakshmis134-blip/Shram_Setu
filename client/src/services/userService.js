import axios from "../utils/axiosInstance";

export const updateUserProfile = async (userData) => {

  const response = await axios.put(

    `${import.meta.env.VITE_API_URL}/api/user/update`,

    userData

  );

  return response.data;

};