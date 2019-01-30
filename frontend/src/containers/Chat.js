import React from 'react';
import { connect } from 'react-redux';
import WebSocketInstance from '../websocket';
import Hoc from '../hoc/hoc';

class Chat extends React.Component {
    initializeChat(){
        this.waitForSocketConnection(() => {
            // WebSocketInstance.addCallbacks(this.setMessages.bind(this), this.addMessage.bind(this));
            WebSocketInstance.fetchMessages(this.props.currentUser, this.props.match.params.chatID);
        })
        WebSocketInstance.connect(this.props.match.params.chatID)
    }

    constructor(props){
        super(props);
        this.initializeChat();
    }

    state = {
        message: ''
    }

    componentWillReceiveProps(newProps){
        if(this.props.match.params.chatID !== newProps.match.params.chatID){
            WebSocketInstance.disconnect();
            this.waitForSocketConnection(() => {
                WebSocketInstance.fetchMessages(this.props.currentUser, newProps.match.params.chatID);
            })
            WebSocketInstance.connect(newProps.match.params.chatID)
        }
    }

    componentDidMount(){
        this.scrollToBottom();
    }

    componentDidUpdate(){
        this.scrollToBottom();
    }

    waitForSocketConnection = (callback) => {
        const comopnent = this;
        setTimeout(
            function(){
                if (WebSocketInstance.state() === 1){
                    console.log('connection is secure');
                    callback();
                    return;
                }
                else{
                    console.log('waiting for connection...');
                    comopnent.waitForSocketConnection(callback);
                }
            }, 100);
    }

    // setMessages = (messages) => {
    //     this.setState({
    //         messages: messages.reverse()
    //     })
    // }

    // addMessage = (message) => {
    //     this.setState({
    //         messages: [...this.state.messages, message]
    //     })
    // }

    renderTimestamp = timestamp => {
        let prefix = '';
        const timeDiff = Math.round((new Date().getTime() -  new Date(timestamp))/60000);
        if(timeDiff < 60 && timeDiff >= 0){
            prefix = `${timeDiff} minutes ago`;
        }
        else if(timeDiff < 24*60 && timeDiff >= 60){
            prefix = `${Math.round(timeDiff/60)} hours ago`;
        }
        else if(timeDiff < 31*24*60 && timeDiff >= 24*60){
            prefix = `${Math.round(timeDiff/(60*24))} days ago`;
        }
        else{
            prefix = `${new Date(timestamp)}`;
        }
        return prefix
    }

    renderMessages = (messages) => {
        const currentUser = this.props.username;
        return messages.map((message, i, arr) => (
            <li key = {message.id} style={{marginBottom: arr.length - 1 === i ? '300px' : '15px'}} className={message.user === currentUser ? 'sent' : 'replies'}>
                <img src="http://emilcarlsson.se/assets/mikeross.png" />
                <p>
                    {message.content}<br/>
                    <small>{this.renderTimestamp(message.timestamp)}</small>
                </p>
            </li>
        ))
    }

    messageChangeHandler = event => {
        this.setState({
            message: event.target.value
        })
    }

    sendMessageHandler = e => {
        e.preventDefault();
        const messageObject = {
            from_user: this.props.username,
            content: this.state.message,
            chatId: this.props.match.params.chatID
        }
        WebSocketInstance.newChatMessage(messageObject);
        this.setState({
            message: ''
        })
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: 'smooth'})
    }

    render(){
        const messages = this.state.messages;
        return(
            <Hoc>                
                <div className="messages">
                    <ul id="chat-log">
                    { 
                        this.props.messages && 
                        this.renderMessages(this.props.messages) 
                    }
                    <div style={{float: 'left', clear: 'both'}} ref={(el) => {this.messagesEnd = el;}}></div>
                    </ul>
                </div>
                <div className="message-input">
                    <form onSubmit={this.sendMessageHandler}>
                        <div className="wrap">
                            <input 
                                onChange={this.messageChangeHandler}
                                value={this.state.message}
                                required 
                                id="chat-message-input" 
                                type="text" 
                                placeholder="Write your message..." />
                            <i className="fa fa-paperclip attachment" aria-hidden="true"></i>
                            <button id="chat-message-submit" className="submit">
                                <i className="fa fa-paper-plane" aria-hidden="true"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </Hoc>
        )
    }
}

const mapStateToProps = state => {
    return {
        username: state.auth.username,
        messages: state.message.messages
    }
}

export default connect(mapStateToProps)(Chat); 