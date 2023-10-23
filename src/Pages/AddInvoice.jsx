import React, {useEffect, useState} from "react";
import ActionsPagesContainer from "../components/Actions components/ActionsComponentcontainer";
import AddComponent from "../components/Actions components/AddComponent";
import FetchingPage from "./FetchingPage";
import { useGenerateInvoiceMutation, useGetOneSupplierQuery, useGetUnsettledLotsQuery } from "../states/apislice";
import {toast} from "react-toastify";
import { useParams } from "react-router-dom";


const AddInvoice = () => {
    const{supplierId}=useParams();
    const [ generateInvoice, { isSuccess, isLoading, isError, error } ] = useGenerateInvoiceMutation();
    const {data,isLoading:isFetching,isSuccess:isDone,isError:isProblem}=useGetOneSupplierQuery({supplierId});
    const {data:info,isLoading:isGetting,isSuccess:isComplete}=useGetUnsettledLotsQuery({supplierId});
    const [download, setDownload] = useState(false);
    const [invoiceInfo, setInvoiceInfo] = useState(
        {
            invoiceNo: "",
            dateOfIssue: "",
            beneficiary: "",
            supplierCompanyName: "",
            processorCompanyName: "",
            extraNotes: "",
            items: [],
            supplierId: "",
            supplierAddress: {
                province: "",
                district: "",
                sector: ""
            },

        }
    );
    useEffect(() =>{
        if(isDone){
          const {data:dt}=data;
          const {supplier:sup}=dt;
          console.log(sup);
          setInvoiceInfo({ ...invoiceInfo, supplierCompanyName: sup.companyName,processorCompanyName:sup.companyName,supplierAddress: {
            province: sup.address.province,
            district: sup.address.district,
            sector: sup.address.sector
        },})
        }
    },[isDone]);

    useEffect(() =>{
        if(isComplete){
         console.log(info);
        }
    },[isComplete]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes("address.")) {
            const addressField = name.split(".")[1];
            setInvoiceInfo((prevState) => ({
                ...prevState,
                address: {
                    ...prevState.address,
                    [addressField]: value
                }
            }));
        } else {
            setInvoiceInfo((prevState) => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSubmit = async () => {
        console.log(invoiceInfo);
    }

    const handleCancel = () => {
        setInvoiceInfo({
            invoiceNo: "",
            dateOfIssue: "",
            beneficiary: "",
            supplierCompanyName: "",
            processorCompanyName: "",
            extraNotes: "",
            items: [],
            supplierId: "",
            supplierAddress: {
                province: "",
                district: "",
                sector: ""
            }
        }); 
    }

    useEffect(() => {
        if (isSuccess) {
            if (download) {
                toast.success('Invoice successfully generated!');
            } else {
                toast.success('Invoice successfully saved');
            }
        } else if (isError) {
            const { message } = error.data;
            toast.error(message);
        }
    }, [isSuccess, isError, error]);

    return (
        <>
         {isFetching ? (
        <FetchingPage />
      ) : (
         <ActionsPagesContainer title={'Add invoice'}
                subTitle={'Add/Update invoice'}
                actionsContainer={<AddComponent component={
                    <div className="grid grid-cols-1 gap-y-10 pb-10">
                    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 h-fit list-none items-center">
                        <li>
                            <p className="mb-1">Invoice No</p>
                            <input  type="text" name="invoiceNo" value={invoiceInfo.invoiceNo ||''} className="focus:outline-none p-2 border rounded-lg w-full" onChange={handleChange} />
                        </li>
                        {/* ******* */}
                        <li>
                            <p className="mb-1">Date of Issue</p>
                            <input  type="date" name="dateOfIssue" value={invoiceInfo.dateOfIssue ||''} className="focus:outline-none p-2 border rounded-lg w-full" onChange={handleChange} />
                        </li>
                        {/* ******* */}
                        <li>
                            <p className="mb-1">Beneficiary</p>
                            <input  type="text" name="beneficiary" value={invoiceInfo.beneficiary ||''} className="focus:outline-none p-2 border rounded-lg w-full" onChange={handleChange} />
                        </li>
                        {/* ******* */}
                        <li>
                            <p className="mb-1">Supplier Company Name</p>
                            <input  type="text" name="supplierCompanyName" value={invoiceInfo.supplierCompanyName ||''} className="focus:outline-none p-2 border rounded-lg w-full" onChange={handleChange} />
                        </li>
                        {/* ******* */}
                        <li>
                            <p className="mb-1">Processor Company Name</p>
                            <input  type="text" name="processorCompanyName" value={invoiceInfo.processorCompanyName ||''} className="focus:outline-none p-2 border rounded-lg w-full" onChange={handleChange} />
                        </li>
                        {/* ******* */}
                        <li>
                            <p className="mb-1">Province</p>
                            <input  type="text" name="supplierAddress.province" value={invoiceInfo.supplierAddress.province ||''} className="focus:outline-none p-2 border rounded-lg w-full" onChange={handleChange} />
                        </li>
                        {/* ******* */}
                        <li>
                            <p className="mb-1">District</p>
                            <input  type="text" name="supplierAddress.district" value={invoiceInfo.supplierAddress.district ||''} className="focus:outline-none p-2 border rounded-lg w-full" onChange={handleChange} />
                        </li>
                        {/* ******* */}
                        <li>
                            <p className="mb-1">Sector</p>
                            <input  type="text" name="supplierAddress.sector" value={invoiceInfo.supplierAddress.sector ||''} className="focus:outline-none p-2 border rounded-lg w-full" onChange={handleChange} />
                        </li>
                        {/* ******* */}
                        <li className="">
                            <p className="mb-1">Extra Notes</p>
                            <textarea name="extraNotes" value={invoiceInfo.extraNotes ||''} className="focus:outline-none p-2 border rounded-lg w-full" onChange={handleChange} />
                        </li>
                        {/* ******* */}
                    </ul>
                </div>
                }  Add={handleSubmit}
                Cancel={handleCancel}
                isloading={isLoading}/>}/>)}
        </>
        // <div className="grid grid-cols-1 gap-y-10 pb-10">
        //     <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 h-fit list-none items-center">
        //         <li>
        //             <p className="mb-1">Invoice No</p>
        //             <input  type="text" name="invoiceNo" value={invoiceInfo.invoiceNo} className="focus:outline-none p-2 border rounded-lg w-full" onChange={handleChange} />
        //         </li>
        //         {/* ******* */}
        //         <li>
        //             <p className="mb-1">Date of Issue</p>
        //             <input  type="date" name="dateOfIssue" value={invoiceInfo.dateOfIssue} className="focus:outline-none p-2 border rounded-lg w-full" onChange={handleChange} />
        //         </li>
        //         {/* ******* */}
        //         <li>
        //             <p className="mb-1">Beneficiary</p>
        //             <input  type="text" name="beneficiary" value={invoiceInfo.beneficiary} className="focus:outline-none p-2 border rounded-lg w-full" onChange={handleChange} />
        //         </li>
        //         {/* ******* */}
        //         <li>
        //             <p className="mb-1">Supplier Company Name</p>
        //             <input  type="text" name="supplierCompanyName" value={invoiceInfo.supplierCompanyName} className="focus:outline-none p-2 border rounded-lg w-full" onChange={handleChange} />
        //         </li>
        //         {/* ******* */}
        //         <li>
        //             <p className="mb-1">Processor Company Name</p>
        //             <input  type="text" name="processorCompanyName" value={invoiceInfo.processorCompanyName} className="focus:outline-none p-2 border rounded-lg w-full" onChange={handleChange} />
        //         </li>
        //         {/* ******* */}
        //         <li>
        //             <p className="mb-1">Province</p>
        //             <input  type="text" name="supplierAddress.province" value={invoiceInfo.supplierAddress.province} className="focus:outline-none p-2 border rounded-lg w-full" onChange={handleChange} />
        //         </li>
        //         {/* ******* */}
        //         <li>
        //             <p className="mb-1">District</p>
        //             <input  type="text" name="supplierAddress.district" value={invoiceInfo.supplierAddress.district} className="focus:outline-none p-2 border rounded-lg w-full" onChange={handleChange} />
        //         </li>
        //         {/* ******* */}
        //         <li>
        //             <p className="mb-1">Sector</p>
        //             <input  type="text" name="supplierAddress.sector" value={invoiceInfo.supplierAddress.sector} className="focus:outline-none p-2 border rounded-lg w-full" onChange={handleChange} />
        //         </li>
        //         {/* ******* */}
        //         <li>
        //             <p className="mb-1">Extra Notes</p>
        //             <textarea name="extraNotes" value={invoiceInfo.extraNotes} className="focus:outline-none p-2 border rounded-lg w-full" onChange={handleChange} />
        //         </li>
        //         {/* ******* */}
        //     </ul>
        //     <div>
        //         <button type="button" onClick={handleSubmit}>Submit</button>
        //         <button type="button" onClick={handleCancel}>Cancel</button>
        //     </div>
        // </div>
    )
}

export default AddInvoice;