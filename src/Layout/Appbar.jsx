import React, { useState,useRef,useEffect,useMemo } from "react";
import { BsSearch, BsThreeDots } from "react-icons/bs";
import { PiGlobeSimpleLight, PiCaretRightLight, PiUser, PiBellSimpleLight, PiEnvelopeLight, PiGearLight } from "react-icons/pi";
import { FiChevronsLeft, } from "react-icons/fi"
import { useMyContext } from "../context files/LoginDatacontextProvider";
import { useNavigate } from "react-router-dom";

const Appbar = ({ handleUserSubmenuMobile,userSubmenuMobile }) => {
    const [userMenu, setUserMenu] = useState(false);
    const navigate=useNavigate();
    const [userSubmenu, setUserSubmenu] = useState(false);
    let modalRef = useRef();
    const{loginData}=useMyContext();
    let profile;
    if(loginData) {
        const{profile: info,permissions}=loginData;
        profile = info;
        // console.log(profile._id)
    }


    const handleClickOutside = (event) => {
        if (!modalRef.current ||!modalRef.current.contains(event.target)) {
            setUserSubmenu(false);
        }
      };
  
  
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
                <div className={`logo ml-12 dark:text-white  transform ease-in-out duration-300 flex-none h-full flex items-center justify-center`} >
                    MINE
                </div>


                <div className="hidden relative flex-none h-full text-center sm:flex items-center justify-center">
                    <ul className="flex items-center justify-evenly gap-4">
                        <li className=" relative p-2 w-[36px] h-[36px] bg-slate-100 flex items-center justify-center rounded-lg">
                            <PiGlobeSimpleLight className="text-xl text-gray-500" />

                        </li>
                        <li className=" relative p-2 w-[36px] h-[36px] bg-slate-100 flex items-center justify-center rounded-lg">
                            <PiEnvelopeLight className="text-xl text-gray-500" />
                            <span className="absolute w-[20px] h-[20px] rounded-full bg-slate-800 -top-1 -right-1 border-2 border-white text-white flex items-center justify-center text-xs">4</span>
                        </li>
                        <li className=" relative p-2 w-[36px] h-[36px] bg-slate-100 flex items-center justify-center rounded-lg">
                            <PiBellSimpleLight className="text-xl text-gray-500" />
                            <span className="absolute w-[20px] h-[20px] rounded-full bg-slate-800 -top-1 -right-1 border-2 border-white text-white flex items-center justify-center text-xs">4</span>
                        </li>
                        <li className=" relative p-2 w-[36px] h-[36px] bg-slate-100 flex items-center justify-center rounded-lg">
                            <PiGearLight className="text-xl text-gray-500" />

                        </li>


                        <li className="flex space-x-3 items-center ">
                            <span className="flex-none flex justify-center">
                                <div className="w-8 h-8 flex ">
                                    <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt="profile" className="shadow rounded-full object-cover" />
                                </div>
                            </span>

                            <p className="hidden md:block text-sm md:text-md text-black dark:text-white">{profile?.name}</p>
                            <PiCaretRightLight  className={`duration-500 ${userSubmenu && 'rotate-90'}`} onClick={()=>{setUserSubmenu((prev)=>!prev)}} />
                        </li>
                        <div className={`absolute right-0 top-[65px] bg-white w-[162px] rounded-br rounded-bl flex flex-col shadow-xl ${userSubmenu ? 'block' : 'hidden'} }`} ref={modalRef}>

                            <div className=" flex gap-2 items-center p-2">
                                <img className=" w-[36px] h-[36px] object-cover rounded-full" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt="user profile" />

                                <span className=" text-left">
                                    <p className="text-sm">{profile?.name}</p>
                                    <p className="text-sm">{profile?.role}</p>
                                </span>
                            </div>
                            <div className="w-full bg-gray-500 h-[0.5px] divider"></div>

                            {/* <ul className=" list-none">
                                <li className="flex gap-2 items-center hover:bg-slate-100 py-2 pl-2" onClick={()=>navigate(`/user/${profile._id}`)}>
                                    <PiUser />
                                    <p className="text-[14px]">My profile</p>
                                </li>
                                <li className="flex gap-2 items-center hover:bg-slate-100 py-2 pl-2">
                                    <PiUser />
                                    <p className="text-[14px]">Settings</p>
                                </li>
                            </ul>
                            <div className="w-full bg-gray-500 h-[0.5px] divider"></div>
                            <ul className="list-none">
                                <li className="flex gap-2 items-center hover:bg-slate-100 py-2 pl-2">
                                    <PiUser />
                                    <p className="text-[14px]">My profile</p>
                                </li>
                            </ul> */}
                        </div>
                    </ul>
                </div>

                <div className="relative sm:hidden">
                    <BsThreeDots className=" text-xl" onClick={handleUserSubmenuMobile} />
                    <div className={`absolute -right-9 top-[45px] bg-white w-[162px] rounded-br rounded-bl flex flex-col shadow-xl ${userSubmenuMobile ? 'block ' : 'hidden'} }`}>

                        <div className=" flex gap-2 items-center p-2">
                            <img className=" w-[36px] h-[36px] object-cover rounded-full" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt="user profile" />

                            <span className=" text-left">
                            <p className="text-sm">{profile?.name}</p>
                                    <p className="text-sm">{profile?.role}</p>
                            </span>
                        </div>
                        <div className="w-full bg-gray-500 h-[0.5px] divider"></div>

                        {/* <ul className=" list-none">
                            <li className="flex gap-2 items-center hover:bg-slate-100 py-2 pl-2">
                                <PiUser />
                                <p className="text-[14px]">My profile</p>
                            </li>
                            <li className="flex gap-2 items-center hover:bg-slate-100 py-2 pl-2">
                                <PiUser />
                                <p className="text-[14px]">Settings</p>
                            </li>
                        </ul>
                        <div className="w-full bg-gray-500 h-[0.5px] divider"></div>
                        <ul className="list-none">
                            <li className="flex gap-2 items-center hover:bg-slate-100 py-2 pl-2">
                                <PiUser />
                                <p className="text-[14px]">My profile</p>
                            </li>
                        </ul> */}
                    </div>
                </div>


            </div>
        </>
    )

}
export default Appbar;