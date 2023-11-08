import React, { useState } from "react";
import dayjs from "dayjs";
import moment from "moment";
import { motion } from "framer-motion";
import { DatePicker, TimePicker, Spin } from "antd";
import ActionsPagesContainer from "../../components/Actions components/ActionsComponentcontainer";
import AddComponent from "../../components/Actions components/AddComponent";
import FetchingPage from "../FetchingPage";
import { useAddAdvancePaymentMutation } from "../../states/apislice";

const AdvancedPaymentEntry= ()=>{
    const [paymentInfo,setPayementInfo]=useState({supplierId:'64bfeddfbb0da81a7853a114',companyName:'',beneficiary:'',nationalId:'',phoneNumber:'',location:'',email:'',paymentAmount:null,currency:'',paymentDate:'',contractName:''});
    const [AddAdvancedPayment,{isLoading,isSuccess,isError,error}]=useAddAdvancePaymentMutation();

    const handleEntry = (e) => {
        setPayementInfo((prevState) => ({
          ...prevState,
          [e.target.name]: e.target.value,
        }));
      };
      const handleAddPaymentDate = (e) => {
        setPayementInfo((prevState) => ({
          ...prevState,
          paymentDate: e ,
        }));
      };

      const handleSubmit=async (e)=>{
        e.preventDefault();
        const body=paymentInfo;
        await AddAdvancedPayment({body});
        console.log(paymentInfo);

      };

      const handleCancel=()=>{
        setPayementInfo({supplierId:'',companyName:'',beneficiary:'',nationalId:'',phoneNumber:'',location:'',email:'',paymentAmount:null,currency:'',paymentDate:'',contractName:''});
      };

    return(
        <ActionsPagesContainer
        title={"Advanced payment"}
        subTitle={"Add new advanced payment"}
        actionsContainer={
          <AddComponent
            component={
              <div className="grid grid-cols-1 gap-y-10 pb-10">
                                  <ul className="list-none grid gap-4 items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    <li className=" space-y-1">
                      <p className="pl-1">Company name</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-md w-full"
                        name="companyName"
                        id="companyName"
                        value={paymentInfo.companyName || ""}
                      onChange={handleEntry}
                       
                      />
                    </li>

                    <li className=" space-y-1">
                      <p className="pl-1">Beneficiary</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-md w-full"
                        name="beneficiary"
                        id="beneficiary"
                        
                               value={paymentInfo.beneficiary || ""}
                      onChange={handleEntry}
 
                      />
                    </li>
                    <li className=" space-y-1">
                      <p className="pl-1">nationalId</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-md w-full"
                        name="nationalId"
                        id="nationalId"
                        
                               value={paymentInfo.nationalId || ""}
                      onChange={handleEntry}

                      />
                    </li>
                    <li className=" space-y-1">
                      <p className="pl-1">phoneNumber</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-md w-full"
                        name="phoneNumber"
                        id="phoneNumber"
                        
                               value={paymentInfo.phoneNumber || ""}
                      onChange={handleEntry}

                      />
                    </li>
                    <li className=" space-y-1">
                      <p className="pl-1">location</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-md w-full"
                        name="location"
                        id="location"
                        
                               value={paymentInfo.location || ""}
                      onChange={handleEntry}

                      />
                    </li>
                    <li className=" space-y-1">
                      <p className="pl-1">email</p>
                      <input
                        type="email"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-md w-full"
                        name="email"
                        id="email"
                               value={paymentInfo.email || ""}
                      onChange={handleEntry}

                      />
                    </li>

                    <li className=" space-y-1">
                      <p className="pl-1">paymentAmount</p>
                      <input
                        type="number"
                        autoComplete="off"
                        name="paymentAmount"
                        id="paymentAmount"
                        className="focus:outline-none p-2 border rounded-md w-full"
                               value={paymentInfo.paymentAmount || ''}
                      onChange={handleEntry}
                        onWheelCapture={(e) => {
                            e.target.blur();
                          }}

                      />
                    </li>

                    <li className=" space-y-1">
                        <p className="pl-1">Currency</p>
                        <select
                            name="currency"
                            autoComplete="off" 
                            className="focus:outline-none p-2 border rounded-md w-full"
                            defaultValue={paymentInfo.currency || ''|| "defaultcurrency"}
                            onChange={handleEntry}
                          >
                            <option value="defaultcurrency" hidden>
                              {paymentInfo.currency ? `${paymentInfo.currency}` : "select currency"}
                            </option>
                            <option value="USD">USD</option>
                            <option value="RWF">RWF</option>
                        </select>
                    </li>
                    <li className=" space-y-1">
                    <p className="pl-1">paymentDate</p>
                    <DatePicker
                      onChange={handleAddPaymentDate}
                      id="paymentDate"
                      name="paymentDate"
                      className=" focus:outline-none p-2 border rounded-md w-full"
                      value={
                        paymentInfo.paymentDate ? dayjs(paymentInfo.paymentDate) : null
                      }
                   
                    />
                  </li>

                          <li className=" space-y-1">
                      <p className="pl-1">contractName</p>
                      <input
                        autoComplete="off"
                        type="text"
                        name="contractName"
                        id="contractName"
                        className="focus:outline-none p-2 border rounded-md w-full"
                               value={paymentInfo.contractName || ""}
                      onChange={handleEntry}

                      />
                    </li>
                  </ul>
              </div>
              }
              Add={handleSubmit}
              Cancel={handleCancel}
              isloading={isLoading}
              />
            }/>
    )

}
export default AdvancedPaymentEntry;