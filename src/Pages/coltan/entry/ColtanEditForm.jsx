import React, { Fragment, useEffect, useState } from "react";
import dayjs from 'dayjs';
import moment from 'moment';
import { motion } from "framer-motion";
import { DatePicker, TimePicker, Spin } from 'antd';
import ActionsPagesContainer from "../../../components/Actions components/ActionsComponentcontainer";
import AddComponent from "../../../components/Actions components/AddComponent";
import { useCreateColtanEntryMutation, useGetOneColtanEntryQuery } from "../../../states/apislice";
import { FiSearch } from "react-icons/fi";
import { GrClose } from "react-icons/gr";
import { HiPlus, HiMinus } from "react-icons/hi";
import { useNavigate, useParams } from "react-router-dom";


const ColtanEditForm = () => {
    const { entryId } = useParams();
    const navigate = useNavigate();
    const { data, isLoading, isError, error, isSuccess } = useGetOneColtanEntryQuery({ entryId });
    const [createColtanEntry, { isLoading: isSending, isError: isFail, error: failError, isSuccess: isDone }] = useCreateColtanEntryMutation()
    const [formval, setFormval] = useState({ weightIn: "", companyName: "", licenseNumber: "", TINNumber: '', email: '', supplierId: '', companyRepresentative: "", representativeId: "", representativePhoneNumber: "", supplyDate: "", time: "", numberOfTags: '', mineTags: '', negociantTags: '', mineralType: '', mineralgrade: '', mineralprice: '', shipmentnumber: '', beneficiary: '', isSupplierBeneficiary: false });
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

    useEffect(() => {

        if (isSuccess) {
            const { data: dt } = data;
            const { entry: entr } = dt;
            // sup = sups;
            console.log(entr);
            setFormval({ ...formval, weightIn: entr.weightIn, companyName: entr.companyName, licenseNumber: entr.licenseNumber, TINNumber: entr.TINNumber, email: entr.email, supplierId: entr.supplierId, companyRepresentative: entr.companyRepresentative, representativeId: entr.representativeId, representativePhoneNumber: entr.representativePhoneNumber, supplyDate: dayjs(entr.supplyDate), time: dayjs(entr.time, 'HH:mm'), numberOfTags: entr.numberOfTags, mineTags: entr.mineTags, negociantTags: '', mineralType: entr.mineralType, mineralgrade: '', mineralprice: '', shipmentnumber: '', beneficiary: '', isSupplierBeneficiary: false });
            setlotDetails(entr.output);
            console.log(entr.output);
        }
    }, [isSuccess])


    const handleSearch = (e) => {
        setSearch(e.target.value);
        const clickedBook = sup.find((sup) => sup._id === e.target.value);
        if (clickedBook) {
            setFormval({ ...formval, companyName: clickedBook.companyName, licenseNumber: clickedBook.licenseNumber, TINNumber: clickedBook.TINNumber, email: clickedBook.email, supplierId: clickedBook._id });
            setBeneficial(clickedBook.companyName);
        };
        setchecked(false);
    };
    const handleSearchCancel = () => {
        setSearch("");
        setSearchData([]);
        setSelectedItem(-1)
    }
    const handleSelectedSearch = (e) => {
        setSearch(e);
        setBeneficial(e);
        setOpenlist(false);
    }
    const handleKeydown = (e) => {
        if (selectedItem < searchData.length) {


            if (e.key === "ArrowUp" && selectedItem > 0) {
                setSelectedItem((prev) => prev - 1);
            }
            else if (e.key === "ArrowDown" && selectedItem < searchData.length - 1) {
                setSelectedItem((prev) => prev + 1);
            }
            else if (e.key === "Enter" && selectedItem >= 0) {
                setBeneficial(searchData[selectedItem].companyName);
                console.log(searchData[selectedItem].companyName);
                setSearch(searchData[selectedItem].companyName);
                setSelectedItem(-1)
                setSearchData([]);
                setOpenlist(false)
            }
        }
        else {
            selectedItem(-1)
        }
        if (e.key === "Enter") {
            setSearchData([]);
        }
    }


    const handleEntry = (e) => {
        setFormval((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
        if (e.target.name === 'mineralType') {
            setModel(e.target.value)
        }

    };


    const handleAddDate = (date, dateString) => {
        setFormval((prevState) => ({
            ...prevState,
            supplyDate: dateString,
        }));
    };

    const handleAddTime = (time, timeString) => {
        setFormval((prevState) => ({
            ...prevState,
            time: timeString,
        }));
    };
    const updateLotNumbers = () => {
        setlotDetails((prevLotDetails) => {
            return prevLotDetails.map((lot, index) => ({
                ...lot,
                lotNumber: index + 1,
            }));
        });
    };
    const handleAddLot = () => {
        setlotDetails((prevLotDetails) => [...prevLotDetails, { lotNumber: "", weightOut: "" }]);
        updateLotNumbers();
    };

    const handleLotEntry = (index, e) => {
        setlotDetails((prevLotDetails) => {
            const updatedLotDetails = prevLotDetails.map((lot, i) => {
                if (i === index) {
                    return {
                        ...lot,
                        [e.target.name]: e.target.value,
                    };
                }
                return lot;
            });

            // If the lot doesn't exist in the previous state (i.e., it's a new lot)
            if (index === prevLotDetails.length) {
                return [
                    ...updatedLotDetails,
                    { lotNumber: prevLotDetails.length + 1, [e.target.name]: e.target.value },
                ];
            }

            return updatedLotDetails;
        });

    };

    const handleLRemoveLot = (index) => {
        const values = [...lotDetails];
        values.splice(index, 1);
        const updatedValues = values.map((lot, i) => {
            return {
                ...lot,
                lotNumber: i + 1,
            };
        });
        setlotDetails(updatedValues);
    };

    const handleCheck = () => {
        setchecked((prev) => !prev);
        console.log(checked)
        if (Boolean(checked) === false) {
            setFormval({ ...formval, beneficiary: beneficial, isSupplierBeneficiary: true });
        }
        else if (Boolean(checked) === true) {
            setFormval({ ...formval, beneficiary: '', isSupplierBeneficiary: false });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = { ...formval, output: lotDetails };
        // await createColtanEntry({ body });
        console.log(body);
        // navigate(-1);
    };
    const handleCancel = () => {
        setFormval({ weightIn: "", companyName: "", licenseNumber: "", TINNumber: '', email: '', supplierId: '', companyRepresentative: "", representativeId: "", representativePhoneNumber: "", supplyDate: "", time: "", numberOfTags: '', mineTags: '', negociantTags: '', mineralType: '', mineralgrade: '', mineralprice: '', shipmentnumber: '', beneficiary: '', isSupplierBeneficiary: false });
        setlotDetails([{ lotNumber: "", weightOut: "" },])
        navigate(-1);
    };

    return (
        <>
            <ActionsPagesContainer title={'Edit coltan entry'}
                subTitle={'Edit/Update coltan entry'}
                actionsContainer={<AddComponent component={
                    <div className="grid grid-cols-1 gap-1">
                        {/* <ul className="grid grid-cols-1 gap-1 gap-x-2 md:grid-cols-2 lg:grid-cols-3 pb-12">


                            <li className=" space-y-2">
                                <p>Trade in Company</p>
                                <select autoComplete="off" name="search supplier" id="search supplier" className="focus:outline-none p-2 border rounded-md w-full" onChange={handleSearch} >

                                    {sup.map(({ companyName, _id }, index) => {
                                        return (
                                            <option value={_id} key={index} >{companyName}</option>
                                        )
                                    })}
                                </select>
                            </li>
                            

                        </ul> */}

                        <ul className="list-none grid gap-4 items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

                            <li className=" space-y-1">
                                <p className="pl-1">Company name</p>
                                <input type="text" autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="companyName" id="companyName" value={formval.companyName || ''} onChange={handleEntry} />
                            </li>
                            <li className=" space-y-1">
                                <p className="pl-1">Email</p>
                                <input type="email" autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="email" id="email" value={formval.email || ''} onChange={handleEntry} />
                            </li>
                            <li className=" space-y-1">
                                <p className="pl-1">TIN Number</p>
                                <input type="text" autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="TINNumber" id="TINNumber" value={formval.TINNumber || ''} onChange={handleEntry} />
                            </li>
                            <li className=" space-y-1">
                                <p className="pl-1">Licence number</p>
                                <input type="text" autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="licenseNumber" id="licenseNumber" value={formval.licenseNumber || ''} onChange={handleEntry} />
                            </li>
                            <li className=" space-y-1">
                                <p className="pl-1">Company representative</p>
                                <input type="text" autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="companyRepresentative" id="companyRepresentative" value={formval.companyRepresentative || ''} onChange={handleEntry} />
                            </li>
                            <li className=" space-y-1">
                                <p className="pl-1">Representative ID number</p>
                                <input type="text" autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="representativeId" id="representativeId" value={formval.representativeId || ''} onChange={handleEntry} />
                            </li>
                            <li className=" space-y-1">
                                <p className="pl-1">Representative phone nbr</p>
                                <input type="text" autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="representativePhoneNumber" id="representativePhoneNumber" value={formval.representativePhoneNumber || ''} onChange={handleEntry} />
                            </li>
                            <li className=" space-y-1">
                                <p className="pl-1">Minerals Types</p>
                                <input autoComplete="off" disabled name="mineralType" id="mineralType" className="focus:outline-none p-2 border rounded-md w-full" value={formval.mineralType || ''} onChange={handleEntry} />
                            </li>
                            <li className=" space-y-1">
                                <p className="pl-1">Date</p>
                                <DatePicker value={formval.supplyDate ? dayjs(formval.supplyDate) : null} onChange={handleAddDate} id="supplyDate" name="supplyDate" className=" focus:outline-none p-2 border rounded-md w-full" />
                            </li>
                            <li className=" space-y-1">
                                <p className="pl-1">Time</p>
                                <TimePicker value={formval.time ? dayjs(formval.time, 'HH:mm') : null} onChange={handleAddTime} format={'HH:mm'} id="date" name="date" className=" focus:outline-none p-2 border rounded-md w-full" />
                            </li>

                            <li className=" space-y-1">
                                <p className="pl-1">Weight in</p>
                                <input type="text" autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="weightIn" id="weightIn" value={formval.weightIn || ''} onChange={handleEntry} />
                            </li>
                            <li className=" space-y-1">
                                <p className="pl-1">Number of Tags</p>
                                <input type="number" autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="numberOfTags" id="numberOfTags" value={formval.numberOfTags || ''} onChange={handleEntry} />
                            </li>
                            <li className=" space-y-1">
                                <span className=" flex gap-2 items-center">
                                    <p>Beneficiary</p>
                                    {/* <span className={`border h-4 w-9 rounded-xl p-[0.5px] duration-200 transform ease-in-out flex ${checked ? ' justify-end bg-green-400' : ' justify-start bg-slate-400'}`} onClick={handleCheck}>
                                        <span className={` w-4 h- border bg-white rounded-full `}></span>
                                    </span> */}
                                </span>
                                <input type="text" autoComplete="off" disabled={checked} className="focus:outline-none p-2 border rounded-md w-full" name="beneficiary" id="beneficiary" value={formval.beneficiary || ''} onChange={handleEntry} />
                            </li>

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

                            </li>

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
export default ColtanEditForm;