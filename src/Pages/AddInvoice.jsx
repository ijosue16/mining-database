import React, {useEffect, useState} from "react";
import { Modal,Table } from "antd";
import ActionsPagesContainer from "../components/Actions components/ActionsComponentcontainer";
import AddComponent from "../components/Actions components/AddComponent";
import FetchingPage from "./FetchingPage";
import { useGenerateInvoiceMutation, useGetOneSupplierQuery, useGetUnsettledLotsQuery } from "../states/apislice";
import {toast} from "react-toastify";
import { ImSpinner2 } from "react-icons/im";
import { useParams } from "react-router-dom";
import { space } from "postcss/lib/list";


const AddInvoice = () => {
    const{supplierId}=useParams();
    const [ generateInvoice, { data:response,isSuccess, isLoading, isError, error } ] = useGenerateInvoiceMutation();
    const {data,isLoading:isFetching,isSuccess:isDone,isError:isProblem}=useGetOneSupplierQuery({supplierId});
    const {data:info,isLoading:isGetting,isSuccess:isComplete}=useGetUnsettledLotsQuery(supplierId);
    const [download, setDownload] = useState(false);
    const [showmodal, setShowmodal] = useState(false);
    const [invoiceInfo, setInvoiceInfo] = useState(
        {
            invoiceNo: "",
            dateOfIssue: "",
            beneficiary: "",
            supplierCompanyName: "",
            processorCompanyName: "",
            extraNotes: "",
            items: [],
            supplierId: supplierId,
            supplierAddress: {
                province: "",
                district: "",
                sector: ""
            },

        }
    );
    useEffect(() =>{
        if(isDone){
          
          const {supplier:sup}=data.data;
          console.log(sup);
          setInvoiceInfo({ ...invoiceInfo, supplierCompanyName: sup.companyName,processorCompanyName:sup.companyName,supplierAddress: {
            province: sup.address.province,
            district: sup.address.district,
            sector: sup.address.sector
        },})
        }
    },[isDone]);

 
        if(isComplete){
         console.log(info);
        }

        const columns = [
            {
                title: "Select",
                key: "select",
                render: (_, record) => (
                  <Checkbox
                    name="checkbox"
                    checked={
                      selectedData.length > 0 &&
                      selectedData.some((selected) => selected.index === record.index)
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
            { title: "Beneficiary", dataIndex: "beneficiary", key: "beneficiary" },
            {
              title: "weight out (KG)",
              dataIndex: "weightOut",
              key: "weightOut",
              editTable: true,
            },
            {
                title: "mineralGrade",
                dataIndex: "mineralGrade",
                key: "mineralGrade",
                editTable: true,
              },
            {
              title: "pricePerUnit",
              dataIndex: "priscePerUnit",
              key: "pricePerUnit",
              editTable: true,
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const body=invoiceInfo;
        const response = await generateInvoice({body});
        const url = window.URL.createObjectURL(
            new Blob([response.data], { type: "application/pdf" })
          );
          window.open(url);
        console.log(invoiceInfo);
    }
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
                        <li className=" col-span-full">
                            <button type="button" className="p-1 bg-orange-300 rounded" onClick={()=>setShowmodal(!showmodal)}>choose items</button>
                        </li>
                        <li className="col-span-full">
                            <p className="mb-1">Extra Notes</p>
                            <textarea name="extraNotes" value={invoiceInfo.extraNotes ||''} className="focus:outline-none p-2 border rounded-lg w-full" onChange={handleChange} />
                        </li>
                        {/* ******* */}
                    </ul>
                    <Modal
              open={showmodal}
              width={"100%"}
              destroyOnClose
              onOk={() =>""}
              onCancel={() => {
                setShowmodal(!showmodal)
              }}
             
              footer={[
            
              ]}
            >
                 <Table
                      className=" overflow-x-auto w-full bg-white rounded-lg mt-10"
                      dataSource={""}
                      columns={columns}
                     
                      pagination={false}

                      rowKey="index"
                    />
              
            </Modal>
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