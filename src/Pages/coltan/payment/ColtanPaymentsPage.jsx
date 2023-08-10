import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { Spin, Table, Form, Input, Button, Modal } from 'antd';
import ActionsPagesContainer from "../../../components/Actions components/ActionsComponentcontainer";
// import AddComponent from "../../../components/Actions components/AddComponent";
import { RiFileListFill, RiFileEditFill } from "react-icons/ri"
import { PiDotsThreeVerticalBold } from "react-icons/pi"
import { MdDelete} from "react-icons/md"
import {GrHistory} from "react-icons/gr"
import { useNavigate, useParams } from "react-router-dom";
import { PiMagnifyingGlassDuotone } from "react-icons/pi";
import { BiSolidFilePdf, BiSolidEditAlt } from "react-icons/bi"
import { BsCardList } from "react-icons/bs"
import { HiOutlinePrinter } from "react-icons/hi"


const ColtanPaymentsPage = () => {
    const { entryId } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm()
    const [formval, setFormval] = useState({ lat: '', long: '', name: '', code: '' });
    const [selectedRow, SetSelectedRow] = useState({ id: null, name: '', date: '' });
    const [suply, setSuply] = useState([]);
    const [lotInfo, setLotInfo] = useState(null);
    const [editingRow, setEditingRow] = useState(null);
    const [editRowKey, setEditRowKey] = useState("");
    const [show, setShow] = useState(false);
    const [showPayModel, setShowPayModel] = useState(false);

    const columns = [
        {
            title: '#',
            dataIndex: 'lotNumber',
            key: 'lotNumber',
            sorter: (a, b) => a.lotNumber.localeCompare(b.lotNumber),
        },
        {
            title: 'DATE',
            dataIndex: 'supplyDate',
            key: 'supplyDate',
            sorter: (a, b) => a.supplyDate - b.supplyDate,
            render: (text) => {
                return (
                    <>
                        <p>{dayjs(text).format('MMM DD, YYYY')}</p>
                    </>
                )
            }
        },
        {
            title: 'weightOut',
            dataIndex: 'weightOut',
            key: 'weightOut',
            editTable: true,

            sorter: (a, b) => a.weightOut.localeCompare(b.weightOut),
        },
        {
            title: 'paid',
            dataIndex: 'paid',
            key: 'paid',
            editTable: true,
            sorter: (a, b) => a.paid.localeCompare(b.paid),
        },
        {
            title: 'cummulative A',
            dataIndex: 'cumulativeAmount',
            key: 'cumulativeAmount',
            sorter: (a, b) => a.cumulativeAmount.localeCompare(b.cumulativeAmount),
        },
        {
            title: 'rmaFee',
            dataIndex: 'rmaFee',
            key: 'rmaFee',
            editTable: true,

            sorter: (a, b) => a.rmaFee - b.rmaFee,
        },
        {
            title: 'status',
            dataIndex: 'status',
            key: 'status',
            sorter: (a, b) => a.status.localeCompare(b.status),
            render: (text) => {
                // "in stock", "fully exported", "rejected", "non-sell agreement", "partially exported"
                let color = (text === 'in stock') ? 'bg-green-500' : ((text === 'ordered') ? 'bg-amber-500' : 'bg-red-500');
                return (
                    <p className={` px-3 py-1 ${color} w-fit text-white rounded`}>{text}</p>
                )
            }
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            // render: (_, record) => {
            //     const editable = isEditing(record);
            //     return (
            //         <>
            //             <div className="flex items-center gap-1">
            //                 <span className="relative">
            //                     <PiDotsThreeVerticalBold className=" text-xl"
            //                         onClick={() => handleActions(record._id)}
            //                     />
            //                     {selectedRow === record._id && (
            //                         <motion.ul animate={show ? { opacity: 1, x: -10, display: "block" } : { opacity: 0, x: 0, display: "none", }} className={` border bg-white z-20 shadow-md rounded absolute -left-[200px] w-[200px] space-y-2`}>

            //                             <li className="flex gap-4 p-2 items-center hover:bg-slate-100" onClick={() => { navigate(`/buyer/details/${record._id}`) }}>
            //                                 <RiFileListFill className=" text-lg" />
            //                                 <p>more details</p>
            //                             </li>
            //                             <li className="flex gap-4 p-2 items-center hover:bg-slate-100" onClick={() => { { navigate(`/edit/coltan/${record._id}`) } }}>
            //                                 <BiSolidEditAlt className=" text-lg" />
            //                                 <p>edit</p>
            //                             </li>
            //                             <li className="flex gap-4 p-2 items-center hover:bg-slate-100" onClick={() => { { navigate(`/complete/coltan/${record._id}`) } }}>
            //                                 <RiFileEditFill className=" text-lg" />
            //                                 <p>complete entry</p>
            //                             </li>
            //                             <li className="flex gap-4 p-2 items-center hover:bg-slate-100" onClick={() => setShowPayModel(true)} >
            //                                 <MdPayments className=" text-lg" />
            //                                 <p>Pay</p>
            //                             </li>
            //                         </motion.ul>)}
            //                 </span>

                            
            //                 <BiSolidEditAlt className=" text-xl" onClick={() => {
            //                     setEditingRow(record._id);
            //                     form.setFieldsValue({
            //                         weightOut: record.weightOut,
            //                         rmaFee: record.rmaFee,
            //                     })
            //                 }} />

            //                 {editable ? (
            //                     <div className="flex items-center gap-3">
            //                         <FaSave className=" text-xl" onClick={() => save(record._id)} />
            //                         <MdOutlineClose className=" text-xl" onClick={() => setEditRowKey("")} />

            //                     </div>

            //                 ) : (

            //                     <BiSolidEditAlt className=" text-xl" onClick={() => edit(record)} />

            //                 )}




            //             </div>


            //         </>
            //     )
            // }
        },
    ];

    const testInfo=[{cumulativeAmount: 70,exportedAmount:0,lotNumber: 1,paid: 150000,rmaFee: 8750,rmaFeeDecision: "pending",settled: false,status: "in progress",weightOut:  70,_id: "64ccaff3669d584e8ff70bbc"},{
        cumulativeAmount:40,exportedAmount: 0,id: "64ca67b1492ba72b23596c5a",lotNumber: 2,paid: 120000,rmaFee: 5000,rmaFeeDecision: "pending",settled: false,status: "in progress",weightOut: 40,_id: "64ca67b1492ba72b23596c5a",
    }];

    return (
        <div>
            <ActionsPagesContainer title={'Coltan Payments'}
                subTitle={'Make Coltan Payments'}
                actionsContainer={
                    // <AddComponent component={
                    <>

                        <div className="w-full space-y-4">
                        <p className=" font-bold text-lg">Total Amount: 750,000</p>
                        <div className="flex gap-2 items-center pb-9">
                        <GrHistory/>
                                <p className=" text-lg font-semibold">Payments history</p>
                            </div>
                        <span>
                        <div className="w-full flex flex-col  sm:flex-row justify-between items-center mb-4 gap-3">
                                <span className="max-w-[220px] border rounded flex items-center p-1 justify-between gap-2">
                                    <PiMagnifyingGlassDuotone className="h-4 w-4" />
                                    <input type="text" className=" w-full focus:outline-none" name="tableFilter" id="tableFilter" placeholder="Search..." onChange={(e) => SetSearchText(e.target.value)} />
                                </span>

                                {/* <span className="flex w-fit justify-evenly items-center gap-6 pr-1">
                                    <BiSolidFilePdf className=" text-2xl" />
                                    <BsCardList className=" text-2xl" />
                                    <HiOutlinePrinter className=" text-2xl" />
                                </span> */}
                            </div>
                        <Table className=" overflow-x-auto"
                        columns={columns}
                        dataSource={testInfo}
                        pagination={false}/>
                        </span>
                        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-md">
                            <p className=" font-semibold text-lg">Sum(Paid):</p>
                            <p>270,000</p>
                        </div>
                        </div>


                    </>
                    // }
                    // />


                } />
        </div>
    )
}
export default ColtanPaymentsPage;