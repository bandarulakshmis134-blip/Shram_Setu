import { Logo } from "../components/Logo";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {

  const [password,setPassword] = useState("");
  const [phone,setPhone] = useState("");
  const [showPassword,setShowPassword] = useState(false);

  const navigate = useNavigate();


  /*
  allow only 10 digits
  */

  const handlePhoneChange = (e) => {

    const value = e.target.value;

    if(/^\d{0,10}$/.test(value)){

      setPhone(value);

    }

  };


  /*
  LOGIN
  */

  const handleLogin = async () => {

    if(phone.length !== 10){

      alert("Enter valid mobile number");

      return;

    }

    if(!password){

      alert("Enter password");

      return;

    }

    try{

      const res = await axios.post(

        "http://localhost:5000/api/auth/login",

        {

          mobile:Number(phone),

          password:password.trim()

        },

        {

          withCredentials:true

        }

      );


      /*
      store token
      */

      localStorage.setItem(

        "token",

        res.data.accessToken

      );


      /*
      store user + token together
      */

      sessionStorage.setItem(

        "user",

        JSON.stringify({

          ...res.data.user,

          token:res.data.accessToken

        })

      );


      alert("Login successful");

      navigate("/home");

    }

    catch(error){

      alert(

        error.response?.data?.message ||

        "Login failed"

      );

    }

  };


  return(

    <div className="flex justify-center items-center min-h-screen bg-gray-100">

      <div className="bg-white rounded-2xl shadow-lg p-10 w-400px">


        {/* header */}

        <div className="flex flex-col items-center mb-6">

          <Logo className="w-10 h-10"/>

          <h1 className="text-2xl font-bold mt-3">

            Welcome Back

          </h1>

          <p className="text-gray-500">

            Login to continue to Shram Setu

          </p>

        </div>


        <div className="space-y-4">


          {/* mobile */}

          <div>

            <label className="text-sm font-medium">

              Mobile Number

            </label>

            <input

              type="text"

              value={phone}

              onChange={handlePhoneChange}

              placeholder="Enter phone number"

              className="w-full border rounded-lg px-4 py-2"

            />

          </div>


          {/* password */}

          <div>

            <label className="text-sm font-medium">

              Password

            </label>


            <div className="relative">

              <input

                type={showPassword ? "text" : "password"}

                value={password}

                onChange={(e)=>setPassword(e.target.value)}

                placeholder="Enter password"

                className="w-full mt-1 border rounded-lg p-3 pr-10 outline-none"

              />


              <span

                className="absolute right-3 top-4 cursor-pointer text-gray-500"

                onClick={()=>

                  setShowPassword(!showPassword)

                }

              >

                {showPassword ? <FaEyeSlash/> : <FaEye/>}

              </span>

            </div>

          </div>


          {/* button */}

          <button

            onClick={handleLogin}

            disabled={phone.length !== 10 || !password}

            className={`w-full py-3 rounded-lg mt-4 text-white

            ${phone.length === 10 && password

              ? "bg-blue-600 hover:bg-blue-700"

              : "bg-gray-400 cursor-not-allowed"

            }`}

          >

            Login

          </button>


          {/* signup */}

          <p className="text-center text-sm text-gray-500 mt-3">

            Don't have an account?

            <span

              onClick={()=>navigate("/signup")}

              className="text-blue-600 cursor-pointer ml-1"

            >

              Sign Up

            </span>

          </p>


        </div>

      </div>

    </div>

  );

};

export default Login;