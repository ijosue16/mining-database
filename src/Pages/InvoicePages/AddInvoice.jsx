import React, {useEffect, useState} from "react";
import {Checkbox, DatePicker, message, Modal, Table} from "antd";
import dayjs from "dayjs";
import ActionsPagesContainer from "../../components/Actions components/ActionsComponentcontainer";
import AddComponent from "../../components/Actions components/AddComponent";
import FetchingPage from "../FetchingPage";
import {useGenerateInvoiceMutation, useGetOneSupplierQuery, useGetUnsettledLotsQuery} from "../../states/apislice";
import { useParams } from "react-router-dom";
import PdfPreview from "../../components/PdfView";


const AddInvoice = () => {
    const {supplierId} = useParams();
    const [dataz, setDataz] = useState([]);
    const [generateInvoice, {data: response, isSuccess, isLoading, isError, error}] = useGenerateInvoiceMutation();
    const {data, isLoading: isFetching, isSuccess: isDone, isError: isProblem} = useGetOneSupplierQuery({supplierId});
    const {data: info, isLoading: isGetting, isSuccess: isComplete} = useGetUnsettledLotsQuery(supplierId);
    const [download, setDownload] = useState(false);
    const [showmodal, setShowmodal] = useState(false);
    const [selectedData, setSelectedData] = useState([]);
    const [invoiceInfo, setInvoiceInfo] = useState(
        {
            invoiceNo: "",
            dateOfIssue: "",
            beneficiary: "",
            supplierCompanyName: "",
            processorCompanyName: "",
            extraNotes: "",
            items: [{
                itemName: "",
                quantity: "",
                rmaFee: "",
                lotNumber: "",
                supplyDate: "",
                pricePerUnit: "",
                concentration: "",
                amount: ""
            }],
            supplierId: supplierId,
            supplierAddress: {
                province: "",
                district: "",
                sector: ""
            },

        }
    );
    const [accumulator, setAccumulator] = useState(0);


    useEffect(() => {
        if (selectedData) {
            setAccumulator(selectedData.reduce((acc, currentValue) => acc + currentValue.mineralPrice, 0));
        }
    }, [selectedData]);

    useEffect(() => {
        if (isDone) {

            const {supplier: sup} = data.data;
            setInvoiceInfo({
                ...invoiceInfo,
                supplierCompanyName: sup.companyName,
                processorCompanyName: "KANZAMIN LTD",
                supplierAddress: {
                    province: sup.address.province,
                    district: sup.address.district,
                    sector: sup.address.sector
                },
            })
        }
    }, [isDone]);

    useEffect(() => {
        if (isComplete) {
            const {lots} = info.data;
            setDataz(lots);
        }
    }, [isComplete]);


    const handleRowToggle = (record) => {
        if (selectedData.some((selected) => (selected._id && selected.lotNumber && selected.weightOut) === (record._id && record.lotNumber && record.weightOut))) {
            setSelectedData((prevSelectedData) =>
                prevSelectedData.filter((selected) => (selected._id && selected.lotNumber && selected.weightOut) !== (record._id && record.lotNumber && record.weightOut))
            );
        } else {
            setSelectedData((prevSelectedData) => [...prevSelectedData, record]);

        }

    };

    const columns = [
        {
            title: "Select",
            dataIndex: "select",
            key: "select",
            render: (_, record) => (
                <Checkbox
                    name="checkbox"
                    checked={
                        selectedData.length > 0 &&
                        selectedData.some((selected) => (selected._id && selected.lotNumber && selected.weightOut) === (record._id && record.lotNumber && record.weightOut))
                    }
                    onChange={() => handleRowToggle(record)}
                />
            ),
        },

        {
            title: "Supply date",
            dataIndex: "supplyDate",
            key: "supplyDate",
            sorter: (a, b) => a.supplyDate.localeCompare(b.supplyDate),
            render: (text) => <p>{dayjs(text).format("MMM DD,YYYY")}</p>,
        },
        {title: "Beneficiary", dataIndex: "beneficiary", key: "beneficiary"},
        {
            title: "weight out (KG)",
            dataIndex: "weightOut",
            key: "weightOut",

        },
        {
            title: "mineralGrade",
            dataIndex: "mineralGrade",
            key: "mineralGrade",

        },
        {
            title: "pricePerUnit",
            dataIndex: "priscePerUnit",
            key: "pricePerUnit",

        },
        {
            title: "Grade (%)",
            dataIndex: "mineralGrade",
            key: "mineralGrade",
        },
        {
            title: "Mineral Price",
            dataIndex: "mineralPrice",
            Key: "mineralPrice",
        },

        // {
        //   title: "Action",
        //   dataIndex: "action",
        //   key: "action",
        //   render: (_, record) => {
        //     const editable = isEditing(record);
        //     return (
        //       <>
        //         <div className="flex items-center gap-1">
        //           {editable ? (
        //             <div className="flex items-center gap-3">
        //               <FaSave
        //                 className=" text-xl"
        //                 onClick={() => save(record.index)}
        //               />
        //               <MdOutlineClose
        //                 className=" text-xl"
        //                 onClick={() => setEditRowKey("")}
        //               />
        //             </div>
        //           ) : (
        //             <BiSolidEditAlt
        //               className=" text-xl"
        //               onClick={() => edit(record)}
        //             />
        //           )}
        //         </div>
        //       </>
        //     );
        //   },
        // },
    ];

    const columns2 = [

        {
            title: "Supply date",
            dataIndex: "supplyDate",
            key: "supplyDate",
            sorter: (a, b) => a.supplyDate.localeCompare(b.supplyDate),
            render: (text) => <p>{dayjs(text).format("MMM DD,YYYY")}</p>,
        },
        {title: "Beneficiary", dataIndex: "beneficiary", key: "beneficiary"},
        {
            title: "weight out (KG)",
            dataIndex: "weightOut",
            key: "weightOut",

        },
        {
            title: "mineralGrade",
            dataIndex: "mineralGrade",
            key: "mineralGrade",

        },
        {
            title: "pricePerUnit",
            dataIndex: "priscePerUnit",
            key: "pricePerUnit",

        },
        {
            title: "Grade (%)",
            dataIndex: "mineralGrade",
            key: "mineralGrade",
        },
        {
            title: "Mineral Price",
            dataIndex: "mineralPrice",
            key: "mineralPrice",
        },

        // {
        //   title: "Action",
        //   dataIndex: "action",
        //   key: "action",
        //   render: (_, record) => {
        //     const editable = isEditing(record);
        //     return (
        //       <>
        //         <div className="flex items-center gap-1">
        //           {editable ? (
        //             <div className="flex items-center gap-3">
        //               <FaSave
        //                 className=" text-xl"
        //                 onClick={() => save(record.index)}
        //               />
        //               <MdOutlineClose
        //                 className=" text-xl"
        //                 onClick={() => setEditRowKey("")}
        //               />
        //             </div>
        //           ) : (
        //             <BiSolidEditAlt
        //               className=" text-xl"
        //               onClick={() => edit(record)}
        //             />
        //           )}
        //         </div>
        //       </>
        //     );
        //   },
        // },
    ];
    const sampleData = [
        {
            "_id": "64f7733179e840cf8052bc7a",
            "companyName": "DEMIKARU",
            "beneficiary": "Vincent",
            "supplyDate": "2023-09-05T00:00:00.000Z",
            "newId": "a1a036fd-9985-41b6-942e-ad1d33c40ce6",
            "lotNumber": 4,
            "weightOut": 100,
            "mineralGrade": null,
            "mineralPrice": null,
            "rmaFee": 12500,
            "paid": 0,
            "unpaid": null,
            "settled": false,
            "pricePerUnit": null
        },
        {
            "_id": "789",
            "companyName": "Company B",
            "beneficiary": "Jane Smith",
            "supplyDate": "2023-10-20",
            "newId": "101",
            "lotNumber": 5,
            "weightOut": 150,
            "mineralGrade": null,
            "mineralPrice": null,
            "rmaFee": 10000,
            "paid": 0,
            "unpaid": null,
            "settled": false,
            "pricePerUnit": null
        }
        // ... (rest of the sample data)
    ];

    const keyMap = {

        "weightOut": "quantity",
        "rmaFee": "rmaFee",
        "lotNumber": "lotNumber",
        "supplyDate": "supplyDate",
        "pricePerUnit": "pricePerUnit",
        "mineralGrade": "concentration",
        "mineralPrice": "amount",

    };


    const handleChange = (e) => {
        const {name, value} = e.target;

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
    const handleAddDate = (e) => {
        setInvoiceInfo((prevState) => ({
            ...prevState,
            dateOfIssue: dayjs(e).format("MMM/DD/YYYY"),
        }));
    };

    const itemConfirm = () => {
        const transformedData = selectedData.map(item => {
            const newItem = {};
            for (const key in item) {
                const newKey = keyMap[key] || key;
                newItem[newKey] = item[key];
            }
            return newItem;
        });

        setInvoiceInfo((prevState) => ({...prevState, items: transformedData}));
        setShowmodal(!showmodal);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = invoiceInfo;
        const response = await generateInvoice({body});
        const url = window.URL.createObjectURL(
            new Blob([response.data], {type: "application/pdf"})
        );
        window.open(url);
    };


    // const handleGenerate = async () => {
    //     const response = await generateClassReport(ClassId);

    //     const url = window.URL.createObjectURL(
    //       new Blob([response.data], { type: "application/pdf" })
    //     );
    //     window.open(url);
    //   };

    const handleCancel = () => {
        setInvoiceInfo({
            invoiceNo: "",
            dateOfIssue: "",
            beneficiary: "",
            supplierCompanyName: "",
            processorCompanyName: "",
            extraNotes: "",
            items: [{
                itemName: "",
                quantity: "",
                rmaFee: "",
                lotNumber: "",
                supplyDate: "",
                pricePerUnit: "",
                concentration: "",
                amount: ""
            }],
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
                return message.success('Invoice successfully generated!');
            } else {
                return message.success('Invoice successfully saved');
            }
        } else if (isError) {
            const {message: errorMessage} = error.data;
            return message.error(errorMessage);
        }
    }, [isSuccess, isError, error]);

    return (
        <>
            {isFetching ? (
                <FetchingPage/>
            ) : (
                <ActionsPagesContainer title={'Add invoice'}
                                       subTitle={'Add/Update invoice'}
                                       actionsContainer={<AddComponent component={
                                           <div className="grid grid-cols-1 gap-y-10 pb-10">
                                               <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 h-fit list-none items-center">
                                                   <li>
                                                       <p className="mb-1">Invoice No</p>
                                                       <input type="text" name="invoiceNo"
                                                              value={invoiceInfo.invoiceNo || ''}
                                                              className="focus:outline-none p-2 border rounded-lg w-full"
                                                              onChange={handleChange}/>
                                                   </li>
                                                   {/* ******* */}
                                                   <li>
                                                       <p className="mb-1">Date of Issue</p>
                                                       {/* <input  type="date" name="dateOfIssue" value={invoiceInfo.dateOfIssue ||''} className="focus:outline-none p-2 border rounded-lg w-full" onChange={handleChange} /> */}
                                                       <DatePicker
                                                           value={
                                                               invoiceInfo.dateOfIssue ? dayjs(invoiceInfo.dateOfIssue) : null
                                                           }
                                                           id="dateOfIssue"
                                                           name="dateOfIssue"
                                                           className=" focus:outline-none p-2 border rounded-md w-full"
                                                           onChange={handleAddDate}
                                                       />
                                                   </li>
                                                   {/* ******* */}
                                                   <li>
                                                       <p className="mb-1">Beneficiary</p>
                                                       <input type="text" name="beneficiary"
                                                              value={invoiceInfo.beneficiary || ''}
                                                              className="focus:outline-none p-2 border rounded-lg w-full"
                                                              onChange={handleChange}/>
                                                   </li>
                                                   {/* ******* */}
                                                   <li>
                                                       <p className="mb-1">Supplier Company Name</p>
                                                       <input type="text" name="supplierCompanyName"
                                                              value={invoiceInfo.supplierCompanyName || ''}
                                                              className="focus:outline-none p-2 border rounded-lg w-full"
                                                              onChange={handleChange}/>
                                                   </li>
                                                   {/* ******* */}
                                                   <li>
                                                       <p className="mb-1">Processor Company Name</p>
                                                       <input type="text" disabled name="processorCompanyName"
                                                              value={invoiceInfo.processorCompanyName || ''}
                                                              className="focus:outline-none p-2 border rounded-lg w-full"
                                                              onChange={handleChange}/>
                                                   </li>
                                                   {/* ******* */}
                                                   <li>
                                                       <p className="mb-1">Province</p>
                                                       <input type="text" name="supplierAddress.province"
                                                              value={invoiceInfo.supplierAddress.province || ''}
                                                              className="focus:outline-none p-2 border rounded-lg w-full"
                                                              onChange={handleChange}/>
                                                   </li>
                                                   {/* ******* */}
                                                   <li>
                                                       <p className="mb-1">District</p>
                                                       <input type="text" name="supplierAddress.district"
                                                              value={invoiceInfo.supplierAddress.district || ''}
                                                              className="focus:outline-none p-2 border rounded-lg w-full"
                                                              onChange={handleChange}/>
                                                   </li>
                                                   {/* ******* */}
                                                   <li>
                                                       <p className="mb-1">Sector</p>
                                                       <input type="text" name="supplierAddress.sector"
                                                              value={invoiceInfo.supplierAddress.sector || ''}
                                                              className="focus:outline-none p-2 border rounded-lg w-full"
                                                              onChange={handleChange}/>
                                                   </li>
                                                   {/* ******* */}
                                                   <li className=" col-span-full">
                                                       <button type="button" className="p-1 bg-orange-300 rounded"
                                                               onClick={() => setShowmodal(!showmodal)}>{selectedData.length > 0 ? "Add item " : "choose items"}</button>
                                                   </li>
                                                   {/* ******* */}
                                                   <li className=" col-span-full w-full">
                                                       {/* TABLE OF INVOICE */}
                                                       {selectedData.length > 0 ? (<>
                                                           <Table
                                                               className=" overflow-x-auto w-full bg-white rounded-lg"
                                                               dataSource={selectedData}
                                                               columns={columns2}
                                                               pagination={false}
                                                               rowKey="index"
                                                           />
                                                           <div
                                                               className="w-full p-3 flex justify-end gap-2 align-bottom">
                                                               <p className=" font-semibold text-lg">total: {accumulator}</p>
                                                               {/*<p>4000(dummy nbr)</p>*/}
                                                           </div>
                                                       </>) : null}
                                                   </li>
                                                   {/* ******* */}
                                                   <li className="col-span-full space-y-2">
                                                       <p className="mb-1">Extra Notes</p>
                                                       <textarea name="extraNotes" value={invoiceInfo.extraNotes || ''}
                                                                 className="focus:outline-none p-2 border rounded-lg w-full"
                                                                 onChange={handleChange}/>
                                                       <div className="w-full flex justify-end ">
                                                           <button
                                                               className="p-2 bg-orange-300 rounded text-end justify-items-end">Preview
                                                           </button>
                                                       </div>
                                                   </li>
                                                   {/* ******* */}
                                               </ul>
                                               <Modal
                                                   open={showmodal}
                                                   width={"100%"}
                                                   destroyOnClose
                                                   onOk={() => ""}
                                                   onCancel={itemConfirm}

                                                   footer={[]}
                                               >
                                                   <div className="w-full space-y-3">
                                                       <Table
                                                           className=" overflow-x-auto w-full bg-white rounded-lg mt-10"
                                                           dataSource={dataz}
                                                           columns={columns}
                                                           rowKey="index"
                                                       />
                                                       <button className=" bg-orange-300 p-2 rounded text-white"
                                                               onClick={itemConfirm}>Confirm
                                                       </button>
                                                   </div>

                                               </Modal>

                                           </div>
                                       } Add={handleSubmit}
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