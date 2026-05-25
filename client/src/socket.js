import { io } from "socket.io-client";

const apiUrl =
 import.meta.env.VITE_API_URL ||
 window.location.origin;

const socket = io(

 apiUrl,

 {

  transports:["websocket"],

  autoConnect:true,

  reconnection:true,

  reconnectionAttempts:5,

  reconnectionDelay:1000,

  timeout:20000

 }

);

export default socket;