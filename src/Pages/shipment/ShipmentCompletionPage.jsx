import React, { Fragment, useEffect, useState } from "react";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { DatePicker, TimePicker, Spin, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import ActionsPagesContainer from "../../components/Actions components/ActionsComponentcontainer";
import AddComponent from "../../components/Actions components/AddComponent";
import {
  useGetAllSuppliersQuery,
  useCreateColtanEntryMutation,
} from "../../states/apislice";
import { FiSearch } from "react-icons/fi";
import { GrClose } from "react-icons/gr";
import { HiPlus, HiMinus } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const ShipmentCompletionPage = () => {
  let sup = [""];
  const navigate = useNavigate();
  const { data, isLoading, isError, error, isSuccess } =
    useGetAllSuppliersQuery();
  const [
    createColtanEntry,
    {
      isLoading: isSending,
      isError: isFail,
      error: failError,
      isSuccess: isDone,
    },
  ] = useCreateColtanEntryMutation();
  const [shipmentDetails, setShipmentDetails] = useState({
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
    numberOfTags: "",
    mineTags: "",
    negociantTags: "",
    mineralType: "coltan",
    mineralgrade: "",
    mineralprice: "",
    shipmentnumber: "",
    beneficiary: "",
    isSupplierBeneficiary: false,
  });
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
  const [admin, setAdmin] = useState({ role: "admin" });
  const [fileList, setFileList] = useState([]);

  if (isSuccess) {
    const { data: dt } = data;
    const { suppliers: sups } = dt;
    sup = sups;
    console.log(sup);
  }

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

  const handleUpload = () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("files[]", file);
    });
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    const clickedBook = sup.find((sup) => sup._id === e.target.value);
    if (clickedBook) {
        setShipmentDetails({
        ...shipmentDetails,
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
  const handleSelectedSearch = (e) => {
    setSearch(e);
    setBeneficial(e);
    setOpenlist(false);
  };
  const handleKeydown = (e) => {
    if (selectedItem < searchData.length) {
      if (e.key === "ArrowUp" && selectedItem > 0) {
        setSelectedItem((prev) => prev - 1);
      } else if (
        e.key === "ArrowDown" &&
        selectedItem < searchData.length - 1
      ) {
        setSelectedItem((prev) => prev + 1);
      } else if (e.key === "Enter" && selectedItem >= 0) {
        setBeneficial(searchData[selectedItem].companyName);
        console.log(searchData[selectedItem].companyName);
        setSearch(searchData[selectedItem].companyName);
        setSelectedItem(-1);
        setSearchData([]);
        setOpenlist(false);
      }
    } else {
      selectedItem(-1);
    }
    if (e.key === "Enter") {
      setSearchData([]);
    }
  };

  const handleEntry = (e) => {
    setShipmentDetails((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    if (e.target.name === "mineralType") {
      setModel(e.target.value);
    }
  };

  const handleAddDate = (e) => {
    setShipmentDetails((prevState) => ({
      ...prevState,
      supplyDate: dayjs(e).format("MMM/DD/YYYY"),
    }));
  };

  const handleAddTime = (e) => {
    setShipmentDetails((prevState) => ({
      ...prevState,
      time: dayjs(e).format("HH:mm"),
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
    setlotDetails((prevLotDetails) => [
      ...prevLotDetails,
      { lotNumber: "", weightOut: "" },
    ]);
    updateLotNumbers();
  };

  const handleLotEntry = (index, e) => {
    const values = [...lotDetails];
    values[index][e.target.name] = e.target.value;
    values[index].lotNumber = index + 1;
    setlotDetails(values);
  };

  const handleLRemoveLot = (index) => {
    const values = [...lotDetails];
    values.splice(index, 1);
    values.forEach((lot, i) => {
      lot.lotNumber = i + 1;
    });
    setlotDetails(values);
  };

  const handleCheck = () => {
    setchecked((prev) => !prev);
    console.log(checked);
    if (Boolean(checked) === false) {
      setShipmentDetails({
        ...shipmentDetails,
        beneficiary: beneficial,
        isSupplierBeneficiary: true,
      });
    } else if (Boolean(checked) === true) {
      setShipmentDetails({ ...shipmentDetails, beneficiary: "", isSupplierBeneficiary: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = { ...shipmentDetails, output: lotDetails };
    await createColtanEntry({ body });
    console.log(body);
    navigate(-1);
  };
  const handleCancel = () => {
    setShipmentDetails({
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
      numberOfTags: "",
      mineTags: "",
      negociantTags: "",
      mineralType: "coltan",
      mineralgrade: "",
      mineralprice: "",
      shipmentnumber: "",
      beneficiary: "",
      isSupplierBeneficiary: false,
    });
    setlotDetails([{ lotNumber: "", weightOut: "" }]);
    console.log(checked);
  };

  return (
    <>
      <ActionsPagesContainer
        title={"Shipment complete"}
        subTitle={"Copmlete shipment"}
        actionsContainer={
          <AddComponent
            component={
              <div className="grid grid-cols-1 gap-1">
                <ul className="list-none grid gap-4 items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
                    <p className="pl-1">BuyerId</p>
                    <input
                      type="text"
                      autoComplete="off"
                      className="focus:outline-none p-2 border rounded-md w-full"
                      name="buyerId"
                      id="buyerId"
                      value={shipmentDetails.buyerId || ""}
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
                          : null
                      }
                      onChange={handleAddDate}
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
                          ? dayjs(shipmentDetails.shipmentContainerLoadingDate)
                          : null
                      }
                      onChange={handleAddDate}
                      id="shipmentContainerLoadingDate"
                      name="shipmentContainerLoadingDate"
                      className=" focus:outline-none p-2 border rounded-md w-full border-[#e8eaed]"
                    />
                  </li>
                  <li className=" space-y-1">
                    <p className="pl-1">Total quantity</p>
                    <input
                      type="text"
                      autoComplete="off"
                      className="focus:outline-none p-2 border rounded-md w-full"
                      name="totalShipmentQuantity"
                      id="totalShipmentQuantity"
                      value={shipmentDetails.totalShipmentQuantity || ""}
                      onChange={handleEntry}
                    />
                  </li>
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
                    <p className="pl-1">Shipment number</p>
                    <Upload style={{width:"100%"}} {...props} >
                      <button className=" focus:outline-none p-2 flex items-center border rounded-md w-full"  onClick={handleUpload}>
                     <UploadOutlined />
                        Select File
                      </button>
                    </Upload>
                  </li>
                  <li className=" space-y-1">
                    <p className="pl-1">Shipment number</p>
                    <Upload style={{width:"100%"}} {...props} >
                      <button className=" focus:outline-none p-2 flex items-center border rounded-md w-full"  onClick={handleUpload}>
                     <UploadOutlined />
                        Select File
                      </button>
                    </Upload>
                  </li>
                </ul>
              </div>
            }
            Add={handleSubmit}
            Cancel={handleCancel}
            isloading={isSending}
          />
        }
      />
    </>
  );
};
export default ShipmentCompletionPage;
