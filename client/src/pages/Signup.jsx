import { useState } from "react";
import { Logo } from "../components/Logo";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaUpload } from "react-icons/fa";
import axios from "axios";

const Signup = () => {

 const navigate = useNavigate();

 const [showPassword,setShowPassword] = useState(false);
 const [showConfirmPassword,setShowConfirmPassword] = useState(false);

 const [image,setImage] = useState("");

 const [firstName,setFirstName] = useState("");
 const [lastName,setLastName] = useState("");

 const [email,setEmail] = useState("");

 const [gender,setGender] = useState("Other");

 const [age,setAge] = useState("");

 const [aadhaar,setAadhaar] = useState("");
 const [location,setLocation] = useState("");

 const [mobile,setMobile] = useState("");

 const [password,setPassword] = useState("");
 const [confirmPassword,setConfirmPassword] = useState("");



 /*
 ==========================
 HANDLE SIGNUP
 ==========================
 */

 const handleSignup = async () => {

  try{

   if(
    !firstName ||
    !email ||
    !age ||
    !aadhaar ||
    !location ||
    !mobile ||
    !password
   ){

    alert("Please fill all mandatory fields");
    return;

   }


   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

   if(!emailPattern.test(email)){

    alert("Enter valid email");
    return;

   }


   const mobilePattern = /^[0-9]{10}$/;

   if(!mobilePattern.test(mobile)){

    alert("Mobile must be 10 digits");
    return;

   }


   const aadhaarPattern = /^[0-9]{12}$/;

   if(!aadhaarPattern.test(aadhaar)){

    alert("Aadhaar must be 12 digits");
    return;

   }


   if(password !== confirmPassword){

    alert("Passwords do not match");
    return;

   }


   const res = await axios.post(

    `${import.meta.env.VITE_API_URL}/api/auth/signup`,

    {

     profilePic:image,

     firstName,
     lastName,

     email,

     gender,

     age:Number(age),

     aadhaar,

     location,

     mobile,

     password

    }

   );


   /*
   save user session
   */

   sessionStorage.setItem(

    "user",

    JSON.stringify(res.data.user)

   );


   alert("Signup successful");


   /*
   IMPORTANT FIX
   go directly to layout pages
   NOT landing page
   */

   navigate("/home",{ replace:true });

  }

  catch(error){

   alert(

    error.response?.data?.message ||

    "Signup failed"

   );

  }

 };



 /*
 ==========================
 IMAGE UPLOAD
 ==========================
 */

 const handleImageUpload = (e)=>{

  const file = e.target.files[0];

  if(!file) return;

  const reader = new FileReader();

  reader.onloadend = ()=>{

   setImage(reader.result);

  };

  reader.readAsDataURL(file);

 };



 /*
 ==========================
 UI
 ==========================
 */

 return(

  <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10">


   <div className="bg-white w-600px rounded-xl shadow-md p-8">


    {/* header */}

    <div className="text-center mb-6">

     <div className="flex justify-center mb-2">

      <Logo className="w-10 h-10"/>

     </div>

     <h2 className="text-2xl font-bold">

      Create Account

     </h2>

     <p className="text-gray-500 text-sm">

      Join the largest worker community

     </p>

    </div>



    {/* profile image */}

    <div className="flex justify-center mb-6">

     <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center text-gray-400 cursor-pointer overflow-hidden">

      {image ? (

       <img

        src={image}

        className="w-full h-full object-cover"

        alt="profile"

       />

      ) : (

       <FaUpload size={18}/>

      )}


      <input

       type="file"

       accept="image/*"

       onChange={handleImageUpload}

       className="hidden"

      />

     </label>

    </div>



    {/* form */}

    <form className="space-y-4">


     {/* name */}

     <div className="grid grid-cols-2 gap-4">

      <div>

       <label className="text-sm font-medium">

        First Name

       </label>


       <input

        value={firstName}

        onChange={(e)=>setFirstName(e.target.value)}

        className="w-full border px-3 py-2 rounded mt-1"

       />

      </div>



      <div>

       <label className="text-sm font-medium">

        Last Name

       </label>


       <input

        value={lastName}

        onChange={(e)=>setLastName(e.target.value)}

        className="w-full border px-3 py-2 rounded mt-1"

       />

      </div>

     </div>



     {/* email */}

     <div>

      <label className="text-sm font-medium">

       Email

      </label>


      <input

       value={email}

       onChange={(e)=>setEmail(e.target.value)}

       className="w-full border px-3 py-2 rounded mt-1"

      />

     </div>



     {/* gender */}

     <div>

      <label className="text-sm font-medium">

       Gender

      </label>

      <select

       value={gender}

       onChange={(e)=>setGender(e.target.value)}

       className="w-full border px-3 py-2 rounded mt-1"

      >

       <option value="Male">
        Male
       </option>

       <option value="Female">
        Female
       </option>

       <option value="Other">
        Other
       </option>

      </select>

     </div>



     {/* age + aadhaar */}

     <div className="grid grid-cols-2 gap-4">


      <div>

       <label className="text-sm font-medium">

        Age

       </label>


       <input

        type="number"

        value={age}

        onChange={(e)=>setAge(e.target.value)}

        className="w-full border px-3 py-2 rounded mt-1"

       />

      </div>



      <div>

       <label className="text-sm font-medium">

        Aadhaar

       </label>


       <input

        value={aadhaar}

        onChange={(e)=>setAadhaar(e.target.value)}

        className="w-full border px-3 py-2 rounded mt-1"

       />

      </div>

     </div>



     {/* location */}

     <div>

      <label className="text-sm font-medium">

       Location

      </label>


      <input

       value={location}

       onChange={(e)=>setLocation(e.target.value)}

       className="w-full border px-3 py-2 rounded mt-1"

      />

     </div>



     {/* mobile */}

     <div>

      <label className="text-sm font-medium">

       Mobile

      </label>


      <input

       value={mobile}

       onChange={(e)=>setMobile(e.target.value)}

       className="w-full border px-3 py-2 rounded mt-1"

      />

     </div>



     {/* password */}

     <div className="relative">

      <label className="text-sm font-medium">

       Password

      </label>


      <input

       type={showPassword ? "text":"password"}

       value={password}

       onChange={(e)=>setPassword(e.target.value)}

       className="w-full border px-3 py-2 rounded mt-1"

      />


      <span

       onClick={()=>setShowPassword(!showPassword)}

       className="absolute right-3 top-9 cursor-pointer"

      >

       {showPassword ? <FaEyeSlash/> : <FaEye/>}

      </span>

     </div>



     {/* confirm password */}

     <div className="relative">

      <label className="text-sm font-medium">

       Confirm Password

      </label>


      <input

       type={showConfirmPassword ? "text":"password"}

       value={confirmPassword}

       onChange={(e)=>setConfirmPassword(e.target.value)}

       className="w-full border px-3 py-2 rounded mt-1"

      />


      <span

       onClick={()=>setShowConfirmPassword(!showConfirmPassword)}

       className="absolute right-3 top-9 cursor-pointer"

      >

       {showConfirmPassword ? <FaEyeSlash/> : <FaEye/>}

      </span>

     </div>



     {/* submit */}

     <button

      type="button"

      onClick={handleSignup}

      disabled={!password || password!==confirmPassword}

      className={`

       w-full py-3 rounded-md mt-4 text-white

       ${!password || password!==confirmPassword

        ? "bg-gray-400"

        : "bg-blue-600 hover:bg-blue-700"}

      `}

     >

      Sign Up

     </button>



     {/* login */}

     <p className="text-center text-sm text-gray-500 mt-3">

      Already have an account?

      <span

       onClick={()=>navigate("/login")}

       className="text-blue-600 ml-1 cursor-pointer"

      >

       Login

      </span>

     </p>


    </form>


   </div>

  </div>

 );

};

export default Signup;