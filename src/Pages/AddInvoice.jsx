import React, {useEffect, useState} from "react";
import { useGenerateInvoiceMutation } from "../states/apislice";
import {toast} from "react-toastify";


const AddInvoice = () => {
    const [ generateInvoice, { isSuccess, isLoading, isError, error } ] = useGenerateInvoiceMutation();
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
            }
        }
    );

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
        <div className="grid grid-cols-1 gap-y-10 pb-10">
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 h-fit list-none items-center">
                <li>
                    <p className="mb-1">Invoice No</p>
                    <input  type="text" name="invoiceNo" value={invoiceInfo.invoiceNo} className="focus:outline-none p-2 border rounded-lg w-full" onChange={handleChange} />
                </li>
                {/* ******* */}
                <li>
                    <p className="mb-1">Date of Issue</p>
                    <input  type="date" name="dateOfIssue" value={invoiceInfo.dateOfIssue} className="focus:outline-none p-2 border rounded-lg w-full" onChange={handleChange} />
                </li>
                {/* ******* */}
                <li>
                    <p className="mb-1">Beneficiary</p>
                    <input  type="text" name="beneficiary" value={invoiceInfo.beneficiary} className="focus:outline-none p-2 border rounded-lg w-full" onChange={handleChange} />
                </li>
                {/* ******* */}
                <li>
                    <p className="mb-1">Supplier Company Name</p>
                    <input  type="text" name="supplierCompanyName" value={invoiceInfo.supplierCompanyName} className="focus:outline-none p-2 border rounded-lg w-full" onChange={handleChange} />
                </li>
                {/* ******* */}
                <li>
                    <p className="mb-1">Processor Company Name</p>
                    <input  type="text" name="processorCompanyName" value={invoiceInfo.processorCompanyName} className="focus:outline-none p-2 border rounded-lg w-full" onChange={handleChange} />
                </li>
                {/* ******* */}
                <li>
                    <p className="mb-1">Province</p>
                    <input  type="text" name="supplierAddress.province" value={invoiceInfo.supplierAddress.province} className="focus:outline-none p-2 border rounded-lg w-full" onChange={handleChange} />
                </li>
                {/* ******* */}
                <li>
                    <p className="mb-1">District</p>
                    <input  type="text" name="supplierAddress.district" value={invoiceInfo.supplierAddress.district} className="focus:outline-none p-2 border rounded-lg w-full" onChange={handleChange} />
                </li>
                {/* ******* */}
                <li>
                    <p className="mb-1">Sector</p>
                    <input  type="text" name="supplierAddress.sector" value={invoiceInfo.supplierAddress.sector} className="focus:outline-none p-2 border rounded-lg w-full" onChange={handleChange} />
                </li>
                {/* ******* */}
                <li>
                    <p className="mb-1">Extra Notes</p>
                    <textarea name="extraNotes" value={invoiceInfo.extraNotes} className="focus:outline-none p-2 border rounded-lg w-full" onChange={handleChange} />
                </li>
                {/* ******* */}
            </ul>
            <div>
                <button type="button" onClick={handleSubmit}>Submit</button>
                <button type="button" onClick={handleCancel}>Cancel</button>
            </div>
        </div>
    )
}

export default AddInvoice;