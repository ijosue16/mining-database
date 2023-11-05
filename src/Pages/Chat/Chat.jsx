import React, {useEffect, useState} from "react";
import Conversation from "./Conversation";
import {useUserChatsQuery} from "../../states/apislice";
import {useSelector} from "react-redux";
import ChatBox from "./ChatBox";
import io from 'socket.io-client';

const socket = io.connect("http://localhost:5001");
const Chat = () => {

    const {userData} = useSelector(state => state.global);
    const {data, isLoading, isSuccess} = useUserChatsQuery({userId: userData._id});
    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [sendMessage, setSendMessage] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [receiveMessage, setReceiveMessage] = useState(null);
    const [lastMessage, setLastMessage] = useState(null);
    const [fetchLastMessage, setFetchLastMessage] = useState(false);
    // const [currentUserTyping, setCurrentUserTyping] = useState({status: false, receiverId: null});


    useEffect(() => {
        socket.emit('new-user-add', userData._id);
        socket.on('get-users', users => {
            setOnlineUsers(users);
        })
    }, [userData]);


    useEffect(() => {
        socket.on('receive-message', data => {
            setReceiveMessage(data);
            setFetchLastMessage(true);
        })
    }, []);

    // useEffect(() => {
    //     if (currentUserTyping) {
    //         socket.emit('current-typing', currentUserTyping);
    //         console.log('command emitted successfully');
    //     }
    // }, [currentUserTyping]);


    useEffect(() => {
        if (sendMessage !== null) {
            socket.emit('send-message', sendMessage);
            setFetchLastMessage(true);
        }
    }, [sendMessage]);

    useEffect(() => {
        if (isSuccess) {
            const {chats: userChats} = data.data;
            setChats(userChats);
        }
    }, [isSuccess]);



    return (
        <div className="flex">
            {/*CHATTING*/}
            <div className="w-1/4 bg-gray-200 h-screen overflow-y-auto rounded-[4px] border-[#e8eaed]">
                {chats.map((chat, index) => (
                    <div key={index} onClick={() => setCurrentChat(chat)}>
                        <Conversation data={chat} currentUser={userData._id}  fetchLastMessage={fetchLastMessage} setFetchLastMessage={setFetchLastMessage}/>
                    </div>
                ))}
            </div>
            <div className="w-full bg-purple-200">
                <ChatBox chat={currentChat} currentUser={userData._id}  setSendMessage={setSendMessage} receivedMessage={receiveMessage}/>
            </div>
        </div>
    )
}

export default Chat;
