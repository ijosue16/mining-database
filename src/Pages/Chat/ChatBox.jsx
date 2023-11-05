import React, {useEffect, useRef, useState} from "react";
import {useGetOneUserQuery, useAddMessageMutation, useLazyGetMessagesQuery} from "../../states/apislice";
// import "./ChatBox.css";
// import { format } from "timeago";
import InputEmoji from 'react-input-emoji'
import {UserOutlined} from "@ant-design/icons";
import {Avatar, message} from "antd";
import {GrAdd} from "react-icons/gr";
// import RelativeTime from "dayjs/plugin/relativeTime";
// import dayjs from "dayjs";
// dayjs.extend(RelativeTime);



const ChatBox = ({chat, currentUser, setSendMessage, receivedMessage, setCurrentUserTyping}) => {
    const userId = chat?.members?.find((id) => id !== currentUser);
    const [getMessages, {isLoading, isSuccess}] = useLazyGetMessagesQuery();
    const {data, isSuccess: isGettingUserSuccess} = useGetOneUserQuery(userId, {skip: !userId});
    const [addMessage, {isError: isAddMessageError, error: addMessageError}] = useAddMessageMutation();

    // respond to failure to send message
    useEffect(() => {
        if (isAddMessageError) {
            const {message: errorMessage} = addMessageError;
            message.error(errorMessage);
        }
    }, [addMessageError, isAddMessageError]);

    const [userData, setUserData] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    const handleChange = (newMessage) => {
        setNewMessage(newMessage);
    }

    useEffect(() => {
        if (receivedMessage !== null && receivedMessage?.chatId === chat?._id) {
            setMessages(prevState => ([...prevState, receivedMessage]));
        }
    }, [receivedMessage]);

    // fetching data for header
    useEffect(() => {
        if (chat !== null) {
            if (isGettingUserSuccess) {
                const { user } = data.data;
                setUserData(user);
            }
        }
    }, [chat, currentUser, isGettingUserSuccess]);

    // fetch messages
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const data = await getMessages({chatId: chat._id});
                const {messages} = data.data.data;
                setMessages(messages);
            } catch (error) {
                console.log(error);
            }
        };

        if (chat !== null) fetchMessages();
    }, [chat]);


    // Always scroll to last Message
    useEffect(() => {
        scroll.current?.scrollIntoView({behavior: "smooth"});
    }, [messages])


    // Send Message
    const handleSend = async (e) => {
        e.preventDefault();
        if (newMessage === "") return;
        const message = {
            senderId: currentUser,
            text: newMessage,
            chatId: chat._id,
        }
        const { data } = await addMessage({body: message});
        const { message: msg } = data.data;
        setMessages(prevState => ([...prevState, msg]));
        setNewMessage("");

        // send message to socket server
        const receiverId = chat?.members?.find((id) => id !== currentUser);
        setSendMessage({...message, receiverId});
        // setCurrentUserTyping({status: false, receiverId: null});

    }

    // useEffect(() => {
    //     window.onclick = () => setCurrentUserTyping({status: false, receiverId: null})
    // }, []);


// Receive Message from parent component
//     useEffect(() => {
//         console.log("Message Arrived: ", receivedMessage)
//         if (receivedMessage !== null && receivedMessage.chatId === chat._id) {
//             setMessages([...messages, receivedMessage]);
//         }
//
//     }, [receivedMessage])


    const scroll = useRef();
    const imageRef = useRef();

    return (
        <>
            <div className="ChatBox-container">
                {chat ? (
                    <>
                        {/* chat-header */}
                        <div className="chat-header">
                            <div className="follower">
                                <div className="flex items-center gap-3">
                                    <Avatar size={40} icon={<UserOutlined/>}/>
                                    <div className="name" style={{fontSize: "0.9rem"}}>
                                        <span>
                                          {userData?.name}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <hr
                                style={{
                                    width: "95%",
                                    border: "0.1px solid #ececec",
                                    marginTop: "20px",
                                }}
                            />
                        </div>
                        {/* chat-body */}
                        <div className="flex flex-col w-full">
                            {messages.map((message, index) => (
                                <div key={index} ref={scroll}
                                     className={`flex ${message.senderId === currentUser ? "bg-amber-200 self-end" : "bg-blue-300"} p-3 rounded-[4px] mb-2 w-fit`}
                                >
                                    <span>{message.text}</span>{""}
                                    {/*<span>{format(message.createdAt)}</span>*/}
                                </div>
                            ))}
                        </div>
                        {/* chat-sender */}
                        <div className="flex items-center">
                            <GrAdd onClick={() => imageRef.current.click()}/>
                            <InputEmoji
                                value={newMessage}
                                onChange={handleChange}
                                // onFocus={() => setCurrentUserTyping({status: true, receiverId: chat?.members?.find((id) => id !== currentUser)})}
                            />
                            <button className="bg-blue-400 p-2 rounded-[4px] text-white" onClick={handleSend}>Send</button>
                            <input
                                type="file"
                                name=""
                                id=""
                                style={{display: "none"}}
                                ref={imageRef}
                            />
                        </div>
                        {" "}
                    </>
                ) : (
                    <span className="chatbox-empty-message">
                        Tap on a chat to start conversation...
                    </span>
                )}
            </div>
        </>
    );
};

export default ChatBox;