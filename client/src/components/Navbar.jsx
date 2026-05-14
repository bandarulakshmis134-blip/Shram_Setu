import { Logo } from "./Logo";
import { useNavigate, NavLink } from "react-router-dom";

import {
 HomeIcon,
 SearchIcon,
 JobsIcon,
 DashboardIcon,
 MessageIcon,
 ProfileIcon
} from "./icons/NavIcons";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

const Navbar = () => {

 const navigate = useNavigate();
 const { t } = useTranslation();

 /*
 SAFE USER PARSE
 */

 const getUserFromStorage = () => {

  try {

   const data = sessionStorage.getItem("user");

   if(!data || data === "undefined"){

    return null;

   }

   return JSON.parse(data);

  }

  catch{

   return null;

  }

 };


 const user = getUserFromStorage();


 /*
 LOGOUT
 */

 const handleLogout = () => {

  sessionStorage.removeItem("user");

  localStorage.removeItem("token");

  navigate("/");

 };


 return (

  <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">


   {/* LOGO */}

   <div className="flex items-center gap-2">

    <Logo className="w-8 h-8"/>

    <h1 className="text-2xl font-bold text-gray-800">

     Shram <span className="text-blue-600">Setu</span>

    </h1>

   </div>



   {/* NAV LINKS */}

   <div className="flex items-center gap-6 text-gray-700">

    <ul className="flex items-center gap-6">


     <NavLink
      to="/home"
      className={({isActive})=>
       `flex items-center gap-2
       ${isActive
        ? "text-blue-600 font-semibold"
        : "text-gray-700 hover:text-blue-600"
       }`
      }
     >

      <HomeIcon size={18}/>

     {t("home")}

     </NavLink>



     <NavLink
      to="/find-workers"
      className={({isActive})=>
       `flex items-center gap-2
       ${isActive
        ? "text-blue-600 font-semibold"
        : "text-gray-700 hover:text-blue-600"
       }`
      }
     >

      <SearchIcon size={18}/>

      {t("findWorkers")}

     </NavLink>



     <NavLink
      to="/post-jobs"
      className={({isActive})=>
       `flex items-center gap-2
       ${isActive
        ? "text-blue-600 font-semibold"
        : "text-gray-700 hover:text-blue-600"
       }`
      }
     >

      <JobsIcon size={18}/>

      {t("postJob")}

     </NavLink>



     <NavLink
      to="/dashboard"
      className={({isActive})=>
       `flex items-center gap-2
       ${isActive
        ? "text-blue-600 font-semibold"
        : "text-gray-700 hover:text-blue-600"
       }`
      }
     >

      <DashboardIcon size={18}/>

     {t("dashboard")}

     </NavLink>



     {/* RESTORED MESSAGES */}

     <NavLink
      to="/messages"
      className={({isActive})=>
       `flex items-center gap-2
       ${isActive
        ? "text-blue-600 font-semibold"
        : "text-gray-700 hover:text-blue-600"
       }`
      }
     >

      <MessageIcon size={18}/>

      {t("messages")}

     </NavLink>



     <NavLink
      to="/profile"
      className={({isActive})=>
       `flex items-center gap-2
       ${isActive
        ? "text-blue-600 font-semibold"
        : "text-gray-700 hover:text-blue-600"
       }`
      }
     >

      <ProfileIcon size={18}/>

     {t("profile")}

     </NavLink>

     <LanguageSwitcher />


    </ul>

   </div>



   {/* LOGIN / LOGOUT BUTTON */}

   <div>

    {user ? (

     <button

      onClick={handleLogout}

      className="border border-red-500 text-red-500 px-4 py-1 rounded-md hover:bg-red-500 hover:text-white"

     >

      Logout

     </button>

    ) : (

     <button

      onClick={()=>navigate("/login")}

      className="border border-blue-600 text-blue-600 px-4 py-1 rounded-md hover:bg-blue-600 hover:text-white"

     >

      Login

     </button>

    )}

   </div>


  </nav>

 );

};


export default Navbar;