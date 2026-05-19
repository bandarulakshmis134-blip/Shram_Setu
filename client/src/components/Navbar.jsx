import {
 useEffect,
 useRef,
 useState,
 useCallback
} from "react";

import {
 Bell
} from "lucide-react";

import { Logo } from "./Logo";

import {
 useNavigate,
 NavLink
} from "react-router-dom";

import axios from "axios";

import {

 HomeIcon,
 SearchIcon,
 JobsIcon,
 DashboardIcon,
 MessageIcon,
 ProfileIcon

} from "./icons/NavIcons";

import LanguageSwitcher from "./LanguageSwitcher";

import {
 useTranslation
} from "react-i18next";

const Navbar = () => {

 const navigate =
  useNavigate();

 const { t } =
  useTranslation();

 /*
 ========================
 SAFE USER PARSE
 ========================
 */
 const getUserFromStorage =
  ()=>{

   try{

    const data =
     sessionStorage.getItem(
      "user"
     );

    if(

     !data ||

     data === "undefined"

    ){

     return null;

    }

    return JSON.parse(data);

   }

   catch{

    return null;

   }

  };

 const user =
  getUserFromStorage();

 /*
 ========================
 STATES
 ========================
 */
 const [
  notifications,
  setNotifications
 ] = useState([]);

 const [
  showNotifications,
  setShowNotifications
 ] = useState(false);

 const dropdownRef =
  useRef(null);

 /*
 ========================
 FETCH NOTIFICATIONS
 ========================
 */
 const fetchNotifications =
  useCallback(

   async ()=>{

    try{

     if(!user?.token){

      return;

     }

     const res =
      await axios.get(

       `${import.meta.env.VITE_API_URL}/api/notifications/user`,

       {

        headers:{

         Authorization:
          `Bearer ${user.token}`

        }

       }

      );

     setNotifications(
      res.data || []
     );

    }

    catch(error){

     console.log(error);

    }

   },

   [user?.token]

  );

 /*
 ========================
 INITIAL LOAD
 ========================
 */
 useEffect(()=>{

  let interval;

  const loadNotifications =
   async ()=>{

    await fetchNotifications();

    interval =
     setInterval(

      fetchNotifications,

      10000

     );

   };

  loadNotifications();

  return ()=>{

   if(interval){

    clearInterval(
     interval
    );

   }

  };

 },[
    fetchNotifications
 ]);

 /*
 ========================
 CLOSE DROPDOWN
 ========================
 */
 useEffect(()=>{

  const handleClickOutside =
   (event)=>{

    if(

     dropdownRef.current &&

     !dropdownRef.current.contains(
      event.target
     )

    ){

     setShowNotifications(
      false
     );

    }

   };

  document.addEventListener(

   "mousedown",

   handleClickOutside

  );

  return ()=>{

   document.removeEventListener(

    "mousedown",

    handleClickOutside

   );

  };

 },[]);

 /*
 ========================
 MARK AS READ
 ========================
 */
 const markNotificationRead =
  async (notification)=>{

   try{

    await axios.put(

     `${import.meta.env.VITE_API_URL}/api/notifications/${notification._id}/read`,

     {},

     {

      headers:{

       Authorization:
        `Bearer ${user.token}`

      }

     }

    );

  /*
REMOVE NOTIFICATION
AFTER OPENING
*/
setNotifications((prev)=>

 prev.filter(

  (n)=>

   n._id !==
   notification._id

 )

);

    if(notification.link){

     navigate(
      notification.link
     );

    }

   }

   catch(error){

    console.log(error);

   }

  };

 /*
 ========================
 UNREAD COUNT
 ========================
 */
 const unreadCount =
  notifications.filter(

   (n)=>!n.isRead

  ).length;

 /*
 ========================
 LOGOUT
 ========================
 */
 const handleLogout =
  ()=>{

   sessionStorage.removeItem(
    "user"
   );

   localStorage.removeItem(
    "token"
   );

   navigate("/");

  };

 return(

  <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm relative">

   {/* LOGO */}
   <div className="flex items-center gap-2">

    <Logo className="w-8 h-8"/>

    <h1 className="text-2xl font-bold text-gray-800">

     Shram{" "}

     <span className="text-blue-600">

      Setu

     </span>

    </h1>

   </div>

   {/* NAV LINKS */}
   <div className="flex items-center gap-6 text-gray-700">

    <ul className="flex items-center gap-6">

     <NavLink
      to="/home"
      className={({isActive})=>

       `flex items-center gap-2
       ${

        isActive

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
       ${

        isActive

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
       ${

        isActive

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
       ${

        isActive

         ? "text-blue-600 font-semibold"

         : "text-gray-700 hover:text-blue-600"

       }`

      }
     >

      <DashboardIcon size={18}/>

      {t("dashboard")}

     </NavLink>

     <NavLink
      to="/messages"
      className={({isActive})=>

       `flex items-center gap-2
       ${

        isActive

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
       ${

        isActive

         ? "text-blue-600 font-semibold"

         : "text-gray-700 hover:text-blue-600"

       }`

      }
     >

      <ProfileIcon size={18}/>

      {t("profile")}

     </NavLink>

     {/* NOTIFICATIONS */}
     <div
      className="relative"
      ref={dropdownRef}
     >

    <button

 onClick={async ()=>{

  /*
  IF DROPDOWN IS OPEN
  AND USER CLOSES IT
  */
  if(

   showNotifications &&

   notifications.length > 0

  ){

   try{

    await axios.delete(

     `${import.meta.env.VITE_API_URL}/api/notifications/clear`,

     {

      headers:{

       Authorization:
        `Bearer ${user.token}`

      }

     }

    );

    /*
    CLEAR UI
    */
    setNotifications([]);

   }

   catch(error){

    console.log(error);

   }

  }

  /*
  TOGGLE DROPDOWN
  */
  setShowNotifications(

   !showNotifications

  );

 }}

 className="relative"
>

       <Bell size={22}/>

       {unreadCount > 0 && (

        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full min-w-5 h-5 flex items-center justify-center px-1">

         {unreadCount}

        </span>

       )}

      </button>

      {/* DROPDOWN */}
      {showNotifications && (

       <div className="absolute right-0 mt-3 w-80 bg-white shadow-xl rounded-xl border z-50 max-h-96 overflow-y-auto">

        <div className="p-4 border-b font-semibold">

         Notifications

        </div>

        {notifications.length === 0 ? (

         <p className="p-4 text-sm text-gray-500">

          No notifications

         </p>

        ) : (

         notifications.map((notification)=>(

          <div

           key={notification._id}

           onClick={()=>

            markNotificationRead(
             notification
            )

           }

           className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition

           ${

            !notification.isRead

             ? "bg-blue-50"

             : ""

           }`}

          >

           <p className="text-sm">

            {notification.message}

           </p>

           <p className="text-xs text-gray-400 mt-1">

            {new Date(

             notification.createdAt

            ).toLocaleString()}

           </p>

          </div>

         ))

        )}

       </div>

      )}

     </div>

     <LanguageSwitcher />

    </ul>

   </div>

   {/* LOGIN / LOGOUT */}
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

      onClick={()=>
       navigate("/login")
      }

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