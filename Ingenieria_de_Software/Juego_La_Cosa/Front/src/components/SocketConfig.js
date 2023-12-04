import { websocketManager } from "./Endpoints";

export var socket = null;

export function startWebsocket(user_name) {
    socket = websocketManager(`/websocket/${user_name}`)
    socket.onclose = (event) => {
        console.log('disconnected');
        socket = null;
    };  
}

