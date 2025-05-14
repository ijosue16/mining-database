// import React, {useEffect, useRef, useState} from "react";
// import {useGetOneUserQuery, useAddMessageMutation, useLazyGetMessagesQuery,useCreateChatMutation} from "../../states/apislice";
// import InputEmoji from 'react-input-emoji'
// import { VscSend } from "react-icons/vsc";
// import {UserOutlined} from "@ant-design/icons";
// import {Avatar, message} from "antd";
// import {GrAdd} from "react-icons/gr";
//
//
// const ChatBox = ({chat, currentUser, setSendMessage, receivedMessage, setCurrentUserTyping}) => {
//     const userId = chat?.members?.find((id) => id !== currentUser);
//     const [getMessages, {isLoading, isSuccess}] = useLazyGetMessagesQuery();
//     const {data, isSuccess: isGettingUserSuccess} = useGetOneUserQuery(userId, {skip: !userId});
//     const [addMessage, {isError: isAddMessageError, error: addMessageError}] = useAddMessageMutation();
//     // const [createChat] = useCreateChatMutation({senderId,receiverId});   TO DO LATER  IN THE CHAT
//
//     // respond to failure to send message
//     useEffect(() => {
//         if (isAddMessageError) {
//             const {message: errorMessage} = addMessageError;
//             message.error(errorMessage);
//         }
//     }, [addMessageError, isAddMessageError]);
//
//     const [userData, setUserData] = useState(null);
//     const [messages, setMessages] = useState([]);
//     const [newMessage, setNewMessage] = useState("");
//
//     const handleChange = (newMessage) => {
//         setNewMessage(newMessage);
//     }
//
//     useEffect(() => {
//         if (receivedMessage !== null && receivedMessage?.chatId === chat?._id) {
//             setMessages(prevState => ([...prevState, receivedMessage]));
//         }
//     }, [receivedMessage]);
//
//     // fetching data for header
//     useEffect(() => {
//         if (chat !== null) {
//             if (isGettingUserSuccess) {
//                 const { user } = data.data;
//                 setUserData(user);
//             }
//         }
//     }, [chat, currentUser, isGettingUserSuccess]);
//
//     // fetch messages
//     useEffect(() => {
//         const fetchMessages = async () => {
//             try {
//                 const data = await getMessages({chatId: chat._id});
//                 const {messages} = data.data.data;
//                 setMessages(messages);
//             } catch (error) {
//             }
//         };
//
//         if (chat !== null) fetchMessages();
//     }, [chat]);
//
//
//     // Always scroll to last Message
//     useEffect(() => {
//         scroll.current?.scrollIntoView({behavior: "smooth"});
//     }, [messages])
//
//
//     // Send Message
//     const handleSend = async (e) => {
//         if (newMessage === "") return;
//         const message = {
//             senderId: currentUser,
//             text: newMessage,
//             chatId: chat._id,
//         }
//         const { data } = await addMessage({body: message});
//         const { message: msg } = data.data;
//         setMessages(prevState => ([...prevState, msg]));
//         setNewMessage("");
//
//         // send message to socket server
//         const receiverId = chat?.members?.find((id) => id !== currentUser);
//         setSendMessage({...message, receiverId});
//         // setCurrentUserTyping({status: false, receiverId: null});
//
//     }
//
//
//     const scroll = useRef();
//     const imageRef = useRef();
//
//     return (
//         <>
//             <div className="ChatBox-container w-full h-full overflow-y-hidden overflow-x-hidden relative ">
//                 {chat ? (
//                     <>
//                         {/* chat-header */}
//                         <div className="chat-header border-b shadow-lg p-2 w-full absolute z-20 bg-zinc-700">
//
//                                 <div className="flex items-center gap-3">
//                                     <Avatar size={40} icon={<UserOutlined/>}/>
//                                     <div className="name" style={{fontSize: "0.9rem"}}>
//                                         <span className=" font-bold">
//                                           {userData?.name}
//                                         </span>
//                                     </div>
//                                 </div>
//
//                         </div>
//                         {/* chat-body */}
//                         <div className="flex flex-col h-full w-full py-20 px-2 convo-body gap-2 overflow-y-scroll z-10">
//                             {messages.map((message, index) => (
//                                 <div key={index} ref={scroll}
//                                      className={`${message.senderId === currentUser ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white self-end" : "bg-white"} ps-2 pe-6 pb-[9px] shadow-md pt-1 text-start rounded-[4px] w-fit`}
//                                 >
//                                     <span>{message.text}</span>{""}
//                                     {/*<span>{format(message.createdAt)}</span>*/}
//                                 </div>
//                             ))}
//                         </div>
//                         {/* chat-sender */}
//                         <div className="flex items-center absolute shadow-md bottom-0 w-full z-20 bg-zinc-50">
//                             <GrAdd onClick={() => imageRef.current.click()}/>
//                             <InputEmoji
//                                 value={newMessage}
//                                 onChange={handleChange}
//                                 onEnter={handleSend}
//                                 // onFocus={() => setCurrentUserTyping({status: true, receiverId: chat?.members?.find((id) => id !== currentUser)})}
//                             />
//                             <button className="bg-blue-400 flex items-center gap-1 p-2 rounded-[4px] text-white" onClick={handleSend}>
//                                 <p className="m-0">Send</p>
//                                 <VscSend />
//
//                             </button>
//                             <input
//                                 type="file"
//                                 name=""
//                                 id=""
//                                 style={{display: "none"}}
//                                 ref={imageRef}
//                             />
//                         </div>
//                         {" "}
//                     </>
//                 ) : (
//                     <span className="chatbox-empty-message">
//                         Tap on a chat to start conversation...
//                     </span>
//                 )}
//             </div>
//         </>
//     );
// };
//
// export default ChatBox;



import React, { useEffect, useRef, useState } from "react";
import { useGetOneUserQuery, useAddMessageMutation, useLazyGetMessagesQuery } from "@/states/apislice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Send, PaperclipIcon, SmileIcon } from "lucide-react";
import {useToast} from "@/hooks/use-toast.js";

const ChatBox = ({ chat, currentUser, setSendMessage, receivedMessage }) => {
    const userId = chat?.members?.find((id) => id !== currentUser);
    const [getMessages, { isLoading }] = useLazyGetMessagesQuery();
    const { data, isSuccess: isGettingUserSuccess } = useGetOneUserQuery(userId, { skip: !userId });
    const [addMessage, { isError: isAddMessageError, error: addMessageError }] = useAddMessageMutation();
    const { toast } = useToast();

    const [userData, setUserData] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isSending, setIsSending] = useState(false);

    // Handle errors with toast notifications
    useEffect(() => {
        if (isAddMessageError) {
            toast({
                variant: "destructive",
                title: "Failed to send message",
                description: addMessageError?.message || "Please try again later",
            });
        }
    }, [isAddMessageError, addMessageError, toast]);

    // Handle received messages
    useEffect(() => {
        if (receivedMessage !== null && receivedMessage?.chatId === chat?._id) {
            setMessages(prevMessages => [...prevMessages, receivedMessage]);
        }
    }, [receivedMessage, chat]);

    // Fetch user data for chat header
    useEffect(() => {
        if (chat !== null && isGettingUserSuccess && data?.data?.user) {
            setUserData(data.data.user);
        }
    }, [chat, isGettingUserSuccess, data]);

    // Fetch messages for current chat
    useEffect(() => {
        const fetchMessages = async () => {
            if (!chat?._id) return;

            try {
                const response = await getMessages({ chatId: chat._id });
                if (response?.data?.data?.messages) {
                    setMessages(response.data.data.messages);
                }
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Couldn't load messages",
                    description: "Please check your connection and try again"
                });
            }
        };

        if (chat !== null) fetchMessages();
    }, [chat, getMessages, toast]);

    // Auto-scroll to latest message
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Format timestamp
    const formatMessageTime = (timestamp) => {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Send message handler
    const handleSend = async () => {
        if (!newMessage.trim() || !chat?._id) return;

        const messageData = {
            senderId: currentUser,
            text: newMessage.trim(),
            chatId: chat._id,
        };

        setIsSending(true);

        try {
            const { data } = await addMessage({ body: messageData });
            if (data?.data?.message) {
                setMessages(prevMessages => [...prevMessages, data.data.message]);
            }

            // Send message via socket
            const receiverId = chat.members.find(id => id !== currentUser);
            setSendMessage({ ...messageData, receiverId });

            // Clear input
            setNewMessage("");
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Failed to send message",
                description: "Please try again"
            });
        } finally {
            setIsSending(false);
        }
    };

    // Handle file uploads
    const fileInputRef = useRef(null);

    const handleAttachment = () => {
        fileInputRef.current?.click();
    };

    // Handle key press (Enter to send)
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Render message bubbles with appropriate styling
    const renderMessage = (message, index) => {
        const isSender = message.senderId === currentUser;

        return (
            <div
                key={message._id || index}
                className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-4`}
            >
                {!isSender && (
                    <Avatar className="h-8 w-8 mr-2 mt-1">
                        <AvatarFallback className="bg-gray-300">
                            {userData?.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                )}

                <div className="flex flex-col max-w-xs md:max-w-md lg:max-w-lg">
                    <div
                        className={`px-4 py-2 rounded-2xl ${
                            isSender
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-gray-100 text-gray-800 rounded-bl-none'
                        }`}
                    >
                        <p className="whitespace-pre-wrap break-words">{message.text}</p>
                    </div>
                    <span className={`text-xs mt-1 text-gray-500 ${isSender ? 'text-right' : 'text-left'}`}>
            {formatMessageTime(message.createdAt)}
          </span>
                </div>

                {isSender && (
                    <Avatar className="h-8 w-8 ml-2 mt-1">
                        <AvatarFallback className="bg-blue-300">
                            Me
                        </AvatarFallback>
                    </Avatar>
                )}
            </div>
        );
    };

    // Empty state when no chat is selected
    if (!chat) {
        return (
            <div className="h-full flex-1 flex items-center justify-center p-6 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-center space-y-4">
                    <div className="inline-flex h-20 w-20 rounded-full bg-gray-100 p-4 items-center justify-center">
                        <Send className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">No conversation selected</h3>
                    <p className="text-gray-500 max-w-sm">
                        Select a conversation from the sidebar or start a new chat to begin messaging
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden rounded-lg border border-gray-200 bg-white">
            {/* Chat Header */}
            <div className="border-b px-4 py-3 flex items-center justify-between bg-white shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={userData?.profileImage} />
                        <AvatarFallback className="bg-gray-200 text-gray-700">
                            {userData?.name?.slice(0, 2).toUpperCase() || "?"}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-medium text-gray-900">{userData?.name || "Loading..."}</h3>
                        <p className="text-xs text-gray-500">
                            {userData?.isOnline ? "Online" : "Offline"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4 space-y-4 overflow-y-auto">
                {isLoading ? (
                    <div className="flex justify-center p-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2 p-8">
                        <Card className="p-4 bg-gray-50 border border-dashed">
                            <p className="text-center">No messages yet</p>
                            <p className="text-sm text-center">Send a message to start the conversation</p>
                        </Card>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {messages.map(renderMessage)}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </ScrollArea>

            {/* Message Input */}
            <div className="p-3 border-t bg-white">
                <div className="flex items-center gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="rounded-full"
                                    onClick={handleAttachment}
                                >
                                    <PaperclipIcon className="h-5 w-5 text-gray-500" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Attach a file</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type a message..."
                        className="flex-1 rounded-full"
                    />

                    <Button
                        onClick={handleSend}
                        disabled={!newMessage.trim() || isSending}
                        size="icon"
                        className="rounded-full"
                    >
                        <Send className="h-5 w-5" />
                    </Button>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={(e) => {
                        // Handle file upload logic here
                        console.log(e.target.files);
                        // Reset the input
                        e.target.value = null;
                    }}
                />
            </div>
        </div>
    );
};

export default ChatBox;