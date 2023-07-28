import React,{useState} from "react";
import { Input, Modal, Table } from "antd";
import { motion } from "framer-motion";
import { PiMagnifyingGlassDuotone, PiDotsThreeVerticalBold, PiClipboardDuotone,PiEyeDuotone, PiTrashFill, PiPencilCircleDuotone } from "react-icons/pi";
import { BiSolidFilePdf } from "react-icons/bi"
import { BsCardList } from "react-icons/bs"
import { HiOutlinePrinter } from "react-icons/hi"
import SuppliersListContainer from "../components/Listcomponents/SuppliersListContainer";
import { useGetAllSuppliersQuery,useDeleteSupplierMutation } from "../states/apislice";
import { useMyContext } from "../context files/MycontextProvider";
import { useNavigate } from "react-router-dom";

const SuppliersListPage=()=>{
    let dataz = [];
    const {data,isLoading,isError,isSuccess,error}=useGetAllSuppliersQuery();
    const[deleteSupplier,{isLoading:isDeleting,isSuccess:isdone,isError:isproblem}]=useDeleteSupplierMutation();
    const { sharedData,setsharedData}=useMyContext();
    const navigate=useNavigate();
    const [searchText, SetSearchText] = useState("");
    const [showActions, SetShowActions] = useState(false);
    const [selectedRow, SetSelectedRow] = useState(null);
    const [showmodal, setShowmodal] = useState(false);

    if (isSuccess) {
        const {data:dt}=data;
        const {suppliers:spl}=dt;
        console.log(spl);
        dataz=spl;
      };

      const handleActions = (id) => {
        SetShowActions(!showActions);
        SetSelectedRow(id)
        console.log('Deleted ID:', id);
    };
    const handleDelete = async() => {
        // console.log(selectedRow);
        const supplierId= selectedRow;
        await deleteSupplier({supplierId});
        setShowmodal(!showmodal);
    
    };
    const columns = [
        {
            title: 'Company Name',
            dataIndex: 'companyName',
            key: 'companyName',
            sorter: (a, b) => a.companyName.localeCompare(b.companyName),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: (a, b) => a.email.localeCompare(b.email),
        },
        {
            title: 'TINNumber',
            dataIndex: 'TINNumber',
            key: 'TINNumber',
            sorter: (a, b) => a.TINNumber.localeCompare(b.TINNumber),
        },
        {
            title: 'License Number',
            dataIndex: 'licenseNumber',
            key: 'licenseNumber',
            sorter: (a, b) => a.licenseNumber.localeCompare(b.licenseNumber),
        },
        {
            title: 'phoneNumber',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            sorter: (a, b) => a.phoneNumber.localeCompare(b.phoneNumber),
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
                                    <motion.ul animate={showActions ? { opacity: 1, x: -10, display: "block" } : { opacity: 0, x: 0, display: "none", }} className={` border bg-white z-20 shadow-md rounded absolute -left-[170px] w-[170px] space-y-2`}>
                                     
                                        <li className="flex gap-2 p-2 items-center hover:bg-slate-100" onClick={() => {navigate(`/supplier/details/${record._id}`)}}>
                                            <PiEyeDuotone className=" text-xl" />
                                            <p>details</p>
                                        </li>
                                        <li className="flex gap-2 p-2 items-center hover:bg-slate-100" onClick={() => {{navigate(`/add/supplier/minesite/${record._id}`)} }}>
                                            <PiPencilCircleDuotone className=" text-xl" />
                                            <p>New minesite</p>
                                        </li>
                                        <li className="flex gap-2 p-2 items-center hover:bg-slate-100" onClick={() => {
                                            console.log('Action 4 :', record._id);
                                            SetShowActions(!showActions)
                                        }}>
                                            <PiClipboardDuotone className=" text-xl" />
                                            <p>Edit</p>
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
        <SuppliersListContainer title={'Suppliers List'}
        subTitle={'Manage your Suppliers'}
        navLinktext={'add/supplier'}
        navtext={'Add supplier'}
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
        }/>
        </>
    )
}
export default SuppliersListPage;