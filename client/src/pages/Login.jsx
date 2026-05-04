import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    mobile: "",
    password: ""
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      /*
      🔥 IMPORTANT FIX (TOKEN STORAGE)
      */

      const userData = {
        ...res.data.user,
        token: res.data.accessToken // ✅ FIX
      };

      sessionStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

      alert("Login successful");

      navigate("/");

    }

    catch (error) {

      console.log(
        error.response?.data || error.message
      );

      alert("Login failed");

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"
      >

        <h2 className="text-xl font-bold mb-6 text-center">
          Login
        </h2>

        {/* MOBILE */}
        <input
          type="number"
          name="mobile"
          placeholder="Mobile Number"
          value={formData.mobile}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-4"
        />

        {/* PASSWORD */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-4"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
        >
          Login
        </button>

      </form>

    </div>

  );

};

export default Login;