import React,{useState} from "react";
import { BsSearch } from "react-icons/bs";
import { PiGlobeSimpleLight, PiCaretRightLight,PiUser } from "react-icons/pi";
import {FiChevronsLeft,} from "react-icons/fi"

const Appbar = ({isopen,openMode}) => {
    const[userMenu,setUserMenu]=useState(false);
    const topnavMargin= isopen ?'ml-64':'ml-20'
    return (
        <>
            <div className={` h-[53px] bg-white pl-0 pr-4 sm:flex gap-4 items-center sticky border-b duration-500 hidden  `}>
                <div className= {`flex-one border-r h-full duration-500 flex gap-2 pl-6 items-center relative ${!isopen ? 'w-20':'w-64'}`}>
                <img className="w-7 h-7 " src="https://icons.veryicon.com/png/o/healthcate-medical/medical-icon-two-color-icon/ico-pharmacy-management-pharmacy-inventory.png" alt="pharmacty icon" />
                <h3 className={` duration-[0.58s] ${!isopen && 'scale-0 '}`}>Medicals</h3>
                <FiChevronsLeft className={` text-white p-[3px] bg-stone-500 rounded-full absolute  top-4 text-[20px] -right-2 ${!isopen && 'rotate-180'}`} onClick={openMode}/>
                </div>
                <div className="flex-two flex-1 flex items-center justify-between shrink  gap-2">
                    <div className=" rounded-3xl bg-slate-100 py-1 px-4 flex items-center gap-2 "  >
                        <BsSearch />
                        <input type="text" name="search" id="search" className="bg-transparent w-full" placeholder="search" />

                    </div>
                  
                <div className="flex-three flex gap-2 items-center justify-end">
                    <ul className="flex flex-row gap-2 list-none">
                        <li className="p-2 w-[36px] h-[36px] bg-slate-100 flex items-center justify-center rounded-lg">
                            <PiGlobeSimpleLight className="text-xl text-gray-500" />
                        </li>
                        <li className="p-2 w-[36px] h-[36px] bg-slate-100 flex items-center justify-center rounded-lg">
                            <PiGlobeSimpleLight className="text-xl text-gray-500" />
                        </li>
                        <li className="p-2 w-[36px] h-[36px] bg-slate-100 flex items-center justify-center rounded-lg">
                            <PiGlobeSimpleLight className="text-xl text-gray-500" />
                        </li>
                    </ul>
                    <div className=" flex gap-2 items-center">
                        <img className=" w-[36px] h-[36px] object-cover" src="https://img.freepik.com/free-icon/boy_318-858292.jpg" alt="user profile" />
                        <div className="relative shrink">
                            <span className="flex gap-2 items-center">
                                <p className="text-md">Jacop Murphy</p>
                                <PiCaretRightLight className={`duration-500 ${userMenu && 'rotate-90 '}`} onClick={()=>setUserMenu(!userMenu)}/>
                            </span>
                            <p className="text-sm">Admin</p>
                            <div className={` absolute right-0 top-[50px] bg-white w-[162px] rounded-br rounded-bl flex flex-col shadow-xl ${!userMenu && 'hidden' }`}>

                                <div className=" flex gap-2 items-center py-2">
                                    <img className=" w-[36px] h-[36px] object-cover rounded" src="https://img.freepik.com/free-icon/boy_318-858292.jpg" alt="user profile" />
                                    
                                    <span className="">
                                        <p className="text-sm">Jacop Murphy</p>
                                        <p className="text-sm">Admin</p>
                                    </span>
                                </div>
                                <div className="w-full bg-gray-500 h-[0.5px] divider"></div>

                                <ul className="p-2 list-none">
                                    <li className="flex gap-2 items-center">
                                        <PiUser/>
                                        <p className="text-[14px]">My profile</p>
                                    </li>
                                    <li className="flex gap-2 items-center">
                                        <PiUser/>
                                        <p className="text-[14px]">Settings</p>
                                    </li>
                                </ul>
                                <div className="w-full bg-gray-500 h-[0.5px] divider"></div>
                                <ul className="p-2 list-none">
                                    <li className="flex gap-2 items-center">
                                        <PiUser/>
                                        <p className="text-[14px]">My profile</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                </div>

            </div>
        </>
    )

}
export default Appbar;