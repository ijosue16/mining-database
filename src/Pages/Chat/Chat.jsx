// import React, {useEffect, useState, useContext} from "react";
// import Conversation from "./Conversation";
// import {useUserChatsQuery, useGetAllUsersQuery} from "@/states/apislice.js";
// import {useSelector} from "react-redux";
// import ChatBox from "./ChatBox";
// import {SocketContext} from "@/context files/socket.js";
// import {FiEdit} from "react-icons/fi";
// import {IoFilterOutline} from "react-icons/io5";
// import NewUSerChart from "./NewUserChat";
//
// const Chat = () => {
//     const socket = useContext(SocketContext);
//     const {userData} = useSelector(state => state.persistedReducer.global);
//     const {data, isLoading, isSuccess} = useUserChatsQuery({userId: userData._id},
//         {
//             refetchOnMountOrArgChange: true,
//             refetchOnReconnect: true
//         }
//     );
//     const [chats, setChats] = useState([]);
//     const [currentChat, setCurrentChat] = useState(null);
//     const [sendMessage, setSendMessage] = useState(null);
//     const [onlineUsers, setOnlineUsers] = useState([]);
//     const [receiveMessage, setReceiveMessage] = useState(null);
//     const [lastMessage, setLastMessage] = useState(null);
//     const [fetchLastMessage, setFetchLastMessage] = useState(false);
//     const [newUserModal, setNewUserModal] = useState(false);
//     const [users, setUsers] = useState([]);
//
//     useEffect(() => {
//         socket.emit('new-user-add', {
//             userId: userData._id,
//             username: userData.username,
//             role: userData.role,
//             permissions: userData.permissions
//         });
//         socket.on('get-users', users => {
//             setOnlineUsers(users);
//         })
//     }, [socket, userData]);
//
//     useEffect(() => {
//         socket.on('receive-message', data => {
//             setReceiveMessage(data);
//             setFetchLastMessage(true);
//         })
//     }, [socket]);
//
//     useEffect(() => {
//         if (sendMessage !== null) {
//             socket.emit('send-message', sendMessage);
//             setFetchLastMessage(true);
//         }
//     }, [sendMessage]);
//
//     useEffect(() => {
//         if (isSuccess) {
//             const {chats: userChats} = data.data;
//             setChats(userChats);
//         }
//     }, [isSuccess, data]);
//
//     return (
//         <>
//             <div className="flex h-full space-y-3 item">
//                 {/*CHATTING*/}
//                 <div
//                     className="w-1/4 bg-zinc-50 overflow-y-hidden rounded-[4px] p-2 rounded-tr-none rounded-br-none border-r border-gray-200 ">
//                     <div className="add chatt flex justify-between items-center p-2">
//                         <p className=" font-bold text-xl">Chats</p>
//                         <div className="flex justify-end items-center">
//                             <span className=" p-4 hover:bg-gray-300 rounded-md relative" onClick={() => setNewUserModal(!newUserModal)}>
//                               <FiEdit/>
//                             </span>
//                                 <NewUSerChart visible={newUserModal} setChats={setChats} chats={chats}
//                                               setNewUserModal={setNewUserModal} position={"top-36 left-60"}/>
//                                 <span className=" p-4 hover:bg-gray-300 rounded-md">
//                               <IoFilterOutline/>
//                             </span>
//                         </div>
//                     </div>
//                     {chats.map((chat, index) => (
//                         <div key={index} onClick={() => setCurrentChat(chat)}>
//                             <Conversation fetch={isLoading} data={chat} currentUser={userData._id}
//                                           fetchLastMessage={fetchLastMessage}
//                                           setFetchLastMessage={setFetchLastMessage}/>
//                         </div>
//                     ))}
//                 </div>
//                 <ChatBox chat={currentChat} currentUser={userData._id} setSendMessage={setSendMessage}
//                          receivedMessage={receiveMessage}/>
//             </div>
//         </>
//     )
// }
//
// export default Chat;


import React, { useEffect, useState, useContext } from "react";
import { useUserChatsQuery } from "@/states/apislice.js";
import { useSelector } from "react-redux";
import { SocketContext } from "@/context files/socket.js";

// Import improved components
import Conversation from "./Conversation";
import ChatBox from "./ChatBox";
import NewUSerChart from "./NewUserChat";

// Import Shadcn UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {useToast} from '@/hooks/use-toast.js'

// Import icons
import {
    PlusCircle,
    Search,
    Menu,
    MessageSquare,
    Filter,
    ChevronLeft
} from "lucide-react";
import {Skeleton} from "@/components/ui/skeleton.jsx";

const Chat = () => {
    const socket = useContext(SocketContext);
    const { userData } = useSelector(state => state.persistedReducer.global);
    const { toast } = useToast();

    const { data, isLoading, isSuccess } = useUserChatsQuery(
        { userId: userData._id },
        {
            refetchOnMountOrArgChange: true,
            refetchOnReconnect: true
        }
    );

    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [sendMessage, setSendMessage] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [receiveMessage, setReceiveMessage] = useState(null);
    const [fetchLastMessage, setFetchLastMessage] = useState(false);
    const [newUserModal, setNewUserModal] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(true);

    // Connect to socket and listen for online users
    useEffect(() => {
        socket.emit('new-user-add', {
            userId: userData._id,
            username: userData.username,
            role: userData.role,
            permissions: userData.permissions
        });

        socket.on('get-users', users => {
            setOnlineUsers(users);
        });

        return () => {
            socket.off('get-users');
        };
    }, [socket, userData]);

    // Listen for incoming messages
    useEffect(() => {
        socket.on('receive-message', data => {
            setReceiveMessage(data);
            setFetchLastMessage(true);

            // Show notification if the message is not from current chat
            if (currentChat?._id !== data.chatId) {
                toast({
                    title: "New message",
                    description: `${data.senderName || 'Someone'}: ${data.text.substring(0, 30)}${data.text.length > 30 ? '...' : ''}`,
                });
            }
        });

        return () => {
            socket.off('receive-message');
        };
    }, [socket, currentChat, toast]);

    // Send message via socket
    useEffect(() => {
        if (sendMessage !== null) {
            socket.emit('send-message', sendMessage);
            setFetchLastMessage(true);
        }
    }, [sendMessage, socket]);

    // Update chats when data is fetched
    useEffect(() => {
        if (isSuccess && data?.data?.chats) {
            setChats(data.data.chats);
        }
    }, [isSuccess, data]);

    // Filter chats based on search text
    const filteredChats = searchText.trim()
        ? chats.filter(chat => {
            // This is simplified - in reality you would search based on user data
            // that's associated with each chat
            return true; // Replace with actual search logic
        })
        : chats;

    // Check if a user is online
    const isUserOnline = (userId) => {
        return onlineUsers.some(user => user.userId === userId);
    };

    const handleChatClick = (chat) => {
        setCurrentChat(chat);
        // On mobile, hide the sidebar when a chat is selected
        if (window.innerWidth < 768) {
            setIsMobileMenuOpen(false);
        }
    };

    const handleBackToList = () => {
        setIsMobileMenuOpen(true);
    };

    return (
        <div className="flex flex-col md:flex-row h-full overflow-hidden bg-gray-50">
            {/* Sidebar - chats list */}
            <div className={`
        ${isMobileMenuOpen ? 'flex' : 'hidden'} 
        md:flex 
        w-full md:w-80 lg:w-96 
        border-r border-gray-200 
        bg-white
        h-full
        flex-col
        flex-shrink-0
      `}>
                {/* Sidebar header */}
                <div className="p-4 border-b">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            <span>Chats</span>
                        </h2>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setNewUserModal(!newUserModal)}
                                className="relative"
                            >
                                <PlusCircle className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon">
                                <Filter className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Search conversations..."
                            className="pl-9"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>
                </div>

                {/* Chats list */}
                <ScrollArea className="flex-1 px-2 py-3">
                    {isLoading ? (
                        // Skeleton loaders for chats
                        <div className="space-y-3">
                            {[1, 2, 3, 4, 5].map((_, index) => (
                                <div key={index} className="flex items-center gap-3 p-2">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-4 w-2/3" />
                                        <Skeleton className="h-3 w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredChats.length > 0 ? (
                        <div className="space-y-1">
                            {filteredChats.map((chat) => {
                                const isOnline = isUserOnline(
                                    chat.members.find(id => id !== userData._id)
                                );

                                return (
                                    <div
                                        key={chat._id}
                                        onClick={() => handleChatClick(chat)}
                                    >
                                        <Conversation
                                            data={chat}
                                            currentUser={userData._id}
                                            fetch={false}
                                            online={isOnline}
                                            fetchLastMessage={fetchLastMessage}
                                            setFetchLastMessage={setFetchLastMessage}
                                            isActive={currentChat?._id === chat._id}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500 space-y-3">
                            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                                <MessageSquare className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-center">No conversations found</p>
                            {searchText.trim() ? (
                                <p className="text-sm">Try a different search term</p>
                            ) : (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setNewUserModal(true)}
                                >
                                    Start a new chat
                                </Button>
                            )}
                        </div>
                    )}
                </ScrollArea>

                {/* New User Modal */}
                <NewUSerChart
                    visible={newUserModal}
                    setNewUserModal={setNewUserModal}
                    chats={chats}
                    setChats={setChats}
                    currentUser={userData._id}
                    position="top-20 left-4"
                />
            </div>

            {/* Chat Area */}
            <div className={`
        ${!isMobileMenuOpen ? 'flex' : 'hidden'} 
        md:flex 
        flex-col 
        flex-1 
        h-full
      `}>
                {/* Mobile back button - only visible on mobile when chat is open */}
                <div className="md:hidden p-2 bg-white border-b">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBackToList}
                        className="flex items-center gap-2"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Back to chats</span>
                    </Button>
                </div>

                {/* Chat Box */}
                <ChatBox
                    chat={currentChat}
                    currentUser={userData._id}
                    setSendMessage={setSendMessage}
                    receivedMessage={receiveMessage}
                />
            </div>
        </div>
    );
};

export default Chat;