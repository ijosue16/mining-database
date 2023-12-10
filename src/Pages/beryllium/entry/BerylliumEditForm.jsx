import React, { Fragment, useEffect, useState } from "react";
import dayjs from "dayjs";
import moment from "moment";
import { motion } from "framer-motion";
import { DatePicker, TimePicker, Spin } from "antd";
import ActionsPagesContainer from "../../../components/Actions components/ActionsComponentcontainer";
import AddComponent from "../../../components/Actions components/AddComponent";
import {
  useGetOneBerylliumEntryQuery,
  useUpdateBerylliumEntryMutation,
} from "../../../states/apislice";
import { FiSearch } from "react-icons/fi";
import { GrClose } from "react-icons/gr";
import { HiPlus, HiMinus } from "react-icons/hi";
import { useNavigate, useParams } from "react-router-dom";
import FetchingPage from "../../FetchingPage";

const BerylliumEditForm = () => {
  const { entryId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error, isSuccess } =
  useGetOneBerylliumEntryQuery({ entryId }, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true
  });
  const [
    updateBerylliumEntry,
    {
      isLoading: isSending,
      isError: isFail,
      error: failError,
      isSuccess: isDone,
    },
  ] = useUpdateBerylliumEntryMutation();
  const [formval, setFormval] = useState({
    weightIn: "",
    weightOut: "",
    companyName: "",
    licenseNumber: "",
    TINNumber: "",
    email: "",
    supplierId: "",
    companyRepresentative: "",
    representativeId: "",
    representativePhoneNumber: "",
    supplyDate: "",
    time: "",
    numberOfTags: "",
    mineralType: "",
    mineralGrade:"",
    beneficiary: "",
    supplierName: "", 
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

  useEffect(() => {
    if (isSuccess) {
      const { data: dt } = data;
      const { entry: entr } = dt;
      // sup = sups;
      console.log(entr);
      setFormval({
        weightIn: entr.weightIn,
        weightOut: entr.weightOut,
        companyName: entr.companyName,
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
        mineralGrade: entr.mineralGrade,
        beneficiary: entr.beneficiary,
        supplierName: entr.supplierName, 
        phoneNumber: entr.phoneNumber,
      });
    }
  }, [isSuccess]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    const clickedBook = sup.find((sup) => sup._id === e.target.value);
    if (clickedBook) {
      setFormval({
        ...formval,
        companyName: clickedBook.companyName,
        licenseNumber: clickedBook.licenseNumber,
        TINNumber: clickedBook.TINNumber,
        email: clickedBook.email,
        supplierId: clickedBook._id,
      });
      setBeneficial(clickedBook.companyName);
    }
    setchecked(false);
  };
  const handleSearchCancel = () => {
    setSearch("");
    setSearchData([]);
    setSelectedItem(-1);
  };

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
    // await updateBerylliumEntry({ entryId, body });
    // console.log(body);
    setFormval({
      weightIn: "",
      companyName: "",
      licenseNumber: "",
      TINNumber: "",
      email: "",
      supplierId: "",
      companyRepresentative: "",
      representativeId: "",
      representativePhoneNumber: "",
      supplyDate: "",
      time: "",
      mineralType: "",
      beneficiary: "",
      supplierName: "", 
      phoneNumber: "",
      isSupplierBeneficiary: false,
    });
    navigate(-1);
  };
  const handleCancel = () => {
    setFormval({
      weightIn: "",
      weightOut:"",
      companyName: "",
      licenseNumber: "",
      TINNumber: "",
      email: "",
      supplierId: "",
      companyRepresentative: "",
      representativeId: "",
      representativePhoneNumber: "",
      supplyDate: "",
      time: "",
      mineralType: "",
      mineralGrade:"",
      beneficiary: "",
      supplierName: "", 
      phoneNumber: "",
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
          title={"Edit beryllium entry"}
          subTitle={"Edit/Update beryllium entry"}
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
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-md w-full"
                        name="supplierName"
                        id="supplierName"
                        value={formval.supplierName || ""}
                        onChange={handleEntry}
                      />
                    </li>
                  
                    <li className=" space-y-1">
                      <p className="pl-1">Phone number</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-md w-full"
                        name="phoneNumber"
                        id="phoneNumber"
                        value={formval.phoneNumber || ""}
                        onChange={handleEntry}
                      />
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
                    <li className=" space-y-1">
                      <p className="pl-1">Mineral grade</p>
                      <input
                        type="number"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-md w-full"
                        name="mineralGrade"
                        id="mineralGrade"
                        value={formval.mineralGrade || ""}
                        onWheelCapture={(e) => e.target.blur()}
                        onChange={handleEntry}
                      />
                    </li>
                    {/* <li className=" space-y-1">
                      <span className=" flex gap-2 items-center">
                        <p>Beneficiary</p>

                      </span>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-md w-full"
                        name="beneficiary"
                        id="beneficiary"
                        value={formval.beneficiary || ""}
                        onChange={handleEntry}
                      />
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
export default BerylliumEditForm;
