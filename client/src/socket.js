import { io } from "socket.io-client";

const apiUrl = import.meta.env.VITE_API_URL || window.location.origin;
const socket = io(apiUrl, {
 transports: ["websocket"],   // more stable
 autoConnect: true,
});

export default socket;