import React, { Fragment, useEffect, useState } from "react";
import dayjs from 'dayjs';
import { motion } from "framer-motion";
import { DatePicker, TimePicker, Spin } from 'antd';
import ActionsPagesContainer from "../../../components/Actions components/ActionsComponentcontainer";
import AddComponent from "../../../components/Actions components/AddComponent";
import { useGetAllSuppliersQuery, useCreateBerylliumEntryMutation } from "../../../states/apislice";
import { FiSearch } from "react-icons/fi";
import { GrClose } from "react-icons/gr";
import { HiPlus, HiMinus } from "react-icons/hi";
import { useNavigate } from "react-router-dom";


const BerylliumEntryForm = () => {
    let sup = [''];
    const navigate = useNavigate();
    const { data, isLoading, isError, error, isSuccess } = useGetAllSuppliersQuery()
    const [createBerylliumEntry, { isLoading: isSending, isError: isFail, error: failError, isSuccess: isDone }] = useCreateBerylliumEntryMutation()
    const [formval, setFormval] = useState({ weightIn: "", weightOut: '',supplierName: "", phoneNumber: "", supplyDate: "", time: "", numberOfTags: '', mineTags: '', negociantTags: '', mineralType: 'beryllium', mineralgrade: '', mineralprice: '', shipmentnumber: '', beneficiary: '', isSupplierBeneficiary: false });
    const [lotDetails, setlotDetails] = useState([
        { lotNumber: "", weightOut: "" },
    ]);
    const [checked, setchecked] = useState(false);
    const [openlist, setOpenlist] = useState(false);
    const [search, setSearch] = useState("");
    const [model, setModel] = useState("");
    const [searchData, setSearchData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(-1);
    const [beneficial, setBeneficial] = useState("");
    const [admin, setAdmin] = useState({ role: 'admin' });

    if (isSuccess) {
        const { data: dt } = data;
        const { suppliers: sups } = dt;
        sup = sups;
        console.log(sup);

    }


    // const handleSearch = (e) => {
    //     setSearch(e.target.value);
    //     const clickedBook = sup.find((sup) => sup._id === e.target.value);
    //     if (clickedBook) {
    //         setFormval({ ...formval, supplier: clickedBook.supplier, licenseNumber: clickedBook.licenseNumber, TINNumber: clickedBook.TINNumber, email: clickedBook.email, supplierId: clickedBook._id });
    //         setBeneficial(clickedBook.supplier);
    //     };
    //     setchecked(false);
    // };
    // const handleSearchCancel = () => {
    //     setSearch("");
    //     setSearchData([]);
    //     setSelectedItem(-1)
    // }
    // const handleSelectedSearch = (e) => {
    //     setSearch(e);
    //     setBeneficial(e);
    //     setOpenlist(false);
    // }
    // const handleKeydown = (e) => {
    //     if (selectedItem < searchData.length) {


    //         if (e.key === "ArrowUp" && selectedItem > 0) {
    //             setSelectedItem((prev) => prev - 1);
    //         }
    //         else if (e.key === "ArrowDown" && selectedItem < searchData.length - 1) {
    //             setSelectedItem((prev) => prev + 1);
    //         }
    //         else if (e.key === "Enter" && selectedItem >= 0) {
    //             setBeneficial(searchData[selectedItem].supplier);
    //             console.log(searchData[selectedItem].supplier);
    //             setSearch(searchData[selectedItem].supplier);
    //             setSelectedItem(-1)
    //             setSearchData([]);
    //             setOpenlist(false)
    //         }
    //     }
    //     else {
    //         selectedItem(-1)
    //     }
    //     if (e.key === "Enter") {
    //         setSearchData([]);
    //     }
    // }


    const handleEntry = (e) => {
        setFormval((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
        if (e.target.name === 'mineralType') {
            setModel(e.target.value)
        }

    };

    const handleAddDate = (e) => {
        setFormval((prevState) => ({ ...prevState, supplyDate: dayjs(e).format('MMM/DD/YYYY') }));
    };

    const handleAddTime = (e) => {
        setFormval((prevState) => ({ ...prevState, time: dayjs(e).format('HH:mm') }));
    };
    // const handleAddLot = () => {
    //     setlotDetails([...lotDetails, { lotNumber: '', weightOut: '' }]);
    // };

    // const handleLotEntry = (index, e) => {
    //     const values = [...lotDetails];
    //     values[index][e.target.name] = e.target.value;
    //     values[index].lotNumber = index + 1;
    //     setlotDetails(values);
    // };

    // const handleLRemoveLot = (index) => {
    //     const values = [...lotDetails];
    //     values.splice(index, 1);
    //     values.forEach((lot, i) => {
    //         lot.lotNumber = i + 1;
    //     });
    //     setlotDetails(values);
    // };

    // const handleCheck = () => {
    //     setchecked((prev) => !prev);
    //     console.log(checked)
    //     if (Boolean(checked) === false) {
    //         setFormval({ ...formval, beneficiary: beneficial, isSupplierBeneficiary: true });
    //     }
    //     else if (Boolean(checked) === true) {
    //         setFormval({ ...formval, beneficiary: '', isSupplierBeneficiary: false });
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = { ...formval, output: lotDetails };
        await createBerylliumEntry({ body });
        console.log(body);
        navigate(-1);
    };
    const handleCancel = () => {
        setFormval({ weightIn: "", weightOut: '', supplierName: "", licenseNumber: "", TINNumber: '', email: '', supplierId: '', companyRepresentative: "", representativeId: "", phoneNumber: "", supplyDate: "", time: "", numberOfTags: '', mineTags: '', negociantTags: '', mineralType: 'beryllium', mineralgrade: '', mineralprice: '', shipmentnumber: '', beneficiary: '', isSupplierBeneficiary: false });
        setlotDetails([{ lotNumber: "", weightOut: "" },])
        console.log(checked)
    };

    return (
        <>
            <ActionsPagesContainer title={'Register beryllium entry'}
                                   subTitle={'Add new beryllium entry'}
                                   actionsContainer={<AddComponent component={
                                       <div className="grid grid-cols-1 gap-1">
                                           {/* <ul className="grid grid-cols-1 gap-1 gap-x-2 md:grid-cols-2 lg:grid-cols-3 pb-12">


                            <li className=" space-y-2">
                                <p>Trade in Company</p>
                                <select autoComplete="off" name="search supplier" id="search supplier" className="focus:outline-none p-2 border rounded-md w-full" onChange={handleSearch} >

                                    {sup.map(({ supplier, _id }, index) => {
                                        return (
                                            <option value={_id} key={index} >{supplier}</option>
                                        )
                                    })}
                                </select>
                            </li>
                            

                        </ul> */}

                                           <ul className="list-none grid gap-4 items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

                                               <li className=" space-y-1">
                                                   <p className="pl-1">Supplier</p>
                                                   <input type="text" autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="supplierName" id="supplierName" value={formval.supplierName || ''} onChange={handleEntry} />
                                               </li>

                                               <li className=" space-y-1">
                                                   <p className="pl-1">Phone number</p>
                                                   <input type="text" autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="phoneNumber" id="phoneNumber" value={formval.phoneNumber || ''} onChange={handleEntry} />
                                               </li>
                                               <li className=" space-y-1">
                                                   <p className="pl-1">Minerals Type</p>
                                                   <input autoComplete="off" disabled name="mineralType" id="mineralType" className="focus:outline-none p-2 border rounded-md w-full" value={formval.mineralType || ''} onChange={handleEntry} />
                                               </li>
                                               <li className=" space-y-1">
                                                   <p className="pl-1">Date</p>
                                                   <DatePicker onChange={handleAddDate} id="supplyDate" name="supplyDate" className=" focus:outline-none p-2 border rounded-md w-full" />
                                               </li>
                                               <li className=" space-y-1">
                                                   <p className="pl-1">Time</p>
                                                   <TimePicker onChange={handleAddTime} format={'HH:mm'} id="date" name="date" className=" focus:outline-none p-2 border rounded-md w-full" />
                                               </li>

                                               <li className=" space-y-1">
                                                   <p className="pl-1">Weight in</p>
                                                   <input type="text" autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="weightIn" id="weightIn" value={formval.weightIn || ''} onChange={handleEntry} />
                                               </li>
                                               <li className=" space-y-1">
                                                   <p className="pl-1">Weight out</p>
                                                   <input type="text" autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="weightOut" id="weightOut" value={formval.weightOut || ''} onChange={handleEntry} />
                                               </li>
                                               {/* <li className=" space-y-1">
                                <p className="pl-1">Number of Tags</p>
                                <input type="number" autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="numberOfTags" id="numberOfTags" value={formval.numberOfTags || ''} onChange={handleEntry} />
                            </li> */}
                                               {/* <li className=" space-y-1">
                                <span className=" flex gap-2 items-center">
                                    <p>Beneficiary</p>
                                    <span className={`border h-4 w-9 rounded-xl p-[0.5px] duration-200 transform ease-in-out flex ${checked ? ' justify-end bg-green-400' : ' justify-start bg-slate-400'}`} onClick={handleCheck}>
                                        <span className={` w-4 h- border bg-white rounded-full `}></span>
                                    </span>
                                </span>
                                <input type="text" autoComplete="off" disabled={checked} className="focus:outline-none p-2 border rounded-md w-full" name="beneficiary" id="beneficiary" value={formval.beneficiary || ''} onChange={handleEntry} />
                            </li> */}
                                               {/*
                            <li className=" space-y-3 grid gap-4 items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 col-span-full ">
                                <span className=" bg-slate-800 p-[0.5px] relative col-span-full mb-3">
                                    <p className="pl-1 bg-white absolute -top-4 left-2 font-semibold">Lot number (output)</p>
                                </span>
                                <div className="col-span-1 space-y-3">
                                    {lotDetails.map((lot, index) => (
                                        <div key={index} className="flex gap-2 items-center w-full">
                                            <p className=" font-semibold">{lot.lotNumber}</p>
                                            <input animate={{}} type="number" autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="weightOut" id="weightOut" value={lot.weightOut || ''} onWheelCapture={e => { e.target.blur() }} onChange={e => handleLotEntry(index, e)} />
                                            <HiMinus onClick={() => handleLRemoveLot(index)} className={`${lotDetails.length - 1 == 0 ? 'hidden' : ''}`} />
                                            <HiPlus onClick={handleAddLot} className={`${lotDetails.length - 1 !== index ? 'hidden' : ''}`} />
                                        </div>
                                    ))}
                                </div>

                            </li> */}

                                           </ul>
                                       </div>
                                   }
                                                                   Add={handleSubmit}
                                                                   Cancel={handleCancel}
                                                                   isloading={isSending}
                                   />} />
        </>
    )
}
export default BerylliumEntryForm;