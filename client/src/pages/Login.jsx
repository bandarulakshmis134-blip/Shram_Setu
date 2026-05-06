import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    mobile: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);

  /*
  =====================
  HANDLE INPUT
  =====================
  */
  const handleChange = (e) => {

    const { name, value } = e.target;

    // mobile → only numbers, max 10 digits
    if (name === "mobile") {
      const onlyNumbers = value.replace(/\D/g, "");
      if (onlyNumbers.length <= 10) {
        setFormData({ ...formData, mobile: onlyNumbers });
      }
      return;
    }

    setFormData({
      ...formData,
      [name]: value
    });

  };

  /*
  =====================
  HANDLE LOGIN
  =====================
  */
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          mobile: Number(formData.mobile), // ✅ IMPORTANT
          password: formData.password
        },
        {
          withCredentials: true // ✅ needed for refresh token cookie
        }
      );

      /*
      =====================
      STORE USER + TOKEN
      =====================
      */
      const userData = {
        ...res.data.user,
        token: res.data.accessToken
      };

      sessionStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

      /*
      =====================
      SUCCESS FLOW
      =====================
      */
      alert("Login successful");

      navigate("/home"); // ✅ your requirement

    }

    catch (error) {

      console.log("LOGIN ERROR:", error.response?.data || error.message);

      alert(
        error.response?.data?.message || "Login failed"
      );

    }

  };

  /*
  =====================
  UI
  =====================
  */
  return (

    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">

        {/* LOGO */}
        <div className="flex justify-center mb-4">
          <Logo />
        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Welcome Back
        </h2>

        <p className="text-center text-gray-500 mt-1 mb-6">
          Login to continue to Shram Setu
        </p>

        <form onSubmit={handleSubmit}>

          {/* MOBILE */}
          <div className="mb-4">
            <label className="text-sm text-gray-600">
              Mobile Number
            </label>

            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter 10-digit number"
              className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-6 relative">
            <label className="text-sm text-gray-600">
              Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              className="w-full mt-1 px-4 py-3 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 cursor-pointer text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Login
          </button>

        </form>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-600 cursor-pointer font-medium"
          >
            Sign Up
          </span>
        </p>

      </div>

    </div>

  );

};

export default Login;