import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "https://ecom-backend.plusdistribution.in/"; 

class SocketService {
  constructor() {
    this.socket = null;
  }

  initializeSocket() {
    if (!this.socket) {
      this.socket = io(SOCKET_SERVER_URL, {
        transports: ["websocket"],
      });

      this.socket.on("connect", () => {
        console.log("Connected to socket server:", this.socket.id);
      });

      this.socket.on("disconnect", () => {
        console.log("Disconnected from socket server");
      });
    }
    return this.socket;
  }

  disconnectSocket() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinChatRoom(room) {
    if (this.socket) {
      this.socket.emit("join", room);
    }
  }

  sendMessage(message, room) {
    if (this.socket) {
      this.socket.emit("message", { room, ...message });
    }
  }

  sendTypingIndicator(room) {
    if (this.socket) {
      this.socket.emit("typing", room);
    }
  }
}

const socketService = new SocketService();
export default socketService;
