import React, { Fragment, useEffect, useState,useRef } from "react";
import dayjs from "dayjs";
import moment from "moment";
import { motion } from "framer-motion";
import { DatePicker, TimePicker, Spin } from "antd";
import ActionsPagesContainer from "../../../components/Actions components/ActionsComponentcontainer";
import AddComponent from "../../../components/Actions components/AddComponent";
import {
  useUpdateLithiumEntryMutation,
  useGetOneLithiumEntryQuery,useGetAllSuppliersQuery
} from "../../../states/apislice";
import { FiSearch } from "react-icons/fi";
import { GrClose } from "react-icons/gr";
import { HiPlus, HiMinus, HiOutlineSearch } from "react-icons/hi";
import {BsChevronDown} from "react-icons/bs";
import {ImSpinner2} from "react-icons/im";
import { useNavigate, useParams } from "react-router-dom";
import FetchingPage from "../../FetchingPage";

const LithiumEditForm = () => {
  let sup = [""];
  const { entryId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error, isSuccess } =
      useGetOneLithiumEntryQuery({ entryId }, {
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true
      });
  const [
    updateLithiumEntry,
    {
      isLoading: isSending,
      isError: isFail,
      error: failError,
      isSuccess: isDone,
    },
  ] = useUpdateLithiumEntryMutation();

  const { data:supps, isLoading:isGetting, isError:isFault, error:fault, isSuccess:isGot } =
  useGetAllSuppliersQuery();

    if (isGot) {
      const { data: dt } = supps;
      const { suppliers: sups } = dt;
      sup = sups;
      console.log(sup);
    };


  const [formval, setFormval] = useState({
    weightIn: "",
    weightOut: "",
    supplierName: "",
    licenseNumber: "",
    TINNumber: "",
    email: "",
    supplierId: "",
    companyRepresentative: "",
    representativeId: "",
    representativePhoneNumber: "",
    supplyDate: "",
    time: "",
    beneficiary: "",
    phoneNumber: "",
  });


  const [checked, setchecked] = useState(false);
  const [openlist, setOpenlist] = useState(false);
  const [search, setSearch] = useState("");
  const [model, setModel] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(-1);
  const [beneficial, setBeneficial] = useState("");
  const [admin, setAdmin] = useState({ role: "admin" });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedSupplierName, setSelectedSupplierName] = useState(null);
  const [searchText, setSearchText] = useState("");

  let modalRef = useRef();

  const handleClickOutside = (event) => {
    if (!modalRef.current || !modalRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    if (isSuccess) {
      const { data: dt } = data;
      const { entry: entr } = dt;
      // sup = sups;
      console.log(entr);
      setFormval({
        ...formval,
        weightIn: entr.weightIn,
        weightOut: entr.weightOut,
        supplierName: entr.supplierName,
        licenseNumber: entr.licenseNumber,
        TINNumber: entr.TINNumber,
        email: entr.email,
        supplierId: entr.supplierId,
        companyRepresentative: entr.companyRepresentative,
        representativeId: entr.representativeId,
        representativePhoneNumber: entr.representativePhoneNumber,
        supplyDate: dayjs(entr.supplyDate),
        time: dayjs(entr.time, "HH:mm"),
        numberOfTags: entr.numberOfTags,
        mineralType: entr.mineralType,
        beneficiary: entr.beneficiary,
        phoneNumber: entr.phoneNumber,
      });
    }
  }, [isSuccess]);

  const filteredSuppliers = sup.filter((supplier) => {
    const supplierName = supplier.supplierName || "";
    return supplierName.toLowerCase().includes(searchText.toLowerCase());
  });

  const handleSearchInputChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSupplierSelect = (supplier) => {
    setSelectedSupplierName(supplier.supplierName);
    const chosenSupplier = sup.find((sup) => sup._id === supplier._id);
    if (chosenSupplier) {
      setFormval({
        ...formval,
        supplierName: chosenSupplier.supplierName,
        licenseNumber: chosenSupplier.licenseNumber,
        TINNumber: chosenSupplier.TINNumber,
        email: chosenSupplier.email,
        supplierId: chosenSupplier._id,
      });
      setBeneficial(chosenSupplier.supplierName);
    }
    setchecked(false);
    setFormval((prev) => ({ ...prev, supplierId: supplier._id }));
    console.log(supplier._id);
    setDropdownOpen(false);
    setSearchText("");
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    const clickedBook = sup.find((sup) => sup._id === e.target.value);
    if (clickedBook) {
      setFormval({
        ...formval,
        supplierName: clickedBook.supplierName,
        licenseNumber: clickedBook.licenseNumber,
        TINNumber: clickedBook.TINNumber,
        email: clickedBook.email,
        supplierId: clickedBook._id,
      });
      setBeneficial(clickedBook.supplierName);
    }
    setchecked(false);
  };
  const handleSearchCancel = () => {
    setSearch("");
    setSearchData([]);
    setSelectedItem(-1);
  };
//   const handleSelectedSearch = (e) => {
//     setSearch(e);
//     setBeneficial(e);
//     setOpenlist(false);
//   };
//   const handleKeydown = (e) => {
//     if (selectedItem < searchData.length) {
//       if (e.key === "ArrowUp" && selectedItem > 0) {
//         setSelectedItem((prev) => prev - 1);
//       } else if (
//         e.key === "ArrowDown" &&
//         selectedItem < searchData.length - 1
//       ) {
//         setSelectedItem((prev) => prev + 1);
//       } else if (e.key === "Enter" && selectedItem >= 0) {
//         setBeneficial(searchData[selectedItem].companyName);
//         console.log(searchData[selectedItem].companyName);
//         setSearch(searchData[selectedItem].companyName);
//         setSelectedItem(-1);
//         setSearchData([]);
//         setOpenlist(false);
//       }
//     } else {
//       selectedItem(-1);
//     }
//     if (e.key === "Enter") {
//       setSearchData([]);
//     }
//   };

  const handleEntry = (e) => {
    setFormval((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    console.log([e.target.name] + " " + e.target.value);
    if (e.target.name === "mineralType") {
      setModel(e.target.value);
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

  const handleCheck = () => {
    setchecked((prev) => !prev);
    console.log(checked);
    if (Boolean(checked) === false) {
      setFormval({
        ...formval,
        beneficiary: beneficial,
        isSupplierBeneficiary: true,
      });
    } else if (Boolean(checked) === true) {
      setFormval({ ...formval, beneficiary: "", isSupplierBeneficiary: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      ...formval,
      // output: lotDetails,
      // mineTags: mineTags,
      // negociantTags: negociantTags,
    };
    console.log(body);
    await updateLithiumEntry({ entryId, body });
    // console.log(body);
    setFormval({
      weightIn: "",
      weightOut: "",
      supplierName: "",
      licenseNumber: "",
      TINNumber: "",
      email: "",
      supplierId: "",
      companyRepresentative: "",
      representativeId: "",
      representativePhoneNumber: "",
      supplyDate: "",
      time: "",
      beneficiary: "",
      phoneNumber: "",
    });
    navigate(-1);
  };
  const handleCancel = () => {
    setFormval({
      weightIn: "",
      weightOut: "",
      supplierName: "",
      licenseNumber: "",
      TINNumber: "",
      email: "",
      supplierId: "",
      companyRepresentative: "",
      representativeId: "",
      representativePhoneNumber: "",
      supplyDate: "",
      time: "",
      beneficiary: "",
      isSupplierBeneficiary: false,
    });
    navigate(-1);
  };

  return (
      <>
        {isLoading ? (
            <FetchingPage />
        ) : (
            <ActionsPagesContainer
                title={"Edit lithium entry"}
                subTitle={"Edit/Update lithium entry"}
                actionsContainer={
                  <AddComponent
                      component={
                        <div className="grid grid-cols-1 gap-y-10 pb-10">
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
                                                   <p className="pl-1">Supplier</p>
                                                   <input type="text" autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="supplierName" id="supplierName" value={formval.supplierName || ''} onChange={handleEntry} />
                                               </li>

                                               <li className=" space-y-1">
                                                   <p className="pl-1">Phone number</p>
                                                   <input type="text" autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="phoneNumber" id="phoneNumber" value={formval.phoneNumber || ''} onChange={handleEntry} />
                                               </li>
                            <li className=" space-y-1">
                              <p className="pl-1">Minerals Types</p>
                              <input
                                  autoComplete="off"
                                  disabled
                                  name="mineralType"
                                  id="mineralType"
                                  className="focus:outline-none p-2 border rounded-md w-full"
                                  value={formval.mineralType || ""}
                                  onChange={handleEntry}
                              />
                            </li>
                            <li className=" space-y-1">
                              <p className="pl-1">Date</p>
                              <DatePicker
                                  value={
                                    formval.supplyDate ? dayjs(formval.supplyDate) : null
                                  }
                                  onChange={handleAddDate}
                                  id="supplyDate"
                                  name="supplyDate"
                                  className=" focus:outline-none p-2 border rounded-md w-full"
                              />
                            </li>
                            <li className=" space-y-1">
                              <p className="pl-1">Time</p>
                              <TimePicker
                                  value={
                                    formval.time ? dayjs(formval.time, "HH:mm") : null
                                  }
                                  onChange={handleAddTime}
                                  format={"HH:mm"}
                                  id="date"
                                  name="date"
                                  className=" focus:outline-none p-2 border rounded-md w-full"
                              />
                            </li>

                            <li className=" space-y-1">
                              <p className="pl-1">Weight in</p>
                              <input
                                  type="text"
                                  autoComplete="off"
                                  className="focus:outline-none p-2 border rounded-md w-full"
                                  name="weightIn"
                                  id="weightIn"
                                  value={formval.weightIn || ""}
                                  onChange={handleEntry}
                              />
                            </li>
                            <li className=" space-y-1">
                              <p className="pl-1">Weight out</p>
                              <input
                                  type="text"
                                  autoComplete="off"
                                  className="focus:outline-none p-2 border rounded-md w-full"
                                  name="weightOut"
                                  id="weightOut"
                                  value={formval.weightOut || ""}
                                  onChange={handleEntry}
                              />
                            </li>


                            {/* <li className=" space-y-3 grid gap-4 items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 col-span-full ">
                                <span className=" bg-slate-800 p-[0.5px] relative col-span-full mb-3">
                                    <p className="pl-1 bg-white absolute -top-4 left-2 font-semibold">Mine Tags (tickets)</p>
                                </span>
                                <div className="col-span-full space-y-3">
                                    {mineTags.map((tag, index) => (
                                        <div key={index} className="flex gap-2 items-center w-full">
                                            <p className=" font-semibold">{(index+1)}</p>
                                            <span className="space-y-1">
                                            <p className="pl-1 font-medium">Tag Weight</p>
                                            <input animate={{}} type="number" autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full sm:max-w-[150px]" name="weightInPerMineTag" value={tag.weightInPerMineTag || ''} onWheelCapture={e => { e.target.blur() }} onChange={e => handleMinesTagEntry(index, e)} />
                                            </span>
                                            <span className="space-y-1">
                                            <p className="pl-1 font-medium">Tag nbr</p>
                                            <input animate={{}} type="number" autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full sm:max-w-[150px]" name="tagNumber" value={tag.tagNumber || ''} onWheelCapture={e => { e.target.blur() }} onChange={e => handleMinesTagEntry(index, e)} />
                                             </span>
                                            <HiMinus onClick={() => handleLRemoveMinesTag(index)} className={`${mineTags.length - 1 == 0 ? 'hidden' : ''}`} />
                                            <HiPlus onClick={handleAddMinesTag} className={`${mineTags.length - 1 !== index ? 'hidden' : ''}`} />
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
                  />
                }
            />
        )}
      </>
  );
};
export default LithiumEditForm;
