import React, { Fragment, useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { DatePicker, TimePicker, Spin, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import ActionsPagesContainer from "../../components/Actions components/ActionsComponentcontainer";
import AddComponent from "../../components/Actions components/AddComponent";
import {
  useUpdateShipmentMutation,
  useGetAllBuyersQuery,
  useGetOneShipmentQuery,
} from "@/states/apislice.js";
import { FiSearch } from "react-icons/fi";
import { GrClose } from "react-icons/gr";
import { GrDocumentUpload } from "react-icons/gr";
import { AiOutlineFile } from "react-icons/ai";
import {HiPlus, HiMinus, HiOutlineSearch} from "react-icons/hi";
import {BsChevronDown} from "react-icons/bs";
import {ImSpinner2} from "react-icons/im";
import { useNavigate, useParams } from "react-router-dom";
import FetchingPage from "../FetchingPage";

const ShipmentCompletionPage = () => {
  const { shipmentId } = useParams();
  let sup = [""];
  const navigate = useNavigate();
  const [updateShipment, { isloading: isUpdating, isError, error }] =
    useUpdateShipmentMutation();
  const {
    data,
    isloading: isGetting,
    isError: isproblem,
    error: problem,
    isSuccess,
  } = useGetAllBuyersQuery("", {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true
  });
  const {
    data: info,
    isloading: isFetching,
    isError: isFail,
    error: fail,
    isSuccess: isDone,
  } = useGetOneShipmentQuery(shipmentId, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true
  });

  const fileInputRefs = {
    analysisCertificate: useRef(null),
    containerForwardNote: useRef(null),
    certificateOfOrigin: useRef(null),
    rmbIcglrCertificate: useRef(null),
  };
  const [shipmentDetails, setShipmentDetails] = useState({
    shipmentGrade: "",
    shipmentPrice: "",
    shipmentMinerals: "",
    buyerId: "",
    shipmentSamplingDate: "",
    shipmentContainerLoadingDate: "",
    netWeight: "",
    averageGrade: "",
    averagePrice: "",
    shipmentNumber: "",
    dustWeight: null,
    sampleWeight: null,
    iTSCiShipmentNumber: "",
    shipmentDate: "",
    mineralType: "coltan",
  });
  const [fileData, setFileData] = useState({
    analysisCertificate: null,
    containerForwardNote: null,
    certificateOfOrigin: null,
    rmbIcglrCertificate: null,
  });
  const [fileNames, setFileNames] = useState({
    analysisCertificate: "",
    containerForwardNote: "",
    certificateOfOrigin: "",
    rmbIcglrCertificate: "",
  });
  const [buyerz, setBuyerz] = useState([]);

  const [checked, setchecked] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedBuyerName, setSelectedBuyerName] = useState("");
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
    if (isDone) {
      const { data: dt } = info;
      const { shipment: ships } = dt;
      setShipmentDetails({
        shipmentGrade: ships.shipmentGrade,
        shipmentPrice: ships.shipmentPrice,
        shipmentMinerals: ships.model,
        buyerId: ships.buyerId,
        shipmentSamplingDate: ships.shipmentSamplingDate,
        shipmentContainerLoadingDate: ships.shipmentContainerLoadingDate,
        netWeight: ships.netWeight,
        averageGrade: ships.averageGrade,
        averagePrice: ships.averagePrice,
        shipmentNumber: ships.shipmentNumber,
        dustWeight: ships.dustWeight,
        sampleWeight: ships.sampleWeight,
        iTSCiShipmentNumber: ships.iTSCiShipmentNumber,
        shipmentDate: ships.shipmentDate,
        mineralType: "coltan",
      });
      // setFileData({analysisCertificate: ships.analysisCertificate,containerForwardNote: ships.containerForwardNote,certificateOfOrigin: ships.certificateOfOrigin,rmbIcglrCertificate: ships.certificateOfOrigin,});
    }
  }, [isDone]);
  useEffect(() => {
    if (isSuccess) {
      const { data: dt } = data;
      const { buyers: buyrz } = dt;
      setBuyerz(buyrz);
    }
  }, [isSuccess]);

  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  // const handleUpload = () => {
  //   const formData = new FormData();
  //   fileList.forEach((file) => {
  //     formData.append("files[]", file);
  //   });
  //   setShipmentDetails((prevState) => ({
  //     ...prevState,
  //     analysisCertificate: formData,
  //   }));
  // };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFileData((prevData) => ({
      ...prevData,
      [name]: files[0],
    }));

    setFileNames((prevFileNames) => ({
      ...prevFileNames,
      [name]: files[0] ? files[0].name : "",
    }));
  };

  const handleCustomUpload = (key) => {
    fileInputRefs[key].current.click();
  };

  const handleEntry = (e) => {
    setShipmentDetails((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    if (e.target.name === "mineralType") {
      setModel(e.target.value);
    }
    if (e.target.type === "file") {
      setShipmentDetails((prevData) => ({
        ...prevData,
        [e.target.name]: e.target.files[0],
      }));
    }
  };


  const filteredBuyers = buyerz.filter((buyer) => {
    const companyName = buyer.companyName || "";
    return companyName.toLowerCase().includes(searchText.toLowerCase());
  });

  const handleSearchInputChange = (e) => {
    setSearchText(e.target.value);
  };
// IYI
  const handleBuyerSelect = (buyer) => {
    setSelectedBuyerName(buyer.name);
    const chosenBuyer = sup.find((sup) => sup._id === buyer._id);
    if (chosenBuyer) {
      setShipmentDetails({
        ...shipmentDetails,
        buyerId: chosenBuyer._id,
      });
      // setBeneficial(chosenBuyer.buyerName);
    }
    // setchecked(false);
    setShipmentDetails((prev) => ({ ...prev, buyerId: buyer._id }));
    setDropdownOpen(false);
    setSearchText("");
  };
  const handleAddSamplingDate = (e) => {
    setShipmentDetails((prevState) => ({
      ...prevState,
      shipmentSamplingDate: e,
    }));
  };

  const handleShipmentDate = (e) => {
    setShipmentDetails((prevState) => ({
      ...prevState,
      shipmentDate: e,
    }));
  };

  const handleAddLoadingDate = (e) => {
    setShipmentDetails((prevState) => ({
      ...prevState,
      shipmentContainerLoadingDate: e,
    }));
  };

  const handleAddTime = (e) => {
    setShipmentDetails((prevState) => ({
      ...prevState,
      time: dayjs(e).format("HH:mm"),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("analysisCertificate", fileData.analysisCertificate);
    formData.append("containerForwardNote", fileData.containerForwardNote);
    formData.append("certificateOfOrigin", fileData.certificateOfOrigin);
    formData.append("rmbIcglrCertificate", fileData.rmbIcglrCertificate);
    for (const pair of formData) {
    }
    for (const key in shipmentDetails) {
      if (shipmentDetails.hasOwnProperty(key)) {
        const value = shipmentDetails[key];
        formData.append(key, value);
      }
    }
    const body = formData;
    await updateShipment({ body, shipmentId });
    const formDataObject = {};
    for (const [key, value] of formData.entries()) {
      formDataObject[key] = value;
    }
    navigate(-1);
  };
  const handleCancel = () => {
    setShipmentDetails({
      shipmentGrade: "",
      shipmentPrice: "",
      shipmentMinerals: "",
      buyerId: "",
      shipmentSamplingDate: "",
      shipmentContainerLoadingDate: "",
      netWeight: "",
      averageGrade: "",
      averagePrice: "",
      shipmentNumber: "",
      mineralType: "coltan",
      iTSCiShipmentNumber: null,
      shipmentDate: "",
      dustWeight: null,
      sampleWeight: null,
      analysisCertificate: null,
      containerForwardNote: null,
      certificateOfOrigin: null,
      rmbIcglrCertificate: null,
    });
  };

  return (
    <>
      {isFetching ? (
        <FetchingPage />
      ) : (
        <ActionsPagesContainer
          title={"Shipment complete"}
          subTitle={"Copmlete shipment"}
          actionsContainer={
            <AddComponent
              component={
                <div className="grid grid-cols-1 gap-1">
                  <ul className="list-none grid gap-4 items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  <li className=" space-y-2 flex items-end gap-3 col-span-full ">

                      <div ref={modalRef} className="w-fit h-fit relative ">
                        <div
                          className="border p-2 w-[240px] rounded-md flex items-center justify-between gap-6 bg-white"
                          onClick={() => {
                            setDropdownOpen((prev) => !prev);
                          }}
                        >
                          <p className=" ">
                            {selectedBuyerName
                              ? selectedBuyerName
                              : "select a buyer"}
                          </p>
                          <BsChevronDown
                            className={`text-md transition ease-in-out duration-500 ${
                              dropdownOpen ? "rotate-180" : null
                            }`}
                          />
                        </div>
                        <motion.div
                          animate={
                            dropdownOpen
                              ? { opacity: 1, x: -8, y: 1, display: "block" }
                              : { opacity: 0, x: 0, y: 0, display: "none" }
                          }
                          transition={{
                            type: "spring",
                            duration: 0.8,
                            bounce: 0.35,
                          }}
                          className={`p-2 space-y-3 bg-white w-fit rounded absolute top-12 shadow-2xl z-50`}
                        >
                          <div className="w-full flex items-center gap-2 px-2 py-1 rounded border">
                            <HiOutlineSearch className={`text-lg `} />
                            <input
                              type="text"
                              name="searchTextInput"
                              id="searchTextInput"
                              placeholder="Search"
                              className="w-full focus:outline-none"
                              value={searchText}
                              onChange={handleSearchInputChange}
                            />
                          </div>
                          {isGetting?<div className="w-full flex justify-start items-center gap-1">
                          <ImSpinner2 className="h-[20px] w-[20px] animate-spin text-gray-500" />
                          <p className=" text-slate-400">Fetching buyers...</p>
                          </div>:<ul className={`list-none  overflow-auto `}>
                            {filteredBuyers.map((buyer, index) => (
                              <li
                                key={index}
                                className=" hover:bg-slate-300 rounded-md p-2"
                                onClick={() => handleBuyerSelect(buyer)}
                              >
                                {buyer.name}
                              </li>
                            ))}
                          </ul>}
                        </motion.div>
                      </div>
                    {/* </div> */}
                    <button
                      className="bg-orange-300 text-gray-800 px-3 py-2 rounded-md"
                      onClick={() => navigate("/add/buyer")}
                    >
                      New buyer
                    </button>
                  </li>

                    <li className=" space-y-1">
                      <p className="pl-1">Shipment grade</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-md w-full"
                        name="shipmentGrade"
                        id="shipmentGrade"
                        value={shipmentDetails.shipmentGrade || ""}
                        onChange={handleEntry}
                      />
                    </li>
                    <li className=" space-y-1">
                      <p className="pl-1">Shipment price</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-md w-full"
                        name="shipmentPrice"
                        id="shipmentPrice"
                        value={shipmentDetails.shipmentPrice || ""}
                        onChange={handleEntry}
                      />
                    </li>
                    <li className=" space-y-1">
                      <p className="pl-1">Shipment minerals</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-md w-full"
                        name="shipmentMinerals"
                        id="shipmentMinerals"
                        value={shipmentDetails.shipmentMinerals || ""}
                        onChange={handleEntry}
                      />
                    </li>
                    <li className=" space-y-1">
                      <p className="pl-1">Buyer name</p>
                      <select
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-md w-full"
                        name="buyerId"
                        id="buyerId"
                        value={shipmentDetails.buyerId || ""}
                        onChange={handleEntry}
                      >
                        <option value="defaultBuyer" hidden>
                          Select a buyer
                        </option>
                        {buyerz.map(({ _id, name }) => (
                          <option key={_id} value={_id}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </li>
                    <li className=" space-y-1">
                      <p className="pl-1">Net Weight</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-md w-full"
                        name="netWeight"
                        id="netWeight"
                        value={shipmentDetails.netWeight || ""}
                        onChange={handleEntry}
                      />
                    </li>

                    {/* commenteeeee */}
                  <li className=" space-y-1">
                    <p className="pl-1">Sample Weight</p>
                    <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-md w-full"
                        name="sampleWeight"
                        id="sampleWeight"
                        value={shipmentDetails.sampleWeight || ""}
                        onChange={handleEntry}
                    />
                  </li>
                  <li className=" space-y-1">
                  <p className="pl-1">Dust Weight</p>
                  <input
                      type="text"
                      autoComplete="off"
                      className="focus:outline-none p-2 border rounded-md w-full"
                      name="dustWeight"
                      id="dustWeight"
                      value={shipmentDetails.dustWeight || ""}
                      onChange={handleEntry}
                  />
                </li>
                <li className=" space-y-1">
                  <p className="pl-1">Shipment Date</p>
                  <DatePicker
                      placeholder=""
                      value={
                        shipmentDetails.shipmentDate
                            ? dayjs(shipmentDetails.shipmentDate)
                            : ""
                      }
                      onChange={handleShipmentDate}
                      id="shipmentDate"
                      name="shipmentDate"
                      className=" focus:outline-none p-2 border rounded-md w-full border-[#e8eaed]"
                  />
                </li>

                    {/* commenteeeee */}

                    <li className=" space-y-1">
                      <p className="pl-1">Average grade</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-md w-full"
                        name="averageGrade"
                        id="averageGrade"
                        value={shipmentDetails.averageGrade || ""}
                        onChange={handleEntry}
                      />
                    </li>

                    <li className=" space-y-1">
                      <p className="pl-1">Average price</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-md w-full"
                        name="averagePrice"
                        id="averagePrice"
                        value={shipmentDetails.averagePrice || ""}
                        onChange={handleEntry}
                      />
                    </li>
                    <li className=" space-y-1">
                      <p className="pl-1">Shipment number</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-md w-full"
                        name="shipmentNumber"
                        id="shipmentNumber"
                        value={shipmentDetails.shipmentNumber || ""}
                        onChange={handleEntry}
                      />
                    </li>

                    <li className=" space-y-1">
                      <p className="pl-1">iTSCi Shipment Number</p>
                      <input
                          type="text"
                          autoComplete="off"
                          className="focus:outline-none p-2 border rounded-md w-full"
                          name="iTSCiShipmentNumber"
                          id="iTSCiShipmentNumber"
                          value={shipmentDetails.iTSCiShipmentNumber || ""}
                          onChange={handleEntry}
                      />
                    </li>

                    <li className=" space-y-1">
                      <p className="pl-1">Sampling date</p>
                      <DatePicker
                          placeholder=""
                          value={
                            shipmentDetails.shipmentSamplingDate
                                ? dayjs(shipmentDetails.shipmentSamplingDate)
                                : ""
                          }
                          onChange={handleAddSamplingDate}
                          id="shipmentSamplingDate"
                          name="shipmentSamplingDate"
                          className=" focus:outline-none p-2 border rounded-md w-full border-[#e8eaed]"
                      />
                    </li>
                    <li className=" space-y-1">
                      <p className="pl-1">Container loading date</p>
                      <DatePicker
                          placeholder=""
                          value={
                            shipmentDetails.shipmentContainerLoadingDate
                                ? dayjs(
                                shipmentDetails.shipmentContainerLoadingDate
                                )
                                : ""
                          }
                          onChange={handleAddLoadingDate}
                          id="shipmentContainerLoadingDate"
                          name="shipmentContainerLoadingDate"
                          className=" focus:outline-none p-2 border rounded-md w-full border-[#e8eaed]"
                      />
                    </li>

                    <li className="col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                      <p className="col-span-full text-lg font-semibold">
                        Attached documents
                      </p>
                      <span className="space-y-4">
                        <p className="pl-1">Analysis certificate</p>
                        {/* <Upload style={{width:"100%"}} {...props} >
                        <button className=" focus:outline-none p-2 flex items-center border rounded-md w-full"  onClick={handleUpload}>
                       <UploadOutlined />
                          Select File
                        </button>
                      </Upload> */}
                        <input
                          className="focus:outline-none p-2 border rounded-md w-full"
                          style={{ display: "none" }}
                          autoComplete="off"
                          type="file"
                          name="analysisCertificate"
                          onChange={handleFileChange}
                          ref={fileInputRefs.analysisCertificate}
                        />
                        <button
                          type="button"
                          className=" w-full p-2 rounded-md bg-gradient-to-r from-gray-100 via-blue-100 to-blue-300 shadow-md"
                          onClick={() =>
                            handleCustomUpload("analysisCertificate")
                          }
                        >
                          Upload Analysis certificate
                        </button>
                       {fileNames.analysisCertificate? <p className="border p-2 rounded-md">
                          {fileNames.analysisCertificate}
                        </p>:null}
                      </span>
                      <span className="space-y-4">
                        <p className="pl-1">Container forward note</p>
                        <input
                          className="focus:outline-none p-2 border rounded-md w-full"
                          style={{ display: "none" }}
                          autoComplete="off"
                          id="containerForwardNote"
                          type="file"
                          name="containerForwardNote"
                          onChange={handleFileChange}
                          ref={fileInputRefs.containerForwardNote}
                        />
                        <button
                          type="button"
                          className=" w-full p-2 rounded-md bg-gradient-to-r from-gray-100 via-blue-100 to-blue-300 shadow-md"
                          onClick={() =>
                            handleCustomUpload("containerForwardNote")
                          }
                        >
                          Upload Container forward note
                        </button>
                      { fileNames.containerForwardNote? <p className="border p-2 rounded-md">
                          {fileNames.containerForwardNote}
                        </p>:null}
                      </span>
                      <span className="space-y-4">
                        <p className="pl-1">Certificate of origin</p>
                        <input
                          className="focus:outline-none p-2 border rounded-md w-full"
                          style={{ display: "none" }}
                          autoComplete="off"
                          type="file"
                          name="certificateOfOrigin"
                          onChange={handleFileChange}
                          ref={fileInputRefs.certificateOfOrigin}
                        />
                        <button
                          type="button"
                          className=" w-full p-2 rounded-md bg-gradient-to-r from-gray-100 via-blue-100 to-blue-300 shadow-md"
                          onClick={() =>
                            handleCustomUpload("certificateOfOrigin")
                          }
                        >
                          Upload Certificate of origin
                        </button>
                       {fileNames.certificateOfOrigin ? <p className="border p-2 rounded-md">
                          {fileNames.certificateOfOrigin}
                        </p>:null}
                      </span>
                      <span className="space-y-4">
                        <p className="pl-1">RMBIcglr certificate</p>
                        <input
                          className="focus:outline-none p-2 border rounded-md w-full"
                          style={{ display: "none" }}
                          autoComplete="off"
                          type="file"
                          name="rmbIcglrCertificate"
                          onChange={handleFileChange}
                          ref={fileInputRefs.rmbIcglrCertificate}
                        />
                        <button
                          type="button"
                          className=" w-full p-2 rounded-md bg-gradient-to-r from-gray-100 via-blue-100 to-blue-300 shadow-md"
                          onClick={() =>
                            handleCustomUpload("rmbIcglrCertificate")
                          }
                        >
                          Upload RMBIcglr certificate
                        </button>
                       {fileNames.rmbIcglrCertificate? <p className="border p-2 rounded-md">
                          {fileNames.rmbIcglrCertificate}
                        </p>:null}
                      </span>

                      {/* <div className=" border grid justify-center grid-cols-1 text-center items-center gap-3 p-3 rounded-md space-y-4">
                      <p>Select a document from your computer</p>
                      <span className=" flex items-center w-fit gap-2 px-3 py-1 rounded-md bg-gradient-to-r from-slate-400 to-slate-200">
                      <GrDocumentUpload/>
                      <p>choose file</p>
                      </span>
                      <span className=" border px-2 rounded-md flex items-center gap-3  ">
                        <AiOutlineFile/>
                        <p>Cerifcate of analysis</p>
                      </span>

                    </div> */}
                    </li>
                  </ul>
                </div>
              }
              Add={handleSubmit}
              Cancel={handleCancel}
              isloading={isUpdating}
            />
          }
        />
      )}
    </>
  );
};
export default ShipmentCompletionPage;


// import React, { useState, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { format } from 'date-fns';
// import { Check, ChevronsUpDown, CalendarIcon, Loader2 } from 'lucide-react';
// import { cn } from '@/lib/utils';
//
// import { Button } from '@/components/ui/button';
// import { Calendar } from '@/components/ui/calendar';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Separator } from '@/components/ui/separator';
//
// export default function ShipmentForm({ shipmentData, buyers, isEditing = false }) {
//   const [stage, setStage] = useState(1);
//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', content: '' });
//   const [openBuyerCombobox, setOpenBuyerCombobox] = useState(false);
//
//   // Mock data for buyers if not provided
//   const mockBuyers = [
//     { _id: '1', name: 'Buyer A' },
//     { _id: '2', name: 'Buyer B' },
//     { _id: '3', name: 'Buyer C' },
//   ];
//
//   const buyersList = buyers || mockBuyers;
//
//   const defaultValues = {
//     shipmentNumber: '',
//     iTSCiShipmentNumber: '',
//     shipmentDate: null,
//     buyerId: '',
//     buyerName: '',
//     shipmentGrade: '',
//     shipmentPrice: '',
//     shipmentMinerals: '',
//     shipmentSamplingDate: null,
//     shipmentContainerLoadingDate: '',
//     sampleWeight: '',
//     dustWeight: '',
//     analysisCertificate: '',
//     containerForwardNote: { fileId: '', url: '' },
//     certificateOfOrigin: '',
//     rmbIcglrCertificate: { fileId: '', url: '' },
//     tagListFile: { fileId: '', url: '' },
//     negociantTagListFile: { fileId: '', url: '' },
//     packingListFile: { fileId: '', url: '' },
//     ...shipmentData
//   };
//
//   const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({ defaultValues });
//
//   const watchBuyerId = watch('buyerId');
//
//   // Set buyer name when buyerId changes
//   useEffect(() => {
//     if (watchBuyerId) {
//       const selectedBuyer = buyersList.find(buyer => buyer._id === watchBuyerId);
//       if (selectedBuyer) {
//         setValue('buyerName', selectedBuyer.name);
//       }
//     }
//   }, [watchBuyerId, buyersList, setValue]);
//
//   const onSubmit = async (data) => {
//     setIsLoading(true);
//
//     try {
//       // In a real app, you would send data to your API
//       console.log('Submitting form data:', data);
//
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1000));
//
//       setMessage({
//         type: 'success',
//         content: `Shipment successfully ${isEditing ? 'updated' : 'created'}!`
//       });
//
//       // If in stage 1 and not editing, move to stage 2
//       if (stage === 1 && !isEditing) {
//         setStage(2);
//       }
//     } catch (error) {
//       setMessage({
//         type: 'error',
//         content: `Failed to ${isEditing ? 'update' : 'create'} shipment. Please try again.`
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };
//
//   return (
//       <div className="container mx-auto py-6">
//         <Card className="w-full max-w-4xl mx-auto">
//           <CardHeader>
//             <CardTitle className="text-2xl font-bold">
//               {isEditing ? 'Edit Shipment' : 'Create Shipment'}
//             </CardTitle>
//             <CardDescription>
//               {stage === 1
//                   ? 'Provide basic shipment information'
//                   : 'Complete shipment details for export'
//               }
//             </CardDescription>
//           </CardHeader>
//
//           <Tabs defaultValue={`stage-${stage}`} onValueChange={(value) => setStage(parseInt(value.split('-')[1]))}>
//             <div className="px-6">
//               <TabsList className="grid w-full grid-cols-2">
//                 <TabsTrigger value="stage-1">Basic Information</TabsTrigger>
//                 <TabsTrigger value="stage-2" disabled={!isEditing && stage === 1}>Complete Details</TabsTrigger>
//               </TabsList>
//             </div>
//
//             <form onSubmit={handleSubmit(onSubmit)}>
//               <TabsContent value="stage-1">
//                 <CardContent className="space-y-6 pt-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-2">
//                       <Label htmlFor="shipmentNumber">Shipment Number <span className="text-red-500">*</span></Label>
//                       <Input
//                           id="shipmentNumber"
//                           {...register('shipmentNumber', { required: "Shipment number is required" })}
//                       />
//                       {errors.shipmentNumber && (
//                           <p className="text-sm text-red-500">{errors.shipmentNumber.message}</p>
//                       )}
//                     </div>
//
//                     <div className="space-y-2">
//                       <Label htmlFor="iTSCiShipmentNumber">ITSCi Shipment Number</Label>
//                       <Input
//                           id="iTSCiShipmentNumber"
//                           {...register('iTSCiShipmentNumber')}
//                       />
//                     </div>
//                   </div>
//
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-2">
//                       <Label htmlFor="shipmentDate">Shipment Date</Label>
//                       <Popover>
//                         <PopoverTrigger asChild>
//                           <Button
//                               variant="outline"
//                               className="w-full justify-start text-left font-normal"
//                           >
//                             <CalendarIcon className="mr-2 h-4 w-4" />
//                             {watch('shipmentDate') ? (
//                                 format(new Date(watch('shipmentDate')), 'PPP')
//                             ) : (
//                                 <span>Select date</span>
//                             )}
//                           </Button>
//                         </PopoverTrigger>
//                         <PopoverContent className="w-auto p-0">
//                           <Calendar
//                               mode="single"
//                               selected={watch('shipmentDate') ? new Date(watch('shipmentDate')) : undefined}
//                               onSelect={(date) => setValue('shipmentDate', date)}
//                               initialFocus
//                           />
//                         </PopoverContent>
//                       </Popover>
//                     </div>
//
//                     <div className="space-y-2">
//                       <Label htmlFor="buyerId">Buyer</Label>
//                       <Popover open={openBuyerCombobox} onOpenChange={setOpenBuyerCombobox}>
//                         <PopoverTrigger asChild>
//                           <Button
//                               variant="outline"
//                               role="combobox"
//                               aria-expanded={openBuyerCombobox}
//                               className="w-full justify-between"
//                           >
//                             {watchBuyerId
//                                 ? buyersList.find(buyer => buyer._id === watchBuyerId)?.name
//                                 : "Select buyer"}
//                             <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                           </Button>
//                         </PopoverTrigger>
//                         <PopoverContent className="w-full p-0">
//                           <Command>
//                             <CommandInput placeholder="Search buyers..." />
//                             <CommandEmpty>No buyer found.</CommandEmpty>
//                             <CommandGroup>
//                               {buyersList.map((buyer) => (
//                                   <CommandItem
//                                       key={buyer._id}
//                                       value={buyer._id}
//                                       onSelect={() => {
//                                         setValue('buyerId', buyer._id);
//                                         setValue('buyerName', buyer.name);
//                                         setOpenBuyerCombobox(false);
//                                       }}
//                                   >
//                                     <Check
//                                         className={cn(
//                                             "mr-2 h-4 w-4",
//                                             watchBuyerId === buyer._id ? "opacity-100" : "opacity-0"
//                                         )}
//                                     />
//                                     {buyer.name}
//                                   </CommandItem>
//                               ))}
//                             </CommandGroup>
//                           </Command>
//                         </PopoverContent>
//                       </Popover>
//                     </div>
//                   </div>
//                 </CardContent>
//
//                 <CardFooter className="flex justify-between">
//                   <Button variant="outline" type="button">Cancel</Button>
//                   <Button type="submit" disabled={isLoading}>
//                     {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                     {isEditing ? 'Update Basic Info' : 'Continue to Details'}
//                   </Button>
//                 </CardFooter>
//               </TabsContent>
//
//               <TabsContent value="stage-2">
//                 <CardContent className="space-y-6 pt-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-2">
//                       <Label htmlFor="shipmentGrade">Shipment Grade</Label>
//                       <Input
//                           id="shipmentGrade"
//                           type="number"
//                           step="0.01"
//                           min="0"
//                           {...register('shipmentGrade')}
//                       />
//                     </div>
//
//                     <div className="space-y-2">
//                       <Label htmlFor="shipmentPrice">Shipment Price</Label>
//                       <Input
//                           id="shipmentPrice"
//                           type="number"
//                           step="0.01"
//                           min="0"
//                           {...register('shipmentPrice')}
//                       />
//                     </div>
//                   </div>
//
//                   <div className="space-y-2">
//                     <Label htmlFor="shipmentMinerals">Shipment Minerals</Label>
//                     <Input id="shipmentMinerals" {...register('shipmentMinerals')} />
//                   </div>
//
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-2">
//                       <Label htmlFor="shipmentSamplingDate">Sampling Date</Label>
//                       <Popover>
//                         <PopoverTrigger asChild>
//                           <Button
//                               variant="outline"
//                               className="w-full justify-start text-left font-normal"
//                           >
//                             <CalendarIcon className="mr-2 h-4 w-4" />
//                             {watch('shipmentSamplingDate') ? (
//                                 format(new Date(watch('shipmentSamplingDate')), 'PPP')
//                             ) : (
//                                 <span>Select date</span>
//                             )}
//                           </Button>
//                         </PopoverTrigger>
//                         <PopoverContent className="w-auto p-0">
//                           <Calendar
//                               mode="single"
//                               selected={watch('shipmentSamplingDate') ? new Date(watch('shipmentSamplingDate')) : undefined}
//                               onSelect={(date) => setValue('shipmentSamplingDate', date)}
//                               initialFocus
//                           />
//                         </PopoverContent>
//                       </Popover>
//                     </div>
//
//                     <div className="space-y-2">
//                       <Label htmlFor="shipmentContainerLoadingDate">Container Loading Date</Label>
//                       <Input id="shipmentContainerLoadingDate" {...register('shipmentContainerLoadingDate')} />
//                     </div>
//                   </div>
//
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-2">
//                       <Label htmlFor="sampleWeight">Sample Weight</Label>
//                       <Input
//                           id="sampleWeight"
//                           type="number"
//                           step="0.01"
//                           min="0"
//                           {...register('sampleWeight')}
//                       />
//                     </div>
//
//                     <div className="space-y-2">
//                       <Label htmlFor="dustWeight">Dust Weight</Label>
//                       <Input
//                           id="dustWeight"
//                           type="number"
//                           step="0.01"
//                           min="0"
//                           {...register('dustWeight')}
//                       />
//                     </div>
//                   </div>
//
//                   <Separator className="my-4" />
//
//                   <h3 className="text-lg font-medium">Documents</h3>
//
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-2">
//                       <Label htmlFor="analysisCertificate">Analysis Certificate</Label>
//                       <Input
//                           id="analysisCertificate"
//                           type="file"
//                           onChange={(e) => setValue('analysisCertificate', e.target.files[0])}
//                       />
//                     </div>
//
//                     <div className="space-y-2">
//                       <Label htmlFor="certificateOfOrigin">Certificate of Origin</Label>
//                       <Input
//                           id="certificateOfOrigin"
//                           type="file"
//                           onChange={(e) => setValue('certificateOfOrigin', e.target.files[0])}
//                       />
//                     </div>
//                   </div>
//
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-2">
//                       <Label htmlFor="containerForwardNote">Container Forward Note</Label>
//                       <Input
//                           id="containerForwardNote"
//                           type="file"
//                           onChange={(e) => {
//                             const file = e.target.files[0];
//                             if (file) {
//                               setValue('containerForwardNote', {
//                                 fileId: `file-${Date.now()}`, // Placeholder ID
//                                 url: URL.createObjectURL(file) // Create temp URL
//                               });
//                             }
//                           }}
//                       />
//                     </div>
//
//                     <div className="space-y-2">
//                       <Label htmlFor="rmbIcglrCertificate">RMB ICGLR Certificate</Label>
//                       <Input
//                           id="rmbIcglrCertificate"
//                           type="file"
//                           onChange={(e) => {
//                             const file = e.target.files[0];
//                             if (file) {
//                               setValue('rmbIcglrCertificate', {
//                                 fileId: `file-${Date.now()}`, // Placeholder ID
//                                 url: URL.createObjectURL(file) // Create temp URL
//                               });
//                             }
//                           }}
//                       />
//                     </div>
//                   </div>
//
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                     <div className="space-y-2">
//                       <Label htmlFor="tagListFile">Tag List File</Label>
//                       <Input
//                           id="tagListFile"
//                           type="file"
//                           onChange={(e) => {
//                             const file = e.target.files[0];
//                             if (file) {
//                               setValue('tagListFile', {
//                                 fileId: `file-${Date.now()}`, // Placeholder ID
//                                 url: URL.createObjectURL(file) // Create temp URL
//                               });
//                             }
//                           }}
//                       />
//                     </div>
//
//                     <div className="space-y-2">
//                       <Label htmlFor="negociantTagListFile">Negociant Tag List File</Label>
//                       <Input
//                           id="negociantTagListFile"
//                           type="file"
//                           onChange={(e) => {
//                             const file = e.target.files[0];
//                             if (file) {
//                               setValue('negociantTagListFile', {
//                                 fileId: `file-${Date.now()}`, // Placeholder ID
//                                 url: URL.createObjectURL(file) // Create temp URL
//                               });
//                             }
//                           }}
//                       />
//                     </div>
//
//                     <div className="space-y-2">
//                       <Label htmlFor="packingListFile">Packing List File</Label>
//                       <Input
//                           id="packingListFile"
//                           type="file"
//                           onChange={(e) => {
//                             const file = e.target.files[0];
//                             if (file) {
//                               setValue('packingListFile', {
//                                 fileId: `file-${Date.now()}`, // Placeholder ID
//                                 url: URL.createObjectURL(file) // Create temp URL
//                               });
//                             }
//                           }}
//                       />
//                     </div>
//                   </div>
//                 </CardContent>
//
//                 <CardFooter className="flex justify-between">
//                   <Button variant="outline" type="button" onClick={() => setStage(1)}>Back</Button>
//                   <Button type="submit" disabled={isLoading}>
//                     {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                     {isEditing ? 'Update Shipment' : 'Create Shipment'}
//                   </Button>
//                 </CardFooter>
//               </TabsContent>
//
//               {message.content && (
//                   <div className="px-6 pb-4">
//                     <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
//                       <AlertDescription>{message.content}</AlertDescription>
//                     </Alert>
//                   </div>
//               )}
//             </form>
//           </Tabs>
//         </Card>
//       </div>
//   );
// }