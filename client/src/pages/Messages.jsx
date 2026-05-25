import {
 useEffect,
 useState,
 useRef,
 useCallback,
 useLayoutEffect
} from "react";

import {
 useLocation
} from "react-router-dom";

import socket from "../socket";

import axios from "../utils/axiosInstance";

import {
 Logo
} from "../components/Logo";

import RequestModal
 from "../components/findWorkers/RequestModal";

const Messages = ()=>{

 const location =
  useLocation();

 const user = JSON.parse(

  sessionStorage.getItem(
   "user"
  ) || "null"

 );

 /*
 =====================
 STATES
 =====================
 */
 const [messages,setMessages] =
  useState([]);

 const [text,setText] =
  useState("");

 const [users,setUsers] =
  useState([]);

 const [

  selectedUser,
  setSelectedUser

 ] = useState(

  location.state?.user || null

 );

 const [search,setSearch] =
  useState("");

 const [showModal,setShowModal] =
  useState(false);

 /*
 =====================
 REFS
 =====================
 */
 const inputRef =
  useRef(null);

 const messagesEndRef =
  useRef(null);
 const messagesContainerRef =
 useRef(null);

/*
=====================
INSTANT SCROLL
ON CHAT OPEN
=====================
*/
useLayoutEffect(()=>{

 if(

  messagesContainerRef.current &&

  selectedUser

 ){

  const container =

   messagesContainerRef.current;

  /*
  OPEN DIRECTLY
  AT BOTTOM
  */
  container.scrollTop =

   container.scrollHeight;

 }

},[
   selectedUser
]);

/*
=====================
SMOOTH SCROLL
NEW MESSAGES
=====================
*/
useEffect(()=>{

 if(messagesEndRef.current){

  messagesEndRef.current
   .scrollIntoView({

    behavior:"smooth"

   });

 }

},[
   messages
]);

 /*
 =====================
 JOIN SOCKET
 =====================
 */
 useEffect(()=>{

  if(!user?._id){

   return;

  }

  socket.emit(

   "join",

   user._id

  );

 },[user?._id]);

 /*
 =====================
 FETCH USERS
 =====================
 */
 const fetchUsers =
  useCallback(

   async ()=>{

    try{

     const res =
      await axios.get(

       `${import.meta.env.VITE_API_URL}/api/messages/conversations`,

       {

        params:{

         userId:user._id

        }

       }

      );

     const sortedUsers =

      (res.data || [])

       .sort((a,b)=>{

        return new Date(

         b.lastMessageTime || 0

        ) -

        new Date(

         a.lastMessageTime || 0

        );

       });

     setUsers((prev)=>{

      const oldData =
       JSON.stringify(prev);

      const newData =
       JSON.stringify(
        sortedUsers
       );

      return oldData !== newData

       ? sortedUsers

       : prev;

     });

    }

    catch(error){

     console.log(error);

    }

   },

   [user?._id]

  );

/*
=====================
INITIAL LOAD
=====================
*/
useEffect(()=>{

 if(!user?._id){

  return;

 }

 const loadUsers =
  async ()=>{

   await fetchUsers();

  };

 loadUsers();

},[
   user?._id,
   fetchUsers
]);

 /*
 =====================
 RECEIVE MESSAGE
 =====================
 */
 useEffect(()=>{

  const handleReceive =
   async (msg)=>{

    const incomingSenderId =

     typeof msg.senderId === "object"

      ? msg.senderId._id

      : msg.senderId;

    /*
    IGNORE OWN MESSAGE
    */
    if(
     incomingSenderId ===
     user._id
    ){

     return;

    }

    /*
    CURRENT OPEN CHAT
    */
    if(

     selectedUser &&

     incomingSenderId ===
     selectedUser._id

    ){

     setMessages((prev)=>{

      const alreadyExists =

       prev.some(

        (m)=>

         m._id === msg._id

       );

      if(alreadyExists){

       return prev;

      }

      return [

       ...prev,

       msg

      ];

     });

     /*
     MARK AS SEEN
     */
     await axios.put(

      `${import.meta.env.VITE_API_URL}/api/messages/seen`,

      {

       senderId:
        incomingSenderId,

       receiverId:
        user._id

      }

     );

    }

    /*
    REFRESH USERS
    */
    fetchUsers();

   };

  socket.on(

   "receiveMessage",

   handleReceive

  );

  return ()=>{

   socket.off(

    "receiveMessage",

    handleReceive

   );

  };

 },[
    selectedUser,
    user?._id,
    fetchUsers
 ]);

 /*
 =====================
 FETCH MESSAGES
 =====================
 */
 useEffect(()=>{

  if(

   !selectedUser ||

   !user?._id

  ){

   return;

  }

  const fetchMessages =
   async ()=>{

    try{

     const res =
      await axios.get(

       `${import.meta.env.VITE_API_URL}/api/messages`,

       {

        params:{

         userId:
          user._id,

         receiverId:
          selectedUser._id

        }

       }

      );

     setMessages(
      res.data || []
     );

     /*
     MARK AS SEEN
     */
     await axios.put(

      `${import.meta.env.VITE_API_URL}/api/messages/seen`,

      {

       senderId:
        selectedUser._id,

       receiverId:
        user._id

      }

     );

     /*
     REFRESH USERS
     */
     fetchUsers();

     inputRef.current
      ?.focus();

    }

    catch(error){

     console.log(error);

    }

   };

  fetchMessages();

 },[
    selectedUser,
    user?._id,
    fetchUsers
 ]);

 /*
 =====================
 SEND MESSAGE
 =====================
 */
 const sendMessage =
  async ()=>{

   if(

    !text.trim() ||

    !selectedUser

   ){

    return;

   }

   try{

    const msg = {

     senderId:
      user._id,

     receiverId:
      selectedUser._id,

     text,

     createdAt:
      new Date()
      .toISOString(),

     isSeen:false

    };

    /*
    SAVE TO DATABASE
    */
    const res =
     await axios.post(

      `${import.meta.env.VITE_API_URL}/api/messages/send`,

      msg

     );

    /*
    LOCAL UPDATE
    */
    setMessages((prev)=>{

     const alreadyExists =

      prev.some(

       (m)=>

        m._id ===
        res.data.newMessage._id

      );

     if(alreadyExists){

      return prev;

     }

     return [

      ...prev,

      res.data.newMessage

     ];

    });

    /*
    REALTIME DELIVERY
    */
    socket.emit(

     "sendMessage",

     res.data.newMessage

    );

    /*
    REFRESH USERS
    */
    fetchUsers();

    setText("");

   }

   catch(error){

    console.log(error);

   }

  };

 /*
 =====================
 FILTER USERS
 =====================
 */
 const filteredUsers =
  users.filter((u)=>

   (u.name || "")

    .toLowerCase()

    .includes(

     (search || "")
      .toLowerCase()

    )

  );

 /*
 =====================
 FORMAT TIME
 =====================
 */
 const formatTime =
  (time)=>{

   if(!time){

    return "";

   }

   return new Date(
    time
   ).toLocaleTimeString([],{

    hour:"2-digit",

    minute:"2-digit"

   });

  };

 /*
 =====================
 SAFE WORKER
 =====================
 */
 const modalWorker =
  selectedUser?.isWorker

   ? {

      _id:

       selectedUser.workerId ||

       selectedUser._id,

      firstName:
       selectedUser.name

     }

   : null;

 return(

  <div className="flex h-[calc(100vh-64px)] bg-gray-100 overflow-hidden">

   {/* SIDEBAR */}
   <div className="w-[320px] bg-white border-r flex flex-col">

    {/* HEADER */}
    <div className="p-4 border-b flex items-center gap-2">

     <Logo />

     <h2 className="text-lg font-bold">

      Messages

     </h2>

    </div>

    {/* SEARCH */}
    <div className="p-3 border-b">

     <input

      value={search}

      onChange={(e)=>
       setSearch(
        e.target.value
       )
      }

      placeholder="Search..."

      className="w-full border px-3 py-2 rounded text-sm"

     />

    </div>

    {/* USERS */}
    <div className="flex-1 overflow-y-auto">

     {filteredUsers.map((u)=>(

      <div

       key={u._id}

       onClick={()=>
        setSelectedUser(u)
       }

       className={`p-3 border-b cursor-pointer hover:bg-gray-50 transition ${
        selectedUser?._id ===
        u._id

         ? "bg-blue-50"

         : ""
       }`}

      >

       <div className="flex items-center justify-between">

        <div className="min-w-0">

         <p className="font-medium truncate">

          {u.name}

         </p>

         <p className="text-xs text-gray-500 truncate w-52">

          {u.lastMessage ||
           "No messages yet"}

         </p>

        </div>

        <div className="flex flex-col items-end gap-1">

         <p className="text-xs text-gray-400">

          {u.lastMessageTime

           ? formatTime(
              u.lastMessageTime
             )

           : ""}

         </p>

         {u.unreadCount > 0 && (

          <span className="bg-blue-600 text-white text-xs min-w-5 h-5 px-1 rounded-full flex items-center justify-center">

           {u.unreadCount}

          </span>

         )}

        </div>

       </div>

      </div>

     ))}

    </div>

   </div>

   {/* CHAT AREA */}
   <div className="flex-1 flex flex-col overflow-hidden">

    {!selectedUser ? (

     <div className="flex items-center justify-center h-full text-gray-400">

      Select a conversation

     </div>

    ) : (

     <>

      {/* TOP BAR */}
      <div className="p-4 border-b bg-white flex justify-between items-center shadow-sm">

       <h3 className="font-semibold text-lg">

        {selectedUser.name}

       </h3>

      {selectedUser?.isWorker && (

 <button

  onClick={()=>
   setShowModal(true)
  }

  className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg"

 >

  Send Request

 </button>

)}
      </div>

      {/* MESSAGES */}
      <div

      ref={messagesContainerRef}

     className="flex-1 p-4 overflow-y-auto space-y-4 scroll-smooth">
       {messages.map((m,i)=>{

        const senderId =

         typeof m.senderId === "object"

          ? m.senderId._id

          : m.senderId;

        const isMine =

         senderId === user._id;

        /*
        =====================
        DATE LABEL
        =====================
        */
        const currentDate =
         new Date(
          m.createdAt
         ).toDateString();

        const previousDate =
         i > 0

          ? new Date(

             messages[i - 1]
              .createdAt

            ).toDateString()

          : null;

        const showDate =
         currentDate !==
         previousDate;

        return(

         <div
          key={m._id || i}
         >

          {/* DATE */}
          {showDate && (

           <div className="flex justify-center my-4">

            <div className="bg-gray-200 text-gray-600 text-xs px-4 py-1 rounded-full shadow-sm">

             {new Date(
              m.createdAt
             ).toLocaleDateString([],{

              day:"numeric",

              month:"long",

              year:"numeric"

             })}

            </div>

           </div>

          )}

          {/* MESSAGE */}
          <div

           className={`flex ${
            isMine

             ? "justify-end"

             : "justify-start"
           }`}

          >

           <div className="max-w-xs">

            {/* BUBBLE */}
            <div

             className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${
              isMine

               ? "bg-blue-600 text-white rounded-br-md"

               : "bg-white border rounded-bl-md"
             }`}

            >

             {m.text}

            </div>

            {/* TIME + STATUS */}
            <div className={`text-xs text-gray-400 mt-1 flex items-center gap-1 ${
             isMine
              ? "justify-end"
              : "justify-start"
            }`}>

             <span>

              {m.createdAt

               ? formatTime(
                  m.createdAt
                 )

               : ""}

             </span>

             {isMine && (

              <span className="text-blue-500">

               {m.isSeen
                ? "✔✔"
                : "✔"}

              </span>

             )}

            </div>

           </div>

          </div>

         </div>

        );

       })}

       <div
        ref={messagesEndRef}
       />

      </div>

      {/* INPUT */}
      <div className="p-3 border-t bg-white flex gap-2">

       <input

        ref={inputRef}

        value={text}

        onChange={(e)=>
         setText(
          e.target.value
         )
        }

        onKeyDown={(e)=>{

         if(e.key === "Enter"){

          sendMessage();

         }

        }}

        placeholder="Type a message..."

        className="flex-1 border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

       />

       <button

        onClick={sendMessage}

        className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-lg"

       >

        Send

       </button>

      </div>

     </>

    )}

   </div>

   {/* REQUEST MODAL */}
   {showModal && modalWorker && (

    <RequestModal

     worker={modalWorker}

     onClose={()=>
      setShowModal(false)
     }

    />

   )}

  </div>

 );

};

export default Messages;