import {
 useEffect,
 useRef,
 useState
} from "react";

import axios from "../axiosInstance";

import {
 MessageCircle,
 Send,
 Sparkles,
 ArrowLeft
} from "lucide-react";

import {
 useLocation
} from "react-router-dom";

import {
 useTranslation
} from "react-i18next";

import botImage from "../assets/kaiyo-bot.png";

const AIAssistant = () => {

 const location = useLocation();

 const { t,i18n } =
  useTranslation();

 /*
 ========================
 STATES
 ========================
 */
 const [open,setOpen] =
  useState(false);

 const [message,setMessage] =
  useState("");

 const [loading,setLoading] =
  useState(false);

 const [messages,setMessages] =
  useState([

   {
    sender:"ai",

    text:
     "Hi 👋 I'm KAIYO. How can I help you today?"
   }

  ]);

 /*
 ========================
 DRAGGING
 ========================
 */
 const [position,setPosition] =
  useState({
   x:24,
   y:24
  });

 const dragging =
  useRef(false);

 const offset =
  useRef({
   x:0,
   y:0
  });

 /*
 ========================
 CHAT SCROLL
 ========================
 */
 const chatContainerRef =
  useRef(null);

 /*
 ========================
 AUTO SCROLL
 ========================
 */
 useEffect(()=>{

  if(chatContainerRef.current){

   chatContainerRef.current.scrollTop =

    chatContainerRef.current.scrollHeight;

  }

 },[messages,loading]);

 /*
 ========================
 DRAG START
 ========================
 */
 const handleMouseDown = (e)=>{

  dragging.current = true;

  offset.current = {

   x:
    window.innerWidth -
    e.clientX -
    position.x,

   y:
    window.innerHeight -
    e.clientY -
    position.y

  };

 };

 /*
 ========================
 DRAGGING
 ========================
 */
 useEffect(()=>{

  const handleMouseMove = (e)=>{

   if(!dragging.current) return;

   setPosition({

    x:
     window.innerWidth -
     e.clientX -
     offset.current.x,

    y:
     window.innerHeight -
     e.clientY -
     offset.current.y

   });

  };

  const handleMouseUp = ()=>{

   dragging.current = false;

  };

  window.addEventListener(
   "mousemove",
   handleMouseMove
  );

  window.addEventListener(
   "mouseup",
   handleMouseUp
  );

  return ()=>{

   window.removeEventListener(
    "mousemove",
    handleMouseMove
   );

   window.removeEventListener(
    "mouseup",
    handleMouseUp
   );

  };

 },[position]);

 /*
 ========================
 SEND MESSAGE
 ========================
 */
 const sendMessage = async ()=>{

  if(!message.trim()) return;

  const currentMessage =
   message;

  const user = JSON.parse(

   sessionStorage.getItem("user")

  );

  /*
  USER MESSAGE
  */
  setMessages(prev => [

   ...prev,

   {
    sender:"user",
    text:currentMessage
   }

  ]);

  setMessage("");

  try{

   setLoading(true);

   const res = await axios.post(

    `${import.meta.env.VITE_API_URL}/api/ai/chat`,

    {
     message:currentMessage,
     userId:user?._id,
     language:i18n.language
    }

   );

   /*
   AI REPLY
   */
   setMessages(prev => [

    ...prev,

    {
     sender:"ai",
     text:res.data.reply
    }

   ]);

  }

  catch(error){

   console.log(error);

   setMessages(prev => [

    ...prev,

    {
     sender:"ai",

     text:
      "Something went wrong. Please try again."
    }

   ]);

  }

  finally{

   setLoading(false);

  }

 };

 /*
 ========================
 HIDE ON THESE PAGES
 ========================
 */
 const hiddenRoutes = [

  "/",
  "/login",
  "/signup"

 ];

 const shouldHide =

  hiddenRoutes.includes(
   location.pathname
  );

 if(shouldHide){

  return null;

 }

 return (

  <>

   {/* FLOATING BOT */}
   <div

    onMouseDown={handleMouseDown}

    style={{
     right:`${position.x}px`,
     bottom:`${position.y}px`
    }}

    className="fixed z-[9999] cursor-grab active:cursor-grabbing"

   >

    {!open && (

     <button

      onClick={()=>setOpen(true)}

      className="relative group"

     >

      {/* GLOW */}
      <div className="absolute inset-0 bg-blue-400 rounded-full blur-3xl opacity-40 animate-pulse" />

      {/* BOT */}
      <div className="relative">

       <div className="absolute inset-0 bg-blue-400 blur-3xl opacity-30 rounded-full animate-pulse" />

       <img
        src={botImage}
        alt="KAIYO"
        className="w-28 h-28 object-contain relative animate-bounce drop-shadow-2xl select-none pointer-events-none"
        draggable={false}
       />

      </div>

     </button>

    )}

   </div>

   {/* CHAT WINDOW */}
   {open && (

    <div

     style={{
      right:`${position.x}px`,
      bottom:`20px`
     }}

     className="fixed z-[9999] w-[390px] h-[620px] max-h-[85vh] bg-white rounded-[32px] shadow-2xl overflow-hidden border border-gray-200 flex flex-col"

    >

     {/* HEADER */}
     <div className="bg-blue-600 px-5 py-4 text-white shrink-0">

      <div className="flex items-center gap-3">

       {/* BACK */}
       <button

        onClick={()=>setOpen(false)}

        className="hover:bg-white/20 p-2 rounded-xl transition"

       >

        <ArrowLeft size={18}/>

       </button>

       {/* BOT IMAGE */}
       <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg overflow-hidden shrink-0">

        <img
         src={botImage}
         alt="KAIYO"
         className="w-12 h-12 object-contain"
        />

       </div>

       {/* TITLE */}
       <div>

        <h2 className="font-semibold text-lg">

         KAIYO

        </h2>

        <p className="text-xs text-blue-100 flex items-center gap-1">

         <Sparkles size={12}/>

         {t("smartAssistant")}

        </p>

       </div>

      </div>

     </div>

     {/* CHAT AREA */}
     <div

      ref={chatContainerRef}

      className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-5 bg-gray-50 space-y-4"

     >

      {messages.map((msg,index)=>(

       <div

        key={index}

        className={`flex ${

         msg.sender === "user"

          ? "justify-end"

          : "justify-start"

        }`}

       >

        <div

         className={`max-w-[80%] break-words px-4 py-3 rounded-3xl text-sm shadow-sm transition-all duration-300

         ${

          msg.sender === "user"

           ? "bg-blue-600 text-white rounded-br-md"

           : "bg-white border border-gray-200 text-gray-700 rounded-bl-md"

         }`}

        >

         {msg.text}

        </div>

       </div>

      ))}

      {/* LOADING */}
      {loading && (

       <div className="flex items-center gap-2 text-gray-400 text-sm animate-pulse">

        <MessageCircle size={16}/>

        KAIYO is typing...

       </div>

      )}

     </div>

     {/* QUICK ACTIONS */}
     <div className="px-3 py-2 border-t bg-white flex gap-2 overflow-x-auto shrink-0">

      {[
       "Find electrician",
       "Suggest budget",
       "Write job description"
      ].map((prompt)=>(

       <button

        key={prompt}

        onClick={()=>
         setMessage(prompt)
        }

        className="whitespace-nowrap text-xs bg-blue-50 text-blue-600 px-3 py-2 rounded-full hover:bg-blue-100 transition"

       >

        {prompt}

       </button>

      ))}

     </div>

     {/* INPUT */}
     <div className="p-3 border-t bg-white flex items-center gap-2 shrink-0">

      <input

       value={message}

       onChange={(e)=>
        setMessage(e.target.value)
       }

       onKeyDown={(e)=>{

        if(e.key === "Enter"){

         sendMessage();

        }

       }}

       placeholder={t("kaiyoPlaceholder")}

       className="flex-1 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"

      />

      <button

       onClick={sendMessage}

       className="bg-blue-600 hover:bg-blue-700 transition text-white p-3 rounded-2xl shadow-md"

      >

       <Send size={18}/>

      </button>

     </div>

    </div>

   )}

  </>

 );

};

export default AIAssistant;