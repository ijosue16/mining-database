import React, {useEffect, useState,useRef} from "react";
import { useAddContractMutation } from "../states/apislice";
import dayjs from "dayjs";
import { DatePicker } from "antd";
import {useParams} from "react-router-dom";
import {toast} from "react-toastify";
import AddComponent from "../components/Actions components/AddComponent";
import ActionsPagesContainer from "../components/Actions components/ActionsComponentcontainer";

const AddContract = () => {
    // const { buyerId } = useParams();
    const [contractInfo, setContractInfo] = useState(
        {
            name: "",
            buyerName: "",
            minerals: [],
            contractStartDate: "",
            contractExpiryDate: "",
            grade: "",
            contract: ""
        }
    );

    const fileInputRefs = {
      contract: useRef(null),
    };

    const [fileNames, setFileNames] = useState({
      contract: "",
    });
    const [addContract, {isLoading, isSuccess, isError, error}] = useAddContractMutation();

    useEffect(() => {
        if (isSuccess) {
            toast.success("Contract Added Successfully");
        } else if (isError) {
            const { message } = error.data;
            toast.error(message);
        }
    }, [isSuccess, isError, error]);

    const handleStartDate=(date)=>{
      setContractInfo((prevState) => ({
        ...prevState,
        contractStartDate: date,
      }));
    };

    const handleExpiryDate=(date)=>{
      setContractInfo((prevState) => ({
        ...prevState,
        contractExpiryDate: date,
      }));
    };

    const handleCustomUpload = (key) => {
      fileInputRefs[key].current.click();
    };

    const handleChange = (e) => {
        setContractInfo(prevState => ({...prevState, [e.target.name]: e.target.value}));

        setFileNames((prevFileNames) => ({
          ...prevFileNames,
          [e.target.name]: e.target.files[0] ? e.target.files[0].name : "",
        }));
    };
    

    const handleSubmit = async e => {
        e.preventDefault();
        const formData = new FormData();
        for (const key of contractInfo) {
            if (contractInfo.hasOwnProperty(key)) {
                formData.append(key, contractInfo[key]);
            }
        }
        console.log(contractInfo);
        // console.log(formData.entries());
        // await addContract({body: formData});
    }

    const handleCancel = () => {
        setContractInfo(
            {
                name: "",
                buyerName: "",
                minerals: [],
                contractStartDate: "",
                contractExpiryDate: "",
                grade: "",
                contract: ""
            }
        )
    }
 
    return (
        <>
        <ActionsPagesContainer
        title={"Register coltan entry"}
        subTitle={"Add new coltan entry"}
        actionsContainer={
          <AddComponent
            component={
                <div className="grid grid-cols-1 gap-1">

                <ul className="list-none grid gap-4 items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  <li className=" space-y-1">
                    <p className="pl-1">Contract filename</p>
                    <input
                      type="text"
                      autoComplete="off"
                      className="focus:outline-none p-2 border rounded-md w-full"
                      name="name" value={contractInfo.name} onChange={handleChange}
                    />
                  </li>
                  <li className=" space-y-1">
                    <p className="pl-1">Buyer name</p>
                    <input
                      type="text"
                      autoComplete="off"
                      className="focus:outline-none p-2 border rounded-md w-full"
                      name="buyerName" value={contractInfo.buyerName} onChange={handleChange}
                    />
                  </li>
                  <li className=" space-y-1">
                    <p className="pl-1">Minerals</p>
                    <input
                      type="text"
                      autoComplete="off"
                      className="focus:outline-none p-2 border rounded-md w-full"
                      name="minerals" value={contractInfo.minerals} onChange={handleChange}
                    />
                  </li>

                  <li className=" space-y-1">
                    <p className="pl-1">Start Date</p>
                    <DatePicker
                    id="contractStartDate"
                     name="contractStartDate" value={
                      contractInfo.contractStartDate ? dayjs(contractInfo.contractStartDate) : null
                    } onChange={(e) => handleStartDate(e)}
                      className=" focus:outline-none p-2 border rounded-md w-full"
                    />
                  </li>

                  <li className=" space-y-1">
                    <p className="pl-1">Expiry Date</p>
                    <DatePicker
                    id="contractExpiryDate"
                     name="contractExpiryDate" value={contractInfo.contractExpiryDate} onChange={handleExpiryDate}
                      className=" focus:outline-none p-2 border rounded-md w-full"
                    />
                  </li>

                  <li className=" space-y-1">
                    <p className="pl-1">Concentration</p>
                    <input
                      type="text"
                      autoComplete="off"
                      className="focus:outline-none p-2 border rounded-md w-full"
                      name="grade" value={contractInfo.grade} onChange={handleChange}
                    />
                  </li>
                  <li className=" space-y-1">
                    <p className="pl-1">Contract</p>
                    <input
                          className="focus:outline-none p-2 border rounded-md w-full hidden"
                          style={{ display: "none" }}
                          autoComplete="off"
                          type="file"
                          name="contract"
                          onChange={handleChange}
                          ref={fileInputRefs.contract}
                        />
                        <button
                          type="button"
                          className=" w-full p-2 rounded-md bg-gradient-to-r from-gray-100 via-blue-100 to-blue-300 shadow-md"
                          onClick={() =>
                            handleCustomUpload("contract")
                          }
                        >
                          Upload Contract
                        </button>
                        <p className="border p-2">
                          {fileNames.contract}
                        </p>
                  </li>
                  {/* <li className=" space-y-1">
                    <p className="pl-1">Number of Tags</p>
                    <input
                      type="number"
                      autoComplete="off"
                      className="focus:outline-none p-2 border rounded-md w-full"
                      name="numberOfTags"
                      id="numberOfTags"
                      value={formval.numberOfTags || ""}
                      onWheelCapture={(e) => {
                        e.target.blur();
                      }}
                      onChange={handleEntry}
                    />
                  </li>
                  <li className=" space-y-1">
                    <span className=" flex gap-2 items-center">
                      <p>Beneficiary</p>
                      <span
                        className={`border h-4 w-9 rounded-xl p-[0.5px] duration-200 transform ease-in-out flex ${
                          checked
                            ? " justify-end bg-green-400"
                            : " justify-start bg-slate-400"
                        }`}
                        onClick={handleCheck}
                      >
                        <span
                          className={` w-4 h- border bg-white rounded-full `}
                        ></span>
                      </span>
                    </span>
                    <input
                      type="text"
                      autoComplete="off"
                      disabled={checked}
                      className="focus:outline-none p-2 border rounded-md w-full"
                      name="beneficiary"
                      id="beneficiary"
                      value={formval.beneficiary || ""}
                      onChange={handleEntry}
                    />
                  </li>

                  <li className=" space-y-3 grid gap-4 items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 col-span-full ">
                    <span className=" bg-slate-800 p-[0.5px] relative col-span-full mb-3">
                      <p className="pl-1 bg-white absolute -top-4 left-2 font-semibold">
                        Lots
                      </p>
                    </span>
                    <div className="col-span-1 space-y-3">
                      {lotDetails.map((lot, index) => (
                        <div
                          key={index}
                          className="flex gap-2 items-center w-full"
                        >
                          <p className=" font-semibold">{index + 1}</p>
                          <input
                            animate={{}}
                            type="number"
                            autoComplete="off"
                            className="focus:outline-none p-2 border rounded-md w-full"
                            name="weightOut"
                            value={lot.weightOut || ""}
                            onWheelCapture={(e) => {
                              e.target.blur();
                            }}
                            onChange={(e) => handleLotEntry(index, e)}
                          />
                          <HiMinus
                            onClick={() => handleLRemoveLot(index)}
                            className={`${
                              lotDetails.length - 1 == 0 ? "hidden" : ""
                            }`}
                          />
                          <HiPlus
                            onClick={handleAddLot}
                            className={`${
                              lotDetails.length - 1 !== index ? "hidden" : ""
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                  </li>  */}
                </ul>
              </div>
            }
            
            Add={handleSubmit}
            Cancel={handleCancel}
            isloading={isLoading}/>}/>
        </>
        // <div>
        //     <div>
        //         <p>Contract filename</p>
        //         <input type="text" name="name" value={contractInfo.name} onChange={handleChange}/>
        //     </div>
        //     <div>
        //         <p>Buyer Name</p>
        //         <input type="text" name="buyerName" value={contractInfo.buyerName} onChange={handleChange}/>
        //     </div>
        //     <div>
        //         <p>Minerals</p>
        //         <input type="text" name="minerals" value={contractInfo.minerals} onChange={handleChange}/>
        //     </div>
        //     <div>
        //         <p>Start Date</p>
        //         <input type="date" name="contractStartDate" value={contractInfo.contractStartDate} onChange={handleChange}/>
        //     </div>
        //     <div>
        //         <p>Expiry Date</p>
        //         <input type="date" name="contractExpiryDate" value={contractInfo.contractExpiryDate} onChange={handleChange}/>
        //     </div>
        //     <div>
        //         <p>Concentration</p>
        //         <input type="text" name="grade" value={contractInfo.grade} onChange={handleChange}/>
        //     </div>
        //     <input type="file" name="contract"/>
        //     <div>
        //         <button type="button" onClick={handleSubmit}>Submit</button>
        //         <button type="button" onClick={handleCancel}>Cancel</button>
        //     </div>
        // </div>
    )
}


export default AddContract