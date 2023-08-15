import React,{useState} from "react";
import { BsSearch } from "react-icons/bs";
import { PiGlobeSimpleLight, PiCaretRightLight,PiUser,PiBellSimpleLight,PiEnvelopeLight,PiGearLight  } from "react-icons/pi";
import {FiChevronsLeft,} from "react-icons/fi"

const Appbar = ({userSubmenu,handleUserSubmenu}) => {
    const[userMenu,setUserMenu]=useState(false);
    
    return (
        <>
                {/* App bar */}
                <div className="w-full fixed flex z-10 bg-white p-2 items-center justify-between h-16 px-10 border-b">
                    <div className={`logo ml-12 dark:text-white  transform ease-in-out duration-300 flex-none h-full flex items-center justify-center`} >
                        MINE
                    </div>

                    <div className="grow h-full flex items-center justify-center"></div>
                    <div className="flex-none h-full text-center flex items-center justify-center">
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


                            <li className="flex space-x-3 items-center"  >
                                <span className="flex-none flex justify-center">
                                    <div className="w-8 h-8 flex ">
                                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShta_GXR2xdnsxSzj_GTcJHcNykjVKrCBrZ9qouUl0usuJWG2Rpr_PbTDu3sA9auNUH64&usqp=CAU" alt="profile" className="shadow rounded-full object-cover" />
                                    </div>
                                </span>

                                <p className="hidden md:block text-sm md:text-md text-black dark:text-white">John Doe</p>
                                <PiCaretRightLight className={`duration-500 ${userSubmenu && 'rotate-90'}`} onClick={handleUserSubmenu} />
                            </li>
                            <div className={` absolute right-6 top-[65px] bg-white w-[162px] rounded-br rounded-bl flex flex-col shadow-xl ${userSubmenu ? 'block' : 'hidden'} }`}>

                                <div className=" flex gap-2 items-center py-2">
                                    <img className=" w-[36px] h-[36px] object-cover rounded" src="https://img.freepik.com/free-icon/boy_318-858292.jpg" alt="user profile" />

                                    <span className=" text-left">
                                        <p className="text-sm">Jacop Murphy</p>
                                        <p className="text-sm">Admin</p>
                                    </span>
                                </div>
                                <div className="w-full bg-gray-500 h-[0.5px] divider"></div>

                                <ul className=" list-none">
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
                                </ul>
                            </div>
                        </ul>
                    </div>
                </div>
        </>
    )

}
export default Appbar;