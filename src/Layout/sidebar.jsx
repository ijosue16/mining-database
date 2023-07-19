import React,{useState}from "react";
import {RxDashboard} from "react-icons/rx"
import {FiSmartphone,FiChevronsLeft,FiChevronDown,FiSettings} from "react-icons/fi"
import { HiOutlineCube } from "react-icons/hi";
import { BsPlusSquare } from "react-icons/bs";
import { Outlet } from "react-router-dom";

const Sidebar=({open,setOpen})=>{
    const[subMenuOpen,setSubMenuOpen]=useState(false);

    return(
        <>
        <div className={`${open? 'flex-[0_0_256px]':'flex-[0_0_80px]'} shrink-0 duration-300 ease-in-out h-screen  bg-white text-black p-4  border-r flex flex-col`} >
            <div className=" w-full flex flex-col gap-2 justify-center items ">
            <p className={`${!open && 'hidden'}`}>Main</p>
            <ul className=" w-full list-none">
                <li className="w-[100%] p-2 flex flex-row gap-2 justify-center items-center hover:bg-slate-400 hover:text-white rounded-lg">
                   <RxDashboard className="text-[22px]"/> 
                    <span className={`flex flex-row w-full justify-between items-center duration-300 ${!open && 'hidden'}`} >
                        <p>Dashboard</p>
                        </span>
                </li>
                <li className="w-[100%] p-2 flex flex-row gap-2 justify-center items-center hover:bg-slate-400 hover:text-white rounded-lg">
                    <FiSmartphone className="text-[22px]"/>
                    <span className={`flex flex-row w-full justify-between items-center duration-300 ${!open && 'hidden'}`} >
                        <p className={` scale-1 duration-700 ${!open &&' scale-0'}`}>Application</p>
                        <FiChevronDown className={`duration-500 ${subMenuOpen && "rotate-180 "}`} onClick={()=>setSubMenuOpen(!subMenuOpen)}/>
                        </span>
                    </li>
            </ul>
            {/* menu name and icon */}
            <div className="w-full bg-gray-200 h-[0.5px] divider"></div>
            {/* menu divider */}

            <p className={`${!open && 'hidden'}`}>Products</p>
            <ul className="w-full list-none">
                <li className="w-[100%] p-2 flex flex-row gap-2 justify-center items-center hover:bg-slate-400 hover:text-white rounded-lg">
                   <HiOutlineCube className="text-[22px]"/> 
                    <span className={`flex flex-row w-full justify-between items-center duration-300 ${!open && 'hidden'}`} >
                        <p>Products</p>
                        <FiChevronDown className={`duration-500 ${subMenuOpen && "rotate-180 "}`} onClick={()=>setSubMenuOpen(!subMenuOpen)}/>
                        </span>
                </li>
                {open && subMenuOpen && (<ul className="p-2 pt-0 flex flex-col gap-2 duration-300">
                        <li>electronic</li>
                        <li>food</li>
                        <li>drinks</li>
                    </ul>)}
                {/* list element with a submenu and its icon */}
                <li className="w-[100%] p-2 flex flex-row gap-2 justify-center items-center hover:bg-slate-400 hover:text-white rounded-lg">
                    <BsPlusSquare className="text-[22px]"/>
                    <span className={`flex flex-row w-full justify-between items-center duration-700 ${!open && ' hidden opacity-0'}`} >
                        <p>Create Products</p></span>
                    </li>
                   
            </ul>

        
            
        </div>
        <div className=" flex flex-row gap-2 items-center self-start absolute bottom-4">
                <FiSettings className="text-[22px]"/>
                <p>settings</p>
            </div>
          
        </div>

        </>
    )
}
export default Sidebar;