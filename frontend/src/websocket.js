class WebSocketService {
    constructor(){
        this.socketRef = null;
    }

    static instance = null;
    callbacks = {};

    static getInstance(){
        if(!WebSocketService.instance){
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }

    connect(){
        const path = 'ws://127.0.0.1:8000/ws/chat/hi';
        this.socketRef = new WebSocket(path);

        this.socketRef.onopen = () => {
            console.log('open');
        };

        this.socketRef.onmessage = e => {

        };

        this.socketRef.onerror = e => {
            console.log(e.message);
        };

        this.socketRef.onclose = () => {
            console.log('close');
            this.connect();
        };

        socketNewMessage = data => {
            const parsedData = JSON.parse(data);
            const command = parsedData.command;
            if (Object.keys(this.callbacks).length === 0){
                return;
            }
            if (command === 'messages'){
                this.callbacks[command](parsedData.messages);
            }
            if(command === 'new_message'){
                this.callbacks[command](parsedData.message);
            }
        }

        fetchMessages = (username) => {
            this.sendMessage({command: 'fetch_messages', username: username})
        };

        newChatMessage = (message) => {
            this.sendMessage({command: 'new_message', from_user: message.from_user, message: message.content})
        }

        addCallbacks = (messagesCallback, newMessageCallback) =>{
            this.callbacks['messages'] = messagesCallback;
            this.callbacks['new_message'] = newMessageCallback;
        }

        sendMessage = (data) => {
            try{
                this.socketRef.send(JSON.stringify({...data}))
            }
            catch (err){
                console.log(err.message)
            }
        }
        
        waitForSocketConnection = (callback) => {
            const socket = this.socketRef;
            const recursion = this.waitForSocketConnection;
            setTimeout(
                function(){
                    if (socket.readyState === 1){
                        console.log('connection is secure');
                        if (callback != null){
                            callback();
                        }
                        return;
                    }
                    else{
                        console.log('waiting for connection...');
                        recursion(callback);
                    }
                }, 1
            );
        }
    }
}

const WebSocketInstance = WebSocketService.getInstance();

export default WebSocketInstance;