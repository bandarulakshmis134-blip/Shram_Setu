import {
 useState,
 useEffect
} from "react";

import axios from "../axiosInstance";

import {
 useNavigate
} from "react-router-dom";

import {
 ArrowLeft
} from "lucide-react";

const ForgotPassword = () => {

 const navigate =
  useNavigate();

 /*
 ========================
 STATES
 ========================
 */
 const [step,setStep] =
  useState(1);

 const [email,setEmail] =
  useState("");

 const [otp,setOtp] =
  useState("");

 const [password,setPassword] =
  useState("");

 const [loading,setLoading] =
  useState(false);

 /*
 ========================
 OTP TIMER
 ========================
 */
 const [timer,setTimer] =
  useState(120);

 const [canResend,setCanResend] =
  useState(false);

 /*
 ========================
 TIMER EFFECT
 ========================
 */
 useEffect(()=>{

  let interval;

  if(step === 2 && timer > 0){

   interval = setInterval(()=>{

    setTimer(prev => prev - 1);

   },1000);

  }

  if(timer === 0){

   setCanResend(true);

  }

  return ()=> clearInterval(interval);

 },[step,timer]);

 /*
 ========================
 SEND OTP
 ========================
 */
 const sendOTP = async ()=>{

  try{

   setLoading(true);

   const res = await axios.post(

    `${import.meta.env.VITE_API_URL}/api/forgot-password/send-otp`,

    {
     email
    }

   );

   alert(
    res.data.message
   );

   setStep(2);

   /*
   RESET TIMER
   */
   setTimer(120);

   setCanResend(false);

  }

  catch(error){

   console.log(error);

   alert(

    error.response?.data?.message ||

    "Failed to send OTP"

   );

  }

  finally{

   setLoading(false);

  }

 };

 /*
 ========================
 VERIFY OTP
 ========================
 */
 const verifyOTP = async ()=>{

  try{

   setLoading(true);

   const res = await axios.post(

    `${import.meta.env.VITE_API_URL}/api/forgot-password/verify-otp`,

    {
     email,
     otp
    }

   );

   alert(
    res.data.message
   );

   setStep(3);

  }

  catch(error){

   console.log(error);

   alert(

    error.response?.data?.message ||

    "Invalid OTP"

   );

  }

  finally{

   setLoading(false);

  }

 };

 /*
 ========================
 RESEND OTP
 ========================
 */
 const resendOTP = async ()=>{

  try{

   setLoading(true);

   await axios.post(

    `${import.meta.env.VITE_API_URL}/api/forgot-password/send-otp`,

    {
     email
    }

   );

   alert(
    "New OTP Sent 🚀"
   );

   /*
   RESET TIMER
   */
   setTimer(120);

   setCanResend(false);

  }

  catch(error){

   console.log(error);

   alert(
    "Failed to resend OTP"
   );

  }

  finally{

   setLoading(false);

  }

 };

 /*
 ========================
 RESET PASSWORD
 ========================
 */
 const resetPassword = async ()=>{

  try{

   setLoading(true);

   const res = await axios.post(

    `${import.meta.env.VITE_API_URL}/api/forgot-password/reset-password`,

    {
     email,
     password
    }

   );

   alert(
    res.data.message
   );

   navigate("/login");

  }

  catch(error){

   console.log(error);

   alert(

    error.response?.data?.message ||

    "Reset failed"

   );

  }

  finally{

   setLoading(false);

  }

 };

 return (

  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

   <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md relative">

    {/* BACK BUTTON */}
    <button

     onClick={()=>navigate(-1)}

     className="absolute top-6 left-6 text-gray-600 hover:text-blue-600 transition"

    >

     <ArrowLeft size={24}/>

    </button>

    {/* TITLE */}
    <h1 className="text-3xl font-bold text-center mb-2">

     Forgot Password

    </h1>

    <p className="text-center text-gray-500 mb-8">

     Recover your account securely

    </p>

    {/* STEP 1 */}
    {step === 1 && (

     <div className="space-y-4">

      <input

       type="email"

       placeholder="Enter your email"

       value={email}

       onChange={(e)=>

        setEmail(
         e.target.value
        )

       }

       className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"

      />

      <button

       onClick={sendOTP}

       disabled={loading}

       className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl transition"

      >

       {loading
        ? "Sending..."
        : "Send OTP"
       }

      </button>

     </div>

    )}

    {/* STEP 2 */}
    {step === 2 && (

     <div className="space-y-4">

      <input

       type="text"

       placeholder="Enter OTP"

       value={otp}

       onChange={(e)=>

        setOtp(
         e.target.value
        )

       }

       className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"

      />

      <button

       onClick={verifyOTP}

       disabled={loading}

       className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-2xl transition"

      >

       {loading
        ? "Verifying..."
        : "Verify OTP"
       }

      </button>

      {/* TIMER */}
      <div className="text-center">

       <p className="text-sm text-gray-500">

        OTP expires in:

        <span className="font-semibold text-red-500 ml-1">

         {Math.floor(timer / 60)}:

         {(timer % 60)
          .toString()
          .padStart(2,"0")
         }

        </span>

       </p>

       {/* RESEND */}
       <button

        disabled={!canResend}

        onClick={resendOTP}

        className={`mt-3 text-sm font-medium transition

        ${canResend

         ? "text-blue-600 hover:text-blue-700"

         : "text-gray-400 cursor-not-allowed"

        }`}

       >

        Resend OTP

       </button>

      </div>

     </div>

    )}

    {/* STEP 3 */}
    {step === 3 && (

     <div className="space-y-4">

      <input

       type="password"

       placeholder="Enter new password"

       value={password}

       onChange={(e)=>

        setPassword(
         e.target.value
        )

       }

       className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"

      />

      <button

       onClick={resetPassword}

       disabled={loading}

       className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl transition"

      >

       {loading
        ? "Updating..."
        : "Reset Password"
       }

      </button>

     </div>

    )}

   </div>

  </div>

 );

};

export default ForgotPassword;