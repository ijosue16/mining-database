import React,{useState} from "react";
import Sidebar from "./sidebar";
import Appbar from "./Appbar";
import { Outlet } from "react-router-dom";

const Layout=()=>{
    const[open,setOpen]=useState(true);
    const openMode=()=>{
        setOpen(!open)
    }
    return (
        <>
         {/* <div className='h-screen w-screen  m-0 p-0 box-border bg-gray-50 '>
         <Appbar isopen={open} />
      <Sidebar open={open}
      setOpen={setOpen}/>
     
      
      </div> */}

<div className="flex flex-col h-screen">
<Appbar isopen={open}
openMode={openMode} />
        {/* <div className="h-[53px] sticky top-0 w-full bg-red-100"></div> */}
        <main className="flex border-box">
             <Sidebar open={open}
      setOpen={setOpen}/>
        {/* <aside className="h-screen shrink-0 bg-green-200 flex-[0_0_256px]"></aside> */}
        <article className="flex flex-col gap-0 w-screen">
            <div className="content overflow-auto flex-1 w-full h-screen bg-slate-50 p-[16px_24px_50px_24px]">
            <Outlet/>
            </div>
            {/* <footer className="h-[45px] bg-amber-100"></footer> */}
        </article>
      
        </main>
       
        </div>

        </>
    )
}
export default Layout;