import React, { useEffect, useState, Fragment } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { PiCaretLeftLight, PiWindowsLogoDuotone, PiHandbagDuotone, PiUserDuotone, PiUsersDuotone, PiEnvelopeLight, PiCubeDuotone, PiShieldDuotone, PiGlobeSimpleLight, PiCaretRightLight, PiUser, PiSquaresFourDuotone, PiDeviceMobileCameraDuotone, PiPlusSquareDuotone, PiCubeTransparentDuotone, PiTagDuotone, PiSpeakerHifiDuotone, PiBarcodeDuotone, PiArrowsInSimpleDuotone, PiShoppingCartSimpleDuotone, PiFilesDuotone, PiFileTextDuotone, PiFloppyDiskDuotone, PiArrowsClockwiseDuotone, PiArrowBendUpLeftDuotone, PiDatabaseDuotone, PiSignInDuotone, PiChartPieDuotone, PiHouseDuotone, PiBrowserDuotone, PiFileMinusDuotone, PiGearDuotone, PiFileDuotone, PiShoppingBagDuotone, PiBellSimpleLight, PiGearLight } from "react-icons/pi";
import { LuBarChart2 } from "react-icons/lu"
import { TbArrowsCross } from "react-icons/tb"
import Appbar from "./Appbar";
import Sidebar from "./sidebar";

const Layout = () => {
    const [open, setOpen] = useState(false);
    const [userSubmenu, setUserSubmenu] = useState(false);
    const [userSubmenuMobile, setUserSubmenuMobile] = useState(false);
    const navigate = useNavigate();

    const opennav = () => {
        setOpen(!open)
    }

    const handleUserSubmenu = () => {
        setUserSubmenu(!userSubmenu);
    }
    const handleUserSubmenuMobile = () => {
        setUserSubmenuMobile(!userSubmenuMobile);
    }

    const menu = [
        {
            heading: "Main", hId: 1, subHeaders: [
                { title: "Dashboard", icon: <PiSquaresFourDuotone />, id: 2 },
                {
                    title: "Application", id: 3, icon: <PiDeviceMobileCameraDuotone />, submenu: true,
                    submenuItems: [
                        { title: "Chat", id: 4 },
                        { title: "Calender", id: 5 },
                        { title: "Email", id: 6 }], line: true
                }
            ]
        },
        {
            heading: "Entry", hId: 7, subHeaders: [
                { title: "Coltan", icon: <PiCubeDuotone />, id: 8 },
                { title: "Cassiterite", icon: <PiPlusSquareDuotone />, id: 9 },
                { title: "Wolframite", icon: <PiCubeTransparentDuotone />, id: 10 },
                { title: "Lithium", icon: <PiTagDuotone />, id: 11 },
                { title: "Beryllium", icon: <PiSpeakerHifiDuotone />, id: 12 },
                { title: "Mixed", icon: <PiBarcodeDuotone />, id: 13 },
                { title: "Special", icon: <PiArrowsInSimpleDuotone />, line: true, id: 14 },]
        },
        {
            heading: "Shipments", hId: 15, subHeaders: [
                { title: "shipment", icon: <PiShoppingCartSimpleDuotone />, id: 16 },
                { title: "Invoices", icon: <PiFileTextDuotone />, id: 17 },
                { title: "Sales Return", icon: <PiFilesDuotone />, id: 18 },
                { title: "Quation", icon: <PiFloppyDiskDuotone />, id: 19 },
                {
                    title: "Transfer", icon: <TbArrowsCross />, submenu: true, id: 57, submenuItems: [
                        { title: "transfer List", id: 20 },
                        { title: "Import Transfer", id: 21 }
                    ]
                },
                {
                    title: "Return", icon: <PiArrowBendUpLeftDuotone />, submenu: true, id: 58, submenuItems: [
                        { title: "Sales Return", id: 22 },
                        { title: "Purchases Return", id: 23 }
                    ], line: true
                }]
        },

        {
            heading: "Purchases", hId: 24, subHeaders: [
                { title: "Purchases", icon: <PiShoppingBagDuotone />, id: 25 },
                { title: "Import Purchases", icon: <PiArrowsInSimpleDuotone />, id: 26 },
                { title: "Purchase Order", icon: <PiFileMinusDuotone />, id: 27 },
                { title: "Purchase Return", icon: <PiArrowsClockwiseDuotone />, line: true, id: 28 },]
        },
        {
            heading: "Finance & acconts", hId: 29, subHeaders: [
                {
                    title: "Expenses", icon: <PiFileTextDuotone />, submenu: true, submenuItems: [
                        { title: "Expenses", id: 30 },
                        { title: "Expenses Category", id: 31 }
                    ], line: true
                }]
        },
        {
            heading: "Peoples", hId: 32, subHeaders: [
                { title: "Customers", icon: <PiUserDuotone />, id: 33 },
                { title: "Suppliers", icon: <PiUsersDuotone />, id: 34 },
                { title: "Users", icon: <PiUserDuotone />, id: 35 },
                { title: "Stores", icon: <PiHouseDuotone />, line: true, id: 36 },
            ]
        },
        {
            heading: "Reports", hId: 37, subHeaders: [
                { title: "Sales Report", icon: <LuBarChart2 />, id: 38 },
                { title: "Purchase Report", icon: <PiChartPieDuotone />, id: 39 },
                { title: "Inventory Report", icon: <PiBrowserDuotone />, id: 40 },
                { title: "Invoice Report", icon: <PiFileDuotone />, id: 41 },
                { title: "Supplier Report", icon: <PiDatabaseDuotone />, id: 42 },
                { title: "Customer Report", icon: <PiChartPieDuotone />, line: true, id: 43 }
            ]
        },
        {
            heading: "User Management", hId: 44, subHeaders: [
                {
                    title: "Manage Users", icon: <PiUsersDuotone />, submenu: true, id: 45, submenuItems: [
                        { title: "New User", id: 46 },
                        { title: "Users List", id: 47 }
                    ], line: true
                },]
        },
        {
            heading: "Settings", hId: 48, subHeaders: [
                {
                    title: "Settings", icon: <PiGearDuotone />, submenu: true, id: 49, submenuItems: [
                        { title: "General Settings", id: 50 },
                        { title: "Email Settings", id: 51 },
                        { title: "Payment Settings", id: 52 },
                        { title: "Currency Settings", id: 53 },
                        { title: "Group Permissions", id: 54 },
                        { title: "Tax Rates", id: 55 },
                    ],
                },
                { title: "Logout", icon: <PiSignInDuotone />, id: 56 },]
        },

    ]

    // Define the roles and their associated menu item IDs and restricted item IDs
    const roleMenus = {
        admin: {
            allowedSections: [1, 7, 15, 24, 29, 32, 37, 44, 48],
            restrictedItems: {
                7: [11, 12], // For section with hId 7, restrict items 11 and 12
                15: [19, 58], // For section with hId 15, restrict items 19 and 58
                // Add more restricted items for specific sections as needed
            }
        },
        ceo: {
            allowedSections: [1, 7, 15, 24, 32,29, 37, 44, 48],
            restrictedItems: {
                15: [19, 58], // For section with hId 15, restrict items 19 and 58
                // Add more restricted items for specific sections as needed
            }
        },
        employee: {
            allowedSections: [1, 7, 15, 24, 32,29, 37, 44, 48],
            restrictedItems: {
                // Define restricted items for employee role if needed
            }
        },
        // Add more roles and associated menu item IDs and restrictions as needed
    };

    // Define the user's role and user ID (change these values as needed)
    const userRole = 'ceo'; // Change this to 'ceo', 'employee', etc.
    const userId = 123; // Change this to the actual user ID

    // Filter the original menu based on the user's role and restrictions
    const filteredMenu = menu.filter(section => roleMenus[userRole].allowedSections.includes(section.hId))
        .map(section => {
            if (section.subHeaders && section.subHeaders.length > 0) {
                const restrictedItems = roleMenus[userRole].restrictedItems[section.hId];
                if (restrictedItems) {
                    section.subHeaders = section.subHeaders.filter(item => !restrictedItems.includes(item.id));
                }
            }
            return section;
        });

    // Output the filtered menu
    // console.log(filteredMenu);


    return (
        <>

            <>
                {/* App bar */}
                <Appbar userSubmenu={userSubmenu}
                userSubmenuMobile={userSubmenuMobile}
                    handleUserSubmenu={handleUserSubmenu}
                    handleUserSubmenuMobile={handleUserSubmenuMobile} />

                {/* side bar */}
                <Sidebar filteredMenu={filteredMenu}
                    opennav={opennav}
                    open={open} />
                <div className={`content ml-14 -translate-x-0  transform ease-in-out duration-700 pt-20 px-2 h-screen md:px-5 pb-4 ${open && ' ml-[194px]'}`}>
                    <Outlet />
                </div>

            </>



        </>
    )
}
export default Layout;