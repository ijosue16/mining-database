// import React, { useState } from "react";
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import {
//   useGetOneUserQuery,
//   useLazyLastMessageQuery,
// } from "@/states/apislice.js";
// import { Avatar } from "antd";
// import { Skeleton } from "antd";
// const Conversation = ({
//                         data,
//                         currentUser,
//                         fetch,
//                         online,
//                         fetchLastMessage,
//                         setFetchLastMessage,
//                       }) => {
//   const userId = data.members.find((id) => id !== currentUser);
//   const { data: userInfo, isSuccess: isGettingUserSuccess } =
//       useGetOneUserQuery(userId, {
//         refetchOnMountOrArgChange: true,
//         refetchOnReconnect: true,
//       });
//   const [getLastMessage, { isSuccess }] = useLazyLastMessageQuery();
//   const [lastMessage, setLastMessage] = useState(null);
//   const [user, setUser] = useState(null);
//   const dispatch = useDispatch();
//
//   const fetchPreviousMessage = async () => {
//     const response = await getLastMessage({ chatId: data._id });
//     const { message } = response.data.data;
//     if (message) {
//       setLastMessage(message[0]);
//     }
//   };
//
//   useEffect(() => {
//     fetchPreviousMessage();
//     setFetchLastMessage(false);
//   }, []);
//
//   // fetch user data
//   useEffect(() => {
//     if (fetchLastMessage) {
//       fetchPreviousMessage();
//       setFetchLastMessage(false);
//     }
//   }, [data, fetchLastMessage]);
//
//   useEffect(() => {
//     if (isGettingUserSuccess) {
//       const { user } = userInfo.data;
//       setUser(user);
//     }
//   }, [isGettingUserSuccess]);
//   return (
//       <>
//         <div className="follower conversation">
//
//           {fetch?(<div className="flex items-center gap-2 hover:bg-gray-300 rounded-md py-3 px-2">
//             <Skeleton.Avatar active size={40}/>
//             <div className="w-fit text-center flex flex-col items-center justify-center">
//               <Skeleton.Input active size={12} block/>
//               <Skeleton.Input active size={12} />
//             </div>
//
//
//           </div>):(<div className="flex items-center gap-2 hover:bg-gray-300 rounded-md py-3 px-2">
//             {/*{online && <div className="online-dot"/>}*/}
//             <Avatar size={40}>{user?.name.slice(0, 2)}</Avatar>
//             <div className="name flex flex-col">
//             <span className=" font-semibold" style={{ fontSize: "1rem" }}>
//               {user?.name}
//             </span>
//               <span style={{ fontSize: "0.8rem" }}>
//               {lastMessage?.senderId === currentUser
//                   ? `You: ${lastMessage?.text}`
//                   : lastMessage?.text}
//             </span>
//               {/*<span style={{color: online?"#51e200":"", marginRight: 5}}>{online? "Online" : "Offline"}</span>*/}
//             </div>
//           </div>)}
//           {/*CONVERSATION*/}
//         </div>
//         {/* <hr style={{ width: "85%", border: "0.1px solid #ececec" }} /> */}
//       </>
//   );
// };
//
// export default Conversation;


import React, { useState, useEffect } from "react";
import { useGetOneUserQuery, useLazyLastMessageQuery } from "@/states/apislice.js";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const Conversation = ({
                          data,
                          currentUser,
                          fetch,
                          online,
                          fetchLastMessage,
                          setFetchLastMessage,
                          isActive = false
                      }) => {
    const userId = data.members.find((id) => id !== currentUser);
    const { data: userInfo, isSuccess: isGettingUserSuccess } =
        useGetOneUserQuery(userId, {
            refetchOnMountOrArgChange: true,
            refetchOnReconnect: true,
        });
    const [getLastMessage, { isSuccess }] = useLazyLastMessageQuery();
    const [lastMessage, setLastMessage] = useState(null);
    const [user, setUser] = useState(null);

    const fetchPreviousMessage = async () => {
        const response = await getLastMessage({ chatId: data._id });
        const { message } = response.data.data;
        if (message) {
            setLastMessage(message[0]);
        }
    };

    useEffect(() => {
        fetchPreviousMessage();
        setFetchLastMessage(false);
    }, []);

    useEffect(() => {
        if (fetchLastMessage) {
            fetchPreviousMessage();
            setFetchLastMessage(false);
        }
    }, [data, fetchLastMessage]);

    useEffect(() => {
        if (isGettingUserSuccess) {
            const { user } = userInfo.data;
            setUser(user);
        }
    }, [isGettingUserSuccess]);

    // Format timestamp (placeholder - you may want to add a proper date formatting function)
    const getMessageTime = () => {
        return lastMessage?.createdAt ? new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    };

    return (
        <div
            className={`p-3 transition-colors duration-200 hover:bg-gray-100 rounded-lg cursor-pointer mb-1 ${isActive ? 'bg-gray-100 border-l-4 border-blue-500' : ''}`}
        >
            {fetch ? (
                <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Avatar className="h-12 w-12 border border-gray-200">
                            <AvatarImage src={user?.profilePicture || ""} alt={user?.name || "User"} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                                {user?.name?.slice(0, 2).toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                        {online && (
                            <Badge className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />
                        )}
                    </div>

                    <div className="flex-1 overflow-hidden space-y-1">
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-900 truncate">{user?.name}</span>
                            {lastMessage && (
                                <span className="text-xs text-gray-500">{getMessageTime()}</span>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                            {lastMessage ? (
                                lastMessage.senderId === currentUser ? (
                                    <span className="flex items-center gap-1">
                    <span className="text-xs text-gray-400">You:</span> {lastMessage.text}
                  </span>
                                ) : (
                                    lastMessage.text
                                )
                            ) : (
                                <span className="text-gray-400 italic">No messages yet</span>
                            )}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Conversation;
