import React, {useState, useRef, useEffect, useMemo, useContext} from "react";
import {BsSearch, BsThreeDots} from "react-icons/bs";
import {
    PiGlobeSimpleLight,
    PiCaretRightLight,
    PiUser,
    PiBellSimpleLight,
    PiEnvelopeLight,
    PiGearLight
} from "react-icons/pi";
import {useNavigate} from "react-router-dom";
import {Drawer, Space, Button, Badge, notification, message} from "antd";
import {
    useGetNotificationsQuery,
    useUpdateNotificationStatusMutation,
    useVerifyTokenMutation,
    useGetOneUserQuery,
    useGetAllEditRequestsQuery
} from "../states/apislice";
import {useSelector, useDispatch} from "react-redux";
import {SocketContext} from "../context files/socket";
import {BiSolidCalendarEdit} from "react-icons/bi";
import {setPermissions, setUserData, setAuthToken} from "../states/slice";
import {IoChatbubbleEllipsesOutline} from "react-icons/io5";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar.jsx";
import {
    ChevronRight, User,
    Settings,
    LogOut,
} from 'lucide-react';


const Appbar = ({handleUserSubmenuMobile, userSubmenuMobile}) => {
    const navigate = useNavigate();
    const [userSubmenu, setUserSubmenu] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [user, setUser] = useState(null);
    const [open, setOpen] = useState(false);
    const {userData, permissions: userPermissions, token} = useSelector(state => state.persistedReducer?.global);
    const [userId, setUserId] = useState(null);
    const socket = useContext(SocketContext);
    const dispatch = useDispatch();
    const [pendingEditRequests, setPendingEditRequests] = useState([]);

    const openNotification = ({message, description, type}) => {
        notification.open({
            message,
            description,
            placement: "topRight",
            type
        });
    };

    useEffect(() => {
        socket.on("new-edit-request", data => {
            openNotification({
                message: "New Edit Request",
                description: `${data.username} has requested to edit incorrect data. Please review his/her request and make decision`,
                type: "info"
            });
        })

        socket.on("request-authorized", data => {
            openNotification({
                message: "Request Authorized",
                description: `Your edit request has been authorized. Please keep in mind that you have limited time to make changes`,
                type: "success"
            });
        })

        socket.on("request-rejected", data => {
            openNotification({
                message: "Request Rejected",
                description: `Your edit request has been rejected. Please contact admin for more information`,
                type: "warning"
            });
        })
    }, [socket]);


    useEffect(() => {
        if (userData) {
            setUserId(userData._id);
        }
    }, [userData])

    const [verifyToken, {
        data: verifyTokenData,
        isSuccess: verifyTokenSuccess,
        isError: isTokenError,
        error: tokenError
    }] = useVerifyTokenMutation();
    const {data, isLoading, isSuccess} = useGetNotificationsQuery(userId,
        {
            skip: userId === null,
            refetchOnMountOrArgChange: true,
            refetchOnReconnect: true
        }
    );
    const [updateNotificationStatus, {isSuccess: updateSuccess}] = useUpdateNotificationStatusMutation();

    const {data: userDataObj, isLoading: userLoading, isSuccess: userSuccess} = useGetOneUserQuery(userId, {
        skip: userId === null,
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true
    })

    const {
        data: editRequests,
        isLoading: editRequestsLoading,
        isSuccess: editRequestsSuccess
    } = useGetAllEditRequestsQuery({query: "requestStatus=pending"}, {
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true
    })

    const handleLogout = () => {
        dispatch(setUserData(null));
        dispatch(setPermissions(null));
        dispatch(setAuthToken(null));
        message.success("You have been logged out successfully");
        navigate('/login');
    };

    useEffect(() => {
        if (isTokenError) {
            const {message: errorMessage} = tokenError.data;
            dispatch(setUserData(null));
            dispatch(setPermissions(null));
            dispatch(setAuthToken(null));
            message.error(`${errorMessage}, please log in again!`);
            return navigate('/login');
        }
    }, [isTokenError, tokenError]);

    useEffect(() => {
        if (editRequestsSuccess || updateSuccess) {
            const {editRequests: editRequestsArray} = editRequests.data;
            setPendingEditRequests(editRequestsArray);
        }
    }, [editRequestsSuccess, editRequests, updateSuccess]);

    useEffect(() => {
        const verifyLoginToken = async () => {
            if (token) {
                const response = await verifyToken({token});
                if (response.data?.data) {
                    const {userId: currentUserId} = response.data.data;
                    if (!currentUserId) {
                        dispatch(setUserData(null));
                        dispatch(setPermissions(null));
                        dispatch(setAuthToken(null));
                        message.error("Your session has ended. Please login again");
                        return navigate("/login");
                    }
                }
            }
        };

        verifyLoginToken();

        const intervalId = setInterval(() => {
            verifyLoginToken();
        }, 20000);

        return () => clearInterval(intervalId);
    }, [token]);


    const getInitials = (name) => {
        if (!name) return "U";
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    useEffect(() => {
        if (userSuccess || updateSuccess) {
            const {user} = userDataObj.data;
            if (user) {
                setUser(user);
                dispatch(setUserData(user));
                dispatch(setPermissions(user.permissions));
            }
        }
    }, [userId, userSuccess, userDataObj, updateSuccess]);


    let modalRef = useRef();
    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
        setNotifications(data.data.notifications[0].notifications.slice(0, 10));
    };


    useEffect(() => {
        if (isSuccess || updateSuccess) {
            const {notifications: notificationsObj} = data.data;
            if (notificationsObj.length > 0) {
                const {notifications: notificationsArray} = notificationsObj[0];
                setNotifications(notificationsArray.slice(0, 10));
            }
        }
    }, [isSuccess, data, updateSuccess]);


    const handleClickOutside = (event) => {
        if (!modalRef.current || !modalRef.current.contains(event.target)) {
            setUserSubmenu(false);
        }
    };

    const readMessage = async (notificationId) => {
        await updateNotificationStatus({userId, notificationId});
        // if (updateSuccess) {
        //     const newNotification = notifications.find(item => item._id  === notificationId);
        //     if (newNotification) {
        //         setNotifications(prevState => ([...prevState, {...newNotification, read: true}]));
        //     }
        //     const updateNotifications = notifications.map(notification => {
        //         if (notification._id === notificationId) {
        //             return {...notification, read: true};
        //
        //         }
        //     })
        //
        // }
    }

    const navigateToLink = (link) => {
        setOpen(false);
        navigate(link);
    }


    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };

    }, []);

    return (
        <>
            {/* App bar */}
            <div className="  w-full fixed flex z-10 bg-white p-2 items-center justify-between h-16 px-10 border-b">
                <div
                    className={`logo ml-12 dark:text-white  transform ease-in-out duration-300 flex-none h-full flex items-center justify-center`}>
                    SOEMC LTD
                </div>


                <div className="hidden relative flex-none h-full text-center sm:flex items-center justify-center">
                    {userData ? <ul className="flex items-center justify-evenly gap-4 ">
                        {/*<li className=" relative p-2 w-[36px] h-[36px] bg-slate-100 flex items-center justify-center rounded-lg">*/}
                        {/*    <PiGlobeSimpleLight className="text-xl text-gray-500" />*/}

                        {/*</li>*/}
                        <li onClick={() => navigate('/chat')} title={"Chats"}
                            className=" relative p-2 w-[36px] h-[36px] bg-slate-100 flex items-center justify-center rounded-lg">
                            <IoChatbubbleEllipsesOutline className="text-xl text-gray-500"/>
                            {/*<span className="absolute w-[20px] h-[20px] rounded-full bg-slate-800 -top-1 -right-1 border-2 border-white text-white flex items-center justify-center text-xs">4</span>*/}
                        </li>
                        {userPermissions?.editRequests?.view && (<li title="Edit Requests"
                                                                     className=" relative p-2 w-[36px] h-[36px] bg-slate-100 flex items-center justify-center rounded-lg">
                            <BiSolidCalendarEdit onClick={() => navigateToLink("/edit-requests")}
                                                 className="text-xl text-gray-500"/>
                            <span
                                className="absolute w-[20px] h-[20px] rounded-full bg-slate-800 -top-1 -right-1 border-2 border-white text-white flex items-center justify-center text-xs">{pendingEditRequests?.length}</span>
                        </li>)}
                        {userPermissions?.settings.view && (
                            <li onClick={() => navigate('/settings')} title={"Settings"}
                                className=" relative p-2 w-[36px] h-[36px] bg-slate-100 flex items-center justify-center rounded-lg">
                                <PiGearLight className="text-xl text-gray-500"/>
                            </li>
                        )}
                        <li title={"Notifications"}
                            className=" relative p-2 w-[36px] h-[36px] bg-slate-100 flex items-center justify-center rounded-lg">
                            <PiBellSimpleLight className="text-xl text-gray-500" onClick={showDrawer}/>
                            <span
                                className="absolute w-[20px] h-[20px] rounded-full bg-slate-800 -top-1 -right-1 border-2 border-white text-white flex items-center justify-center text-xs">{notifications?.reduce((acc, item) => {
                                if (!item.read) {
                                    return acc + 1;
                                }
                                return acc;
                            }, 0)}</span>
                        </li>


                        {/*<li className="flex space-x-3 items-center ">*/}
                        {/*    <span className="flex-none flex justify-center">*/}
                        {/*        <div className="w-8 h-8 flex ">*/}
                        {/*            <img*/}
                        {/*                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"*/}
                        {/*                alt="profile" className="shadow rounded-full object-cover"/>*/}
                        {/*        </div>*/}
                        {/*    </span>*/}

                        {/*    <p className="hidden md:block text-sm md:text-md text-black dark:text-white">{userData?.name}</p>*/}
                        {/*    <PiCaretRightLight className={`duration-500 ${userSubmenu && 'rotate-90'}`} onClick={() => {*/}
                        {/*        setUserSubmenu((prev) => !prev)*/}
                        {/*    }}/>*/}
                        {/*</li>*/}

                        <DropdownMenu>
                            {/*<DropdownMenuTrigger asChild>*/}
                            {/*    <Button variant="ghost" className="flex items-center gap-2">*/}
                            {/*        <Avatar className="h-8 w-8">*/}
                            {/*            <AvatarImage*/}
                            {/*                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"*/}
                            {/*                alt={userData?.name || "User"}*/}
                            {/*            />*/}
                            {/*            <AvatarFallback>{getInitials(userData?.name)}</AvatarFallback>*/}
                            {/*        </Avatar>*/}
                            {/*        <span className="hidden md:block text-sm">{userData?.name}</span>*/}
                            {/*        <ChevronRight className="h-4 w-4 transition-transform ui-open:rotate-90"/>*/}
                            {/*    </Button>*/}
                            {/*</DropdownMenuTrigger>*/}

                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="https://ui.shadcn.com/avatars/04.png" alt="@shadcn"/>
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <span className="hidden md:block text-sm">{userData?.name}</span>
                                    <ChevronRight className="h-4 w-4 transition-transform ui-open:rotate-90"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>
                                    <div className="flex flex-col space-y-1">
                                        <p>{userData?.name}</p>
                                        <p className="text-xs text-muted-foreground">{userData?.role}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator/>
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={() => navigateToLink(`/user/${userData?._id}`)}>
                                        <User className="mr-2 h-4 w-4"/>
                                        <span>My Profile</span>
                                    </DropdownMenuItem>
                                    {userPermissions?.settings?.view && (
                                        <DropdownMenuItem onClick={() => navigateToLink('/settings')}>
                                            <Settings className="mr-2 h-4 w-4"/>
                                            <span>Settings</span>
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleLogout}>
                                    <LogOut className="mr-2 h-4 w-4"/>
                                    <span>Logout</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        {/*<div*/}
                        {/*    className={`absolute right-0 top-[65px] bg-white w-[162px] rounded-br rounded-bl flex flex-col shadow-xl ${userSubmenu ? 'block' : 'hidden'} }`}*/}
                        {/*    ref={modalRef}>*/}

                        {/*    <div className=" flex gap-2 items-center p-2">*/}
                        {/*        <img className=" w-[36px] h-[36px] object-cover rounded-full"*/}
                        {/*             src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"*/}
                        {/*             alt="user profile"/>*/}

                        {/*        <span className=" text-left">*/}
                        {/*            <p className="text-sm">{userData?.name}</p>*/}
                        {/*            <p className="text-sm">{userData?.role}</p>*/}
                        {/*        </span>*/}
                        {/*    </div>*/}
                        {/*    <div className="w-full bg-gray-500 h-[0.5px] divider"></div>*/}

                        {/*    /!* <ul className=" list-none">*/}
                        {/*        <li className="flex gap-2 items-center hover:bg-slate-100 py-2 pl-2" onClick={()=>navigate(`/user/${profile._id}`)}>*/}
                        {/*            <PiUser />*/}
                        {/*            <p className="text-[14px]">My profile</p>*/}
                        {/*        </li>*/}
                        {/*        <li className="flex gap-2 items-center hover:bg-slate-100 py-2 pl-2">*/}
                        {/*            <PiUser />*/}
                        {/*            <p className="text-[14px]">Settings</p>*/}
                        {/*        </li>*/}
                        {/*    </ul>*/}
                        {/*    <div className="w-full bg-gray-500 h-[0.5px] divider"></div>*/}
                        {/*    <ul className="list-none">*/}
                        {/*        <li className="flex gap-2 items-center hover:bg-slate-100 py-2 pl-2">*/}
                        {/*            <PiUser />*/}
                        {/*            <p className="text-[14px]">My profile</p>*/}
                        {/*        </li>*/}
                        {/*    </ul> *!/*/}
                        {/*</div>*/}
                    </ul> : null}
                </div>


                {/*<div className="relative sm:hidden">*/}
                {/*    <BsThreeDots className=" text-xl" onClick={handleUserSubmenuMobile} />*/}
                {/*    <div className={`absolute -right-9 top-[45px] bg-white w-[162px] rounded-br rounded-bl flex flex-col shadow-xl ${userSubmenuMobile ? 'block ' : 'hidden'} }`}>*/}

                {/*        <div className=" flex gap-2 items-center p-2">*/}
                {/*            <img className=" w-[36px] h-[36px] object-cover rounded-full" src={user?.profilePicture?.url} alt="user profile" />*/}

                {/*            <span className=" text-left">*/}
                {/*            <p className="text-sm">{user?.name}</p>*/}
                {/*                    <p className="text-sm">{user?.role}</p>*/}
                {/*            </span>*/}
                {/*        </div>*/}
                {/*        <div className="w-full bg-gray-500 h-[0.5px] divider"></div>*/}

                {/*    </div>*/}
                {/*</div>*/}

                <Drawer
                    title="Notifications"
                    placement="right"
                    width={560}
                    onClose={onClose}
                    open={open}
                    // extra={
                    //     <Space>
                    //         <Button onClick={onClose}>Cancel</Button>
                    //         <Button type="default" title="" onClick={onClose}>
                    //             OK
                    //         </Button>
                    //     </Space>
                    // }
                >
                    <Space className="flex flex-col items-start">
                        {notifications.length > 0 && notifications.map((notification, index) => {
                                if (notification.message.includes("**")) {
                                    return (
                                        <Badge onClick={() => readMessage(notification._id)}
                                               className="p-3 border rounded-[4px] bg-purple-200  md:flex gap-2 items-center"
                                               key={index} dot={!notification.read} offset={[7, 7]}>
                                            <span>{`${notification.message.split("**")[0]} ${notification.message.split("**")[2].trim()}`}</span>
                                            <button className="p-2 bg-gray-400 border rounded-[4px] mt-2 text-white"
                                                    onClick={() => navigateToLink(notification.message.split("**")[1])}>Link
                                            </button>
                                        </Badge>
                                    )
                                }
                                return (
                                    <Badge onClick={() => readMessage(notification._id)}
                                           className="p-3 border rounded-[4px] bg-purple-200" key={index}
                                           dot={!notification.read} offset={[7, 7]} overflowCount={10}>
                                        <span>{notification.message}</span>
                                    </Badge>
                                )
                            }
                        )}
                        {notifications.length >= 10 && notifications.length < data.data.notifications[0].notifications.length &&
                            <button className="bg-blue-400 p-2 border rounded-[4px] text-white"
                                    onClick={() => setNotifications(prevState => prevState.concat(data.data.notifications[0].notifications.slice(10)))}>Load
                                more</button>}
                    </Space>
                </Drawer>


            </div>
        </>
    )

}
export default Appbar;


// import React, { useState, useRef, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import {
//     Bell,
//     MessageCircle,
//     FileEdit,
//     Settings,
//     Globe,
//     ChevronRight,
//     User,
//     LogOut,
//     Menu
// } from "lucide-react";
// import { notification, message } from "antd";
// import {
//     useGetNotificationsQuery,
//     useUpdateNotificationStatusMutation,
//     useVerifyTokenMutation,
//     useGetOneUserQuery,
//     useGetAllEditRequestsQuery
// } from "../states/apislice";
// import { SocketContext } from "../context files/socket";
// import { setPermissions, setUserData, setAuthToken } from "../states/slice";
//
// import {
//     Sheet,
//     SheetContent,
//     SheetHeader,
//     SheetTitle,
//     SheetTrigger,
// } from "@/components/ui/sheet";
//
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuGroup,
//     DropdownMenuItem,
//     DropdownMenuLabel,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
//
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Card } from "@/components/ui/card";
//
// const Appbar = () => {
//     const navigate = useNavigate();
//     const [notifications, setNotifications] = useState([]);
//     const [user, setUser] = useState(null);
//     const [open, setOpen] = useState(false);
//     const { userData, permissions: userPermissions, token } = useSelector(state => state.persistedReducer?.global);
//     const [userId, setUserId] = useState(null);
//     const socket = useContext(SocketContext);
//     const dispatch = useDispatch();
//     const [pendingEditRequests, setPendingEditRequests] = useState([]);
//
//     const openNotification = ({ message, description, type }) => {
//         notification.open({
//             message,
//             description,
//             placement: "topRight",
//             type
//         });
//     };
//
//     useEffect(() => {
//         socket.on("new-edit-request", data => {
//             openNotification({
//                 message: "New Edit Request",
//                 description: `${data.username} has requested to edit incorrect data. Please review his/her request and make decision`,
//                 type: "info"
//             });
//         });
//
//         socket.on("request-authorized", data => {
//             openNotification({
//                 message: "Request Authorized",
//                 description: `Your edit request has been authorized. Please keep in mind that you have limited time to make changes`,
//                 type: "success"
//             });
//         });
//
//         socket.on("request-rejected", data => {
//             openNotification({
//                 message: "Request Rejected",
//                 description: `Your edit request has been rejected. Please contact admin for more information`,
//                 type: "warning"
//             });
//         });
//     }, [socket]);
//
//     useEffect(() => {
//         if (userData) {
//             setUserId(userData._id);
//         }
//     }, [userData]);
//
//     const [verifyToken, { isError: isTokenError, error: tokenError }] = useVerifyTokenMutation();
//
//     const { data, isSuccess } = useGetNotificationsQuery(userId, {
//         skip: userId === null,
//         refetchOnMountOrArgChange: true,
//         refetchOnReconnect: true
//     });
//
//     const [updateNotificationStatus, { isSuccess: updateSuccess }] = useUpdateNotificationStatusMutation();
//
//     const { data: userDataObj, isSuccess: userSuccess } = useGetOneUserQuery(userId, {
//         skip: userId === null,
//         refetchOnMountOrArgChange: true,
//         refetchOnReconnect: true
//     });
//
//     const { data: editRequests, isSuccess: editRequestsSuccess } = useGetAllEditRequestsQuery({
//         query: "requestStatus=pending"
//     }, {
//         refetchOnMountOrArgChange: true,
//         refetchOnReconnect: true
//     });
//
//     useEffect(() => {
//         if (isTokenError) {
//             const { message: errorMessage } = tokenError.data;
//             dispatch(setUserData(null));
//             dispatch(setPermissions(null));
//             dispatch(setAuthToken(null));
//             message.error(`${errorMessage}, please log in again!`);
//             return navigate('/login');
//         }
//     }, [isTokenError, tokenError, dispatch, navigate]);
//
//     useEffect(() => {
//         if (editRequestsSuccess || updateSuccess) {
//             const { editRequests: editRequestsArray } = editRequests?.data || { editRequests: [] };
//             setPendingEditRequests(editRequestsArray);
//         }
//     }, [editRequestsSuccess, editRequests, updateSuccess]);
//
//     useEffect(() => {
//         const verifyLoginToken = async () => {
//             if (token) {
//                 const response = await verifyToken({ token });
//                 if (response.data?.data) {
//                     const { userId: currentUserId } = response.data.data;
//                     if (!currentUserId) {
//                         dispatch(setUserData(null));
//                         dispatch(setPermissions(null));
//                         dispatch(setAuthToken(null));
//                         message.error("Your session has ended. Please login again");
//                         return navigate("/login");
//                     }
//                 }
//             }
//         };
//
//         verifyLoginToken();
//
//         const intervalId = setInterval(() => {
//             verifyLoginToken();
//         }, 20000);
//
//         return () => clearInterval(intervalId);
//     }, [token, dispatch, navigate, verifyToken]);
//
//     useEffect(() => {
//         if (userSuccess || updateSuccess) {
//             const { user } = userDataObj?.data || { user: null };
//             if (user) {
//                 setUser(user);
//                 dispatch(setUserData(user));
//                 dispatch(setPermissions(user.permissions));
//             }
//         }
//     }, [userId, userSuccess, userDataObj, updateSuccess, dispatch]);
//
//     useEffect(() => {
//         if (isSuccess || updateSuccess) {
//             const { notifications: notificationsObj } = data?.data || { notifications: [] };
//             if (notificationsObj.length > 0) {
//                 const { notifications: notificationsArray } = notificationsObj[0];
//                 setNotifications(notificationsArray.slice(0, 10));
//             }
//         }
//     }, [isSuccess, data, updateSuccess]);
//
//     const readMessage = async (notificationId) => {
//         await updateNotificationStatus({ userId, notificationId });
//     };
//
//     const navigateToLink = (link) => {
//         setOpen(false);
//         navigate(link);
//     };
//
//     const handleClickOutside = (event) => {
//         setOpen(false);
//     };
//
//     const unreadNotificationsCount = notifications?.reduce((acc, item) => {
//         return !item.read ? acc + 1 : acc;
//     }, 0) || 0;
//
//     const getInitials = (name) => {
//         if (!name) return "U";
//         return name
//             .split(' ')
//             .map(part => part[0])
//             .join('')
//             .toUpperCase()
//             .substring(0, 2);
//     };
//
//     const handleLogout = () => {
//         dispatch(setUserData(null));
//         dispatch(setPermissions(null));
//         dispatch(setAuthToken(null));
//         message.success("You have been logged out successfully");
//         navigate('/login');
//     };
//
//     return (
//         <header className="fixed top-0 w-full z-10 border-b border-border bg-background shadow-sm">
//             <div className="container flex h-16 items-center justify-between px-4 md:px-6">
//                 {/* Logo */}
//                 <div className="flex items-center">
//                     <h1 className="text-xl font-bold tracking-tight">SOEMC LTD</h1>
//                 </div>
//
//                 {/* Mobile menu */}
//                 <div className="md:hidden">
//                     <Sheet>
//                         <SheetTrigger asChild>
//                             <Button variant="ghost" size="icon">
//                                 <Menu className="h-5 w-5" />
//                             </Button>
//                         </SheetTrigger>
//                         <SheetContent side="right">
//                             <SheetHeader>
//                                 <SheetTitle>Menu</SheetTitle>
//                             </SheetHeader>
//                             <div className="mt-6 flex flex-col gap-4">
//                                 {userData && (
//                                     <>
//                                         <div className="flex items-center gap-4 py-2">
//                                             <Avatar>
//                                                 <AvatarImage
//                                                     src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
//                                                     alt={userData?.name || "User"}
//                                                 />
//                                                 <AvatarFallback>{getInitials(userData?.name)}</AvatarFallback>
//                                             </Avatar>
//                                             <div>
//                                                 <p className="font-medium">{userData?.name}</p>
//                                                 <p className="text-sm text-muted-foreground">{userData?.role}</p>
//                                             </div>
//                                         </div>
//                                         <Button
//                                             variant="outline"
//                                             className="w-full justify-start"
//                                             onClick={() => navigateToLink('/chat')}
//                                         >
//                                             <MessageCircle className="mr-2 h-4 w-4" />
//                                             Chats
//                                         </Button>
//                                         {userPermissions?.editRequests?.view && (
//                                             <Button
//                                                 variant="outline"
//                                                 className="w-full justify-start"
//                                                 onClick={() => navigateToLink('/edit-requests')}
//                                             >
//                                                 <FileEdit className="mr-2 h-4 w-4" />
//                                                 Edit Requests
//                                                 {pendingEditRequests?.length > 0 && (
//                                                     <Badge className="ml-2 bg-primary">{pendingEditRequests.length}</Badge>
//                                                 )}
//                                             </Button>
//                                         )}
//                                         {userPermissions?.settings?.view && (
//                                             <Button
//                                                 variant="outline"
//                                                 className="w-full justify-start"
//                                                 onClick={() => navigateToLink('/settings')}
//                                             >
//                                                 <Settings className="mr-2 h-4 w-4" />
//                                                 Settings
//                                             </Button>
//                                         )}
//                                         <Button
//                                             variant="outline"
//                                             className="w-full justify-start"
//                                             onClick={() => setOpen(true)}
//                                         >
//                                             <Bell className="mr-2 h-4 w-4" />
//                                             Notifications
//                                             {unreadNotificationsCount > 0 && (
//                                                 <Badge className="ml-2 bg-primary">{unreadNotificationsCount}</Badge>
//                                             )}
//                                         </Button>
//                                         <Button
//                                             variant="destructive"
//                                             className="w-full justify-start mt-4"
//                                             onClick={handleLogout}
//                                         >
//                                             <LogOut className="mr-2 h-4 w-4" />
//                                             Logout
//                                         </Button>
//                                     </>
//                                 )}
//                             </div>
//                         </SheetContent>
//                     </Sheet>
//                 </div>
//
//                 {/* Desktop menu */}
//                 <div className="hidden md:flex items-center gap-4">
//                     {userData && (
//                         <>
//                             <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 onClick={() => navigateToLink('/chat')}
//                                 title="Chats"
//                             >
//                                 <MessageCircle className="h-5 w-5" />
//                             </Button>
//
//                             {userPermissions?.editRequests?.view && (
//                                 <div className="relative">
//                                     <Button
//                                         variant="ghost"
//                                         size="icon"
//                                         onClick={() => navigateToLink('/edit-requests')}
//                                         title="Edit Requests"
//                                     >
//                                         <FileEdit className="h-5 w-5" />
//                                     </Button>
//                                     {pendingEditRequests?.length > 0 && (
//                                         <Badge
//                                             className="absolute -top-1 -right-1"
//                                             variant="destructive"
//                                         >
//                                             {pendingEditRequests.length}
//                                         </Badge>
//                                     )}
//                                 </div>
//                             )}
//
//                             {userPermissions?.settings?.view && (
//                                 <Button
//                                     variant="ghost"
//                                     size="icon"
//                                     onClick={() => navigateToLink('/settings')}
//                                     title="Settings"
//                                 >
//                                     <Settings className="h-5 w-5" />
//                                 </Button>
//                             )}
//
//                             <div className="relative">
//                                 <Sheet open={open} onOpenChange={setOpen}>
//                                     <SheetTrigger asChild>
//                                         <Button variant="ghost" size="icon" title="Notifications">
//                                             <Bell className="h-5 w-5" />
//                                             {unreadNotificationsCount > 0 && (
//                                                 <Badge
//                                                     className="absolute -top-1 -right-1"
//                                                     variant="destructive"
//                                                 >
//                                                     {unreadNotificationsCount}
//                                                 </Badge>
//                                             )}
//                                         </Button>
//                                     </SheetTrigger>
//                                     <SheetContent>
//                                         <SheetHeader>
//                                             <SheetTitle>Notifications</SheetTitle>
//                                         </SheetHeader>
//                                         <div className="mt-6 flex flex-col gap-3">
//                                             {notifications && notifications.length > 0 ? (
//                                                 notifications.map((notification, index) => {
//                                                     const hasLink = notification.message.includes("**");
//
//                                                     return (
//                                                         <Card
//                                                             key={index}
//                                                             className={`p-3 ${!notification.read ? 'border-l-4 border-l-primary' : ''}`}
//                                                             onClick={() => readMessage(notification._id)}
//                                                         >
//                                                             <div className="flex flex-col gap-2">
//                                                                 <p className="text-sm">
//                                                                     {hasLink
//                                                                         ? `${notification.message.split("**")[0]} ${notification.message.split("**")[2].trim()}`
//                                                                         : notification.message
//                                                                     }
//                                                                 </p>
//                                                                 {hasLink && (
//                                                                     <Button
//                                                                         size="sm"
//                                                                         variant="secondary"
//                                                                         onClick={() => navigateToLink(notification.message.split("**")[1])}
//                                                                     >
//                                                                         View Details
//                                                                     </Button>
//                                                                 )}
//                                                             </div>
//                                                         </Card>
//                                                     );
//                                                 })
//                                             ) : (
//                                                 <p className="text-center text-muted-foreground py-4">No notifications</p>
//                                             )}
//
//                                             {notifications?.length >= 10 && notifications?.length < data?.data?.notifications[0]?.notifications?.length && (
//                                                 <Button
//                                                     className="mt-2"
//                                                     variant="outline"
//                                                     onClick={() => setNotifications(prevState =>
//                                                         prevState.concat(data.data.notifications[0].notifications.slice(prevState.length, prevState.length + 10))
//                                                     )}
//                                                 >
//                                                     Load more
//                                                 </Button>
//                                             )}
//                                         </div>
//                                     </SheetContent>
//                                 </Sheet>
//                             </div>
//
//                             <DropdownMenu>
//                                 <DropdownMenuTrigger asChild>
//                                     <Button variant="ghost" className="flex items-center gap-2">
//                                         <Avatar className="h-8 w-8">
//                                             <AvatarImage
//                                                 src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
//                                                 alt={userData?.name || "User"}
//                                             />
//                                             <AvatarFallback>{getInitials(userData?.name)}</AvatarFallback>
//                                         </Avatar>
//                                         <span className="hidden md:block text-sm">{userData?.name}</span>
//                                         <ChevronRight className="h-4 w-4 transition-transform ui-open:rotate-90" />
//                                     </Button>
//                                 </DropdownMenuTrigger>
//                                 <DropdownMenuContent align="end" className="w-56">
//                                     <DropdownMenuLabel>
//                                         <div className="flex flex-col space-y-1">
//                                             <p>{userData?.name}</p>
//                                             <p className="text-xs text-muted-foreground">{userData?.role}</p>
//                                         </div>
//                                     </DropdownMenuLabel>
//                                     <DropdownMenuSeparator />
//                                     <DropdownMenuGroup>
//                                         <DropdownMenuItem onClick={() => navigateToLink(`/user/${userData?._id}`)}>
//                                             <User className="mr-2 h-4 w-4" />
//                                             <span>My Profile</span>
//                                         </DropdownMenuItem>
//                                         {userPermissions?.settings?.view && (
//                                             <DropdownMenuItem onClick={() => navigateToLink('/settings')}>
//                                                 <Settings className="mr-2 h-4 w-4" />
//                                                 <span>Settings</span>
//                                             </DropdownMenuItem>
//                                         )}
//                                     </DropdownMenuGroup>
//                                     <DropdownMenuSeparator />
//                                     <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleLogout}>
//                                         <LogOut className="mr-2 h-4 w-4" />
//                                         <span>Logout</span>
//                                     </DropdownMenuItem>
//                                 </DropdownMenuContent>
//                             </DropdownMenu>
//                         </>
//                     )}
//                 </div>
//             </div>
//         </header>
//     );
// };
//
// export default Appbar;