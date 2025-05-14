// import React, {useState, useEffect, useRef} from "react";
// import { Avatar } from "antd";
// import { UserOutlined } from "@ant-design/icons";
// import { useCreateChatMutation, useGetAllUsersQuery } from "@/states/apislice.js";
// import { Skeleton } from "antd";
// import { useSelector } from "react-redux";
// import {toInitialCase} from "@/components/helperFunctions.js";
//
// const NewUSerChart = ({ chats, currentUser, setChats, visible, position, setNewUserModal }) => {
//   const {userData}=useSelector(state => state.persistedReducer.global);
//   const { data, isLoading, isSuccess, isError, error } = useGetAllUsersQuery();
//   const [createNewChart,{isLoading:isCreating,isSuccess:isDone,isError:isFail,error:fail}]=useCreateChatMutation();
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [searchInput, setSearchInput] = useState("");
//   const [existingChats, setExistingChats] = useState([]);
//
//   let newChatRef = useRef();
//
//   const handleClickOutside = (event) => {
//     if (!newChatRef.current || !newChatRef.current.contains(event.target)) {
//       setNewUserModal(false);
//     }
//   };
//
//   useEffect(() => {
//     document.addEventListener("click", handleClickOutside, true);
//     return () => {
//       document.removeEventListener("click", handleClickOutside, true);
//     };
//   }, []);
//
//   useEffect(() => {
//     if (chats) {
//       setExistingChats(chats.map(chat => chat.members.find(member => member !== currentUser)));
//     }
//   }, [chats]);
//
//   useEffect(() => {
//     if (isSuccess) {
//       const { users } = data.data;
//       const filterUsers = users.filter((user) => user.name.toLowerCase().includes(searchInput.toLowerCase()) && user._id !== userData._id && !existingChats.includes(user._id));
//       setFilteredUsers(filterUsers);
//     }
//   }, [isSuccess, data, searchInput]);
//
//   const handleSearchInputChange = (e) => {
//     setSearchInput(e.target.value);
//   };
//   const handleNewChartUser = async (id) => {
//     const body={senderId:userData._id,receiverId:id};
//     console.log(body);
//     const existingChats = chats.map(chat => chat.members.find(member => member.toString() !== userData._id.toString()));
//     if (existingChats.includes(id.toString())) {
//       setNewUserModal(!visible);
//       return;
//     }
//     const response = await createNewChart({body});
//     if (response) {
//         const { newChat } = response.data.data;
//         setChats(prevState => ([...prevState, newChat]));
//         setNewUserModal(!visible);
//     }
//     setNewUserModal(!visible);
//   };
//
//
//   return (
//     <>
//       <div
//         className={`rounded-md shadow-lg h-96 max-w-72 absolute ${position} bg-gray-200 z-50 p-2 space-y-1 ${
//           visible ? "block" : "hidden"
//         }`}
//         ref={newChatRef}
//       >
//         <p className=" text-lg font-bold">New Chat</p>
//         <input
//           type="text"
//           name="filteredUser"
//           className="w-full px-2 py-1 rounded-md focus:outline-none"
//           onChange={handleSearchInputChange}
//           value={searchInput}
//         />
//
//         <div className=" space-y-2 max-h-[290px] w-full overflow-y-auto">
//           <p>All Contacts</p>
//           {filteredUsers.length > 0 ? (
//             filteredUsers.map(({ name, role, _id }) => (
//               <div
//                 key={_id}
//                 className="flex items-center gap-3"
//                 onClick={currentUser}
//               >
//                 {isLoading ?(
//                   <>
//                     <Skeleton.Avatar active size={40} />
//                     <Skeleton.Input active />
//                   </>
//                 ): (
//                   <div className="flex gap-2" onClick={()=>{handleNewChartUser(_id)}}>
//                     <Avatar size={40} icon={<UserOutlined />} />
//                     <div
//                       className="name flex flex-col"
//                       style={{ fontSize: "0.9rem" }}
//                     >
//                       <span className=" font-bold">{name}</span>
//                       <span className="">{toInitialCase(role)}</span>
//                     </div>
//                   </div>
//                 ) }
//               </div>
//             ))
//           ) : (
//             <>
//                 <Skeleton.Avatar active size={40} />
//                 <Skeleton.Input active />
//             </>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };
//
// export default NewUSerChart;


import React, { useState, useEffect, useRef } from "react";
import { useCreateChatMutation, useGetAllUsersQuery } from "@/states/apislice.js";
import { useSelector } from "react-redux";
import { toInitialCase } from "@/components/helperFunctions.js";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserPlus, Search, Loader2 } from "lucide-react";
import {useToast} from "@/hooks/use-toast.js";

const NewUSerChart = ({ chats, setChats, visible, position, setNewUserModal }) => {
    const { userData } = useSelector(state => state.persistedReducer.global);
    const { data, isLoading, isSuccess } = useGetAllUsersQuery();
    const [createNewChart, { isLoading: isCreating }] = useCreateChatMutation();
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [existingChats, setExistingChats] = useState([]);
    const { toast } = useToast();
    const newChatRef = useRef();

    const handleClickOutside = (event) => {
        if (newChatRef.current && !newChatRef.current.contains(event.target)) {
            setNewUserModal(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    }, []);

    useEffect(() => {
        if (chats) {
            setExistingChats(chats.map(chat =>
                chat.members.find(member => member !== userData._id)
            ));
        }
    }, [chats, userData._id]);

    useEffect(() => {
        if (isSuccess && data?.data?.users) {
            const { users } = data.data;
            const filterUsers = users.filter(user =>
                user.name.toLowerCase().includes(searchInput.toLowerCase()) &&
                user._id !== userData._id &&
                !existingChats.includes(user._id)
            );
            setFilteredUsers(filterUsers);
        }
    }, [isSuccess, data, searchInput, userData._id, existingChats]);

    const handleSearchInputChange = (e) => {
        setSearchInput(e.target.value);
    };

    const handleNewChartUser = async (id) => {
        try {
            // Check if chat already exists
            const existingChatIds = chats.map(chat =>
                chat.members.find(member => member !== userData._id)
            );

            if (existingChatIds.includes(id)) {
                toast({
                    title: "Error",
                    description: "You already have a chat with this user",
                });
                setNewUserModal(false);
                return;
            }

            const body = { senderId: userData._id, receiverId: id };
            const response = await createNewChart({ body });

            if (response?.data?.data?.newChat) {
                const { newChat } = response.data.data;
                setChats(prevState => ([...prevState, newChat]));
                toast({
                    title: "Chat created",
                    description: "You can now start messaging",
                });
                setNewUserModal(false);
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Failed to create chat",
                description: "Please try again later",
            });
        }
    };

    if (!visible) return null;

    return (
        <Card
            className={`absolute ${position} shadow-lg w-72 z-50`}
            ref={newChatRef}
        >
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    <span>New Chat</span>
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 pb-2">
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        type="text"
                        placeholder="Search users..."
                        className="pl-8"
                        value={searchInput}
                        onChange={handleSearchInputChange}
                    />
                </div>

                <Separator />

                <div className="text-sm font-medium text-gray-500">Contacts</div>

                <ScrollArea className="h-64 pr-3">
                    {isLoading ? (
                        <div className="flex flex-col gap-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center gap-3 animate-pulse">
                                    <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredUsers.length > 0 ? (
                        <div className="space-y-1">
                            {filteredUsers.map((user) => (
                                <Button
                                    key={user._id}
                                    variant="ghost"
                                    className="w-full justify-start p-2 h-auto"
                                    onClick={() => handleNewChartUser(user._id)}
                                    disabled={isCreating}
                                >
                                    <div className="flex items-center gap-3 w-full">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={user.profilePicture || ""} alt={user.name} />
                                            <AvatarFallback className="bg-blue-100 text-blue-800">
                                                {user.name.slice(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="text-left overflow-hidden">
                                            <div className="font-medium truncate">{user.name}</div>
                                            <div className="text-xs text-gray-500 flex items-center">
                                                <Badge variant="outline" className="font-normal text-xs">
                                                    {toInitialCase(user.role)}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </Button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p>No users found</p>
                            <p className="text-sm">Try a different search term</p>
                        </div>
                    )}
                </ScrollArea>

                {isCreating && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default NewUSerChart;