import React, { useState } from "react";
import { Input, Modal, Table } from "antd";
import { motion } from "framer-motion";
import { PiMagnifyingGlassDuotone, PiDotsThreeVerticalBold, PiClipboardDuotone,PiEyeDuotone, PiTrashFill, PiPencilCircleDuotone } from "react-icons/pi";
import { BiSolidFilePdf } from "react-icons/bi"
import { BsCardList } from "react-icons/bs"
import { HiOutlinePrinter } from "react-icons/hi"
import SalesListContainer from "../components/Listcomponents/ListContainer";
import { useGetAllBuyersQuery,useDeleteBuyerMutation } from "../states/apislice";
import { useNavigate } from "react-router-dom";

const BuyersListPage = () => {
    let dataz = [];
    const { data, isLoading, isSuccess, isError, error } = useGetAllBuyersQuery();
    const[deleteBuyer,{isLoading:isDeleting,isSuccess:isdone,isError:isproblem}]=useDeleteBuyerMutation();

    const navigate=useNavigate();
    const [searchText, SetSearchText] = useState("");
    const [showActions, SetShowActions] = useState(false);
    const [selectedRow, SetSelectedRow] = useState(null);
    const [showmodal, setShowmodal] = useState(false);

    if (isSuccess) {
        const { data: dt } = data;
        const { buyers: byrz } = dt;
        console.log(byrz);
        dataz = byrz;
    };
    const handleActions = (id) => {
        SetShowActions(!showActions);
        SetSelectedRow(id)
        console.log('Deleted ID:', id);
    };
    const handleDelete = async() => {
        // console.log(selectedRow);
        const buyerId= selectedRow;
        await deleteBuyer({buyerId});
        setShowmodal(!showmodal);
    
    };
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: (a, b) => a.email.localeCompare(b.email),
        },
        {
            title: 'Country',
            dataIndex: 'country',
            key: 'country',
            sorter: (a, b) => a.country.localeCompare(b.country),
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            sorter: (a, b) => a.address.localeCompare(b.address),
        },
        {
            title: 'Destination',
            dataIndex: 'destination',
            key: 'destination',
            sorter: (a, b) => a.destination.localeCompare(b.destination),
        },

        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (_, record) => {
                return (
                    <>
                        <div className="flex items-center gap-1">
                            <span className="relative">
                                <PiDotsThreeVerticalBold onClick={() => handleActions(record._id)} />
                                {selectedRow === record._id && (
                                    <motion.ul animate={showActions ? { opacity: 1, x: -10, display: "block" } : { opacity: 0, x: 0, display: "none", }} className={` border bg-white z-20 shadow-md rounded absolute -left-[200px] w-[200px] space-y-2`}>
                                        <li className="flex gap-2 p-2 items-center hover:bg-slate-100" onClick={() => {
                                            console.log('Action 1 :', record._id, record.name);
                                            SetShowActions(!showActions)
                                        }}>
                                            <PiClipboardDuotone className=" text-xl" />
                                            <p>shedule</p>
                                        </li>
                                        <li className="flex gap-2 p-2 items-center hover:bg-slate-100" onClick={() => {navigate(`/buyer/details/${record._id}`)}}>
                                            <PiEyeDuotone className=" text-xl" />
                                            <p>details</p>
                                        </li>
                                        <li className="flex gap-2 p-2 items-center hover:bg-slate-100" onClick={() => {{navigate(`/edit/buyer/${record._id}`)} }}>
                                            <PiPencilCircleDuotone className=" text-xl" />
                                            <p>edit</p>
                                        </li>
                                        <li className="flex gap-2 p-2 items-center hover:bg-slate-100" onClick={() => {
                                            console.log('Action 4 :', record._id);
                                            SetShowActions(!showActions)
                                        }}>
                                            <PiClipboardDuotone className=" text-xl" />
                                            <p>shedule</p>
                                        </li>
                                    </motion.ul>)}
                            </span>

                            <span>
                                <PiTrashFill onClick={() => {
                                    SetSelectedRow(record._id);
                                    setShowmodal(!showmodal);
                                }} />


                            </span>
                        </div>


                    </>
                )
            }
        },
    ]

    return (
        <>
            <SalesListContainer title={'Buyers list'}
                subTitle={'Manage your buyers'}
                navLinktext={'add/buyer'}
                navtext={'Add new Buyer'}
                table={
                    <>
                        <Modal

                            open={showmodal}
                            onOk={() => handleDelete(selectedRow)}
                            onCancel={() => setShowmodal(!showmodal)}
                            destroyOnClose
                            footer={[
                                <span key="actions" className=" flex w-full justify-center gap-4 text-base text-white">
                                    <button key="back" className=" bg-green-400 p-2 rounded-lg" onClick={handleDelete}>
                                        Confirm
                                    </button>
                                    <button key="submit" className=" bg-red-400 p-2 rounded-lg" type="primary" onClick={() => setShowmodal(!showmodal)}>
                                        Cancel
                                    </button>
                                </span>
                            ]}

                        >

                            <h2 className="modal-title text-center font-bold text-xl">Confirm Delete</h2>
                            <p className="text-center text-lg">{`Are you sure you want to delete ${selectedRow}`}.</p>
                        </Modal>
                        <div className=" w-full overflow-x-auto h-full min-h-[320px]">
                            <div className="w-full flex flex-col  sm:flex-row justify-between items-center mb-4 gap-3">
                                <span className="max-w-[220px] border rounded flex items-center p-1 justify-between gap-2">
                                    <PiMagnifyingGlassDuotone className="h-4 w-4" />
                                    <input type="text" className=" w-full focus:outline-none" name="tableFilter" id="tableFilter" placeholder="Search..." onChange={(e) => SetSearchText(e.target.value)} />
                                </span>

                                <span className="flex w-fit justify-evenly items-center gap-6 pr-1">
                                    <BiSolidFilePdf className=" text-2xl" />
                                    <BsCardList className=" text-2xl" />
                                    <HiOutlinePrinter className=" text-2xl" />
                                </span>
                            </div>
                            <Table className=" w-full"
                                loading={isLoading}
                                dataSource={dataz}
                                columns={columns}
                                rowKey="_id"
                            />
                        </div>
                    </>

                } />
        </>
    )
}
export default BuyersListPage;