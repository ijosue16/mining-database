import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { PiCaretLeftLight, PiWindowsLogoDuotone, PiHandbagDuotone, PiUserDuotone, PiUsersDuotone,PiEnvelopeLight,PiCubeDuotone, PiShieldDuotone, PiGlobeSimpleLight, PiCaretRightLight, PiUser, PiSquaresFourDuotone, PiDeviceMobileCameraDuotone, PiPlusSquareDuotone, PiCubeTransparentDuotone, PiTagDuotone, PiSpeakerHifiDuotone, PiBarcodeDuotone, PiArrowsInSimpleDuotone, PiShoppingCartSimpleDuotone, PiFilesDuotone, PiFileTextDuotone, PiFloppyDiskDuotone, PiArrowsClockwiseDuotone, PiArrowBendUpLeftDuotone, PiDatabaseDuotone, PiSignInDuotone, PiChartPieDuotone, PiHouseDuotone, PiBrowserDuotone, PiFileMinusDuotone, PiGearDuotone, PiFileDuotone, PiShoppingBagDuotone,PiBellSimpleLight,PiGearLight } from "react-icons/pi";
import { LuBarChart2 } from "react-icons/lu"
import { TbArrowsCross } from "react-icons/tb"

const ListTestContainer = () => {
    const [open, setOpen] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState(false);
    const [userSubmenu, setUserSubmenu] = useState(false);
    const [active, setActive] = useState("");
    const [choseNav, setChoseNav] = useState("");
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const opennav = () => {
        setOpen(!open),
            console.log(open)
    }
    useEffect(() => {
        setActive(pathname.substring(1));
    }, [pathname]);

    const menu = [
        { heading: "Main", title: "Dashboard", icon: <PiSquaresFourDuotone />, id: 1, hId: 34 },
        { title: "Application", icon: <PiDeviceMobileCameraDuotone />, submenu: true, submenuItems: [{ title: "Chat", id: 43 }, { title: "Calender", id: 44 }, { title: "Email", id: 45 }], line: true, id: 2 },
        { heading: "Products", title: "Products", icon: <PiCubeDuotone />, id: 3, hId: 35 },
        { title: "Create Products", icon: <PiPlusSquareDuotone />, id: 4 },
        { title: "Category", icon: <PiCubeTransparentDuotone />, id: 5 },
        { title: "Brands", icon: <PiTagDuotone />, id: 6 },
        { title: "Sub Category", icon: <PiSpeakerHifiDuotone />, id: 7 },
        { title: "Print Barcode", icon: <PiBarcodeDuotone />, id: 8 },
        { title: "Import Products", icon: <PiArrowsInSimpleDuotone />, line: true, id: 9 },
        { heading: "sales", title: "sales", icon: <PiShoppingCartSimpleDuotone />, id: 10, hId: 36 },
        { title: "Invoices", icon: <PiFileTextDuotone />, id: 11 },
        { title: "Sales Return", icon: <PiFilesDuotone />, id: 12 },
        { title: "Quation", icon: <PiFloppyDiskDuotone />, id: 13 },
        { title: "Transfer", icon: <TbArrowsCross />, submenu: true, submenuItems: [{ title: "transfer List", id: 46 }, { title: "Import Transfer", id: 47 }], id: 14 },
        { title: "Return", icon: <PiArrowBendUpLeftDuotone />, submenu: true, submenuItems: [{ title: "Sales Return", id: 48 }, { title: "Purchases Return", id: 49 }], line: true, id: 15 },
        { heading: "Purchases", title: "Purchases", icon: <PiShoppingBagDuotone />, id: 16, hId: 37 },
        { title: "Import Purchases", icon: <PiArrowsInSimpleDuotone />, id: 17 },
        { title: "Purchase Order", icon: <PiFileMinusDuotone />, id: 18 },
        { title: "Purchase Return", icon: <PiArrowsClockwiseDuotone />, line: true, id: 19 },
        { heading: "Finance & acconts", title: "Expenses", icon: <PiFileTextDuotone />, submenu: true, submenuItems: [{ title: "Expenses", id: 50 }, { title: "Expenses Category", id: 51 }], line: true, id: 20, hId: 38 },
        { heading: "Peoples", title: "Customers", icon: <PiUserDuotone />, id: 21, hId: 39 },
        { title: "Suppliers", icon: <PiUsersDuotone />, id: 22 },
        { title: "Users", icon: <PiUserDuotone />, id: 23 },
        { title: "Stores", icon: <PiHouseDuotone />, line: true, id: 24 },
        { heading: "Reports", title: "Sales Report", icon: <LuBarChart2 />, id: 25, hId: 40 },
        { title: "Purchase Report", icon: <PiChartPieDuotone />, id: 26 },
        { title: "Inventory Report", icon: <PiBrowserDuotone />, id: 27 },
        { title: "Invoice Report", icon: <PiFileDuotone />, id: 28 },
        { title: "Supplier Report", icon: <PiDatabaseDuotone />, id: 29 },
        { title: "Customer Report", icon: <PiChartPieDuotone />, line: true, id: 30 },
        { heading: "User Management", title: "Manage Users", icon: <PiUsersDuotone />, submenu: true, submenuItems: [{ title: "New User", id: 52 }, { title: "Users List", id: 53 }], line: true, id: 31, hId: 41 },
        { heading: "Settings", title: "Settings", icon: <PiGearDuotone />, submenu: true, submenuItems: [{ title: "General Settings", id: 54 }, { title: "Email Settings", id: 55 }, { title: "Payment Settings", id: 56 }, { title: "Currency Settings", id: 57 }, { title: "Group Permissions", id: 58 }, { title: "Tax Rates", id: 59 },], id: 32, hId: 42 },
        { title: "Logout", icon: <PiSignInDuotone />, id: 33 },
    ]
    return (
        <>

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
                                <PiCaretRightLight className={`duration-500 ${userSubmenu && 'rotate-90'}`} onClick={() => setUserSubmenu(!userSubmenu)} />
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

                                <ul className="p-2 list-none">
                                    <li className="flex gap-2 items-center">
                                        <PiUser />
                                        <p className="text-[14px]">My profile</p>
                                    </li>
                                    <li className="flex gap-2 items-center">
                                        <PiUser />
                                        <p className="text-[14px]">Settings</p>
                                    </li>
                                </ul>
                                <div className="w-full bg-gray-500 h-[0.5px] divider"></div>
                                <ul className="p-2 list-none">
                                    <li className="flex gap-2 items-center">
                                        <PiUser />
                                        <p className="text-[14px]">My profile</p>
                                    </li>
                                </ul>
                            </div>
                        </ul>
                    </div>
                </div>

                {/* side bar */}
                <aside className={`w-48 -translate-x-[138px] fixed transition transform ease-in-out duration-700 z-50 flex h-full bg-white ${open && ' w-48 -translate-x-[1px] '} `}>

                    <div className={`max-toolbar w-full -right-0 transition transform ease-in duration-700 flex items-center justify-between border-4 border-white dark:border-[#0F172A] bg-yellow-200 absolute top-2 rounded-full h-12 ${!open && 'scale-x-0'}`}>


                        <div className={`flex items-center space-x-3 group bg-gradient-to-r dark:from-cyan-500 dark:to-blue-500 from-yellow-500 via-amber-500 to-amber-900  pl-10 pr-2 py-1 rounded-full text-white ${!open && 'text-black'} `}>
                            <div className="transform ease-in-out duration-300 mr-12">
                                MINE
                            </div>
                        </div>
                    </div>
                    <div onClick={opennav} className={`-right-0 transition transform ease-in-out duration-500 flex border-4 border-white dark:border-[#0F172A] dark:hover:bg-blue-500 hover:bg-amber-500 absolute top-2 p-3 rounded-full text-white hover:rotate-45 ${!open && 'text-black'}`}>
                        <PiWindowsLogoDuotone className={`${!open && 'text-black'}`} />
                    </div>
                    {/* big sidebar menu */}
                    <div className={`max mt-20 flex-col  w-full  list-none overflow-y-scroll ${!open && 'hidden'}`} >
                        <ul className="m-0 p-0 flex flex-col gap-1">
                            {menu.map(({ title, icon, line, submenu, submenuItems, heading, id, hId }, index) => {
                                const navtext = title.toLowerCase().replace(/\s/g, '');
                                return (
                                    <>
                                        {heading && (<p key={hId} className="px-4 pb-1">{heading}</p>)}
                                        {!submenu && (<li key={id} className={`flex flex-row items-center p-2 pl-6 space-x-3  hover:text-amber-500 hover:bg-amber-50 h-full w-full text-black transform ease-in-out duration-300  ${line && ' border-b mb-2'} ${active === navtext && ' bg-amber-100 text-amber-500 rounded'}`}
                                            onClick={() => { navigate(`/${navtext}`); setActive(navtext) }}
                                        >
                                            <span className="w-4 h-4 ">{icon}</span>
                                            <p className="">{title}</p>
                                            {submenu && <PiCaretRightLight className={`text-xs duration-500 ${openSubmenu && 'rotate-90'}`} onClick={() => {
                                                setOpenSubmenu(!openSubmenu);
                                                setChoseNav(id)
                                            }} />}
                                        </li>)}
                                        {submenu && (
                                            <li key={id} className={` w-full text-black transform ease-in-out duration-300  ${line && ' border-b mb-2'} ${active === navtext && ' bg-amber-100 text-amber-500 rounded'}`}
                                            // onClick={()=>{navigate(`/${navtext}`);setActive(navtext)}}
                                            >
                                                <div className="flex flex-row items-center p-2 pl-6 gap-3 justify-start hover:text-amber-500 hover:bg-amber-50 h-full w-full" onClick={() => {
                                                    setOpenSubmenu(!openSubmenu);
                                                    setChoseNav(id)
                                                }}>
                                                    <span className="w-4 h-4 ">{icon}</span>
                                                    <p className="">{title}</p>
                                                    {submenu && <PiCaretRightLight className={`text-xs duration-500 ${openSubmenu && id === choseNav && 'rotate-90'}`} />}
                                                </div>
                                                {submenu && id === choseNav && (
                                                    <ul className={` pl-12 space-y-4 list-disc  ${openSubmenu ? 'block' : 'hidden'}`}>
                                                        {submenuItems.map((items, index) => {
                                                            const navtext = items.title.toLowerCase().replace(/\s/g, '')
                                                            return (
                                                                <li key={items.id} className="hover:text-amber-500" onClick={() => navigate(`/${navtext}`)}>
                                                                    {items.title}
                                                                </li>
                                                            )

                                                        })}
                                                    </ul>
                                                )}

                                            </li>
                                        )}

                                    </>
                                )
                            })}

                        </ul>
                    </div>
                    {/* small sidebar menu */}
                    <ul className={`mini mt-20 flex flex-col space-y-2 w-full list-none ${open && 'hidden'}`}  onMouseEnter={()=>setOpen(!open)} 
                    >
                        {menu.map(({ title, icon, line, id }, index) => {
                            const navtext = title.toLowerCase().replace(/\s/g, '');
                            return (
                                <li key={id} className={`hover:ml-4 justify-end pr-5 text-black hover:text-amber-500 hover:bg-amber-50 w-full p-3 rounded transform ease-in-out duration-300 flex ${active === navtext && ' bg-amber-100 text-amber-800 rounded'}`}
                                   
                                    >
                                    <span className="w-4 h-4 ">{icon}</span>

                                </li>
                            )
                        })}

                    </ul>

                </aside>


                <div className={`content ml-14 -translate-x-0  transform ease-in-out duration-700 pt-20 px-2 h-screen md:px-5 pb-4 ${open && ' ml-[194px]'}`}>
                    {/* <PiCaretLeftLight className="mb-1" onClick={()=>navigate(-1)}/> */}
                    <Outlet />
                </div>
                {/* <div className="modal flex w-full h-full top-0 fixed left-0 z-50 bg-red-900"></div> */}
            </>



        </>
    )
}
export default ListTestContainer;