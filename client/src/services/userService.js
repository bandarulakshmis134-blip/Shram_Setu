import axios from "axios";

export const updateUserProfile = async (userData) => {

  const response = await axios.put(

    "http://localhost:5000/api/user/update",

    userData

  );

  return response.data;

};