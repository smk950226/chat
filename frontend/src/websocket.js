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
}