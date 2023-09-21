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
} from "../../states/apislice";
import { FiSearch } from "react-icons/fi";
import { GrClose } from "react-icons/gr";
import { HiPlus, HiMinus } from "react-icons/hi";
import { GrDocumentUpload } from "react-icons/gr";
import { AiOutlineFile } from "react-icons/ai";
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
  } = useGetAllBuyersQuery();
  const {
    data: info,
    isloading: isFetching,
    isError: isFail,
    error: fail,
    isSuccess: isDone,
  } = useGetOneShipmentQuery(shipmentId);

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
    totalShipmentQuantity: "",
    averageGrade: "",
    averagePrice: "",
    shipmentNumber: "",
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

  useEffect(() => {
    if (isDone) {
      const { data: dt } = info;
      const { shipment: ships } = dt;
      console.log(ships);
      setShipmentDetails({
        shipmentGrade: ships.shipmentGrade,
        shipmentPrice: ships.shipmentPrice,
        shipmentMinerals: ships.model,
        buyerId: ships.buyerId,
        shipmentSamplingDate: ships.shipmentSamplingDate,
        shipmentContainerLoadingDate: ships.shipmentContainerLoadingDate,
        totalShipmentQuantity: ships.totalShipmentQuantity,
        averageGrade: ships.averageGrade,
        averagePrice: ships.averagePrice,
        shipmentNumber: ships.shipmentNumber,
        mineralType: "coltan",
      });

      // setFileData({analysisCertificate: ships.analysisCertificate,containerForwardNote: ships.containerForwardNote,certificateOfOrigin: ships.certificateOfOrigin,rmbIcglrCertificate: ships.certificateOfOrigin,});
    }
  }, [isDone]);
  useEffect(() => {
    if (isSuccess) {
      const { data: dt } = data;
      const { buyers: buyrz } = dt;
      console.log(buyrz);
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

  const handleAddSamplingDate = (e) => {
    setShipmentDetails((prevState) => ({
      ...prevState,
      shipmentSamplingDate: dayjs(e).format("MMM/DD/YYYY"),
    }));
  };
  const handleAddLoadingDate = (e) => {
    setShipmentDetails((prevState) => ({
      ...prevState,
      shipmentContainerLoadingDate: dayjs(e).format("MMM/DD/YYYY"),
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
      console.log(`Key: ${pair[0]}, Value: ${pair[1]}`);
    }
    console.log(formData.entries());
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
    console.log("Form Data:", formDataObject);
    console.log("yeweee", body);
    console.log("_____________________________");
    // navigate(-1);
  };
  const handleCancel = () => {
    setShipmentDetails({
      shipmentGrade: "",
      shipmentPrice: "",
      shipmentMinerals: "",
      buyerId: "",
      shipmentSamplingDate: "",
      shipmentContainerLoadingDate: "",
      totalShipmentQuantity: "",
      averageGrade: "",
      averagePrice: "",
      shipmentNumber: "",
      mineralType: "coltan",
      analysisCertificate: null,
      containerForwardNote: null,
      certificateOfOrigin: null,
      rmbIcglrCertificate: null,
    });
    setlotDetails([{ lotNumber: "", weightOut: "" }]);
    console.log(checked);
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
                      <p className="pl-1">Sampling date</p>
                      <DatePicker
                        placeholder=""
                        value={
                          shipmentDetails.shipmentSamplingDate
                            ? dayjs(shipmentDetails.shipmentSamplingDate)
                            : null
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
                            : null
                        }
                        onChange={handleAddLoadingDate}
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
                          className=" w-full p-2 rounded-md bg-blue-300"
                          onClick={() =>
                            handleCustomUpload("analysisCertificate")
                          }
                        >
                          Upload Analysis certificate
                        </button>
                        <p className="border p-2">
                          {fileNames.analysisCertificate}
                        </p>
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
                          className=" w-full p-2 rounded-md bg-blue-300"
                          onClick={() =>
                            handleCustomUpload("containerForwardNote")
                          }
                        >
                          Upload Container forward note
                        </button>
                        <p className="border p-2">
                          {fileNames.containerForwardNote}
                        </p>
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
                          className=" w-full p-2 rounded-md bg-blue-300"
                          onClick={() =>
                            handleCustomUpload("certificateOfOrigin")
                          }
                        >
                          Upload Certificate of origin
                        </button>
                        <p className="border p-2">
                          {fileNames.certificateOfOrigin}
                        </p>
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
                          className=" w-full p-2 rounded-md bg-blue-300"
                          onClick={() =>
                            handleCustomUpload("rmbIcglrCertificate")
                          }
                        >
                          Upload RMBIcglr certificate
                        </button>
                        <p className="border p-2">
                          {fileNames.rmbIcglrCertificate}
                        </p>
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
